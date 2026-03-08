"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LatticeMark } from "@/components/lattice-mark"
import { Eye, EyeOff, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"

/* ─────────────────────────────────────────────── */

type AuthMode = "signin" | "signup"

export default function AuthPage() {
    const router = useRouter()
    const { login, register } = useAuth()

    /* ─── Tab state ─── */
    const [activeTab, setActiveTab] = useState<AuthMode>("signin")
    const containerRef = useRef<HTMLDivElement>(null)
    const [indicator, setIndicator] = useState({ left: 0, width: 0 })
    const [mounted, setMounted] = useState(false)

    /* ─── Form state ─── */
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [siIdentifier, setSiIdentifier] = useState("")
    const [siPassword, setSiPassword] = useState("")

    const [suUsername, setSuUsername] = useState("")
    const [suEmail, setSuEmail] = useState("")
    const [suPassword, setSuPassword] = useState("")

    /* ─── Sliding pill indicator (matches filter-pills pattern) ─── */

    const updateIndicator = useCallback(() => {
        if (!containerRef.current) return
        const activeEl = containerRef.current.querySelector<HTMLButtonElement>(
            `[data-tab-active="true"]`,
        )
        if (activeEl) {
            const containerRect = containerRef.current.getBoundingClientRect()
            const activeRect = activeEl.getBoundingClientRect()
            setIndicator({
                left: activeRect.left - containerRect.left,
                width: activeRect.width,
            })
        }
    }, [])

    useEffect(() => {
        setMounted(true)
        const timer = setTimeout(updateIndicator, 20)
        return () => clearTimeout(timer)
    }, [updateIndicator])

    useEffect(() => {
        updateIndicator()
    }, [activeTab, updateIndicator])

    /* ─── Handlers ─── */

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            await login(siIdentifier, siPassword)
            toast.success("Welcome back!")
            router.push("/")
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Login failed."
            toast.error(msg)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            await register(suUsername, suPassword, suEmail || undefined)
            toast.success("Account created!")
            router.push("/")
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Registration failed."
            toast.error(msg)
        } finally {
            setIsLoading(false)
        }
    }

    /* ─── Shared classes ─── */

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

    const socialBtn = cn(
        "flex items-center justify-center gap-2.5 py-3.5 px-4",
        "bg-white border border-[var(--mist)] rounded-[var(--r-md)]",
        "text-[14px] font-medium text-foreground",
        "transition-all duration-150",
        "hover:bg-[var(--off-white)] hover:border-[var(--fog)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--signal)] focus-visible:ring-offset-2",
    )

    /* ─── Render ─── */

    return (
        <main className="min-h-screen grid lg:grid-cols-2">
            {/* ── Left Panel — Brand ── */}
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
                        Where BC builds
                        <br />
                        <span className="text-[#4EE0B8]">together.</span>
                    </h1>
                    <p className="text-[18px] leading-[1.7] text-white/50 max-w-md">
                        500+ startups, investors, and professionals shaping British
                        Columbia&apos;s innovation economy. Find your next opportunity.
                    </p>
                </div>
                <p className="relative z-10 text-[13px] text-white/30">
                    A BC economic development initiative
                </p>
            </div>

            {/* ── Right Panel — Form ── */}
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

                    {/* ── Tab Triggers with sliding pill ── */}
                    <div
                        ref={containerRef}
                        className="relative flex p-1 mb-12 bg-[var(--cloud)] rounded-[var(--r-md)]"
                    >
                        {/* Sliding pill indicator */}
                        {mounted && indicator.width > 0 && (
                            <div
                                className="absolute top-1 bottom-1 rounded-[var(--r-sm)] pointer-events-none"
                                style={{
                                    left: indicator.left,
                                    width: indicator.width,
                                    backgroundColor: "var(--white)",
                                    boxShadow: "var(--shadow-sm)",
                                    transition:
                                        "left 280ms cubic-bezier(0.16, 1, 0.3, 1), width 280ms cubic-bezier(0.16, 1, 0.3, 1)",
                                    zIndex: 0,
                                }}
                            />
                        )}

                        {(["signin", "signup"] as const).map((tab) => (
                            <button
                                key={tab}
                                data-tab-active={activeTab === tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "relative z-10 flex-1 py-3 text-[15px] font-medium rounded-[var(--r-sm)]",
                                    "transition-colors duration-200 cursor-pointer",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--signal)] focus-visible:ring-offset-2",
                                    activeTab === tab
                                        ? "text-foreground"
                                        : "text-[var(--ink-400)] hover:text-[var(--ink-500)]",
                                )}
                            >
                                {tab === "signin" ? "Sign In" : "Create Account"}
                            </button>
                        ))}
                    </div>

                    {/* ── Content Area ── */}
                    <div className="relative">
                        {/* Sign In */}
                        <div
                            key={activeTab === "signin" ? "signin-active" : "signin-hidden"}
                            className={cn(
                                activeTab === "signin"
                                    ? "animate-[authFadeIn_400ms_cubic-bezier(0.16,1,0.3,1)_both]"
                                    : "hidden",
                            )}
                        >
                            <div className="mb-10">
                                <h2 className="font-display text-[40px] leading-[1.1] tracking-[-0.02em] text-foreground mb-3">
                                    Welcome back
                                </h2>
                                <p className="text-[16px] text-[var(--ink-400)] leading-relaxed">
                                    Sign in to continue exploring BC&apos;s startup ecosystem.
                                </p>
                            </div>

                            <form onSubmit={handleSignIn} className="space-y-6">
                                <div>
                                    <label
                                        htmlFor="signin-email"
                                        className="block text-[14px] font-medium text-foreground mb-2.5"
                                    >
                                        Email or username
                                    </label>
                                    <input
                                        id="signin-email"
                                        type="text"
                                        placeholder="you@company.com"
                                        required
                                        value={siIdentifier}
                                        onChange={(e) => setSiIdentifier(e.target.value)}
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-2.5">
                                        <label
                                            htmlFor="signin-password"
                                            className="text-[14px] font-medium text-foreground"
                                        >
                                            Password
                                        </label>
                                        <Link
                                            href="/reset-password"
                                            className="text-[13px] text-[var(--signal)] hover:text-[var(--signal-hover)] transition-colors duration-150"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <div className="relative">
                                        <input
                                            id="signin-password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            required
                                            value={siPassword}
                                            onChange={(e) => setSiPassword(e.target.value)}
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

                                <button type="submit" disabled={isLoading} className={btnPrimary}>
                                    {isLoading ? (
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Sign In
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="flex items-center gap-4 my-8">
                                <div className="flex-1 h-px bg-[var(--mist)]" />
                                <span className="text-[12px] text-[var(--ink-300)] uppercase tracking-[0.08em]">
                                    or continue with
                                </span>
                                <div className="flex-1 h-px bg-[var(--mist)]" />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button type="button" className={socialBtn}>
                                    <GoogleIcon />
                                    Google
                                </button>
                                <button type="button" className={socialBtn}>
                                    <LinkedInIcon />
                                    LinkedIn
                                </button>
                            </div>
                        </div>

                        {/* Create Account */}
                        <div
                            key={activeTab === "signup" ? "signup-active" : "signup-hidden"}
                            className={cn(
                                activeTab === "signup"
                                    ? "animate-[authFadeIn_400ms_cubic-bezier(0.16,1,0.3,1)_both]"
                                    : "hidden",
                            )}
                        >
                            <div className="mb-10">
                                <h2 className="font-display text-[40px] leading-[1.1] tracking-[-0.02em] text-foreground mb-3">
                                    Join the network
                                </h2>
                                <p className="text-[16px] text-[var(--ink-400)] leading-relaxed">
                                    Create an account to connect with BC&apos;s innovation
                                    ecosystem.
                                </p>
                            </div>

                            <form onSubmit={handleSignUp} className="space-y-5">
                                <div>
                                    <label
                                        htmlFor="signup-name"
                                        className="block text-[14px] font-medium text-foreground mb-2.5"
                                    >
                                        Username
                                    </label>
                                    <input
                                        id="signup-name"
                                        type="text"
                                        placeholder="janesmith"
                                        required
                                        minLength={3}
                                        maxLength={32}
                                        value={suUsername}
                                        onChange={(e) => setSuUsername(e.target.value)}
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="signup-email"
                                        className="block text-[14px] font-medium text-foreground mb-2.5"
                                    >
                                        Email address
                                    </label>
                                    <input
                                        id="signup-email"
                                        type="email"
                                        placeholder="you@company.com"
                                        value={suEmail}
                                        onChange={(e) => setSuEmail(e.target.value)}
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="signup-password"
                                        className="block text-[14px] font-medium text-foreground mb-2.5"
                                    >
                                        Create password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="signup-password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Min. 6 characters"
                                            required
                                            minLength={6}
                                            value={suPassword}
                                            onChange={(e) => setSuPassword(e.target.value)}
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

                                <button type="submit" disabled={isLoading} className={btnPrimary}>
                                    {isLoading ? (
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Create Account
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </form>

                            <p className="mt-6 text-[13px] text-[var(--ink-300)] leading-relaxed text-center">
                                By creating an account, you agree to our{" "}
                                <Link
                                    href="/terms"
                                    className="text-[var(--signal)] hover:text-[var(--signal-hover)]"
                                >
                                    Terms
                                </Link>{" "}
                                and{" "}
                                <Link
                                    href="/privacy"
                                    className="text-[var(--signal)] hover:text-[var(--signal-hover)]"
                                >
                                    Privacy Policy
                                </Link>
                                .
                            </p>

                            <div className="flex items-center gap-4 my-8">
                                <div className="flex-1 h-px bg-[var(--mist)]" />
                                <span className="text-[12px] text-[var(--ink-300)] uppercase tracking-[0.08em]">
                                    or continue with
                                </span>
                                <div className="flex-1 h-px bg-[var(--mist)]" />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button type="button" className={socialBtn}>
                                    <GoogleIcon />
                                    Google
                                </button>
                                <button type="button" className={socialBtn}>
                                    <LinkedInIcon />
                                    LinkedIn
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

/* ── Inline SVG icons ── */

function GoogleIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
            />
            <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
            />
            <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
            />
            <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
            />
        </svg>
    )
}

function LinkedInIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
                d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                fill="#0A66C2"
            />
        </svg>
    )
}
