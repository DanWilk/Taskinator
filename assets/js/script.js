var taskIdCounter = 0;
var formEl = document.querySelector("#task-form");
var tasksToDoEL = document.querySelector('#tasks-to-do');
var pageContentEl = document.querySelector('#page-content');
var tasksInProgressEl = document.querySelector('#tasks-in-progress');
var tasksCompletedEl = document.querySelector('#tasks-completed');
var tasks = [];
// start user input handling code 
var taskButtonHandler = function(event) {
    var targetEl = event.target;

    if (targetEl.matches('.edit-btn')) {
        var taskId = targetEl.getAttribute('data-task-id');
        editTask(taskId);

    } else if (event.target.matches('.delete-btn')) {
        var taskId = event.target.getAttribute('data-task-id');
        deleteTask(taskId);
    }
};

var taskFormHandler = function(event) {
    event.preventDefault();

    var taskNameInput = document.querySelector('input[name="task-name"]').value;
    var taskTypeInput = document.querySelector('select[name="task-type"]').value;

    if (!taskNameInput || !taskTypeInput) {
        alert('You need to fill out the task form!');
        return false;
    }

    formEl.reset();

    var isEdit = formEl.hasAttribute('data-task-id');
    
   if (isEdit) {
       var taskId = formEl.getAttribute('data-task-id');
       completeEditTask(taskNameInput, taskTypeInput, taskId);
   }
   else {
       var taskDataObj = {
           name: taskNameInput,
           type: taskTypeInput,
           status: 'to do'
       };
       console.log(taskDataObj);
       console.log(taskDataObj.status);

       createTaskEl(taskDataObj);

   }

};

var taskStatusChangeHandler = function(event) {
    var taskId = event.target.getAttribute('data-task-id');

    var statusValue = event.target.value.toLowerCase();

    var taskSelected = document.querySelector('.task-item[data-task-id="' + taskId + '"]');

    if (statusValue === 'to do') {
        tasksToDoEL.appendChild(taskSelected);
    } else if (statusValue === 'in progress') {
        tasksInProgressEl.appendChild(taskSelected);
    } else if (statusValue === 'completed') {
        tasksCompletedEl.appendChild(taskSelected);
    }

    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }
    saveTasks();
};
//end handler code

var completeEditTask = function(taskName, taskType, taskId) {
    var taskSelected = document.querySelector('.task-item[data-task-id="' + taskId + '"]');

    taskSelected.querySelector('h3.task-name').textContent = taskName;
    taskSelected.querySelector('span.task-type').textContent = taskType;

    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    };

    alert('Task Updated!');

    formEl.removeAttribute('data-task-id');
    document.querySelector('#save-task').textContent = 'Add Task';
    saveTasks();
};

var editTask = function(taskId) {
    console.log('editing task #' + taskId);

    var taskSelected = document.querySelector('.task-item[data-task-id="' + taskId + '"]');

    var taskName = taskSelected.querySelector('h3.task-name').textContent;
    var taskType = taskSelected.querySelector('span.task-type').textContent;

    document.querySelector('input[name="task-name"]').value = taskName;
    document.querySelector('select[name="task-type"]').value = taskType;

    document.querySelector('#save-task').textContent = 'Save Task';
    formEl.setAttribute('data-task-id', taskId);
};


var deleteTask = function(taskId) {
    var taskSelected = document.querySelector('.task-item[data-task-id="' + taskId + '"]');
    taskSelected.remove();

    var updatedTaskArr = [];

    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    }

    tasks = updatedTaskArr;
    saveTasks();
};

var createTaskEl = function(taskDataObj) {

    var listItemEl = document.createElement('li');
    listItemEl.className = 'task-item';

    listItemEl.setAttribute('data-task-id', taskIdCounter);

    var taskInfoEl = document.createElement('div');
    taskInfoEl.className = 'task-info';
    taskInfoEl.innerHTML = '<h3 class="task-name">' + taskDataObj.name + '</h3><span class="task-type">' + taskDataObj.type + '</span>';
    listItemEl.appendChild(taskInfoEl);

    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);

    taskDataObj.id = taskIdCounter;
    tasks.push(taskDataObj);

    tasksToDoEL.appendChild(listItemEl);
    taskIdCounter++;

    saveTasks();
}

var createTaskActions = function(taskId) {
    var actionContainerEl = document.createElement('div');
    actionContainerEl.className = 'task-actions';

    var editButtonEl = document.createElement('button');
    editButtonEl.textContent = 'Edit';
    editButtonEl.className = 'btn edit-btn';
    editButtonEl.setAttribute('data-task-id', taskId);

    actionContainerEl.appendChild(editButtonEl);

    var deleteButtonEl = document.createElement('button');
    deleteButtonEl.textContent = 'Delete';
    deleteButtonEl.className = 'btn delete-btn';
    deleteButtonEl.setAttribute('data-task-id', taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    var statusSelectEl = document.createElement('select');
    statusSelectEl.className = 'select-status';
    statusSelectEl.setAttribute('name', 'status-change');
    statusSelectEl.setAttribute('data-task-id', taskId)

    var statusChoices = ['To Do', 'In Progress', 'Completed'];

    for (let i = 0; i < statusChoices.length; i++) {
        var statusOptionEl = document.createElement('option');
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute('value', statusChoices[i]);

        statusSelectEl.appendChild(statusOptionEl);
    }

    actionContainerEl.appendChild(statusSelectEl);


    return actionContainerEl;
};

var saveTasks = function() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

var loadTasks = function() {
    tasks = localStorage.getItem('tasks');
    console.log(tasks);

    if (tasks === null) {
        tasks = [];
        return false;
    }

    tasks = JSON.parse(tasks);

    for (i = 0; i < tasks.length; i++) {
        tasks[i].id = taskIdCounter;
        console.log(tasks[i])

        var listItemEl = document.createElement('li');
        listItemEl.setAttribute('class', 'task-item');
        listItemEl.setAttribute('data-task-id', tasks[i].id);

        var taskInfoEl =document.createElement('div');
        taskInfoEl.setAttribute('class', 'task-info');
        taskInfoEl.innerHTML = "<h3 class='task-name'>" + tasks[i].name + "</h3><span class='task-type'>" + tasks[i].type + "</span>";

        listItemEl.appendChild(taskInfoEl);
        var taskActionsEl = createTaskActions(tasks[i].id);
        listItemEl.appendChild(taskActionsEl);

        if (tasks[i].status === 'to do') {
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 0;
            tasksToDoEL.appendChild(listItemEl);
        } else if (tasks[i].status === 'in progress') {
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 1;
            tasksInProgressEl.appendChild(listItemEl);
        } else if (tasks[i].status === 'complete') {
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 2;
            tasksCompletedEl.appendChild(listItemEl);
        }
        taskIdCounter++
        console.log(listItemEl);
    }
}

formEl.addEventListener('submit', taskFormHandler);
pageContentEl.addEventListener('click', taskButtonHandler);
pageContentEl.addEventListener('change', taskStatusChangeHandler);
loadTasks();