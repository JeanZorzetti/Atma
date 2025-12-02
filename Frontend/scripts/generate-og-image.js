const sharp = require('sharp');
const path = require('path');

async function generateOGImage() {
  const width = 1200;
  const height = 630;

  // Criar fundo gradiente roxo (cor da marca Atma)
  const background = Buffer.from(
    `<svg width="${width}" height="${height}">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#7c3aed;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#5b21b6;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#grad)"/>
    </svg>`
  );

  const logo = await sharp(path.join(__dirname, '../public/atma-logo-512x512.png'))
    .resize(400, 400, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  await sharp(background)
    .composite([
      {
        input: logo,
        gravity: 'center'
      }
    ])
    .png()
    .toFile(path.join(__dirname, '../public/og-image.png'));

  console.log('✅ Imagem Open Graph gerada com sucesso: public/og-image.png');
}

generateOGImage().catch(console.error);
