# Project update notes

## What changed in this pass
- Legacy studio routes now redirect into the rebuilt emotion-music experience:
  - `/app` -> `/bangDieuKhien`
  - `/search` -> `/nhanDienCamXuc`
  - `/library` -> `/goiY`
  - `/profile` -> `/phanTich`
  - `/settings` -> `/caiDat`
- This makes the richer UI the default experience instead of the older studio shell the user was still seeing.
- The rebuilt experience already includes:
  - dashboard with mood-aware sections
  - dedicated emotion detection page
  - recommendation page tied to mood and taste profile
  - analytics / taste profile page
  - in-app assistant panel
  - persistent mini player

## Validation notes
- TypeScript check passed with `npx tsc --noEmit` in this environment.
- `npm run lint` could not run here because `eslint` is not available as an installed executable in the extracted environment.
- `npm run build` could not run here because dependencies are not installed in this extracted copy.

## How to run locally
1. Open terminal in the project root.
2. Run:
   - `npm install`
   - `npm run dev`
3. Open:
   - `http://localhost:3000/app`

You should now land inside the rebuilt emotion-music interface instead of the older shell.
