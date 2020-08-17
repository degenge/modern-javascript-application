// DOM ELEMENTS
const cityElement = document.getElementById('city'),
    searchButton = document.getElementById('search'),
    locationElement = document.getElementById('location'),
    currentDateElement = document.getElementById('currentDate'),
    currentTemperatureValue = document.getElementById('currentTemperatureValue'),
    currentTemperatureFeelsLikeValue = document.getElementById('currentTemperatureFeelsLikeValue'),
    currentTemperatureSummary = document.getElementById('currentTemperatureSummary'),
    currentTemperatureIcon = document.getElementById('currentTemperatureIcon'),
    currentStatsTemperatureHighValue = document.getElementById('currentStatsTemperatureHighValue'),
    currentStatsTemperatureLowValue = document.getElementById('currentStatsTemperatureLowValue'),
    currentStatsWindSpeedValue = document.getElementById('currentStatsWindSpeedValue'),
    currentStatsCloudsValue = document.getElementById('currentStatsCloudsValue'),
    currentStatsPressureValue = document.getElementById('currentStatsPressureValue'),
    currentStatsHumidityValue = document.getElementById('currentStatsHumidityValue'),
    currentStatsSunriseValue = document.getElementById('currentStatsSunriseValue'),
    currentStatsSunsetValue = document.getElementById('currentStatsSunsetValue'),
    nextFiveDaysContainer = document.getElementById('nextFiveDaysContainer'),
    dayButton = document.getElementById('day'),
    nightButton = document.getElementById('night'),
    nextFiveDaysChart = document.getElementById('nextFiveDaysChart');

// APP CONSTANTS
const preferredCity = 'dendermonde';

// ADD TO LOCAL STORAGE
// if (!localStorage.hasOwnProperty('weather_current_city')) {
//     localStorage.setItem('weather_current_city', preferredCity);
// }

let city = getCity();

getWeather(city);
getForecast(city, TIME_MODES.DAY);

searchButton.onclick = () => {
    city = getCity();
    getWeather(city);
    getForecast(city, TIME_MODES.DAY);

};

cityElement.onkeyup = (event) => {
    if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        city = getCity();
        getWeather(city);
        getForecast(city, TIME_MODES.DAY);
    }
};

dayButton.onclick = () => {
    dayButton.classList.add('active');
    nightButton.classList.remove('active');
    city = getCity();
    getForecast(city, TIME_MODES.DAY);
};

nightButton.onclick = () => {
    dayButton.classList.remove('active');
    nightButton.classList.add('active');
    city = getCity();
    getForecast(city, TIME_MODES.NIGHT);
};

function getCity() {
    let city;
    if (cityElement.value === '') {
        city = preferredCity;
    }
    else {
        city = cityElement.value;
    }
    cityElement.value = '';
    return city;
}







