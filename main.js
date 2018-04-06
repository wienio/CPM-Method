// import { jsPlumb } from "./jsplumb";
// import * as jsPlumb from 'jsplumb.js'

var TASKID = 0
var taskForm = '<form>   </form>'

class Task {
    // Dodac trzeba cos zeby poprzednie taski byly powiazane
    constructor(taskName, minTime, maxTime) {
        this.id = TASKID
        this.taskName = taskName
        this.maxTime = minTime
        this.maxTime = maxTime
    }
}

var taskList = []

function addDiv() {
    TASKID++;
    var taskDiv = document.createElement('div')
    taskDiv.innerHTML = 'Dodaj informacje o zadaniu: ' + '<br><input type="text" name="myInputs[]">' + '<br><button>Zatwierdz</button>'
    taskDiv.style.cssText = 'width: 30vh; height: 100px; background-color: red; margin: 5px;'
    document.querySelector('.tasks').appendChild(taskDiv)
    document.body.appendChild(taskDiv)
}

document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('.add-task').addEventListener('click', function () {
        addDiv()
    });
});

function checkVariablesIfIsntUndefined(objectList) {
    objectList.forEach((element) => {
        if (typeof element.taskName === 'undefined' || typeof element.minTime === 'undefined' || typeof element.maxTime === 'undefined' || typeof element.id === 'undefined' ) {
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

jsPlumb.ready(function () {  
    console.log("jsplumb dziala")
    console.log(jsPlumb)
    
    // var e0 = jsPlumb.addEndpoint("container0",{uuid:"ep0"}) //set your own uuid for endpoint to access later.
    // e1 = jsPlumb.addEndpoint("container1",{uuid:"ep1"});  
    // jsPlumb.connect({ uuids:[e0.getUuid(),e1.getUuid()] }); 
            // (or) 
    // jsPlumb.connect({ uuids:["ep0","ep1"] });
});