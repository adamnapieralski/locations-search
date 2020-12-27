import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

function ParametersRow({ objectParams, params, handleParamsChange }) {
  const keyName = objectParams.find((key) => key.id === params.key)?.name;
  const valueName = objectParams
    .find((key) => key.id === params.key)?.values
    .find((value) => value.id === params.value);

  const createKeyOptions = () => {
    const keys = objectParams.map((key) => <option id={key.id} key={key.id}>{key.name}</option>);
    return keys;
  };

  const createValueOptions = () => {
    const values = objectParams.find((key) => key.id === params?.key)?.values
      .map((value) => <option id={value.id} key={value.id}>{value.name}</option>);
    return values;
  };

  const onParamsChange = (event) => {
    handleParamsChange({
      ...params,
      [event.target.name]: event.target.selectedIndex,
    });
  };

  return (
    <Form.Group>
      <Form.Row className="align-items-center">
        <Col xs="auto">
          <Form.Label>Key</Form.Label>
        </Col>
        <Col>
          <Form.Control as="select" name="key" defaultValue={keyName} onChange={onParamsChange}>
            {createKeyOptions()}
          </Form.Control>
        </Col>
        <Col xs="auto">
          <Form.Label>Value</Form.Label>
        </Col>
        <Col>
          <Form.Control as="select" name="value" defaultValue={valueName} onChange={onParamsChange}>
            {createValueOptions()}
          </Form.Control>
        </Col>
      </Form.Row>
    </Form.Group>
  );
}

export default ParametersRow;
