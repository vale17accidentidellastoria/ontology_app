const fs = require('fs');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const recastai = require('recastai').default;

const port = 3030 | process.env.PORT;

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
const namedIndividual_specializedin = "<isSpecializedIn "; //specializedIn is specific to food ontology
//Object which contains all the strings representing namedIndividual tags to be easier to manage
const str_named = {namedIndividual_substring, namedIndividual_type, namedIndividual_specializedin};

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

//Data Properties attributes
var name_dataprop = "";
var domain_dataprop = "";
var range_dataprop = "";
//Object created to keep all the attribute values for data properties
var data_prop_values = {name_dataprop, domain_dataprop, range_dataprop};

//Named Individuals attributes
var name_namedindividual = "";
var type_namedindividual = "";
var specialization_namedindividual = "";
//Object created to keep all the attribute values for named individuals
var data_named_values = {name_namedindividual, type_namedindividual, specialization_namedindividual};

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

app.listen(port, () => console.log(`Listening on port ${port}`));

app.get('/', (req,res) => {
    res.send("OK");
})