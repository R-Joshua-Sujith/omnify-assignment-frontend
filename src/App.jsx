import { useEffect, useState, useRef } from "react";
import axios from "axios";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SearchIcon from "@mui/icons-material/Search";
import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat";
import SpeedIcon from "@mui/icons-material/Speed";
import LoadingSpinner from "./LoadingSpinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
function App() {
  const [city, setCity] = useState("");
  const [temp, setTemp] = useState("");
  const [description, setDescription] = useState("");
  const [humidity, setHumidity] = useState("");
  const [speed, setSpeed] = useState("");
  const [result, setResult] = useState("hide");
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState("weather.jpg");

  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    setIsLoading(true);
    axios
      .get(
        `https://omnify-assignment-joshua14.onrender.com/fetchData/bengaluru`
      )
      .then((response) => {
        setCity("Bangalore");
        setTemp(response.data.main.temp);
        setDescription(response.data.weather[0].description);
        setHumidity(response.data.main.humidity);
        setSpeed(response.data.wind.speed);
        setImage("cloud.png");
        setResult("display");
        setIsLoading(false);
      });
  }, []);

  const fetchData = () => {
    if (city === "") {
      toast.warning("Please enter a location");
      setResult("hide");
    } else {
      setIsLoading(true);
      axios
        .get(
          `https://omnify-assignment-joshua14.onrender.com/fetchData/${city}`
        )
        .then((response) => {
          setTemp(response.data.main.temp);
          setDescription(response.data.weather[0].description);
          setHumidity(response.data.main.humidity);
          setSpeed(response.data.wind.speed);
          if (response.data.weather[0].main === "Clear") setImage("clear.png");
          else if (response.data.weather[0].main === "Rain")
            setImage("rain.png");
          else if (response.data.weather[0].main === "Snow")
            setImage("snow.png");
          else if (response.data.weather[0].main === "Clouds")
            setImage("cloud.png");
          else if (response.data.weather[0].main === "Mist")
            setImage("mist.png");
          else setImage("cloud.png");
          setResult("display");
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
          setResult("hide");
          setCity("");
          toast.warning(err.response.data);
        });
    }
  };
  return (
    <div>
      <h1>Weather App</h1>
      <div className="container">
        <div className="searchBar">
          <div className="subSearchBar">
            <LocationOnIcon />
            <input
              type="text"
              placeholder="Enter your location"
              onChange={(event) => setCity(event.target.value)}
              value={city}
              ref={inputRef}
            />
          </div>
          <SearchIcon className="searchIcon" onClick={fetchData} />
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className={result}>
            <div className="result">
              <img src={image} alt="" />
              <h2>
                {temp}
                <sup>&deg;C</sup>
              </h2>
              <h3>{description}</h3>
            </div>

            <div className="subResult">
              <div className="details">
                <DeviceThermostatIcon />
                <p>
                  <b>{humidity}%</b> Humidity
                </p>
              </div>
              <div className="details">
                <SpeedIcon />
                <p>
                  <b>{speed} km/h</b> Wind Speed
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
