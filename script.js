//получить данные из базы данных (экспортировать из файла)
import { data as art } from "./data.js";
//рендер карточки

let dataNew = art.filter((el) => el.country.toLocaleLowerCase() === "france");
let body = document.querySelector("body");
let home = document.querySelector(".home");
let btnsCountry = document.querySelectorAll(".country");
let catalogArt = document.querySelector(".catalogArt");
let modal = document.querySelector(".modal");
let binIcon = document.querySelector(".bin");
let LS = window.localStorage;
let arr = [];
let containerBasket = document.querySelector(".container__basket");
let modalResult = document.querySelector(".result");
let on_off = document.querySelector(".on-off");


let setIntoLS = (event) => {
  let artist = event.target.closest(".reproduction").querySelector(".painter").innerText;
  let title = event.target.closest(".reproduction").querySelector(".name").innerText;
  let material = event.target.closest(".reproduction").querySelector(".descr").innerText;
  let price = event.target.closest(".reproduction").querySelector(".price").innerText;
  let img = event.target.closest(".reproduction").querySelector(".picture").getAttribute("src");
  let obj = {
    artist: artist,
    title: title,
    material: material,
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

let delEl = (event) => {
  let title = event.target.closest(".reproduction").querySelector(".name").innerText;
  arr.splice(arr.findIndex((el) => el.title == title), 1);
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

//отобразить карточку на странице
let createCard = (obj) => {
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

//передать данные из базы данных в карточки
let renderCard = (data) => {
  data.forEach((el) => {createCard(el);
  });
}
renderCard(dataNew);

let getFromLS = () => {
  let cards = document.querySelectorAll(".reproduction");
  arr = JSON.parse(LS.getItem("artBasket"));
  for (let el of cards) {
    if (arr.find((name) => name.title == el.querySelector(".name").innerText)) {
      el.querySelector(".button_article").classList.add("button_added");
      el.querySelector(".button_article").innerText = "Добавлено";
    } else {
      el.querySelector(".button_article").classList.remove("button_added");
      el.querySelector(".button_article").innerText = "В корзину";
    }
  }
  changeNumberBasket();
}

let changeNumberBasket = () => {
  let numBasket = binIcon.querySelector("div");
  if (arr.length) {
    numBasket.classList.add("number__bin");
    numBasket.innerText = arr.length;
    createElBasket();
  } else {
    numBasket.classList.remove("number__bin");
    numBasket.innerText = "";
  }
}

let createElBasket = () => {
  containerBasket.innerHTML = "";
  arr = JSON.parse(LS.getItem("artBasket"));
  if (arr.length) {
    for (let el of arr) {
      let modalContent = document.createElement("div");
      modalContent.classList.add("position");
      modalContent.innerHTML = `
      <div class="position__left">
        <img class="picture__icon" src=${el.image} alt=${el.title} />
        <p class="descr descr_basket">${el.artist}</p>
        <p class="descr descr_basket title_basket">${el.title}</p>
        <p class="painter descr_basket">${el.material}</p>
      </div>
      <div class="position__right">
        <p class="descr descr_basket">${el.price}</p>
        <img class="basket" src="./src/images/basket.svg" alt="delete" />
      </div>`;
      let sum = arr.reduce((accum, item) => accum + parseInt(item.price), 0);
      modalResult.classList.add("result");
      modalResult.innerHTML = `<p class="descr descr_basket">Заказ на сумму: <span class="price price_final">${sum} руб.</span> </p>
      <div class="btns__result">
      <button class="button button_clear">Очистить корзину</button>
      <button class="button button_order">Оформить</button>
      </div>`;
      containerBasket.append(modalContent);
      modal.append(modalResult);
    }
  }
}

let deleteItem = (value) => {
  arr = JSON.parse(LS.getItem("artBasket"));
  let textItem = value.closest(".position").querySelector(".title_basket").innerText;
  let cards = value.closest("body").querySelectorAll(".name");
  for (let el of cards) {
    if (el.outerText == textItem) {
      let btn = el.closest(".reproduction").querySelector(".button_article");
      btn.classList.remove("button_added");
      btn.innerText = "В корзину";
    }
  }
  arr.splice(
  arr.findIndex((el) => el.title === textItem), 1);
  LS.setItem("artBasket", JSON.stringify(arr));
  value.closest(".position").remove();
  createElBasket();
  getFromLS();
};

let clearBasket = () => {
  arr = [];
  LS.clear();
  containerBasket.innerHTML = `<p class="name no-items">Ваша корзина пуста</p>`;
  modalResult.classList.add("d-none");
  changeNumberBasket();
  catalogArt.innerHTML = "";
  renderCard(art);
};

if (LS.artBasket) {
  getFromLS();
  arr = JSON.parse(LS.getItem("artBasket"));
  for (let el of arr) {
    createElBasket(el);
  }
}

home.addEventListener("click", refresh);
function refresh() {
  location.reload();
}

for (let el of btnsCountry) {
  el.addEventListener("click", function () {
    let btnId = el.getAttribute("id").toLowerCase();
    let newData = art.filter((el) => el.country.toLowerCase() === btnId);
    catalogArt.innerHTML = "";
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

catalogArt.addEventListener("click", function (event) {
  if (event.target.classList.contains("button_article")) {
    event.target.classList.toggle("button_added");
    if (event.target.classList.contains("button_added")) {
      event.target.innerText = "Добавлено";
      setIntoLS(event);
    } else {
      event.target.innerText = "В корзину";
      delEl(event);
    }
  }
});

modalResult.addEventListener("click", function (event) {
  if (event.target.classList.contains("button_clear")) {
    clearBasket();
  }
});

binIcon.addEventListener("click", function () {
  body.classList.toggle("body-bgr");
  modal.classList.remove("d-none");
  on_off.classList.add("d-none");
  if (arr.length == 0) {
    containerBasket.innerHTML = `<p class="name no-items">Ваша корзина пуста</p>`;
    modalResult.classList.add("d-none");
  } else {
    createElBasket();
    modalResult.classList.remove("d-none");
  }
});

modal.addEventListener("click", function (event) {
  if (event.target.classList.contains("cross")) {
    body.classList.toggle("body-bgr");
    modal.classList.add("d-none");
    on_off.classList.remove("d-none");
  } 
});

containerBasket.addEventListener("click", function (event) {
  if (event.target.classList == "basket") {
    deleteItem(event.target);
    if (arr.length == 0) {
      clearBasket();
    }
  }
});



