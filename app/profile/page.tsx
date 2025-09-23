"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ApplicantNavbar } from "@/components/applicant-navbar"
import { User, Mail, Phone, Briefcase } from "lucide-react"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    skills: "",
    experience: "",
    education: ""
  })
  const [editedProfile, setEditedProfile] = useState({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    skills: "",
    experience: "",
    education: ""
  })

  useEffect(() => {
    fetch("/api/Account")
      .then(res => res.json())
      .then(data => {
        if (data.NAME) {
          const profileData = {
            name: data.NAME || "",
            email: data.EMAIL || "",
            phone: data.PHONE || "",
            linkedin: "",
            skills: "",
            experience: "",
            education: ""
          }
          setProfile(profileData)
          setEditedProfile(profileData)
        }
      })
      .catch(err => console.error("Error fetching profile:", err))
      .finally(() => setLoading(false))
  }, [])

  const handleEdit = () => {
    setIsEditing(true)
    setEditedProfile({ ...profile })
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedProfile({ ...profile })
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch("/api/Account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editedProfile.name,
          phone: editedProfile.phone
        })
      })
      if (res.ok) {
        setProfile(editedProfile)
        setIsEditing(false)
      } else {
        alert("Failed to update profile")
      }
    } catch (err) {
      alert("Error updating profile")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <ApplicantNavbar />
      
      <div className="max-w-4xl mx-auto p-8 pt-24">
        {loading ? (
          <div className="text-center py-8">Loading profile...</div>
        ) : (
          <>
            <div className="bg-cover bg-[url(/bubbles-getty-1367572322-teaser.webp)] p-16 mb-8 relative">
              <div className="absolute inset-0"></div>
              <div className="relative z-10">
                <h1 className="text-4xl font-bold text-primary">My Profile</h1>
                <p className="text-gray-600 mt-2">Manage your personal information and preferences</p>
              </div>
            </div>
            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="flex items-center p-4">
                    <User className="h-8 w-8 text-blue-500 mr-3" />
                    <div>
                      <p className="text-sm text-muted-foreground">Profile</p>
                      <p className="text-lg font-semibold">Complete</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex items-center p-4">
                    <Mail className="h-8 w-8 text-green-500 mr-3" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="text-lg font-semibold">Verified</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex items-center p-4">
                    <Phone className="h-8 w-8 text-orange-500 mr-3" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="text-lg font-semibold">{profile.phone ? 'Added' : 'Missing'}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex items-center p-4">
                    <Briefcase className="h-8 w-8 text-purple-500 mr-3" />
                    <div>
                      <p className="text-sm text-muted-foreground">Experience</p>
                      <p className="text-lg font-semibold">{profile.experience ? 'Added' : 'Missing'}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
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
                {!isEditing ? (
                  <Button onClick={handleEdit} variant="outline">
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={handleSave} disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </div>
                )}
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
                    value={isEditing ? editedProfile.name : profile.name}
                    onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-100" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    disabled
                    className="bg-gray-100"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={isEditing ? editedProfile.phone : profile.phone}
                    onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-100" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={isEditing ? editedProfile.linkedin : profile.linkedin}
                    onChange={(e) => setEditedProfile({...editedProfile, linkedin: e.target.value})}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-100" : ""}
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
                  value={isEditing ? editedProfile.skills : profile.skills}
                  onChange={(e) => setEditedProfile({...editedProfile, skills: e.target.value})}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-gray-100" : ""}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="experience">Work Experience</Label>
                <Textarea
                  id="experience"
                  value={isEditing ? editedProfile.experience : profile.experience}
                  onChange={(e) => setEditedProfile({...editedProfile, experience: e.target.value})}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-gray-100" : ""}
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="education">Education</Label>
                <Textarea
                  id="education"
                  value={isEditing ? editedProfile.education : profile.education}
                  onChange={(e) => setEditedProfile({...editedProfile, education: e.target.value})}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-gray-100" : ""}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
            </div>
          </>
        )}
      </div>
    </div>
  )
}