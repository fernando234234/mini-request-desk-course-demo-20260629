import { createClient } from "@supabase/supabase-js";

export type RequestPriority = "Bassa" | "Media" | "Alta";
export type RequestStatus = "Nuova" | "In lavorazione" | "Risolta";

export type RequestRow = {
  id: number;
  title: string;
  description: string;
  requester: string;
  priority: RequestPriority;
  status: RequestStatus;
  created_at: string;
};

export type RequestInsert = {
  id?: never;
  title: string;
  description: string;
  requester: string;
  priority: RequestPriority;
  status: RequestStatus;
  created_at?: never;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

function isValidSupabaseUrl(value: string | undefined) {
  if (!value || value.includes("your-project-ref")) {
    return false;
  }

  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.hostname === "localhost";
  } catch {
    return false;
  }
}

export const isSupabaseConfigured = Boolean(
  isValidSupabaseUrl(supabaseUrl) &&
    supabasePublishableKey &&
    !supabasePublishableKey.includes("your-publishable-key"),
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabasePublishableKey!)
  : null;
