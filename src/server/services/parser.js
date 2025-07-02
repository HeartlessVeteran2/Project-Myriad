const unzipper = require('unzipper');
const path = require('path');
const fs = require('fs');
const { FileUploadError, validateFileType } = require('../../lib/errors');

// File Parser Service

// Parse .cbz (zip) file, extract images and basic metadata
async function parseCbz(filePath) {
    try {
        // Validate file exists
        if (!fs.existsSync(filePath)) {
            throw new FileUploadError(`File not found: ${filePath}`);
        }

        // Validate file type
        validateFileType(filePath, ['cbz', 'zip']);

        // Validate file size (max 100MB)
        const stats = fs.statSync(filePath);
        if (stats.size > 100 * 1024 * 1024) {
            throw new FileUploadError('File size exceeds 100MB limit');
        }

        const extractDir = filePath + '_extracted';
        
        // Create extraction directory
        if (!fs.existsSync(extractDir)) {
            fs.mkdirSync(extractDir, { recursive: true });
        }

        // Extract all files
        await fs.createReadStream(filePath)
            .pipe(unzipper.Extract({ path: extractDir }))
            .promise();

        // Find images (jpg/png/gif/webp)
        const files = fs.readdirSync(extractDir);
        const images = files.filter(f => /\.(jpe?g|png|gif|webp)$/i.test(f));
        
        if (images.length === 0) {
            throw new FileUploadError('No valid image files found in archive');
        }

        // Natural sort for reading order (handles 1.jpg, 2.jpg, 10.jpg correctly)
        images.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
        
        // Use first image as cover
        const coverPath = images.length > 0 ? path.join(extractDir, images[0]) : null;
        
        // Use filename (without ext) as title
        const title = path.basename(filePath, path.extname(filePath));
        
        return { 
            title, 
            coverPath, 
            images: images.map(img => path.join(extractDir, img)),
            pageCount: images.length
        };
    } catch (error) {
        // If it's already our custom error, re-throw it
        if (error.isOperational) {
            throw error;
        }
        
        // Handle zip extraction errors
        if (error.message.includes('invalid signature') || error.message.includes('corrupt')) {
            throw new FileUploadError('Invalid or corrupted archive file');
        }
        
        // Handle other errors
        throw new FileUploadError(`Failed to parse archive: ${error.message}`);
    }
}

// TODO: Implement .cbr (rar) parsing logic
async function parseCbr(filePath) {
    console.warn(`CBR parsing not yet implemented for: ${filePath}`);
}

module.exports = { parseCbz, parseCbr };
