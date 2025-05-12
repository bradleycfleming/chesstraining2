import Chessboard from "./components/chessboard";

export default async function Home() {
  return (
    <div className="mx-auto min-h-screen max-w-screen-md py-12 md:px-12 md:py-16 lg:py-24 scrollbar-hide">
      <main className="">
        <Chessboard></Chessboard>
      </main>
      <footer className=""></footer>
    </div>
  );
}
