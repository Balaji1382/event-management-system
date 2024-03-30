const attachProps = (obj, res) => {
    // weather
    const objLen = obj.length;
    obj.forEach((element, index) => {
        if(res[index].value){
            element.weather = res[index].value.weather;
        }
        else{
            element.weather = "";
        }
    })

    // distance
    obj.forEach((element, index) => {
        if(res[index + objLen].value){
            element.distance_km = res[index+ objLen].value.distance;
        }
        else{
            element.distance_km = "";
        }
    })
}

const deleteProps = (obj) => {
    obj.forEach(element => {
        if(element.id){
            delete element.id;
        }
        if(element.longitude){
            delete element.longitude;
        }
        if(element.latitude){
            delete element.latitude;
        }
        if(element.date_time){
            delete element.date_time;
        }
    })
}

module.exports = { attachProps, deleteProps }