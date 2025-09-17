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

interface ApiResponse {
  ok: boolean;
  data: Account;
}

export default function SnowflakeAccount() {
  const [account, setAccount] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const res = await fetch("/api/Account/me");
        console.log("Response status:", res.status);

        const json: ApiResponse = await res.json();
        console.log("Parsed data:", json);

        setAccount(json.data); // ✅ <-- FIX: use json.data
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccount();
  }, []);

  useEffect(() => {
    console.log("Account state updated:", account);
  }, [account]);

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
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={account?.NAME ?? ""}
                readOnly
                className="bg-gray-100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={account?.USERNAME ?? ""}
                readOnly
                className="bg-gray-100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={account?.EMAIL ?? ""}
                readOnly
                className="bg-gray-100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={account?.PHONE?.toString() ?? ""}
                readOnly
                className="bg-gray-100"
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>Edit Profile</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
