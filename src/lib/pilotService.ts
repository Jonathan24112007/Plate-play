import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import { generatePublicReference } from "@/lib/bookingUtils";
import {
  sendBookingRequestReceived,
  sendBookingApproved,
  sendBookingDeclined,
  sendBookingCancelled,
} from "@/lib/email";

export interface UserItem {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  role: "CUSTOMER" | "ADMIN";
  emailVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: string;
  preferences?: {
    newsletter?: boolean;
    smsReminders?: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SavedCreationItem {
  id: string;
  userId: string;
  dishName: string;
  kitchenId: string;
  dishId: string;
  base: string;
  sauce: string;
  cheeseOrMain: string;
  toppings: string[];
  dietaryTags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface KitchenItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  status: "ACTIVE" | "COMING_SOON" | "CLOSED";
}

export interface PackageItem {
  id: string;
  slug: string;
  name: string;
  pricePerPersonPaise: number;
  durationMinutes: string;
  description: string;
  active: boolean;
  version?: number;
}

export interface SlotItem {
  id: string;
  kitchenId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  status: "AVAILABLE" | "BOOKED" | "BLOCKED" | "PAST";
  capacity: number;
  notes?: string;
}

export type BookingStatusType =
  | "DRAFT"
  | "PENDING"
  | "APPROVED"
  | "DECLINED"
  | "CANCELLED"
  | "COMPLETED";

export interface UnleashReview {
  feasibilityStatus: "PENDING" | "FEASIBLE" | "REQUIRES_MODIFICATION" | "REJECTED";
  ingredientCheck: boolean;
  equipmentCheck: boolean;
  safetyCheck: boolean;
  costReviewPaise?: number;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

export interface OperationalChecklist {
  coreIngredientsReady: boolean;
  specialtyIngredientsReady: boolean;
  onDemandIngredientsReady: boolean;
  equipmentSanitized: boolean;
  workstationSet: boolean;
  safetyBriefingCompleted: boolean;
  sessionCompleted: boolean;
  cleaningResetDone: boolean;
  staffNotes?: string;
  updatedAt?: string;
}

export interface PaymentDetails {
  enabled: boolean;
  status: "UNPAID" | "PENDING" | "PAID" | "REFUNDED" | "FAILED";
  orderId?: string;
  paymentId?: string;
  amountPaise: number;
  currency: string;
  paidAt?: string;
  method?: string;
  isTestMode: boolean;
}

export interface BookingRequestItem {
  id: string;
  publicReference: string;
  userId?: string;
  kitchenId: string;
  kitchenName: string;
  packageId: string;
  packageName: string;
  slotId?: string;
  slotDate?: string;
  slotTime?: string;
  groupSize: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  occasion?: string;
  dietaryRequirements: string[];
  dietaryNotes?: string;
  customDishDetails?: string;
  estimatedPricePaise: number;
  status: BookingStatusType;
  paymentStatus: "UNPAID" | "PENDING" | "PAID" | "REFUNDED" | "FAILED";
  paymentDetails?: PaymentDetails;
  unleashReview?: UnleashReview;
  operationalChecklist?: OperationalChecklist;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: Array<{
    previousStatus?: string;
    newStatus: string;
    changedAt: string;
    changedBy: string;
    notes?: string;
  }>;
}

export interface ActivityLogItem {
  id: string;
  actor: string;
  action: string;
  entityType: "BOOKING" | "SLOT" | "PACKAGE" | "USER" | "CONFIG" | "PAYMENT";
  entityId?: string;
  details?: string;
  timestamp: string;
}

export interface PilotStoreData {
  operatingMode: "DEMO" | "PILOT" | "LIVE";
  paymentsEnabled: boolean;
  kitchens: KitchenItem[];
  packages: PackageItem[];
  slots: SlotItem[];
  bookings: BookingRequestItem[];
  users: UserItem[];
  savedCreations: SavedCreationItem[];
  activityLogs: ActivityLogItem[];
}

const DEFAULT_KITCHENS: KitchenItem[] = [
  {
    id: "k-pizzeria",
    slug: "pizzeria",
    name: "Pizzeria Studio",
    description: "Stone ovens, artisanal dough, and blistered crusts.",
    status: "ACTIVE",
  },
  {
    id: "k-masala",
    slug: "masala-kitchen",
    name: "Masala Kitchen",
    description: "Vibrant whole spices, cast-iron skillets, and modern Indian bowls.",
    status: "ACTIVE",
  },
  {
    id: "k-wok",
    slug: "the-wok",
    name: "The Wok",
    description: "High-heat stir fry, noodle tossing, and signature dumpling steamers.",
    status: "COMING_SOON",
  },
  {
    id: "k-bakehouse",
    slug: "bakehouse",
    name: "Bakehouse",
    description: "Precision patisserie, artisan pastry laminations, and chocolate labs.",
    status: "COMING_SOON",
  },
];

const DEFAULT_PACKAGES: PackageItem[] = [
  {
    id: "pkg-play",
    slug: "play",
    name: "PLAY",
    pricePerPersonPaise: 59900,
    durationMinutes: "1–2 hours",
    description: "Pick a dish, follow a guided recipe, and create something delicious together.",
    active: true,
    version: 1,
  },
  {
    id: "pkg-create",
    slug: "create",
    name: "CREATE",
    pricePerPersonPaise: 79900,
    durationMinutes: "2–3 hours",
    description: "Choose your ingredients, experiment with flavours, and build a dish that's uniquely yours.",
    active: true,
    version: 1,
  },
  {
    id: "pkg-unleash",
    slug: "unleash",
    name: "UNLEASH",
    pricePerPersonPaise: 109900,
    durationMinutes: "2–3 hours",
    description: "Got your own recipe? Bring your idea to life in a private kitchen with advance ingredient prep.",
    active: true,
    version: 1,
  },
];

function generateSeedSlots(): SlotItem[] {
  const slots: SlotItem[] = [];
  const timeWindows = [
    { start: "11:30", end: "13:30" },
    { start: "14:30", end: "16:30" },
    { start: "17:30", end: "19:30" },
    { start: "20:00", end: "22:00" },
  ];

  const today = new Date();
  for (let d = 1; d <= 14; d++) {
    const slotDate = new Date(today);
    slotDate.setDate(today.getDate() + d);
    const dateStr = slotDate.toISOString().split("T")[0];

    for (const kitchen of ["k-pizzeria", "k-masala"]) {
      timeWindows.forEach((tw, idx) => {
        slots.push({
          id: `slot-${kitchen}-${dateStr}-${idx}`,
          kitchenId: kitchen,
          date: dateStr,
          startTime: tw.start,
          endTime: tw.end,
          status: "AVAILABLE",
          capacity: 4,
        });
      });
    }
  }
  return slots;
}

const STORE_FILE = path.join(process.cwd(), "pilot-data.json");

function readLocalStore(): PilotStoreData {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const data = JSON.parse(fs.readFileSync(STORE_FILE, "utf-8"));
      // Ensure new collections exist for backwards compatibility
      if (!data.users) data.users = [];
      if (!data.savedCreations) data.savedCreations = [];
      if (!data.activityLogs) data.activityLogs = [];
      if (typeof data.paymentsEnabled !== "boolean") data.paymentsEnabled = false;
      return data;
    }
  } catch (e) {
    console.warn("[PilotService] Could not read local store, initializing fresh store.", e);
  }

  const initial: PilotStoreData = {
    operatingMode: (process.env.PLATEPLAY_MODE as "DEMO" | "PILOT" | "LIVE") || "DEMO",
    paymentsEnabled: process.env.PAYMENTS_ENABLED === "true",
    kitchens: DEFAULT_KITCHENS,
    packages: DEFAULT_PACKAGES,
    slots: generateSeedSlots(),
    bookings: [],
    users: [],
    savedCreations: [],
    activityLogs: [],
  };
  writeLocalStore(initial);
  return initial;
}

function writeLocalStore(data: PilotStoreData): void {
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error("[PilotService] Failed to write local store:", e);
  }
}

// ─── USER & AUTH OPERATIONS ──────────────────────────────────────────────────

export async function createUser(params: {
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  role?: "CUSTOMER" | "ADMIN";
}): Promise<UserItem> {
  const store = readLocalStore();
  const existing = store.users.find((u) => u.email.toLowerCase() === params.email.toLowerCase().trim());
  if (existing) {
    throw new Error("An account with this email address already exists.");
  }

  const now = new Date().toISOString();
  const user: UserItem = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: params.name.trim(),
    email: params.email.toLowerCase().trim(),
    passwordHash: params.passwordHash,
    phone: params.phone?.trim(),
    role: params.role || "CUSTOMER",
    emailVerified: false,
    verificationToken: `vtok_${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`,
    createdAt: now,
    updatedAt: now,
  };

  store.users.push(user);
  store.activityLogs.push({
    id: `act_${Date.now()}`,
    actor: user.email,
    action: "USER_REGISTERED",
    entityType: "USER",
    entityId: user.id,
    timestamp: now,
  });

  writeLocalStore(store);
  return user;
}

export async function getUserByEmail(email: string): Promise<UserItem | null> {
  const store = readLocalStore();
  return store.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim()) || null;
}

export async function getUserById(id: string): Promise<UserItem | null> {
  const store = readLocalStore();
  return store.users.find((u) => u.id === id) || null;
}

export async function findOrCreateOAuthUser(params: {
  name: string;
  email: string;
  image?: string;
  provider: string;
}): Promise<UserItem> {
  const store = readLocalStore();
  const emailClean = params.email.toLowerCase().trim();
  const existing = store.users.find((u) => u.email.toLowerCase() === emailClean);

  if (existing) {
    if (!existing.emailVerified) {
      existing.emailVerified = true;
      existing.updatedAt = new Date().toISOString();
      writeLocalStore(store);
    }
    return existing;
  }

  const now = new Date().toISOString();
  const newUser: UserItem = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: params.name || emailClean.split("@")[0],
    email: emailClean,
    passwordHash: "",
    role: "CUSTOMER",
    emailVerified: true,
    createdAt: now,
    updatedAt: now,
  };

  store.users.push(newUser);
  store.activityLogs.push({
    id: `act_${Date.now()}`,
    actor: newUser.email,
    action: `USER_REGISTERED_OAUTH_${params.provider.toUpperCase()}`,
    entityType: "USER",
    entityId: newUser.id,
    timestamp: now,
  });

  writeLocalStore(store);
  return newUser;
}

export async function updateUser(
  id: string,
  updates: Partial<Pick<UserItem, "name" | "phone" | "passwordHash" | "preferences" | "emailVerified">>
): Promise<UserItem | null> {
  const store = readLocalStore();
  const idx = store.users.findIndex((u) => u.id === id);
  if (idx === -1) return null;

  const user = store.users[idx];
  if (updates.name !== undefined) user.name = updates.name.trim();
  if (updates.phone !== undefined) user.phone = updates.phone?.trim();
  if (updates.passwordHash !== undefined) user.passwordHash = updates.passwordHash;
  if (updates.preferences !== undefined) user.preferences = { ...user.preferences, ...updates.preferences };
  if (updates.emailVerified !== undefined) user.emailVerified = updates.emailVerified;
  user.updatedAt = new Date().toISOString();

  store.users[idx] = user;
  writeLocalStore(store);
  return user;
}

export async function deleteUser(id: string): Promise<boolean> {
  const store = readLocalStore();
  const idx = store.users.findIndex((u) => u.id === id);
  if (idx === -1) return false;

  const email = store.users[idx].email;
  store.users.splice(idx, 1);
  // Also clean up user's saved creations
  store.savedCreations = store.savedCreations.filter((c) => c.userId !== id);

  store.activityLogs.push({
    id: `act_${Date.now()}`,
    actor: email,
    action: "USER_DELETED_ACCOUNT",
    entityType: "USER",
    entityId: id,
    timestamp: new Date().toISOString(),
  });

  writeLocalStore(store);
  return true;
}

export async function verifyUserEmail(token: string): Promise<boolean> {
  const store = readLocalStore();
  const user = store.users.find((u) => u.verificationToken === token);
  if (!user) return false;

  user.emailVerified = true;
  user.verificationToken = undefined;
  user.updatedAt = new Date().toISOString();
  writeLocalStore(store);
  return true;
}

export async function createPasswordResetToken(email: string): Promise<string | null> {
  const store = readLocalStore();
  const user = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
  if (!user) return null;

  const token = `rst_${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`;
  const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour
  user.resetPasswordToken = token;
  user.resetPasswordExpires = expires;
  user.updatedAt = new Date().toISOString();

  writeLocalStore(store);
  return token;
}

export async function resetPasswordWithToken(token: string, newPasswordHash: string): Promise<boolean> {
  const store = readLocalStore();
  const now = new Date();
  const user = store.users.find(
    (u) =>
      u.resetPasswordToken === token &&
      u.resetPasswordExpires &&
      new Date(u.resetPasswordExpires) > now
  );
  if (!user) return false;

  user.passwordHash = newPasswordHash;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  user.updatedAt = now.toISOString();

  writeLocalStore(store);
  return true;
}

// ─── SAVED CREATIONS (BUILD YOUR PLATE INTEGRATION) ──────────────────────────

export async function saveCreation(
  creation: Omit<SavedCreationItem, "id" | "createdAt" | "updatedAt">
): Promise<SavedCreationItem> {
  const store = readLocalStore();
  const now = new Date().toISOString();
  const newItem: SavedCreationItem = {
    ...creation,
    id: `cr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    createdAt: now,
    updatedAt: now,
  };

  store.savedCreations.push(newItem);
  writeLocalStore(store);
  return newItem;
}

export async function getSavedCreationsByUserId(userId: string): Promise<SavedCreationItem[]> {
  const store = readLocalStore();
  return store.savedCreations
    .filter((c) => c.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getSavedCreationById(id: string): Promise<SavedCreationItem | null> {
  const store = readLocalStore();
  return store.savedCreations.find((c) => c.id === id) || null;
}

export async function deleteSavedCreation(id: string, userId: string): Promise<boolean> {
  const store = readLocalStore();
  const idx = store.savedCreations.findIndex((c) => c.id === id && c.userId === userId);
  if (idx === -1) return false;

  store.savedCreations.splice(idx, 1);
  writeLocalStore(store);
  return true;
}

// ─── CONFIG & MODES ──────────────────────────────────────────────────────────

export async function getOperatingMode(): Promise<"DEMO" | "PILOT" | "LIVE"> {
  const store = readLocalStore();
  return store.operatingMode;
}

export async function setOperatingMode(mode: "DEMO" | "PILOT" | "LIVE"): Promise<void> {
  const store = readLocalStore();
  store.operatingMode = mode;
  store.activityLogs.push({
    id: `act_${Date.now()}`,
    actor: "admin",
    action: `SET_OPERATING_MODE_${mode}`,
    entityType: "CONFIG",
    timestamp: new Date().toISOString(),
  });
  writeLocalStore(store);
}

export async function isPaymentsEnabled(): Promise<boolean> {
  const store = readLocalStore();
  return store.paymentsEnabled || process.env.PAYMENTS_ENABLED === "true";
}

export async function setPaymentsEnabled(enabled: boolean, actor: string = "admin"): Promise<boolean> {
  const store = readLocalStore();
  store.paymentsEnabled = enabled;
  store.activityLogs.push({
    id: `act_${Date.now()}`,
    actor,
    action: enabled ? "ENABLE_PAYMENTS" : "DISABLE_PAYMENTS",
    entityType: "PAYMENT",
    timestamp: new Date().toISOString(),
  });
  writeLocalStore(store);
  return enabled;
}

// ─── KITCHENS & PACKAGES ─────────────────────────────────────────────────────

export async function getAllKitchens(): Promise<KitchenItem[]> {
  const store = readLocalStore();
  return store.kitchens;
}

export async function getAllPackages(): Promise<PackageItem[]> {
  const store = readLocalStore();
  return store.packages;
}

export async function updatePackage(
  id: string,
  updates: Partial<Pick<PackageItem, "pricePerPersonPaise" | "description" | "durationMinutes" | "active">>,
  actor: string = "admin"
): Promise<PackageItem | null> {
  const store = readLocalStore();
  const idx = store.packages.findIndex((p) => p.id === id);
  if (idx === -1) return null;

  const pkg = store.packages[idx];
  const oldPrice = pkg.pricePerPersonPaise;
  if (updates.pricePerPersonPaise !== undefined) pkg.pricePerPersonPaise = updates.pricePerPersonPaise;
  if (updates.description !== undefined) pkg.description = updates.description;
  if (updates.durationMinutes !== undefined) pkg.durationMinutes = updates.durationMinutes;
  if (updates.active !== undefined) pkg.active = updates.active;
  pkg.version = (pkg.version || 1) + 1;

  store.packages[idx] = pkg;
  store.activityLogs.push({
    id: `act_${Date.now()}`,
    actor,
    action: "UPDATE_PACKAGE",
    entityType: "PACKAGE",
    entityId: id,
    details: updates.pricePerPersonPaise ? `Price changed from ₹${oldPrice / 100} to ₹${updates.pricePerPersonPaise / 100}` : undefined,
    timestamp: new Date().toISOString(),
  });

  writeLocalStore(store);
  return pkg;
}

// ─── SLOTS & AVAILABILITY WITH BUFFER CHECK ──────────────────────────────────

export async function getAvailableSlots(kitchenSlug?: string, date?: string): Promise<SlotItem[]> {
  const store = readLocalStore();
  let filtered = store.slots;

  if (kitchenSlug) {
    const kit = store.kitchens.find((k) => k.slug === kitchenSlug);
    if (kit) {
      filtered = filtered.filter((s) => s.kitchenId === kit.id);
    }
  }

  if (date) {
    filtered = filtered.filter((s) => s.date === date);
  }

  return filtered;
}

export async function createKitchenSlot(slot: Omit<SlotItem, "id">): Promise<SlotItem> {
  const store = readLocalStore();
  const id = `slot-${slot.kitchenId}-${slot.date}-${Date.now()}`;
  const newSlot: SlotItem = { ...slot, id };
  store.slots.push(newSlot);
  writeLocalStore(store);
  return newSlot;
}

export async function updateSlotStatus(
  id: string,
  status: "AVAILABLE" | "BOOKED" | "BLOCKED" | "PAST"
): Promise<SlotItem | null> {
  const store = readLocalStore();
  const idx = store.slots.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  store.slots[idx].status = status;
  writeLocalStore(store);
  return store.slots[idx];
}

export const getKitchens = getAllKitchens;

export async function getAllSlots(): Promise<SlotItem[]> {
  const store = readLocalStore();
  return store.slots;
}

export async function getSlotsForDate(kitchenId: string, date: string): Promise<SlotItem[]> {
  const store = readLocalStore();
  return store.slots.filter(
    (s) => (s.kitchenId === kitchenId || s.kitchenId === `k-${kitchenId}`) && s.date === date
  );
}

export async function addSlot(slot: Omit<SlotItem, "id">): Promise<SlotItem> {
  return createKitchenSlot(slot);
}

export async function updateSlot(
  id: string,
  updates: Partial<Pick<SlotItem, "status" | "capacity" | "notes">>
): Promise<SlotItem | null> {
  const store = readLocalStore();
  const idx = store.slots.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  if (updates.status) store.slots[idx].status = updates.status;
  if (updates.capacity !== undefined) store.slots[idx].capacity = updates.capacity;
  if (updates.notes !== undefined) store.slots[idx].notes = updates.notes;
  writeLocalStore(store);
  return store.slots[idx];
}

// ─── BOOKINGS & ADVANCED ENGINE ──────────────────────────────────────────────

export async function createBookingRequest(params: {
  kitchenId: string; // slug or ID
  packageId: string; // slug or ID
  slotId?: string;
  slotDate?: string;
  slotTime?: string;
  groupSize: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  occasion?: string;
  dietaryRequirements: string[];
  dietaryNotes?: string;
  customDishDetails?: string;
  userId?: string;
}): Promise<BookingRequestItem> {
  const store = readLocalStore();

  const kitchen = store.kitchens.find(
    (k) => k.slug === params.kitchenId || k.id === params.kitchenId
  );
  if (!kitchen) {
    throw new Error(`Kitchen '${params.kitchenId}' not found.`);
  }

  const pkg = store.packages.find(
    (p) => p.slug === params.packageId || p.id === params.packageId
  );
  if (!pkg) {
    throw new Error(`Package '${params.packageId}' not found.`);
  }

  const groupSize = Math.max(2, Math.min(params.groupSize || 4, 6));

  let verifiedSlot: SlotItem | undefined;
  if (params.slotId) {
    verifiedSlot = store.slots.find((s) => s.id === params.slotId);
    if (!verifiedSlot) {
      throw new Error("Specified slot was not found.");
    }
    if (verifiedSlot.status === "BOOKED" || verifiedSlot.status === "BLOCKED") {
      throw new Error("The requested slot is no longer available.");
    }

    // Double check there is no other approved booking occupying this slot
    const existingConflict = store.bookings.find(
      (b) => b.slotId === verifiedSlot!.id && b.status === "APPROVED"
    );
    if (existingConflict) {
      throw new Error("A confirmed session is already reserved for this slot.");
    }
  }

  const estimatedPricePaise = pkg.pricePerPersonPaise * groupSize;
  const now = new Date().toISOString();

  // If this is an UNLEASH package, initialize the feasibility review workflow
  const unleashReview: UnleashReview | undefined =
    pkg.slug === "unleash"
      ? {
          feasibilityStatus: "PENDING",
          ingredientCheck: false,
          equipmentCheck: false,
          safetyCheck: false,
          reviewNotes: "Requires staff feasibility and ingredient sourcing review.",
        }
      : undefined;

  // Operational checklist for kitchen team
  const operationalChecklist: OperationalChecklist = {
    coreIngredientsReady: false,
    specialtyIngredientsReady: false,
    onDemandIngredientsReady: false,
    equipmentSanitized: false,
    workstationSet: false,
    safetyBriefingCompleted: false,
    sessionCompleted: false,
    cleaningResetDone: false,
  };

  const newBooking: BookingRequestItem = {
    id: `req_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    publicReference: generatePublicReference(),
    userId: params.userId,
    kitchenId: kitchen.id,
    kitchenName: kitchen.name,
    packageId: pkg.id,
    packageName: pkg.name,
    slotId: verifiedSlot?.id,
    slotDate: params.slotDate || verifiedSlot?.date,
    slotTime:
      params.slotTime ||
      (verifiedSlot ? `${verifiedSlot.startTime} – ${verifiedSlot.endTime}` : undefined),
    groupSize,
    customerName: params.customerName.trim(),
    customerEmail: params.customerEmail.toLowerCase().trim(),
    customerPhone: params.customerPhone?.trim(),
    occasion: params.occasion,
    dietaryRequirements: params.dietaryRequirements,
    dietaryNotes: params.dietaryNotes,
    customDishDetails: params.customDishDetails,
    estimatedPricePaise,
    status: "PENDING",
    paymentStatus: "UNPAID",
    paymentDetails: {
      enabled: store.paymentsEnabled,
      status: "UNPAID",
      amountPaise: estimatedPricePaise,
      currency: "INR",
      isTestMode: !store.paymentsEnabled,
    },
    unleashReview,
    operationalChecklist,
    createdAt: now,
    updatedAt: now,
    statusHistory: [
      {
        newStatus: "PENDING",
        changedAt: now,
        changedBy: params.userId ? "customer" : "guest",
        notes: "Initial booking request submitted",
      },
    ],
  };

  store.bookings.push(newBooking);
  store.activityLogs.push({
    id: `act_${Date.now()}`,
    actor: newBooking.customerEmail,
    action: "BOOKING_REQUEST_CREATED",
    entityType: "BOOKING",
    entityId: newBooking.id,
    details: `${newBooking.packageName} in ${newBooking.kitchenName} (${newBooking.publicReference})`,
    timestamp: now,
  });

  writeLocalStore(store);

  // Send asynchronous notification
  sendBookingRequestReceived({
    customerName: newBooking.customerName,
    customerEmail: newBooking.customerEmail,
    publicReference: newBooking.publicReference,
    packageName: newBooking.packageName,
    kitchenName: newBooking.kitchenName,
    slotDate: newBooking.slotDate,
    slotTime: newBooking.slotTime,
    groupSize: newBooking.groupSize,
    estimatedTotal: `₹${(newBooking.estimatedPricePaise / 100).toLocaleString("en-IN")}`,
  }).catch((err) => console.error("Email send error:", err));

  return newBooking;
}

export async function getBookingByRefAndEmail(
  publicReference: string,
  customerEmail: string
): Promise<BookingRequestItem | null> {
  const store = readLocalStore();
  const refClean = publicReference.trim().toUpperCase();
  const emailClean = customerEmail.trim().toLowerCase();

  const found = store.bookings.find(
    (b) =>
      b.publicReference.toUpperCase() === refClean &&
      b.customerEmail.toLowerCase() === emailClean
  );
  return found || null;
}

export async function getBookingsByCustomer(
  email: string,
  userId?: string
): Promise<BookingRequestItem[]> {
  const store = readLocalStore();
  const emailClean = email.trim().toLowerCase();

  return store.bookings
    .filter(
      (b) =>
        b.customerEmail.toLowerCase() === emailClean ||
        (userId && b.userId === userId)
    )
    .sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export async function getAllBookings(): Promise<BookingRequestItem[]> {
  const store = readLocalStore();
  return [...store.bookings].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getBookingById(id: string): Promise<BookingRequestItem | null> {
  const store = readLocalStore();
  return store.bookings.find((b) => b.id === id) || null;
}

// ─── STATE MACHINE ENFORCEMENT & OPERATIONAL CHECKS ──────────────────────────

const VALID_TRANSITIONS: Record<BookingStatusType, BookingStatusType[]> = {
  DRAFT: ["PENDING", "CANCELLED"],
  PENDING: ["APPROVED", "DECLINED", "CANCELLED"],
  APPROVED: ["CANCELLED", "COMPLETED"],
  DECLINED: ["PENDING"], // allow admin re-open
  CANCELLED: ["PENDING"], // allow admin manual reinstatement
  COMPLETED: [], // terminal state
};

export async function updateBookingStatus(
  id: string,
  newStatus: BookingStatusType,
  adminNotes?: string,
  changedBy: string = "admin"
): Promise<BookingRequestItem | null> {
  const store = readLocalStore();
  const index = store.bookings.findIndex((b) => b.id === id);
  if (index === -1) return null;

  const current = store.bookings[index];
  const prevStatus = current.status;

  // Validate state machine transition
  const allowed = VALID_TRANSITIONS[prevStatus] || [];
  if (!allowed.includes(newStatus) && prevStatus !== newStatus) {
    throw new Error(
      `Invalid booking state transition from '${prevStatus}' to '${newStatus}'.`
    );
  }

  // If attempting to APPROVE an UNLEASH package, ensure feasibility review is checked
  if (newStatus === "APPROVED" && current.packageName === "UNLEASH") {
    if (current.unleashReview && current.unleashReview.feasibilityStatus !== "FEASIBLE") {
      throw new Error(
        "UNLEASH custom recipe package requires feasibility clearance before approval."
      );
    }
  }

  const now = new Date().toISOString();

  // If approved, mark the slot as BOOKED
  if (newStatus === "APPROVED" && current.slotId) {
    const slotIdx = store.slots.findIndex((s) => s.id === current.slotId);
    if (slotIdx !== -1) {
      store.slots[slotIdx].status = "BOOKED";
    }
  }

  // If was previously approved and now cancelled or declined, free up the slot
  if (
    prevStatus === "APPROVED" &&
    (newStatus === "DECLINED" || newStatus === "CANCELLED") &&
    current.slotId
  ) {
    const slotIdx = store.slots.findIndex((s) => s.id === current.slotId);
    if (slotIdx !== -1) {
      store.slots[slotIdx].status = "AVAILABLE";
    }
  }

  current.status = newStatus;
  current.updatedAt = now;
  if (adminNotes !== undefined) current.adminNotes = adminNotes;
  current.statusHistory.push({
    previousStatus: prevStatus,
    newStatus,
    changedAt: now,
    changedBy,
    notes: adminNotes,
  });

  store.bookings[index] = current;
  store.activityLogs.push({
    id: `act_${Date.now()}`,
    actor: changedBy,
    action: `BOOKING_STATUS_${newStatus}`,
    entityType: "BOOKING",
    entityId: current.id,
    details: `Transitioned from ${prevStatus} to ${newStatus}. Notes: ${adminNotes || "None"}`,
    timestamp: now,
  });

  writeLocalStore(store);

  // Email notifications
  const emailData = {
    customerName: current.customerName,
    customerEmail: current.customerEmail,
    publicReference: current.publicReference,
    packageName: current.packageName,
    kitchenName: current.kitchenName,
    slotDate: current.slotDate,
    slotTime: current.slotTime,
    groupSize: current.groupSize,
    estimatedTotal: `₹${(current.estimatedPricePaise / 100).toLocaleString("en-IN")}`,
  };

  if (newStatus === "APPROVED") {
    sendBookingApproved(emailData).catch(console.error);
  } else if (newStatus === "DECLINED") {
    sendBookingDeclined(emailData).catch(console.error);
  } else if (newStatus === "CANCELLED") {
    sendBookingCancelled(emailData).catch(console.error);
  }

  return current;
}

// ─── UNLEASH FEASIBILITY REVIEW WORKFLOW ─────────────────────────────────────

export async function updateUnleashReview(
  bookingId: string,
  reviewData: Partial<UnleashReview>,
  reviewer: string = "admin"
): Promise<BookingRequestItem | null> {
  const store = readLocalStore();
  const idx = store.bookings.findIndex((b) => b.id === bookingId);
  if (idx === -1) return null;

  const current = store.bookings[idx];
  current.unleashReview = {
    feasibilityStatus: reviewData.feasibilityStatus || current.unleashReview?.feasibilityStatus || "PENDING",
    ingredientCheck: reviewData.ingredientCheck ?? current.unleashReview?.ingredientCheck ?? false,
    equipmentCheck: reviewData.equipmentCheck ?? current.unleashReview?.equipmentCheck ?? false,
    safetyCheck: reviewData.safetyCheck ?? current.unleashReview?.safetyCheck ?? false,
    costReviewPaise: reviewData.costReviewPaise ?? current.unleashReview?.costReviewPaise,
    reviewedBy: reviewer,
    reviewedAt: new Date().toISOString(),
    reviewNotes: reviewData.reviewNotes ?? current.unleashReview?.reviewNotes,
  };

  current.updatedAt = new Date().toISOString();
  store.bookings[idx] = current;
  writeLocalStore(store);
  return current;
}

// ─── KITCHEN OPERATIONS CHECKLIST WORKFLOW ───────────────────────────────────

export async function updateOperationalChecklist(
  bookingId: string,
  checklist: Partial<OperationalChecklist>
): Promise<BookingRequestItem | null> {
  const store = readLocalStore();
  const idx = store.bookings.findIndex((b) => b.id === bookingId);
  if (idx === -1) return null;

  const current = store.bookings[idx];
  current.operationalChecklist = {
    ...current.operationalChecklist,
    ...checklist,
    updatedAt: new Date().toISOString(),
  } as OperationalChecklist;

  current.updatedAt = new Date().toISOString();
  store.bookings[idx] = current;
  writeLocalStore(store);
  return current;
}

// ─── ACTIVITY LOGS ───────────────────────────────────────────────────────────

export async function getActivityLogs(): Promise<ActivityLogItem[]> {
  const store = readLocalStore();
  return [...store.activityLogs].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

// ─── DASHBOARD STATS ─────────────────────────────────────────────────────────

export async function getDashboardStats(): Promise<{
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  declinedRequests: number;
  availableSlotsCount: number;
  operatingMode: "DEMO" | "PILOT" | "LIVE";
  paymentsEnabled: boolean;
}> {
  const store = readLocalStore();
  const totalRequests = store.bookings.length;
  const pendingRequests = store.bookings.filter((b) => b.status === "PENDING").length;
  const approvedRequests = store.bookings.filter((b) => b.status === "APPROVED").length;
  const declinedRequests = store.bookings.filter((b) => b.status === "DECLINED").length;
  const availableSlotsCount = store.slots.filter((s) => s.status === "AVAILABLE").length;

  return {
    totalRequests,
    pendingRequests,
    approvedRequests,
    declinedRequests,
    availableSlotsCount,
    operatingMode: store.operatingMode,
    paymentsEnabled: store.paymentsEnabled || process.env.PAYMENTS_ENABLED === "true",
  };
}
