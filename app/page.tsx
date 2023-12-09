import CreateGameButton from '@/components/CreateGameButton';

export default function Home() {
  return (
    <main className="flex h-[70vh] flex-col px-72 justify-center items-start gap-3">
      <h1 className="text-4xl font-black">
        Embark on an Ethereum-Powered Rock Paper Scissors Adventure
      </h1>

      <p className="text-normal w-[55%]">
        Dive into the world of blockchain gaming with our
        Rock-Paper-Scissors-Lizard-Spock extension! Commit your moves, challenge
        opponents, and discover the thrill of winning ETH in a decentralized
        showdown featuring classic choices. Unleash your strategy now!
      </p>

      <CreateGameButton />
    </main>
  );
}
