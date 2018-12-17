function parseNamedIndividuals(value, data_obj, str){
    if(value.includes("#")){
        
        var value_str = parseString(value);
        
        if(value.includes(str.namedIndividual_substring)){
            data_obj.name_namedindividual = value_str;
        }
        if(value.includes(str.namedIndividual_type)) {
            data_obj.type_namedindividual = value_str;
        }
        if(value.includes(str.namedIndividual_specializedin)) {
            data_obj.specialization_namedindividual = value_str;
        }
    }
}

function parseString(string){
    var first_split = string.split("#");
    var second_split = first_split[1].split(`"`);
    var result = second_split[0];
    return result;
}

module.exports = parseNamedIndividuals;