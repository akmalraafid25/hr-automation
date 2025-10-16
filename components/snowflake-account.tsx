"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Account {
  ID: number;
  NAME: string;
  USERNAME: string;
  EMAIL: string;
  PHONE: string | number;
}

export default function SnowflakeAccount() {
  const [account, setAccount] = useState<Account | null>(null);
  const [editedAccount, setEditedAccount] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const res = await fetch("/api/Account");
        const data = await res.json();
        setAccount(data);
        setEditedAccount(data);
      } catch {
        setError("Failed to fetch account");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAccount();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedAccount({ ...account! });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedAccount({ ...account! });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/Account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editedAccount?.NAME,
          phone: editedAccount?.PHONE
        })
      });
      if (res.ok) {
        setAccount(editedAccount);
        setIsEditing(false);
      } else {
        setError("Failed to update account");
      }
    } catch {
      setError("Error updating account");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div>Loading account information...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="mt-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
          <CardDescription>
            View and manage your account details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={isEditing ? editedAccount?.NAME ?? "" : account?.NAME ?? ""}
                onChange={(e) => setEditedAccount(prev => prev ? {...prev, NAME: e.target.value} : null)}
                disabled={!isEditing}
                className={!isEditing ? "bg-gray-100" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={account?.USERNAME ?? ""}
                disabled
                className="bg-gray-100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={account?.EMAIL ?? ""}
                disabled
                className="bg-gray-100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={isEditing ? editedAccount?.PHONE?.toString() ?? "" : account?.PHONE?.toString() ?? ""}
                onChange={(e) => setEditedAccount(prev => prev ? {...prev, PHONE: e.target.value} : null)}
                disabled={!isEditing}
                className={!isEditing ? "bg-gray-100" : ""}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4 flex gap-2">
          {!isEditing ? (
            <Button onClick={handleEdit}>Edit Profile</Button>
          ) : (
            <>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
