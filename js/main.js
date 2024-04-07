let elForm = document.querySelector(".todo-header__form");
let elInput = document.querySelector(".todo-input");
let elList = document.querySelector(".task-list");
let elTemplateTask = document.querySelector(".todo-task-template").content;
let LOCAL_KEY_PREFIX = "ADVANCED_TODO_LIST-";
let TODO_STORAGE_KEY = `${LOCAL_KEY_PREFIX}-todos`;
let todos = loadSaved() || [];
let warning = document.querySelector(".warning");
let elCompletedtemplate = document.querySelector(".completed-tasks").content;
let elCompletedList = document.querySelector(".task-list-completed");

let completeWarning = document.querySelector(".warning-completed");

todos.forEach((todo) => {
  renderTask(todo);
});

function updateWarning() {
  if (todos.length == 0) {
    warning.style.display = "block";
  } else {
    warning.style.display = "none";
  }
}

updateWarning();

function updateCompleted() {
  let completedTasksCount = todos.filter((item) => item.completed).length;

  if (completedTasksCount == 0) {
    completeWarning.style.display = "block";
  } else {
    completeWarning.style.display = "none";
  }
}
updateCompleted();

document.addEventListener("click", (e) => {
  if (!e.target.matches(".todo-complete")) return;
  let parent = e.target.closest(".task-todo");
  parent.querySelector(".todo-text").style.textDecoration = "line-through";

  let taskTodo = e.target.dataset.completeId;

  let task = todos.find((todo) => {
    return todo.id === taskTodo;
  });

  if (task) {
    task.completed = true;
    saveTask();
  }
  renderCompleted(todos);
});

document.addEventListener("click", (e) => {
  if (!e.target.matches(".todo-delete")) return;
  let taskId = e.target.dataset.deleteBtn;
  todos = todos.filter((todo) => todo.id !== taskId);
  let parent = e.target.closest(".task-todo");
  parent.remove();
  saveTask();
  updateWarning();
  updateCompleted();
  renderCompleted(todos);
});

elForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let inputValue = elInput.value.trim();
  if (!inputValue) return;
  let newTodo = {
    todoName: inputValue,
    completed: false,
    id: new Date().valueOf().toString(),
  };
  todos.push(newTodo);
  renderTask(newTodo);
  saveTask();
  elInput.value = "";
  updateWarning();
  updateCompleted();
  renderCompleted(todos);
});

function renderTask(newTodo) {
  elList.innerHTML = "";
  let cloneNode = elTemplateTask.cloneNode(true);
  cloneNode.querySelector(".todo-text").textContent = newTodo.todoName;
  cloneNode.querySelector(".todo-complete").dataset.completeId = newTodo.id;
  cloneNode.querySelector(".todo-delete").dataset.deleteBtn = newTodo.id;
  elList.appendChild(cloneNode);
  updateWarning();
  updateCompleted();
}

function saveTask() {
  localStorage.setItem(LOCAL_KEY_PREFIX, JSON.stringify(todos));
}

function loadSaved() {
  let todoString = localStorage.getItem(LOCAL_KEY_PREFIX);
  return JSON.parse(todoString);
}

function renderCompleted(todos) {
  elCompletedList.innerHTML = "";
  todos.forEach((item) => {
    if (item.completed) {
      let cloneNode = elCompletedtemplate.cloneNode(true);
      cloneNode.querySelector(".todo-text-completed").textContent =
        item.todoName;
      elCompletedList.appendChild(cloneNode);
    }
  });
}
renderCompleted(todos);
updateCompleted();
