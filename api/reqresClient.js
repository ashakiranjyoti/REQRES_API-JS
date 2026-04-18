// api/reqresClient.js
// API helper class wrapping ReqRes endpoints using Playwright's request fixture.

const logger = require('../utils/logger');

class ReqResClient {
  /**
   * @param {import('@playwright/test').APIRequestContext} request
   * The Playwright request context is provided by the test runner.
   */
  constructor(request) {
    this.request = request;
  }

  // GET /users?page=2
  async getUsers(page = 2) {
    logger.step(`GET /users?page=${page}`);
    const startTime = Date.now();
    const response = await this.request.get('/users', {
      params: { page },
    });
    return { response, startTime };
  }

  // POST /users
  async createUser(payload) {
    logger.step('POST /users (create user)');
    const startTime = Date.now();
    const response = await this.request.post('/users', {
      data: payload,
    });
    return { response, startTime };
  }

  // PUT /users/{id}
  async updateUser(id, payload) {
    logger.step(`PUT /users/${id} (update user)`);
    const startTime = Date.now();
    const response = await this.request.put(`/users/${id}`, {
      data: payload,
    });
    return { response, startTime };
  }

  // DELETE /users/{id}
  async deleteUser(id) {
    logger.step(`DELETE /users/${id}`);
    const startTime = Date.now();
    const response = await this.request.delete(`/users/${id}`);
    return { response, startTime };
  }
}

module.exports = ReqResClient;

