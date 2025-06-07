import customRenderTasks from "./renderTask.component.js"

const renderWraper = () =>{
    const allUserData = customRenderTasks()
    allUserData.forEach(async (task) => { await task.checkBox ? completedTask.appendChild(task.component) : taskList.appendChild(task.component) })
}

export default renderWraper