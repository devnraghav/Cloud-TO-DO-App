// serverside for my to-do app.

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;


// serve static files from the public directory
app.use(express.static('public'));
app.use(express.json())


// for one of the databases
const my_connection_string = "mongodb+srv://raghav:whateverman@todocluster.ejgk890.mongodb.net/?retryWrites=true&w=majority";


// creating a new connection object to establish a conne3ction with our mongoDB database
mongoose.connect(my_connection_string, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
);

// reference to our connection object
const db = mongoose.connection;

// error handling if connection fails
db.on("error", console.error.bind(console, "connection error: "));

// if connection is successful log it.
db.once("open", function () {
    console.log("Connection to MongoDB established successfully.");
})


// defining the schema of my database for tasks

const tasks_schema = new mongoose.Schema({
    title: {type: String, unique: true},
    completed: Boolean
});

const tasks_model = mongoose.model("tasks", tasks_schema);


/*
Creating a sample task

const example_task = new tasks_model(
    // the actual document
    {
        task_title: "Example task 4",
        task_completed: false
    }
);
example_task.save();
*/


/*
An example search   

tasks_model.find({task_completed: false})
    .then(data => {
        data.forEach(task => {
            console.log(task.task_completed);
        })
    })
    .catch(error => console.log(error))
*/

app.get("/api/tasks", retrieve_task_data)

// post request
app.post("/api/tasks", send_task_data)

// put request
app.put("/api/tasks", update_task_data)

// delete request
app.delete("/api/tasks", delete_task_data)


function retrieve_task_data(request, response) {

    tasks_model.find({})
    .then(data => {
        response.json(data);
    })
    .catch(error => {
        console.log(error);
        response.json({Error: "Could not retrieve data"});
    })
}

function send_task_data(request, response) {
    // get the data from the request body
    // adding tasks

    let reply = {
        result: null,
        message: null
    }

    const request_body = request.body;
    const new_task = new tasks_model(request_body);
    new_task.save()
    .then(result => {
        //console.log(result);
        reply.result = result;
        reply.message = "Task saved successfully";
        console.log(reply.message);
    })
    .catch(error => {

        reply.result = error;
        // handling duplication of key values
        // error.code === 11000
        if (error.code === 11000) {
            reply.message = "Task already exists";
            console.log(reply.message);
        } else {
            reply.message = "Could not save data";
            console.log(reply.message);
        }  
    })
    .finally(() => {
        response.json(reply);
    });
}

async function update_task_data(request, response) {

    const request_body = request.body;

    // the handling of edits and checks.
    let update;

    if (!request_body.editing && request_body.new_title != undefined) {
        update = {
            title: request_body.new_title,
            completed: request_body.completed
        };
    } else {
        update = {
            title: request_body.title,
            completed: request_body.completed
        };
    }

    try {

        const update_result = await tasks_model.updateOne({ title: request_body.title }, { $set: update });
        response.json(update_result);
    }
    catch(error) {
        console.log(error);
        response.json(error);   
    }    
} 

function delete_task_data(request, response) {
    const request_body = request.body;

    tasks_model.deleteOne({title: request_body.title})
    .then(data => {
        response.json(data);
    })
    .catch(error => {
        console.log(error);
        response.json(error); 
    })

}

// running the server
app.listen(port, "0.0.0.0", () => {
    console.log(`PROductivity is listening at http://localhost:${port}`);
});