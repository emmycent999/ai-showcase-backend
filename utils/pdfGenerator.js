const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');

const generateCertificate = async (userData, type) => {
  try {
    let templatePath;
    if (type === 'participant') {
      templatePath = path.join(__dirname, '..', 'Participant.png');
    } else if (type === 'organizer') {
      templatePath = path.join(__dirname, '..', 'Organizers.png');
    } else if (type === 'alumni') {
      templatePath = path.join(__dirname, '..', 'Alumni.png');
    }

    console.log('Template path:', templatePath);
    console.log('File exists:', fs.existsSync(templatePath));
    
    const image = await Jimp.read(templatePath);
    const font = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);

    const centerX = image.bitmap.width / 2;
    const centerY = image.bitmap.height / 2;

    image.print(
      font,
      0,
      centerY - 32,
      {
        text: userData.full_name,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER
      },
      image.bitmap.width
    );

    const fileName = `certificate_${userData.id}_${Date.now()}.png`;
    const outputPath = path.join(__dirname, '..', 'temp', fileName);

    if (!fs.existsSync(path.join(__dirname, '..', 'temp'))) {
      fs.mkdirSync(path.join(__dirname, '..', 'temp'));
    }

    await image.writeAsync(outputPath);
    return outputPath;
  } catch (error) {
    console.error('Certificate generation error:', error);
    throw error;
  }
};

module.exports = { generateCertificate };
