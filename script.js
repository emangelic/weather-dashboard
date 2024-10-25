// script.js
const apiKey = '17680223dd95e53f292ac87a38175121';
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const currentWeatherSection = document.getElementById('current-weather');
const forecastSection = document.getElementById('forecast');
const historyList = document.getElementById('history-list');

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const city = cityInput.value;
  getWeatherData(city);
  addToHistory(city);
});

function getWeatherData(city) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
      displayCurrentWeather(data);
      displayForecast(data);
    });
}

function displayCurrentWeather(data) {
  const { name, list } = data;
  const { dt, main, weather, wind } = list[0];
  const date = new Date(dt * 1000).toLocaleDateString();

  currentWeatherSection.innerHTML = `
    <h2>${name} (${date})</h2>
    <img src="https://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="${weather[0].description}">
    <p>Temperature: ${main.temp}°C</p>
    <p>Humidity: ${main.humidity}%</p>
    <p>Wind Speed: ${wind.speed} m/s</p>
  `;
}

function displayForecast(data) {
  const { list } = data;
  forecastSection.innerHTML = '<h2>5-Day Forecast</h2>';

  for (let i = 1; i < list.length; i += 8) {
    const { dt, main, weather, wind } = list[i];
    const date = new Date(dt * 1000).toLocaleDateString();

    forecastSection.innerHTML += `
      <div>
        <h3>${date}</h3>
        <img src="https://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="${weather[0].description}">
        <p>Temperature: ${main.temp}°C</p>
        <p>Humidity: ${main.humidity}%</p>
        <p>Wind Speed: ${wind.speed} m/s</p>
      </div>
    `;
  }
}

function addToHistory(city) {
  const li = document.createElement('li');
  li.textContent = city;
  li.addEventListener('click', () => {
    getWeatherData(city);
  });
  historyList.appendChild(li);
  saveToLocalStorage(city);
}

function saveToLocalStorage(city) {
  let history = JSON.parse(localStorage.getItem('history')) || [];
  history.push(city);
  localStorage.setItem('history', JSON.stringify(history));
}

function loadHistory() {
  const history = JSON.parse(localStorage.getItem('history')) || [];
  history.forEach(city => {
    const li = document.createElement('li');
    li.textContent = city;
    li.addEventListener('click', () => {
      getWeatherData(city);
    });
    historyList.appendChild(li);
  });
}

loadHistory();
