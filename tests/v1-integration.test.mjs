import test from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import {
  createUser,
  getUserByEmail,
  saveCreation,
  getSavedCreationsByUserId,
  createBookingRequest,
  updateBookingStatus,
  updateUnleashReview,
  getOperatingMode,
  setOperatingMode,
  isPaymentsEnabled,
  setPaymentsEnabled,
} from '../src/lib/pilotService.ts';

test('Integration: Customer registration and saved creations flow', async () => {
  const testEmail = `test_chef_${Date.now()}@plateplay.test`;
  const pwdHash = await bcrypt.hash('TestChef2026!', 10);

  const user = await createUser({
    name: 'Test Chef Maya',
    email: testEmail,
    passwordHash: pwdHash,
    phone: '+91 99887 76655',
  });

  assert.ok(user.id, 'User should have unique ID');
  assert.equal(user.role, 'CUSTOMER', 'Role should be CUSTOMER');
  assert.equal(user.email, testEmail);

  // Retrieve user
  const retrieved = await getUserByEmail(testEmail);
  assert.ok(retrieved);
  assert.equal(retrieved.id, user.id);

  // Save a custom dish from Build Your Plate
  const creation = await saveCreation({
    userId: user.id,
    dishName: 'Fiery Truffle Margherita',
    kitchenId: 'pizzeria',
    dishId: 'classic-pizza',
    base: 'classic-dough',
    sauce: 'spicy-arrabbiata',
    cheeseOrMain: 'fresh-mozzarella',
    toppings: ['truffle-glaze', 'fresh-basil'],
    dietaryTags: ['Vegetarian'],
  });

  assert.ok(creation.id);
  assert.equal(creation.dishName, 'Fiery Truffle Margherita');

  // Verify retrieval
  const userCreations = await getSavedCreationsByUserId(user.id);
  assert.ok(userCreations.length >= 1);
  assert.equal(userCreations[0].id, creation.id);
});

test('Integration: End-to-end UNLEASH booking request and feasibility review', async () => {
  const customerEmail = `unleash_guest_${Date.now()}@plateplay.test`;

  // 1. Create booking request for UNLEASH
  const booking = await createBookingRequest({
    kitchenId: 'pizzeria',
    packageId: 'unleash',
    groupSize: 4,
    customerName: 'Aarav Patel',
    customerEmail,
    customDishDetails: 'Three-cheese smoked gouda calzone with caramelized fig balsamic reduction',
    dietaryRequirements: ['Vegetarian'],
  });

  assert.ok(booking.publicReference.startsWith('PP-BK-'));
  assert.equal(booking.status, 'PENDING');
  assert.equal(booking.packageName, 'UNLEASH');
  assert.equal(booking.estimatedPricePaise, 439600); // 4 * ₹1099 = ₹4,396

  // 2. Attempting to approve UNLEASH before feasibility check MUST throw
  await assert.rejects(
    async () => {
      await updateBookingStatus(booking.id, 'APPROVED', 'Premature approval attempt');
    },
    /UNLEASH custom recipe package requires feasibility clearance/,
    'Should throw error when approving unreviewed UNLEASH recipe'
  );

  // 3. Admin completes feasibility review
  const reviewed = await updateUnleashReview(
    booking.id,
    {
      feasibilityStatus: 'FEASIBLE',
      ingredientCheck: true,
      equipmentCheck: true,
      safetyCheck: true,
      costReviewPaise: 439600,
      reviewNotes: 'Smoked gouda and fresh figs sourced from specialty pantry.',
    },
    'head-chef@plateplay.com'
  );

  assert.ok(reviewed);
  assert.equal(reviewed.unleashReview.feasibilityStatus, 'FEASIBLE');

  // 4. Now approval succeeds!
  const approved = await updateBookingStatus(
    booking.id,
    'APPROVED',
    'Feasibility cleared. Studio prepped.',
    'head-chef@plateplay.com'
  );

  assert.ok(approved);
  assert.equal(approved.status, 'APPROVED');

  // 5. Complete session
  const completed = await updateBookingStatus(
    booking.id,
    'COMPLETED',
    'Session completed and enjoyed by guests.',
    'host@plateplay.com'
  );

  assert.ok(completed);
  assert.equal(completed.status, 'COMPLETED');
});

test('Integration: Configuration and Payment Feature Flag control', async () => {
  // Test operating modes
  await setOperatingMode('PILOT');
  let mode = await getOperatingMode();
  assert.equal(mode, 'PILOT');

  await setOperatingMode('DEMO');
  mode = await getOperatingMode();
  assert.equal(mode, 'DEMO');

  // Test payments flag
  await setPaymentsEnabled(false);
  let payments = await isPaymentsEnabled();
  assert.equal(payments, false, 'Payments must be false by default');
});

