document.addEventListener('DOMContentLoaded', function () {
  new Swiper('.team--slider.swiper', {
    loop: true,
    autoplay: {
      delay: 4000,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  });
});

const toggle = document.querySelector('.header__menu-toggle');
const nav = document.querySelector('.header__nav');

toggle.addEventListener('click', () => {
  toggle.classList.toggle('header__menu-toggle--active');
  nav.classList.toggle('header__nav--active');
});

document.addEventListener('DOMContentLoaded', function () {
  const achievementsSlider = document.querySelector('.achievements--slider.swiper');
  if (achievementsSlider) {
    new Swiper(achievementsSlider, {
      loop: true,
      autoplay: {
        delay: 4000,
      },
      pagination: {
        el: '.achievements .swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
          spaceBetween: 16,
        },
        556: {
          slidesPerView: 2,
          spaceBetween: 40,
        },
        768: {
          slidesPerView: 4,
          spaceBetween: 40,
        },
      }
    });
  }
});

