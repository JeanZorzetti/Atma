const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputImage = path.join(__dirname, '../public/assets/images/quiz/image.png');
const outputDir = path.join(__dirname, '../public/images/quiz');

// Criar diretório se não existir
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Definir as regiões de corte para cada ícone (baseado na grid 4x2)
// Imagem real: 997x353 pixels, grid 4x2
const cardWidth = 249;  // 997 / 4 ≈ 249
const cardHeight = 176; // 353 / 2 ≈ 176

const icons = [
  // Linha 1
  { name: 'sobremordida', label: 'Sobremordida', left: 0, top: 0, width: cardWidth, height: cardHeight },
  { name: 'prognatismo', label: 'Prognatismo', left: cardWidth, top: 0, width: cardWidth, height: cardHeight },
  { name: 'mordida-cruzada', label: 'Mordida Cruzada', left: cardWidth * 2, top: 0, width: cardWidth, height: cardHeight },
  { name: 'diastema', label: 'Diastema', left: cardWidth * 3, top: 0, width: cardWidth, height: cardHeight },
  // Linha 2
  { name: 'mordida-aberta', label: 'Mordida Aberta', left: 0, top: cardHeight, width: cardWidth, height: cardHeight },
  { name: 'dentes-apinhados', label: 'Dentes Apinhados', left: cardWidth, top: cardHeight, width: cardWidth, height: cardHeight },
  { name: 'alinhamento-geral', label: 'Alinhamento dos Dentes', left: cardWidth * 2, top: cardHeight, width: cardWidth, height: cardHeight },
  { name: 'denticao-mista', label: 'Dentição Mista', left: cardWidth * 3, top: cardHeight, width: cardWidth - 1, height: cardHeight - 1 },
];

async function cropIcons() {
  console.log('📸 Iniciando recorte dos ícones dentais...\n');

  for (const icon of icons) {
    try {
      const outputPath = path.join(outputDir, `${icon.name}.png`);

      await sharp(inputImage)
        .extract({
          left: icon.left,
          top: icon.top,
          width: icon.width,
          height: icon.height
        })
        .toFile(outputPath);

      console.log(`✅ ${icon.label}: ${icon.name}.png`);
    } catch (error) {
      console.error(`❌ Erro ao recortar ${icon.label}:`, error.message);
    }
  }

  console.log('\n🎉 Recorte concluído! Imagens salvas em:', outputDir);
}

cropIcons();
