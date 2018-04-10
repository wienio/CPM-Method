// import { jsPlumb } from "./jsplumb";
// import * as jsPlumb from 'jsplumb.js'

var TASKID = 0
var firstTaskForm = '<form><p>Nazwa zadania:</p><br><input type="text" class="task-input" required="true" placeholder="nazwa"><br>Czas trwania:<br><input type="text" value="0" readonly="readonly"><br><input type="submit" value="Zatwierdź">  </form>'
var taskForm = '<form><label for="taskName">Nazwa zadania</label><input type="text" required="true" placeholder="nazwa">  </form>'

class Task {
    constructor(taskName, durationTime, previousIds) {
        this.id = TASKID
        this.taskName = taskName
        this.durationTime = durationTime
        this.previous = previousIds
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

function checkVariablesIfIsntUndefined(objectList) {
    objectList.forEach((element) => {
        if (typeof element.durationTime === 'undefined' || typeof element.taskName === 'undefined' || typeof element.id === 'undefined') {
            return false
        }
        return true;
    })
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

        if (checkVariablesIfIsntUndefined(taskList)) {
            alert("Podany plik zawiera błędne dane!")
            taskList = []
        }
    };
    reader.readAsText(file);
}

function calculateCpm() {

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
