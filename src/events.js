const { db } = require("./db/dbConfig");
const { formatDate } = require("../lib/formatDate");
const { checkCityNameFormat, 
        checkDateFormat,
        checkLatitudeFormat,
        checkLongitudeFormat,
        checkTimeFormat } = require("../lib/checkFormats");
const { dateAfterTwoWeeks } = require("../lib/dateAfterTwoWeeks");
const { getWeatherJsonResponses, getDistanceJsonResponses } = require("./getResponses");
const { attachProps, deleteProps } = require("./modifyProps");
const { paginateResult } = require("./paginateResult");

const addEvents = async (req, res) => {
    const { event_name, city_name, date, time, latitude, longitude } = req.body;
    if(!event_name || !city_name || !date || !time || !latitude || !longitude){
        res.status(400).json("Any of the Properties might be missing : event_name, city_name, date, time, latitude or longitude");
        return;
    }
    if(!checkCityNameFormat(city_name)){
        res.status(400).json("City names with special characters or numbers are not allowed");
        return;
    }
    if(!checkDateFormat(date)){
        res.status(400).json("Date or Date Format might be wrong");
        return;
    }
    if(!checkTimeFormat(time)){
        res.status(400).json("Time or Time Format might be wrong");
        return;
    }
    if(!checkLatitudeFormat(latitude)){
        res.status(400).json("Latitude or Latitude Format might be wrong");
        return;
    }
    if(!checkLongitudeFormat(longitude)){
        res.status(400).json("Longitude or Longitude Format might be wrong");
        return;
    }
    try{
        await db.execute("INSERT INTO events(event_name, city_name, latitude, longitude, date_time) VALUES(?, ?, ?, ?, STR_TO_DATE(CONCAT(?, ' ', ?), '%Y-%m-%d %H:%i:%s'))", 
            [event_name, city_name, latitude, longitude, date, time])
        res.status(201).json("Record Created");
    }
    catch(error) {
        console.log(error);
        res.status(500).json("Internal Server Error");
    }
}

// change into async await function
const findEvents = async (req, res) => {
    const { latitude: userLatitude, longitude: userLongitude, date } = req.query;
    if(!userLatitude || !userLongitude || !date){
        res.status(400).json("Any of the properties in the query might be missing: latitude, longitude or date");
        return;
    }
    if(!checkDateFormat(date)){
        res.status(400).json("Date or Date Format might be wrong");
        return;
    }
    if(!checkLatitudeFormat(userLatitude)){
        res.status(400).json("Latitude or Latitude Format might be wrong");
        return;
    }
    if(!checkLongitudeFormat(userLongitude)){
        res.status(400).json("Longitude or Longitude Format might be wrong");
        return;
    }
    const endDate = dateAfterTwoWeeks(date);
    try{
        const [result] = await db.execute("SELECT * FROM events WHERE date_time >= ? AND date_time <= CONCAT(?, ' ', '23:59:59') ORDER BY date_time", [date, endDate]);
        result.forEach(obj => {
            obj.date = obj.date_time;
            obj.date = formatDate(obj.date.getUTCFullYear(), obj.date.getUTCMonth() + 1, obj.date.getUTCDate());
        });
        const responses = await Promise.allSettled(
            [...getWeatherJsonResponses(result), ...getDistanceJsonResponses(result, userLatitude, userLongitude)]
        );
        attachProps(result, responses);
        deleteProps(result);    
        return res.status(200).json(paginateResult(result));
    }
    catch(error){
        console.log(error);
        res.status(500).json("Internal Server Error");
    }
}

module.exports = { addEvents, findEvents }