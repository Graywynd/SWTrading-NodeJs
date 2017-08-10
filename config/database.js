const crypto = require('crypto').randomBytes(256).toString('hex');
module.exports = {
	uri : 'mongodb://dbuser1:rootpass@ds129003.mlab.com:29003/babycare',
	secret : crypto,
	db : 'babycare'
}