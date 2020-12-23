import React from 'react';
import ErrorBoundary from '../ErrorBoundary/index';

const baseURL = process.env.ENDPOINT;

const getWeatherFromApiByCoords = async (coords) => {
  try {
    const params = new URLSearchParams(coords);
    const response = await fetch(`${baseURL}/weather?${params}`);
    return response.json();
  } catch (error) {
    ErrorBoundary.getDerivedStateFromError(error);
  }

  return {};
};

class Weather extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      icon: '',
      city: '',
      country: '',
      locationCoords: {},
    };
  }

  async componentDidMount() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.setState({
          locationCoords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        }, this.setWeatherDataAsyncByCoords);
      },
      () => {
        // to get data for defaultCity from env
        this.setWeatherDataAsyncByCoords();
      });
    } else {
      // TODO handle geolocation not supported
    }
  }

  async setWeatherDataAsyncByCoords() {
    const { locationCoords } = this.state;
    const weather = await getWeatherFromApiByCoords(locationCoords);

    this.setState({
      icon: weather.icon.slice(0, -1),
      city: weather.city,
      country: weather.country,
    });
  }

  render() {
    const { icon, city, country } = this.state;
    const locationText = `${city} [${country}]`;

    return (
      <div>
        <div className="icon">
          { icon && <img src={`/img/${icon}.svg`} alt="Current weather icon" /> }
        </div>
        <div className="location">
          <b>
            {locationText}
          </b>
        </div>
      </div>
    );
  }
}

export default Weather;
