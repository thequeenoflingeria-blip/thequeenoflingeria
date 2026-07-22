const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const inputDir = path.join(__dirname, 'public', 'hero_images');
const outputDir = path.join(__dirname, 'public', 'hero_images_optimized');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function processImages() {
  const files = fs.readdirSync(inputDir);
  
  for (const file of files) {
    if (file.match(/\.(jpg|jpeg|png|webp)$/i)) {
      const inputPath = path.join(inputDir, file);
      const outputPath = path.join(outputDir, file);
      
      console.log(`Processing ${file}...`);
      
      try {
        await sharp(inputPath)
          .resize(1920, null, { withoutEnlargement: true }) // Resize to max 1920px width, auto height
          .jpeg({ quality: 75, progressive: true }) // Compress with 75% quality
          .toFile(outputPath);
        
        console.log(`✅ Saved optimized ${file}`);
      } catch (err) {
        console.error(`❌ Error processing ${file}:`, err);
      }
    }
  }
}

processImages().then(() => console.log('All done!'));
