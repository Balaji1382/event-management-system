
const getWeatherJsonResponses = (obj, timeOut = 10000) => {
    return obj.map(element => {
        let timeOutId;
        const fetchProm = fetch(`https://gg-backend-assignment.azurewebsites.net/api/Weather?code=${process.env.API_KEY_WEATHER}&city=${encodeURIComponent(element.city_name)}&date=${element.date}`)
        .then(res => {
            if(!res.ok){
                throw new Error("The weather request's status text is not 'OK'");
            }
            return res.json();
        })
        .catch(error => {
            return Promise.reject(`${error.message}`);
        });
        const timeOutProm = new Promise((_, reject) => {
            timeOutId = setTimeout(() => {
                return reject("Weather Request timed out");
            }, timeOut);
        });
        return Promise.race([ fetchProm, timeOutProm ])
            .finally(() => {
                clearTimeout(timeOutId);
            });
    })
}

const getDistanceJsonResponses = (obj, userLatitude, userLongitude, timeOut = 10000) => {
    return obj.map(element => {
        let timeOutId;
        const fetchProm = fetch(`https://gg-backend-assignment.azurewebsites.net/api/Distance?code=${process.env.API_KEY_DISTANCE}&latitude1=${userLatitude}&longitude1=${userLongitude}&latitude2=${element.latitude}&longitude2=${element.longitude}`)
        .then(res => {
            if(!res.ok){
                throw new Error("The distance request's status text is not 'OK'");
            }
            return res.json();
        })
        .catch(error => {
            return Promise.reject(`${error.message}`);
        });
        const timeOutProm = new Promise((_, reject) => {
            timeOutId = setTimeout(() => {
                return reject("Distance Request timed out");
            }, timeOut);
        });
        return Promise.race([ fetchProm, timeOutProm ])
            .finally(() => {
                clearTimeout(timeOutId);
            });
    })
}

module.exports = { getWeatherJsonResponses, getDistanceJsonResponses }