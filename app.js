const express = require('express');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');
const schema = require('./schema/schema')

const PORT = 5000;

const app = express();

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

setupDB();

function setupDB() {
    mongoose.connect('mongodb://localhost/graph', {useNewUrlParser: true})

    const db = mongoose.connection;
    db.on('error', err => console.log(`Connection Error`))
    db.once('open', ()=> console.log(`Connected to DB`) )
}


app.listen(PORT, (err) => {
    if (err) {
        console.log(err);
    }
    console.log(`Port ${PORT}  started `);
});
