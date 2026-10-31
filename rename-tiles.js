import fs from 'fs';
import path from 'path';

// --- CONFIGURATION ---
// The folder where your frame_000.webp ... frame_044.webp files live
const INPUT_DIR = 'D:/Hery/experiment/mahjong/img/tiles/new_webp'; 
// The new folder for your game-ready files
const OUTPUT_DIR = 'D:/Hery/experiment/mahjong/img/tiles/renamed_webp'; 
// ---------------------

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log("Starting rename process...");

let count = 0;

for (let i = 0; i <= 44; i++) {
    // Format the input filename (e.g., frame_000.webp)
    const frameNum = String(i).padStart(3, '0');
    const oldName = `frame_${frameNum}.webp`;
    const oldPath = path.join(INPUT_DIR, oldName);

    // Check if the file exists
    if (!fs.existsSync(oldPath)) {
        console.log(`⚠️ Missing file: ${oldName}. Skipping.`);
        continue;
    }

    let newName = '';

    if (i <= 33) {
        // 0 to 33: Keep the same number (Bamboo, Characters, Dots, Winds, Dragons)
        newName = `${i}.webp`;
    } else if (i === 34 || i === 35) {
        // 34 and 35 are the checkerboard tiles. Skip them.
        console.log(`🚫 Skipping checkerboard: ${oldName}`);
        continue;
    } else if (i >= 36 && i <= 43) {
        // 36 to 43: Shift down by 2 to become 34 to 41
        newName = `${i - 2}.webp`;
    } else if (i === 44) {
        // 44: Tile Back
        newName = `dead.webp`;
    }

    // Copy and rename
    const newPath = path.join(OUTPUT_DIR, newName);
    fs.copyFileSync(oldPath, newPath);
    console.log(`✅ ${oldName} -> ${newName}`);
    count++;
}

console.log(`\n🎉 Done! Successfully copied and renamed ${count} files into:\n${OUTPUT_DIR}`);