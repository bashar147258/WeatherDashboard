//import {DateTime} from 'luxon';
//const dt=DateTime.now()


//var currentDay=document.querySelector(".current_day").dt.toLocaleString(DateTime.DATE_MED);
//console.log(currentDay)
let weather = {
    apiKey:"f6505c28302fab5b6861ede57b9122d3",
    fetchCoord: function(city){
        fetch(
            "https://api.openweathermap.org/data/2.5/weather?q="+ city +"&appid="+this.apiKey
        ).then((response) => {
            if (!response.ok) {
              throw new Error("City not found.");
            }
            return response.json();
          })
          .then((data) => this.fetchWeather(data));
        },
    fetchWeather: function(data){
        const lat=data.coord[1];
        const lon=data.coord[0];
        fetch(
            "https://api.openweathermap.org/data/2.5/onecall?lat="+ lat +"&lon="+lon+"&exclude=alerts,hourly,minutely&units=metric&appid="+this.apiKey
        ).then((response) => {
            if (!response.ok) {
              alert("No weather found.");
              throw new Error("No weather found.");
            }
            return response.json();
          })
          .then((data) => this.displayWeather(data));
    },
    displayWeather: function(data) {
        const {name} = data;
        const {icon , description} = data.current.weather[0];
        const {temp, humidity, uvi} = data.current;
        const {speed} = data.current.wind;
        console.log(name,icon,description,temp,humidity,temp,speed);
        document.querySelector(".city").innerText= "Weather in "+ name;
        document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector(".description").innerText=description;
        document.querySelector(".temperature").innerText=Math.round(temp)+"°C";
        document.querySelector(".humidity").innerText="Humidity: "+humidity+"%";
        document.querySelector(".wind").innerText-"Wind Speed: "+speed+"km/h"
        document.querySelector(".UV").innerText="UV Index: "+uvi;
        document.body.style.backgroundImage="url('https://source.unsplash.com/1600x900/?city," + name + "')";
    },
    search: function() {
        this.fetchCoord(document.querySelector(".search_bar").value)
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


