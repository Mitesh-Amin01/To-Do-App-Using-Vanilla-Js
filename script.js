const addForm = document.getElementById("taskForm");
const modal = document.getElementById("taskModal");
const addTaskBtn = document.getElementById("addTaskBtn");
const closeModal = document.getElementById("closeModal");

const listOfTask = []
const todosObj = (taskName, endTaskDate) => {
    return {
        name: taskName,
        endDate: endTaskDate
    }
}
addTaskBtn.onclick = function () {
    modal.style.display = "block";
}
closeModal.onclick = function () {
    modal.style.display = "none";
}

// Close modal when clicking outside of it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
addForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskObject = todosObj(document.getElementById('taskName').value, document.getElementById('endDate').value)
    listOfTask.push(taskObject)
    modal.style.display = "none";
    taskForm.reset();
    console.log("List Of Object:- ",listOfTask)
})