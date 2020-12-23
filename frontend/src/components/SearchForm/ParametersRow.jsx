import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

function ParametersRow({ objectParams, params, handleParamsChange }) {
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
  }

  return (
    <Form.Group as={Row}>
      <Form.Label>Key:</Form.Label>
      <Col>
        <Form.Control as="select" name="key" onChange={onParamsChange}>
          {createKeyOptions()}
        </Form.Control>
      </Col>
      <Form.Label>Value:</Form.Label>
      <Col>
        <Form.Control as="select" name="value" onChange={onParamsChange}>
          {createValueOptions()}
        </Form.Control>
      </Col>
    </Form.Group>
  )
}

export default ParametersRow;