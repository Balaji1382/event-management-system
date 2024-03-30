const checkLeapYear = (year) => {
    let numYear = Number(year);
    return (numYear % 4 === 0 && numYear % 100 !== 0) || (numYear % 400 === 0);
}

module.exports = { checkLeapYear }