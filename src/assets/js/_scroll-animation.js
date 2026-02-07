const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    rootMargin: "0px 0px -15% 0px",
  },
);

document.querySelectorAll("[data-scroll]").forEach(el => {
  observer.observe(el);
});
