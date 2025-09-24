import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Debounce function for search optimization
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Memoize API responses
const cache = new Map()
export function memoize<T>(fn: (...args: any[]) => Promise<T>, ttl = 300000) {
  return async (...args: any[]): Promise<T> => {
    const key = JSON.stringify(args)
    const cached = cache.get(key)
    
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data
    }
    
    const result = await fn(...args)
    cache.set(key, { data: result, timestamp: Date.now() })
    return result
  }
}