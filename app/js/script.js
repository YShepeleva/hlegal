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
