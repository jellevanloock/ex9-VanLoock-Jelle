// inladen van de dependencies
var express = require('express'); // eenvoudige webserver in node js
var parser = require('body-parser'); // extensie op express voor eenvoudig body uit te lezen
var mongoose = require('mongoose'); // Aangeraden door Jonas Cristens (andere package dan MongoClient)

mongoose.connect('mongodb://localhost:27017/MijnAPI'); //Databank dat je raadpleegt in Robomongo

// onze lokale 'datastore'. deze variable bewaart onze state.
var dalLocatie = require('./storagelocaties.js');
var validationlocaties = require('./validatelocaties.js');

var dalBeweging = require('./storagebewegingen.js');
var validationbewegingen = require('./validatebewegingen.js');

var dalAanwezig = require('./storageaanwezigheden.js');
var validationaanwezigheden = require('./validateaanwezigheden');

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
app.get('/locaties/:id', function (request, response) {
    dalLocatie.findLocaties(request.params.id, function (err, locatie) {
        if (locatie) {
        response.send(locatie);
    } else {
        err;
    }
    });
});

// opvangen van een POST op /locaties.
app.post("/locaties", function(request, response) {
    // de data in de body wordt toegekend aan onze locatie variabele.
    // deze is enkel opgevuld indien het JSON is.
    var locatie = request.body;
    // Valideren dat velden bestaan
    var errors = validationlocaties.fieldsNotEmpty(locatie, "naam_drone", "mac_address_drone", "naam_locatie", "beschrijving");
    if (errors) {
        response.status(400).send({
            msg: "Volgende velden zijn verplicht of fout: " + errors.concat()
        });
        return;
    }
    /*
    // Valideren dat we niet dezelfde locatie 2x hebben
    var existingLocatie = dal.findLocatie(locatie.naam_drone);
    if (existingLocatie) {
        response.status(409).send({
            msg: "Naam_drone moet uniek zijn!",
            link: "../locaties/" + existingLocatie.id
        });
        return;
    }
    Dit hoeft niet meer omdat we met moongoose zeggen dat ze uniek of niet uniek moeten zijn
    */
    dalLocatie.saveLocaties(locatie, function(err, locatie) {
        if(err){
            throw err;
        }
        response.send(locatie);
    });
});

// opvangen van een GET op /bewegingen
app.get('/bewegingen', function (request, response) {
    dalBeweging.AllBewegingen(function (err, beweging) {
        if(err){
            throw err;
        }
        response.send(beweging);
    });
});

// opvangen van een GET op /bewegingen/:bewegingid
app.get('/bewegingen/:id', function (request, response) {
    dalBeweging.findBewegingen(request.params.id, function (err, beweging) {
        if (beweging) {
        response.send(beweging);
    } else {
        err;
    }
    });
});

// opvangen van een POST op /bewegingen.
app.post("/bewegingen", function(request, response) {
    // de data in de body wordt toegekend aan onze locatie variabele.
    // deze is enkel opgevuld indien het JSON is.
    var beweging = request.body;
    // Valideren dat velden bestaan
    var errors = validationbewegingen.fieldsNotEmpty(beweging, "bewegingid", "beginlocatie", "eindlocatie", "duur", "weer", "beweging");
    if (errors) {
        response.status(400).send({
            msg: "Volgende velden zijn verplicht of fout: " + errors.concat()
        });
        return;
    }
    dalBeweging.saveBewegingen(beweging, function(err, beweging) {
        if(err){
            throw err;
        }
        response.send(beweging);
    });
});

// opvangen van een GET op /aanwezigheden
app.get('/aanwezigheden', function (request, response) {
    dalAanwezig.AllAanwezigheden(function (err, aanwezig) {
        if(err){
            throw err;
        }
        response.send(aanwezig);
    });
});

// opvangen van een GET op /aanwezigheden/:ID
app.get('/aanwezigheden/:id', function (request, response) {
    dalAanwezig.findAanwezigheden(request.params.id, function (err, aanwezig) {
        if (aanwezig) {
        response.send(aanwezig);
    } else {
        err;
    }
    });
});

// opvangen van een POST op /aanwezigheden.
app.post("/aanwezigheden", function(request, response) {
    // de data in de body wordt toegekend aan onze locatie variabele.
    // deze is enkel opgevuld indien het JSON is.
    var personen = request.body;
    // Valideren dat velden bestaan
    var errors = validationaanwezigheden.fieldsNotEmpty(personen, "ID", "naam_drone", "aantal", "naam_locatie", "uur");
    if (errors) {
        response.status(400).send({
            msg: "Volgende velden zijn verplicht of fout: " + errors.concat()
        });
        return;
    }
    dalAanwezig.saveAanwezigheden(personen, function(err, personen) {
        if(err){
            throw err;
        }
        response.send(personen);
    });
});

// de server starten op poort 4567
app.listen(4567);

// Bevestiging
console.log("Server started");

