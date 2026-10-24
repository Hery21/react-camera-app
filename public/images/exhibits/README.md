# Exhibit Images

Store approved launch images under one directory per stable exhibit ID.

Example:

EXPO-001/
cover.webp
gallery-01.webp
gallery-02.webp

Rules:

- Use the exact stable exhibit ID used by the QR parser and exhibit data.
- Keep technical filenames language-neutral.
- Put translated alt text and captions in src/data/exhibits.js, not in filenames.
- Do not add unapproved artifact imagery.
- Optimize images before launch; keep the original archival/source files outside the web bundle.
