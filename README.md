# YutongPortfolio — Deploy on Vercel (Free)

This is a tiny static portfolio meant to be deployed on Vercel for free.

Quick steps

1. Push this folder to a Git provider (GitHub, GitLab, or Bitbucket).
2. Go to https://vercel.com and import the repository (Vercel automatically detects a static site).
3. Or deploy from your machine with the Vercel CLI (recommended for quick testing).

Vercel CLI deploy

```bash
# install (if you don't have it)
npm i -g vercel

# run from the project root
vercel login
vercel --prod
```

What I included

- `index.html` — the static site entry
- `styles.css` — simple responsive styles
- `vercel.json` — optional: enables clean URLs

Customization

- Replace "Yutong" and contact links in `index.html`.
- Add project links and descriptions under the Projects section.

Troubleshooting

- If Vercel shows an incorrect build step, choose "Framework: Other" or set the build command to empty since this is a static site.
