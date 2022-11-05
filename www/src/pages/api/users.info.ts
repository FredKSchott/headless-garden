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
    .from("profiles")
    .select()
    .eq("id", userId);


  const { data: avatarImageUrl } = await supabase
  .storage
  .from('avatars')
  .getPublicUrl(data![0].avatar_image_id + '.jpg');

  return {
    body: JSON.stringify({
      data: {
        ...data![0],
        avatar_image_id: undefined,
        avatar_url: avatarImageUrl.publicUrl,
      },
      error,
    }),
  };
}
