const OPENWEATHER_KEY = 'bb0e1f790c8db79e3532961bf204d7aa';

function getWeather(cityName) {
    let url = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&APPID=' + OPENWEATHER_KEY;
    //console.log(url);
    fetch(url)
        .then(function (resp) {
            // todo: add spinner
            // document.getElementById('spinner').style.display = 'none';
            return resp.json()
        })
        .then(function (openweatherData) {
            drawWeather(openweatherData);
            getUvIndex(openweatherData.coord.lat, openweatherData.coord.lon);
        })
        .catch(function (error) {
            console.error(error);
        });
}

function getForecast(cityName, timeMode) {
    let url = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&APPID=' + OPENWEATHER_KEY;
    //console.log(url);
    fetch(url)
        .then(function (resp) {
            return resp.json()
        })
        .then(function (openweatherData) {
            const OPENWEATHER_DATA_LIST = openweatherData.list,
                DAY_HOUR = '15:00:00',
                NIGHT_HOUR = '03:00:00',
                CURRENT_DATE = new Date();

            // ADD ONE DAY TO CURRENT DATE
            CURRENT_DATE.setDate(CURRENT_DATE.getDate() + 1);
            let startDateDay = formatDate(CURRENT_DATE, 'date_us') + ' ' + DAY_HOUR,
                startDateNight = formatDate(CURRENT_DATE, 'date_us') + ' ' + NIGHT_HOUR,
                tempResultsDay = [],
                tempResultsNight = [];

            OPENWEATHER_DATA_LIST.forEach((openweatherDataElement) => {
                let dataElementDate = new Date(openweatherDataElement.dt_txt);
                dataElementDate.setDate(dataElementDate.getDate() + 1);

                let dataElementDateDay = formatDate(dataElementDate, 'date_us') + ' ' + DAY_HOUR,
                    dataElementDateNight = formatDate(dataElementDate, 'date_us') + ' ' + NIGHT_HOUR;

                if (openweatherDataElement.dt_txt.indexOf(startDateDay) !== -1) {
                    tempResultsDay.push(openweatherDataElement);
                    startDateDay = dataElementDateDay;
                }

                if (openweatherDataElement.dt_txt.indexOf(startDateNight) !== -1) {
                    tempResultsNight.push(openweatherDataElement);
                    startDateNight = dataElementDateNight;
                }

            });

            switch (timeMode) {
                case TIME_MODES.DAY:
                    return tempResultsDay;
                case TIME_MODES.NIGHT:
                    return tempResultsNight;
                default:
                    return;
            }

        })
        .then(function (openweatherDataModified) {
            drawForecast(openweatherDataModified);
            drawForecastTemperature(openweatherDataModified);
        })
        .catch(function (error) {
            console.error(error);
        });
}

// todo: implement uv-index
function getUvIndex(lat, lon) {
    //http://api.openweathermap.org/data/2.5/uvi?appid=bb0e1f790c8db79e3532961bf204d7aa&lat=51.03&lon=4.08
    let url = 'https://api.openweathermap.org/data/2.5/uvi?appid=' + OPENWEATHER_KEY + '&lat=' + lat + '&lon=' + lon;
    fetch(url)
        .then(function (resp) {
            return resp.json()
        })
        .then(function (openweatherData) {
            console.log('UV Index: ' + openweatherData.value);
        })
        .catch(function (error) {
            console.error(error);
        });
}

function drawWeather(openweatherData) {
    // LOCATION
    locationElement.innerHTML = openweatherData.name + ', ' + openweatherData.sys.country;
    currentDateElement.innerHTML = formatDate(openweatherData.dt, '', true);

    // CURRENT TEMPERATURE
    // "http://openweathermap.org/img/wn/" + openweatherData.weather[0].icon + "@2x.png";
    const CURRENT_TEMPERATURE = calculateTemperature(openweatherData.main.temp, TEMPERATURE_SCALES.CELCIUS),
        CURRENT_TEMPERATURE_FEELSLIKE = calculateTemperature(openweatherData.main.feels_like, TEMPERATURE_SCALES.CELCIUS),
        CURRENT_TEMPERATURE_WEATHERICON = "images/" + openweatherData.weather[0].icon + ".svg";
    currentTemperatureValue.innerHTML = CURRENT_TEMPERATURE + '&deg;';
    currentTemperatureFeelsLikeValue.innerHTML = 'Feels like ' + CURRENT_TEMPERATURE_FEELSLIKE + '&deg;';
    currentTemperatureSummary.innerHTML = openweatherData.weather[0].description.toProperCase();
    currentTemperatureIcon.setAttribute('src', CURRENT_TEMPERATURE_WEATHERICON);

    // CURRENT STATS
    const CURRENT_TEMPERATURE_HIGH = calculateTemperature(openweatherData.main.temp_max, TEMPERATURE_SCALES.CELCIUS),
        CURRENT_TEMPERATURE_LOW = calculateTemperature(openweatherData.main.temp_min, TEMPERATURE_SCALES.CELCIUS);
    currentStatsTemperatureHighValue.innerHTML = CURRENT_TEMPERATURE_HIGH + '&deg;';
    currentStatsTemperatureLowValue.innerHTML = CURRENT_TEMPERATURE_LOW + '&deg;';

    currentStatsPressureValue.innerText = openweatherData.main.pressure + 'hPa';
    currentStatsHumidityValue.innerText = openweatherData.main.humidity + '%';

    currentStatsWindSpeedValue.innerText = openweatherData.wind.speed + 'm/s';
    currentStatsCloudsValue.innerText = openweatherData.clouds.all + '%';

    currentStatsSunriseValue.innerText = formatDate(openweatherData.sys.sunrise, 'time', true);
    currentStatsSunsetValue.innerText = formatDate(openweatherData.sys.sunset, 'time', true);
}

function drawForecast(openweatherDataModified) {
    // clear the container first
    nextFiveDaysContainer.innerText = '';

    openweatherDataModified.forEach((openweatherDataModifiedElement) => {
        // DAY
        const ELEMENT_1 = document.createElement('div');
        ELEMENT_1.setAttribute('class', 'next-5-days__date');
        const VALUE_1 = document.createElement('div');
        VALUE_1.setAttribute('class', 'next-5-days__value');
        VALUE_1.innerText = formatDate(openweatherDataModifiedElement.dt, 'day_short', true);
        const LABEL_1 = document.createElement('div');
        LABEL_1.setAttribute('class', 'next-5-days__label');
        LABEL_1.innerHTML = formatDate(openweatherDataModifiedElement.dt, 'day_month', true) + '<br/>' + formatDate(openweatherDataModifiedElement.dt_txt, 'time');
        ELEMENT_1.appendChild(VALUE_1);
        ELEMENT_1.appendChild(LABEL_1);

        // ICON & DESCRIPTION
        const ELEMENT_2 = document.createElement('div');
        ELEMENT_2.setAttribute('class', 'next-5-days__icon');
        const VALUE_2 = document.createElement('div');
        VALUE_2.setAttribute('class', 'next-5-days__value');
        const IMAGE_ICON = document.createElement('img');
        //IMAGE_ICON.setAttribute('src', "http://openweathermap.org/img/wn/" + openweatherDataModifiedElement.weather[0].icon + "@2x.png");
        IMAGE_ICON.setAttribute('src', "images/" + openweatherDataModifiedElement.weather[0].icon + ".svg");
        VALUE_2.appendChild(IMAGE_ICON);
        const LABEL_2 = document.createElement('div');
        LABEL_2.setAttribute('class', 'next-5-days__label');
        LABEL_2.innerText = openweatherDataModifiedElement.weather[0].description.toProperCase();
        ELEMENT_2.appendChild(VALUE_2);
        ELEMENT_2.appendChild(LABEL_2);

        // TEMPERATURE LOW
        const ELEMENT_3 = document.createElement('div');
        ELEMENT_3.setAttribute('class', 'next-5-days__low');
        const VALUE_3 = document.createElement('div');
        VALUE_3.setAttribute('class', 'next-5-days__value');
        VALUE_3.innerHTML = calculateTemperature(openweatherDataModifiedElement.main.temp_min, TEMPERATURE_SCALES.CELCIUS) + '&deg;';
        const LABEL_3 = document.createElement('div');
        LABEL_3.setAttribute('class', 'next-5-days__label');
        LABEL_3.innerText = 'Low';
        ELEMENT_3.appendChild(VALUE_3);
        ELEMENT_3.appendChild(LABEL_3);

        // TEMPERATURE HIGH
        const ELEMENT_4 = document.createElement('div');
        ELEMENT_4.setAttribute('class', 'next-5-days__high');
        const VALUE_4 = document.createElement('div');
        VALUE_4.setAttribute('class', 'next-5-days__value');
        VALUE_4.innerHTML = calculateTemperature(openweatherDataModifiedElement.main.temp_max, TEMPERATURE_SCALES.CELCIUS) + '&deg;';
        const LABEL_4 = document.createElement('div');
        LABEL_4.setAttribute('class', 'next-5-days__label');
        LABEL_4.innerText = 'High';
        ELEMENT_4.appendChild(VALUE_4);
        ELEMENT_4.appendChild(LABEL_4);

        // CLOUDS
        const ELEMENT_5 = document.createElement('div');
        ELEMENT_5.setAttribute('class', 'next-5-days__rain');
        const VALUE_5 = document.createElement('div');
        VALUE_5.setAttribute('class', 'next-5-days__value');
        VALUE_5.innerText = openweatherDataModifiedElement.clouds.all + '%';
        const LABEL_5 = document.createElement('div');
        LABEL_5.setAttribute('class', 'next-5-days__label');
        LABEL_5.innerText = 'Clouds';
        ELEMENT_5.appendChild(VALUE_5);
        ELEMENT_5.appendChild(LABEL_5);

        // WIND
        const ELEMENT_6 = document.createElement('div');
        ELEMENT_6.setAttribute('class', 'next-5-days__wind');
        const VALUE_6 = document.createElement('div');
        VALUE_6.setAttribute('class', 'next-5-days__value');
        VALUE_6.innerText = openweatherDataModifiedElement.wind.speed + 'm/s';
        const LABEL_6 = document.createElement('div');
        LABEL_6.setAttribute('class', 'next-5-days__label');
        LABEL_6.innerText = 'Wind';
        ELEMENT_6.appendChild(VALUE_6);
        ELEMENT_6.appendChild(LABEL_6);

        const ROW_ELEMENT = document.createElement('div');
        ROW_ELEMENT.setAttribute('class', 'next-5-days__row');
        ROW_ELEMENT.appendChild(ELEMENT_1);
        ROW_ELEMENT.appendChild(ELEMENT_2);
        ROW_ELEMENT.appendChild(ELEMENT_3);
        ROW_ELEMENT.appendChild(ELEMENT_4);
        ROW_ELEMENT.appendChild(ELEMENT_5);
        ROW_ELEMENT.appendChild(ELEMENT_6);

        nextFiveDaysContainer.appendChild(ROW_ELEMENT);
    });

}

function drawForecastTemperature(openweatherDataModified) {
    const CHART_DATA = {
        'legend': [],
        'data': []
    };
    openweatherDataModified.forEach((openweatherDataModifiedElement) => {
        let dataLegend = [formatDate(openweatherDataModifiedElement.dt, 'day_short', true), formatDate(openweatherDataModifiedElement.dt, 'day_month', true)];
        CHART_DATA.legend.push(dataLegend);
        CHART_DATA.data.push(calculateTemperature(openweatherDataModifiedElement.main.temp, TEMPERATURE_SCALES.CELCIUS));
    });

    const CTX = nextFiveDaysChart.getContext('2d');
    const TEMPERATURE_LINE_CHART = new Chart(CTX, {
        type: 'line',
        data: {
            labels: CHART_DATA.legend,
            datasets: [{
                label: ' Temperature (°C)',
                data: CHART_DATA.data,
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                borderColor: '#f4a91a',
                clip: 50,
                fill: false,
                lineTension: 0.1
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    gridLines: {
                        drawTicks: true,
                        offsetGridLines: false,
                        zeroLineColor: 'rgba(255, 255, 255, 0.25)'
                    },
                    ticks: {
                        beginAtZero: true,
                        fontColor: 'white',
                        fontStyle: '300',
                        fontSize: 14
                    }
                }],
                yAxes: [{
                    gridLines: {
                        drawTicks: true,
                        offsetGridLines: false,
                        zeroLineColor: 'rgba(255, 255, 255, 0.25)'
                    },
                    ticks: {
                        beginAtZero: true,
                        fontColor: 'white',
                        fontStyle: '300',
                        fontSize: 14
                    },
                }]
            },
            layout: {
                padding: 25
            },
            legend: {
                display: true,
                labels: {
                    boxWidth: 2,
                    fontColor: 'white',
                    fontStyle: '300',
                    fontSize: 16
                }
            }
        }
    });
}

function calculateTemperature(value, scale) {
    let temperature = 0;
    switch (scale) {
        case TEMPERATURE_SCALES.CELCIUS:
            temperature = Math.round(parseFloat(value) - 273.15);
            break;
        case TEMPERATURE_SCALES.FAHRENHEIT:
            temperature = Math.round(((parseFloat(value) - 273.15) * 1.8) + 32);
            break;
        default:
            break;
    }
    return temperature;
}

// todo: implement wind compass
function calculateDegreesToCompass(degrees) {
    let val = Math.floor((degrees / 22.5) + 0.5);
    const WIND_DIRECTIONS = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return WIND_DIRECTIONS[(val % 16)];
}