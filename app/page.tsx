import Image from "next/image";
import { Chess } from "chess.js";
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
    <div className="mx-auto min-h-screen max-w-screen-md px-6 py-12 md:px-12 md:py-16 lg:py-24">
      <main className="flex flex-col items-center ">
        <Chessboard fen={puzzle.FEN}></Chessboard>
      </main>
      <footer className="">
        {/* <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a> */}
      </footer>
    </div>
  );
}
