const addMenu = document.querySelector("#mobile-add");
const toggle = document.querySelector("#add-toggle");
const body = document.querySelector("body");

const toggleAddMenu = () => {
  if (addMenu.classList.contains("hidden")) {
    addMenu.classList.remove("hidden");
    addMenu.classList.add("flex");
    toggle.src = "/images/close.svg";
    if (window.innerWidth < 768) {
      body.classList.add("stop-scroll");
    }
  } else {
    addMenu.classList.add("hidden");
    addMenu.classList.remove("flex");
    toggle.src = "/images/plus.svg";
    if (window.innerWidth < 768) {
      body.classList.remove("stop-scroll");
    }
  }
};

const closeAddMenu = () => {
  if (!addMenu.classList.contains("hidden")) {
    addMenu.classList.add("hidden");
    addMenu.classList.remove("flex");
    toggle.src = "/images/plus.svg";
    if (window.innerWidth < 768) {
      body.classList.remove("stop-scroll");
    }
  }
};

const adjustScrollStop = () => {
  if (window.innerWidth > 768) {
    body.classList.remove("stop-scroll");
  }
  if (window.innerWidth < 768) {
    if (!addMenu.classList.contains("hidden")) {
      body.classList.add("stop-scroll");
    }
  }
};

const onClickOutside = (ele, cb) => {
  document.addEventListener("click", (event) => {
    if (!ele.contains(event.target) && !toggle.contains(event.target)) cb();
  });
};

toggle.addEventListener("click", toggleAddMenu);
window.addEventListener("resize", adjustScrollStop);
addMenu.addEventListener("click", closeAddMenu);
onClickOutside(addMenu, closeAddMenu);
