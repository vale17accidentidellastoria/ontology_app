const fs = require('fs');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const port = 3030 | process.env.PORT;

const dataTypeProperty_substring = "<owl:DatatypeProperty ";
const objectProperty_substring = "<owl:ObjectProperty ";
const class_substring = "<owl:Class ";
const subclass_substring = "<rdfs:subClassOf ";
const namedIndividual_substring = "<owl:NamedIndividual ";

var dataTypePropertyArray = [];
var objectPropertyArray = [];
var classArray = [];
var firstClassArray = [];
var secondClassArray = [];
var namedIndividualArray = [];

var resulting_arrays = [];

Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

var app = express();
app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    })
    .use(bodyParser.json());

app.post('/process', (req,res) => {
    fs.readFile('../ontology/my-food-ontology-rdfxml.owl', 'utf8', function read(err, data) {
        
        if (err) {
            console.log("ERROR");
            throw err;
        }

        objectPropertyArray = [];
        dataTypePropertyArray = [];
        classArray = [];
        firstClassArray = [];
        secondClassArray = [];
        namedIndividualArray = [];

        var prev = "";
        var current = "";
        var blank_regex = /^\s*$/;

        var rows = data.toString().split('\n');

        rows.forEach(function(value){

            prev = current;
            current = value;

            //Finds all ObjectProperties
            if(value.includes(objectProperty_substring)) {
                var result1 = parseString(value);
                if(!objectPropertyArray.includes(result1)){
                    objectPropertyArray.push(result1);
                }
            }

            //Finds all DataTypeProperties
            if(value.includes(dataTypeProperty_substring)){
                var result2 = parseString(value);
                if(!dataTypePropertyArray.includes(result2)){
                    dataTypePropertyArray.push(result2);
                }
            }

            //Finds all Classes
            if(value.includes(class_substring)){
                var result3 = parseString(value);
                if(!classArray.includes(result3)){
                    classArray.push(result3);
                    secondClassArray.push(result3);
                }
            }

            //Finds all Named Individuals
            if(value.includes(namedIndividual_substring)){
                var result4 = parseString(value);
                if(!namedIndividualArray.includes(result4)) {
                    namedIndividualArray.push(result4);
                }
            }

            //Finds all First-Level Classes
            if(prev.includes(class_substring) && blank_regex.test(current)) {
                var result5 = parseString(prev);
                if(!firstClassArray.includes(result5)) {
                    firstClassArray.push(result5);
                }
            }

        });

        //Finds all Second-Level Classes by making the difference between classes and first-level classes
        secondClassArray = classArray.diff(firstClassArray);
        
        resulting_arrays = [objectPropertyArray, dataTypePropertyArray, classArray, namedIndividualArray, firstClassArray, secondClassArray];

        res.status(200).end();

    });
});

app.post('/first_level', (req,res) => {
    var data_result_JSON = [];

    Object.keys(firstClassArray).forEach(function(object){
        data_result_JSON.push({
        "title": firstClassArray[object],
        "value": firstClassArray[object]
        });
    });

    res.json({
        replies: [{
            "type": "quickReplies",
            "content": {
                "title": "First-Level Classes",
                "buttons": data_result_JSON
            }
        }]
    });
})

app.post('/second_level', (req,res) => {
    var data_result_JSON = [];
    
    Object.keys(secondClassArray).forEach(function(object){
        data_result_JSON.push({
        "title": secondClassArray[object],
        "type": "BUTTON_TYPE",
        "value": secondClassArray[object]
        });
    });

    res.json({
        replies: [{
            "type": "buttons",
            "content": {
                "title": "Second-Level Classes",
                "buttons": data_result_JSON
            }
        }]
    });
})

app.listen(port, () => console.log(`Listening on port ${port}`));

function parseString(string){
    var first_split = string.split("#");
    var second_split = first_split[1].split(`"`);
    var result = second_split[0];
    return result;
}

function printResults() {
    console.log("DataTypeProperty: ");
    dataTypePropertyArray.forEach(function(value) {
        console.log(value);
    })
    console.log("****************");
    console.log("ObjectProperty: ");
    objectPropertyArray.forEach(function(value) {
        console.log(value);
    })
    console.log("****************");
    console.log("Class: ");
    classArray.forEach(function(value) {
        console.log(value);
    })
    console.log("****************");
    console.log("NamedIndividual: ");
    namedIndividualArray.forEach(function(value) {
        console.log(value);
    })
    console.log("****************");
}

