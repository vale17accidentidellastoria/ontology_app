function parseDataPropsAttributes(data_obj, data, stack){
    data = {
        "name": data_obj.name_dataprop,
        "domain": data_obj.domain_dataprop,
        "range": data_obj.range_dataprop
    }

    stack["dataprops"].push(data);
    
    data_obj.name_dataprop = "";
    data_obj.domain_dataprop = "";
    data_obj.range_dataprop = "";
    
}

module.exports = parseDataPropsAttributes;