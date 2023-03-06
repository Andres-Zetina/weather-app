const apiKey = "50ef546d51cf9a5c91c95095260c90e2";
const searchForm = document.querySelector('form');
const searchInput = document.querySelector('input');
const forecastContainer = document.querySelector('.forecast-container');

searchForm.addEventListener('submit', function( event) {
    event.preventDefault();
    const city = searchInput.value;
    if(city){
        getWeatherData(city);
        getForecastData(city);
    }
});

function getWeatherData(city){
    const url =`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const temperature = Math.round(data.main.temp - 273.15);
            const windSpeed = data.wind.speed;
            const humidity = data.main.humidity;

            document.querySelector('.weather-container h2:nth-of-type(1)').textContent = `Temperature: ${temperature} °C`;
            document.querySelector('.weather-container h2:nth-of-type(2)').textContent = `Wind: ${windSpeed} m/s`;
            document.querySelector('.weather-container h2:nth-of-type(3)').textContent = `Humidity: ${humidity} %`;
        })
        .catch(error => {
            console.error(error);
            document.querySelector('.weather-container').innerHTML = "unable to fetch weather data"
        })
}

function getForecastData(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    
    fetch(url)
      .then(response => response.json())
      .then(data => {
        // Group the forecast data by day
        const forecastsByDay = {};
        data.list.forEach(forecast => {
          const date = new Date(forecast.dt_txt);
          const dayOfWeek = date.toLocaleString("en-US", { weekday: "long" });
          const dayOfMonth = date.getDate();
          if (!forecastsByDay[dayOfMonth]) {
            forecastsByDay[dayOfMonth] = {
              dayOfWeek: dayOfWeek,
              temperature: forecast.main.temp,
              description: forecast.weather[0].description
            };
          }
        });
  
        // Build the HTML for the forecast cards
        let forecastHtml = '';
        Object.keys(forecastsByDay).forEach(dayOfMonth => {
          const forecastData = forecastsByDay[dayOfMonth];
          forecastHtml += `
            
            <div class="forecast-card row row-cols-1 row-cols-md-5 bg-primary justify-content-center">
              <h3 class="text-center">${forecastData.dayOfWeek}</h3>
              <h4 class="text-center">Temperature: ${forecastData.temperature} &deg;C</h4>
              <h4 class="text-center">${forecastData.description}</h4>
            </div>
          `;
        });
  
        forecastContainer.innerHTML = forecastHtml;
      })
      .catch(error => {
        console.error(error);
        forecastContainer.innerHTML = "Unable to fetch forecast data";
      });
  }
  
