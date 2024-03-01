//получить данные из базы данных (экспортировать из файла)
import { data as art } from "./data.js";
//рендер карточки

let dataNew = art.filter((el) => el.country.toLocaleLowerCase() === "france");
renderCard(dataNew);
let body = document.querySelector("body");
let catalog = document.querySelector(".catalogArt");
let btnsCountry = document.querySelectorAll(".country");
let catalogArt = document.querySelector(".catalogArt");
let modal = document.querySelector(".modal");
let binIcon = document.querySelector(".bin");
let LS = window.localStorage;
let arr = [];
let container__basket = document.querySelector(".container__basket");
let modalResult = document.querySelector(".result");
let on_off = document.querySelector(".on-off");

if (LS.artBasket) {
  getFromLS();
  arr = JSON.parse(LS.getItem("artBasket"));
  for (let el of arr) {
    createElBasket(el);
  }
}

catalogArt.addEventListener("click", function (event) {
  if (event.target.classList.contains("button_article")) {
    event.target.classList.toggle("button_added");
    if (event.target.classList.contains("button_added")) {
      event.target.innerText = "Добавлено";
      setIntoLS(event);
      // createElBasket(el);
    } else {
      event.target.innerText = "В корзину";
      delEl(event);
    }
  }
});

let setIntoLS = (event) => {
  let title = event.target
    .closest(".reproduction")
    .querySelector(".name").innerText;
  let price = event.target
    .closest(".reproduction")
    .querySelector(".price").innerText;
  let img = event.target
    .closest(".reproduction")
    .querySelector(".picture")
    .getAttribute("src");
  let obj = {
    title: title,
    price: price,
    image: img,
    isAtBasket: true,
  };
  arr.push(obj);
  LS.setItem("artBasket", JSON.stringify(arr));
  let numBasket = binIcon.querySelector("div");
  numBasket.classList.add("number__bin");
  numBasket.innerText = arr.length;
};

function delEl(event) {
  let title = event.target
    .closest(".reproduction")
    .querySelector(".name").innerText;
  arr.splice(
    arr.findIndex((el) => el.title == title),
    1
  );
  LS.setItem("artBasket", JSON.stringify(arr));

  let numBasket = binIcon.querySelector("div");
  if (arr.length) {
    numBasket.classList.add("number__bin");
    numBasket.innerText = arr.length;
  } else {
    numBasket.classList.remove("number__bin");
    numBasket.innerText = "";
  }
}

for (let el of btnsCountry) {
  el.addEventListener("click", function () {
    let btnId = el.getAttribute("id").toLowerCase();
    let newData = art.filter((el) => el.country.toLowerCase() === btnId);
    catalog.innerHTML = "";
    renderCard(newData);
    for (let btn of btnsCountry) {
      btn.classList.remove("active");
    }
    el.classList.add("active");

    if (LS.artBasket) {
      getFromLS();
    }
  });
}

//передать данные из базы данных в карточки
function renderCard(data) {
  data.forEach((el) => {
    createCard(el);
  });
}

//отобразить карточку на странице
function createCard(obj) {
  //увязать с дивом для карточек
  const container = document.querySelector(".catalogArt");
  //создать карточку
  const card = document.createElement("article");
  //присвоить класс, на который есть уже верстка
  card.className = "reproduction";
  //создаем картинку
  const img = document.createElement("img");
  //присвоили класс картинке из верстки
  img.className = "picture";
  //устанавиливаем какой будет аттрибут у картинки - src и его адрес: obj.image
  img.setAttribute("src", obj.image);
  //создаем див для блока текста в карточке
  let card_text = document.createElement("div");
  card_text.className = "info";
  //добавляем информацию в текстовый блок
  card_text.innerHTML = `
    <p class="painter">${obj.artist}</p>
    <h3 class="name">${obj.title}</h3>
    <p class="descr">${obj.material}</p>
    <p class="price">${obj.price} руб</p>`;
  //разместить карточку в конце контейнера
  container.append(card);
  //добавить кнопку
  let btnNode = document.createElement("button");
  //присвоить кнопке класс
  btnNode.className = "button button_article";
  //задать надпись на кнопке
  btnNode.textContent = "В корзину";
  //разместить в карточке элементы: картинку, текстовый блок и кнопку
  card.append(img, card_text, btnNode);
}

function getFromLS() {
  arr = JSON.parse(LS.getItem("artBasket"));
  let cards = document.querySelectorAll("article");
  for (let el of cards) {
    if (arr.find((name) => name.title == el.querySelector(".name").innerText)) {
      el.querySelector(".button_article").classList.add("button_added");
      el.querySelector(".button_article").innerText = "Добавлено";
    }
  }
  let numBasket = binIcon.querySelector("div");
  if (arr.length) {
    numBasket.classList.add("number__bin");
    numBasket.innerText = arr.length;
  } else {
    numBasket.classList.remove("number__bin");
    numBasket.innerText = "";
  }
}

binIcon.addEventListener("click", function () {
  body.classList.toggle("body-bgr");
  modal.classList.remove("d-none");
  on_off.classList.add("d-none");
  if (arr.length == 0) {
    modal.innerHTML = `<div class="bin__title">
    <h2 class="title__block">Корзина</h2>
    <button class="modal__close">
      <img class="modal__img" src="./src/images/cross.svg" alt="cross" />
    </button>
    </div>
    <div class="container__basket">
    <p class="name no-items">Ваша корзина пуста</p>
    </div>`;
  } else {
    createElBasket();
  }
});

function createElBasket() {
  container__basket.innerHTML = "";
  arr = JSON.parse(LS.getItem("artBasket"));
  if (arr.length) {
    for (let el of arr) {
      let modalContent = document.createElement("div");
      modalContent.classList.add("position");
      modalContent.innerHTML = `
      <div class="position__left">
        <img class="picture__icon" src=${el.image} alt=${el.title} />
        <p class="descr descr_basket">${el.title}</p>
      </div>
      <div class="position__right">
        <p class="descr descr_basket">${el.price}</p>
        <img class="basket" src="./src/images/basket.svg" alt="delete" />
      </div>`;
      let sum = arr.reduce((accum, item) => accum + parseInt(item.price), 0);
      modalResult.classList.add("result");
      modalResult.innerHTML = `<p class="descr descr_basket">Заказ на сумму: <span class="price price_final">${sum} руб.</span> </p>
      <button class="button button_order">Оформить</button>`;
      container__basket.append(modalContent);
      modal.append(modalResult);
    }
  }
}

modal.addEventListener("click", function (event) {
  console.log("не хочу закрывать");
  event.preventDefault();
});

modal.addEventListener("click", function (event) {
  body.classList.toggle("body-bgr");
  event.target.classList.contains(".modal__img");
  modal.classList.add("d-none");
  on_off.classList.remove("d-none");
});

container__basket.addEventListener("click", function (event) {
  if (event.target.classList == "basket") {
    deleteItem(event.target);
  }
});

let deleteItem = (value) => {
  arr = JSON.parse(LS.getItem("artBasket"));
  let textItem = value
    .closest(".position")
    .querySelector(".descr_basket").innerText;

  let cards = value.closest("body").querySelectorAll(".name");
  console.log(cards);
  for (let el of cards) {
    if (el.outerText == textItem) {
      let btn = el.closest(".reproduction").querySelector(".button_article");
      btn.classList.remove("button_added");
      btn.innerText = "В корзину";
    }
  }
  arr.splice(
    arr.findIndex((el) => el.title === textItem),
    1
  );
  LS.setItem("artBasket", JSON.stringify(arr));
  value.closest(".position").remove();
  createElBasket();
  getFromLS();
};
