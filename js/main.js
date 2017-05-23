"use strict";

//openWeatherMap API key
const apiKey = 'a767471c42ffa61bc651b23c8a971a14';

//utility functions for temperature conversion.
function kelvinToCelsius(temp) {
    return Math.round(temp - 273);
}

function kelvintoFahrenheit(temp) {
    return Math.round((9 / 5) * (temp - 273) + 32);
}

function avg(num1, num2) {
    return (num1 + num2) / 2;
}
//Load current weather data into HTML document.
function loadWeatherData(weatherData) {
    const sunrise = new Date(weatherData.sys.sunrise * 1000);
    const sunset = new Date(weatherData.sys.sunset * 1000);
    var currentTemp;
    const highTempF = Math.round((9 / 5) * (weatherData.main._max - 273) + 32);
    const highTempC = weatherData.main.temp_max - 273;
    var dayNight = '';

    //this statement handles temp conversion when toggle is clicked.
    if ($('#myonoffswitch').is(':checked')) {
        currentTemp = kelvintoFahrenheit(weatherData.main.temp) + '&deg' + 'F';
    }
    else {
        currentTemp = kelvinToCelsius(weatherData.main.temp) + '&deg' + 'C';
    }

    //this statement determines if it's day or night currently.
    if (weatherData.weather[0].icon.includes('n')) {
        dayNight = 'night';
    }
    else {
        dayNight = 'day';
    }


    //location, date, & times
    $('#location-title').html(weatherData.name);
    $('#location-dt').html(new Date(weatherData.dt * 1000).toLocaleString([], { weekday:'long', year: 'numeric', month: 'long', day: 'numeric' }));
    $('#sunrise').html('<strong>Sunrise: </strong>' + sunrise.toLocaleTimeString());
    $('#sunset').html('<strong>Sunset: </strong>' + sunset.toLocaleTimeString());

    //temperatures & humidity
    $('.current-temp').html(currentTemp);
    $('#hi').html('<strong>High: </strong>' + Math.round((9 / 5) * (weatherData.main.temp_max - 273) + 32)+ '&degF');
    $('#lo').html('<strong>Low: </strong>' + Math.round((9 / 5) * (weatherData.main.temp_min - 273) + 32)+ '&degF');
    $('#humidity').html('Humidity: ' + weatherData.main.humidity+ '%');

    //description & icon
    $('#weather-description').html(weatherData.weather[0].description);
    $('#current-icon').addClass('wi-owm-' + dayNight + '-' + weatherData.weather[0].id);

}

//load five-day forecast data into HTML document.
function loadForecastData(forecastData) {

    var weekdays = [];
    var dailyTemps = [];
    var dailyForecast = [];
    var dailyIcons = [];

    //iterate through weather array to pull out every 8th result (forecast provides data every 3 hours). Push results into new array.
    for (let i = 0; i < forecastData.list.length; i = i + 8) {
        weekdays.push(new Date(forecastData.list[i].dt * 1000).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric'}));
        dailyTemps.push(avg(forecastData.list[i].main.temp_min, forecastData.list[i].main.temp_max));
        dailyForecast.push(forecastData.list[i].weather[0].description);
        dailyIcons.push(forecastData.list[i].weather[0].id);
    }

    //Checks for state of F/C conversion switch to convert data appropriately prior to inserting into HTML document.
    if ($('#myonoffswitch').is(':checked')) {
        for (let i = 0; i < dailyTemps.length; i++)
            dailyTemps[i] = kelvintoFahrenheit(dailyTemps[i]) + '&deg' + 'F';
    }
    else {
        for (let i = 0; i < dailyTemps.length; i++)
            dailyTemps[i] = kelvinToCelsius(dailyTemps[i]) + '&deg' + 'C';
    }

    //data insertion into HTML
    $('#dayOne').html(weekdays[0]);
    $('#dayTwo').html(weekdays[1]);
    $('#dayThree').html(weekdays[2]);
    $('#dayFour').html(weekdays[3]);
    $('#dayFive').html(weekdays[4]);

    $('#dayOneTemp').html(dailyTemps[0]);
    $('#dayTwoTemp').html(dailyTemps[1]);
    $('#dayThreeTemp').html(dailyTemps[2]);
    $('#dayFourTemp').html(dailyTemps[3]);
    $('#dayFiveTemp').html(dailyTemps[4]);

    $('#dayOneWeather').html(dailyForecast[0]);
    $('#dayTwoWeather').html(dailyForecast[1]);
    $('#dayThreeWeather').html(dailyForecast[2]);
    $('#dayFourWeather').html(dailyForecast[3]);
    $('#dayFiveWeather').html(dailyForecast[4]);

    $('#day-one-icon').addClass('wi-owm-day-' + dailyIcons[0]);
    $('#day-two-icon').addClass('wi-owm-day-' + dailyIcons[1]);
    $('#day-three-icon').addClass('wi-owm-day-' + dailyIcons[2]);
    $('#day-four-icon').addClass('wi-owm-day-' + dailyIcons[3]);
    $('#day-five-icon').addClass('wi-owm-day-' + dailyIcons[4]);
}


//logic to decide appropriate weather quote.
function loadQuotes(weatherData) {

    //variables for weather conditions
    var temp = kelvintoFahrenheit(weatherData.main.temp);
    var code = weatherData.weather.id / 100;

    //variables for quotes
    const cold = 'Maybe just stay in bed, it\'s way too cold out there.';
    const chilly = 'Does the term \"sweater weather\" mean anything to you?';
    const dank = 'It\'s danker than a Florida swamp out there.';
    const rain = 'Do your best Mary Poppins impression.';
    const snow = 'It\'s the most wonderful time, of the...Oh, your car is buried in the snow? Yeah, sorry.';
    const thunderstorm = 'Lots of thunder, no cats.';
    const nice = 'It\'s so nice outside, you should...ohh, you\'re just gonna binge on Netflix, that\'s cool too.';
    const hot = 'You should fully expect to walk around in sweaty underwear today';
    const oneHundredPlus = 'Congratulations on moving to the surface of the sun';
    const nightTime = 'Nighty night...zzz';
    var quote = '';

    //conditional statements determining appropriate quote.
    if (weatherData.weather[0].icon.includes('n')) {
        quote = nightTime;
    }
    else if (code == 6) {
        quote = snow;
    }
    else if (code == 3 || code == 5) {
        quote = rain;
    }
    else if (code == 2) {
        quote = thunderstorm;
    }
    else if (temp <= 20) {
        quote = cold;
    }
    else if (temp < 60) {
        quote = chilly;
    }
    else if (temp >= 60 && temp <= 80 && weatherData.main.humidty < 70) {
        quote = nice;
    }
    else if (temp >= 100) {
        quote = oneHundredPlus;
    }
    else if (temp > 80 && weatherData.main.humidity >= 70) {
        quote = dank;
    }
    else if (temp > 80) {
        quote = hot;
    }
    else {
        quote = 'Hi, please enjoy today\'s weather.'
    }

    //inserting quote into HTML document
    $('.sassy-text').html(quote);
}

function loadVideo(weatherData) {
    var dayNight = 'day';
    var suffix = 'clear';
    var code = weatherData.weather.id / 100;

    if (weatherData.weather[0].icon.includes('n')) {
        dayNight = 'night';
    }

    if (code == 2 || code == 3 || code == 5) {
        suffix = 'rain';
    }
    else if (code == 6) {
        suffix = 'snow';
    }
    else {
        suffix = 'clear';
    }

    $('#bgvid').attr('src', 'assets/' + dayNight + '-' + suffix + '.mp4');

}

//function to get user position, make API call, and obtain current weather.
function requestWeather() {
    //get user latitude and longitude via IP.
    $.getJSON("https://ipapi.co/json/", (function(position) {
        const userLat = position.latitude;
        const userLon = position.longitude;

        //craft dynamic weather API requests based on user location.
        const requestWeather = 'https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?' + 'lat=' + userLat + '&' + 'lon=' + userLon +'&APPID=' + apiKey;
        const requestForecast = 'https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/forecast?' + 'lat=' + userLat + '&' + 'lon=' + userLon + '&APPID=' + apiKey;

        //pulling current weather data and populating content in HTML document.
        $.getJSON(requestWeather, function(weatherData) {
            loadWeatherData(weatherData);
            loadQuotes(weatherData);
            loadVideo(weatherData);
            $('#myonoffswitch').click(function() {
                loadWeatherData(weatherData);
            });
        });

        //pull 5-day forecast and insert into HTML document.
        $.getJSON(requestForecast, function(forecastData) {
            loadForecastData(forecastData);
            $('#myonoffswitch').click(function() {
                loadForecastData(forecastData);
            });
        });
    }));
}

//call main function upon document load.
$(document).ready(function() {

    //quick status check.
    console.log("Good to go!");

    //main function that harnesses all others to load data into DOM.
    requestWeather();

    var src = "assets/day-snow.mp4";
    $('#bgvid').attr('src', src);




});
