"use strict";
var popup_2 = document.querySelector(".modal-2__content");
var modalOverlay_2 = document.querySelector(".modal-2__overlay");
var formModal_2 = document.querySelector(".form--modal-2");
//var login = popup_2.querySelector("[name=name]");  /*находим input c name="name" внутри переменной popup_2 (это .modal-2__content, т.е. модальное окно, и записываем в переменную.) */
//var password = popup_2.querySelector("[name=tel]");  /*находим input c name="tel" внутри переменной popup_2 (это .modal-2__content, т.е. модальное окно, и записываем в переменную.) */
//var storage = localStorage.getItem("name");  /*взять значение из localStorage по ключу login и записать в переменную storage*/
var modal_2_Close = document.querySelector(".modal-2__close");


document.onclick = function (event) { /*1. вешаем единый обработчик на элемент document*/
  /*это нужно для того, что-бы много btn-modal-2-open можно было ставить в любом месте*/
  var target = event.target; /*2. где был клик?*/


  while (target != document) {
    if (target.classList.contains("btn-modal-2-open")) { /* 3. на .btn-modal-2-open? то, что надо!*/

      /*===события по кнопке "открыть модальное окно"===*/
      popup_2.classList.add("modal-2__content--show");
      modalOverlay_2.classList.add("modal-2__overlay--show");

      break;
    } else {/* 4. не на .btn-modal-2-open? нет, не подходит... */
      target = target.parentNode; /*5. поднимаем target на уровень вверх по иерархии родителей от event.target и выше*/
    }
    /* 6. Если клик был мимо burger, цикл дойдет вверх до document, и обработчик закончит работу*/
  };
};


/*=============================*/
/*===1-Закрыть модальное окно:===*/
/*события по нажатию на кнопку "закрыть"- т.е. "Х"*/
modal_2_Close.addEventListener("click", function (event) {
  event.preventDefault();
  popup_2.classList.remove("modal-2__content--show");
  modalOverlay_2.classList.remove("modal-2__overlay--show");
  popup_2.classList.remove("modal-2--error");
});


/*=============================*/
/*===2-Custom-валидации poupup===*/
var formModal_2 = document.querySelector(".form--modal-2");
var fieldName = document.querySelector(".field-text__input--name");
var fieldTel = document.querySelector(".field-text__input--tel");
var fieldText1 = document.querySelector(".field-text__input-wrap1");
var fieldText2 = document.querySelector(".field-text__input-wrap2");

formModal_2.addEventListener("submit", function (event) {
  //Каждый раз, когда пользователь пытается отправить данные, проверяем правильность поля "name".
  if (!fieldName.validity.valid) {
    // Если поле "name" не-валидно, добавляемм класс ошибки:
    fieldName.classList.add("field-text__input--error");
    fieldText1.classList.add("field-text__input-wrap1--after");

    // И отменяем отправку формы
    event.preventDefault();
  }

  //Каждый раз, когда пользователь пытается отправить данные, проверяем правильность поля "tel".
  if (!fieldTel.validity.valid) {
    // Если поле "tel" не-валидно, добавляемм класс ошибки:
    fieldTel.classList.add("field-text__input--error");
    fieldText2.classList.add("field-text__input-wrap2--after");

    // И отменяем отправку формы
    event.preventDefault();
  }
}, false);

fieldName.onfocus = function () {
  if (this.classList.contains("field-text__input--error")) {
    //удаляем индикатор ошибки, т.к. пользователь хочет ввести данные заново
    this.classList.remove("field-text__input--error");
    //удаляем псевдоэлемент с "Заполните поле", т.к. пользователь хочет ввести данные заново
    fieldText1.classList.remove("field-text__input-wrap1--after");
  }
};

fieldTel.onfocus = function () {
  if (this.classList.contains("field-text__input--error")) {
    //удаляем индикатор ошибки, т.к. пользователь хочет ввести данные заново
    this.classList.remove("field-text__input--error");
    //удаляем псевдоэлемент с "Заполните поле", т.к. пользователь хочет ввести данные заново
    fieldText2.classList.remove("field-text__input-wrap2--after");
  }
};
