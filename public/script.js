const root = document.querySelector(":root");
const root_styles = getComputedStyle(root);
const task_form = document.querySelector("#task-form");
const task_input = document.querySelector("#task-form-title");
const tasks_container = document.querySelector("#tasks-container");
var app_status = document.querySelector("#status-message");
const moon_icon = document.querySelector("#moon-icon");
const sun_icon = document.querySelector("#sun-icon");

// create a local storage key that stores a variable responsible for theme



let theme_storage = {
    theme: 1
}

if (!localStorage.getItem("themes")) {
    localStorage.setItem("themes", JSON.stringify(theme_storage));
}



function create_task (task_title, completed) {

    task_input.value = ""; // clear input field everytime we create a task.

    // UI RELATED
    const new_task = document.createElement("div");
    new_task.classList.add("task");

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

    checkbox_container.style.transition = "all 0.2s ease-in-out"

    const checkbox_icon = document.createElement("i");
    checkbox_icon.classList.add("fas", "fa-check");

    checkbox_container.appendChild(checkbox_icon);
    new_task.appendChild(checkbox_container);

    new_task_actions.appendChild(edit_btn);
    new_task_actions.appendChild(delete_btn);
    new_task.appendChild(new_task_title);
    new_task.appendChild(new_task_actions);
    tasks_container.appendChild(new_task);
    var old_title;
    // editing and saving the task
    edit_btn.addEventListener("click", () => {
        var isediting = false;
        var new_title;

        // if the task is being edited
        if (edit_icon.parentElement === edit_btn) {
            // editing
            // replace the edit icon with the save icon ready to save
            edit_btn.replaceChild(save_icon, edit_icon)
            new_task_title.removeAttribute("readonly");
            new_task_title.focus();

            // Setting the text decoration to none if task is already checked (taskv title's text decoration is 'line-through')
            if (new_task_title.style.textDecoration == "line-through") {
                new_task_title.style.textDecoration = "none";
            }  

            isediting = true;  

            old_title = new_task_title.value;
        } 
        
        else if (save_icon.parentElement === edit_btn) {
            // saving
            // replace the save icon with the edit icon ready to edit
            edit_btn.replaceChild(edit_icon, save_icon)
            new_task_title.setAttribute("readonly", "readonly");
            if (completed) {
                new_task_title.style.textDecoration = "line-through";
            } else {
                new_task_title.style.textDecoration = "none";
            }
        }

        // Disable all buttons except the one currently responsible for editing this task.
        document.querySelectorAll("button").forEach(function(element) {
            if (element != edit_btn) {
                element.disabled = (isediting) ? true:false;
            }
        })


        if (!isediting) {
            // if the task is being saved

            // our newly saved task's title
            new_title = new_task_title.value;

            // remove the task if the title was empty on save
            if (new_title == "") {
                delete_task(old_title);
                tasks_container.removeChild(new_task);
            } else {
                update_task(old_title, completed, isediting, new_title);
            }

        }
    });

    // deleting the task from local storage and frontend
    delete_btn.addEventListener("click", () => {
        delete_task(new_task_title.value);
        tasks_container.removeChild(new_task);
    });


    // cool responsive hovering affect!
    checkbox_container.addEventListener("mouseover", () => {
        checkbox_container.style.color = (!completed) ? "white":"var(--Myblack)";
    });
    checkbox_container.addEventListener("mouseout", () => {
        checkbox_container.style.color = (!completed) ? "transparent":"var(--Myblack)";
    });

    // strikethrough the text if the task is completed
    new_task_title.style.textDecoration =  (!completed)? "none" : "line-through";
    checkbox_container.style.color = (!completed)? "transparent":root_styles.getPropertyValue("--Myblack");


    // checking off the task
    checkbox_container.addEventListener("click", () => {
        old_decor = new_task_title.style.textDecoration;
        if (!completed) {
           completed = true;
            new_task_title.style.textDecoration = "line-through"
            checkbox_container.style.color = root_styles.getPropertyValue("--Myblack");
        } else if (completed) {
            completed = false;
            new_task_title.style.textDecoration = "none"
            checkbox_container.style.color = "transparent";
        }

        // only passing 2 arguments for the title and completion status as we aren't editing/saving anything here.
        update_task(new_task_title.value, completed);
    });
}

// -1 = light. 1 = dark.
themes = (mode) => {

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

function get_tasks() {
    // get
    fetch("http://localhost:3000/api/tasks", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(res => res.json())
    .then(data => {
        // for debugging puposes
        // console.log(data);
        data.forEach(task => {
            create_task(task.title, task.completed);         
        })
    })
    .catch(e => {
        console.log(`ERROR while REQUESTING data: ${e}`);
    });
}



function add_task (title, completed) {

    fetch("http://localhost:3000/api/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: title,
            completed: completed
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.result.code == 11000) {
            display_status("error", data.message);
            return false;
        }
        else {
            create_task(title, completed);
            display_status("success", data.message);
        }
    })
    .catch(e => {
        console.log(`ERROR while adding data: ${e}`);
    })
}



function update_task(title, completed, editing, new_title) {
    // update the completed property for our task in the database

    // checking if we are saving an edited task.

    fetch("http://localhost:3000/api/tasks", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: title,
            completed: (!completed) ? false:true,
            editing: editing,
            new_title: new_title

        })
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
    })
    .catch(e => {
        console.log(`ERROR while updating data: ${e}`);
    })
}


function delete_task(title) {
    // delete the task from the database
    fetch("http://localhost:3000/api/tasks", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: title
        })
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
    })
    .catch(e => {
        console.log(`ERROR while deleting data: ${e}`);
    });
}

window.addEventListener("load", async () => {

    // experimenting

    // We need SSL certificates to use the HTTPS protocol.

    // In a production environment, we need to use HTTPS.

    get_tasks();
    
    app_status.textContent = "Online";
    app_status.style.color = "lightgreen";

    // add task
    task_form.addEventListener("submit", (event) => {
        event.preventDefault();

        if (task_input.value == "") {
            display_status("error", "Please enter a task name.");
            return;
        } else {
        // add task document to database
            add_task(task_input.value, false);
        }
    });

    // initialize themes.
    themes(JSON.parse(localStorage.getItem("themes")).theme);
    // switching themes
    document.getElementById("theme-switch-container").addEventListener("click", () => {
        let theme = JSON.parse(localStorage.getItem("themes"));
        theme.theme = (theme.theme == 1) ? -1:1;
        localStorage.setItem("themes", JSON.stringify(theme));
        themes(theme.theme);
    });
});

window.addEventListener('error', function(event) {
    display_status("error", event.error);
});

function display_status(status_type, message) {

    if (status_type == "success") {
        error_color = "lightgreen";
    }
    else if (status_type == "error") {
        error_color = "lightcoral";
    }
    else if (status_type == "warning") {
        error_color = "orange";
    }

    app_status.textContent = message;
    app_status.style.color = error_color;

    setTimeout(() => {
        app_status.textContent = "Online";
        app_status.style.color = "lightgreen";
    }, 3000);
}
