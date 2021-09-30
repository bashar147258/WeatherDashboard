var forecasting =document.getElementById('5Day');
var savedSearch=document.getElementById('search_history')
var clearEl=document.querySelector(".clear_history")
let regionNames = new Intl.DisplayNames(['en'],{ type: 'region' });
let searchHistory=JSON.parse(localStorage.getItem("city")) || [];


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
              document.querySelector(".city").innerText= "Weather in "+ currentCity;
              document.querySelector(".country").innerText=regionNames.of(data.sys.country);
              document.body.style.backgroundImage="url('https://source.unsplash.com/1920x1080/?city," + currentCity + "')";
              //Feed the latitude and longitude to the onecall api
              return fetch("https://api.openweathermap.org/data/2.5/onecall?lat="+ lat +"&lon="+lon+"&exclude=alerts,hourly,minutely&units=metric&appid=f6505c28302fab5b6861ede57b9122d3") //This used to be +this.apiKey but that broke the code
            }).then(function (response) {
                if (!response.ok) {
                    throw new Error("Weather not found.");
                  }
                  return response.json();
            }).then((data) => this.displayWeather(data));
        },
    displayWeather: function(data) {
        const {icon , description} = data.current.weather[0];
        const {temp, humidity, uvi, wind_speed} = data.current;
        let dt =new Date(data.current.dt*1000)
        document.querySelector(".curr_icon").src = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
        document.querySelector(".curr_icon").alt=description;
        document.querySelector(".description").innerText=description;
        document.querySelector(".curr_temperature").innerText=Math.round(temp)+"°C";
        document.querySelector(".curr_humidity").innerText=" Humidity: "+humidity+"%";
        document.querySelector(".curr_wind").innerText=" Wind Speed: "+wind_speed+"m/s";
        document.querySelector(".UV").innerText=" UV Index: "+uvi;
            if (uvi <=2){
                //Do nothing
            } else if (uvi <=5) {
                document.querySelector(".UV").style.backgroundColor="#eed202" //Caution Yellow
            } else if (uvi <=7) {
                document.querySelector(".UV").style.backgroundColor="#ff9966"	//Amber
            } else if (uvi <=10){
                document.querySelector(".UV").style.backgroundColor="ff6700" //Blaze Orange
            }else{
                document.querySelector(".UV").style.backgroundColor="#cc3300" //Danger Red
            }
        document.querySelector(".current_day").innerText=dt.toDateString()//Should return current date
        //Forecasting
        forecast=''
        //for each day <5. Get requested information
        data.daily.forEach((day, idx)=> {
            if (idx<5){
                let newDt=new Date(day.dt * 1000);
                forecast+=`
                <div class='forecast'>
                    <h6 class=day>${newDt.toDateString()}</h6>
                    <div class="temp">${Math.round(day.temp.day)}°C</div>  
                    <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="${day.weather[0].description}" class="icon">
                    <div class="humidity">💧${day.humidity}%</div>
                    <div class="wind">💨${day.wind_speed}m/s</div>
                </div>
                `
            } else{
            }
        })
        forecasting.innerHTML=forecast;
    },
    search: function() {
        this.fetchWeather(document.querySelector(".search_bar").value)
        const searchTerm=document.querySelector(".search_bar").value
        console.log(searchTerm);
        searchHistory.push(searchTerm);
        localStorage.setItem("city",JSON.stringify(searchHistory));

    },
}

document.querySelector(".search button").addEventListener("click", function() {
    weather.search();
    renderHistory();
});

document.querySelector(".search_bar").addEventListener("keyup", function(event){
    if (event.key =="Enter"){
        weather.search();
        renderHistory();
    }
});

clearEl.addEventListener("click", function(event) {
    event.preventDefault();
    searchHistory=[];
    localStorage.clear();
    renderHistory();
    console.log(searchHistory);
});

function renderHistory(){
    console.log(searchHistory)
    savedSearch.innerHTML-"";
    for (let i=0; i < searchHistory.length, i++;) {
        console.log(searchHistory)
        const historyItem = document.createElement("input")
        historyItem.setAttribute("type", "text");
        historyItem.setAttribute("readonly", true);
        historyItem.classList.add(".");
        historyItem.setAttribute("value", searchHistory[i]);
        historyItem.addEventListener("click", function () {
            weather.search(historyItem.value)
        })
        savedSearch.append(historyItem);
        }
        if (searchHistory.length > 0) {
            weather.search(searchHistory[searchHistory.length - 1]);
}}
