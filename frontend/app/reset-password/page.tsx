"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LatticeMark } from "@/components/lattice-mark"
import { Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { resetPassword } from "@/lib/api"
import { toast } from "sonner"

export default function ResetPasswordPage() {
    const router = useRouter()

    const [identifier, setIdentifier] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const inputClass = cn(
        "w-full px-4 py-3.5 bg-white border border-[var(--mist)] rounded-[var(--r-md)]",
        "text-[15px] text-foreground placeholder:text-[var(--ink-200)]",
        "transition-all duration-200",
        "hover:border-[var(--fog)]",
        "focus:outline-none focus:border-[var(--signal)] focus:ring-4 focus:ring-[var(--signal-soft)]",
    )

    const btnPrimary = cn(
        "w-full flex items-center justify-center gap-2.5 py-4 px-6 mt-8",
        "bg-[var(--ink-900)] hover:bg-[var(--ink-700)] text-white",
        "text-[15px] font-medium rounded-[var(--r-md)]",
        "transition-colors duration-150 btn-press",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--signal)] focus-visible:ring-offset-2",
    )

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            toast.error("Passwords do not match.")
            return
        }

        setIsLoading(true)
        try {
            await resetPassword(identifier, password, confirmPassword)
            toast.success("Password updated! Please sign in.")
            router.push("/auth")
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Password reset failed."
            toast.error(msg)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className="min-h-screen grid lg:grid-cols-2">
            {/* Left Panel — Brand */}
            <div className="hidden lg:flex flex-col justify-between p-16 bg-[var(--ink-900)] relative overflow-hidden">
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 1px 1px, #4EE0B8 1px, transparent 0)",
                        backgroundSize: "32px 32px",
                    }}
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.08]">
                    <LatticeMark size={480} variant="signal" />
                </div>
                <Link
                    href="/"
                    className="relative z-10 inline-flex items-center gap-3 focus-ring rounded-sm w-fit lattice-hover"
                >
                    <LatticeMark size={28} variant="dark" />
                    <span className="font-display text-[22px] text-white tracking-[-0.01em]">
                        BC Connect
                    </span>
                </Link>
                <div className="relative z-10 max-w-lg">
                    <h1 className="font-display text-[56px] leading-[1.08] tracking-[-0.025em] text-white mb-8">
                        Reset your
                        <br />
                        <span className="text-[#4EE0B8]">password.</span>
                    </h1>
                    <p className="text-[18px] leading-[1.7] text-white/50 max-w-md">
                        Enter your account details and choose a new password to regain access.
                    </p>
                </div>
                <p className="relative z-10 text-[13px] text-white/30">
                    A BC economic development initiative
                </p>
            </div>

            {/* Right Panel — Form */}
            <div className="flex items-center justify-center px-6 py-16 lg:px-16 bg-[var(--off-white)]">
                <div className="w-full max-w-[420px]">
                    {/* Mobile logo */}
                    <Link
                        href="/"
                        className="lg:hidden inline-flex items-center gap-2.5 mb-12 focus-ring rounded-sm lattice-hover"
                    >
                        <LatticeMark size={24} variant="light" />
                        <span className="font-display text-[20px] text-foreground tracking-[-0.01em]">
                            BC Connect
                        </span>
                    </Link>

                    <div className="animate-[authFadeIn_400ms_cubic-bezier(0.16,1,0.3,1)_both]">
                        <div className="mb-10">
                            <h2 className="font-display text-[40px] leading-[1.1] tracking-[-0.02em] text-foreground mb-3">
                                Reset password
                            </h2>
                            <p className="text-[16px] text-[var(--ink-400)] leading-relaxed">
                                Enter your email or username and choose a new password.
                            </p>
                        </div>

                        <form onSubmit={handleReset} className="space-y-6">
                            <div>
                                <label
                                    htmlFor="reset-identifier"
                                    className="block text-[14px] font-medium text-foreground mb-2.5"
                                >
                                    Email or username
                                </label>
                                <input
                                    id="reset-identifier"
                                    type="text"
                                    placeholder="you@company.com"
                                    required
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="reset-password"
                                    className="block text-[14px] font-medium text-foreground mb-2.5"
                                >
                                    New password
                                </label>
                                <div className="relative">
                                    <input
                                        id="reset-password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Min. 6 characters"
                                        required
                                        minLength={6}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={cn(inputClass, "pr-12")}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--ink-300)] hover:text-[var(--ink-500)] transition-colors duration-150"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-[18px] h-[18px]" />
                                        ) : (
                                            <Eye className="w-[18px] h-[18px]" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="reset-confirm"
                                    className="block text-[14px] font-medium text-foreground mb-2.5"
                                >
                                    Confirm new password
                                </label>
                                <input
                                    id="reset-confirm"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Re-enter your password"
                                    required
                                    minLength={6}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={inputClass}
                                />
                            </div>

                            <button type="submit" disabled={isLoading} className={btnPrimary}>
                                {isLoading ? (
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Reset Password
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>

                        <Link
                            href="/auth"
                            className="inline-flex items-center gap-2 mt-8 text-[14px] text-[var(--ink-400)] hover:text-foreground transition-colors duration-150"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to sign in
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    )
}
