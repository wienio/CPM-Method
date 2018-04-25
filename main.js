// import { jsPlumb } from "./jsplumb";
// import * as jsPlumb from 'jsplumb.js'

var TASKID = 1
var taskForm = '<form onsubmit="return submitFunc()"><p>Nazwa zadania:</p><input type="text" class="task-input" required="true" placeholder="Nazwa"><p>Następne zadania:</p><input type="text" class="task-input" placeholder="Np. 2,3"><p>Czasy trwania:</p><input type="text" class="task-input" placeholder="Np. 5,8"><input class="button submit-task" type="submit" value="Zatwierdź"></form>'
var taskReadFromJson = true

class Task {
    constructor(taskName, edges) {
        this.id = TASKID
        this.taskName = taskName
        this.edges = edges
    }
}

var taskList = []
var allPaths = []

function addTaskDiv() {
    taskReadFromJson = false
    if (TASKID === 1) {
        document.getElementById('file-input').style.display = 'none'
    }
    var taskDiv = document.createElement('div')

    taskDiv.innerHTML = taskForm
    taskDiv.className = 'task-container'
    taskDiv.id = 'task-container' + TASKID
    document.getElementById('tasks').appendChild(taskDiv)

    document.getElementById('add-task').disabled = true
    jsPlumb.draggable(taskDiv)
}

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
    document.getElementById('add-task').style.display = 'none'
}

function submitFunc() {
    var formValues = document.getElementsByClassName('task-input')
    var edges = null

    if (formValues[1].value !== '') {
        var neighbours = formValues[1].value.split(',').map(Number)
        var durations = formValues[2].value.split(',').map(Number)

        edges = durations.map((val, index) => {
            return {
                duration: val,
                id: neighbours[index]
            }
        })
    }

    var taskInfo = '<p>Nazwa zadania: ' + formValues[0].value + '</p><p>Następne zadania(nr): '
    if (edges !== null) {
        edges.forEach((value, index) => {
            taskInfo += value.id
            if (index !== edges.length - 1) {
                taskInfo += ', '
            }
        })
    } else {
        taskInfo += '-'
    }
    taskList.push(new Task(formValues[0].value, edges))
    taskInfo += '</p>'

    document.getElementById('task-container' + TASKID).innerHTML = taskInfo
    document.getElementById('task-container' + TASKID).setAttribute('style', 'width: 13vh')
    document.getElementById('task-container' + TASKID).setAttribute('style', 'height: 8vh')

    TASKID++

    document.getElementById('add-task').disabled = false
    return false
}

function calcPaths(task, array) {

    if (task.edges === null) {
        array.push(task.id)
        allPaths.push(array)
        array = []
        return;
    }

    task.edges.forEach((element, index) => {
        array.push(task.id)
        calcPaths(taskList[element.id - 1], array)
        array = []
    })
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
    if(taskReadFromJson === true) {
        taskList.forEach((task) => {
            var taskDiv = document.createElement('div')
            taskDiv.setAttribute('style', 'width: 13vh')
            taskDiv.setAttribute('style', 'height: 8vh')
            var taskInfo ='<p>Nazwa zadania: ' + task.taskName + '</p><p>Następne zadania(nr): '
            if (task.edges !== null) {
                task.edges.forEach((value, index) => {
                    taskInfo += value.id
                    if (index !== task.edges.length - 1) {
                        taskInfo += ', '
                    }
                })
            } else {
                taskInfo += '-'
            }
            taskInfo += '</p>'
            taskDiv.innerHTML = taskInfo
            taskDiv.className = 'task-container'
            taskDiv.id = 'task-container' + task.id
            document.getElementById('tasks').appendChild(taskDiv)
            jsPlumb.draggable(taskDiv)
        })
    }

    taskList.forEach((task) => {
        var taskDiv = document.getElementById('task-container' + task.id)
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

function calcLongestPath() {
    var durations = []
    for (let i = 0; i < allPaths.length; ++i) {
        var durationTime = 0
        for (let j = 0; j < allPaths[i].length - 1; ++j) {
            if (taskList[allPaths[i][j] - 1].edges) {
                taskList[allPaths[i][j] - 1].edges.forEach((edge) => {
                    if (edge.id === allPaths[i][j + 1]) {
                        durationTime += edge.duration
                    }
                })
            }
        }
        durations.push(durationTime)
    }
    return durations
}

function showCriticalPath(paths) {
    var allMaxDurationsIndexes = []
    var maxDurationValue = Math.max(...paths)
    paths.forEach((val, index) => {
        if (maxDurationValue === val) {
            allMaxDurationsIndexes.push(index)
        }
    })

    var path = ''
    allMaxDurationsIndexes.forEach((value, index) => {
        allPaths[value].forEach((val) => {
            document.getElementById('task-container' + val).style.border = "3px solid red"
            path += taskList[val - 1].taskName
            if (taskList[val - 1].edges) {
                path += ' --> '
            }
        })
        if (index !== allMaxDurationsIndexes.length - 1) {
            path += '<br>'
        }
    })

    var result = document.getElementById('results')
    result.innerHTML += path + '<br>' + 'Czas: ' + '<br>' + Math.max(...paths) + ' dni'
}

document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('.add-task').addEventListener('click', function () {
        addTaskDiv()
    });
});

document.getElementById('file-input').addEventListener('change', readJsonTaskFile, false);

jsPlumb.importDefaults({
    Connector: ["Flowchart", {
        curviness: 150
    }],
    Anchors: [[1, 0.5, 0, 0], [0, 0.5, 0, 0]],
    ConnectionsDetachable: false
});

document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('.calculate-cpm').addEventListener('click', function () {
        var singlePath = []

        calcPaths(taskList[0], singlePath)
        fillPaths()
        addTasksDivsAndConnections()
        var durations = calcLongestPath()
        showCriticalPath(durations)

    });
});