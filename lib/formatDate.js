const formatDate = (year, month, date) => {
    if(typeof month !== String){
        month = String(month);
    }
    if(typeof date !== String){
        date = String(date);
    }
    if(Number(month) < 10){
        month = '0' + month;
    }
    if(Number(date) < 10){
        date = '0' + date;
    }
    if(typeof year !== String){
        year = String(year);
    }
    return String(year + "-" + month + "-" + date);
}

module.exports = { formatDate }