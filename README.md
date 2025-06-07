
# To-Do App Using Vanilla JavaScript

A modular, fully functional To-Do application built using Vanilla JavaScript, with support for adding, editing, deleting, and completing tasks. Tasks are saved in browser localStorage to persist across page reloads. The app uses ES modules and clean separation of concerns for maintainability.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [File-by-File Explanation](#file-by-file-explanation)
- [How To Run](#how-to-run)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

This project demonstrates how to build a robust To-Do list application using only Vanilla JS, HTML, and CSS. It leverages modern ES modules for better modularity and maintainability.

Users can:

- Add new tasks with a name and end date
- Edit existing tasks
- Delete tasks
- Mark tasks as completed/uncompleted via checkboxes
- Tasks are stored persistently in localStorage

The UI features a clean modal interface for adding and editing tasks and lists tasks separated into pending and completed sections.

---

## Features

- **Add Tasks:** Enter task name and end date in modal popup.
- **Edit Tasks:** Edit task details via modal.
- **Delete Tasks:** Remove completed tasks.
- **Mark Completed:** Toggle checkbox to mark tasks completed/uncompleted.
- **Data Persistence:** All data saved in `localStorage`.
- **Duplicate Prevention:** Prevent tasks with duplicate names.
- **Modular Code:** Separate concerns using ES modules.
- **Dynamic Rendering:** Tasks render dynamically based on status.
- **Responsive UI:** Styled with TailwindCSS and uses Font Awesome icons.

---

## Project Structure

```plaintext
root/
│
├── index.html                     # Main HTML entry point
├── style.css                     # Stylesheet (Tailwind CSS included)
├── script.js                     # Main JavaScript entry point
│
├── src/
│   ├── constant.js               # DOM element selectors exported
│   ├── localStorageMethod.js     # LocalStorage CRUD helper functions
│   ├── modal.js                  # Modal creation and form handling
│   ├── renderTask.component.js   # Task list item rendering and event handling
│   ├── renderWraper.js           # Wrapper to render completed and pending lists
│   └── todo.model.js             # Task object factory function
```

---

## File-by-File Explanation

### 1. `src/constant.js`

Exports commonly used DOM elements to avoid querying the DOM multiple times.

```js
const completedTask = document.getElementById('completedTask');
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const dynamicModalComponent = document.getElementById("dynamicModelForAddAndEdit");

export { completedTask, addTaskBtn, taskList, dynamicModalComponent };
```

- `completedTask`: Container for completed tasks
- `taskList`: Container for pending tasks
- `addTaskBtn`: Button to open the add-task modal
- `dynamicModalComponent`: Container for the modal popup

---

### 2. `src/localStorageMethod.js`

Handles reading and writing to localStorage, including duplicate task name prevention.

```js
const getLocalStorageData = () => {
    let data = localStorage.getItem("userData");
    return JSON.parse(data) || [];
};

const setLocalStorageData = (taskObject) => {
    const allTasks = getLocalStorageData();

    const duplicate = allTasks.some(task => task.name.toLowerCase() === taskObject.name.toLowerCase());
    if (duplicate) {
        alert(`Task with the name "${taskObject.name}" already exists. Please use a different name.`);
        return false;
    }

    allTasks.push(taskObject);
    localStorage.setItem("userData", JSON.stringify(allTasks));
    return true;
};

const setLocalStorageEditData = (beforeUpdateObj, afterUpdateObj) => {
    try {
        let allTasks = getLocalStorageData();

        // Prevent duplicate except the current task
        const duplicate = allTasks.some(task =>
            task.name.toLowerCase() === afterUpdateObj.name.toLowerCase() &&
            task.name.toLowerCase() !== beforeUpdateObj.name.toLowerCase()
        );
        if (duplicate) {
            alert(`Task with the name "${afterUpdateObj.name}" already exists. Please use a different name.`);
            return false;
        }

        const updatedTasks = allTasks.map(task => {
            if (task.name === beforeUpdateObj.name) {
                task.name = afterUpdateObj.name;
                task.endDate = afterUpdateObj.endDate;
            }
            return task;
        });

        localStorage.setItem("userData", JSON.stringify(updatedTasks));
        return true;
    } catch (error) {
        console.error("Error editing task in localStorage:", error);
        return false;
    }
};

export default { getLocalStorageData, setLocalStorageData, setLocalStorageEditData };
```

- `getLocalStorageData`: Reads tasks or returns an empty array
- `setLocalStorageData`: Adds new task if no duplicate
- `setLocalStorageEditData`: Updates task with duplicate name check

---

### 3. `src/modal.js`

Creates and manages the modal popup for adding/editing tasks.

```js
import { dynamicModalComponent } from './constant.js';
import localStorageFunc from './localStorageMethod.js';
import renderWraper from './renderWraper.js';
import todosObj from './todo.model.js';

const dynamicModal = (modalName, taskName = "", endDate = "", btnName = "Btn", taskObj = {}) => {
    dynamicModalComponent.innerHTML = ""; 
    dynamicModalComponent.style.display = "block";

    const div = document.createElement("div");
    div.className = "modal-content relative bg-white p-6 rounded-md shadow-lg max-w-md mx-auto mt-20";

    div.innerHTML = \`
        <span 
            class="close absolute top-2 right-4 text-2xl font-bold cursor-pointer text-gray-600 hover:text-black" 
            id="closeModal">&times;
        </span>
        <h2 class="font-bold text-xl mb-4">\${modalName}</h2>
        <form id="modalForm">
            <div class="mb-4">
                <label for="modalTaskName" class="block text-sm font-medium text-gray-700">Task Name</label>
                <input type="text" id="modalTaskName" value="\${taskName}" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-green-500" />
            </div>
            <div class="mb-4">
                <label for="modalDate" class="block text-sm font-medium text-gray-700">End Date</label>
                <input type="date" id="modalDate" value="\${endDate}" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-green-500" />
            </div>
            <button type="submit" class="bg-green-700 text-white px-4 py-2 rounded-md">\${btnName}</button>
        </form>
    \`;

    dynamicModalComponent.appendChild(div);

    // Close modal handler
    document.getElementById("closeModal").addEventListener("click", () => {
        dynamicModalComponent.style.display = "none";
    });

    // Form submit handler (Add or Edit)
    document.getElementById('modalForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const allTodos = localStorageFunc.getLocalStorageData();
        const taskName = document.getElementById('modalTaskName').value.trim();
        const taskEndDate = document.getElementById('modalDate').value;

        const existingTask = allTodos.find(t => t.name === taskObj.name);

        if (existingTask) {
            existingTask.name = taskName;
            existingTask.endDate = taskEndDate;

            const success = localStorageFunc.setLocalStorageEditData(taskObj, existingTask);
            if (success) {
                dynamicModalComponent.style.display = "none";
            } else {
                alert("Failed to update task.");
            }
            renderWraper();
        } else {
            const newTask = todosObj(taskName, taskEndDate);
            const success = localStorageFunc.setLocalStorageData(newTask);
            if (success) {
                dynamicModalComponent.style.display = "none";
                renderWraper();
            }
        }
    });
};

export default dynamicModal;
```

- Dynamically creates modal HTML content
- Handles close button and form submission
- Supports both adding new tasks and editing existing ones

---

### 4. `src/renderTask.component.js`

Renders tasks as list items and attaches event listeners for edit, delete, and complete toggle.

```js
import { taskList, completedTask } from "./constant.js";
import getLocalHostData from './localStorageMethod.js';
import dynamicModal from './modal.js';
import { dynamicModalComponent } from './constant.js';
import renderWraper from './renderWraper.js';

const customRenderTasks = () => {
    taskList.innerHTML = "";
    completedTask.innerHTML = "";

    const tasks = getLocalHostData.getLocalStorageData();
    if (tasks.length === 0) return [];

    return tasks.map((task, index) => {
        const li = document.createElement("li");
        li.className = "bg-white rounded-md border border-gray-200 flex items-center justify-between px-6 py-4";

        li.innerHTML = \`
            <div class="flex items-center gap-4">
                <input 
                    type="checkbox" 
                    class="w-5 h-5 rounded border-gray-300 checkBox" 
                    \${task.completed ? "checked" : ""}
                    data-index="\${index}"
                />
                <span class="font-semibold text-sm">\${task.name}</span>
            </div>
            <div class="flex items-center gap-8 text-gray-400 text-sm">
                <div class="flex items-center gap-2">
                    <i class="far fa-clock"></i>
                    <span>\${task.endDate}</span>
                </div>
                <button aria-label="\${task.completed ? "Delete" : "Edit"} \${task.name}" class="text-gray-500 hover:text-gray-700">
                    <i class="fas \${!task.completed ? "fa-pencil-alt editBtn" : "fa-trash-alt deleteBtn"}" data-index="\${index}"></i>
                </button>
            </div>
        \`;

        // Edit button click opens modal with task details
        const editIcon = li.querySelector(".editBtn");
        if (editIcon) {
            editIcon.addEventListener("click", () => {
                dynamicModal("Edit Task", task.name, task.endDate, "Update Task", task);
                dynamicModalComponent.style.display = "block";
            });
        }

        // Delete button removes task
        const deleteIcon = li.querySelector(".deleteBtn");
        if (deleteIcon) {
            deleteIcon.addEventListener("click", () => {
                const updatedTasks = tasks.filter((_, i) => i !== index);
                localStorage.setItem("userData", JSON.stringify(updatedTasks));
                renderWraper();
            });
        }

        // Checkbox toggles completed state
        const checkBox = li.querySelector(".checkBox");
        if (checkBox) {
            checkBox.addEventListener("change", (e) => {
                tasks[index].completed = e.target.checked;
                localStorage.setItem("userData", JSON.stringify(tasks));
                renderWraper();
            });
        }

        return { component: li, checkBox: task.completed };
    });
};

export default customRenderTasks;
```

- Clears task lists before rendering
- Dynamically creates `<li>` elements for each task with correct icons and handlers
- Handles edit, delete, and completion toggle interactions

---

### 5. `src/renderWraper.js`

Wrapper that renders pending and completed tasks in their respective sections.

```js
import customRenderTasks from "./renderTask.component.js";
import { completedTask, taskList } from './constant.js';

const renderWraper = () => {
    const allTasks = customRenderTasks();
    allTasks.forEach(taskObj => {
        if (taskObj.checkBox) {
            completedTask.appendChild(taskObj.component);
        } else {
            taskList.appendChild(taskObj.component);
        }
    });
};

export default renderWraper;
```

- Uses the `customRenderTasks` function to get task components
- Appends tasks to pending or completed task containers based on their state

---

### 6. `src/todo.model.js`

Factory function to create task objects.

```js
const todosObj = (taskName, endTaskDate) => ({
    name: taskName,
    endDate: endTaskDate,
    completed: false,
});

export default todosObj;
```

- Creates a consistent task object with default `completed: false`

---

## How To Run

1. Clone the repository:

```bash
git clone https://github.com/yourusername/todo-app-vanilla-js.git
cd todo-app-vanilla-js
```

2. Open `index.html` in your preferred browser. No server needed as it uses localStorage.

3. You can also use a live-server extension in VSCode or serve with `http-server` for convenience.

---

## Usage

- Click **Add Task** button to create a new task.
- Fill task name and end date in modal, submit to save.
- Use pencil icon to edit any pending task.
- Use trash icon to delete completed tasks.
- Toggle checkbox to mark completed/pending.
- Tasks persist in browser storage.

---

## Contributing

Feel free to fork and open pull requests. Please ensure code is clean and well commented.

---

## License

MIT License © 2025 Your Name

---

Thank you for checking out the project!  
If you want help setting up or enhancing the app, just ask.
