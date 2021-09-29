//import {DateTime} from 'luxon';
//const dt=DateTime.now()


//var currentDay=document.querySelector(".current_day").dt.toLocaleString(DateTime.DATE_MED);
//console.log(currentDay)
let weather = {
    apiKey:"f6505c28302fab5b6861ede57b9122d3",
    fetchWeather: function(city){
        fetch(
            "https://api.openweathermap.org/data/2.5/weather?q="+ city +"&appid="+this.apiKey
        ).then((response) => {
            if (!response.ok) {
              alert("Error: City not found! Please ensure that the city has been spelt correctly ")
              throw new Error("City not found.");
            }
            return response.json();
          })
          .then(function(data){
              currentCity=data.name;
              lat=data.coord.lat;
              lon=data.coord.lon;
              console.log(currentCity)
              console.log(lat)
              return fetch("https://api.openweathermap.org/data/2.5/onecall?lat="+ lat +"&lon="+lon+"&exclude=alerts,hourly,minutely&units=metric&appid=f6505c28302fab5b6861ede57b9122d3") //This is breaking but why
              //https://api.openweathermap.org/data/2.5/onecall?lat=-33.8679&lon=151.2073&exclude=alerts,hourly,minutely&units=metric&appid=f6505c28302fab5b6861ede57b9122d3
            }).then(function (response) {
                if (!response.ok) {
                    throw new Error("Weather not found.");
                  }
                  return response.json();
            }).then((data) => this.displayWeather(data));
        },
    /*fetchWeather: function(data){
        const lat=data.coord[1];
        const lon=data.coord[0];
        console.log(lat);
        console.log(lon);
        fetch(
            "https://api.openweathermap.org/data/2.5/onecall?lat="+ lat +"&lon="+lon+"&exclude=alerts,hourly,minutely&units=metric&appid="+this.apiKey
        ).then((response) => {
            if (!response.ok) {
              throw new Error("No weather found.");
            }
            return response.json();
          })
          .then((data) => this.displayWeather(data));
    },*/
    displayWeather: function(data) {
        const {name} = fetchWeather.currentCity; //Need to grab from fetchWeather
        const {icon , description} = data.current.weather[0];
        const {temp, humidity, uvi, wind_speed} = data.current;
        //console.log(name,icon,description,temp,humidity,temp,speed);
        document.querySelector(".city").innerText= "Weather in "+ name;
        document.querySelector(".curr_icon").src = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
        document.querySelector(".description").innerText=description;
        document.querySelector(".curr_temperature").innerText=Math.round(temp)+"°C";
        document.querySelector(".curr_humidity").innerText="Humidity: "+humidity+"%";
        document.querySelector(".curr_wind").innerText-"Wind Speed: "+wind_speed+"km/h"
        document.querySelector(".UV").innerText="UV Index: "+uvi;
        document.body.style.backgroundImage="url('https://source.unsplash.com/1600x900/?city," + name + "')";
    },
    search: function() {
        this.fetchWeather(document.querySelector(".search_bar").value)
    },
};

document.querySelector(".search button").addEventListener("click", function() {
    weather.search();

});

document.querySelector(".search_bar").addEventListener("keyup", function(event){
    if (event.key =="Enter"){
        weather.search();
    }
});


