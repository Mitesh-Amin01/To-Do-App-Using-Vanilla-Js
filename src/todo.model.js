const todosObj = (taskName, endTaskDate) => {
    return {
        name: taskName,
        endDate: endTaskDate,
        completed: false,
    };
};
export default todosObj