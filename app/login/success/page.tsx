import Link from "next/link"

export default function LoginSuccessPage() {
  return (
    <main className="flex min-h-svh items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md rounded-xl border p-8 text-center">
        <h1 className="text-2xl font-semibold">Login Successful</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          You have successfully logged in.
        </p>
        <div className="mt-6">
          <Link
            href="/dashboard"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </main>
  )
}
