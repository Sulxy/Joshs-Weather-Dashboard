var cityInput = document.querySelector(".city-input");
var searchButton = document.querySelector(".search-btn");
var currentWeatherDiv = document.querySelector(".current-weather");
var weatherCardsDiv = document.querySelector(".weather-cards");

var API_KEY = "73576cb615d23d886fc40c208c4379e5"; // OpenWeather API Key

var createWeatherCard = (cityName, weatherItem, index) => {
    var tempFahrenheit = Math.floor((weatherItem.main.temp - 273.15) * 9/5 + 32); // Convert temperature from Kelvin to Fahrenheit and remove decimal digits
    var windSpeed = Math.floor(weatherItem.wind.speed); // Drop the integers after the decimal in the wind speed

    if(index === 0) { // Big weather card
        return `<div class="details">
                <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                <h4>Temperature: ${tempFahrenheit}°F</h4>
                <h4>Wind: ${windSpeed} MPH</h4>
                <h4>Humidity: ${weatherItem.main.humidity}%</h4>
            </div>
            <div class="icon">
                <img src="http://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                <h4>${weatherItem.weather[0].description}</h4>  
            </div>`;
    } else { // Small weather cards
        return `<li class="card"> 
                <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                <img src="http://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather icon">
                <h4>Temp: ${tempFahrenheit}°F</h4>
                <h4>Wind: ${windSpeed} MPH</h4>
                <h4>Humidity: ${weatherItem.main.humidity}%</h4>
            </li>`;
    }
}

var getWeatherDetails = (cityName, lat, lon) => {
    var WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
        // Filter the forecasts to get only one forecast per day
        var uniqueForecastDays = [];
        var fiveDayForecast = data.list.filter(forecast => {
            var forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
        });

        // Clears previous weather data
        cityInput.value = ""; // Clear the city input
        currentWeatherDiv.innerHTML = "";
        weatherCardsDiv.innerHTML = ""; // Clear the weather cards div

        // Create weather cards for each day in the five day forecast
        fiveDayForecast.forEach((weatherItem, index) => {
            if(index === 0) {
                currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            } else {
                weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            }
        });
    }).catch(() => {
        alert("Error occured while fetching the weather forecast!");
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

searchButton.addEventListener("click", getCityCoordinates);cityInput.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        getCityCoordinates();
    }
});
