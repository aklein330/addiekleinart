# Artist site

Static site built with [Astro](https://astro.build), with content editing through [TinaCMS](https://tina.io).

## Develop

```bash
npm install
npm run dev
```

- Site: http://localhost:4321
- Editor (local mode, saves straight to files): http://localhost:4321/admin/index.html

## Where content lives

All of this is editable in the admin; the files can also be edited by hand.

| Content | File(s) |
|---|---|
| Paintings | `src/content/artworks/*.md` |
| Exhibitions | `src/content/exhibitions/*.json` |
| About page | `src/content/pages/about.md` |
| Name, email, tagline, shop toggle | `src/content/settings/site.json` |
| Images | `src/assets/` (image fields store paths like `/assets/artworks/x.jpg`) |

The editor forms are defined in `tina/config.ts`.

## Shop

`/shop` lists paintings that are available and have a price. It stays out of the menu and search engines until **Site settings → Show the Shop page** is turned on.

## One-time hosting setup

1. **GitHub:** create a private repository and push this project to the `main` branch.
2. **Tina Cloud** ([app.tina.io](https://app.tina.io)): create a project, connect the GitHub repo, and copy the **Client ID** and a **read-only token**.
3. **Netlify:** import the repo. In *Site configuration → Environment variables*, add `TINA_CLIENT_ID` and `TINA_TOKEN`. The build command comes from `netlify.toml`.
4. **Tina Cloud:** add the Netlify URL (and custom domain later) under the project's *Site URLs*, then invite the artist by email under *Collaborators*.

After that, the artist edits at `https://<site>/admin`. Each save commits to GitHub and Netlify publishes it within a couple of minutes.

## Notes

- Upload JPG or PNG images; iPhone HEIC photos need converting first. Large originals are fine: images are resized and compressed at build time.
- Pull before working locally (`git pull`), since the artist's edits arrive as commits.
