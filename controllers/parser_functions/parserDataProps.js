function parseDataProps(value, data_obj, str, dataprop_tag) {
    if(value.includes("#")){
        var value_str = parseString(value);
        
        if(value.includes(str.dataTypeProperty_substring)){
            data_obj.name_dataprop = value_str;
            //To distinguish and parse data properties tag
            dataprop_tag.tag = value_str;
        }
        if(value.includes(str.dataTypeProperty_domain)) {
            data_obj.domain_dataprop = value_str;
        }
        if(value.includes(str.dataTypeProperty_range)) {
            data_obj.range_dataprop = value_str;
        }
    }
}

function parseString(string){
    var first_split = string.split("#");
    var second_split = first_split[1].split(`"`);
    var result = second_split[0];
    return result;
}

module.exports = parseDataProps;