const fs = require('fs');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3030;

const deleteFirstClassIntents = require('./controllers/create_intents/deleteFirstClassIntents');
const deleteSecondClassIntents = require('./controllers/create_intents/deleteSecondClassIntents');

//Calling the external functions which help in setting attributes for all ontology properties
const parserObjPropsAttr = require('./controllers/parser_attributes/parserObjPropsAttr');
const parserClassesAttr = require('./controllers/parser_attributes/parserClassesAttr');
const parserDataPropsAttr = require('./controllers/parser_attributes/parserDataPropsAttr');
const parserNamedIndsAttr = require('./controllers/parser_attributes/parserNamedIndsAttr');

//Functions which help to parse all the properties in the ontology and their different kinds
const parserObj = require('./controllers/parser_functions/parserObj');
const parserNamedInds = require('./controllers/parser_functions/parserNamedInds');
const parserDataProps = require('./controllers/parser_functions/parserDataProps');
const parserClasses = require('./controllers/parser_functions/parserClasses');

//These are all the strings which represents specific tags in the RDF ontology
//Strings for dataTypeProperty RDF tag
const dataTypeProperty_substring = "<owl:DatatypeProperty ";
const dataTypeProperty_domain = "<rdfs:domain ";
const dataTypeProperty_range = "<rdfs:range ";
//Object which contains all the strings representing dataTypeProperty tags to be easier to manage
const str_dataprops = {dataTypeProperty_substring, dataTypeProperty_domain, dataTypeProperty_range};

//Strings for objectProperty RDF tag
const objectProperty_substring = "<owl:ObjectProperty ";
const objectProperty_inverseof = "<owl:inverseOf ";
const objectProperty_domain = "<rdfs:domain ";
const objectProperty_range = "<rdfs:range ";
const objectProperty_type = "<rdf:type ";
//Object which contains all the strings representing objectProperty tags to be easier to manage
const str_objprops = {objectProperty_substring, objectProperty_inverseof, objectProperty_domain, objectProperty_range, objectProperty_type};

//Strings for class RDF tag
const class_substring = "<owl:Class ";
const subclass_substring = "<rdfs:subClassOf ";
const class_description = "<rdf:Description ";
const class_onproperty = "<owl:onProperty ";
const class_hasvalue = "<owl:hasValue ";
//Object which contains all the strings representing class tags to be easier to manage
const str_classes = {class_substring, subclass_substring, class_description, class_onproperty, class_hasvalue};

//Strings for namedIndividuals RDF tag
const namedIndividual_substring = "<owl:NamedIndividual ";
const namedIndividual_type = "<rdf:type ";
//TODO: find a way to make "isSpecializedIn" independent from the ontology
//const namedIndividual_specializedin = "<isSpecializedIn "; //specializedIn is specific to food ontology
//Object which contains all the strings representing namedIndividual tags to be easier to manage
//const str_named = {namedIndividual_substring, namedIndividual_type, namedIndividual_specializedin};
const str_named = {namedIndividual_substring, namedIndividual_type};

//These are all variables which are helpful for the parsing
//This array will contain all the classes in the ontology
var classArray = [];

//In this array will be saved all the first classes in the ontology
var firstClassArray = [];

//In this array will be saved all the second level classes for a chosen first class in the ontology
var secondClassArray = [];

//Array in which there are all the first level classes which aren't subclassed
var noSubclassedClassesArray = [];

//This array will contain all the object properties in the ontology
var objpropertiesArray = [];

//This array will contain all the data properties in the ontology
var datapropArray = [];

//This array will contain all the named individuals in the ontology
var namedindividualArray = [];

//Objects where will be saved all the attributes according to classes, object properties, data properties, named individuals
var data_classes = {};
var data_objprops = {};
var data_dataprop = {};
var data_namedindividual = {};

//Classes attributes
var name_class = "";
var subclassof_class = "";
var description_class = "";
var onproperty_class = "";
var hasvalue_class = "";
//Object created to keep all the attribute values for classes
var data_class_values = {name_class, subclassof_class, description_class, onproperty_class, hasvalue_class};

//Object Properties attributes
var name_objprop = "";
var inverseof_objprop = "";
var domain_objprop = "";
var range_objprop = "";
var type_objprop = "";
//Object created to keep all the attribute values for object properties
var data_obj_values = {name_objprop, inverseof_objprop, domain_objprop, range_objprop, type_objprop};
//Object created to keep all the tag names for Object Properties parsed
var objprops_tags = [];

//Data Properties attributes
var name_dataprop = "";
var domain_dataprop = "";
var range_dataprop = "";
//Object created to keep all the attribute values for data properties
var data_prop_values = {name_dataprop, domain_dataprop, range_dataprop};

//Named Individuals attributes
var name_namedindividual = "";
var type_namedindividual = "";
//var specialization_namedindividual = "";
//Object created to keep all the attribute values for named individuals
//var data_named_values = {name_namedindividual, type_namedindividual, specialization_namedindividual};
var data_named_values = {name_namedindividual, type_namedindividual};

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

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

app.get('/', (req,res) => {
    res.send("OK");
})

//Process does the parsing of the ontology files
app.post('/process', (req,res) => {
    
    //Reads the Restauration Ontology Owl file
    fs.readFile('./ontology/my-food-ontology-rdfxml.owl', 'utf8', function read(err, data) {
        
        if (err) {
            console.log("ERROR");
            throw err;
        }

        //All the arrays representing classes, object props, data props and named individuals are initilized when the reading of a file begins
        classArray = [];
        objpropertiesArray = [];
        datapropArray = [];
        namedindividualArray = [];

        var blank_regex = /^\s*$/;

        //The parser reads each single row of the input file
        var rows = data.toString().split('\n');

        //The following are all variables which supports the parsing and make it easier

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
                    if(!blank_regex.test(value)){ //Intervenire qui
                        var objprop_tag = {"tag" : ""};
                        parserObj(value, data_obj_values, str_objprops, objprop_tag);
                        if ((objprop_tag.tag !== "") && (typeof objprop_tag.tag !== 'undefined')){
                            objprops_tags.push("<" + objprop_tag.tag + " ");
                        }
                    } else {
                        parserObjPropsAttr(data_obj_values, data_objprops, stack_objprop);
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
                        parserDataProps(value, data_prop_values, str_dataprops);
                    } else {
                        parserDataPropsAttr(data_prop_values, data_dataprop, stack_dataprop);
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
                        parserClasses(value, data_class_values, str_classes);
                    } else {
                        parserClassesAttr(data_class_values, data_classes, stack_classes);
                        data_classes = {};
                        counter_classes = 0;
                    }
                }
            }
            
            
            //Let's parse our named individuals
            //==========================================================================   
            
            if(value.includes(namedIndividual_substring)){
                if(counter_namedindividual_global === 0){
                    stack_namedindividual["namedinds"] = [];
                    counter_namedindividual_global++;
                }
                if(counter_namedindividual === 0){
                    counter_namedindividual++;
                }
            }

            if(typeof stack_namedindividual["namedinds"] !== 'undefined'){
                if(counter_namedindividual == 1){
                    if(!blank_regex.test(value)){
                        parserNamedInds(value, data_named_values, str_named, objprops_tags);
                    } else {
                        parserNamedIndsAttr(data_named_values, data_namedindividual, stack_namedindividual);
                        data_namedindividual = {};
                        counter_namedindividual = 0;
                    }
                }
            }
            

        });

        //In this array there are all the classes object
        classArray.push(stack_classes);

        //In this array there are all the object properties objects
        objpropertiesArray.push(stack_objprop);

        //In this array there are all the data properties objects
        datapropArray.push(stack_dataprop);

        //In this array there are all the named individuals properties
        namedindividualArray.push(stack_namedindividual);

        //console.log(objprops_tags);
    
        //res.status() to work with Recast.ai
        //res.status(200).end();
        //Just to test
        //res.send(classArray);
        //res.send(objpropertiesArray);
        //res.send(datapropArray);
        //res.send(namedindividualArray);
        
        //Shows all the properties found by the parser divided by object props, data props, classes and named individuals
        var all_properties = [objpropertiesArray, datapropArray, classArray, namedindividualArray];
        res.send(all_properties);
        
    });

});

// /first_level shows all the first level classes
app.post('/first_level', (req,res) => {

    //Array in which first level classes will be put
    firstClassArray = [];
    //Array in which names_chosen_param of first level classes will be put to be shown in the JSON
    firstClassArrayNames = [];
    //Array in which there are all the first level classes which aren't subclassed
    noSubclassedClassesArray = [];
    
    for(var i = 0; i < classArray[0].classes.length; i++){
        var class_name = classArray[0].classes[i].name;
        var subclass = classArray[0].classes[i].subclassof;
        if(((subclass === "") || (typeof subclass === 'undefined')) && ((typeof class_name !== 'undefined') && (class_name !== ""))){
            firstClassArray.push(classArray[0].classes[i]);
            //add all the same element in firstClassArray to noSubclassedClassesArray in order then to be able to 
            noSubclassedClassesArray.push(classArray[0].classes[i]);
            firstClassArrayNames.push(class_name);
        }
    }    
    
    var data_result_JSON = [];
    var intent_values = [];

    Object.keys(firstClassArrayNames).forEach(function(object){
        data_result_JSON.push({
        "title": firstClassArrayNames[object],
        "value": firstClassArrayNames[object]
        });
        intent_values.push({ source: firstClassArrayNames[object], language: { isocode: "en" } })
    });

    //Here we delete the First Class Intents if they exists
    deleteFirstClassIntents(intent_values);
    
    res.json({
        replies: [{
            "type": "quickReplies",
            "content": {
                "title": "Restauration Topics",
                "buttons": data_result_JSON
            }
        }]
    });     
    
})

//If a class has subclasses, it shows all the subclasses of that class
app.post('/second_level', (req,res) => {
    
    //Array in which second level classes for a specific class will be put
    secondClassArray = [];
    //Array in which names_chosen_param of second level classes for a specific class will be put to be shown in the JSON
    secondClassArrayNames = [];
    
    var choice_param = req.body.nlp.source;
    //var choice_param = req.params.value;
    //console.log(choice_param);

    //In this iteration we push all the second level classes in an array, according to the first level classes choosen by the user
    for(var i = 0; i < classArray[0].classes.length; i++){
        var class_name = classArray[0].classes[i].name;
        var subclass = classArray[0].classes[i].subclassof;
        if((typeof subclass !== 'undefined') && (subclass !== "") && (typeof class_name !== 'undefined') && (class_name !== "")){
            if(choice_param === subclass){
                secondClassArray.push(classArray[0].classes[i]);
                secondClassArrayNames.push(class_name);
            }
        }

    }

    //In this iteration we can get all the classes which have no subclasses to print a different chatbot answer
    for(var i = 0; i < classArray[0].classes.length; i++){
        var subclass = classArray[0].classes[i].subclassof;
        if(subclass !== "" && typeof subclass !== 'undefined'){
            for (var j = 0; j < firstClassArray.length; j++){
                if(subclass === firstClassArray[j].name){
                    noSubclassedClassesArray.remove(firstClassArray[j]);
                }
            }
        }
    }

    var subclassed_class = true;

    var names_chosen_param = [];

    if(noSubclassedClassesArray.length > 0){
        for (var i = 0; i < noSubclassedClassesArray.length; i++){
            if(noSubclassedClassesArray[i].name === choice_param){
                //Set this variable to false because it means that the input parameters is a class which ha no subclasses
                subclassed_class = false;
                for(var j = 0; j < namedindividualArray[0].namedinds.length; j++){
                    var name_choice = namedindividualArray[0].namedinds[j];
                    //Finds the named individuals whose type corresponds to the class chosen and push the result in an array
                    if(choice_param === name_choice.type){
                        names_chosen_param.push(name_choice.name);
                    }
                }
            }
        }
    }
    
    var data_result_JSON = [];
    var intent_values = [];
    
    if(names_chosen_param.length === 0 && secondClassArray.length > 0){

        Object.keys(secondClassArrayNames).forEach(function(object){
            data_result_JSON.push({
            "title": secondClassArrayNames[object],
            "value": secondClassArrayNames[object]
            });
            intent_values.push({ source: secondClassArrayNames[object], language: { isocode: "en" } });
        });

        //Now push Go Back Button!
        data_result_JSON.push({
            "title": "Go Back",
            "value": "Go Back"
        });

        deleteSecondClassIntents(intent_values);
    
        res.json({
            replies: [{
                "type": "quickReplies",
                "content": {
                    "title": choice_param,
                    "buttons": data_result_JSON
                }
            }]
        });

    } else if((!subclassed_class) &&(names_chosen_param.length > 0)){

        Object.keys(names_chosen_param).forEach(function(object){
            data_result_JSON.push({
            "title": names_chosen_param[object],
            "value": names_chosen_param[object]
            });
            intent_values.push({ source: names_chosen_param[object], language: { isocode: "en" } })
        });

        //Now push Go Back Button!
        data_result_JSON.push({
            "title": "Go Back",
            "value": "Go Back"
        });

        deleteSecondClassIntents(intent_values);

        res.json({
            replies: [{
                "type": "quickReplies",
                "content": {
                    "title": choice_param,
                    "buttons": data_result_JSON
                }
            }]
        });

    } else {

        res.json({
            replies: [{
                "type": "text",
                "content": `No results found for ${choice_param}`,
              }]
        });

    }
    
    
});

//TODO: implement the third level for the classes that have a deeper hierarchy
//For classes like restaurants which have subclasses, /third_level should print the namedindividuals to one of these chosen classes
app.post('/third_level', (req,res) => {

    //Fixed variable just to test...
    const choice_param = req.body.nlp.source;
    //console.log(choice_param);
    var names_chosen_param = [];

    //TODO: improve and manage all the attributes
    for(var i = 0; i < classArray[0].classes.length; i++){
        var elem = classArray[0].classes[i];

        if(elem.name === choice_param){
            var e_subclass = elem.subclassof;
            //Then we should find also the value of the property, for example isSpecializedIn
            var e_hasvalue = elem.hasvalue;
            
            for (j = 0; j < namedindividualArray[0].namedinds.length; j++){
                var value = namedindividualArray[0].namedinds[j];
                if(e_subclass === value.type && e_hasvalue === value.isspecialized){
                    names_chosen_param.push(value.name);
                }
            }            
        }

        if(elem.hasvalue === choice_param){
            var e_hasvalue = elem.hasvalue;
            
            for (j = 0; j < namedindividualArray[0].namedinds.length; j++){
                var value = namedindividualArray[0].namedinds[j];
                if(e_hasvalue === value.isspecialized){
                    names_chosen_param.push(value.name);
                }
            } 
        }
    }  

    var data_result_JSON = [];

    if(names_chosen_param.length > 0){

        Object.keys(names_chosen_param).forEach(function(object){
            data_result_JSON.push({
                "title": names_chosen_param[object],
                "subtitle": "CARD_1_SUBTITLE",
                "imageUrl": "https://media-cdn.tripadvisor.com/media/photo-s/0e/cc/0a/dc/restaurant-chocolat.jpg",
                "buttons": [
                  {
                    "title": "BUTTON_1_TITLE",
                    "type": "BUTTON_1_TYPE",
                    "value": "BUTTON_1_VALUE"
                  }
                ]
            });
        });

        res.json({
            replies: [{
                "type": "carousel",
                "content": data_result_JSON
            }]
        });

    } else {
        res.json({
            replies: [{
                "type": "text",
                "content": `No results found for ${choice_param}`,
              }]
        });
    }
    
    res.status(200).end();

});
