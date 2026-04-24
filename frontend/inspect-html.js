const fs = require('fs');
const path = require('path');

console.log('\n🔍 ===== HTML INSPECTION =====\n');

// Verificar se existe HTML gerado no .next/server
const serverPagesDir = path.join(__dirname, '.next', 'server', 'app');

function findHtmlFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;

  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findHtmlFiles(filePath, fileList);
    } else if (file.endsWith('.html') || file.endsWith('.rsc')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

const htmlFiles = findHtmlFiles(serverPagesDir);

console.log('📄 Found HTML/RSC files:', htmlFiles.length);

if (htmlFiles.length > 0) {
  // Pegar o primeiro arquivo para inspecionar
  const sampleFile = htmlFiles[0];
  console.log('\n📋 Sample file:', sampleFile.replace(__dirname, ''));

  const content = fs.readFileSync(sampleFile, 'utf-8');

  // Procurar por referências a chunks
  const mainJsMatches = content.match(/_next\/static\/chunks\/main[^"']*/g);
  const polyfillMatches = content.match(/_next\/static\/chunks\/polyfill[^"']*/g);
  const chunkMatches = content.match(/_next\/static\/chunks\/[^"'\s]*/g);

  if (mainJsMatches) {
    console.log('\n🎯 Main.js references:', [...new Set(mainJsMatches)]);
  } else {
    console.log('\n❌ No main.js references found');
  }

  if (polyfillMatches) {
    console.log('🎯 Polyfill references:', [...new Set(polyfillMatches)]);
  } else {
    console.log('❌ No polyfill references found');
  }

  if (chunkMatches) {
    console.log('\n📦 All chunk references (first 10):');
    [...new Set(chunkMatches)].slice(0, 10).forEach(chunk => {
      const hasHash = /-[a-f0-9]{16,}\.js/.test(chunk);
      console.log(`  ${hasHash ? '✅' : '❌'} ${chunk}`);
    });
  }
}

// Verificar _buildManifest.js
const buildId = fs.readFileSync(path.join(__dirname, '.next', 'BUILD_ID'), 'utf-8').trim();
const buildManifestPath = path.join(__dirname, '.next', 'static', buildId, '_buildManifest.js');

if (fs.existsSync(buildManifestPath)) {
  console.log('\n📋 _buildManifest.js location:', buildManifestPath.replace(__dirname, ''));
  const manifestContent = fs.readFileSync(buildManifestPath, 'utf-8');

  // Procurar referências a main e polyfills
  if (manifestContent.includes('main.js"') || manifestContent.includes('main.js,')) {
    console.log('⚠️  Found reference to "main.js" WITHOUT hash in manifest!');
  }

  if (manifestContent.includes('polyfills.js"') || manifestContent.includes('polyfills.js,')) {
    console.log('⚠️  Found reference to "polyfills.js" WITHOUT hash in manifest!');
  }

  // Mostrar as primeiras 500 caracteres do manifest
  console.log('\n📄 Manifest content (first 500 chars):');
  console.log(manifestContent.substring(0, 500));
} else {
  console.log('\n❌ _buildManifest.js not found at expected location');
}

console.log('\n🔍 ===== END INSPECTION =====\n');
