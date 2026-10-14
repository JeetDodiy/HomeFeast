import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, email, password, role } = body;

    if (action === "register") {
      return NextResponse.json({
        success: true,
        message: "Registration successful. Please verify your email.",
        data: {
          id: `usr_${Date.now()}`,
          email,
          role: role || "CUSTOMER",
          isVerified: false,
        },
      });
    }

    if (action === "forgot-password") {
      return NextResponse.json({
        success: true,
        message: "Password reset link has been dispatched to your email address.",
      });
    }

    // Default: login
    const userName =
      role === "COOK"
        ? "Meenaben Patel"
        : role === "ADMIN"
        ? "System Administrator"
        : "Priya Sharma";

    return NextResponse.json({
      success: true,
      message: "Login successful",
      token: `hf_jwt_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      user: {
        id: `usr_${(role || "customer").toLowerCase()}_1`,
        email: email || "demo@homefeast.in",
        name: userName,
        role: role || "CUSTOMER",
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Authentication failed" }, { status: 400 });
  }
}
