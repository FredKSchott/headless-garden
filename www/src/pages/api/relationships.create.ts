import { createClient } from "@supabase/supabase-js";
import type { AstroCookies } from "astro/dist/core/cookies";
import type { Database } from "../../types-supabase";

const supabase = createClient<Database>(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.SUPABASE_SECRET_KEY
);

export async function all({ url, cookies, request }: { url: URL, request: Request, cookies: AstroCookies }) {
  const accessToken = request.headers.get('Authorization')?.replace(/bearer /i, '') ?? cookies.get('my-access-token').value;
  if (!accessToken) {
    throw new Error('No User');
  }
  
  const followerResponse = (await supabase.auth.getUser(accessToken));
  const followedResponse = await supabase
    .from("profiles")
    .select(`id`)
    .eq("handle", url.searchParams.get("user"))
    .limit(1);
  const userId = followedResponse.data![0].id;

  const { data, error } = await supabase
    .from("relationships")
    .insert({
      follower_id: followerResponse.data.user?.id!,
      followed_id: userId!,
    })
    .select();

  return {
    body: JSON.stringify({
      data,
      error,
    }),
  };
}
