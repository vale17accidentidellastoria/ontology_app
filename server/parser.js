const fs = require('fs');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const port = 3030 | process.env.PORT;

const dataTypeProperty_substring = "<owl:DatatypeProperty ";
const dataTypeProperty_domain = "<rdfs:domain ";
const dataTypeProperty_range = "<rdfs:range ";

const objectProperty_substring = "<owl:ObjectProperty ";
const objectProperty_inverseof = "<owl:inverseOf ";
const objectProperty_domain = "<rdfs:domain ";
const objectProperty_range = "<rdfs:range ";
const objectProperty_type = "<rdf:type ";

const class_substring = "<owl:Class ";
const subclass_substring = "<rdfs:subClassOf ";
const class_description = "<rdf:Description ";
const class_onproperty = "<owl:onProperty ";
const class_hasvalue = "<owl:hasValue ";

const namedIndividual_substring = "<owl:NamedIndividual ";
const namedIndividual_type = "<rdf:type ";
const namedIndividual_specializedin = "<isSpecializedIn ";

var dataTypePropertyArray = [];
var objectPropertyArray = [];
var classArray = [];
//var firstClassArray = [];
//var secondClassArray = [];
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

//Stack which elements are key-value pairs
//One stack for each class, each stack has a mapping of its elements
app.post('/stack', (req,res) => {
        
    fs.readFile('../ontology/prova.owl', 'utf8', function read(err, data) {
        
        if (err) {
            console.log("ERROR");
            throw err;
        }

        objectPropertyArray = [{}];
        dataTypePropertyArray = [{}];
        classArray = [{}];
        firstClassArray = [{}];
        secondClassArray = [{}];
        namedIndividualArray = [{}];

        var blank_regex = /^\s*$/;

        var rows = data.toString().split('\n');

        var stack_classes = [{}];
        var stack_objProperty = [{}];
        var stack_dataTypeProperty = [{}];
        var stack_namedIndividual = [{}];
        var counter_classes = 0;
        var counter_objProperty = 0;
        var counter_dataTypeProperty = 0;
        var counter_namedIndividual = 0;

        rows.forEach(function(value){

            //Let's parse our classes
            //==========================================================================
            
            if(value.includes(class_substring)){
                if(counter_classes === 0) {
                    var kind = "classes";
                    stack_classes.push({kind});
                    counter_classes++;
                }
            }

            if(typeof stack_classes[1] !== 'undefined'){
                if(!(blank_regex.test(value)) && stack_classes[1].kind==="classes") {
                    parseClasses(value, stack_classes, counter_classes);
                } else if(stack_classes.length > 0) {
                    classArray.push({stack_classes});
                    stack_classes = [{}];
                    counter_classes = 0;
                }
            }
            
            //==========================================================================

        });
    
        //res.status(200).end();
        res.send((classArray));

        //console.log(classArray[2]);
        //console.log(classArray[1].stack_classes[2].name);
        //console.log(classArray[1].stack_classes[2]);      
        
        /*
        for(var i = 1; i < classArray.length; i++) {
            var count = 0;
            for(var j = 1; j < classArray[i].stack_classes.length; j++){
                
                if((typeof classArray[i].stack_classes[j].name !== 'undefined') || (typeof classArray[i].stack_classes[j].subclassof !== 'undefined')) {
                    //console.log("Class: " + classArray[i].stack_classes[j].name);
                    //console.log("Subclass of: " + classArray[i].stack_classes[j].subclassof);
                    //console.log("==========");
                }
                
                //console.log(classArray[i].stack_classes[j]);
            }
        }
        */

    });

});

app.listen(port, () => console.log(`Listening on port ${port}`));

function parseString(string){
    var first_split = string.split("#");
    var second_split = first_split[1].split(`"`);
    var result = second_split[0];
    return result;
}

function parseClasses(value, stack_classes, counter_classes){
    if(value.includes("#")){
        var value_str = parseString(value);
        if(counter_classes === 1) {
            if(value.includes(class_substring)){
                //stack_classes.push(["name", value_str]);
                stack_classes.push({"name": value_str});
            }
            if(value.includes(subclass_substring)) {
                //stack_classes.push(["subclassof", value_str]);
                stack_classes.push({"subclassof": value_str});
            }
            if(value.includes(class_description)) {
                //stack_classes.push(["description", value_str]);
                stack_classes.push({"description": value_str});
            }
            if(value.includes(class_onproperty)) {
                //stack_classes.push(["onproperty", value_str]);
                stack_classes.push({"onproperty": value_str});
            }
            if(value.includes(class_hasvalue)) {
                //stack_classes.push(["hasvalue", value_str]);
                stack_classes.push({"hasvalue": value_str});
            }
        }
    }
}