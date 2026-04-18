// tests/users.post.spec.js
// Tests for POST /users (create user)

const { test, expect } = require('@playwright/test');
const ReqResClient = require('../api/reqresClient');
const createUserData = require('../test-data/createUser.json');
const {
  assertSuccessStatus,
  assertHeaderContains,
  assertBodyField,
  assertResponseTime,
} = require('../utils/assertions');

test.describe('POST /users (Create User)', () => {
  test('should create user successfully with valid payload', async ({ request }) => {
    const client = new ReqResClient(request);
    const payload = createUserData.validUser;

    const { response, startTime } = await client.createUser(payload);

    // Accept any 2xx as success (201 is typical for create)
    await assertSuccessStatus(response);
    await assertHeaderContains(response, 'content-type', 'application/json');

    await assertBodyField(
      response,
      (body) => body.name,
      (value) => expect(value).toBe(payload.name),
      'name should match request',
    );
    await assertBodyField(
      response,
      (body) => body.job,
      (value) => expect(value).toBe(payload.job),
      'job should match request',
    );
    await assertBodyField(
      response,
      (body) => body.id,
      (value) => expect(typeof value).toBe('string'),
      'id should be generated',
    );

    await assertResponseTime(startTime, 2000, response);
  });

  test('should still respond when "job" field is missing (negative-ish scenario)', async ({ request }) => {
    const client = new ReqResClient(request);
    const payload = createUserData.missingJob;

    const { response } = await client.createUser(payload);

    // Demo API usually returns 201, but any 2xx is fine here
    await assertSuccessStatus(response);
    await assertBodyField(
      response,
      (body) => body.name,
      (value) => expect(value).toBe(payload.name),
      'name should be accepted',
    );
  });

  test('should still respond when "name" field is missing (negative-ish scenario)', async ({ request }) => {
    const client = new ReqResClient(request);
    const payload = createUserData.missingName;

    const { response } = await client.createUser(payload);

    // Again, any 2xx is treated as success
    await assertSuccessStatus(response);
    await assertBodyField(
      response,
      (body) => body.job,
      (value) => expect(value).toBe(payload.job),
      'job should be accepted',
    );
  });
});

