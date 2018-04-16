// import { jsPlumb } from "./jsplumb";
// import * as jsPlumb from 'jsplumb.js'

var TASKID = 0
var firstTaskForm = '<form><p>Nazwa zadania:</p><br><input type="text" class="task-input" required="true" placeholder="nazwa"><br>Czas trwania:<br><input type="text" value="0" readonly="readonly"><br><input type="submit" value="Zatwierdź">  </form>'
var taskForm = '<form><label for="taskName">Nazwa zadania</label><input type="text" required="true" placeholder="nazwa">  </form>'

class Task {
    constructor(taskName, durationTime, edges) {
        this.id = TASKID
        this.taskName = taskName
        this.edges = edges
    }
}

var taskList = []

function addDiv() {
    var taskDiv = document.createElement('div')
    if (TASKID === 0) {
        document.getElementById('file-input').disabled = true
        taskDiv.innerHTML = firstTaskForm
        taskDiv.className = 'task-container'
    }
    TASKID++;

    taskDiv.className = 'task-container'
    taskDiv.id = 'task-container' + TASKID
    // taskDiv.innerHTML = 'Dodaj informacje o zadaniu: ' + '<br><input type="text" name="myInputs[]">' + '<br><button>Zatwierdz</button>'
    // taskDiv.style.cssText = 'width: 30vh; height: 100px; background-color: red; margin: 5px;'
    document.getElementById('tasks').appendChild(taskDiv)

    var els = document.querySelectorAll('.task-container')
    jsPlumb.draggable(taskDiv)

    jsPlumb.addEndpoint(taskDiv)
    jsPlumb.connect({
        source: taskDiv,
        target: 'tasks'
    })
}

document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('.add-task').addEventListener('click', function () {
        addDiv()
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

    };
    reader.readAsText(file);
}

function calculateCpm() {

}

function recursive(discovered, tasks, que) {

    if (que.length === 0) {
        return
    }

    let value = que[0]
    que.shift()

    if (taskList.previous !== undefined) {
        taskList.previous.forEach((element, index) => {
            console.log('jeb')
            if (discovered[index] === false) {
                discovered[index] = true
                que.push(element.id)
            }
            console.log(element.taskName + '<=')
        })
    }

    recursive(discovered, tasks, que)
}

document.getElementById('file-input').addEventListener('change', readJsonTaskFile, false);


// jsPlumb.Defaults.MaxConnections = 5;


jsPlumb.importDefaults({
    Connector: ["Bezier", { curviness: 150 }],
    Anchors: ["TopCenter", "BottomCenter"]
});



jsPlumb.bind("ready", function () {
    jsPlumb.addEndpoint('tasks')
    jsPlumb.addEndpoint('kontakt')

    jsPlumb.connect({
        source: 'tasks',
        target: 'kontakt'
    })
    // your jsPlumb related init code goes here
});

document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('.calculate-cpm').addEventListener('click', function () {
        var discovered = []
        var que = []

        taskList.forEach(() => {
            discovered.push(false)
        })

        taskList.forEach((element, index) => {
            if (discovered[index] === false) {
                discovered[index] = true
                que.push(index)
                recursive(discovered, tasks, que)
            }
        })
    });
});