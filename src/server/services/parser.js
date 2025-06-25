// File Parser Service

// TODO: Implement .cbz (zip) parsing logic using 'unzipper'
async function parseCbz(filePath) {
    console.log(`Parsing CBZ file at: ${filePath}`);
    // 1. Extract images and metadata
    // 2. Create a 'series' record in the database
}

// TODO: Implement .cbr (rar) parsing logic
async function parseCbr(filePath) {
    console.log(`Parsing CBR file at: ${filePath}`);
}

module.exports = { parseCbz, parseCbr };
