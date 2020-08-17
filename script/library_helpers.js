String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

const TIME_MODES = Object.freeze({
    DAY:   Symbol("day"),
    NIGHT:  Symbol("night"),
    TWILIGHT: Symbol("twilight")
});

const TEMPERATURE_SCALES = Object.freeze({
    CELCIUS:   Symbol("celcius"),
    FAHRENHEIT:  Symbol("fahrenheit"),
    KELVIN: Symbol("kelvin")
});

function fadeOutIn(elem, speed) {

    if (!elem.style.opacity) {
        elem.style.opacity = 1;
    }

    let outInterval = setInterval(function () {
        elem.style.opacity -= 0.02;
        if (elem.style.opacity <= 0) {
            elem.innerHTML = '';
            clearInterval(outInterval);
            let inInterval = setInterval(function () {
                elem.style.opacity = Number(elem.style.opacity) + 0.02;
                if (elem.style.opacity >= 1)
                    clearInterval(inInterval);
            }, speed / 50);
        }
    }, speed / 50);

}