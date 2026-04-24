const fs = require('fs');
const path = require('path');

console.log('\n🔍 ===== NEXT.JS BUILD DEBUG =====\n');

// 1. Verificar BUILD_ID
const buildIdPath = path.join(__dirname, '.next', 'BUILD_ID');
if (fs.existsSync(buildIdPath)) {
  const buildId = fs.readFileSync(buildIdPath, 'utf-8').trim();
  console.log('✅ BUILD_ID:', buildId);
} else {
  console.log('❌ BUILD_ID not found');
}

// 2. Verificar build-manifest.json
const buildManifestPath = path.join(__dirname, '.next', 'build-manifest.json');
if (fs.existsSync(buildManifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(buildManifestPath, 'utf-8'));
  console.log('\n📦 Build Manifest Keys:', Object.keys(manifest));

  if (manifest.polyfillFiles) {
    console.log('\n🔧 Polyfill Files:', manifest.polyfillFiles);
  }

  if (manifest.devFiles) {
    console.log('🔧 Dev Files:', manifest.devFiles);
  }

  if (manifest.ampDevFiles) {
    console.log('🔧 AMP Dev Files:', manifest.ampDevFiles);
  }

  if (manifest.lowPriorityFiles) {
    console.log('🔧 Low Priority Files:', manifest.lowPriorityFiles);
  }

  if (manifest.rootMainFiles) {
    console.log('🔧 Root Main Files:', manifest.rootMainFiles);
  }

  if (manifest.pages) {
    console.log('\n📄 Pages in manifest:', Object.keys(manifest.pages));
  }
} else {
  console.log('❌ build-manifest.json not found');
}

// 3. Listar todos os chunks gerados
const chunksDir = path.join(__dirname, '.next', 'static', 'chunks');
if (fs.existsSync(chunksDir)) {
  const chunks = fs.readdirSync(chunksDir);

  console.log('\n📁 Total chunks:', chunks.length);

  const mainChunks = chunks.filter(f => f.includes('main'));
  const polyfillChunks = chunks.filter(f => f.includes('polyfill'));

  console.log('\n🎯 Main chunks:', mainChunks.length);
  mainChunks.forEach(chunk => console.log('  -', chunk));

  console.log('\n🎯 Polyfill chunks:', polyfillChunks.length);
  polyfillChunks.forEach(chunk => console.log('  -', chunk));

  // Procurar por chunks sem hash
  const chunksWithoutHash = chunks.filter(f => !/-[a-f0-9]{16,}\.js$/.test(f) && f.endsWith('.js'));
  if (chunksWithoutHash.length > 0) {
    console.log('\n⚠️  Chunks WITHOUT hash:');
    chunksWithoutHash.forEach(chunk => console.log('  -', chunk));
  }
} else {
  console.log('❌ chunks directory not found');
}

// 4. Verificar app-build-manifest.json (App Router)
const appBuildManifestPath = path.join(__dirname, '.next', 'app-build-manifest.json');
if (fs.existsSync(appBuildManifestPath)) {
  const appManifest = JSON.parse(fs.readFileSync(appBuildManifestPath, 'utf-8'));
  console.log('\n📱 App Build Manifest Keys:', Object.keys(appManifest));

  if (appManifest.pages) {
    console.log('📄 App Router Pages:', Object.keys(appManifest.pages).slice(0, 10));
  }
} else {
  console.log('\n❌ app-build-manifest.json not found');
}

// 5. Verificar required-server-files.json
const requiredFilesPath = path.join(__dirname, '.next', 'required-server-files.json');
if (fs.existsSync(requiredFilesPath)) {
  const required = JSON.parse(fs.readFileSync(requiredFilesPath, 'utf-8'));
  console.log('\n🗂️  Required Server Files config:', Object.keys(required.config || {}));
} else {
  console.log('\n❌ required-server-files.json not found');
}

console.log('\n🔍 ===== END DEBUG =====\n');
