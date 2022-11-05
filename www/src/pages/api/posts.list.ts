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
  const userHandle = url.searchParams.get("user") ?? undefined;
  let userId: string;

  if (userHandle === "me") {
    const accessToken =
      request.headers.get("Authorization")?.replace(/bearer /i, "") ??
      cookies.get("my-access-token").value;
    if (!accessToken) {
      throw new Error("No User");
    }
    const userResponse = await supabase.auth.getUser(accessToken);
    userId = userResponse.data.user!.id;
  } else {
    const { data, error } = await supabase
    .from("profiles")
    .select(`id`)
    .eq("handle", userHandle)
    .limit(1);
    userId = data![0].id;
  }

  if (!userId) {
    throw new Error("No User Found");
  }

  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      profiles (
        *
      )`)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(100);


  const { data: retweetedPosts, error: error2 } = await supabase
  .from("post_interactions")
  .select(`
    posts (
      *,
      profiles (
        *
      )
    )`)
  .eq("user_id", userId)
  .eq("action", 2)
  .order("created_at", { ascending: false })
  .limit(100);

  let allPosts = [...data!, ...retweetedPosts!.map((p) => p.posts)].sort((a, b) => (a.created_at < b.created_at) ? 1 : ((a.created_at > b.created_at) ? -1 : 0));
  console.log('OKKAY', ...retweetedPosts!.map((p) => p.posts));
    

  return {
    body: JSON.stringify({
      userId,
      data: allPosts?.map(item => ({
        ...item,
        profiles: undefined,
        author: {
          ...item.profiles,
          avatar_image_path: undefined,
          avatar_url: `https://ixebnnxkmtfbfydfyxjc.supabase.co/storage/v1/object/public/avatars/${item.profiles.avatar_image_id}.jpg`
          
        },
      })),
      error,
      error2,
    }),
  };
}
