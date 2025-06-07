import { dynamicModalComponent } from './constant.js'
import localStorageFunc from './localStorageMethod.js';
import renderWraper from './renderWraper.js';
import todosObj from './todo.model.js';

const dynamicModal = (modalName, taskName = "", endDate = "", btnName = "Btn", taskObj = {}) => {
    console.log("Test Dyanamic Modal:- ", dynamicModalComponent);

    dynamicModalComponent.innerHTML = ""; 
    dynamicModalComponent.style.display = "block"; // Show modal container if hidden

    const div = document.createElement("div");
    div.className = "modal-content relative bg-white p-6 rounded-md shadow-lg max-w-md mx-auto mt-20";

    div.innerHTML = `
        <span 
            class="close absolute top-2 right-4 text-2xl font-bold cursor-pointer text-gray-600 hover:text-black" 
            id="closeModal">&times;
        </span>
        <h2 class="font-bold text-xl mb-4">${modalName}</h2>
        <form id="modalForm">
            <div class="mb-4">
                <label for="modalTaskName" class="block text-sm font-medium text-gray-700">Task Name</label>
                <input type="text" id="modalTaskName" value="${taskName}" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-green-500" />
            </div>
            <div class="mb-4">
                <label for="modalDate" class="block text-sm font-medium text-gray-700">End Date</label>
                <input type="date" id="modalDate" value="${endDate}" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-green-500" />
            </div>
            <button type="submit" class="bg-green-700 text-white px-4 py-2 rounded-md">${btnName}</button>
        </form>
    `;

    dynamicModalComponent.appendChild(div);

    // 🔴 Close Modal on Click
    document.getElementById("closeModal").addEventListener("click", () => {
        dynamicModalComponent.style.display = "none";
    });

    // ✅ Submit Event
    document.getElementById('modalForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const userAllTodos = localStorageFunc.getLocalStorageData();
        const taskName = document.getElementById('modalTaskName').value;
        const taskEndDate = document.getElementById('modalDate').value;

        let userToDoFind = userAllTodos.find(user => user.name === taskObj.name);
        if (userToDoFind) {
            userToDoFind.name = taskName;
            userToDoFind.endDate = taskEndDate;

            const editedFunction = localStorageFunc.setLocalStorageEditData(taskObj, userToDoFind);
            console.log("Test Value:- ", editedFunction);
            if (editedFunction) {
                dynamicModalComponent.style.display = "none";
            } else {
                alert("Something Went Wrong!!");
            }
            renderWraper();
        } else {
            console.log("New Task Created:", taskName, taskEndDate);
            const userTodo = todosObj(taskName, taskEndDate);
            localStorageFunc.setLocalStorageData(userTodo);
            dynamicModalComponent.style.display = "none";
            renderWraper();
        }
    });
};

export default dynamicModal;
