

document.getElementById('app').innerHTML = `
    <h1>Todo App</h1>
    <form id="new-task-form">
        <input type="text" id="new-task-input">
        <button type="submit">Add Task</button>
    </form>
    <ul id="task-list"></ul>
`;

document.getElementById('new-task-form').addEventListener('submit', function(event) {
    event.preventDefault();
    var taskInput = document.getElementById('new-task-input');
    var taskList = document.getElementById('task-list');
    taskList.innerHTML += '<li>' + taskInput.value + '</li>';
    taskInput.value = '';
});