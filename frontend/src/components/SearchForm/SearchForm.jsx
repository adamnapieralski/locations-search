import React from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import ParametersRow from './ParametersRow';

import ErrorBoundary from '../ErrorBoundary/index';

const baseURL = process.env.ENDPOINT;

const coordsSettings = {
  precision: 6,
  step: 0.000001,
};

const getObjectParams = async () => {
  try {
    const response = await fetch(`${baseURL}/object-params`);
    return response.json();
  } catch (error) {
    ErrorBoundary.getDerivedStateFromError(error);
  }
  return {};
};

const postLocationSearch = async (data) => {
  try {
    const body = JSON.stringify(data);
    const response = await fetch(`${baseURL}/location-search`, {
      method: 'POST',
      body,
    });
    return response.json();
  } catch (error) {
    console.log(error);
  }
  return {};
};

class SearchForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      objectParams: [],
      mainObject: {
        maxDistance: 1000, // meters or seconds
        params: [
          { key: 0, value: 0 },
          { key: 0, value: 0 },
        ],
        timeReachOn: false,
      },
      relativeObject: {
        applicable: false,
        maxDistance: 500,
        params: [],
      },
    }
  }

  async componentDidMount() {
    const objectParams = await getObjectParams();
    this.setState({ objectParams });
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.onLocationCoordinatesChange({
          latitude: position.coords.latitude.toFixed(coordsSettings.precision),
          longitude: position.coords.longitude.toFixed(coordsSettings.precision),
        });
      }, () => {},
      );
    } else {
      // TODO handle geolocation not supported
    }
  }

  onLocationCoordinatesChange = (coords) => {
    const handleGeolocationChange = this.props.handleGeolocationChange;
    handleGeolocationChange(coords);
  }

  onLatitudeChange = (event) => {
    const { coords: { longitude } } = this.props;
    this.onLocationCoordinatesChange({ latitude: parseFloat(event.target.value), longitude: parseFloat(longitude) });
  }

  onLongitudeChange = (event) => {
    const { coords: { latitude } } = this.props;
    this.onLocationCoordinatesChange({ longitude: parseFloat(event.target.value), latitude: parseFloat(latitude) });
  }

  // onKeyChange = (event) => {
  //   const newParams = [...this.state.mainObject.params];
  //   newParams[0] = { ...newParams[0], key: event.target.selectedIndex };
  //   this.setState((state) => ({
  //     ...state,
  //     mainObject: {
  //       ...state.mainObject,
  //       params: newParams,
  //     },
  //   }));
  // }

  // onValueChange = (event) => {
  //   const newParams = [...this.state.mainObject.params];
  //   newParams[0] = { ...newParams[0], value: event.target.selectedIndex };
  //   this.setState((state) => ({
  //     ...state,
  //     mainObject: {
  //       ...state.mainObject,
  //       params: newParams,
  //     },
  //   }));
  // }

  onMainDistanceChange = (event) => {
    const { mainObject } = this.state;
    const newMainObject = { ...mainObject, maxDistance: event.target.value };
    this.setState({ mainObject: newMainObject });
  }

  onTimeReachChange = (event) => {
    const { mainObject } = this.state;
    const newMainObject = { ...mainObject, timeReachOn: event.target.checked };
    this.setState({ mainObject: newMainObject });
  }

  // createKeyOptions = () => {
  //   const { objectParams } = this.state;
  //   const keys = objectParams.map((key) => <option id={key.id} key={key.id}>{key.name}</option>);
  //   return keys;
  // }

  // createValueOptions = () => {
  //   const { mainObject: { params }, objectParams } = this.state;

  //   const values = objectParams.find((key) => key.id === params[0].key)?.values
  //     .map((value) => <option id={value.id} key={value.id}>{value.name}</option>);
  //   return values;
  // }

  createParamsRows = (object) => {
    const { objectParams, [object]: { params } } = this.state;
    return Array.from(Array(params.length).keys()).map((id) => (
      <ParametersRow
        key={id}
        objectParams={objectParams}
        params={params[id]}
        handleParamsChange={this.handleParamsChange(object, id)}
      />
    ));
  };

  addParamRow = (object) => {
    this.setState((state) => {
      const currObject = state[object];
      const newObject = {
        ...currObject,
        params: currObject.params.concat({ key: 0, value: 0}),
      };
      return {
        [object]: newObject,
      };
    });
  }

  removeParamRow = (object) => {
    this.setState((state) => {
      const currObject = state[object];
      if (currObject.params.length <= 0) {
        return state;
      }
      const newObject = {
        ...currObject,
        params: currObject.params.slice(0, -1),
      };
      return {
        [object]: newObject,
      };
    });
  }

  handleParamsChange = (object, id) => {
    return ({ key, value }) => {
      this.setState((state) => {
        const newParams = [...state[object].params];
        newParams[id] = { key, value };
        return {
          ...state,
          [object]: {
            ...state[object],
            params: newParams,
          },
        };
      });
    };
  };


  handleSubmit = async (event) => {
    event.preventDefault();
    const { mainObject, relativeObject } = this.state;
    const { handleGeojsonChange, coords } = this.props;
    const response = await postLocationSearch({
      mainObject,
      relativeObject,
      coords,
    });
    handleGeojsonChange(response);
  }

  render() {
    const { coords: { latitude, longitude } } = this.props;
    const { mainObject: { maxDistance, timeReachOn } } = this.state;

    console.log('state', this.state);
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Group>
          <Form.Label>Location coordinates</Form.Label>
          <Row>
            <Col>
              <Form.Control type="number" value={latitude} onChange={this.onLatitudeChange} step={coordsSettings.step} placeholder="Latitude" />
            </Col>
            <Col>
              <Form.Control type="number" value={longitude} onChange={this.onLongitudeChange} step={coordsSettings.step} placeholder="Longitude" />
            </Col>
          </Row>
        </Form.Group>
        <Form.Group>
          <Form.Label>Parameters</Form.Label>
          {this.createParamsRows('mainObject')}
          {/* <ParametersRow
            objectParams={this.state.objectParams}
            params={this.state.mainObject.params[0]}
            handleParamsChange={this.handleParamsChange('mainObject', 0)}
          /> */}
          {/* <Form.Group as={Row}>
            <Form.Label>Key:</Form.Label>
            <Col>
              <Form.Control as="select" onChange={this.onKeyChange}>
                {this.createKeyOptions()}
              </Form.Control>
            </Col>
            <Form.Label>Value:</Form.Label>
            <Col>
              <Form.Control as="select" onChange={this.onValueChange} placeholder="Value">
                {this.createValueOptions()}
              </Form.Control>
            </Col>
          </Form.Group> */}
        </Form.Group>
        <Row>
          <Button variant="outline-primary" onClick={() => this.addParamRow('mainObject')}>Add</Button>
          <Button variant="outline-danger" onClick={() => this.removeParamRow('mainObject')}>Remove</Button>
        </Row>

        <Form.Group as={Row}>
          <Form.Label>Distance:</Form.Label>
          <Col>
            <Form.Control type="number" min="0" step="1" value={maxDistance} onChange={this.onMainDistanceChange} />
          </Col>
          <Col>
            <Form.Check type="checkbox" label="Time reach" checked={timeReachOn} onChange={this.onTimeReachChange} />
          </Col>
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    );
  }
}

export default SearchForm;