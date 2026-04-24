const fs = require('fs');
const path = require('path');

// Script para criar logo quadrada 512x512px usando Canvas API
async function createSquareLogo() {
  try {
    // Tenta usar sharp (mais rápido e eficiente)
    const sharp = require('sharp');

    const inputPath = path.join(__dirname, '../public/assets/logos/atma/Atma.png');
    const outputPath512 = path.join(__dirname, '../public/atma-logo-512x512.png');
    const outputPath192 = path.join(__dirname, '../public/atma-logo-192x192.png');

    console.log('📦 Criando logos quadradas para SEO...');

    // Criar versão 512x512 (Google Search)
    await sharp(inputPath)
      .resize(512, 512, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(outputPath512);

    console.log('✅ Logo 512x512 criada:', outputPath512);

    // Criar versão 192x192 (PWA)
    await sharp(inputPath)
      .resize(192, 192, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(outputPath192);

    console.log('✅ Logo 192x192 criada:', outputPath192);

    console.log('\n✨ Logos otimizadas criadas com sucesso!');
    console.log('📌 Use atma-logo-512x512.png no Schema.org para Google Search');

  } catch (error) {
    console.error('❌ Erro ao criar logos:', error.message);
    console.log('\n💡 Solução: Execute "npm install sharp" no diretório Frontend');
  }
}

createSquareLogo();
