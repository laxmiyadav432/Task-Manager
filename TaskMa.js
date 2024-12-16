document.addEventListener('DOMContentLoaded', function () {
    const allButton = document.querySelector(".all");
    const activeButton = document.querySelector(".active");
    const completeButton = document.querySelector(".complete");
    const taskList = document.querySelector("#task-list");
    const taskInput = document.querySelector("input");
    const addButton = document.querySelector(".add");

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => addTaskToList(task.text, task.completed));

    addButton.addEventListener("click", function () {
        const taskText = taskInput.value.trim();
        if (taskText !== "") {
            addTaskToList(taskText, false);
            saveTaskToLocalStorage(taskText, false);
            taskInput.value = "";
        }
    });

    function addTaskToList(taskText, completed) {
        const li = document.createElement("li");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = completed;
        checkbox.addEventListener("change", function () {
            span.classList.toggle("completed", checkbox.checked);
            updateTaskCompletionInLocalStorage(taskText, checkbox.checked);
        });

        const span = document.createElement("span");
        span.textContent = taskText;
        span.className = "task-text";
        if (completed) span.classList.add("completed");

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "edit-button";
        editButton.addEventListener("click", function () {
            editTask(li, span, taskText);
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";
        deleteButton.addEventListener("click", function () {
            li.remove();
            removeTaskFromLocalStorage(taskText);
        });
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(editButton);
        li.appendChild(deleteButton);
        taskList.appendChild(li);
    }

    function editTask(li, span, oldText) {
        const input = document.createElement("input");
        input.type = "text";
        input.value = span.textContent;
        li.insertBefore(input, span);
        li.removeChild(span);

        const saveButton = document.createElement("button");
        saveButton.textContent = "Save";
        saveButton.className = "save-button";
        saveButton.addEventListener("click", function () {
            const newText = input.value.trim();
            if (newText !== "") {
                span.textContent = newText;
                li.insertBefore(span, input);
                li.removeChild(input);
                li.removeChild(saveButton);
                li.appendChild(editButton);

                updateTaskTextInLocalStorage(oldText, newText);
            }
        });
        li.appendChild(saveButton);
        li.removeChild(editButton);
    }

    function saveTaskToLocalStorage(taskText, completed) {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.push({ text: taskText, completed });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function updateTaskCompletionInLocalStorage(taskText, completed) {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(task => {
            if (task.text === taskText) {
                task.completed = completed;
            }
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function updateTaskTextInLocalStorage(oldText, newText) {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(task => {
            if (task.text === oldText) {
                task.text = newText;
            }
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function removeTaskFromLocalStorage(taskText) {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const newTasks = tasks.filter(task => task.text !== taskText);
        localStorage.setItem("tasks", JSON.stringify(newTasks));
    }

    allButton.addEventListener("click", function () {
        document.querySelectorAll("li").forEach(li => (li.style.display = ""));
    });

    activeButton.addEventListener("click", function () {
        document.querySelectorAll("li").forEach(li => {
            const checkbox = li.querySelector("input[type='checkbox']");
            li.style.display = !checkbox.checked ? "" : "none";
        });
    });

    completeButton.addEventListener("click", function () {
        document.querySelectorAll("li").forEach(li => {
            const checkbox = li.querySelector("input[type='checkbox']");
            li.style.display = checkbox.checked ? "" : "none";
        });
    });
});
