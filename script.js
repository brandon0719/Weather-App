let weather = {
    "apiKey": "0f54791a3b6d22accc14a27f2a2c72f8",
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
        errorElement.style.opacity = 1; // Show the error

        // Hide the error after 3 seconds
        setTimeout(() => {
            errorElement.style.opacity = 0;
            // Wait for the transition to finish before hiding the element
            setTimeout(() => {
                errorElement.style.display = 'none'; // Or set innerText to an empty string
            }, 500); // Should match the duration of the CSS transition
        }, 1000);
    },
    displayWeather: function(data) {
        const { name } = data;
        const { icon, description } = data.weather[0]
        const { temp, humidity } = data.main
        const { speed } = data.wind
        // console.log(name, icon, description,temp, humidity, speed)   //for testing
        document.querySelector(".city").innerText = " Weather in " + name;
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
    }
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
