const crypto = require('crypto').randomBytes(256).toString('hex');
module.exports = {
	uri : 'mongodb://dbuser1:rootpass@ds157799.mlab.com:57799/swtrading',
	secret : crypto,
	db : 'swtrading'
}