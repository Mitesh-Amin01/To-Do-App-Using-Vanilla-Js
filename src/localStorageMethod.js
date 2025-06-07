const getLocalStorageData = () => {
    let localStorageUserTodoDate = localStorage.getItem("userData");
    let userTodoObj = JSON.parse(localStorageUserTodoDate) || [];
    return userTodoObj;
}

const setLocalStorageData = (taskObject) => {
    const allUserTodos = getLocalStorageData();

    // Check for duplicate task name (case-insensitive)
    const duplicate = allUserTodos.some(task => task.name.toLowerCase() === taskObject.name.toLowerCase());

    if (duplicate) {
        alert(`Task with the name "${taskObject.name}" already exists. Please use a different name.`);
        return false;
    }

    allUserTodos.push(taskObject);
    localStorage.setItem("userData", JSON.stringify(allUserTodos));
    return true;
}

const setLocalStorageEditData = (beforeUpdateObj, afterUpdateObj) => {
    try {
        let getAllTodo = getLocalStorageData();

        // Check if new name conflicts with any other existing task (excluding the task being edited)
        const duplicate = getAllTodo.some(task =>
            task.name.toLowerCase() === afterUpdateObj.name.toLowerCase() &&
            task.name.toLowerCase() !== beforeUpdateObj.name.toLowerCase()
        );

        if (duplicate) {
            alert(`Task with the name "${afterUpdateObj.name}" already exists. Please use a different name.`);
            return false;
        }

        let updatedTodoArray = getAllTodo.map((e) => {
            if (e.name === beforeUpdateObj.name) {
                e.name = afterUpdateObj.name;
                e.endDate = afterUpdateObj.endDate;
                return e;
            }
            return e;
        });

        localStorage.setItem("userData", JSON.stringify(updatedTodoArray));
        return true;
    } catch (error) {
        console.log("Edit Function Give Error:- ", error);
        return false;
    }
}

export default { getLocalStorageData, setLocalStorageData, setLocalStorageEditData };
