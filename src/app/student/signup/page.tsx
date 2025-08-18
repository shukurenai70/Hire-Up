
"use client";

import Link from "next/link"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDocs, collection, query, where, limit } from "firebase/firestore";
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
import { GraduationCap, ArrowLeft } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast";

const COURSES = ["MCA", "MBA", "MA", "MCom", "MSc"];

export default function StudentSignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [course, setCourse] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }
    if (!course || !rollNumber) {
        toast({
            title: "Missing Details",
            description: "Please select your course and enter your roll number.",
            variant: "destructive",
        });
        return;
    }

    try {
      const studentQuery = query(collection(db, `Students-list/Course/${course}`), where("rollNumber", "==", rollNumber), limit(1));
      const querySnapshot = await getDocs(studentQuery);
      if (!querySnapshot.empty) {
        toast({
            title: "Registration Failed",
            description: "A student with this roll number is already registered in this course.",
            variant: "destructive",
        });
        return;
      }
        
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const studentDetailDocRef = doc(db, `Students-list/Course/${course}`, user.uid);
      await setDoc(studentDetailDocRef, {
        uid: user.uid,
        fullName,
        email,
        rollNumber,
        course,
        mobileNumber
      });

      const studentRootDocRef = doc(db, 'Students', email);
      await setDoc(studentRootDocRef, {
        uid: user.uid,
        fullName,
        email,
        rollNumber,
        course,
      });

      const emailDocRef = doc(db, "student-emails", user.uid);
      await setDoc(emailDocRef, { email });

      toast({
        title: "Registration Successful!",
        description: "Please log in with your new credentials.",
      });

      router.push('/student/login');
    } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
            toast({
                title: "Registration Failed",
                description: "This email address is already in use by another account.",
                variant: "destructive",
            });
        } else {
            toast({
                title: "Error signing up",
                description: error.message,
                variant: "destructive",
            });
        }
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
                <GraduationCap className="w-8 h-8 text-primary" />
            </div>
          <CardTitle className="text-2xl font-headline">Student Registration</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="full-name">Full Name</Label>
              <Input id="full-name" placeholder="Max Robinson" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="roll-number">Roll Number</Label>
              <Input id="roll-number" placeholder="CS2025001" required value={rollNumber} onChange={(e) => setRollNumber(e.target.value.toUpperCase())} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="course">Course</Label>
                <Select onValueChange={setCourse} value={course}>
                  <SelectTrigger id="course">
                    <SelectValue placeholder="Select your course" />
                  </SelectTrigger>
                  <SelectContent>
                    {COURSES.map(courseName => (
                        <SelectItem key={courseName} value={courseName}>{courseName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
             <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input id="confirm-password" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full">
              Create an account
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/student/login" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
