import { createClient } from "@supabase/supabase-js";
import Chessboard from "./components/chessboard";

export default async function Home() {
  // Create a single supabase client for interacting with your database
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: puzzle, error } = await supabase
    .from("randompuzzles")
    .select("*")
    .limit(1)
    .single();

  if (error) {
    console.error("Error fetching random puzzle:", error);
  }

  return (
    <div className="mx-auto min-h-screen max-w-screen-md py-12 md:px-12 md:py-16 lg:py-24 scrollbar-hide">
      <main className="flex flex-col items-center ">
        <Chessboard fen={puzzle.FEN}></Chessboard>
      </main>
      <footer className="">
      </footer>
    </div>
  );
}
