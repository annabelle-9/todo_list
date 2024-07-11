document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('new-task');
    const addTaskButton = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');

    loadTasks();

    addTaskButton.addEventListener('click', addTask);
    taskList.addEventListener('click', handleTaskActions);

    function addTask() {
        const taskText = taskInput.value.trim();
            const listItem = createTaskElement(taskText);
    if (taskText) {
            taskList.appendChild(listItem);
            saveTasksToLocalStorage();
            taskInput.value = '';
        }
    }

    function handleTaskActions(e) {
        const target = e.target;
        const task = target.closest('li');

        if (target.classList.contains('edit')) {
            editTask(task);
        } else if (target.classList.contains('delete')) {
            deleteTask(task);
        } else if (target.classList.contains('complete')) {
            toggleCompleteTask(task);
        } else if (target.classList.contains('add-subtask')) {
            addSubtask(task);
        } else if (target.classList.contains('complete-subtask')) {
            toggleCompleteSubtask(target);
        }
        saveTasksToLocalStorage();
    }

    function createTaskElement(taskText) {
        const listItem = document.createElement('li');
        listItem.className = 'task';
        listItem.innerHTML = `
            <div class="task-header">
              <div>${taskText}</div>
              <button class="edit">Edit</button>
              <button class="delete">Delete</button>
              <button class="complete">Complete</button>
              <button class="add-subtask">Add Subtask</button>
            </div>
            <div class="subtask-container">
              <ul class="subtask-list"></ul>
            </div>
        `;
        return listItem;
    }

    function addSubtask(task) {
        const subtaskText = prompt('Enter subtask:');
        if (subtaskText) {
            const subtaskList = task.querySelector('.subtask-list');
            const subtaskItem = createSubtaskElement(subtaskText);
            subtaskList.appendChild(subtaskItem);
        }
    }

    function createSubtaskElement(subtaskText) {
        const subtaskItem = document.createElement('li');
        subtaskItem.className = 'subtask';
        subtaskItem.innerHTML = `
            <div class="subtask-text">${subtaskText}</div>
            <button class="complete-subtask">Complete</button>
        `;
        return subtaskItem;
    }

    function toggleCompleteTask(task) {
        const taskHeader = task.querySelector('.task-header')
        console.log(taskHeader)
        console.log(taskHeader.classList)
        taskHeader.classList.toggle('completed');
    }

    function toggleCompleteSubtask(button) {
        const subtaskItem = button.parentElement;
        subtaskItem.classList.toggle('completed');
    }

    function editTask(task) {
        const div = task.querySelector('.task-header div');
        const newText = prompt('Edit task:', div.textContent);
        if (newText) {
            div.textContent = newText;
        }
    }

    function deleteTask(task) {
        taskList.removeChild(task);
    }

    function saveTasksToLocalStorage() {
        const tasks = [];
        const taskItems = taskList.querySelectorAll('.task');
        taskItems.forEach(item => {
            const taskHeader = item.querySelector('.task-header');
            const taskText = taskHeader.querySelector('div').textContent;
            const isCompleted = taskHeader.classList.contains('completed');

            const subtasks = [];
            const subtaskList = item.querySelectorAll('.subtask-container .subtask-list .subtask');
            subtaskList.forEach(subtask => {
                subtasks.push({ text: subtask.querySelector('.subtask-text').textContent, completed:  subtask.classList.contains('completed')});
            });

            tasks.push({ text: taskText, completed: isCompleted, subtasks: subtasks });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(taskStorage => {
            const task = createTaskElement(taskStorage.text);
            const taskHeader = task.querySelector('.task-header');
            if (taskStorage.completed) {
                taskHeader.classList.add('completed');
            }

            const subtaskList = task.querySelector('.subtask-container .subtask-list');
            taskStorage.subtasks.forEach(subtaskStorage => {
                const subtask = createSubtaskElement(subtaskStorage.text);
                if (subtaskStorage.completed) {
                    subtask.classList.add('completed');
                }
                subtaskList.appendChild(subtask);
            });
            taskList.appendChild(task); 
        });
    }
});

