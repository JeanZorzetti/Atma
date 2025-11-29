import { NextResponse } from 'next/server'

export async function GET() {
  const envVars = {
    DB_HOST: process.env.DB_HOST || 'NOT SET',
    DB_USER: process.env.DB_USER || 'NOT SET',
    DB_NAME: process.env.DB_NAME || 'NOT SET',
    DB_PASSWORD: process.env.DB_PASSWORD ? '***CONFIGURED***' : 'NOT SET',
    MERCADOPAGO_ACCESS_TOKEN: process.env.MERCADOPAGO_ACCESS_TOKEN ? '***CONFIGURED***' : 'NOT SET',
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL || 'NOT SET',
    NODE_ENV: process.env.NODE_ENV || 'NOT SET'
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    environment: envVars,
    warning: 'DELETE THIS ENDPOINT AFTER DEBUGGING'
  })
}
