function parseObjPropsAttributes(data_obj, data, stack){
    data = {
        "name": data_obj.name_objprop,
        "inverseof": data_obj.inverseof_objprop,
        "domain": data_obj.domain_objprop,
        "range": data_obj.range_objprop,
        "type": data_obj.type_objprop
    }

    stack["objprops"].push(data);

    data_obj.name_objprop = "";
    data_obj.inverseof_objprop = "";
    data_obj.domain_objprop = "";
    data_obj.range_objprop = "";
    data_obj.type_objprop = "";
    
}

module.exports = parseObjPropsAttributes;