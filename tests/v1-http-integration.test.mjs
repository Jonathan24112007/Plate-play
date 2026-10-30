import test from 'node:test';
import assert from 'node:assert/strict';

const BASE_URL = 'http://127.0.0.1:3000';

test('Integration 1: Health check endpoint returns v1.0.0 and disabled payments flag', async () => {
  const res = await fetch(`${BASE_URL}/api/health`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.status, 'healthy');
  assert.equal(data.version, 'v1.0.0');
  assert.equal(data.paymentsEnabled, false, 'Payments must default to disabled');
  assert.equal(data.services.payments, 'disabled-prelaunch');
});

test('Integration 2: Customer registration succeeds with valid data', async () => {
  const uniqueEmail = `chef_${Date.now()}@plateplay.test`;
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Chef Ananya Sharma',
      email: uniqueEmail,
      password: 'PlatePlaySecure2026!',
      phone: '+91 98765 43210',
    }),
  });

  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.equal(data.user.email, uniqueEmail);
  assert.equal(data.user.role, 'CUSTOMER');

  // Verify duplicate registration rejection with 409
  const dupRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Duplicate Chef',
      email: uniqueEmail,
      password: 'PlatePlaySecure2026!',
    }),
  });
  assert.equal(dupRes.status, 409, 'Duplicate email must return 409 Conflict');
});

test('Integration 3: Forgot password handles email request gracefully', async () => {
  const res = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test_guest@plateplay.com' }),
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
});

test('Integration 4: Booking creation with pricing calculations and UNLEASH recipe details', async () => {
  const guestEmail = `vikram_${Date.now()}@example.com`;
  const res = await fetch(`${BASE_URL}/api/book`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      kitchenId: 'pizzeria',
      packageId: 'unleash',
      groupSize: 4,
      customerName: 'Vikram Sengupta',
      customerEmail: guestEmail,
      customerPhone: '+91 91234 56789',
      customDishDetails: 'Artisan Sourdough Burrata Pizza with Charred Peach Glaze',
      dietaryRequirements: ['Vegetarian'],
      occasion: 'Anniversary celebration',
    }),
  });

  assert.equal(res.status, 201);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(data.booking.publicReference.startsWith('PP-BK-'));
  assert.equal(data.booking.packageName, 'UNLEASH');
  assert.equal(data.booking.status, 'PENDING');
  assert.equal(data.booking.estimatedPricePaise, 439600); // 4 * ₹1099 = ₹4,396

  // Verify public booking-status lookup requiring reference and email
  const statusRes = await fetch(
    `${BASE_URL}/api/booking-status?ref=${encodeURIComponent(data.booking.publicReference)}&email=${encodeURIComponent(guestEmail)}`
  );
  assert.equal(statusRes.status, 200);
  const statusData = await statusRes.json();
  assert.equal(statusData.booking.publicReference, data.booking.publicReference);
  assert.equal(statusData.booking.packageName, 'UNLEASH');
});

test('Integration 5: Payment endpoints strictly enforce pre-launch disabled state and authorization', async () => {
  // 1. GET status confirms disabled flag
  const statusRes = await fetch(`${BASE_URL}/api/payments/create-order`);
  assert.equal(statusRes.status, 200);
  const statusData = await statusRes.json();
  assert.equal(statusData.enabled, false);

  // 2. Unauthenticated POST order creation returns 401
  const unauthRes = await fetch(`${BASE_URL}/api/payments/create-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bookingId: 'any-id' }),
  });
  assert.equal(unauthRes.status, 401);
});

test('Integration 6: Protected admin operations endpoints reject unauthenticated requests', async () => {
  const res = await fetch(`${BASE_URL}/api/admin/operations`);
  assert.equal(res.status, 401, 'Admin operations must require authenticated session');

  const feasRes = await fetch(`${BASE_URL}/api/admin/bookings/test-id/feasibility`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'FEASIBLE' }),
  });
  assert.equal(feasRes.status, 401, 'Feasibility review must require admin session');
});

test('Integration 7: Security Headers are present on responses', async () => {
  const res = await fetch(`${BASE_URL}/`);
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('x-frame-options'), 'SAMEORIGIN');
  assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(res.headers.get('referrer-policy'), 'strict-origin-when-cross-origin');
});
