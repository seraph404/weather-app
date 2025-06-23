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
  renderCurrentWeather({ icon, conditions });
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

function renderCurrentWeather({ icon, conditions }) {
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

  outputDiv.innerHTML = "";

  const div = document.createElement("div");
  const h2 = document.createElement("h2");
  const iconDiv = document.createElement("div");
  const iconEl = document.createElement("i");
  const iconClass = iconMap[icon] || "wi-na";
  const conditionsDiv = document.createElement("div");
  const tempDiv = document.createElement("div");

  h2.textContent = "Current weather";
  iconEl.classList.add("wi", iconClass);
  conditionsDiv.textContent = conditions;
  tempDiv.textContent = `${Math.round(state.temperature)}°${
    state.unit.toUpperCase()[0]
  }  (Feels like ${Math.round(state.feelslike)}°${
    state.unit.toUpperCase()[0]
  } )`;
  tempDiv.classList.add("temp-div");

  div.append(h2);
  iconDiv.append(iconEl);
  div.append(iconDiv);
  div.append(conditionsDiv);
  div.append(tempDiv);
  outputDiv.append(div);
}

function toggleTempOutput(tempDiv) {
  tempDiv.textContent = "";
  tempDiv.textContent = `${Math.round(state.temperature)}°${
    state.unit.toUpperCase()[0]
  }  (Feels like ${Math.round(state.feelslike)}°${
    state.unit.toUpperCase()[0]
  } )`;
}
