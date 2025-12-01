import { NextRequest, NextResponse } from "next/server"
import { db } from "@/src/DB/db"
import { user } from "@/src/DB/schema"
import { eq } from "drizzle-orm"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const [userData] = await db
      .select()
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1)

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      image: userData.image,
      location: userData.location,
      pastIllness: userData.pastIllness,
      habits: userData.habits,
      alertsEnabled: userData.alertsEnabled,
      age: userData.age,
    })
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, location, pastIllness, habits, alertsEnabled, age } = body

    const [updatedUser] = await db
      .update(user)
      .set({
        name: name || undefined,
        location: location || undefined,
        pastIllness: pastIllness || undefined,
        habits: habits || undefined,
        alertsEnabled: alertsEnabled !== undefined ? alertsEnabled : undefined,
        age: age || undefined,
        updatedAt: new Date(),
      })
      .where(eq(user.id, session.user.id))
      .returning()

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      image: updatedUser.image,
      location: updatedUser.location,
      pastIllness: updatedUser.pastIllness,
      habits: updatedUser.habits,
      alertsEnabled: updatedUser.alertsEnabled,
      age: updatedUser.age,
    })
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
