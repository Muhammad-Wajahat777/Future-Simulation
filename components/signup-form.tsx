"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import { supabase } from "@/lib/supabaseClient"

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrorMessage("")
    setLoading(true)
    const form = new FormData(e.currentTarget)
    const full_name = String(form.get("name") || "")
    const email = String(form.get("email") || "")
    const password = String(form.get("password") || "")
    const confirmPassword = String(form.get("confirm-password") || "")

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match")
      setLoading(false)
      return
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name } },
    })

    if (error) {
      setErrorMessage(error.message)
      setLoading(false)
      return
    }

    const user = data.user
    if (user && data.session) {
      // create profile row (safe when RLS policies allow authenticated inserts)
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({ id: user.id, full_name, email })

      if (profileError) {
        setErrorMessage(profileError.message)
        setLoading(false)
        return
      }
    }

    setLoading(false)
    router.push("/signup/success")
  }

  async function handleGoogleSignup() {
    const redirectTo = `${window.location.origin}/dashboard`
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    })
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input id="name" name="name" type="text" placeholder="John Doe" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
              <FieldDescription>
                We&apos;ll use this to contact you. We will not share your email
                with anyone else.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" name="password" type="password" required />
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              <Input id="confirm-password" name="confirm-password" type="password" required />
              <FieldDescription>Please confirm your password.</FieldDescription>
            </Field>
            {errorMessage ? (
              <FieldDescription className="text-destructive">{errorMessage}</FieldDescription>
            ) : null}
            <FieldGroup>
              <Field>
                <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</Button>
                <Button variant="outline" type="button" onClick={handleGoogleSignup}>
                  Sign up with Google
                </Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account? <a href="/login">Sign in</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
