# My Guy Zach

A hiring tool built by Zach Brown. Hiring managers can ask questions about Zach or paste a job description to get a custom 30/60/90 day plan.

## Stack

- Next.js 14
- Anthropic Claude API (claude-sonnet-4-20250514)
- Deployed on Vercel

## Local Development

1. Clone the repo
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env.local` file in the root:
   ```
   ANTHROPIC_API_KEY=your_api_key_here
   ```
4. Run the dev server:
   ```
   npm run dev
   ```
5. Open http://localhost:3000

## Deploying to Vercel

1. Push this repo to GitHub
2. Go to vercel.com and import the repo
3. During setup, add the environment variable:
   - Key: `ANTHROPIC_API_KEY`
   - Value: your Anthropic API key
4. Deploy

That's it. Vercel handles everything else automatically.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key from console.anthropic.com |
