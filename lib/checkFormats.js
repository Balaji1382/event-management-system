const { checkLeapYear } = require("./checkLeapYear");

const checkDateFormat = (date) => {
    // Date format : YYYY-MM-DD
    const dateArr = date.split('-');
    
    if(dateArr.length !== 3 || dateArr[0].length !== 4 || dateArr[1].length !== 2 || dateArr[2].length !== 2){
        return false;
    }
    
    if(!Number(dateArr[1]) || (Number(dateArr[1]) > 12) || (Number(dateArr[1]) < 1)){
        return false;
    }
    
    if(!Number(dateArr[2]) || (Number(dateArr[2]) > 31) || (Number(dateArr[2]) < 1)){
        return false;
    }
    
    if((Number(dateArr[1]) === 2) && (Number(dateArr[2]) > 29)){
        return false;
    }
    
    if(!checkLeapYear(dateArr[0]) && (Number(dateArr[2]) > 28)){
        return false;
    }
    return true;
}

const checkTimeFormat = (time) => {
    const timeArr = time.split(":");
    // Time Format : HH:MM:SS
    if(timeArr.length !== 3){
        return false;
    }
    
    if(Number(timeArr[0]) > 23 || Number(timeArr[0]) < 0){
        return false;
    }
    
    if(Number(timeArr[1]) > 59 || Number(timeArr[1]) < 0){
        return false;
    }
    
    if(Number(timeArr[2]) > 59 || Number(timeArr[2]) < 0){
        return false;
    }
    return true;    
}

const checkLongitudeFormat = longitude => {
    // should not start or end with "."
    if(longitude[0] === "." || longitude[longitude.length - 1] === '.'){
        return false;
    }
    const arr = longitude.split('.');
    // if not a float value or an empty string
    if(arr.length === 0 || arr.length > 2){
        return false;
    }
    // out of range
    if(isNaN(Number(arr[0])) || Number(arr[0]) < -180 || Number(arr[0]) > 180){
        return false;
    }
    if(arr[1]){
        
        if(arr[1][0] === '+' || arr[1][0] === '-'){
            return false;
        }
       
        if(isNaN(Number(arr[1]))){
            return false;
        }
    }
    
    return true;
}

const checkLatitudeFormat = latitude => {
    // should not start or end with "."
    if(latitude[0] === "." || latitude[latitude.length - 1] === "."){
        return false;
    }
    const arr = latitude.split('.');
    // if not a float value or an empty string
    if(arr.length === 0 || arr.length > 2){
        return false;
    }
    // out of range
    if(isNaN(Number(arr[0])) || Number(arr[0]) < -90 || Number(arr[0]) > 90){
        return false;
    }
    if(arr[1]){
        
        if(arr[1][0] === '+' || arr[1][0] === '-'){
            return false;
        }
        
        if(isNaN(Number(arr[1]))){
            return false;
        }
    }
    return true;
}

const checkCityNameFormat = cityName => {
    // only alphabets and spaces allowed
    const regex = new RegExp('[A-Za-z ]+$');
    return (regex.test(cityName));
}

module.exports = { checkCityNameFormat, checkDateFormat, checkTimeFormat, checkLatitudeFormat, checkLongitudeFormat}