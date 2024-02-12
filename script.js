"use strict";

let title = document.querySelector(".kitty-content h1");
let description = document.querySelector(".kitty-content div");
let image = document.querySelector("section .image-container .main-image");
const btn = document.querySelector(".kitty-content button");
const saveBtn = document.querySelector(".buttons-container .save");
const saveBtnMobile = document.querySelector(
  ".kitty-selection .image-container .save"
);
const kittiesBtn = document.querySelector(".kitties-btn");
const kittiesBtnMobile = document.querySelector(".buttons-container .saved");
const homeBtn = document.querySelector(".kitties-home");
const logo = document.querySelector(".logo-mobile");
const popupMenu = document.querySelector(".popup-menu");
const popupMenuBtn = document.querySelector(".burger");
const popupMenuClose = document.querySelector(".popup-menu .popup-close");
const key = "live_UQFaferEMSonsGiiekcnt3Slcrhst9IullMu4bUOjhgRn78uTu2EJDWiDN1REhAN";
const url = `https://api.thecatapi.com/v1/breeds`;

/* Fetch */
btn.addEventListener("click", function () {
  let randomNumber = Math.floor(Math.random() * 66) + 1;

  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      headers: key,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data[randomNumber]);
      image.src = `https://cdn2.thecatapi.com/images/${data[randomNumber].reference_image_id}.jpg`;
      image.onload = function () {
        title.innerHTML = data[randomNumber].name;
        description.innerHTML = data[randomNumber].description;
      };
    });
});

/* On load */
document.onload = (function () {
  Swal.fire({
    title: 'Welcome to "Get your kitty"!',
    text: 'Click on the "pss" button to see a random cat!',
    confirmButtonText: "Okay 😸",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        text: 'You can save and see your cats clicking the saved button or in "my kitties" section!',
        confirmButtonText: "purrfect 🐱",
      });
    }
  });

  document.querySelector(".kitty-content button").click();
})();

/* Saving data in localStorage */
const saveKitty = function () {
  let kitty = {
    image: image.src,
    title: title.innerHTML,
    description: description.innerHTML,
  };

  if (localStorage.getItem("kitty") === null) {
    let kitties = [];
    kitties.push(kitty);
    localStorage.setItem("kitty", JSON.stringify(kitties));
    Swal.fire(
      "Kitty saved! 😺",
      'You can see your cats clicking the saved button or in "my kitties" section!',
      "success"
    );
  } else {
    let data = JSON.parse(localStorage.getItem("kitty"));
    let savedKitties = data.map((kitty) => kitty.image);
    if (savedKitties.includes(image.src)) {
      Swal.fire(
        "Kitty already saved! 🐱",
        'See it clicking the saved button or in "my kitties" section!',
        "info"
      );
    } else {
      data.push(kitty);
      localStorage.setItem("kitty", JSON.stringify(data));
      Swal.fire(
        "Kitty saved! 😺",
        'You can see your cats clicking the saved button or in "my kitties" section!',
        "success"
      );
    }
  }
};
saveBtn.addEventListener("click", saveKitty);
saveBtnMobile.addEventListener("click", saveKitty);

/* Load data from localStorage and show it to the user */

const loadKitties = function () {
  document.querySelector("section.kitties-section").style.display = "block";
  document.querySelector("section.kitty-selection").style.display = "none";
  if (
    localStorage.getItem("kitty") === null ||
    localStorage.getItem("kitty") === "[]"
  ) {
    document.querySelector(".kitties-container").innerHTML = `
      <div class='kitty-container'>
        <div class='kitty-content'>
          <h3>No kitties saved yet!</h3>
        </div>
      </div>
    
    `;
  } else {
    let kitties = JSON.parse(localStorage.getItem("kitty"));
    document.querySelector(".kitties-container").innerHTML = "";
    kitties.forEach(function (kitty) {
      let kittyDiv = document.createElement("div");
      kittyDiv.classList.add("kitty");
      kittyDiv.innerHTML = `
      <div class="kitty-image-container">
        <div class="kitty-image">
          <div class="kitty-delete" id='${kitty.title}'>
            <i class="fa-solid fa-xmark"></i>
          </div>
          <img src="${kitty.image}" alt="kitty">
        </div>
      </div>
      <div class="kitty-info">
        <h3>${kitty.title}</h3>
      </div>`;
      document.querySelector(".kitties-container").appendChild(kittyDiv);
    });
    btnDelete();
    saveBtn.style.display = "none";
  }
};

kittiesBtn.addEventListener("click", loadKitties);

kittiesBtnMobile.addEventListener("click", loadKitties);

/* Go back to the home and hide kitties */
const goHome = function () {
  document.querySelector("section.kitties-section").style.display = "none";
  document.querySelector("section.kitty-selection").style.display = "grid";
  saveBtn.style.display = "block";
};

homeBtn.addEventListener("click", goHome);

logo.addEventListener("click", goHome);

/* Function to Delete kitties from localStorage */
const btnDelete = function () {
  let kittyDeleteBtn = document.querySelectorAll(".kitty-delete");
  kittyDeleteBtn.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      Swal.fire({
        title: "You want to delete this kitty? 🙀",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, keep it!",
      }).then((result) => {
        if (result.value) {
          let title = e.target.parentElement.id;
          let data = JSON.parse(localStorage.getItem("kitty"));
          let newData = data.filter((kitty) => kitty.title !== title);
          localStorage.setItem("kitty", JSON.stringify(newData));
          e.target.parentElement.parentElement.parentElement.parentElement.remove();
          Swal.fire("Kitty deleted! 😿", "", "success");
        }
        if (!result.value) {
          Swal.fire("Your kitty is safe! 🐱", "", "info");
        }
      });
    });
  });
};

/* Show or hide popup menu */
popupMenuBtn.addEventListener("click", function () {
  let popupMenu = document.querySelector(".popup-menu");
  if (!popupMenu.classList.contains("active")) {
    popupMenu.style.animationName = "goRight";
    popupMenu.classList.add("active");
    popupMenuBtn.classList.add("active");
  } else {
    popupMenu.style.animationName = "goLeft";
    setTimeout(function () {
      popupMenu.classList.remove("active");
      popupMenuBtn.classList.remove("active");
    }, 100);
  }
});

popupMenuClose.addEventListener("click", function () {
  popupMenu.style.animationName = "goLeft";
  setTimeout(function () {
    popupMenu.classList.remove("active");
    popupMenuBtn.classList.remove("active");
  }, 100);
});
