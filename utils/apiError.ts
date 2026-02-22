import { NextResponse } from "next/server";

export function apiError(
  message: string,
  status: number = 500,
  errors: string[] = [],
) {
  const response = {
    success: false,
    message,
    ...(errors.length && { errors }),
  };

  return NextResponse.json(response, { status });
}
