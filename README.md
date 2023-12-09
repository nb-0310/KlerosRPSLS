# Rock Paper Scissor Lizard Spock

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Installation and Starting

```bash
npm install
```

Create a `.env.local` file and add the environment variable `NEXT_PUBLIC_ALCHEMY_API_KEY` with it's value as the Alchemy API key.

and then

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Testnet used: Sepolia

## Mixed Strategy Nash Equilibrium

For this game, the payoff matrix would be:
![Payoff Matrix for RPSLS](/public/payoff.png)

The optimal strategy for any player would be to randomize their moves with the following probabilities:

- Rock: 20%
- Paper: 20%
- Scissors: 20%
- Lizard: 20%
- Spock: 20%
# KlerosRPSLS
