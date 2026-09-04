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
