import { taskList, completedTask } from "./constant.js";
import getLocalHostData from './localStorageMethod.js';
import dynamicModal from './modal.js';
import { dynamicModalComponent } from './constant.js';
import renderWraper from './renderWraper.js';

const customRenderTasks = () => {
    taskList.innerHTML = "";
    completedTask.innerHTML = "";

    const localHostUserData = getLocalHostData.getLocalStorageData();
    const components = [];

    if (localHostUserData.length === 0) return components;

    localHostUserData.forEach((task, index) => {
        const li = document.createElement("li");
        li.className = "bg-white rounded-md border border-gray-200 flex items-center justify-between px-6 py-4";

        li.innerHTML = `
            <div class="flex items-center gap-4">
                <input 
                    type="checkbox" 
                    class="w-5 h-5 rounded border-gray-300 checkBox" 
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
                <button aria-label="${task.completed ? "Delete" : "Edit"} ${task.name}" class="text-gray-500 hover:text-gray-700">
                    <i class="fas ${!task.completed ? "fa-pencil-alt editBtn" : "fa-trash-alt deleteBtn"}" data-index="${index}"></i>
                </button>
            </div>
        `;

        // ✅ Edit Button
        const editIcon = li.querySelector(".editBtn");
        if (editIcon) {
            editIcon.addEventListener("click", () => {
                dynamicModal("Edit Task", task.name, task.endDate, "Update Task", task);
                dynamicModalComponent.style.display = "block";
            });
        }

        // ✅ Delete Button
        const deleteIcon = li.querySelector(".deleteBtn");
        if (deleteIcon) {
            deleteIcon.addEventListener("click", () => {
                const updatedData = localHostUserData.filter((_, i) => i !== index);
                localStorage.setItem("userData", JSON.stringify(updatedData));
                renderWraper(); // re-render list
            });
        }

        // ✅ CheckBox - Mark as Completed/Uncompleted
        const checkBox = li.querySelector(".checkBox");
        if (checkBox) {
            checkBox.addEventListener("change", (e) => {
                localHostUserData[index].completed = e.target.checked;
                localStorage.setItem("userData", JSON.stringify(localHostUserData));
                renderWraper(); // Refresh the task lists
            });
        }

        components.push({ component: li, checkBox: task.completed });
    });

    return components;
};

export default customRenderTasks;
