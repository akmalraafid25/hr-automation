"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ApplicantNavbar } from "@/components/applicant-navbar"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    linkedin: "linkedin.com/in/johndoe",
    skills: "JavaScript, React, Node.js, Python",
    experience: "5 years of software development experience",
    education: "Bachelor's in Computer Science"
  })

  const handleSave = () => {
    setIsEditing(false)
    // Add API call to save profile
  }

  return (
    <div className="min-h-screen bg-background">
      <ApplicantNavbar />
      
      <div className="max-w-4xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">My Profile</h1>
          <p className="text-muted-foreground mt-2">Manage your personal information and preferences</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="Profile" />
                    <AvatarFallback className="text-lg">JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl">{profile.name}</CardTitle>
                    <CardDescription>{profile.email}</CardDescription>
                  </div>
                </div>
                <Button 
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  variant={isEditing ? "default" : "outline"}
                >
                  {isEditing ? "Save Changes" : "Edit Profile"}
                </Button>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={profile.linkedin}
                    onChange={(e) => setProfile({...profile, linkedin: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="skills">Skills</Label>
                <Textarea
                  id="skills"
                  value={profile.skills}
                  onChange={(e) => setProfile({...profile, skills: e.target.value})}
                  disabled={!isEditing}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="experience">Work Experience</Label>
                <Textarea
                  id="experience"
                  value={profile.experience}
                  onChange={(e) => setProfile({...profile, experience: e.target.value})}
                  disabled={!isEditing}
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="education">Education</Label>
                <Textarea
                  id="education"
                  value={profile.education}
                  onChange={(e) => setProfile({...profile, education: e.target.value})}
                  disabled={!isEditing}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}