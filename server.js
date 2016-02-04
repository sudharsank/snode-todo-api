var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 3000;

//var todos = [{
//    id: 1,
//    description: 'Meet friend in the reception' ,
//    completed: false
//}, {
//    id: 2,
//    description: 'Deploy the solution updated',
//    completed: false
//}, {
//    id: 3,
//    description: 'Reach office',
//    completed: true
//}];

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
    var matchedToDo;
    todos.forEach(function(todo){
       if(todoId === todo.id) {
           matchedToDo = todo;
       }
    });
    
    if(matchedToDo){
        res.send(matchedToDo);        
    } else {
        res.status(404).send();
    }
});

// POST /todos
app.post('/todos', function(req, res){
    var body = req.body;
    
    body.id = todoNextId++;
    todos.push(body);
    
//    todos.push({
//        id: todoNextId,
//        description: body.description,
//        completed: body.completed
//    });
//    todoNextId = todoNextId+1;
    
    //console.log("description: " + body.description);
    
    res.send(body);
});

app.listen(port, function(){
    console.log('Express server started!!!');
})