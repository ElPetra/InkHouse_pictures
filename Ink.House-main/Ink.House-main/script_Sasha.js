
// получить данные из БД
import { data as art } from "./data.js";
let LS = window.localStorage;
let arr = [];
let caratogArt = document.querySelector('.catalogArt')
let cart = document.querySelector('.cart');
let modal = document.querySelector('.modal');
let closeBtn = document.querySelector('.modal__close');

// рендер карточки
renderCard(art)

if(LS.artBasket){
    getFromLS();
}

caratogArt.addEventListener('click', function(event){
    if(event.target.classList.contains('card__button')){
        event.target.classList.toggle("addBasket");
        
        if(event.target.classList.contains('addBasket')){
            event.target.textContent = 'Добавлено'
            setLS(event)

        } else {
            event.target.textContent = 'В корзину'
            delEl(event)
        }
    }
})

function setLS(event){
    let text = event.target.closest('.picture__info').querySelector('.picture__name').innerText;
    let price = event.target.closest('.picture__info').querySelector('.price').textContent;
    let obj = {
        title: text,
        price: price,
        isAtBasket: true,
    };
    arr.push(obj);
    LS.setItem("artBasket", JSON.stringify(arr));
    let circle = cart.querySelector('div');
    circle.classList.add('cart__number');
    circle.innerText = arr.length;
}

function delEl(event){
    let text = event.target.closest('.picture__info').querySelector('.picture__name').innerText;
    arr.splice(arr.findIndex((el) => el.title == text), 1);
    LS.setItem("artBasket", JSON.stringify(arr));

    let circle = cart.querySelector('div');
    if(arr.length){
        circle.classList.add('cart__number');
        circle.innerText = arr.length;
    } else {
        circle.classList.remove('cart__number');
        circle.innerText = '';
    }
}


// передать карточки из БД в карточки
function renderCard(data) {
    data.forEach(el => {
        createCard(el)
    });
}

// отобразить карточки на странице
function createCard(obj) {
    const container = document.querySelector('.catalogArt');
    // создаем карточку
    const card = document.createElement('article')
    card.className = 'card__picture'

    // создаем картинку
    const img = document.createElement('img')
    img.setAttribute("src", obj.image)
    img.className = 'picture'

    // создаем див подписи к картинке
    const card_text = document.createElement('div')
    card_text.className = 'picture__info'

    // добавляем информацию в текстовый блок
    card_text.innerHTML = `
    <p class="author"> ${obj.artist}</p>
    <p class="picture__name"> ${obj.title}</p>
    <p class="way">${obj.material}</p>
    <p class="price">${obj.price}</p>
    <button class="card__button ${(obj.isAtBasket) ? 'addBasket' : ''}">${(obj.isAtBasket) ? 'Добавлено' : 'В корзину'}</button>`

    container.append(card)  //выводим карточку
    card.append(img, card_text) //выводим картинку, текстовый блок
}

function getFromLS() {
    arr = JSON.parse(LS.getItem("artBasket"));

    let cards = document.querySelectorAll('.card__picture');
    for (let el of cards){
        if(arr.find(name => name.title == el.querySelector('.picture__name').innerText)){
            el.querySelector('.card__button').classList.add('addBasket');
            el.querySelector('.card__button').innerText = 'Добавлено';
        }
    }
    
    let circle = cart.querySelector('div');
    if(arr.length){
        circle.classList.add('cart__number');
        circle.innerText = arr.length;
    } else {
        circle.classList.remove('cart__number');
        circle.innerText = '';
    }
}

cart.addEventListener('click', function(){
    modal.classList.toggle('d-none');
})

closeBtn.addEventListener('click', function(){
    modal.classList.toggle('d-none');
})

