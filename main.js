// import { jsPlumb } from "./jsplumb";
// import * as jsPlumb from 'jsplumb.js'

var TASKID = 0
var firstTaskForm = '<form onsubmit="return submitFunc()"><p>Nazwa zadania:</p><br><input type="text" class="task-input" required="true" placeholder="nazwa"><br>Czas trwania:<br><input type="text" value="0" readonly="readonly"><br><input type="submit" value="Zatwierdź">  </form>'
var taskForm = '<form onsubmit="return submitFunc()><label for="taskName">Nazwa zadania</label><input type="text" required="true" placeholder="nazwa">  <input type="submit" value="Zatwierdź"></form>'

class Task {
    constructor(taskName, durationTime, edges) {
        this.id = TASKID
        this.taskName = taskName
        this.edges = edges
    }
}

var taskList = []

function addTaskDiv() {
    var taskDiv = document.createElement('div')
    if (TASKID === 0) {
        document.getElementById('file-input').disabled = true
        taskDiv.innerHTML = firstTaskForm
        taskDiv.className = 'task-container'
    }

    taskDiv.className = 'task-container'
    taskDiv.id = 'task-container' + TASKID
    // taskDiv.innerHTML = 'Dodaj informacje o zadaniu: ' + '<br><input type="text" name="myInputs[]">' + '<br><button>Zatwierdz</button>'
    // taskDiv.style.cssText = 'width: 30vh; height: 100px; background-color: red; margin: 5px;'
    document.getElementById('tasks').appendChild(taskDiv)

    jsPlumb.draggable(taskDiv)

    jsPlumb.addEndpoint(taskDiv)
    jsPlumb.connect({
        source: taskDiv,
        target: document.getElementById('task-container' + (TASKID - 1))
        // target: 'tasks'
    })
    console.log(TASKID)
    TASKID++;
}

document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('.add-task').addEventListener('click', function () {
        addTaskDiv()
    });
});

function readJsonTaskFile(jsonFile) {
    var file = jsonFile.target.files[0];
    if (!file) {
        return;
    }
    let filename = String(document.getElementById('file-input').value)
    if (!filename.endsWith('.json')) {
        alert("To nie jest plik .json z danymi")
        return;
    }
    var reader = new FileReader();
    reader.onload = function (jsonFile) {
        var contents = jsonFile.target.result;
        var readedTasks = JSON.parse(contents)

        readedTasks.forEach((element) => {
            taskList.push(Object.assign(new Task, element))
        })
        alert('Zaimportowano zadania, policz ścieżkę krytyczną')
    };
    reader.readAsText(file);
}

function calculateCpm(paths) {
    var durations = []
    var totalTime = 0

    paths.forEach((path) => {
        path.forEach((val) => {
            console.log(val)
            if (taskList[val - 1].edges !== null) {
                taskList[val - 1].edges.forEach((edge) => {
                    console.log('edge id = ' + edge.id + ', a val = ' + val)
                    if (edge.id == val) {
                        console.log('Jestem w srodku !')
                        totalTime += edge.duration
                    }
                })
            }
        })
        durations.push(totalTime)
        totalTime = 0
    })
    console.log(durations)
}

document.getElementById('file-input').addEventListener('change', readJsonTaskFile, false);

jsPlumb.importDefaults({
    Connector: ["Flowchart", { curviness: 150 }],
    Anchors: ["RightMiddle", "LeftMiddle"]
});

document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('.calculate-cpm').addEventListener('click', function () {
        var singlePath = []

        calcPaths(taskList[0], singlePath)
        fillPaths()
        addTasksDivsAndConnections()

        // calculateCpm(allPaths)

        console.log(allPaths)
    });
});

var allPaths = []

function calcPaths(task, array) {
    // array.push(task.taskName)

    if (task.edges === null) {
        array.push(task.id)
        allPaths.push(array)
        array = []
        return;
    }

    task.edges.forEach((element, index) => {
        array.push(task.id)
        array.push(element.duration)
        calcPaths(taskList[element.id - 1], array)
        array = []
    })
}

function submitFunc(event) {
    console.log(event)
    return false
}

function fillPaths() {
    allPaths.forEach((path) => {
        while (path[0] !== 1) {
            taskList.forEach((edge) => {
                if (edge.edges !== null) {
                    edge.edges.forEach((array) => {
                        if (array.id === path[0]) {
                            path.unshift(edge.id)
                        }
                    })
                }
            })
        }
    })
}

function addTasksDivsAndConnections() {
    taskList.forEach((task) => {
        var taskDiv = document.createElement('div')
        taskDiv.innerHTML = '<p>Nazwa zadania: ' + task.taskName + '</p>'
        taskDiv.className = 'task-container'
        taskDiv.id = 'task-container' + task.id
        document.getElementById('tasks').appendChild(taskDiv)
        jsPlumb.draggable(taskDiv)
        // jsPlumb.addEndpoint(taskDiv)
    })

    taskList.forEach((task) => {
        var taskDiv = document.getElementById('task-container' + task.id)
        jsPlumb.addEndpoint(taskDiv)
        if (task.edges !== null) {
            task.edges.forEach((edge) => {
                jsPlumb.connect({
                    source: taskDiv,
                    target: document.getElementById('task-container' + edge.id)
                })
            })
        }
    })

    document.getElementById('file-input').style.display = 'none'
    document.getElementById('cpm-button').style.display = 'none'
}