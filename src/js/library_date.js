const DAYS_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatDate(date, dateType, isUnix = false) {

    let newDate;

    if (isUnix) {
        const MILLISECONDS = date * 1000;
        newDate = new Date(MILLISECONDS);
    }
    else {
        newDate = new Date(date);
    }

    // todo: add different date type in enums
    const DATE_PART = ("0" + newDate.getDate()).slice(-2) + '-' + ("0" + (newDate.getMonth() + 1)).slice(-2) + '-' + newDate.getFullYear();
    const DATE_PART_US = newDate.getFullYear() + '-' + ("0" + (newDate.getMonth() + 1)).slice(-2) + '-' + ("0" + newDate.getDate()).slice(-2);
    const TIME_PART = ("0" + newDate.getHours()).slice(-2) + ':' + ("0" + newDate.getMinutes()).slice(-2) + ':' + ("0" + newDate.getSeconds()).slice(-2);
    const DAY_SHORT = DAYS_SHORT[newDate.getDay()];
    const DAY_MONTH_PART = ("0" + newDate.getDate()).slice(-2) + '/' + ("0" + (newDate.getMonth() + 1)).slice(-2);

    switch (dateType) {
        case 'date':
            return DATE_PART;
        case 'date_us':
            return DATE_PART_US;
        case 'time':
            return TIME_PART;
        case 'day_short':
            return DAY_SHORT;
        case 'day_month':
            return DAY_MONTH_PART;
        case 'date_full_us':
            return DATE_PART_US + ' ' + TIME_PART;
        default:
            return DATE_PART + ' ' + TIME_PART;
    }
}