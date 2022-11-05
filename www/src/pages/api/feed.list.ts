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
  let userId: string | undefined = url.searchParams.get("user") ?? undefined;
  if (userId === "me") {
    const accessToken =
      request.headers.get("Authorization")?.replace(/bearer /i, "") ??
      cookies.get("my-access-token").value;
    if (!accessToken) {
      throw new Error("No User");
    }
    const userResponse = await supabase.auth.getUser(accessToken);
    userId = userResponse.data.user?.id;
  }
  const { data, error } = await supabase
    .from("feed_items")
    .select(`
      posts (
        *,
        profiles (
          *
        )
      )
    `)
    .eq("user_id", userId)
    .limit(100);

  return {
    body: JSON.stringify({
      data: data?.map(item => ({
        ...item.posts,
        profiles: undefined,
        author: {
          ...item.posts!.profiles,
          avatar_image_path: undefined,
          avatar_url: `https://ixebnnxkmtfbfydfyxjc.supabase.co/storage/v1/object/public/avatars/${item.posts.profiles.avatar_image_id}.jpg`
          
        },
      })),
      error,
    }),
  };
}
