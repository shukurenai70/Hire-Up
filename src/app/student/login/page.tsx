"use client";

import Link from "next/link"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
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
import { GraduationCap, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast";

export default function StudentLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/student/dashboard');
    } catch (error: any) {
      toast({
        title: "Error logging in",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-full bg-background/80">
        <Card className="mx-auto max-w-sm w-full shadow-2xl relative">
        <Button variant="ghost" size="sm" asChild className="absolute top-4 left-4">
            <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
            </Link>
        </Button>
        <CardHeader className="text-center pt-16">
            <div className="inline-block bg-primary/10 p-3 rounded-full mx-auto mb-4 w-fit">
                <GraduationCap className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-headline">Student Login</CardTitle>
            <CardDescription>
            Enter your email to access your dashboard
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleLogin} className="grid gap-4">
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
                <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full">
                Login
            </Button>
            </form>
            <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/student/signup" className="underline">
                Sign up
            </Link>
            </div>
        </CardContent>
        </Card>
    </div>
  )
}
