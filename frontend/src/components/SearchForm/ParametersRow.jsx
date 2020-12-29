import React from 'react';
import { Form, Col } from 'react-bootstrap';

function ParametersRow({ rowId, object, objectParams, params, handleParamsChange }) {
  const keyName = objectParams.find((keyObj) => keyObj.id === params.key)?.name;
  const valueName = objectParams
    .find((keyObj) => keyObj.id === params.key)?.values
    .find((value) => value.id === params.value);

  const createKeyOptions = () => {
    const keys = objectParams.map((keyObj) => <option id={keyObj.id} key={keyObj.id}>{keyObj.name}</option>);
    return keys;
  };

  const createValueOptions = () => {
    const values = objectParams.find((keyObj) => keyObj.id === params?.key)?.values
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
    <Form.Group className="parameters-form-group">
      <Form.Row className="align-items-center">
        <Col xs="auto">
          <Form.Label>Key</Form.Label>
        </Col>
        <Col>
          <Form.Control as="select" name="key" data-cy={`parameter-key-${object}-${rowId}`} defaultValue={keyName} onChange={onParamsChange}>
            {createKeyOptions()}
          </Form.Control>
        </Col>
        <Col xs="auto">
          <Form.Label>Value</Form.Label>
        </Col>
        <Col>
          <Form.Control as="select" name="value" data-cy={`parameter-value-${object}-${rowId}`} defaultValue={valueName} onChange={onParamsChange}>
            {createValueOptions()}
          </Form.Control>
        </Col>
      </Form.Row>
    </Form.Group>
  );
}

export default ParametersRow;
