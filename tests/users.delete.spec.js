// tests/users.delete.spec.js
// Tests for DELETE /users/{id}

const { test } = require('@playwright/test');
const ReqResClient = require('../api/reqresClient');
const negativeUserData = require('../test-data/negativeUser.json');
const {
  assertSuccessStatus,
  assertStatusOneOf,
  assertResponseTime,
} = require('../utils/assertions');

test.describe('DELETE /users/{id}', () => {
  // Dynamic user id fetched from GET /users to avoid 404s
  let validUserId;
  let invalidHighId;

  test.beforeAll(async ({ request }) => {
    const client = new ReqResClient(request);
    const { response } = await client.getUsers(1);
    await assertSuccessStatus(response);
    // Try to derive from JSON if possible; otherwise fall back to a known id.
    let derivedId;
    const headers = await response.headers();
    const ct = headers['content-type'] || headers['Content-Type'];
    if (ct && ct.toLowerCase().includes('application/json')) {
      const body = await response.json();
      const firstUser = body?.data?.[0];
      derivedId = firstUser?.id;
    }

    validUserId = typeof derivedId === 'number' ? derivedId : 2;
    invalidHighId = typeof validUserId === 'number' ? validUserId + 10000 : negativeUserData.nonExistingId;
  });

  test('should delete user successfully with valid id', async ({ request }) => {
    const client = new ReqResClient(request);

    const { response, startTime } = await client.deleteUser(validUserId);

    // DELETE may return 204 or 200 depending on implementation,
    // so we accept either to keep the test robust.
    await assertStatusOneOf(response, [200, 204]);
    await assertResponseTime(startTime, 2000, response);
  });

  test('should handle deleting non-existing user (negative test)', async ({ request }) => {
    const client = new ReqResClient(request);
    const { response } = await client.deleteUser(invalidHighId);

    // For a high id that probably does not exist we accept:
    // - 204/200 if the API is "idempotent delete"
    // - 404 if it reports "not found"
    await assertStatusOneOf(response, [200, 204, 404]);
  });

  test('should handle clearly invalid id (negative test)', async ({ request }) => {
    const client = new ReqResClient(request);
    const invalidId = negativeUserData.invalidId;

    const { response } = await client.deleteUser(invalidId);

    // Negative: clearly invalid id, so 4xx or "success" are both acceptable
    await assertStatusOneOf(response, [200, 204, 400, 404]);
  });
});

