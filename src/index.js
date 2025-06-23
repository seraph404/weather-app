import "./styles.css";
import mockData from "./mockData.json";

const weatherButton = document.querySelector("#generate-weather");
weatherButton.addEventListener("click", getWeatherData);

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

  function getAPI() {
    return Promise.resolve(mockData);
  }

  getAPI().then((data) => {
    const temp = data.currentConditions.temp;
    const feelsLike = data.currentConditions.feelslike;
    const icon = data.currentConditions.icon;
    const conditions = data.currentConditions.conditions;
    renderCurrentWeather({ temp, feelsLike, icon, conditions });
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
}

function renderCurrentWeather({ temp, feelsLike, icon, conditions }) {
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
  tempDiv.textContent = `${temp} F (Feels like ${feelsLike} F)`;
  tempDiv.classList.add("temp-div");

  div.append(h2);
  iconDiv.append(iconEl);
  div.append(iconDiv);
  div.append(conditionsDiv);
  div.append(tempDiv);
  outputDiv.append(div);
}
// for testing purposes
renderCurrentWeather();
