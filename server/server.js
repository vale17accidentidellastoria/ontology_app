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
var firstClassArray = [];
var secondClassArray = [];

var data_classes = {};

//Classes attributes
var name_class;
var subclassof_class;
var description_class;
var onproperty_class;
var hasvalue_class;

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
    
        res.status(200).end();
        //res.send((classArray));

    });

});

app.post('/first_level', (req,res) => {

    for (var i = 0; i < classArray[0].classes.length; i++){
        firstClassArray.push(classArray[0].classes[i].name);
    }
    
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
    res.send((classArray));
    /*
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
    */
})

app.listen(port, () => console.log(`Listening on port ${port}`));

function parseString(string){
    var first_split = string.split("#");
    var second_split = first_split[1].split(`"`);
    var result = second_split[0];
    return result;
}

function parseClasses(value) {
    if(value.includes("#")){
        
        var value_str = parseString(value);
        
        if(value.includes(class_substring)){
            name_class = value_str;
        }
        if(value.includes(subclass_substring)) {
            subclassof_class = value_str;
        }
        if(value.includes(class_description)) {
            description_class = value_str;
        }
        if(value.includes(class_onproperty)) {
            onproperty_class = value_str;
        }
        if(value.includes(class_hasvalue)) {
            hasvalue_class = value_str;
        }
    }
}