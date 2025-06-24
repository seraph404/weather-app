import "./styles.css";
import mockData from "./mockData.json";

const weatherButton = document.querySelector("#generate-weather");
weatherButton.addEventListener("click", getWeatherData);
const temperatureToggle = document.querySelector(".temperature-toggle");
temperatureToggle.addEventListener("click", toggleTemperature);

// reset the radio button selector upon page load
window.addEventListener("DOMContentLoaded", () => {
  const fahrenheitRadio = document.getElementById("fahrenheit");
  if (fahrenheitRadio) {
    fahrenheitRadio.checked = true;
  }
});

function toggleTemperature(event) {
  console.log(event.target.id);
  const temps = document.querySelectorAll("[data-f][data-c]");
  temps.forEach((temp) => {
    let value;
    if (event.target.id === "celsius") {
      value = temp.dataset.c;
    } else if (event.target.id === "fahrenheit") {
      value = temp.dataset.f;
    } else {
      return;
    }

    if (temp.classList.contains("avg-temp")) {
      temp.textContent = `${value}°`;
    } else if (temp.classList.contains("feels-like")) {
      temp.textContent = `(feels like ${value}°)`;
    } else if (temp.classList.contains("hi")) {
      temp.textContent = `↑ ${value}°`;
    } else if (temp.classList.contains("lo")) {
      temp.textContent = `↓ ${value}°`;
    }
  });
}

function convertToCelsius(temp) {
  return Math.round(((temp - 32) * 5) / 9);
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

  fetch(url, {
    mode: "cors",
  })
    .then((response) => response.json())
    .then((data) => {
      renderCurrentWeather({
        location: data.address,
        avgTemp: data.currentConditions.temp,
        hiTemp: data.days[0].tempmax,
        loTemp: data.days[0].tempmin,
        feelsLikeTemp: data.currentConditions.feelslike,
        conditions: data.currentConditions.conditions,
        icon: data.currentConditions.icon,
      });
      renderWeeklyCards({ days: data.days });
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}

/* For using with mock data */
// function getAPI() {
//   return Promise.resolve(mockData);
// }

// getAPI().then((data) => {
//   renderCurrentWeather({
//     location: data.address,
//     avgTemp: data.currentConditions.temp,
//     hiTemp: data.days[0].tempmax,
//     loTemp: data.days[0].tempmin,
//     feelsLikeTemp: data.currentConditions.feelslike,
//     conditions: data.currentConditions.conditions,
//     icon: data.currentConditions.icon,
//   });
//   renderWeeklyCards({ days: data.days });
// });

// creates the currentWeather-specific elements
function renderCurrentWeather({
  location,
  avgTemp,
  hiTemp,
  loTemp,
  feelsLikeTemp,
  conditions,
  icon,
}) {
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

  cardDiv.append(locationHeading);

  dailyForecastDiv.append(dailyForecastHeading);
  dailyForecastDiv.append(cardDiv);
  outputDiv.append(dailyForecastDiv);

  // create the card content for this area
  renderWeatherCardContent({
    divContainer: dailyForecastDiv, // keeps the wrapper div variable generic
    cardDiv: cardDiv, // keeps the card div variable generic
    avgTemp,
    hiTemp,
    loTemp,
    feelsLikeTemp,
    conditions,
    icon,
  });
}

// creates common card content
function renderWeatherCardContent({
  divContainer,
  cardDiv,
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

  /* weather icon */
  const weatherIcon = document.createElement("i");
  const iconClass = iconMap[icon] || "wi-na";
  weatherIcon.classList.add("wi", iconClass);

  const conditionDiv = document.createElement("div");
  conditionDiv.classList.add("condition");
  conditionDiv.textContent = conditions;

  const temperatureDiv = document.createElement("div");
  temperatureDiv.classList.add("temperature");

  avgTemp = Math.round(avgTemp);
  const avgTempDiv = document.createElement("div");
  avgTempDiv.classList.add("avg-temp");
  avgTempDiv.dataset.f = avgTemp;
  avgTempDiv.dataset.c = convertToCelsius(avgTemp);
  avgTempDiv.textContent = `${avgTemp}°`;

  feelsLikeTemp = Math.round(feelsLikeTemp);
  const feelsLikeDiv = document.createElement("div");
  feelsLikeDiv.classList.add("feels-like");
  feelsLikeDiv.dataset.f = feelsLikeTemp;
  feelsLikeDiv.dataset.c = convertToCelsius(feelsLikeTemp);
  feelsLikeDiv.textContent = `(feels like ${feelsLikeTemp}°)`;

  const highLowDiv = document.createElement("div");
  highLowDiv.classList.add("hi-lo");
  hiTemp = Math.round(hiTemp);
  const hiSpan = document.createElement("span");
  hiSpan.classList.add("hi");
  hiSpan.dataset.f = hiTemp;
  hiSpan.dataset.c = convertToCelsius(hiTemp);
  hiSpan.textContent = `↑ ${hiTemp}°`;
  loTemp = Math.round(loTemp);
  const loSpan = document.createElement("span");
  loSpan.classList.add("lo");
  loSpan.dataset.f = loTemp;
  loSpan.dataset.c = convertToCelsius(loTemp);
  loSpan.textContent = `↓ ${loTemp}°`;

  cardDiv.append(weatherIcon);
  cardDiv.append(conditionDiv);

  temperatureDiv.append(avgTempDiv, feelsLikeDiv, highLowDiv);
  highLowDiv.append(hiSpan, loSpan);
  cardDiv.append(temperatureDiv);

  divContainer.append(cardDiv);
}

function renderWeeklyCards({ days }) {
  const outputDiv = document.querySelector(".output");

  const weeklyForecastDiv = document.createElement("div");
  weeklyForecastDiv.classList.add("section", "weekly-forecast");
  const weeklyForecastHeading = document.createElement("h2");
  weeklyForecastHeading.textContent = "Five-day forecast";
  const cardsDiv = document.createElement("div");
  cardsDiv.classList.add("cards");

  // extract only the next 5 days from the days array
  const nextFiveDays = days.filter(function (currentItem, index) {
    return index >= 1 && index <= 5;
  });

  // create cards for each day
  nextFiveDays.forEach((day) => {
    console.log(day);
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card");
    // create the card content
    renderWeatherCardContent({
      divContainer: weeklyForecastDiv,
      cardDiv: cardDiv,
      avgTemp: day.temp,
      hiTemp: day.tempmax,
      loTemp: day.tempmin,
      feelsLikeTemp: day.feelslike,
      conditions: day.conditions,
      icon: day.icon,
    });

    cardsDiv.append(cardDiv);
  });

  weeklyForecastDiv.append(weeklyForecastHeading);
  weeklyForecastDiv.append(cardsDiv);

  outputDiv.append(weeklyForecastDiv);
}
