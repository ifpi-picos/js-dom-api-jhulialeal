const a = document.querySelector("#mano");

function createTask(taskId, taskName) {
    const listItem = document.createElement("li");
    const checkbox = document.createElement("input");
    const label = document.createElement("label");
    const button = document.createElement("button");

    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("id", taskId);
    label.setAttribute("for", taskId);
    label.textContent = taskName;
    button.textContent = "X";
    button.classList.add("remove-task");
    button.onclick = function(event) {
      removeTask(event, taskId);
    };

    listItem.appendChild(checkbox);
    listItem.appendChild(label);
    listItem.appendChild(button);

    document.getElementById("task-list").appendChild(listItem);

    localStorage.setItem(taskId, taskName);
}

// Função para remover uma tarefa
function removeTask(event, taskId) {
    event.preventDefault();
    var taskToRemove = document.getElementById(taskId);
    if (taskToRemove) {
        taskToRemove.parentElement.remove();
        // Remover a tarefa do localStorage quando ela é removida da lista
        localStorage.removeItem(taskId);
    }
}

a.addEventListener("click", (event) =>{
    event.preventDefault();
    const inputSla = document.querySelector("#task-input")
    const valor = inputSla.value
    console.log(valor)
    createTask("carai", valor)
});
