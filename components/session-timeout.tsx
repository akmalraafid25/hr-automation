"use client"

import { useEffect } from "react"

export function SessionTimeout() {
  useEffect(() => {
    let timeout: NodeJS.Timeout

    const resetTimeout = () => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        fetch("/api/logout", { method: "POST" })
        window.location.href = "/login"
      }, 60 * 60 * 1000) // 1 hour
    }

    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"]
    
    events.forEach(event => {
      document.addEventListener(event, resetTimeout, true)
    })

    resetTimeout()

    return () => {
      clearTimeout(timeout)
      events.forEach(event => {
        document.removeEventListener(event, resetTimeout, true)
      })
    }
  }, [])

  return null
}