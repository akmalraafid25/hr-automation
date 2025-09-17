"use client";

import { useEffect, useState, FormEvent } from "react";
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
  USERNAME: string;
  EMAIL: string;
  NAME: string;
  PHONE: string;
  CREATED_AT: string;
  UPDATED_AT: string;
}

export default function SnowflakeAccount() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccount = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/Account");
        if (!response.ok) {
          throw new Error("Failed to fetch account data. Please re-login.");
        }
        const data: Account = await response.json();
        
        setUsername(data.USERNAME || "");
        setEmail(data.EMAIL || "");
        setName(data.NAME || "");
        setPhone(data.PHONE || "");

      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccount();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    const updateData: { name: string; phone: string } = {
      name,
      phone,
    };

    try {
      const response = await fetch("/api/Account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update account.");
      }

      setMessage("Profile updated successfully!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !username) {
    return <div>Loading account information...</div>;
  }

  return (
    <div className="mt-6">
      <Card className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
            <CardDescription>
              View and manage your personal account details.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  readOnly
                  className="bg-gray-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  readOnly
                  className="bg-gray-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+123456789"
                />
              </div>
            </div>
            
            {error && <p className="text-sm font-medium text-red-600">{error}</p>}
            {message && <p className="text-sm font-medium text-green-600">{message}</p>}

          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}