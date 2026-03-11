import type { Business } from "@/components/business-card";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const AUTH_TOKEN_KEY = "bc_connect_token";

export interface AuthPayload {
  token: string;
  user: {
    id: string;
    username: string;
    email?: string;
    role: "visitor" | "member" | "admin";
  };
}

export interface ApiBusiness {
  _id: string;
  name: string;
  industryCategory?: string;
  industry?: string;
  region?: string;
  city?: string;
  address?: string;
  description?: string;
  tags?: string[];
  employees?: number;
  postalCode?: string;
  contact?: {
    email?: string;
    phone?: string;
    website?: string;
  };
  coordinates?: {
    lat?: number;
    lng?: number;
  };
  verificationStatus?: "pending" | "verified" | "rejected";
}

export interface CreateBusinessPayload extends Omit<ApiBusiness, "_id"> {
  industry?: string;
  industryCategory?: string;
}

interface RequestOptions extends RequestInit {
  auth?: boolean;
}

function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setToken(token: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearToken() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
}

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (options.auth) {
    const token = getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response
      .json()
      .catch(() => ({ message: "Request failed." }));
    throw new Error(
      errorBody.message || `Request failed with status ${response.status}`,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function register(
  username: string,
  password: string,
  email?: string,
) {
  const payload = await request<AuthPayload>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, password, email }),
  });

  setToken(payload.token);
  return payload;
}

export async function login(identifier: string, password: string) {
  const payload = await request<AuthPayload>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ identifier, password }),
  });

  setToken(payload.token);
  return payload;
}

export function toBusinessCard(business: ApiBusiness): Business {
  return {
    id: business._id,
    name: business.name,
    industry: business.industryCategory ?? business.industry ?? "Other",
    region: business.region ?? business.city ?? "British Columbia",
    city: business.city ?? "BC",
    description:
      business.description ??
      (business.address
        ? `Located at ${business.address}`
        : "BC business listing."),
    tags: business.tags,
    employees: business.employees,
    verified: business.verificationStatus === "verified",
  };
}

export async function getBusinesses(params?: {
  industry?: string;
  region?: string;
  city?: string;
  search?: string;
  limit?: number | "all";
  page?: number;
}) {
  const searchParams = new URLSearchParams();

  if (params?.industry) searchParams.set("industry", params.industry);
  if (params?.region) searchParams.set("region", params.region);
  if (params?.city) searchParams.set("city", params.city);
  if (params?.search) searchParams.set("search", params.search);
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.page) searchParams.set("page", String(params.page));

  const query = searchParams.toString();
  return request<ApiBusiness[]>(`/businesses${query ? `?${query}` : ""}`);
}

export function createBusiness(data: CreateBusinessPayload) {
  const payload = {
    ...data,
    industry: data.industry ?? data.industryCategory,
  };

  return request<ApiBusiness>("/businesses", {
    method: "POST",
    body: JSON.stringify(payload),
    auth: true,
  });
}

export function deleteBusiness(id: string) {
  return request<void>(`/businesses/${id}`, {
    method: "DELETE",
    auth: true,
  });
}

export function getBusinessById(id: string) {
  return request<ApiBusiness>(`/businesses/${id}`);
}

export function getFavorites() {
  return request<ApiBusiness[]>("/users/me/favorites", { auth: true });
}

export function toggleFavorite(businessId: string) {
  return request<{ favorites: string[]; added: boolean }>(
    "/users/me/favorites",
    {
      method: "POST",
      body: JSON.stringify({ businessId }),
      auth: true,
    },
  );
}

export function updateProfile(updates: { username?: string; email?: string }) {
  return request<{
    id: string;
    username: string;
    email?: string;
    role: string;
  }>("/users/me", {
    method: "PATCH",
    body: JSON.stringify(updates),
    auth: true,
  });
}
