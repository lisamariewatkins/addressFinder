var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AddressSchema = new Schema({
	search:{
		type: String
	},
	timestamp:{
		type: Date,
		default: Date.now
	}
});

var Address = mongoose.model('Address', AddressSchema);

module.exports = Address;