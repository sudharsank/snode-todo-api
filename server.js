var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var port = process.env.PORT || 3000;

var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res){
    res.send('To Do api!');
});

// GET /todos
app.get('/todos', function(req, res){
    res.json(todos);
});

// GET /todos/:id
app.get('/todos/:id', function(req, res){
    var todoId = parseInt(req.params.id, 10);
    var matchedToDo = _.findWhere(todos, {id: todoId});
    
    if(matchedToDo){
        res.send(matchedToDo);        
    } else {
        res.status(404).send();
    }
});

// POST /todos
app.post('/todos', function(req, res){
    var body = _.pick(req.body, "description", "completed");// req.body; 
    if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
        return res.status(400).send();
    }
    body.description = body.description.trim();
    body.id = todoNextId++;
    todos.push(body);
    res.send(body);
});

// DELE /todos/:id
app.delete('/todos/:id', function(req, res){
    var todoId = parseInt(req.params.id, 10);
    var matchedToDo = _.findWhere(todos, {id: todoId});
    if(!matchedToDo){
        return res.status(404).json({"error": "No record found to delete."});
    }
    todos = _.without(todos, matchedToDo);
    res.send(matchedToDo);
});

app.listen(port, function(){
    console.log('Express server started!!!');
})