"use client"

import { useEffect, useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, ExternalLink } from "lucide-react"

export function JobRecommendations() {
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [userProfile, setUserProfile] = useState<any>(null)
  
  // Synonym mapping for better matching
  const synonymMap: { [key: string]: string[] } = {
    'javascript': ['js', 'node', 'nodejs', 'react', 'vue', 'angular'],
    'python': ['django', 'flask', 'fastapi', 'pandas', 'numpy'],
    'java': ['spring', 'hibernate', 'maven', 'gradle'],
    'database': ['sql', 'mysql', 'postgresql', 'mongodb', 'nosql'],
    'frontend': ['ui', 'ux', 'html', 'css', 'responsive'],
    'backend': ['api', 'server', 'microservices', 'rest'],
    'cloud': ['aws', 'azure', 'gcp', 'docker', 'kubernetes'],
    'mobile': ['android', 'ios', 'react native', 'flutter'],
    'management': ['lead', 'manager', 'supervisor', 'director'],
    'development': ['coding', 'programming', 'software', 'engineer']
  }

  // Function to find synonyms and related terms
  const findMatches = (userText: string, jobText: string) => {
    const userWords = userText.toLowerCase().split(/[,\s]+/).filter(Boolean)
    let matches = 0
    
    userWords.forEach(word => {
      // Direct match
      if (jobText.includes(word)) {
        matches++
        return
      }
      
      // Synonym match
      for (const [key, synonyms] of Object.entries(synonymMap)) {
        if (word === key || synonyms.includes(word)) {
          const relatedTerms = [key, ...synonyms]
          if (relatedTerms.some(term => jobText.includes(term))) {
            matches += 0.8 // Slightly lower weight for synonym matches
            break
          }
        }
      }
    })
    
    return matches
  }

  // Calculate match percentage based on user profile
  const calculateMatchPercentage = (job: any, profile: any) => {
    if (!profile || (!profile.skills && !profile.experience && !profile.education)) {
      return null // Return null if no profile data
    }
    
    let matchScore = 0
    const jobDescription = job.PROMPT?.toLowerCase() || ""
    const jobName = job.JOB_NAME?.toLowerCase() || ""
    const combinedJobText = `${jobDescription} ${jobName}`
    
    // Skills matching with synonyms (40% weight)
    if (profile.skills) {
      const userSkills = profile.skills.toLowerCase().split(/[,\s]+/).filter(Boolean)
      const skillMatches = findMatches(profile.skills, combinedJobText)
      matchScore += (skillMatches / Math.max(userSkills.length, 1)) * 40
    }
    
    // Experience matching with synonyms (30% weight)
    if (profile.experience) {
      const experienceMatches = findMatches(profile.experience, combinedJobText)
      const experienceKeywords = ['experience', 'work', 'project', 'develop', 'manage', 'lead']
      const hasExperience = experienceKeywords.some(keyword => 
        profile.experience.toLowerCase().includes(keyword)
      )
      if (hasExperience || experienceMatches > 0) {
        matchScore += Math.min(30, (experienceMatches * 5) + 15)
      }
    }
    
    // Education matching with synonyms (20% weight)
    if (profile.education) {
      const educationMatches = findMatches(profile.education, combinedJobText)
      const educationKeywords = ['degree', 'university', 'college', 'bachelor', 'master', 'phd']
      const hasEducation = educationKeywords.some(keyword => 
        profile.education.toLowerCase().includes(keyword)
      )
      if (hasEducation || educationMatches > 0) {
        matchScore += Math.min(20, (educationMatches * 3) + 10)
      }
    }
    
    // Base score (10% weight)
    matchScore += 10
    
    return Math.min(Math.max(Math.floor(matchScore), 50), 99)
  }
  
  // Generate match percentages based on user profile
  const recommendationsWithMatch = useMemo(() => {
    return recommendations.map((job) => ({
      ...job,
      matchPercentage: calculateMatchPercentage(job, userProfile)
    }))
  }, [recommendations, userProfile])

  useEffect(() => {
    // Fetch user profile
    fetch("/api/Account")
      .then(res => res.json())
      .then(data => {
        setUserProfile({
          skills: data.SKILLS || "",
          experience: data.WORK_EXPERIENCE || "",
          education: data.EDUCATION || ""
        })
      })
      .catch(err => console.error("Error fetching profile:", err))
    
    // Fetch job recommendations
    fetch("/api/query/posts")
      .then(res => res.json())
      .then(data => {
        const jobs = data?.rows || []
        // Get random 3 jobs as recommendations
        const shuffled = jobs.sort(() => 0.5 - Math.random())
        setRecommendations(shuffled.slice(0, 3))
      })
      .catch(err => console.error("Error fetching recommendations:", err))
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Recommended for You
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendationsWithMatch.map((job, index) => (
            <div key={index} className="p-3 border rounded-lg flex flex-col justify-between h-20">
              <h4 className={`font-semibold truncate ${job.JOB_NAME.length > 30 ? 'text-xs' : job.JOB_NAME.length > 20 ? 'text-sm' : 'text-base'}`}>{job.JOB_NAME}</h4>
              <div className="flex items-center justify-between">
                {job.matchPercentage ? (
                  <Badge variant="outline" className="text-xs">
                    {job.matchPercentage}% Match
                  </Badge>
                ) : (
                  <span className="text-xs text-muted-foreground">Complete profile for match</span>
                )}
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        {recommendationsWithMatch.length === 0 && (
          <p className="text-muted-foreground text-sm">Loading recommendations...</p>
        )}
      </CardContent>
    </Card>
  )
}