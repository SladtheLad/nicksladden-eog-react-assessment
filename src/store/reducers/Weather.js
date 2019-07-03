import * as actions from "../actions";

const initialState = {
  temperatureinCelsius: null,
  temperatureinFahrenheit: null,
  description: "",
  locationName: ""
};

const toF = c => (c * 9) / 5 + 32;
const toFixed = temp => temp.toFixed(1);

const weatherDataRecevied = (state, action) => {
  const { getWeatherForLocation } = action;
  const {
    description,
    locationName,
    temperatureinCelsius
  } = getWeatherForLocation;

  return {
    temperatureinCelsius: toFixed(temperatureinCelsius),
    temperatureinFahrenheit: toFixed(toF(temperatureinCelsius)),
    description,
    locationName
  };
};

const handlers = {
  [actions.WEATHER_DATA_RECEIVED]: weatherDataRecevied
};

export default (state = initialState, action) => {
  const handler = handlers[action.type];
  if (typeof handler === "undefined") return state;
  return handler(state, action);
};
