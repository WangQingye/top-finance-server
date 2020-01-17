var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var typeSchema = new Schema({
    type: String,
    typeId: Number
});
mongoose.model('Type', typeSchema)