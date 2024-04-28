document.addEventListener("DOMContentLoaded", function () {
  var mySwiper = new Swiper(".swiper-container", {
    direction: "horizontal", // or 'vertical'
    loop: true,
    centeredSlides: true,

    // If we need pagination
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      dynamicBullets: true,
    },

    // Navigation arrows
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },

    // Autoplay
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },

    // Use slide or fade transition effect
    speed: 2000,
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
  });
});

// init Isotope
let $grid = $(".grid").isotope({
  // options
});
// filter items on button click
$(".filter-button-group").on("click", "li", function () {
  let filterValue = $(this).attr("data-filter");
  $grid.isotope({ filter: filterValue });
});

const ikinciFilter = document.querySelector(".ikinci_filter");
let flowers;
const basketItemsList = document.querySelector("#basketItemsList");
const basketItems = [];

if (localStorage.getItem("flowers")) {
  flowers = JSON.parse(localStorage.getItem("flowers"));
} else {
  flowers = [];
  localStorage.setItem("flowers", JSON.stringify(flowers));
}

fetch("./api.json")
  .then((resp) => resp.json())
  .then((data) => {
    renderUI(data);
  });

function renderUI(item) {
  ikinciFilter.innerHTML = "";
  for (let i = 0; i < item.length; i++) {
    ikinciFilter.innerHTML += `
        <div class="col-lg-3 * ${item[i].category}">
            <img src="${item[i].img}" alt="">
            <span>${item[i].name}</span> <br>
            <div>            
            <span> $${item[i].price}</span>
            <button onclick="addToBasket(${item[i].id}) "><i class="fa-solid fa-bag-shopping"  ></i></button>
            </div>
        </div>
        `;
  }
}

function renderBasket(basketItems) {
  basketItemsList.innerHTML = "";
  for (let i = 0; i < basketItems.length; i++) {
    basketItemsList.innerHTML += `
      <tr>
      <th scope="row"><img src="${basketItems[i].img}" alt="" width="50px" height="60px"></th>
      <td>${basketItems[i].name}</td>
      <td>$259</td>
      <td><button style="border: none; color: #f34f3f;" onclick="removeFromBasket(${basketItems[i].id}) "><i class="fa-regular fa-trash-can"></i> </button></td>
    </tr>
      `;
  }
}

function addToBasket(id) {
  fetch("./api.json")
    .then((resp) => resp.json())
    .then((data) => {
      const target = data.find((flowers) => flowers.id == id);
      flowers.push(target);
      localStorage.setItem("flowers", JSON.stringify(flowers));
      renderBasket(flowers);
      flowersLenghtNum();
    });
}
renderBasket(flowers);

function removeFromBasket(id) {
  fetch("./api.json")
    .then((resp) => resp.json())
    .then((data) => {
      const target = data.find((flowers) => flowers.id == id);
      const indexOfTarget = flowers.indexOf(target);

      flowers.splice(indexOfTarget, 1);

      localStorage.setItem("flowers", JSON.stringify(flowers));
      console.log(flowers);
      renderBasket(flowers);
      flowersLenghtNum();
    });
}

const flowersLenght = document.querySelector(".flowersLenght");

function flowersLenghtNum() {
  let sum = 0;
  for (let i = 0; i < flowers.length; i++) {
    sum += flowers[i].price;
  }

  flowersLenght.innerHTML = `Card($${sum})`;
}

flowersLenghtNum();
