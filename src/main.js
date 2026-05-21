import "./style.css";

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const counter = document.getElementById("counter");

const filterButtons = document.querySelectorAll("[data-filter]");

const body = document.getElementById("body");

const themeToggle = document.getElementById("themeToggle");

const toggleCircle = document.getElementById("toggleCircle");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = sessionStorage.getItem("filter") || "all";

let darkMode = JSON.parse(localStorage.getItem("darkMode")) ?? true;

applyTheme();

updateActiveFilter();

renderTasks();

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTask();
  }
});

themeToggle.addEventListener("click", toggleTheme);

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;

    sessionStorage.setItem("filter", currentFilter);

    updateActiveFilter();

    renderTasks();
  });
});

function addTask() {
  const text = taskInput.value.trim();

  if (text === "") return;

  const newTask = {
    id: Date.now(),
    text,
    completed: false,
  };

  tasks.push(newTask);

  saveTasks();

  renderTasks();

  taskInput.value = "";
}

function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks;

  if (currentFilter === "pending") {
    filteredTasks = tasks.filter((task) => !task.completed);
  }

  if (currentFilter === "completed") {
    filteredTasks = tasks.filter((task) => task.completed);
  }

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");

    li.className = `
      bg-zinc-900
      p-4
      rounded-xl
      flex
      justify-between
      items-center
      transition
      shadow-lg
    `;

    if (task.completed) {
      li.classList.add("line-through", "opacity-50");
    }

    if (!darkMode) {
      li.classList.remove("bg-zinc-900");

      li.classList.add("bg-white");
    }

    li.innerHTML = `
      <span class="break-words max-w-[60%]">
        ${task.text}
      </span>

      <div class="flex gap-2">

        <button
          class="
            complete-btn
            bg-green-600
            hover:bg-green-700
            transition
            px-3
            py-1
            rounded-lg
            cursor-pointer
            shadow-md
            hover:scale-105
          "
        >
          ${task.completed ? "Undo" : "Done"}
        </button>

        <button
          class="
            delete-btn
            bg-red-600
            hover:bg-red-700
            transition
            px-3
            py-1
            rounded-lg
            cursor-pointer
            shadow-md
            hover:scale-105
          "
        >
          Delete
        </button>

      </div>
    `;

    const completeBtn = li.querySelector(".complete-btn");

    completeBtn.addEventListener("click", () => {
      toggleTask(task.id);
    });

    const deleteBtn = li.querySelector(".delete-btn");

    deleteBtn.addEventListener("click", () => {
      deleteTask(task.id);
    });

    taskList.appendChild(li);
  });

  updateCounter();
}

function toggleTask(id) {
  tasks = tasks.map((task) => {
    if (task.id === id) {
      return {
        ...task,
        completed: !task.completed,
      };
    }

    return task;
  });

  saveTasks();

  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);

  saveTasks();

  renderTasks();
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateCounter() {
  const completedTasks = tasks.filter((task) => task.completed).length;

  counter.textContent = `
    Completadas: ${completedTasks} / ${tasks.length}
  `;
}

function toggleTheme() {
  darkMode = !darkMode;

  localStorage.setItem("darkMode", JSON.stringify(darkMode));

  applyTheme();

  renderTasks();
}

function applyTheme() {
  const taskInput = document.getElementById("taskInput");

  const addBtn = document.getElementById("addBtn");

  const filterBtns = document.querySelectorAll(".filter-btn");

  if (darkMode) {
    body.className = `
      bg-zinc-950
      text-white
      min-h-screen
      flex
      justify-center
      p-10
      transition-colors
      duration-300
    `;

    taskInput.className = `
      flex-1
      p-3
      rounded-xl
      outline-none
      transition
      bg-zinc-800
      text-white
    `;

    addBtn.className = `
      bg-violet-600
      hover:bg-violet-700
      px-5
      rounded-xl
      transition
      cursor-pointer
      shadow-lg
      hover:shadow-xl
      hover:scale-105
    `;

    filterBtns.forEach((btn) => {
      btn.className = `
        filter-btn
        bg-zinc-800
        text-white
        px-4
        py-2
        rounded-lg
        transition
        cursor-pointer
        shadow-lg
        hover:shadow-xl
        hover:scale-105
      `;
    });

    themeToggle.classList.remove("bg-violet-600");

    themeToggle.classList.add("bg-zinc-700");

    toggleCircle.innerHTML = "🌙";

    toggleCircle.classList.remove("translate-x-8");
  } else {
    body.className = `
      bg-zinc-100
      text-black
      min-h-screen
      flex
      justify-center
      p-10
      transition-colors
      duration-300
    `;

    taskInput.className = `
      flex-1
      p-3
      rounded-xl
      outline-none
      transition
      bg-white
      text-black
      shadow-lg
    `;

    addBtn.className = `
      bg-violet-600
      hover:bg-violet-700
      text-black
      px-5
      rounded-xl
      transition
      cursor-pointer
      shadow-lg
      hover:shadow-xl
      hover:scale-105
    `;

    filterBtns.forEach((btn) => {
      btn.className = `
        filter-btn
        bg-white
        text-black
        px-4
        py-2
        rounded-lg
        transition
        cursor-pointer
        shadow-lg
        hover:shadow-xl
        hover:scale-105
      `;
    });

    themeToggle.classList.remove("bg-zinc-700");

    themeToggle.classList.add("bg-violet-600");

    toggleCircle.innerHTML = "☀️";

    toggleCircle.classList.add("translate-x-8");
  }

  updateActiveFilter();
}

function updateActiveFilter(){

  filterButtons.forEach((button) => {

    if(darkMode){

      button.className = `
        filter-btn
        bg-zinc-800
        text-white
        px-4
        py-2
        rounded-lg
        transition
        cursor-pointer
        shadow-lg
        hover:shadow-xl
        hover:scale-105
      `;

    }

    else{

      button.className = `
        filter-btn
        bg-white
        text-black
        px-4
        py-2
        rounded-lg
        transition
        cursor-pointer
        shadow-lg
        hover:shadow-xl
        hover:scale-105
      `;

    }

    if(button.dataset.filter === currentFilter){

      button.classList.remove(
        "bg-zinc-800",
        "bg-white",
        "text-black"
      );

      button.classList.add(
        "bg-violet-600",
        "text-white",
        "ring-2",
        "ring-violet-400"
      );

    }

  });

}
