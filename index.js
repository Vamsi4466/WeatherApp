const userTab = document.querySelector("[data-userweather]");
const searchTab = document.querySelector("[data-searchweather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");

const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");

const userInfoContainer = document.querySelector(".user-info-container");
const searchInput = document.querySelector("[data-searchinput]");



//initially variables need??

let currentTab = userTab;

const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
currentTab.classList.add("current-tab");



function switchTab(clickedTab) {
    if(clickedTab != currentTab) {
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")) {
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        } else {
            searchForm.classList.remove("active");
            userInfoContainer.classList.add("active");
            // grantAccessContainer.classList.add("active");

            

            

            getfromSessionStorage();
        }

    }
}
// if(currentTab===userTab) {
//     geoLocation();
// }

userTab.addEventListener("click", () => {
    switchTab(userTab);
   
});

searchTab.addEventListener("click", () => {
    switchTab(searchTab);
})

function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates) {
        grantAccessContainer.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        
        fetchUserWeatherInfo(coordinates);
    }
}

 async function fetchUserWeatherInfo(coordinates) {
    const {lat, lon} = coordinates;

    grantAccessContainer.classList.remove("active");

    loadingScreen.classList.add("active");

    //API call
   
    

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        renderWeatherInfo(data);

    }
    catch(err) {
        loadingScreen.classList.remove("active");
    }
}

function renderWeatherInfo(weatherInfo) {

    //firstly we have to fetch the elements

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    //fetch values from weatherInfo object and put in UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src= `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
    userInfoContainer.classList.add("active");

}

function geoLocation() {
    if(navigator.geolocation){

        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        // an alert for no geolocation support available
        alert("no geolocation support available");
    }
}

function showPosition(position) {
    const usercoordinates = {
        lat:position.coords.latitude,
        lon:position.coords.longitude,

    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(usercoordinates));
    fetchUserWeatherInfo(usercoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", geoLocation);



searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName=searchInput.value;

    if(cityName==="") {
        return;
    }
    else {
        fetchSearchWeatherInfo(cityName);
    }
})



async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");

        if (response.ok) {
            // Display weather info only if the response is successful
            renderWeatherInfo(data);
        } else {
            // Handle error cases, for example, alert the user
            alert(`Error: ${data.message}`);
        }
    } catch (err) {
        // Handle network errors
        alert("Error fetching weather data");
    }
}





