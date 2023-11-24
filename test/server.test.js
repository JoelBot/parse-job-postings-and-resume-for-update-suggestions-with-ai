const { expect } = require('chai');
const sinon = require('sinon');
const supertest = require('supertest');
const express = require('express');
const axios = require('axios');

const app = require('../src/server'); // Update the path accordingly

describe('Express server', () => {
  let server;

  // Mocking axios.post to avoid actual HTTP requests during tests
  before(() => {
    sinon.stub(axios, 'post').resolves({ data: { choices: [{ text: 'Mocked response' }] } });
  });

  // Start the Express server before tests
  before((done) => {
    server = app.listen(3001, () => {
      done();
    });
  });

  // Close the server after tests
  after((done) => {
    server.close(() => {
      done();
    });
  });

  it('should respond with a generated response', async () => {
    const response = await supertest(app)
      .post('/generate-response')
      .send({ prompt: 'Test prompt' })
      .expect(200);

    expect(response.body.response).to.equal('Mocked response');
  });

  it('should handle missing prompt', async () => {
    const response = await supertest(app)
      .post('/generate-response')
      .expect(400);

    expect(response.body.error).to.equal('Prompt is required.');
  });

  it('should handle internal server error', async () => {
    // Simulate an error when making an axios.post call
    axios.post.rejects(new Error('Test error'));

    const response = await supertest(app)
      .post('/generate-response')
      .send({ prompt: 'Test prompt' })
      .expect(500);

    expect(response.body.error).to.equal('Internal Server Error');
  });
});