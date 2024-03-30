const paginateResult = result => {
    const totalEvents = result.length;
    const pageSize = 10;
    const totalPages = ((totalEvents % pageSize) === 0) ? (totalEvents / pageSize) : Math.floor(totalEvents / pageSize) + 1;
    const finalRes = [];
    let begin = 0, end = pageSize;
    for(let index = 0; index < totalPages; index++){
        finalRes[index] = {
            "events": result.slice(begin, end),
            "page": index + 1,
            "pageSize": pageSize,
            "totalEvents": totalEvents,
            "totalPages": totalPages
        }
        begin = end;
        end = ((end + pageSize) < totalEvents) ? end + pageSize : totalEvents;
    }
    return finalRes;
}

module.exports = { paginateResult }