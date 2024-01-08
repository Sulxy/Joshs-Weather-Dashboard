var cityInput = document.querySelector(".city-input");
var searchButton = document.querySelector(".search-btn");
var API_KEY = "73576cb615d23d886fc40c208c4379e5"; // OpenWeather API Key

var getWeatherDetails = (cityName, lat, lon) => {
    var WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
        console.log(data);

        var uniqueForecastDays = [];
        data.list.filter(forecast => {
            var forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDate.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
        });
    }).catch(() => {
        alert("Error fetching weather forecast!");
    });
}

var getCityCoordinates = () => {
    var cityName = cityInput.value.trim(); // Get user input city name and remove whitespace
    if(!cityName) return; // Return if cityName is empty
    var GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    // Fetch city coordinates from OpenWeather API
    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        if(!data.length) return alert("Location not found!");
        var {name, lat, lon} = data[0];
        getWeatherDetails(name, lat, lon);
    }).catch(() => {
        alert("Error fetching weather data!");
    });
}

searchButton.addEventListener("click", getCityCoordinates);