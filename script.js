import { addTaskBtn, dynamicModalComponent } from './src/constant.js';
import dynamicModal from './src/modal.js';
import renderWraper from './src/renderWraper.js';

addTaskBtn.addEventListener('click', () => {
    dynamicModal("To-Do Task Add", "", "", "Add Task")
    dynamicModalComponent.style.display = "block";
})
renderWraper()