import { createClient } from "@supabase/supabase-js";
import type { AstroCookies } from "astro/dist/core/cookies";
import type { Database } from "../../types-supabase";

const supabase = createClient<Database>(
  import.meta.env.SUPABASE_URL,
  import.meta.env.SUPABASE_SECRET_KEY
);

export async function all({ url, cookies, request }: { url: URL, request: Request, cookies: AstroCookies }) {
  const accessToken = request.headers.get('Authorization')?.replace(/bearer /i, '') ?? cookies.get('my-access-token').value;
  if (!accessToken) {
    throw new Error('No User');
  }
  const userResponse = (await supabase.auth.getUser(accessToken));
  console.log( userResponse,  userResponse.data.user?.id)
  const { data, error } = await supabase
    .from("relationships")
    .insert({
      follower_id: userResponse.data.user?.id!,
      followed_id: url.searchParams.get("user")!,
    })
    .select();

  return {
    body: JSON.stringify({
      data,
      error,
    }),
  };
}
