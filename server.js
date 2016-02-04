var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

var todos = [{
    id: 1,
    description: 'Meet friend in the reception' ,
    completed: false
}, {
    id: 2,
    description: 'Deploy the solution',
    completed: false
}, {
    id: 3,
    description: 'Reach office',
    completed: true
}];

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
    
    //res.send("Asking for ToDo with ID: "+req.params.id);
});

app.listen(port, function(){
    console.log('Express server started!!!');
})