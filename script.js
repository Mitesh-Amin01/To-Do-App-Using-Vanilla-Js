const addForm = document.getElementById("taskForm");
const modal = document.getElementById("taskModal");
const addTaskBtn = document.getElementById("addTaskBtn");
const closeModal = document.getElementById("closeModal");
const taskList = document.getElementById("taskList");

const listOfTask = [];

const todosObj = (taskName, endTaskDate) => {
    return {
        name: taskName,
        endDate: endTaskDate,
        completed: false,
    };
};

// 👉 Show modal
addTaskBtn.onclick = function () {
    modal.style.display = "block";
};

// 👉 Hide modal
closeModal.onclick = function () {
    modal.style.display = "none";
};

// 👉 Close modal if clicking outside of it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

// 👉 Form submit
addForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskName = document.getElementById('taskName').value.trim();
    const endDate = document.getElementById('endDate').value;
    
    if (taskName && endDate) {
        const taskObject = todosObj(taskName, endDate);
        listOfTask.push(taskObject);
        renderTasks(); // ⬅️ RENDER AFTER UPDATE
        modal.style.display = "none";
        taskForm.reset();
        console.log("List Of Object:- ", listOfTask);
    }
});

// ✅ Render function
function renderTasks() {
    taskList.innerHTML = "";

    listOfTask.forEach((task, index) => {
        const li = document.createElement("li");
        li.className = "bg-white rounded-md border border-gray-200 flex items-center justify-between px-6 py-4";

        li.innerHTML = `
            <div class="flex items-center gap-4">
                <input 
                    type="checkbox" 
                    class="w-5 h-5 rounded border-gray-300" 
                    ${task.completed ? "checked" : ""} 
                    data-index="${index}" 
                />
                <span class="font-semibold text-sm">${task.name}</span>
            </div>
            <div class="flex items-center gap-8 text-gray-400 text-sm">
                <div class="flex items-center gap-2">
                    <i class="far fa-clock"></i>
                    <span>${task.endDate}</span>
                </div>
                <button aria-label="Edit ${task.name}" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-pencil-alt"></i>
                </button>
            </div>
        `;

        taskList.appendChild(li);
    });
}
renderTasks()