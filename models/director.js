const {Schema, model} = require('mongoose');

const DirectorSchema = new Schema({
    name: String,
    age: Number
});

module.exports = model('directors', DirectorSchema)
