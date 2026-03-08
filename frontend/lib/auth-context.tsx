"use client"

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    type ReactNode,
} from "react"
import {
    login as apiLogin,
    register as apiRegister,
    setToken,
    clearToken,
    type AuthPayload,
} from "@/lib/api"

/* ── Types ── */

interface AuthUser {
    id: string
    username: string
    email?: string
    role: "visitor" | "member" | "admin"
}

interface AuthContextValue {
    user: AuthUser | null
    loading: boolean
    login: (identifier: string, password: string) => Promise<void>
    register: (username: string, password: string, email?: string) => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

/* ── Helpers ── */

const TOKEN_KEY = "bc_connect_token"
const USER_KEY = "bc_connect_user"

function persistUser(user: AuthUser) {
    if (typeof window === "undefined") return
    window.localStorage.setItem(USER_KEY, JSON.stringify(user))
}

function readPersistedUser(): AuthUser | null {
    if (typeof window === "undefined") return null
    try {
        const raw = window.localStorage.getItem(USER_KEY)
        return raw ? (JSON.parse(raw) as AuthUser) : null
    } catch {
        return null
    }
}

function clearPersistedUser() {
    if (typeof window === "undefined") return
    window.localStorage.removeItem(USER_KEY)
}

/* ── Provider ── */

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null)
    const [loading, setLoading] = useState(true)

    // Hydrate from localStorage on mount
    useEffect(() => {
        const token = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null
        const persisted = readPersistedUser()

        if (token && persisted) {
            setUser(persisted)
        }
        setLoading(false)
    }, [])

    const handleAuthSuccess = useCallback((payload: AuthPayload) => {
        const u: AuthUser = {
            id: payload.user.id,
            username: payload.user.username,
            email: payload.user.email,
            role: payload.user.role,
        }
        setUser(u)
        persistUser(u)
    }, [])

    const login = useCallback(
        async (identifier: string, password: string) => {
            const payload = await apiLogin(identifier, password)
            handleAuthSuccess(payload)
        },
        [handleAuthSuccess],
    )

    const register = useCallback(
        async (username: string, password: string, email?: string) => {
            const payload = await apiRegister(username, password, email)
            handleAuthSuccess(payload)
        },
        [handleAuthSuccess],
    )

    const logout = useCallback(() => {
        clearToken()
        clearPersistedUser()
        setUser(null)
    }, [])

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

/* ── Hook ── */

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) {
        throw new Error("useAuth must be used inside <AuthProvider>")
    }
    return ctx
}
