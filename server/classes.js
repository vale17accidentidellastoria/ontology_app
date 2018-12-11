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

var classArray = [];


var data_classes = {};

//Classes attributes
var name_class;
var subclassof_class;
var description_class;
var onproperty_class;
var hasvalue_class;

var app = express();
app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    })
    .use(bodyParser.json());

app.post('/stack', (req,res) => {
        
    fs.readFile('../ontology/prova.owl', 'utf8', function read(err, data) {
        
        if (err) {
            console.log("ERROR");
            throw err;
        }

        classArray = [];

        var blank_regex = /^\s*$/;

        var rows = data.toString().split('\n');

        var stack_classes = {};
        var counter_classes = 0;
        var counter_classes_global = 0;

        rows.forEach(function(value){

            //Let's parse our classes
            //==========================================================================
            
            if(value.includes(class_substring)){
                if(counter_classes_global === 0){
                    stack_classes["classes"] = [];
                    counter_classes_global++;
                }
                if(counter_classes === 0) {
                    counter_classes++;
                }
            }

            if(typeof stack_classes["classes"] !== 'undefined'){
                if(counter_classes == 1) {
                    if(!blank_regex.test(value)) {
                        parseClasses(value);
                    } else {
                        data_classes = {
                            "name": name_class,
                            "subclassof": subclassof_class,
                            "description": description_class,
                            "onproperty": onproperty_class, 
                            "hasvalue": hasvalue_class
                        }
                        stack_classes["classes"].push(data_classes);
                        
                        data_classes = {};
                        counter_classes = 0;
                        
                        name_class = "";
                        subclassof_class = "";
                        description_class = "";
                        onproperty_class = "";
                        hasvalue_class = "";
                    }
                }
            }
            
            //==========================================================================

        });

        classArray.push(stack_classes);
    
        res.send((classArray));
        //res.send(stack_classes);

    });

});

app.listen(port, () => console.log(`Listening on port ${port}`));

function parseString(string){
    var first_split = string.split("#");
    var second_split = first_split[1].split(`"`);
    var result = second_split[0];
    return result;
}

function parseClasses(value){
    if(value.includes("#")){
        
        var value_str = parseString(value);
        
        if(value.includes(class_substring)){
            //stack_classes.push(["name", value_str]);
            //stack_classes.push({"name": value_str});
            //stack_classes["name"] = value_str;
            name_class = value_str;
            //console.log(1);
        }
        if(value.includes(subclass_substring)) {
            //stack_classes.push(["subclassof", value_str]);
            //stack_classes.push({"subclassof": value_str});
            //stack_classes["subclassof"] = value_str;
            subclassof_class = value_str;
            //console.log(2);
        }
        if(value.includes(class_description)) {
            //stack_classes.push(["description", value_str]);
            //stack_classes.push({"description": value_str});
            //stack_classes["description"] = value_str;
            description_class = value_str;
            //console.log(3);
        }
        if(value.includes(class_onproperty)) {
            //stack_classes.push(["onproperty", value_str]);
            //stack_classes.push({"onproperty": value_str});
            //stack_classes["onproperty"] = value_str;
            onproperty_class = value_str;
            //console.log(4);
        }
        if(value.includes(class_hasvalue)) {
            //stack_classes.push(["hasvalue", value_str]);
            //stack_classes.push({"hasvalue": value_str});
            //stack_classes["hasvalue"] = value_str;
            hasvalue_class = value_str;
            //console.log(5);
        }
    }
}