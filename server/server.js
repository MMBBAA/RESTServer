require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true); //elimina el problema DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
const app = express();
const bodyParser = require('body-parser');


// parse application/x-www-form-urlencoded

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//uso de rutas del usuario
app.use(require('./routes/usuario'));
/*

app.get('/', function(req, res) {
    res.json('Hola Mundo')
})
*/
/*
mongoose.connect('mongodb://localhost:27017/cafe', { useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {

    if (err) throw err;
    console.log('Base de datos ONLINE');
});*/

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {

    if (err) throw err;

    console.log('Base de datos ONLINE');

});


//3000 desarrollo y otros produccion
app.listen(process.env.PORT, () => {
    console.log("escuchando puerto: ", process.env.PORT);
});