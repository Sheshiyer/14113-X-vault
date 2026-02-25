import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const SOURCE_DIR = path.resolve(import.meta.dir, '../public/brand');
const TARGET_DIR = path.resolve(import.meta.dir, '../public/brand-optimized');

async function optimizeImages() {
    if (!fs.existsSync(TARGET_DIR)) {
        fs.mkdirSync(TARGET_DIR, { recursive: true });
    }

    const files = fs.readdirSync(SOURCE_DIR).filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg'));

    console.log(`Found ${files.length} images to optimize...`);

    for (const file of files) {
        const inputPath = path.join(SOURCE_DIR, file);
        // Replace extension with webp
        const filenameWithoutExt = path.parse(file).name;
        const outputPath = path.join(TARGET_DIR, `${filenameWithoutExt}.webp`);

        console.log(`Optimizing ${file}...`);

        try {
            await sharp(inputPath)
                .resize({ width: 800, withoutEnlargement: true })
                .webp({ quality: 80, effort: 4 })
                .toFile(outputPath);

            console.log(`✅ Saved ${outputPath}`);
        } catch (err) {
            console.error(`❌ Error optimizing ${file}:`, err);
        }
    }

    console.log('✅ All images optimized.');
}

optimizeImages().catch(console.error);
