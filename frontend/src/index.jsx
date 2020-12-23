import React from 'react';
import ReactDOM from 'react-dom';

import SearchForm from './components/SearchForm/SearchForm';
import Map from './components/Map/Map';

class App extends React.Component {
  constructor(props) {
    super(props);
    // this.handleGeolocationChange = this.handleGeolocationChange.bind(this);
    this.state = {
      coords: {
        latitude: 51.782065,
        longitude: 19.459279,
      },
      mainObject: {
        maxDistance: 1000, // meters or seconds
        params: [
          { key: 0, value: 0 },
        ],
        timeReachOn: false,
      },
      relativeObject: {
        applicable: false,
        maxDistance: 500,
        params: [],
      },
      geojson: {
        type: 'FeatureCollection',
        features: [
          {type: "Feature", id: 283321511, geometry: {type: "Point", coordinates: [19.492405, 51.760484]}, properties: {}}
        ],
      },
    };


  }

  handleGeolocationChange = (coords) => {
    this.setState({ coords });

    // this.setState({ coords: { ...coords } },
      
    //   );
  }

  handleGeojsonChange = (geojson) => {
    this.setState({ geojson });
  }

  render() {
    const { coords, mainObject, relativeObject, geojson } = this.state;
    return (
      <div className="wrapper">
        <div className="searchForm">
          <SearchForm
            coords={coords}
            mainObject={mainObject}
            relativeObject={relativeObject}
            geojson={geojson}
            handleGeolocationChange={this.handleGeolocationChange}
            handleGeojsonChange={this.handleGeojsonChange}
          />
        </div>
        <Map
          coords={coords}
          geojson={geojson}
        />
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app'),
);
