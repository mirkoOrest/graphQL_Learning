const {Schema, model} = require('mongoose');

const MovieSchema = new Schema({
    name: String,
    genre: String,
    directorID: String
});

module.exports = model('movies', MovieSchema)

