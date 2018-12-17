function parseClasses(value, data_obj, str){
    if(value.includes("#")){
        
        var value_str = parseString(value);
        
        if(value.includes(str.class_substring)){
            data_obj.name_class = value_str;
        }
        if(value.includes(str.subclass_substring)) {
            data_obj.subclassof_class = value_str;
        }
        if(value.includes(str.class_description)) {
            data_obj.description_class = value_str;
        }
        if(value.includes(str.class_onproperty)) {
            data_obj.onproperty_class = value_str;
        }
        if(value.includes(str.class_hasvalue)) {
            data_obj.hasvalue_class = value_str;
        }
    }
}

function parseString(string){
    var first_split = string.split("#");
    var second_split = first_split[1].split(`"`);
    var result = second_split[0];
    return result;
}

module.exports = parseClasses;