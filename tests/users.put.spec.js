// tests/users.put.spec.js
// Tests for PUT /users/{id} (update user)

const { test, expect } = require('@playwright/test');
const ReqResClient = require('../api/reqresClient');
const updateUserData = require('../test-data/updateUser.json');
const negativeUserData = require('../test-data/negativeUser.json');
const {
  assertSuccessStatus,
  assertStatusOneOf,
  assertHeaderContains,
  assertBodyField,
  assertResponseTime,
} = require('../utils/assertions');

test.describe('PUT /users/{id} (Update User)', () => {
  // Dynamic user id fetched from GET /users to avoid 404s
  let validUserId;
  // Derived invalid id for negative tests (very high id unlikely to exist)
  let invalidUserId;

  test.beforeAll(async ({ request }) => {
    const client = new ReqResClient(request);
    const { response } = await client.getUsers(1);
    await assertSuccessStatus(response);

    // Try to derive a valid id from JSON, but fall back safely if the response is HTML/non-JSON.
    let derivedId;
    const headers = await response.headers();
    const ct = headers['content-type'] || headers['Content-Type'];
    if (ct && ct.toLowerCase().includes('application/json')) {
      const body = await response.json();
      const firstUser = body?.data?.[0];
      derivedId = firstUser?.id;
    }

    validUserId = typeof derivedId === 'number' ? derivedId : 2;
    invalidUserId = typeof validUserId === 'number' ? validUserId + 10000 : 99999;
  });

  test('should update user successfully with valid id and payload', async ({ request }) => {
    const client = new ReqResClient(request);
    const payload = updateUserData.validUpdate;

    const { response, startTime } = await client.updateUser(validUserId, payload);

    // Accept any 2xx as success to avoid brittle status checks
    await assertSuccessStatus(response);
    await assertHeaderContains(response, 'content-type', 'application/json');

    await assertBodyField(
      response,
      (body) => body.name,
      (value) => expect(value).toBe(payload.name),
      'name should be updated',
    );
    await assertBodyField(
      response,
      (body) => body.job,
      (value) => expect(value).toBe(payload.job),
      'job should be updated',
    );
    await assertBodyField(
      response,
      (body) => body.updatedAt,
      (value) => expect(typeof value).toBe('string'),
      'updatedAt should be present',
    );

    await assertResponseTime(startTime, 2000, response);
  });

  test('should handle non-existing user id (negative test)', async ({ request }) => {
    const client = new ReqResClient(request);
    const { response } = await client.updateUser(negativeUserData.nonExistingId, updateUserData.validUpdate);

    // For a clearly non-existing id we accept either a 2xx "fake update"
    // or a 4xx "not found" style response (implementation detail of ReqRes).
    await assertStatusOneOf(response, [200, 404]);
    await assertBodyField(
      response,
      (body) => body.updatedAt,
      (value) => expect(value).toBeTruthy(),
      'updatedAt should still be present',
    );
  });

  test('should accept empty body but still respond (negative-ish)', async ({ request }) => {
    const client = new ReqResClient(request);
    const { response } = await client.updateUser(validUserId, updateUserData.emptyBody);

    await assertSuccessStatus(response);
    await assertBodyField(
      response,
      (body) => body.updatedAt,
      (value) => expect(value).toBeTruthy(),
      'updatedAt should be present even for empty body',
    );
  });
});

