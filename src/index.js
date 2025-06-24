import "./styles.css";
import mockData from "./mockData.json";

const weatherButton = document.querySelector("#generate-weather");
weatherButton.addEventListener("click", getWeatherData);
const temperatureToggle = document.querySelector(".temperature-toggle");
temperatureToggle.addEventListener("click", toggleTemperature);
const state = {
  unit: "fahrenheit",
  temperature: null,
  feelslike: null,
};

// reset the radio button selector upon page load
window.addEventListener("DOMContentLoaded", () => {
  const fahrenheitRadio = document.getElementById("fahrenheit");
  if (fahrenheitRadio) {
    fahrenheitRadio.checked = true;
  }
});

function toggleTemperature(event) {
  // return if there is no temperature state
  if (state.temperature === null || state.feelslike === null) {
    return;
  }
  const tempDiv = document.querySelector(".temp-div");
  if (event.target.id === "fahrenheit") {
    state.unit = "fahrenheit";
    // if there's no output yet
    if (!tempDiv) {
      convertToFahrenheit();
    } else {
      convertToFahrenheit(state.temperature, state.feelslike);
      toggleTempOutput(tempDiv);
    }
  } else if (event.target.id === "celsius") {
    state.unit = "celsius";
    // if there's no output yet
    if (!tempDiv) {
      convertToCelsius();
    } else {
      convertToCelsius(state.temperature, state.feelslike);
      toggleTempOutput(tempDiv);
    }
  }
}

function convertToCelsius(temp, feelsLike) {
  return {
    temperature: ((temp - 32) * 5) / 9,
    feelsLikeTemp: ((feelsLike - 32) * 5) / 9,
  };
}

function convertToFahrenheit(temp, feelsLike) {
  return {
    temperature: (temp * 9) / 5 + 32,
    feelsLikeTemp: (feelsLike * 9) / 5 + 32,
  };
}

function getWeatherData(event) {
  event.preventDefault();
  const apiKey = process.env.WEATHER_API_KEY;
  const cityName = document.querySelector("#city");
  const city = cityName.value;
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=${apiKey}`;
  console.log(city);

  if (!city) {
    alert("Please enter a city name.");
    return;
  }
}

function getAPI() {
  return Promise.resolve(mockData);
}

getAPI().then((data) => {
  // make sure temp displays as needed
  if (state.unit === "fahrenheit") {
    // by default the API returns fahrenheit
    state.temperature = data.currentConditions.temp;
    state.feelslike = data.currentConditions.feelslike;
  } else if (state.unit === "celsius") {
    const { temperature, feelsLikeTemp } = convertToCelsius(
      data.currentConditions.temp,
      data.currentConditions.feelslike
    );
    state.temperature = temperature;
    state.feelslike = feelsLikeTemp;
  }
  const icon = data.currentConditions.icon;
  const conditions = data.currentConditions.conditions;
  //renderCurrentWeather({ icon, conditions });
  renderWeatherCard({
    location: data.address,
    avgTemp: data.currentConditions.temp,
    hiTemp: data.days[0].tempmax,
    loTemp: data.days[0].tempmin,
    feelsLikeTemp: data.currentConditions.feelslike,
    conditions: data.currentConditions.conditions,
    icon: data.currentConditions.icon,
  });

  const days = data.days;
  //renderFiveDayForecast(days);
});

/* Commenting out so I don't use up my API uses */
//   fetch(url, {
//     mode: "cors",
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(data);
//       // code here
//     })
//     .catch((error) => {
//       console.error("Fetch error:", error);
//     });
//

function createCurrentSection() {
  const outputDiv = document.querySelector(".output");
  h2.textContent = "Current weather";
  div.append(h2);
}

function renderWeatherCard({
  location,
  avgTemp,
  hiTemp,
  loTemp,
  feelsLikeTemp,
  conditions,
  icon,
}) {
  const iconMap = {
    "clear-day": "wi-day-sunny",
    "clear-night": "wi-night-clear",
    "partly-cloudy-day": "wi-day-cloudy",
    "cloudy": "wi-cloudy",
    "rain": "wi-rain",
    "snow": "wi-snow",
    "thunderstorm": "wi-thunderstorm",
  };

  const outputDiv = document.querySelector(".output");

  const dailyForecastDiv = document.createElement("div");
  dailyForecastDiv.classList.add("section", "daily-forecast");
  const dailyForecastHeading = document.createElement("h2");
  dailyForecastHeading.textContent = "Daily forecast";
  const cardDiv = document.createElement("div");
  cardDiv.classList.add("card");
  const locationHeading = document.createElement("h3");
  locationHeading.classList.add("location");
  locationHeading.textContent = location;

  /* weather icon */
  const weatherIcon = document.createElement("i");
  const iconClass = iconMap[icon] || "wi-na";
  weatherIcon.classList.add("wi", iconClass);

  const conditionDiv = document.createElement("div");
  conditionDiv.classList.add("condition");
  conditionDiv.textContent = conditions;

  const temperatureDiv = document.createElement("div");
  temperatureDiv.classList.add("temperature");

  const avgTempDiv = document.createElement("div");
  avgTempDiv.classList.add("avg-temp");
  avgTempDiv.textContent = `${avgTemp}°`;

  const feelsLikeDiv = document.createElement("div");
  feelsLikeDiv.classList.add("feels-like");
  feelsLikeDiv.textContent = `(feels like ${feelsLikeTemp}°)`;

  const highLowDiv = document.createElement("div");
  highLowDiv.classList.add("hi-lo");
  const hiSpan = document.createElement("span");
  hiSpan.classList.add("hi");
  hiSpan.textContent = `↑ ${hiTemp}°`;
  const loSpan = document.createElement("span");
  loSpan.classList.add("lo");
  loSpan.textContent = `↓ ${loTemp}°`;

  dailyForecastDiv.append(dailyForecastHeading);
  cardDiv.append(locationHeading);
  cardDiv.append(weatherIcon);
  cardDiv.append(conditionDiv);

  temperatureDiv.append(avgTempDiv, feelsLikeDiv, highLowDiv);
  highLowDiv.append(hiSpan, loSpan);
  cardDiv.append(temperatureDiv);

  dailyForecastDiv.append(cardDiv);
  outputDiv.append(dailyForecastDiv);
}

function renderFiveDayForecast(days) {
  const outputDiv = document.querySelector(".output");
  console.log(days[1]);
  const div = document.createElement("div");
  const h2 = document.createElement("h2");

  div.classList.add("section", "five-day-forecast");
  h2.textContent = "Five-day forecast";

  div.append(h2);
  outputDiv.append(div);

  const forecastWrapper = document.createElement("div");
  forecastWrapper.classList.add("forecast-wrapper");
  div.append(forecastWrapper);

  let numDays = [1, 2, 3, 4, 5];

  console.log(numDays);

  numDays.forEach((day) => {
    const forecastWrapper = document.querySelector(".forecast-wrapper");
    if (!forecastWrapper) return;
    console.log(days[day].datetime);
    // create a div that holds temperature data
    const dailyCardDiv = document.createElement("div");
    dailyCardDiv.classList.add("daily");

    const cardTitle = document.createElement("h3");
    const dateString = days[day].datetime;
    const date = new Date(dateString);
    const weekdayFormatter = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
    });
    cardTitle.textContent = weekdayFormatter.format(date);

    dailyCardDiv.append(cardTitle);
    // append the temp data div to
    forecastWrapper.append(dailyCardDiv);

    renderCurrentWeather({
      conditions: days[day].conditions,
      icon: days[day].icon,
    });
  });
}

function toggleTempOutput(tempDiv) {
  tempDiv.textContent = "";
  tempDiv.textContent = `${Math.round(state.temperature)}°${
    state.unit.toUpperCase()[0]
  }  (Feels like ${Math.round(state.feelslike)}°${
    state.unit.toUpperCase()[0]
  } )`;
}
