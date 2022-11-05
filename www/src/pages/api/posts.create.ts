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
  const userResponse = (await supabase.auth.getUser(accessToken));
  console.log( userResponse,  userResponse.data.user?.id)
  const { data, error } = await supabase
    .from("posts")
    .insert({
      user_id: userResponse.data.user?.id!,
      content: url.searchParams.get("content")!,
    })
    .select();

    const allFollowersResponse = await supabase
    .from("relationships")
    .select()
    .eq('followed_id', userResponse.data.user?.id);
    console.log(allFollowersResponse);

    const { error: error2 } = await supabase
  .from('feed_items')
  .insert(
    allFollowersResponse.data!.map((relationship) => {
    return {
      user_id: relationship.follower_id,
      post_id: data![0].id,
    };
    }));

  return {
    body: JSON.stringify({
      data: data![0],
      error,
      error2,
    }),
  };
}
