import { NextResponse } from "next/server"

export async function GET() {
  try {
    const CALENDLY_TOKEN = process.env.CALENDLY_ACCESS_TOKEN
    const CALENDLY_USER_URI = process.env.CALENDLY_USER_URI
    
    if (!CALENDLY_TOKEN || !CALENDLY_USER_URI) {
      return NextResponse.json({ 
        error: "Missing Calendly credentials. Add CALENDLY_ACCESS_TOKEN and CALENDLY_USER_URI to .env" 
      }, { status: 500 })
    }

    // First get user info to verify URI
    const userResponse = await fetch('https://api.calendly.com/users/me', {
      headers: {
        'Authorization': `Bearer ${CALENDLY_TOKEN}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!userResponse.ok) {
      const errorText = await userResponse.text()
      console.error('User API error:', userResponse.status, errorText)
      return NextResponse.json({ 
        error: `User API error: ${userResponse.status} - ${errorText}` 
      }, { status: 500 })
    }
    
    const userData = await userResponse.json()
    const actualUserUri = userData.resource.uri
    console.log('Actual user URI:', actualUserUri)
    
    const response = await fetch(`https://api.calendly.com/scheduled_events?user=${actualUserUri}`, {
      headers: {
        'Authorization': `Bearer ${CALENDLY_TOKEN}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Calendly API error:', response.status, errorText)
      return NextResponse.json({ 
        error: `Calendly API error: ${response.status} - ${errorText}` 
      }, { status: 500 })
    }

    const data = await response.json()
    
    // Fetch invitee details for each event
    const eventsWithInvitees = await Promise.all(
      data.collection.map(async (event: any) => {
        try {
          const inviteesResponse = await fetch(`https://api.calendly.com/scheduled_events/${event.uri.split('/').pop()}/invitees`, {
            headers: {
              'Authorization': `Bearer ${CALENDLY_TOKEN}`,
              'Content-Type': 'application/json'
            }
          })
          
          if (inviteesResponse.ok) {
            const inviteesData = await inviteesResponse.json()
            event.invitees = inviteesData.collection
          }
        } catch (error) {
          console.error('Error fetching invitees:', error)
          event.invitees = []
        }
        return event
      })
    )

    return NextResponse.json({ events: eventsWithInvitees })
  } catch (error) {
    console.error("Error fetching Calendly events:", error)
    return NextResponse.json({ 
      error: `Failed to fetch events: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }, { status: 500 })
  }
}