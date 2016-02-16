module.exports = function(sequelize, dataTypes) {
	return sequelize.define('todo', {
		description: {
			type: dataTypes.STRING,
			allowNull: false,
			validate: {
				//notEmpty: true
				len: [1, 250]
			}
		},
		completed: {
			type: dataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
	});
};