const fs = require('fs');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const recastai = require('recastai').default;

const REQUEST_TOKEN = '40399fb5ea31b36c3c99f6ea4f528cc2';
const DEVELOPER_TOKEN = '64fbecbbb579e6db484aba871a439338';
const USER_SLUG = 'vale17accidentidellastoria';
const BOT_SLUG = 'ontology-app-bot';
const CONVERSATION_ID = 'test-1530310812548';

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
var objpropertiesArray = [];
var datapropArray = [];
var namedindividualArray = [];

var data_classes = {};
var data_objprops = {};
var data_dataprop = {};
var data_namedindividual = {};

//Classes attributes
var name_class;
var subclassof_class;
var description_class;
var onproperty_class;
var hasvalue_class;

//Object Properties attributes
var name_objprop;
var inverseof_objprop;
var domain_objprop;
var range_objprop;
var type_objprop;

//Data Properties attributes
var name_dataprop;
var domain_dataprop;
var range_dataprop;

//Named Individuals attributes
var name_namedindividual;
var type_namedindividual;
var specialization_namedindividual;

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

        classArray = [];
        objpropertiesArray = [];
        datapropArray = [];
        namedindividualArray = [];

        var blank_regex = /^\s*$/;

        var rows = data.toString().split('\n');

        var stack_classes = {};
        var counter_classes = 0;
        var counter_classes_global = 0;

        var stack_objprop = {};
        var counter_objprop = 0;
        var counter_objprop_global = 0;

        var stack_dataprop = {};
        var counter_dataprop = 0;
        var counter_dataprop_global = 0;

        var stack_namedindividual = {};
        var counter_namedindividual = 0;
        var counter_namedindividual_global = 0;

        rows.forEach(function(value){

            //Let's parse our object properties
            //==========================================================================
            
            if(value.includes(objectProperty_substring)) {
                if(counter_objprop_global === 0) {
                    stack_objprop["objprops"] = [];
                    counter_objprop_global++;
                }
                if(counter_objprop === 0){
                    counter_objprop++;
                }
            }

            if(typeof stack_objprop["objprops"] !== 'undefined'){
                if(counter_objprop == 1) {
                    if(!blank_regex.test(value)){
                        parseObjProps(value);
                    } else {
                        parseObjPropsAttributes(data_objprops, stack_objprop);
                        data_objprops = {};
                        counter_objprop = 0;
                    }
                }
            }
            

            //Let's parse our data type properties
            //==========================================================================

            if(value.includes(dataTypeProperty_substring)){
                if(counter_dataprop_global === 0){
                    stack_dataprop["dataprops"] = [];
                    counter_dataprop_global++;
                }
                if(counter_dataprop === 0){
                    counter_dataprop++;
                }
            }

            if(typeof stack_dataprop["dataprops"] !== 'undefined'){
                if(counter_dataprop == 1){
                    if(!blank_regex.test(value)){
                        parseDataProps(value);
                    } else {
                        parseDataPropAttributes(data_dataprop, stack_dataprop);
                        data_dataprop = {};
                        counter_dataprop = 0;
                    }
                }
            }

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
                        parseClassAttributes(data_classes, stack_classes);
                        data_classes = {};
                        counter_classes = 0;
                    }
                }
            }
            
            //Let's parse our named individuals
            //==========================================================================   
            
            //Write code here!!!

        });

        classArray.push(stack_classes);

        objpropertiesArray.push(stack_objprop);

        datapropArray.push(stack_dataprop);
    
        //res.status(200).end();
        //res.send((classArray));
        //res.send(objpropertiesArray);
        res.send(datapropArray);

    });

});

app.post('/first_level', (req,res) => {

    firstClassArray = [];

    for(var i = 0; i < classArray[0].classes.length; i++){
        var class_name = classArray[0].classes[i].name;
        var subclass = classArray[0].classes[i].subclassof;
        if(((subclass === "") || (typeof subclass === 'undefined')) && ((typeof class_name !== 'undefined') && (class_name !== ""))){
            firstClassArray.push(class_name);
        }

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
    
    secondClassArray = [];
    
    var choice_param = req.body.nlp.source;
    
    for(var i = 0; i < classArray[0].classes.length; i++){
        var class_name = classArray[0].classes[i].name;
        var subclass = classArray[0].classes[i].subclassof;
        if((typeof subclass !== 'undefined') && (subclass !== "") && (typeof class_name !== 'undefined') && (class_name !== "")){
            if(choice_param === subclass){
                secondClassArray.push(class_name);
                console.log(class_name);
            }
        }

    }
    
    var data_result_JSON = [];
    
    if(secondClassArray.length > 0){

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

    } else {
        res.json({
            replies: [{
                "type": "text",
                "content": `No subclasses found for ${choice_param}`,
              }]
        });
    }
    
    
})

app.listen(port, () => console.log(`Listening on port ${port}`));

function parseString(string){
    var first_split = string.split("#");
    var second_split = first_split[1].split(`"`);
    var result = second_split[0];
    return result;
}

function parseObjProps(value) {
    if(value.includes("#")){
        
        var value_str = parseString(value);
        
        if(value.includes(objectProperty_substring)){
            name_objprop = value_str;
        }
        if(value.includes(objectProperty_inverseof)) {
            inverseof_objprop = value_str;
        }
        if(value.includes(objectProperty_domain)) {
            domain_objprop = value_str;
        }
        if(value.includes(objectProperty_range)) {
            range_objprop = value_str;
        }
        if(value.includes(objectProperty_type)) {
            type_objprop = value_str;
        }
    }
}

function parseDataProps(value) {
    if(value.includes("#")){
        var value_str = parseString(value);
        
        if(value.includes(dataTypeProperty_substring)){
            name_dataprop = value_str;
        }
        if(value.includes(dataTypeProperty_domain)) {
            domain_dataprop = value_str;
        }
        if(value.includes(dataTypeProperty_range)) {
            range_dataprop = value_str;
        }
    }
}

function parseClasses(value){
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

function parseObjPropsAttributes(data, stack){
    data = {
        "name": name_objprop,
        "inverseof": inverseof_objprop,
        "domain": domain_objprop,
        "range": range_objprop,
        "type": type_objprop
    }

    stack["objprops"].push(data);

    name_objprop = "";
    inverseof_objprop = "";
    domain_objprop = "";
    range_objprop = "";
    type_objprop = "";
}

function parseDataPropAttributes(data, stack){
    data = {
        "name": name_dataprop,
        "domain": domain_dataprop,
        "range": range_dataprop
    }

    stack["dataprops"].push(data);
    name_dataprop = "";
    domain_dataprop = "";
    range_dataprop = "";
}

function parseClassAttributes(data, stack) {
    data = {
        "name": name_class,
        "subclassof": subclassof_class,
        "description": description_class,
        "onproperty": onproperty_class, 
        "hasvalue": hasvalue_class
    }

    stack["classes"].push(data);
    
    name_class = "";
    subclassof_class = "";
    description_class = "";
    onproperty_class = "";
    hasvalue_class = "";
}
