const root = document.querySelector(":root");
const root_styles = getComputedStyle(root);
const task_form = document.querySelector("#task-form");
const task_input = document.querySelector("#task-form-title");
const tasks_container = document.querySelector("#tasks-container");
var app_status = document.querySelector("#status-message");
const moon_icon = document.querySelector("#moon-icon");
const sun_icon = document.querySelector("#sun-icon");

var task_object = 
{
    Tasks_array:
    [
        // {title:"task bro", checked:true},
        // {title:"grev", checked:false},
        // {title:"car efdijfoas", checked:true}
    ]
};

create_task = (task_title) => {

    // check if input field is empty -> return error.
    if (!task_title) {
        displayerror("Please enter a task name.", "lightcoral");
        return false;
    }

    // clear input field everytime we create a task.
    task_input.value = "";

    // adding task to local storage.
    var current_storage = JSON.parse(localStorage.getItem("Tasks_key"));

    current_storage.Tasks_array.forEach(obj =>{
        if (obj.title === task_title) {
            return false
        }
    });

    current_storage.Tasks_array.push(
        {title:task_title}
    );

    localStorage.setItem("Tasks_key", JSON.stringify(current_storage));

    const new_task = document.createElement("div");
    new_task.classList.add("task");
    new_task.dataset.completed = "no";

    const new_task_title = document.createElement("input");
    new_task_title.type = "text";
    new_task_title.classList.add("task-title");
    new_task_title.value = task_title;
    new_task_title.setAttribute("readonly", "readonly");

    var old_decor = new_task_title.style.textDecoration;

    const new_task_actions = document.createElement("div");
    new_task_actions.classList.add("actions");

    const edit_btn = document.createElement("button");
    edit_btn.classList.add("edit-btn");

    const edit_icon = document.createElement("i");
    edit_icon.classList.add('fas', 'fa-pen-to-square');

    const save_icon = document.createElement("i");
    save_icon.classList.add('fas', 'fa-floppy-disk');

    edit_btn.appendChild(edit_icon);

    const delete_btn = document.createElement("button");
    delete_btn.classList.add("delete-btn");

    const delete_icon = document.createElement("i");
    delete_icon.classList.add("fas", "fa-trash");

    delete_btn.appendChild(delete_icon);

    const checkbox_container = document.createElement("button");
    checkbox_container.classList.add("task-checkbox");
    checkbox_container.style.color = "transparent";
    
    const checkbox_icon = document.createElement("i");
    checkbox_icon.classList.add("fas", "fa-check");

    checkbox_container.appendChild(checkbox_icon);
    new_task.appendChild(checkbox_container);

    new_task_actions.appendChild(edit_btn);
    new_task_actions.appendChild(delete_btn);
    new_task.appendChild(new_task_title);
    new_task.appendChild(new_task_actions);
    tasks_container.appendChild(new_task);

    // editing and saving the task
    edit_btn.addEventListener("click", () => {

        var isediting = false;

        if (edit_icon.parentElement === edit_btn) {
            // editing
            edit_btn.replaceChild(save_icon, edit_icon)
            new_task_title.removeAttribute("readonly");
            new_task_title.focus();

            isediting = true;
            
            if (isediting) {

                let temp_storage = JSON.parse(localStorage.getItem("Tasks_key"));
                temp_storage.Tasks_array.forEach(function(task) {
                    if (task.title == new_task_title.value) {
                        name_replacement = task.title;
                        // console.log(name_replacement);

                        // console.log(task.title);
                    }
                });
            }

            // Setting the text decoration to none if task is already checked (taskv title's text decoration is 'line-through')
            if (new_task_title.style.textDecoration == "line-through") {
                new_task_title.style.textDecoration = "none";
            }
                
        } 
        
        else if (save_icon.parentElement === edit_btn) {
            // saving
            edit_btn.replaceChild(edit_icon, save_icon)
            new_task_title.setAttribute("readonly", "readonly");
            new_task_title.style.textDecoration = old_decor;
            if (!isediting) {
                let temp_storage = JSON.parse(localStorage.getItem("Tasks_key"));
                temp_storage.Tasks_array.forEach(function(task, task_idx, task_array) {
                    if (name_replacement == task.title) {
                        // console.log(new_task_title.value);
                        task.title = new_task_title.value;
                        localStorage.setItem("Tasks_key", JSON.stringify(temp_storage));
                    }
                });
            }
        }

        // Disable all buttons except the one currently responsible for editing this task.
        document.querySelectorAll("button").forEach(function(element) {
            if (element != edit_btn) {
                element.disabled = (isediting) ? true:false;
            }
        })
    });

    // deleting the task from local storage and frontend
    delete_btn.addEventListener("click", () => {
        let temp_storage = JSON.parse(localStorage.getItem("Tasks_key"));
        temp_storage.Tasks_array.forEach(function(obj, index, array) {
            if (obj.title == new_task_title.value) {
                array.splice(index, 1);
                localStorage.setItem("Tasks_key", JSON.stringify(temp_storage));
            }
        });
        tasks_container.removeChild(new_task);
    });

    // checking off the task
    checkbox_container.addEventListener("click", () => {
        old_decor = new_task_title.style.textDecoration;
        if (new_task.dataset.completed === "no") {
            new_task.dataset.completed = "yes";
            new_task_title.style.textDecoration = "line-through"
            checkbox_container.style.color = root_styles.getPropertyValue("--Myblack");
        } else if (new_task.dataset.completed === "yes") {
            new_task.dataset.completed = "no";
            new_task_title.style.textDecoration = "none"
            checkbox_container.style.color = "transparent";
        }
    });
}

// -1 = light. 1 = dark.
var mode = 1;
themes = () => {
    moon_icon.style.visibility = (mode > 0) ? "hidden":"visible";
    sun_icon.style.visibility = (mode > 0) ? "visible":"hidden";
    app_status.style.color = (mode > 0) ? "lightgreen":"var(--Mywhite)";

    if (mode > 0) {
        // dark
        root.style.setProperty("--Mywhite", "rgb(215, 215, 215)");
        root.style.setProperty("--Myblack", "rgb(47,47,47)");
        root.style.setProperty("--Mypink", "rgb(226,181,199)");
        
        document.querySelectorAll(".edit-btn").forEach((del)=> {
            del.style.backgroundColor = "var(--Mypink)";
            del.style.color = "var(--Myblack)";
        });
        document.querySelectorAll(".delete-btn").forEach((del)=> {
            del.style.backgroundColor = "var(--Mypink)";
            del.style.color = "var(--Myblack)";
        });

    } else {
        // light
        root.style.setProperty("--Mywhite", "rgb(47,47,47)");
        root.style.setProperty("--Myblack", "rgb(215, 215, 215)");
        root.style.setProperty("--Mypink", "rgb(47,47,47)");

        document.querySelectorAll(".edit-btn").forEach((del)=> {
            del.style.backgroundColor = "var(--Myblack)";
            del.style.color = "var(--Mywhite)";
        });
        document.querySelectorAll(".delete-btn").forEach((del)=> {
            del.style.backgroundColor = "var(--Myblack)";
            del.style.color = "var(--Mywhite)";
        });
    }
}
themes(); // initialize themes.

window.addEventListener("load", () => {
    app_status.textContent = "Online";
    app_status.style.color = "lightgreen";

    /* 
    Check if storage exists. If not then add a key and assign an empty table to it (Only once).
    If storage already exists, retrieve all task objects.
    */
    
    // if storage already exists
    if (localStorage.getItem("Tasks_key")) {
        const temp = JSON.parse(localStorage.getItem("Tasks_key"));
        // Now we will loop through this array and create a task for each element (task) found and grab it's title to name our newly created task.

        // retrieving all existing tasks.
        temp.Tasks_array.forEach((task) => { 
            create_task(task.title);
        });

        localStorage.setItem("Tasks_key", JSON.stringify(temp));

    // if storage does NOT exist already.
    } else {
        // Adding the a new key named "tasks_key" and converting our task object into JSON string.
        localStorage.setItem("Tasks_key", JSON.stringify(task_object));
    }

    task_form.addEventListener("submit", (event) => {
        event.preventDefault();
        create_task(task_input.value);
    });

    // dark light mode
    document.getElementById("theme-switch-container").addEventListener("click", () => {
        mode *= -1;
        themes();
    });
});

window.addEventListener('error', function(event) {
    displayerror(event.error, "lightcoral");
});

function displayerror(error, error_color) {
    app_status.textContent = error;
    app_status.style.color = error_color;
    setTimeout(() => {
        app_status.textContent = "Online";
        app_status.style.color = "lightgreen";
    }, 2000);
}
