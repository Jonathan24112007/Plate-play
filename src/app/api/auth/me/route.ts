import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getAuthenticatedSession } from "@/lib/auth";
import { getUserById, updateUser, deleteUser } from "@/lib/pilotService";

export async function GET() {
  try {
    const session = await getAuthenticatedSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserById(session.id);
    if (!user) {
      return NextResponse.json({
        user: {
          id: session.id,
          name: session.name,
          email: session.email,
          role: session.role,
        },
      });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        emailVerified: user.emailVerified,
        preferences: user.preferences,
        createdAt: user.createdAt,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch profile." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getAuthenticatedSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, phone, currentPassword, newPassword, preferences } = body;

    const user = await getUserById(session.id);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const updates: any = {};
    if (name) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (preferences) updates.preferences = preferences;

    // Handle password change if requested
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Current password is required to set a new password." },
          { status: 400 }
        );
      }
      const match = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!match) {
        return NextResponse.json(
          { error: "Incorrect current password." },
          { status: 400 }
        );
      }
      if (newPassword.length < 8) {
        return NextResponse.json(
          { error: "New password must be at least 8 characters long." },
          { status: 400 }
        );
      }
      updates.passwordHash = await bcrypt.hash(newPassword, 12);
    }

    const updated = await updateUser(session.id, updates);
    return NextResponse.json({
      success: true,
      user: {
        id: updated?.id,
        name: updated?.name,
        email: updated?.email,
        phone: updated?.phone,
        preferences: updated?.preferences,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to update profile." }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await getAuthenticatedSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ok = await deleteUser(session.id);
    return NextResponse.json({ success: ok });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to delete account." }, { status: 500 });
  }
}

