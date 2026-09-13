// @ts-nocheck
import { NextResponse } from "next/server";
import { connectDB, objectId } from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, serviceId, dateTime, notes, stylistId } = body;

    if (!email || !serviceId || !dateTime) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = await connectDB();
    let user = await db.collection("User").findOne({ email });

    if (!user) {
      const now = new Date();
      const created = await db.collection("User").insertOne({
        email,
        name: name || "Walk-in Customer",
        phone: phone || "",
        password: "",
        role: "CUSTOMER",
        createdAt: now,
        updatedAt: now,
      });
      user = await db.collection("User").findOne({ _id: created.insertedId });
    }

    const created = await db.collection("Appointment").insertOne({
      customerId: user!._id,
      serviceId: objectId(serviceId),
      dateTime: new Date(dateTime),
      notes: notes || "",
      stylistId: stylistId ? objectId(stylistId) : null,
      status: "PENDING",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const appointment = {
      id: created.insertedId.toString(),
      dateTime: new Date(dateTime),
      notes: notes || "",
      status: "PENDING",
    };

    return NextResponse.json({
      success: true,
      message: "Your appointment has been booked successfully.",
      appointment,
    });
  } catch (error) {
    console.error("Error processing booking request:", error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unable to create appointment right now.",
    }, { status: 500 });
  }
}
