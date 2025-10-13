import { NextResponse } from "next/server";

export async function GET() {
  const requiredEnvVars = [
    'SNOWFLAKE_ACCOUNT',
    'SNOWFLAKE_USER', 
    'SNOWFLAKE_PRIVATE_KEY',
    'SNOWFLAKE_DATABASE',
    'SNOWFLAKE_SCHEMA',
    'SNOWFLAKE_WAREHOUSE'
  ];

  const missing = requiredEnvVars.filter(env => !process.env[env]);
  
  if (missing.length > 0) {
    return NextResponse.json({ 
      error: "Missing environment variables", 
      missing 
    }, { status: 500 });
  }

  return NextResponse.json({ 
    message: "Environment variables configured",
    account: process.env.SNOWFLAKE_ACCOUNT?.substring(0, 5) + "..."
  });
}