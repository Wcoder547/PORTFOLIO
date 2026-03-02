import { NextResponse } from "next/server";

export function apiResponse(
  data: unknown,
  status: number = 200,
  message: string = "Success",
) {
  const success = status < 400;

  return NextResponse.json(
    {
      success,
      message,
      ...(success ? { data } : { errors: data }),
    },
    { status },
  );
}
