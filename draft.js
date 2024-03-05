let deleteItem = (value) => {
  // arr = JSON.parse(LS.getItem("artBasket"));
  let textItem = value
    .closest(".position")
    .querySelector(".descr_basket").innerText;

  // let cards = value.closest("body").querySelectorAll(".name");
  // for (let el of cards) {
  //   if (el.outerText == textItem) {
  //     let btn = el.closest(".reproduction").querySelector(".button_article");
  //     btn.classList.remove("button_added");
  //     btn.innerText = "В корзину";
  //    }
  // }
  arr.splice(
    arr.findIndex((el) => el.title === textItem),
    1
  );
  LS.setItem("artBasket", JSON.stringify(arr));
  value.closest(".position").remove();
  createElBasket();
  getFromLS();
};
