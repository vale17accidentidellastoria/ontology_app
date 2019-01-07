function parseObjProps(value, data_obj, str, objprop_tag) {
    if(value.includes("#")){
        
        var value_str = parseString(value);
        
        if(value.includes(str.objectProperty_substring)){
            data_obj.name_objprop = value_str;
            //To distinguish and parse object properties tag
            objprop_tag.tag = value_str;
        }
        if(value.includes(str.objectProperty_inverseof)) {
            data_obj.inverseof_objprop = value_str;
        }
        if(value.includes(str.objectProperty_domain)) {
            data_obj.domain_objprop = value_str;
        }
        if(value.includes(str.objectProperty_range)) {
            data_obj.range_objprop = value_str;
        }
        if(value.includes(str.objectProperty_type)) {
            data_obj.type_objprop = value_str;
        }
    }
}

function parseString(string){
    var first_split = string.split("#");
    var second_split = first_split[1].split(`"`);
    var result = second_split[0];
    return result;
}

module.exports = parseObjProps;