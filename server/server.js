const fs = require('fs');
const express = require('express');
const path = require('path');

const PORT = 3030 | process.env.PORT;

const dataTypeProperty_substring = "<owl:DatatypeProperty ";
const objectProperty_substring = "<owl:ObjectProperty ";
const class_substring = "<owl:Class ";
const namedIndividual_substring = "<owl:NamedIndividual ";

var dataTypePropertyArray = [];
var objectPropertyArray = [];
var classArray = [];
var namedIndividualArray = [];

var resulting_arrays = [];

var app = express();
app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

app.post('/process', (req,res) => {
    fs.readFile('../ontology/my-food-ontology-rdfxml.owl', 'utf8', function read(err, data) {
        objectPropertyArray = [];
        dataTypePropertyArray = [];
        classArray = [];
        namedIndividualArray = [];

        if (err) {
            console.log("ERROR");
            throw err;
        }

        var rows = data.toString().split('\n');
        rows.forEach(function(value){
            if(value.includes(objectProperty_substring)) {
                var result1 = parseString(value);
                objectPropertyArray.push(result1);
            }
            if(value.includes(dataTypeProperty_substring)){
                var result2 = parseString(value);
                dataTypePropertyArray.push(result2);
            }
            //TODO: manage first-level classes and second-level classes
            if(value.includes(class_substring)){
                var result3 = parseString(value);
                classArray.push(result3);
            }
            if(value.includes(namedIndividual_substring)){
                var result4 = parseString(value);
                namedIndividualArray.push(result4);
            }
        });

        resulting_arrays = [objectPropertyArray, dataTypePropertyArray, classArray, namedIndividualArray];

        //printResults();

        res.send(resulting_arrays);

    })
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

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

