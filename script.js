import { completedTask, addForm, modal, addTaskBtn, closeModal, taskList, dynamicModalComponent } from './src/constant.js'
import todosObj from './src/todo.model.js';
import dynamicModal from './src/modal.js';
import customRenderTasks from './src/renderTask.component.js';
import localStorageMethod from './src/localStorageMethod.js';
import renderWraper from './src/renderWraper.js';

addTaskBtn.addEventListener('click', () => {
    dynamicModal("To-Do Task Add", "", "", "Add Task")
    dynamicModalComponent.style.display = "block";
})
renderWraper()