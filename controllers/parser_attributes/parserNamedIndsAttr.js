function parseNamedIndividualsAttributes(data_obj, data, stack){
    data = {
        "name": data_obj.name_namedindividual,
        "type": data_obj.type_namedindividual,
        "hello": data_obj["isspecializedin"]
    }

    stack["namedinds"].push(data);

    data_obj.name_namedindividual = "";
    data_obj.type_namedindividual = "";
    data_obj["isspecializedin"] = "";
    
}

module.exports = parseNamedIndividualsAttributes;