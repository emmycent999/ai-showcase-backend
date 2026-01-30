const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

const generateCertificate = async (userData, type) => {
  try {
    // Determine which certificate template to use
    let templatePath;
    if (type === 'participant') {
      templatePath = path.join(__dirname, '..', '..', 'Participant.png');
    } else if (type === 'organizer') {
      templatePath = path.join(__dirname, '..', '..', 'Organizers.png');
    } else if (type === 'alumni') {
      templatePath = path.join(__dirname, '..', '..', 'Alumni.png');
    }

    // Load the certificate template
    const image = await loadImage(templatePath);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');

    // Draw the certificate template
    ctx.drawImage(image, 0, 0);

    // Configure text styling for name
    ctx.font = 'bold 100px Raleway, Georgia, serif';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Draw the name in the center (adjust Y position as needed)
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    ctx.fillText(userData.full_name, centerX, centerY);

    // Save to temp file
    const fileName = `certificate_${userData.id}_${Date.now()}.png`;
    const outputPath = path.join(__dirname, '..', 'temp', fileName);

    if (!fs.existsSync(path.join(__dirname, '..', 'temp'))) {
      fs.mkdirSync(path.join(__dirname, '..', 'temp'));
    }

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputPath, buffer);

    return outputPath;
  } catch (error) {
    console.error('Certificate generation error:', error);
    throw error;
  }
};

module.exports = { generateCertificate };
