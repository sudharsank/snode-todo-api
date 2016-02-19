var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();
var port = process.env.PORT || 3000;

var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.send('To Do api!');
});

// GET /todos
app.get('/todos', function(req, res) {
    var query = req.query;
    var where = {};
    if (query.hasOwnProperty('completed')) {
        if (query.completed === 'true')
            where.completed = true;
        else if (query.completed === 'false')
            where.completed = false;
    }

    if (query.hasOwnProperty('q') && query.q.length > 0) {
        where.description = {
            $like: '%' + query.q + '%'
        }
    }

    db.todo.findAll({
        where: where
    }).then(function(todos) {
        res.json(todos);
    }, function(e) {
        res.status(404).json("Sorry, could not find the todo!!!");
    });
});

// GET /todos/:id
app.get('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10);
    db.todo.findById(todoId).then(function(todo) {
        if (!!todo) {
            return res.json(todo.toJSON());
        } else {
            res.status(404).json("Sorry, could not find the todo!!!");
        }
    }, function(e) {
        res.status(500).json(e);
    });
});

// POST /todos
app.post('/todos', function(req, res) {
    var body = _.pick(req.body, "description", "completed"); // req.body; 
    if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
        return res.status(400).send();
    }

    db.todo.create(body).then(function(todo) {
        res.json(todo.toJSON());
    }, function(e) {
        return res.status(400).json(e);
    })
});

// DELE /todos/:id
app.delete('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10);
    var matchedToDo = _.findWhere(todos, {
        id: todoId
    });
    if (!matchedToDo) {
        return res.status(404).json({
            "error": "No record found to delete."
        });
    }
    todos = _.without(todos, matchedToDo);
    res.send(matchedToDo);
});

// PUT /todos/:id
app.put('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10);
    var matchedToDo = _.findWhere(todos, {
        id: todoId
    });
    var body = _.pick(req.body, "description", "completed");
    var validAttributes = {};

    if (!matchedToDo) {
        return res.status(404).json({
            "error": "No record found to update."
        });
    }

    if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
        validAttributes.completed = body.completed;
    } else if (body.hasOwnProperty('completed')) {
        return res.status(404).json({
            "error": "Invalid value for 'Completed'"
        });
    }

    if (body.hasOwnProperty('description') && _.isString(body.description)) {
        validAttributes.description = body.description;
    } else if (body.hasOwnProperty('description')) {
        return res.status(404).json({
            "error": "Invalid value for 'Description'"
        });
    }

    _.extend(matchedToDo, validAttributes);
    res.json(matchedToDo);
});

db.sequelize.sync().then(function() {
    app.listen(port, function() {
        console.log('Express server started!!!');
    });
});