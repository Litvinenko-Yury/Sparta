var btnSliderReview = document.querySelector(".btn--slider-review");
var sliderDescr = document.querySelector(".slider__descr");

/*если JS есть, в slider показывать часть текста*/
sliderDescr.classList.remove("slider__descr--shown");

/*показ/скрытие части текста в slider*/
btnSliderReview.addEventListener("click", function () {
  sliderDescr.classList.toggle("slider__descr--shown");
});
