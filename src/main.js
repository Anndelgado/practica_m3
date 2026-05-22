import "./style.css";

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask
} from "./api.js";

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const counter = document.getElementById("counter");
const filterButtons = document.querySelectorAll("[data-filter]");
const body = document.getElementById("body");
const themeToggle = document.getElementById("themeToggle");
const toggleCircle = document.getElementById("toggleCircle");

let tasks = [];
let currentFilter = sessionStorage.getItem("filter") || "all";
let darkMode = JSON.parse(localStorage.getItem("darkMode")) ?? true;

applyTheme();
updateActiveFilter();
loadTasks();

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
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

async function loadTasks() {
  try {
    tasks = await getTasks();
    tasks = tasks.map((task) => ({
      ...task,
      id: Number(task.id)
    })).filter((task) => !isNaN(task.id));
    renderTasks();
  } catch (error) {
    console.error("Error cargando tareas:", error);
  }
}

async function addTask() {
  const text = taskInput.value.trim();
  if (text === "") return;

  const maxId = tasks.length > 0
    ? Math.max(...tasks.map((task) => task.id))
    : 0;

  const newTask = {
    id: maxId + 1,
    title: text,
    completed: false
  };

  tasks.push(newTask);
  renderTasks();
  taskInput.value = "";

  try {
    await createTask(newTask);
  } catch (error) {
    console.error("Error creando tarea:", error);
    tasks = tasks.filter((t) => t.id !== newTask.id);
    renderTasks();
  }
}

async function toggleTask(task) {
  const updatedCompleted = !task.completed;
  task.completed = updatedCompleted;
  renderTasks();

  try {
    await updateTask(task.id, { completed: updatedCompleted });
  } catch (error) {
    console.error("Error actualizando tarea:", error);
    task.completed = !updatedCompleted;
    renderTasks();
  }
}

async function removeTask(id) {
  const prevTasks = [...tasks];
  tasks = tasks.filter((task) => task.id !== id);
  renderTasks();

  try {
    await deleteTask(id);
  } catch (error) {
    console.error("Error eliminando tarea:", error);
    tasks = prevTasks;
    renderTasks();
  }
}

function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks;

  if (currentFilter === "pending") {
    filteredTasks = tasks.filter((task) => !task.completed);
  } else if (currentFilter === "completed") {
    filteredTasks = tasks.filter((task) => task.completed);
  }

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");

    li.className = darkMode
      ? "bg-zinc-900 p-4 rounded-xl flex justify-between items-center transition shadow-lg"
      : "bg-white p-4 rounded-xl flex justify-between items-center transition shadow-lg text-black";

    if (task.completed) {
      li.classList.add("line-through", "opacity-50");
    }

    const span = document.createElement("span");
    span.className = "break-words max-w-[60%]";
    span.textContent = task.title;

    const completeBtn = document.createElement("button");
    completeBtn.type = "button";
    completeBtn.className =
      "complete-btn bg-green-600 hover:bg-green-700 text-white transition px-3 py-1 rounded-lg cursor-pointer shadow-md hover:scale-105";
    completeBtn.textContent = task.completed ? "Undo" : "Complete";
    completeBtn.addEventListener("click", () => toggleTask(task));

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className =
      "delete-btn bg-red-600 hover:bg-red-700 text-white transition px-3 py-1 rounded-lg cursor-pointer shadow-md hover:scale-105";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => removeTask(task.id));

    const btnDiv = document.createElement("div");
    btnDiv.className = "flex gap-2";
    btnDiv.appendChild(completeBtn);
    btnDiv.appendChild(deleteBtn);

    li.appendChild(span);
    li.appendChild(btnDiv);
    taskList.appendChild(li);
  });

  updateCounter();
}

function updateCounter() {
  const completedCount = tasks.filter((task) => task.completed).length;
  counter.textContent = `Completed: ${completedCount} / ${tasks.length}`;
}

function toggleTheme() {
  darkMode = !darkMode;
  localStorage.setItem("darkMode", JSON.stringify(darkMode));
  applyTheme();
  renderTasks();
}

function applyTheme() {
  const filterBtns = document.querySelectorAll(".filter-btn");

  if (darkMode) {
    body.className =
      "bg-zinc-950 text-white min-h-screen flex justify-center p-10 transition-colors duration-300";
    taskInput.className =
      "flex-1 p-3 rounded-xl outline-none transition bg-zinc-800 text-white";
    addBtn.className =
      "bg-violet-600 hover:bg-violet-700 text-white px-5 rounded-xl transition cursor-pointer shadow-lg hover:shadow-xl hover:scale-105";
    filterBtns.forEach((btn) => {
      btn.className =
        "filter-btn bg-zinc-800 text-white px-4 py-2 rounded-lg transition cursor-pointer shadow-lg hover:shadow-xl hover:scale-105";
    });
    themeToggle.classList.remove("bg-violet-600");
    themeToggle.classList.add("bg-zinc-700");
    toggleCircle.innerHTML = "🌙";
    toggleCircle.classList.remove("translate-x-8");
  } else {
    body.className =
      "bg-zinc-100 text-black min-h-screen flex justify-center p-10 transition-colors duration-300";
    taskInput.className =
      "flex-1 p-3 rounded-xl outline-none transition bg-white text-black shadow-lg";
    addBtn.className =
      "bg-violet-600 hover:bg-violet-700 text-black px-5 rounded-xl transition cursor-pointer shadow-lg hover:shadow-xl hover:scale-105";
    filterBtns.forEach((btn) => {
      btn.className =
        "filter-btn bg-white text-black px-4 py-2 rounded-lg transition cursor-pointer shadow-lg hover:shadow-xl hover:scale-105";
    });
    themeToggle.classList.remove("bg-zinc-700");
    themeToggle.classList.add("bg-violet-600");
    toggleCircle.innerHTML = "☀️";
    toggleCircle.classList.add("translate-x-8");
  }

  updateActiveFilter();

  body.classList.add("ready");
}

function updateActiveFilter() {
  filterButtons.forEach((button) => {
    if (darkMode) {
      button.className =
        "filter-btn bg-zinc-800 text-white px-4 py-2 rounded-lg transition cursor-pointer shadow-lg hover:shadow-xl hover:scale-105";
    } else {
      button.className =
        "filter-btn bg-white text-black px-4 py-2 rounded-lg transition cursor-pointer shadow-lg hover:shadow-xl hover:scale-105";
    }

    if (button.dataset.filter === currentFilter) {
      button.classList.remove("bg-zinc-800", "bg-white", "text-black");
      button.classList.add("bg-violet-600", "text-white", "ring-2", "ring-violet-400");
    }
  });
}