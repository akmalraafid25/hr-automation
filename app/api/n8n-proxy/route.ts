import { NextRequest, NextResponse } from "next/server"

// Disable SSL verification globally for development
if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
}

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
    
    if (!response.ok) {
      console.error(`Webhook responded with status: ${response.status}`)
      const errorText = await response.text()
      console.error('Webhook error response:', errorText)
      return NextResponse.json({ error: `Webhook error: ${response.status}` }, { status: response.status })
    }
    
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
    console.error('Proxy error:', error)
    return NextResponse.json({ error: `Proxy failed: ${error instanceof Error ? error.message : 'Unknown error'}` }, { status: 500 })
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