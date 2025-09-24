"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"

interface JobSearchProps {
  onSearch: (query: string, location: string, type: string) => void
}

export function JobSearch({ onSearch }: JobSearchProps) {
  const [query, setQuery] = useState("")
  const [location, setLocation] = useState("")
  const [type, setType] = useState("")

  const handleSearch = () => {
    onSearch(query, location, type)
  }

  // Real-time search effect
  useEffect(() => {
    onSearch(query, location, type)
  }, [query, location, type, onSearch])

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Job title or keywords"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        
        <Select value={type} onValueChange={setType}>
          <SelectTrigger>
            <SelectValue placeholder="Job Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="full-time">Full Time</SelectItem>
            <SelectItem value="part-time">Part Time</SelectItem>
            <SelectItem value="contract">Contract</SelectItem>
            <SelectItem value="remote">Remote</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleSearch} className="w-full">
          Search
        </Button>
      </div>
    </div>
  )
}