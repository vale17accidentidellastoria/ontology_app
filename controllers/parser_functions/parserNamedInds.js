function parseNamedIndividuals(value, data_obj, str, objprops_tags, data_objprops_tags){
    if(value.includes("#")){
        
        var value_str = parseString(value);
        
        if(value.includes(str.namedIndividual_substring)){
            data_obj.name_namedindividual = value_str;
        }
        if(value.includes(str.namedIndividual_type)) {
            data_obj.type_namedindividual = value_str;
        }
        //console.log(objprops_tags);
        for(var i = 0; i < objprops_tags.length; i++){
            if(value.includes(objprops_tags[i])){
                var objprop_namedindividual_tag = objprops_tags[i].toLowerCase();
                var first_split = objprop_namedindividual_tag.split("<");
                var second_split = first_split[1].split(` `);
                //es. isspecializedin
                var objpropname_tag_result = second_split[0];

                if(data_objprops_tags.indexOf(objpropname_tag_result) === -1){
                    data_objprops_tags.push(objpropname_tag_result);
                }

                data_obj[objpropname_tag_result] = value_str;
            }
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