import React, { useState } from 'react';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import { AuthModel } from '../models/auth';
import { loginUser } from '../services/auth';

const Auth = ({ onLogin }) => {
    const [credentials, setCredentials] = useState(new AuthModel());
    const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(credentials);
      onLogin(response);
    } catch (error) {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="w-100" style={{ maxWidth: '400px' }}>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="username">Usuario</Label>
            <Input
              type="text"
              name="username"
              id="username"
              value={credentials.username}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="password">Contraseña</Label>
            <Input
              type="password"
              name="password"
              id="password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </FormGroup>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <Button color="primary" type="submit">Iniciar Sesión</Button>
        </Form>
      </div>
    </Container>
  );
};

export default Auth;