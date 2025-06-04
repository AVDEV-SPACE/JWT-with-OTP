// app/api/admin/route.ts
import { NextResponse } from "next/server";
import { loginAdmin, setOTP, verifyOTP } from "@/lib/actions/admin.actions";

export async function POST(request: Request) {
  const { action, email, password, userId, otp } = await request.json();

  try {
    switch (action) {
      // case "login":
      //   const session = await loginAdmin(email, password);
      //   return NextResponse.json(session);
      case "set-otp":
        const setOtpResult = await setOTP(userId, otp);
        return NextResponse.json(setOtpResult);
      case "verify-otp":
        const verifyOtpResult = await verifyOTP(userId, otp);
        return NextResponse.json(verifyOtpResult);
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}