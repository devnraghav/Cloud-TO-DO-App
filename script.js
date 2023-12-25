const root = document.querySelector(":root");
const root_styles = getComputedStyle(root);

const form = document.querySelector("#task-form");
const task_input = document.querySelector("#task-form-title");
const tasks_container = document.querySelector("#tasks-container");
var app_status = document.querySelector("#status-message");

var mode = 1;

// 1 = dark
// -1 = light

function log_S() {
    console.log(localStorage);
}


var tasks_obj = 
{
    Tasks_array:
    [
        // {title:"task bro", checked:true},
        // {title:"grev", checked:false},
        // {title:"car efdijfoas", checked:true}

    ]
};


create_task = (task_title) => {



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

    // logging storage
    log_S();


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

                        console.log(new_task_title.value);
                        task.title = new_task_title.value;

                        localStorage.setItem("Tasks_key", JSON.stringify(temp_storage));
                        log_S();
                    }
                });
            }
        }


        document.querySelectorAll("button").forEach(function(element) {
            if (element != edit_btn){
                if (isediting){
                    element.disabled = true;
                } else {
                    element.disabled = false;
                }
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

                log_S();
            }
        });

        tasks_container.removeChild(new_task);
    });

    // checking off the task
    checkbox_container.addEventListener("click", () => {
        if (new_task.dataset.completed === "no") {
            new_task.dataset.completed = "yes";
            new_task_title.style.textDecoration = "line-through"

            checkbox_container.style.color = root_styles.getPropertyValue("--Myblack");


        } else if (new_task.dataset.completed === "yes") {
            new_task.dataset.completed = "no";
            new_task_title.style.textDecoration = "none"

            checkbox_container.style.color = "transparent";
        }

        old_decor = new_task_title.style.textDecoration;
    });
}

themes = () => {
    if (mode > 0) {

        document.querySelector("#moon-icon").style.visibility = "hidden";
        document.querySelector("#sun-icon").style.visibility = "visible";


        root.style.setProperty("--Mywhite", "rgb(215, 215, 215)");
        root.style.setProperty("--Myblack", "rgb(47,47,47)");
        root.style.setProperty("--Mypink", "rgb(226,181,199)");

        app_status.style.color = "lightgreen";
        
        document.querySelectorAll(".edit-btn").forEach((del)=> {
            del.style.backgroundColor = "var(--Mypink)";
            del.style.color = "var(--Myblack)";
        });
        document.querySelectorAll(".delete-btn").forEach((del)=> {
            del.style.backgroundColor = "var(--Mypink)";
            del.style.color = "var(--Myblack)";
        });

    } else {
        
        document.querySelector("#sun-icon").style.visibility = "hidden";
        document.querySelector("#moon-icon").style.visibility = "visible";



        root.style.setProperty("--Mywhite", "rgb(47,47,47)");
        root.style.setProperty("--Myblack", "rgb(215, 215, 215)");
        root.style.setProperty("--Mypink", "rgb(47,47,47)");

        app_status.style.color = "rgb(47,47,47)";
        

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




window.addEventListener("load", () => {

    /* 
    Check if storage exists. If not then add a key and assign an empty table to it (Only once).

    If storage already exists, retrieve all task objects. -- work to do

    */

    if (localStorage.getItem("Tasks_key")) {
        console.log("Storage Exists.");
        var local_task_object = JSON.parse(localStorage.getItem("Tasks_key"));


        // We already know the tasks array exists because we add it if there's no local storage.
        // Now we will loop through this array and create a task for each element (task) found and grab it's title to name our newly created task.


        local_task_object.Tasks_array.forEach((task, task_idx) => { 
            // task is an object and it's properties are title and checked.
            // task index is important for arranging tasks by order or user preference (later).



            create_task(task.title);
        });

        // tasks were duplicating on every refresh/load because I forgot to update local storage after creating tasks from the data gathered on load. LOL.
        localStorage.setItem("Tasks_key", JSON.stringify(local_task_object));



    } else {
        console.log("Storage doesn't Exist.");
        // adding the non-existing key and converting it into json string.
        localStorage.setItem("Tasks_key", JSON.stringify(tasks_obj));
        log_S();
    }



    form.addEventListener("submit", (event) => {
        event.preventDefault();
        // check if input field is empty -> return error.
        if (!task_input.value) {
            alert("⚠️ Please enter a task name.")
            console.log("⚠️ Please enter a task name.");
            return false
        }
     
        create_task(task_input.value);

        // clear input field everytime we create a task.
        task_input.value = "";

    });

    app_status.innerHTML = "Online";
    app_status.style.color = "lightgreen";

    themes();
    // dark light mode
    document.getElementById("theme-switch-container").addEventListener("click", () => {
        mode *= -1;
        themes();
    });    
});