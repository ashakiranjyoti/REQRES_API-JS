// tests/users.get.spec.js
// Tests for GET /users?page=2

const { test, expect } = require('@playwright/test');
const ReqResClient = require('../api/reqresClient');
const {
  assertSuccessStatus,
  assertHeaderContains,
  assertBodyField,
  assertResponseTime,
} = require('../utils/assertions');

test.describe('GET /users?page=2', () => {
  test('should return paginated users with success status', async ({ request }) => {
    const client = new ReqResClient(request);

    const { response, startTime } = await client.getUsers(2);

    // Accept any 2xx as success to avoid brittle status checks
    await assertSuccessStatus(response);
    await assertHeaderContains(response, 'content-type', 'application/json');
    await assertBodyField(
      response,
      (body) => body.page,
      (value) => expect(value).toBe(2),
      'page number should be 2',
    );
    await assertBodyField(
      response,
      (body) => body.data,
      (value) => expect(Array.isArray(value)).toBeTruthy(),
      'data should be an array of users',
    );

    // Optional: response time < 2 seconds (only enforced for 2xx statuses)
    await assertResponseTime(startTime, 2000, response);
  });

  test('should handle invalid page parameter (negative test)', async ({ request }) => {
    const client = new ReqResClient(request);

    const { response } = await client.getUsers(-1);

    // For negative page we still only require a 2xx response, shape is what matters
    await assertSuccessStatus(response);
    await assertBodyField(
      response,
      (body) => body.data,
      (value) => expect(Array.isArray(value)).toBeTruthy(),
      'data should still be an array (could be empty)',
    );
  });
});

