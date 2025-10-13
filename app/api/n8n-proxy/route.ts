import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    
    const response = await fetch('https://hr-automation.duckdns.org/webhook/a7fd14ea-2802-42e7-9115-53e211b7263e/chat', {
      method: 'POST',             
      headers: {
        'Content-Type': 'application/json',
      },
      body: body
    })
    
    const data = await response.text()
    
    return new NextResponse(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Proxy failed' }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  })
}