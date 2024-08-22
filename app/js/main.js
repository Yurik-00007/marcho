$(function () {
  $('.top-slider__inner').slick({
    dots:true,
    arrows: false,
    fade: true,
    autoplay:true,
    autoplaySpeed: 2000,
    pauseOnHover:true,
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
})
