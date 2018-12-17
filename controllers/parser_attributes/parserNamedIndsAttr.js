function parseNamedIndividualsAttributes(data_obj, data, stack){
    data = {
        "name": data_obj.name_namedindividual,
        "type": data_obj.type_namedindividual,
        "isspecialized": data_obj.specialization_namedindividual
    }

    stack["namedinds"].push(data);

    data_obj.name_namedindividual = "";
    data_obj.type_namedindividual = "";
    data_obj.specialization_namedindividual = "";
    
}

module.exports = parseNamedIndividualsAttributes;