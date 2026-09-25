(function () {
  var dock = document.querySelector(".dock");
  var end = document.querySelector("#download");
  if (!dock || !end || !("IntersectionObserver" in window)) return;

  var watcher = new IntersectionObserver(
    function (entries) {
      dock.classList.toggle("is-hidden", entries[0].isIntersecting);
    },
    { threshold: 0.35 }
  );
  watcher.observe(end);
})();
