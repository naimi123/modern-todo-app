// ===== State =====
let tasks = [];
let currentFilter = "all";

const STORAGE_KEY = "modern-todo-app:tasks";
const THEME_KEY = "modern-todo-app:theme";

// ===== DOM Elements =====
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const counter = document.getElementById("remaining-count");
const clearBtn = document.getElementById("clear-completed");
const themeToggle = document.getElementById("theme-toggle");
const filterBtns = document.querySelectorAll(".filter-btn");
const taskTemplate = document.getElementById("task-template");

// ===== Persistence =====
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasks() {
  try {
    tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    tasks = [];
  }
}

// ===== Theme =====
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
  localStorage.setItem(THEME_KEY, theme);
}

themeToggle.addEventListener("click", () => {
  const next =
    document.documentElement.getAttribute("data-theme") === "dark"
      ? "light"
      : "dark";
  applyTheme(next);
});

// ===== Render =====
function render() {
  const visible = tasks.filter((t) => {
    if (currentFilter === "active") return !t.completed;
    if (currentFilter === "completed") return t.completed;
    return true;
  });

  list.innerHTML = "";

  visible.forEach((task) => {
    const node = taskTemplate.content.cloneNode(true);
    const item = node.querySelector(".task-item");
    const checkbox = node.querySelector(".task-checkbox");
    const text = node.querySelector(".task-text");
    const deleteBtn = node.querySelector(".delete-btn");

    item.dataset.id = task.id;
    checkbox.checked = task.completed;
    text.textContent = task.text;
    if (task.completed) item.classList.add("completed");

    checkbox.addEventListener("change", () => toggleTask(task.id));
    deleteBtn.addEventListener("click", () => deleteTask(task.id));

    list.appendChild(node);
  });

  const remaining = tasks.filter((t) => !t.completed).length;
  counter.textContent = remaining;
}

// ===== Actions =====
function addTask(text) {
  const task = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    text: text.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
  };
  tasks.push(task);
  saveTasks();
  render();
}

function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    render();
  }
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  render();
}

// ===== Events =====
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value.trim()) {
    addTask(input.value);
    input.value = "";
    input.focus();
  }
});

clearBtn.addEventListener("click", () => {
  tasks = tasks.filter((t) => !t.completed);
  saveTasks();
  render();
});

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    render();
  });
});

// ===== Init =====
loadTasks();
applyTheme(localStorage.getItem(THEME_KEY) || "light");
render();
