var _ = require('underscore');
module.exports = function(sequelize, dataTypes) {
	return sequelize.define('user', {
		email: {
			type: dataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true
			}
		},
		password: {
			type: dataTypes.STRING,
			allowNull: false,
			validate: {
				len: [6, 15]
			}
		}
	}, {
		hooks: {
			beforeValidate: function(user, options) {
				if (_.isString(user.email) && user.email.trim().length > 0)
					user.email = user.email.toLowerCase();
			}
		}
	});
};