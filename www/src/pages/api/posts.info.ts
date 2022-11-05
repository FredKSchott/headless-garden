import { createClient } from "@supabase/supabase-js";
import type { Database } from "../../types-supabase";

const supabase = createClient<Database>(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.SUPABASE_SECRET_KEY
);

export async function all({ url }: { url: URL }) {
  const postId = url.searchParams.get("id");
  const { data, error } = await supabase
    .from("posts")
    .select()
    .eq("id", postId);

  return {
    body: JSON.stringify({
      data: data![0],
      error,
    }),
  };
}
