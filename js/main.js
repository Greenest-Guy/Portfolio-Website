(function () {
  "use strict";

  var hero = document.getElementById("hero");
  var header = document.getElementById("siteHeader");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ticking = false;

  function onScroll() {
    var vh = window.innerHeight;
    var y = window.scrollY;

    if (hero) {
      var opacity = Math.max(0, 1 - y / (vh * 0.85));
      hero.style.opacity = opacity;
      hero.style.visibility = opacity === 0 ? "hidden" : "visible";
    }

    if (header && !header.classList.contains("always-on")) {
      header.classList.toggle("is-visible", y > vh * 0.6);
    }

    ticking = false;
  }

  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  onScroll();

  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
