/* === To-do List === */
const projectName = "To-do List";

/*** ===== INTERACTIVITY ====== *****/
// Show add-task form;
const addTaskBtn = document.getElementById("add-task-btn");
const addListBtn = document.getElementById("add-list-btn");
const addForms = document.querySelectorAll(".form-container");
const formWrapper = document.querySelector(".form-wrapper");
const closeTaskBtns = document.querySelectorAll(".close-btn");

let visible = false;

addTaskBtn.addEventListener("click", (e) => {
  formWrapper.classList.add("visible");
  addForms[0].classList.add("visible");
  visible = true;
});

addListBtn.addEventListener("click", (e) => {
  formWrapper.classList.add("visible");
  addForms[1].classList.add("visible");
  visible = true;
});

addForms.forEach((form) => {
  form.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
});

formWrapper.addEventListener("click", (e) => {
  closeAddTask(e);
});

closeTaskBtns.forEach((closeTaskBtn) => {
  closeTaskBtn.addEventListener("click", (e) => {
    closeAddTask(e);
  });
});

// Close task form function
function closeAddTask(e) {
  if (visible) {
    console.log(e);
    formWrapper.classList.remove("visible");
    addForms.forEach((form) => {
      if (form.classList.contains("visible")) {
        form.classList.remove("visible");
      }
    });
    visible = false;
  }
}

/* ======= RESPONSIVNESS ======= */
let menuBtn = document.getElementById("menu-btn");
let menu = document.getElementById("menu");
menuBtn.addEventListener("click", () => {
  menu.classList.toggle("open");
  menu.classList.toggle("visible");
});

window.addEventListener("resize", responsive);

// Alternative to DOMContentLoaded event
document.onreadystatechange = () => {
  responsive();
};

// Make the nav menu responsive;
function responsive() {
  let w = window.innerWidth;
  if (w <= 850) {
    if (menu.classList.contains("open")) {
      menu.classList.remove("open");
    }
  } else if (w > 650) {
    if (!menu.classList.contains("open")) {
      menu.classList.add("open");
    }
  }
}

/* ===== TASK STATE ===== */
// When we push on the "task done" button;
let taskDone_btns = document.querySelectorAll(".done");
taskDone_btns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    let button = e.target;
    if (button.textContent == "Task done") {
      button.textContent = "Undo";
    } else {
      button.textContent = "Task done";
    }
    let task = e.target.parentElement;
    task.classList.toggle("completed");
  });
});

/*** ======= DYNAMISM ======= *****/
/*
* Our goal is to create a to do list;
* Expectations: 
-- We should be able to add and remove a task;
-- We should be able to group certain tasks in the same group (or remove the task in that group if needed);
-- The tasks should ordered by date, level of importance;
-- When app opened that day tasks should be visible;
-- When app opened the missed tasks should be red;
-- Optional: We should be able to see our accomplished/not accomplished tasks of the day;
*/

// All tasks;
let tasks = [];

class Task {
  constructor(name, desc, date, time, list) {
    this.name = name;
    this.desc = desc;
    this.date = date;
    this.time = time;
    this.list = list;
    this.status = false;
  }
  updateStatus() {
    this.status == true ? (this.status = false) : (this.status = true);
  }
}

// Unavailablo for some time, so I didn't do the forms yet;


