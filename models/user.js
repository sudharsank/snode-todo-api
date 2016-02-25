var bcrypt = require('bcryptjs');
var _ = require('underscore');
module.exports = function(sequelize, dataTypes) {
	var user = sequelize.define('user', {
		email: {
			type: dataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true
			}
		},
		salt: {
			type: dataTypes.STRING
		},
		password_hash: {
			type: dataTypes.STRING
		},
		password: {
			type: dataTypes.VIRTUAL,
			allowNull: false,
			validate: {
				len: [6, 15]
			},
			set: function(value) {
				var salt = bcrypt.genSaltSync(10);
				var hashedPassword = bcrypt.hashSync(value, salt);

				this.setDataValue('password', value);
				this.setDataValue('salt', salt);
				this.setDataValue('password_hash', hashedPassword);
			}
		}
	}, {
		hooks: {
			beforeValidate: function(user, options) {
				if (_.isString(user.email) && user.email.trim().length > 0)
					user.email = user.email.toLowerCase();
			}
		},
		classMethods: {
			authenticate: function(body) {
				return new Promise(function(resolve, reject) {
					var where = {};
					if (!_.isString(body.email) || body.email.trim().length === 0 || !_.isString(body.password) || body.password.length === 0) {
						// return res.status(400).json({
						// 	error: "Invalid attributes and values!!!"
						// });
						return reject({
							error: "Invalid attributes and values!!!"
						});
					}

					where.email = body.email;
					user.findOne({
						where: where
					}).then(function(user) {
						if (!user) {
							// res.status(404).json({
							// 	message: "User Not found !!!"
							// })
							reject();
						} else {
							if (bcrypt.compareSync(body.password, user.password_hash)) {
								//res.status(200).json(user.toPublicJSON());
								resolve(user);
							} else {
								// res.status(401).json({
								// 	message: "Invalid Email ID or Password !!!"
								// });
								reject();
							}
						}

					}, function(e) {
						//res.status(500).json(e);
						reject();
					})
				});
			}
		},
		instanceMethods: {
			toPublicJSON: function() {
				var json = this.toJSON();
				return _.pick(json, 'id', 'email', 'createdAt', 'updatedAt');
			}
		}
	});

	return user;
};