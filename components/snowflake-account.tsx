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

// This interface defines the structure of the account data
interface Account {
  ID: number;
  USERNAME: string;
  EMAIL: string;
  ROLE: string;
  CREATED_AT: string;
  UPDATED_AT: string;
}

export default function SnowflakeAccount() {
  // State to hold the account data and loading status
  const [account, setAccount] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // --- DUMMY DATA FOR TESTING ---
    const dummyAccount: Account = {
      ID: 1,
      USERNAME: "testuser",
      EMAIL: "test@example.com",
      ROLE: "admin",
      CREATED_AT: new Date().toISOString(),
      UPDATED_AT: new Date().toISOString(),
    };

    setAccount(dummyAccount);
    setIsLoading(false);
    // --- END OF DUMMY DATA ---

    /* // --- REAL API FETCHING LOGIC (Commented out) ---
    const fetchAccount = async () => {
      try {
        const response = await fetch("/api/query/account");
        if (!response.ok) {
          throw new Error("Failed to fetch account data");
        }
        const data = await response.json();
        if (data && data.length > 0) {
          setAccount(data[0]);
        } else {
          throw new Error("No account data found");
        }
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching account data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccount();
    */
  }, []);

  // Display a loading message while fetching data
  if (isLoading) {
    return <div>Loading account information...</div>;
  }

  // Display an error message if fetching fails
  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  // Display the profile card once data is loaded
  return (
    <div className="mt-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
          <CardDescription>
            View and manage your personal account details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={account?.USERNAME || ""}
                  readOnly
                  className="bg-gray-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={account?.EMAIL || ""}
                  readOnly
                  className="bg-gray-100"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={account?.ROLE || ""}
                readOnly
                className="bg-gray-100"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                <Label htmlFor="createdAt">Member Since</Label>
                <Input
                    id="createdAt"
                    value={account ? new Date(account.CREATED_AT).toLocaleDateString() : ""}
                    readOnly
                    className="bg-gray-100"
                />
                </div>
                <div className="space-y-2">
                <Label htmlFor="updatedAt">Last Updated</Label>
                <Input
                    id="updatedAt"
                    value={account ? new Date(account.UPDATED_AT).toLocaleString() : ""}
                    readOnly
                    className="bg-gray-100"
                />
                </div>
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