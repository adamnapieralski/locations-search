import React from 'react';
import {
  Form,
  Button,
  Row,
  Col,
} from 'react-bootstrap';
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

const getTransportMeans = async () => {
  try {
    const response = await fetch(`${baseURL}/transport-means`);
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
    return { error };
  }
};

function emptyGeoJSON() {
  return {
    type: 'FeatureCollection',
    features: [],
  };
}

function ErrorBanner(props) {
  const { msg } = props;
  if (!msg) { return null; }
  return (
    <div className="error-banner">Error: {msg}</div>
  );
}

function Spinner(props) {
  const { active } = props;
  if (!active) {
    return null;
  }
  return (
    <div className="spinner-border" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  );
}

class SearchForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      objectParams: [],
      transportMeans: [],
      mainObject: {
        maxDistance: 1000, // meters or seconds
        params: [
          { key: 0, value: 0 },
        ],
        timeReachOn: false,
        transportMean: 0,
      },
      relativeObject: {
        applicable: false,
        maxDistance: 500,
        params: [
          { key: 0, value: 0 },
        ],
      },
      errorMsg: '',
      waitingForResponse: false,
    };
  }

  async componentDidMount() {
    const objectParams = await getObjectParams();
    const transportMeans = await getTransportMeans();
    this.setState({ objectParams, transportMeans });

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.onLocationCoordinatesChange({
          latitude: position.coords.latitude.toFixed(coordsSettings.precision),
          longitude: position.coords.longitude.toFixed(coordsSettings.precision),
        });
      }, () => {});
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

  onMainDistanceChange = (event) => {
    const { mainObject } = this.state;
    const newMainObject = { ...mainObject, maxDistance: parseInt(event.target.value, 10) };
    this.setState({ mainObject: newMainObject });
  }

  onRelativeDistanceChange = (event) => {
    const { relativeObject } = this.state;
    const newRelativeObject = { ...relativeObject, maxDistance: parseInt(event.target.value, 10) };
    this.setState({ relativeObject: newRelativeObject });
  }

  onTimeReachChange = (event) => {
    const { mainObject } = this.state;
    const newMainObject = { ...mainObject, timeReachOn: event.target.checked };
    this.setState({ mainObject: newMainObject });
  }

  onRelativeObjectApplicableChange = (event) => {
    const { relativeObject } = this.state;
    const newRelativeObject = { ...relativeObject, applicable: event.target.checked };
    this.setState({ relativeObject: newRelativeObject });
  }

  onWaitingForResponseChange = (isWaiting) => {
    this.setState({ waitingForResponse: isWaiting });
  }

  onErrorMsgChange = (msg) => {
    this.setState({ errorMsg: msg });
  }

  createRelativeObjectForm = () => {
    const { relativeObject: { applicable, maxDistance } } = this.state;

    if (applicable) {
      return (
        <Form.Group className="relative-form">
          <Form.Label>Parameters</Form.Label>
          {this.createParamsRows('relativeObject')}
          <Row className="relative-params-buttons">
            <Col xs="auto">
              <Button variant="outline-primary" data-cy="add-param-button" onClick={() => this.addParamRow('relativeObject')}>Add</Button>
            </Col>
            <Col xs="auto">
              <Button variant="outline-danger" data-cy="remove-param-button" onClick={() => this.removeParamRow('relativeObject')}>Remove</Button>
            </Col>
          </Row>
          <Form.Row className="align-items-center">
            <Form.Label as={Col} xs="auto">
              Distance [m]:
            </Form.Label>
            <Col xs="auto">
              <Form.Control type="number" min="0" step="1" data-cy="relative-distance-input" value={maxDistance} onChange={this.onRelativeDistanceChange} />
            </Col>
          </Form.Row>
        </Form.Group>
      );
    }
    return null;
  }

  onTransportMeanChange = (event) => {
    const { mainObject } = this.state;
    const newMainObject = { ...mainObject, transportMean: event.target.selectedIndex };
    this.setState({ mainObject: newMainObject });
  }

  createTransportMeanSelection = () => {
    const { transportMeans, mainObject: { timeReachOn } } = this.state;

    if (timeReachOn) {
      return (
        <Form.Row>
          <Form.Label as={Col}>
            Mean of transport:
          </Form.Label>
          <Col>
            <Form.Control as="select" name="key" data-cy="transport-mean" onChange={this.onTransportMeanChange}>
              {transportMeans.map((mean) => (
                <option id={mean.id} key={mean.id}>{mean.name}</option>
              ))}
            </Form.Control>
          </Col>
        </Form.Row>
      );
    }
    return null;
  }

  createParamsRows = (object) => {
    const { objectParams, [object]: { params } } = this.state;
    return Array.from(Array(params.length).keys()).map((id) => (
      <ParametersRow
        key={id}
        rowId={id}
        object={object}
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

      if (currObject.params.length <= 1) return state;

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
    this.onErrorMsgChange(null);
    this.onWaitingForResponseChange(true);
    const response = await postLocationSearch({
      mainObject,
      relativeObject,
      coords,
    });

    if (response.error) {
      this.onErrorMsgChange(response.error);
      this.onWaitingForResponseChange(false);
      handleGeojsonChange(emptyGeoJSON());
    } else {
      this.onErrorMsgChange(null);
      this.onWaitingForResponseChange(false);
      handleGeojsonChange(response);
    }
  }

  render() {
    const { coords: { latitude, longitude } } = this.props;
    const {
      mainObject: { maxDistance, timeReachOn },
      relativeObject: { applicable },
      errorMsg,
      waitingForResponse,
    } = this.state;

    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Group>
          <Form.Label>Location coordinates</Form.Label>
          <Row>
            <Col>
              <Form.Control type="number" value={latitude} onChange={this.onLatitudeChange} step={coordsSettings.step} data-cy="latitude" placeholder="Latitude" />
            </Col>
            <Col>
              <Form.Control type="number" value={longitude} onChange={this.onLongitudeChange} step={coordsSettings.step} data-cy="longitude" placeholder="Longitude" />
            </Col>
          </Row>
        </Form.Group>
        <Form.Group>
          <Form.Label>Parameters</Form.Label>
          {this.createParamsRows('mainObject')}
          <Row>
            <Col xs="auto">
              <Button variant="outline-primary" data-cy="add-param-button-main" onClick={() => this.addParamRow('mainObject')}>Add</Button>
            </Col>
            <Col xs="auto">
              <Button variant="outline-danger" data-cy="remove-param-button-main" onClick={() => this.removeParamRow('mainObject')}>Remove</Button>
            </Col>
          </Row>
        </Form.Group>
        <Form.Group>
          <Form.Row className="align-items-center">
            <Form.Label as={Col} xs="auto">
              Distance
              { (() => (timeReachOn ? ' [s]:' : ' [m]:'))() }
            </Form.Label>
            <Col xs="auto">
              <Form.Control type="number" min="0" step="1" data-cy="main-distance-input" value={maxDistance} onChange={this.onMainDistanceChange} />
            </Col>
            <Col xs="auto">
              <Form.Check type="checkbox" label="Time reach" data-cy="time-reach-checkbox" checked={timeReachOn} onChange={this.onTimeReachChange} />
            </Col>
          </Form.Row>
          {this.createTransportMeanSelection()}
        </Form.Group>
        <Form.Group>
          <Form.Check type="checkbox" label="Relative object" data-cy="relative-object-checkbox" checked={applicable} onChange={this.onRelativeObjectApplicableChange} />
        </Form.Group>
        {this.createRelativeObjectForm()}
        <Row>
          <Col xs="auto">
            <Button variant="primary" type="submit" data-cy="submit" disabled={waitingForResponse}>
              Search
            </Button>
          </Col>
          <Col xs="auto">
            <Spinner active={waitingForResponse} />
          </Col>
        </Row>
        <ErrorBanner msg={errorMsg} />
      </Form>
    );
  }
}

export default SearchForm;
