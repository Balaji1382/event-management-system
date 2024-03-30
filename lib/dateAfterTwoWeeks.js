const { checkLeapYear } = require("./checkLeapYear");
 
const dateAfterTwoWeeks = date => {
    let [ year, month, day ] = date.split("-");
    let noOfDaysInGivenMonth;
    let numMonth = Number(month);
    if(numMonth === 2){
        if(checkLeapYear(year)){
            noOfDaysInGivenMonth = 29;
        }
        else{
            noOfDaysInGivenMonth = 28;
        }
    }
    else{
        switch(numMonth) {
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:{
                noOfDaysInGivenMonth = 31;
                break;
            }
            default:{
                noOfDaysInGivenMonth = 30;
            }
        }
    }
    let numDay = Number(day);
    if(numDay + 14 <= noOfDaysInGivenMonth){
        day = String(numDay + 14);
        return (year + "-" + month + "-" + day);
    }
    numDay = 14 - (noOfDaysInGivenMonth - numDay);
    if(numDay < 10){
        day = "0" + String(numDay);
    }
    else{
        day = String(numDay);
    }
    if(numMonth === 12){
        month = "01";
        year = String(Number(year) + 1);
    }
    else{
        if((numMonth + 1) < 10){
            month = "0" + String(numMonth + 1);
        }
        else{
            month = String(numMonth + 1);
        }
    }

    return (year + "-" + month + "-" + day);
}

module.exports = { dateAfterTwoWeeks }