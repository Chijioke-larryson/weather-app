document.getElementById("searchBtn").addEventListener("click", () => {
    const city = document.getElementById("cityField").value.trim();
    if (city) {
        getCoordinates(city);
    } else {
        showError("Please enter a valid city name");
    }
});

async function getCoordinates(city) {
    showError("");
    try {
        const response = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
        );

        if (!response.ok) throw new Error("City not found");

        const data = await response.json();
        if (!data.results || data.results.length === 0)
            throw new Error("Location not found");

        const { latitude, longitude, name, country } = data.results[0];
        getWeather(latitude, longitude, name, country);
    } catch (error) {
        showError(error.message);
    }
}

async function getWeather(latitude, longitude, city, country) {
    try {
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        );

        if (!response.ok) throw new Error("Weather data not available");

        const data = await response.json();
        displayWeather(data.current_weather, city, country);
    } catch (error) {
        showError(error.message);
    }
}

function displayWeather(weather, city, country) {
    const weatherContainer = document.getElementById("weatherContainer");
    const cityHeader = document.getElementById("cityName");
    const temp = document.getElementById("temperature");
    const condition = document.getElementById("condition");
    const windSpeed = document.getElementById("windSpeed");
    const suggestion = document.getElementById("suggestion");

    const weatherDescription = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Rime fog",
        51: "Light drizzle",
        61: "Rain",
        71: "Snow",
        95: "Thunderstorm",
    };

    const weatherCondition =
        weatherDescription[weather.weathercode] || "Unknown condition";

    // 🧠 Suggestion logic
    let advice = "";
    const temperature = weather.temperature;
    const wind = weather.windspeed;
    const code = weather.weathercode;

    if (code >= 61 || code === 95) {
        advice = "⚠️ Bad weather — stay indoors and check local updates.";
    } else if (temperature > 35) {
        advice = "🥵 It's very hot — stay hydrated and avoid the sun.";
    } else if (temperature < 10) {
        advice = "🥶 It's quite cold — wear warm clothes!";
    } else if (wind > 30) {
        advice = "🌬️ Strong wind — be cautious if going outside.";
    } else {
        advice = "✅ Weather looks good — you can go about your day!";
    }

    weatherContainer.style.display = "block";
    cityHeader.textContent = `${city}, ${country}`;
    temp.textContent = `🌡️ Temperature: ${temperature}°C`;
    condition.textContent = `🌥️ Condition: ${weatherCondition}`;
    windSpeed.textContent = `💨 Wind Speed: ${wind} km/h`;
    suggestion.textContent = advice;
}

function showError(message) {
    const weatherContainer = document.getElementById("weatherContainer");
    weatherContainer.style.display = "none";
    const errorPara = document.getElementById("errorMessage");
    errorPara.textContent = message;
}
