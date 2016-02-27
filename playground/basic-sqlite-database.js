var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/basic-sqlite-database.sqlite'
});

var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			//notEmpty: true
			len: [1, 250]
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
});

var User = sequelize.define('user', {
	email: Sequelize.STRING
});

Todo.belongsTo(User);
User.hasMany(Todo);

sequelize.sync({
	force: false
}).then(function() {
	console.log("Everything is synced");

	// To get all the todos for the user
	User.findById(1).then(function(user){
		user.getTodos({
			where: {
				completed: false
			}
		}).then(function(todos){
			todos.forEach(function(todo){
				console.log(todo.toJSON());
			});
		});
	});

	// To create user and todo and then map the todo to the user.
	// User.create({
	// 	email: 'sudharsan@gmail.com'
	// }).then(function(){
	// 	return Todo.create({
	// 		description: 'Good coding practice'
	// 	});
	// }).then(function(todo){
	// 	User.findById(1).then(function(user){
	// 		user.addTodo(todo);
	// 	});
	// });

	// Todo.findById(3).then(function(todo){
	// 	if(todo){
	// 		console.log(todo.toJSON());
	// 	}else{
	// 		console.log('Sorry, todo not found!!!');
	// 	}
	// })

	// Todo.create({
	// 		description: 'Walk the dogs',
	// 	}).then(function(todo) {
	// 		return Todo.create({
	// 			description: 'Clean the code'
	// 		})
	// 	}).then(function(todo) {
	// 		//return Todo.findById(1)
	// 		return Todo.findAll({
	// 			where: {
	// 				//completed: false
	// 				description: {
	// 					$like: '%clean%'
	// 				}
	// 			}
	// 		});
	// 	}).then(function(todos) {
	// 		if (todos) {
	// 			todos.forEach(function(todo){
	// 				console.log(todo.toJSON());
	// 			});
	// 		} else {
	// 			console.log('No todo found!!!');
	// 		}
	// 	})
	// 	.catch(function(e) {
	// 		console.log(e);
	// 	})
});