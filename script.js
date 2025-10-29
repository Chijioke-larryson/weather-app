document.getElementById("searchBtn").addEventListener("click", () => {
    const city = document.getElementById("cityField").value.trim();
    if(city) {
        getCoordinates(city);
    }
    else{
        showError("PLease enter a  Valid City Name")
    }
});

async function getCoordinates(city) {
    showError("");
    try{
        const response = await  fetch (
            `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
        );

        if (!response.ok) {
            throw new Error("City not Found")
        }

        const  data = await  response.json();
        if(!data.result || data.results.length === 0) {
            throw new Error("Location not Found")
        }
        const {latitude, longitude, name, country} = data.results[0];
        getWeather(latitude, longitude, name, country);


    }catch (error) {
        showError(error.message)

    }
}

async  function getWeather(latitude, longitude, city, country, suggestion){
    try {
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`

        );

        if (!response.ok) {
            throw new Error("Weather data not available")
        }
        const data = await response.json();
        displayWeather(data.current_weather, city,country, suggestion)

    }catch (error) {
        showError(error.message)

    }
}

function displayWeather(weather, city, country,suggestion) {
    const weatherContainer = document.getElementById("weatherContainer")
    const cityHeader = document.getElementById("cityName ")
    const temp = document.getElementById("temperature")
    const condition = document.getElementById("condition")
    const windSpeed = document.getElementById('windSpeed')

    const weatherCondition =
        weatherDescription[weather.weathercode] || "Unknown Condition"

    weatherContainer.style.display = "black";
    cityHeader.textContent = `${city}, ${country}`;
    temp.textContent = `Temperature: ${weather.temperature}°C`;
    condition.textContent = `Condition: ${weatherCondition}`;
    windSpeed.textContent = `Wind Speed: ${weather.windspeed} km/h`;
}

function showError(message) {
    const weatherContainer = document.getElementById("weatherContainer");
    weatherContainer.style.display = "none";
    const errorPara = document.getElementById("errorMessage");
    errorPara.textContent = message;
}