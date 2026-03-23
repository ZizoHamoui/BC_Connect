import type { Business } from "@/components/business-card";

const ENV_API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.trim();
const DEFAULT_LOCAL_API_BASE_URLS = [
  "http://localhost:5000/api",
  "http://localhost:5001/api",
];
let cachedApiBaseUrl: string | null = ENV_API_BASE_URL || null;
const AUTH_TOKEN_KEY = "bc_connect_token";
const AUTH_USER_KEY = "bc_connect_user";
const AUTH_EXPIRED_EVENT = "bc_connect_auth_expired";

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

export interface BusinessPagination {
  page: number;
  limit: number;
  hasMore: boolean;
  nextPage: number | null;
}

export interface PaginatedBusinessesResponse {
  items: ApiBusiness[];
  pagination: BusinessPagination;
}

interface GetBusinessesParams {
  industry?: string;
  region?: string;
  city?: string;
  search?: string;
  limit?: number | "all";
  page?: number;
  withMeta?: boolean;
}

interface RequestOptions extends RequestInit {
  auth?: boolean;
}

function getApiBaseCandidates() {
  if (ENV_API_BASE_URL) return [ENV_API_BASE_URL];
  if (!cachedApiBaseUrl) return DEFAULT_LOCAL_API_BASE_URLS;

  return [
    cachedApiBaseUrl,
    ...DEFAULT_LOCAL_API_BASE_URLS.filter((url) => url !== cachedApiBaseUrl),
  ];
}

function buildApiUrl(baseUrl: string, path: string) {
  return `${baseUrl}${path}`;
}

function normalizeText(value?: string) {
  return typeof value === "string" ? value.trim() : "";
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

  const apiBaseCandidates = getApiBaseCandidates();
  let networkError: unknown = null;
  let response: Response | null = null;

  for (const apiBaseUrl of apiBaseCandidates) {
    try {
      response = await fetch(buildApiUrl(apiBaseUrl, path), {
        ...options,
        headers,
      });
      cachedApiBaseUrl = apiBaseUrl;
      break;
    } catch (error) {
      networkError = error;
    }
  }

  if (!response) {
    if (networkError instanceof Error) {
      throw new Error(
        `Unable to reach API (${apiBaseCandidates.join(" or ")}): ${networkError.message}`,
      );
    }
    throw new Error(`Unable to reach API (${apiBaseCandidates.join(" or ")}).`);
  }

  if (!response.ok) {
    const errorBody = await response
      .json()
      .catch(() => ({ message: "Request failed." }));
    const message =
      errorBody.message || `Request failed with status ${response.status}`;

    if (options.auth) {
      const normalized = String(message).toLowerCase();
      const isTokenError =
        response.status === 401 ||
        normalized.includes("invalid or expired token") ||
        normalized.includes("missing authorization");

      if (isTokenError) {
        clearToken();
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(AUTH_USER_KEY);
          window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));
        }
      }
    }

    throw new Error(message);
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
  const normalizedIndustry = normalizeText(
    business.industryCategory ?? business.industry,
  );
  const normalizedRegion = normalizeText(business.region ?? business.city);
  const normalizedCity = normalizeText(business.city);

  return {
    id: business._id,
    name: business.name,
    industry: normalizedIndustry || "Other",
    region: normalizedRegion || "British Columbia",
    city: normalizedCity || "BC",
    description:
      business.description ??
      (business.address
        ? `Located at ${business.address}`
        : "BC business listing."),
    tags: business.tags,
    employees: business.employees,
    verified: business.verificationStatus === "verified",
    verificationStatus: business.verificationStatus,
    lat: business.coordinates?.lat,
    lng: business.coordinates?.lng,
  };
}

export function getBusinesses(
  params: GetBusinessesParams & { withMeta: true },
): Promise<PaginatedBusinessesResponse>;
export function getBusinesses(params?: GetBusinessesParams): Promise<ApiBusiness[]>;
export function getBusinesses(params: GetBusinessesParams = {}) {
  const searchParams = new URLSearchParams();

  if (params?.industry) searchParams.set("industry", params.industry);
  if (params?.region) searchParams.set("region", params.region);
  if (params?.city) searchParams.set("city", params.city);
  if (params?.search) searchParams.set("search", params.search);
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.withMeta) searchParams.set("withMeta", "true");

  const query = searchParams.toString();
  return request<ApiBusiness[] | PaginatedBusinessesResponse>(
    `/businesses${query ? `?${query}` : ""}`,
    { auth: true },
  );
}

export function getBusinessFilterOptions(search?: string) {
  const searchParams = new URLSearchParams();
  if (search) searchParams.set("search", search);
  const query = searchParams.toString();

  return request<{ industries: string[]; regions: string[] }>(
    `/businesses/filters${query ? `?${query}` : ""}`,
    { auth: true },
  );
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
  return request<ApiBusiness>(`/businesses/${id}`, { auth: true });
}

export function getSavedBusinesses() {
  return request<ApiBusiness[]>("/users/me/saved", { auth: true });
}

export function saveBusiness(businessId: string) {
  return request<{ savedBusinessIds: string[]; added: boolean }>(
    "/users/me/saved",
    {
      method: "POST",
      body: JSON.stringify({ businessId }),
      auth: true,
    },
  );
}

export function removeSavedBusiness(businessId: string) {
  return request<{ savedBusinessIds: string[]; removed: boolean }>(
    `/users/me/saved/${businessId}`,
    {
      method: "DELETE",
      auth: true,
    },
  );
}

export interface BusinessRecommendation {
  business: ApiBusiness;
  score: number;
  reasons: string[];
}

export function getRecommendations() {
  return request<{ recommendations: BusinessRecommendation[]; basedOnSaved: number }>(
    "/users/me/recommendations",
    { auth: true },
  );
}

export function getFavorites() {
  return getSavedBusinesses();
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

// Admin API
export interface AdminStats {
  businessesThisMonth: number;
  totalBusinesses: number;
  monthOverMonthChange: number;
  totalMembers: number;
}

export interface AdminUser {
  _id: string;
  username: string;
  email?: string;
  createdAt: string;
}

export function getAdminStats() {
  return request<AdminStats>("/admin/stats", { auth: true });
}

export function getPendingBusinesses() {
  return request<ApiBusiness[]>("/admin/businesses/pending", { auth: true });
}

export function updateBusinessStatus(
  id: string,
  status: "verified" | "rejected",
) {
  return request<ApiBusiness>(`/admin/businesses/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
    auth: true,
  });
}

export function getAdminUsers() {
  return request<AdminUser[]>("/admin/admins", { auth: true });
}

export interface MemberUser {
  _id: string;
  username: string;
  email?: string;
  role: "member" | "admin";
  createdAt: string;
}

export function getMembers(search?: string) {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  return request<MemberUser[]>(`/admin/members${query}`, { auth: true });
}

export function updateUserRoles(
  changes: { userId: string; role: "member" | "admin" }[],
) {
  return request<{ updated: MemberUser[] }>("/admin/members/roles", {
    method: "PATCH",
    body: JSON.stringify({ changes }),
    auth: true,
  });
}

export interface AdminActionEntry {
  _id: string;
  action: "approved" | "rejected" | "deleted";
  businessName: string;
  businessIndustry?: string;
  businessCity?: string;
  businessRegion?: string;
  performedBy: { _id: string; username: string } | null;
  createdAt: string;
}

export function deleteBusinessAdmin(id: string) {
  return request<void>(`/admin/businesses/${id}`, {
    method: "DELETE",
    auth: true,
  });
}

export function getActionHistory() {
  return request<AdminActionEntry[]>("/admin/actions", { auth: true });
}
