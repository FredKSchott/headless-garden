import { createClient } from "@supabase/supabase-js";
import type { AstroCookies } from "astro/dist/core/cookies";
import type { Database } from "../../types-supabase";

const supabase = createClient<Database>(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.SUPABASE_SECRET_KEY
);

export async function all({
  url,
  cookies,
  request,
}: {
  url: URL;
  request: Request;
  cookies: AstroCookies;
}) {
  const { data, error } = await supabase
    .from("profiles")
    .select();

  return {
    body: JSON.stringify({
      data,
      error,
    }),
  };
}
