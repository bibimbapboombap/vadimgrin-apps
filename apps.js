/**
 * Just Apps landing — scroll reveal.
 *
 * Each .js-reveal section fades and settles into place as it reaches the
 * viewport, the same motion as the /consult pages. No dependencies.
 * The document already carries class "js" (set inline in the head) so the
 * CSS reveal rules only hide content when this can actually run.
 */
(function () {
    "use strict";

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var items = Array.prototype.slice.call(document.querySelectorAll(".js-reveal"));

    function show(el) { el.classList.add("is-visible"); }

    if (reduceMotion) {
        items.forEach(show);
        return;
    }

    // Reveal every item whose top has reached the lower ~90% of the viewport.
    // A plain rect check on scroll/resize/load — reliable everywhere, and it
    // settles itself once every item is shown.
    var ticking = false;

    function reveal() {
        ticking = false;
        var vh = window.innerHeight || document.documentElement.clientHeight || 0;
        var remaining = 0;
        items.forEach(function (el) {
            if (el.classList.contains("is-visible")) { return; }
            var r = el.getBoundingClientRect();
            if (vh > 0 && r.top < vh * 0.9 && r.bottom > 0) {
                show(el);
            } else {
                remaining++;
            }
        });
        if (remaining === 0) {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        }
    }

    function onScroll() {
        if (!ticking) {
            ticking = true;
            window.requestAnimationFrame(reveal);
        }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("load", reveal);

    // Run now, and again on the next couple of frames in case layout/viewport
    // size is not settled yet at first paint.
    reveal();
    window.requestAnimationFrame(reveal);
    window.setTimeout(reveal, 300);

    // Last-resort guarantee: nothing stays hidden for good.
    window.setTimeout(function () { items.forEach(show); }, 2500);
})();

/**
 * Auto-hiding nav — same behaviour as the vadimgrin.com homepage header.
 * Scrolling down (once the pill has reached its sticky position) slides it
 * away; any scroll up brings it back. Near the top it always shows.
 */
(function () {
    "use strict";

    var dock = document.querySelector(".nav-dock");
    if (!dock) { return; }

    var TOP_OFFSET = 48;   /* matches .nav-dock { top } */
    var TOLERANCE = 4;     /* ignore tiny moves, e.g. iOS rubber-banding */
    var last = window.scrollY || 0;
    var ticking = false;

    var masthead = document.querySelector(".masthead");

    function stickPoint() {
        /* Scroll position at which the dock becomes stuck. Measured from the
           masthead above it, not from the dock itself: on a sticky element
           offsetTop follows the stuck position, so it would always equal the
           current scroll and the nav could never hide. */
        var above = masthead
            ? masthead.getBoundingClientRect().bottom + window.scrollY
            : 0;
        var gap = parseFloat(window.getComputedStyle(dock).marginTop) || 0;
        return above + gap - TOP_OFFSET;
    }

    function update() {
        ticking = false;
        var current = Math.max(window.scrollY, 0);
        var delta = current - last;

        if (current <= stickPoint()) {
            dock.classList.remove("is-hidden");
        } else if (delta > TOLERANCE) {
            dock.classList.add("is-hidden");
        } else if (delta < -TOLERANCE) {
            dock.classList.remove("is-hidden");
        }

        if (Math.abs(delta) > TOLERANCE) { last = current; }
    }

    window.addEventListener("scroll", function () {
        if (!ticking) {
            ticking = true;
            window.requestAnimationFrame(update);
        }
    }, { passive: true });

    /* Keyboard users tabbing into a hidden nav should see it. */
    dock.addEventListener("focusin", function () {
        dock.classList.remove("is-hidden");
    });
})();
