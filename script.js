//header
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const menuDivider = document.getElementById("menuDivider");

menuBtn.addEventListener("click", () => {
  menuBtn.classList.toggle("x"); // Animação do ícone
  menuBtn.classList.toggle("animate-subtle-pop");

  const isOpen = !mobileMenu.classList.contains("hidden");

  if (isOpen) {
    // Fechar menu
    mobileMenu.classList.add("opacity-0", "scale-95");
    setTimeout(() => {
      mobileMenu.classList.add("hidden");
      menuDivider.classList.add("hidden");
    }, 200);
  } else {
    // Abrir menu
    mobileMenu.classList.remove("hidden");
    menuDivider.classList.remove("hidden");
    setTimeout(() => {
      mobileMenu.classList.remove("opacity-0", "scale-95");
    }, 10);
  }
});

// Fecha menu ao clicar em um link
document.querySelectorAll(".mobile-link").forEach((link) => {
  link.addEventListener("click", () => {
    menuBtn.classList.remove("x");
    mobileMenu.classList.add("opacity-0", "scale-95");
    setTimeout(() => {
      mobileMenu.classList.add("hidden");
      menuDivider.classList.add("hidden");
    }, 200);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("imageModal");
  const modalImage = document.getElementById("modalImage");
  const modalCounter = document.getElementById("modalCounter");
  const fullscreenBtn = document.getElementById("fullscreenBtn");
  const zoomBtn = document.getElementById("zoomBtn");
  const closeBtn = document.getElementById("closeBtn");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  const images = {
    reforma1: [
      "img/portifolio/imgBanheiro1.jpg",
      "img/portifolio/imgBanheiro2.jpg",
    ],
    reforma2: [
      "img/portifolio/imgPicina1.jpg",
      "img/portifolio/imgPicina2.jpg",
      "img/portifolio/imgPicina3.jpg",
    ],
    reforma3: [
      "img/portifolio/imgPisoBanheiro1.jpg",
      "img/portifolio/imgPisoBanheiro2.jpg",
      "img/portifolio/imgPisoBanheiro3.jpg",
      "img/portifolio/imgPisoBanheiro4.jpg",
      "img/portifolio/imgPisoBanheiro5.jpg",
      "img/portifolio/imgPisoBanheiro6.jpg",
    ],
    reforma4: ["img/portifolio/imgSala1.jpg", "img/portifolio/imgSala2.jpg"],
  };

  let currentGroup = [];
  let currentIndex = 0;
  let zoomed = false;

  document.querySelectorAll("[data-group]").forEach((el) => {
    el.addEventListener("click", () => {
      const group = el.getAttribute("data-group");
      if (!images[group]) return;

      currentGroup = images[group];
      currentIndex = 0;
      updateModal();
      modal.classList.remove("hidden");
      document.body.classList.add("overflow-hidden");
    });
  });

  // Fechar modal
  closeBtn.addEventListener("click", closeModal);

  function closeModal() {
    modal.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
    zoomed = false;
    modalImage.style.transform = "scale(1)";
    zoomBtn.querySelector("i").classList.remove("fa-search-minus");
    zoomBtn.querySelector("i").classList.add("fa-search-plus");
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    fullscreenBtn.querySelector("i").classList.remove("fa-compress");
    fullscreenBtn.querySelector("i").classList.add("fa-expand");
  }

  // Fechar com ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  // Navegar
  prevBtn.addEventListener("click", () => changeImage(-1));
  nextBtn.addEventListener("click", () => changeImage(1));

  function changeImage(direction) {
    // Fade out
    modalImage.classList.add("fade-out");

    setTimeout(() => {
      currentIndex =
        (currentIndex + direction + currentGroup.length) % currentGroup.length;
      updateModal();

      // Fade in
      modalImage.classList.remove("fade-out");
      modalImage.classList.add("fade-in");

      setTimeout(() => {
        modalImage.classList.remove("fade-in");
      }, 300);
    }, 300);

    resetZoom();
  }

  // Zoom
  zoomBtn.addEventListener("click", () => {
    zoomed = !zoomed;
    modalImage.style.transform = zoomed ? "scale(1.5)" : "scale(1)";
    zoomBtn.querySelector("i").classList.toggle("fa-search-minus", zoomed);
    zoomBtn.querySelector("i").classList.toggle("fa-search-plus", !zoomed);
  });

  function resetZoom() {
    zoomed = false;
    modalImage.style.transform = "scale(1)";
    zoomBtn.querySelector("i").classList.remove("fa-search-minus");
    zoomBtn.querySelector("i").classList.add("fa-search-plus");
  }

  // Fullscreen
  fullscreenBtn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      modal
        .requestFullscreen()
        .then(() => {
          fullscreenBtn.querySelector("i").classList.remove("fa-expand");
          fullscreenBtn.querySelector("i").classList.add("fa-compress");
        })
        .catch(console.error);
    } else {
      document.exitFullscreen().then(() => {
        fullscreenBtn.querySelector("i").classList.remove("fa-compress");
        fullscreenBtn.querySelector("i").classList.add("fa-expand");
      });
    }
  });

  // Atualiza modal
  function updateModal() {
    modalImage.src = currentGroup[currentIndex];
    modalCounter.textContent = `${currentIndex + 1} / ${currentGroup.length}`;
  }

  // Fechar ao clicar fora
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Swipe no mobile
  let startX = 0;
  modalImage.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });
  modalImage.addEventListener("touchmove", (e) => {
    if (!startX) return;
    let deltaX = e.touches[0].clientX - startX;
    if (deltaX > 50) {
      changeImage(-1);
      startX = 0;
    } else if (deltaX < -50) {
      changeImage(1);
      startX = 0;
    }
  });
});
