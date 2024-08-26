$(function () {
  $('.top-slider__inner').slick({
    dots: true,
    arrows: false,
    fade: true,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
  });
  Fancybox.bind("[data-fancybox]", {})
  $(".star").rateYo({
    rating: 4.6,        // Устанавливаем начальный рейтинг
    // Атрибут data-rateyo-rating используется для установки начального значения рейтинга через HTML.
    starWidth: "17px",  // Размер звезд
    normalFill: "#ccccce",   // Цвет или изображение для неактивных звезд.
    ratedFill: "#ffc35b", // Цвет или изображение для активных звезд.
    // fullStar: true,     // Разрешить только целые звезды
    readOnly: true  // Сделать рейтинг только для чтения
  });

  function getTimeRemaining(endtime) {
    const total = Date.parse(endtime) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    return {
      total,
      days,
      hours,
      minutes,
      seconds
    };
  }

  function initializeClock(id, endtime) {
    const clock = document.querySelector(`.promo__clock`);
    const daysSpan = clock.querySelector('.promo__days');
    const hoursSpan = clock.querySelector('.promo__hours');
    const minutesSpan = clock.querySelector('.promo__minutes');
    const secondsSpan = clock.querySelector('.promo__seconds');

    function updateClock() {
      const t = getTimeRemaining(endtime);
      daysSpan.innerHTML = t.days;
      hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
      minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
      secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

      if (t.total <= 0) {
        clearInterval(timeinterval);
      }
    }

    updateClock();
    const timeinterval = setInterval(updateClock, 1000);
  }

  const deadline = $('.promo__clock').attr('data-time');//new Date(Date.parse(new Date()) + 15 * 24 * 60 * 60 * 1000)
  // $('.promo__clock'): Эта часть кода использует jQuery для выбора HTML-элемента с классом promo__clock.
  // Библиотека jQuery облегчает работу с элементами DOM.
  // .attr('data-time'): После выбора элемента с классом promo__clock, этот метод attr извлекает значение атрибута
  // data-time у выбранного элемента. В HTML атрибуты, начинающиеся с data-, используются для хранения данных в элементах.
  // <div className="promo__clock" data-time="2024-08-30"></div>
  initializeClock('promo__clock', deadline);
})
