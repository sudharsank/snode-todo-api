var express = require('express');
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
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

// POST /users
app.post('/users', function(req, res) {
    var body = _.pick(req.body, 'email', 'password');
    db.user.create(body).then(function(user) {
        res.json(user.toPublicJSON());
    }, function(e) {
        return res.status(400).json(e);
    });
});

// DELE /todos/:id
app.delete('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10);

    db.todo.findById(todoId).then(function(todo) {
        if (!!todo) {
            db.todo.destroy({
                where: {
                    id: todoId
                }
            }).then(function(todosDeleted) {
                if (todosDeleted === 0) {
                    return res.status(500).json({
                        error: 'No todo record found!!!'
                    });
                } else {
                    res.json('Selected todo deleted!!!');
                }
            }, function(e) {
                return res.status(500).json(e);
            });
        } else {
            res.status(404).json("Sorry, could not find the todo!!!");
        }
    }, function(e) {
        res.status(500).json(e);
    });
});

// PUT /todos/:id
app.put('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10);
    var body = _.pick(req.body, "description", "completed");
    var attributes = {};

    if (body.hasOwnProperty('completed')) {
        attributes.completed = body.completed;
    }

    if (body.hasOwnProperty('description')) {
        attributes.description = body.description;
    }

    db.todo.findById(todoId).then(function(todo) {
        if (todo) {
            todo.update(attributes).then(function(todo) {
                res.json(todo.toJSON());
            }, function(e) {
                res.status(500).send(e);
            });
        } else {
            res.status(404).send();
        }
    }, function() {
        res.status(400).send();
    });
});

// POST /users/login
app.post('/users/login', function(req, res) {
    var body = _.pick(req.body, 'email', 'password');

    db.user.authenticate(body).then(function(user) {
        res.json(user.toPublicJSON());
    }, function() {
        res.status(401).send();
    });    
});

db.sequelize.sync({force: true}).then(function() {
    app.listen(port, function() {
        console.log('Express server started!!!');
    });
});