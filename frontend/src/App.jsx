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
        features: [],
      },

      searchPolygon: null
    };
  }

  handleGeolocationChange = (coords) => {
    this.setState({ coords });

    // this.setState({ coords: { ...coords } },
      
    //   );
  }

  handleMainObjectChange = (newMainObject) => {
    this.setState({ mainObject: newMainObject });
  }

  handleGeojsonChange = (data) => {
    console.log(data)
    this.setState({ geojson: data.geojson, searchPolygon: data.polygon });
  }

  render() {
    const { coords, mainObject, relativeObject, geojson, searchPolygon } = this.state;
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
            handleMainObjectChange={this.handleMainObjectChange}
          />
        </div>
        <Map
          coords={coords}
          geojson={geojson}
          mainObject={mainObject}
          searchPolygon={searchPolygon}
        />
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app'),
);
