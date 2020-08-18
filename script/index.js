import { getWeather, getForecast } from './library_weather.js';
import * as ENUMS from './enums.js';
import * as elem from './elements.js';

// APP CONSTANTS
const preferredCity = 'dendermonde';

// ADD TO LOCAL STORAGE
// if (!localStorage.hasOwnProperty('weather_current_city')) {
//     localStorage.setItem('weather_current_city', preferredCity);
// }

let city = getCity();

getWeather(city);
getForecast(city, ENUMS.TIME_MODES.DAY);

elem.searchButton.onclick = () => {
    city = getCity();
    getWeather(city);
    getForecast(city, ENUMS.TIME_MODES.DAY);

};

elem.cityElement.onkeyup = (event) => {
    if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        city = getCity();
        getWeather(city);
        getForecast(city, ENUMS.TIME_MODES.DAY);
    }
};

elem.dayButton.onclick = () => {
    elem.dayButton.classList.add('active');
    elem.nightButton.classList.remove('active');
    city = getCity();
    getForecast(city, ENUMS.TIME_MODES.DAY);
};

elem.nightButton.onclick = () => {
    elem.dayButton.classList.remove('active');
    elem.nightButton.classList.add('active');
    city = getCity();
    getForecast(city, ENUMS.TIME_MODES.NIGHT);
};

function getCity() {
    let city;
    if (elem.cityElement.value === '') {
        city = preferredCity;
    }
    else {
        city = elem.cityElement.value;
    }
    elem.cityElement.value = '';
    return city;
}







