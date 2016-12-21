
// inladen van de dependencies
var express = require('express'); // eenvoudige webserver in node js
var parser = require('body-parser'); // extensie op express voor eenvoudig body uit te lezen
var mongoose = require("mongoose"); // Aangeraden door Jonas Cristens (andere package dan MongoClient)
mongoose.connect('mongodb://localhost:27017/MijnAPI');

// onze lokale 'datastore'. deze variable bewaart onze state.
var dalLocatie = require("./storagelocaties.js");

// aanmaken van de webserver variabele
var app = express();
// automatische json-body parsers van request MET media-type application/json gespecifieerd in de request.
app.use(parser.json());

// opvangen van een GET op /locaties
app.get('/locaties', function (request, response) {
    dalLocatie.AllLocaties(function (err, locatie) {
        if(err){
            throw err;
        }
        response.send(locatie);
    });

});

// opvangen van een GET op /locaties/:naam_drone
app.get("/locaties/:id", function (request, response) {

    dalLocatie.findLocaties(request.params.id, function (err, locatie) {
        if(err){
            throw err;
        }
        response.send(locatie);
    });
});



// de server starten op poort 4567
app.listen(4567);

// Bevestiging
console.log("Server started");

