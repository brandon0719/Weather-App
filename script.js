let weather = {
    "apiKey": "0f54791a3b6d22accc14a27f2a2c72f8",

    //DISPLAY CURRENT WEATHER
    fetchWeather: function (city) {
        fetch(
            "https://api.openweathermap.org/data/2.5/weather?q="
            + city 
            + "&units=imperial&appid=" 
            + this.apiKey
        )
        .then(response => {
            if (!response.ok) {
                throw new Error("No weather found.");
            }
            return response.json();
        })
        .then((data) => this.displayWeather(data))
        .catch(error => {
            this.displayError(error);
        });
    },
    displayError: function(error) {
        const errorElement = document.querySelector(".error");
        errorElement.innerText = error.message;
        errorElement.style.display = 'block'; // Reset display to default or 'block'
        errorElement.style.opacity = 1; // Reset opacity to fully visible
    
        // Hide the error after 3 seconds
        setTimeout(() => {
            errorElement.style.opacity = 0;
            // Optionally, hide the element after the fade-out transition
            setTimeout(() => {
                errorElement.style.display = 'none';
            }, 500); // This timeout should match your CSS transition duration
        }, 2000);
    },    
    displayWeather: function(data) {
        const { name } = data;
        const { icon, description } = data.weather[0]
        const { temp, humidity } = data.main
        const { speed } = data.wind
        // console.log(name, icon, description,temp, humidity, speed)   //for testing
        document.querySelector(".city").innerText = "Current Weather: " + name;
        document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = temp + "°F";
        document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
        document.querySelector(".wind").innerText = "Wind Speed: " + speed + " mph";
        document.querySelector(".weather").classList.remove("loading");
        document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?" + name + "')"
    },
    search: function () {
        this.fetchWeather(document.querySelector(".search-bar").value);
        this.fetchForecast(document.querySelector(".search-bar").value);
    },


    //DISPLAY CURRENT FORECAST
    fetchForecast: function (city) {
        fetch(
            "https://api.openweathermap.org/data/2.5/forecast?q="
            + city 
            + "&units=imperial&appid=" 
            + this.apiKey
        )
        .then(response => response.json())
        .then(data => this.displayForecast(data))
        .catch(error => {
            console.error('Error fetching forecast data:', error);
        });
    },
    displayForecast: function (data) {
        const forecastContainer = document.querySelector(".forecast-container");
        forecastContainer.innerHTML = ''; // Clear previous forecast data

        let dayData = {};
        data.list.forEach(forecast => {
            const date = new Date(forecast.dt * 1000);
            const day = date.toISOString().split('T')[0]; // Get the date in YYYY-MM-DD format

            if (!dayData[day]) {
                dayData[day] = [];
            }
            dayData[day].push(forecast);
        });

        for (let day in dayData) {
            let forecasts = dayData[day];
            let dayContainer = document.createElement('div');
            dayContainer.className = 'forecast-day';

            const dayLabel = new Date(day).toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric' });
            dayContainer.innerHTML = `<h3 class="day-label">${dayLabel}</h3>`;

            forecasts.forEach(forecast => {
                const timestamp = new Date(forecast.dt * 1000);
                const time = timestamp.getHours() + ":00"; // Format the time
                const temp = forecast.main.temp;
                const icon = forecast.weather[0].icon;

                dayContainer.innerHTML += `
                    <div class="forecast-item">
                        <div>${time}</div>
                        <img src="https://openweathermap.org/img/wn/${icon}.png" alt="Weather icon">
                        <div>${temp}°F</div>
                    </div>
                `;
            });
            forecastContainer.appendChild(dayContainer);
        }
    },
};

document.querySelector(".search button")    //click button
    .addEventListener("click", function () {
        weather.search();
    });

document.querySelector(".search-bar")   //enter key
    .addEventListener("keyup", function (event) {
        if(event.key == "Enter") {
            weather.search();
        }
    })
weather.fetchWeather("New York");
weather.fetchForecast("New York");

