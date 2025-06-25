const unzipper = require('unzipper');
const path = require('path');
const fs = require('fs');

// File Parser Service

// Parse .cbz (zip) file, extract images and basic metadata
async function parseCbz(filePath) {
    const extractDir = filePath + '_extracted';
    if (!fs.existsSync(extractDir)) fs.mkdirSync(extractDir, { recursive: true });
    // Extract all files
    await fs.createReadStream(filePath)
        .pipe(unzipper.Extract({ path: extractDir }))
        .promise();
    // Find images (jpg/png)
    const files = fs.readdirSync(extractDir);
    const images = files.filter(f => /\.(jpe?g|png)$/i.test(f));
    images.sort(); // Sort for reading order
    // Use first image as cover
    const coverPath = images.length > 0 ? path.join(extractDir, images[0]) : null;
    // Use filename (without ext) as title
    const title = path.basename(filePath, path.extname(filePath));
    return { title, coverPath, images: images.map(img => path.join(extractDir, img)) };
}

// TODO: Implement .cbr (rar) parsing logic
async function parseCbr(filePath) {
    console.log(`Parsing CBR file at: ${filePath}`);
}

module.exports = { parseCbz, parseCbr };
