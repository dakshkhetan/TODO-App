/*******

    Extra feature added (Innovation):

    Added a cross/delete icon next to each task in the To-Do list showcase
    to individually delete tasks from the database.

********/


const express = require('express');

// PORT NUMBER AT WHICH OUR SERVER WILL BE RUNNING
const port = 8000;

// CREATE TO THE DATABASE
const db = require('./config/mongoose');

// CREATE OBJECT OF EXPRESS
const app = express();

// GET THE PATH OBJECT TO SET THE PATH OF CSS FILE (OR JAVASCRIPT FILE)
const path = require('path');

// IMPORT THE TODO OBJECT FROM MODELS
const Todo = require('./models/todo');

// FOR DECODING URL
app.use(express.urlencoded());

// USING EJS AS TEMPLE ENGINE
app.set('view engine', 'ejs');

// SET THE PATH OF VIEWS DIRECTORY
app.set('views', path.join(__dirname, 'views'));

// USE THE CSS AND JAVASCRIPT FILE
app.use(express.static('assets'));

// THIS IS HOME PAGE URL
app.get('/', function (req, res) {
    Todo.find({}, function (err, todos) {
        if (err) {
            console.log('error', err);
            return;
        }
        return res.render('home',
            {
                title: "TODO APP",
                todo_list: todos
            }
        );
    });    
});

// THIS IS URL FOR CREATING THE TASK IN DATABASE
app.post('/create-todo', function (req, res) {
    Todo.create({
            description: req.body.description,
            category: req.body.category,
            date: req.body.date
        }, function (err, newtodo) {
            if (err) {
                console.log('error in creating task', err);
                return;
            }
            return res.redirect('back');
        }
    )
});

// THIS IS DELETE URL FOR SINGLE TASK FROM DATABASE
app.get('/delete_todo_single', function(req, res) {
    let id = req.query.id;
    Todo.findByIdAndDelete(id, function(err){
        if(err) {
            console.log("error");
            return;
        }
        return res.redirect('back');
    });
});

// THIS IS URL TO DELETE THE MULTIPLE ITEM FROM DATABASE
app.post('/delete-todo', function(req, res) {
    let ids = req.body.task;
    // if single task is to be deleted
    if (typeof(ids) == "string") {
        Todo.findByIdAndDelete(ids, function(err) {
            if (err) { 
                console.log("error in deleting"); 
                return; 
            }
        });
    } else {    // if multiple task is to be deleted
        for (let i = 0; i < ids.length; i++) {
            Todo.findByIdAndDelete(ids[i], function (err) {
                if (err) { 
                    console.log("error in deleting");
                    return; 
                }
            });
        }
    }
    return res.redirect('back');
});

// SERVER
app.listen(port, function(err) {
    if(err) {
        console.log("Error in setting up the express server!");
    }
    console.log("Express server is up and running on port:", port);
});