function parseClassAttributes(data_obj, data, stack) {
    data = {
        "name": data_obj.name_class,
        "subclassof": data_obj.subclassof_class,
        "description": data_obj.description_class,
        "onproperty": data_obj.onproperty_class, 
        "hasvalue": data_obj.hasvalue_class
    }

    stack["classes"].push(data);
    
    data_obj.name_class = "";
    data_obj.subclassof_class = "";
    data_obj.description_class = "";
    data_obj.onproperty_class = "";
    data_obj.hasvalue_class = "";
    
}

module.exports = parseClassAttributes;