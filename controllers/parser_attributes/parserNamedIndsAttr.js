function parseNamedIndividualsAttributes(data_obj, data, stack, data_objprops_tags){
    data = {
        "name": data_obj.name_namedindividual,
        "type": data_obj.type_namedindividual
    }

    for(var i = 0; i < data_objprops_tags.length; i++){
        var index_str = data_objprops_tags[i].toString();
        data[index_str] = data_obj[index_str];
    }

    stack["namedinds"].push(data);

    data_obj.name_namedindividual = "";
    data_obj.type_namedindividual = "";
    for(var i = 0; i < data_objprops_tags.length; i++){
        var index_str = data_objprops_tags[i].toString();
        data_obj[index_str] = "";
    }
    
}

module.exports = parseNamedIndividualsAttributes;