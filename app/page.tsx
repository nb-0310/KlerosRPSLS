import CreateGameButton from '@/components/home/CreateGameButton';

export default function Home() {
  return (
    <main className="flex h-[70vh] flex-col items-center justify-center">
      <h1 className="text-center mb-1 font-semibold text-lg">
        Welcome to Rock Paper Scissors Lizard Spock!
      </h1>

      <CreateGameButton />
    </main>
  );
}
