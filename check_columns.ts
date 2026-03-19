import { supabaseAdmin } from "./app/libs/supabase";

async function checkColumns() {
  const { data, error } = await supabaseAdmin
    .from("listings")
    .select("*")
    .limit(1);

  if (error) {
    console.error("Error:", error);
    return;
  }

  if (data && data.length > 0) {
    console.log("Columns:", Object.keys(data[0]));
  } else {
    console.log("No data found in listings table.");
  }
}

checkColumns();
