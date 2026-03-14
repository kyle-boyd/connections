import { createBrowserClient, createServerClient as createSupabaseServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

/**
 * Use in Client Components (browser).
 */
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseKey);
}

/**
 * Use in Server Components, Server Actions, and Route Handlers.
 * Call from an async context: const supabase = await createServerClient();
 */
export async function createServerClient() {
  const cookieStore = await cookies();
  return createSupabaseServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll().map((c) => ({ name: c.name, value: c.value }));
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, { ...options });
          }
        } catch {
          // Ignored in Server Components when middleware refreshes
        }
      },
    },
  });
}
