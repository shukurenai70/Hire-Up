
"use client";

import Link from "next/link"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore"; 
import { auth, db } from "@/lib/firebase";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast";

const ADMIN_CODE = "ADMIN123x";

export default function AdminSignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (adminCode !== ADMIN_CODE) {
      toast({
        title: "Invalid Admin Code",
        description: "The admin code you entered is incorrect.",
        variant: "destructive",
      });
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    const adminExistsRef = doc(db, "Admins", email);
    const docSnap = await getDoc(adminExistsRef);

    if (docSnap.exists()) {
        toast({
            title: "Registration Failed",
            description: "An admin with this email address already exists.",
            variant: "destructive",
        });
        return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "Admins", user.email!), {
        uid: user.uid,
        fullName,
        email: user.email,
        mobileNumber,
      });
      
      toast({
        title: "Registration Successful!",
        description: "Please log in with your new credentials.",
      });

      router.push('/admin/login');
    } catch (error: any) {
      toast({
        title: "Error signing up",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-full bg-background/80 py-12">
      <Card className="mx-auto max-w-sm w-full shadow-2xl relative">
        <Button variant="ghost" size="sm" asChild className="absolute top-4 left-4">
            <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
            </Link>
        </Button>
        <CardHeader className="text-center pt-16">
            <div className="inline-block bg-primary/10 p-3 rounded-full mx-auto mb-4 w-fit">
              <Shield className="w-8 h-8 text-primary" />
            </div>
          <CardTitle className="text-2xl font-headline">Admin Registration</CardTitle>
          <CardDescription>
            Enter your information to create a new admin account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="full-name">Full Name</Label>
              <Input id="full-name" placeholder="Max Robinson" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="mobile-number">Mobile Number</Label>
                <Input id="mobile-number" type="tel" placeholder="123-456-7890" required value={mobileNumber} onChange={e => setMobileNumber(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="admin-code">Admin Code</Label>
              <Input id="admin-code" type="password" required value={adminCode} onChange={(e) => setAdminCode(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full">
              Create an account
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/admin/login" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
