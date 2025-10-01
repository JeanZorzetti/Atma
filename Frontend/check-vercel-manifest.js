const https = require('https');

console.log('\n🔍 ===== VERCEL MANIFEST CHECK =====\n');

const domain = 'atma.roilabs.com.br';

// Função para fazer request HTTPS
function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve({ status: res.statusCode, data });
        } else {
          resolve({ status: res.statusCode, data: null });
        }
      });
    }).on('error', reject);
  });
}

async function checkVercel() {
  try {
    // 1. Tentar pegar a página de tratamento
    console.log('📄 Fetching /pacientes/tratamento...');
    const pageRes = await httpsGet(`https://${domain}/pacientes/tratamento`);

    if (pageRes.status === 200) {
      console.log('✅ Page loaded successfully');

      // Procurar por referências a chunks no HTML
      const chunkMatches = pageRes.data.match(/_next\/static\/chunks\/[^"'\s]+/g);
      if (chunkMatches) {
        const uniqueChunks = [...new Set(chunkMatches)];
        console.log('\n📦 Chunks referenced in HTML:', uniqueChunks.length);

        const mainRefs = uniqueChunks.filter(c => c.includes('main'));
        const polyfillRefs = uniqueChunks.filter(c => c.includes('polyfill'));

        if (mainRefs.length > 0) {
          console.log('\n🎯 Main chunk references:');
          mainRefs.forEach(ref => {
            const hasHash = /-[a-f0-9]{16,}\.js/.test(ref);
            console.log(`  ${hasHash ? '✅' : '❌'} ${ref}`);
          });
        }

        if (polyfillRefs.length > 0) {
          console.log('\n🎯 Polyfill chunk references:');
          polyfillRefs.forEach(ref => {
            const hasHash = /-[a-f0-9]{16,}\.js/.test(ref);
            console.log(`  ${hasHash ? '✅' : '❌'} ${ref}`);
          });
        }

        // Procurar por buildManifest
        const buildManifestMatch = pageRes.data.match(/_next\/static\/([^/]+)\/_buildManifest\.js/);
        if (buildManifestMatch) {
          const buildId = buildManifestMatch[1];
          console.log('\n🆔 Build ID found in HTML:', buildId);

          // Tentar pegar o buildManifest
          console.log('\n📋 Fetching _buildManifest.js...');
          const manifestUrl = `https://${domain}/_next/static/${buildId}/_buildManifest.js`;
          const manifestRes = await httpsGet(manifestUrl);

          if (manifestRes.status === 200) {
            console.log('✅ _buildManifest.js loaded');

            // Procurar por referências sem hash
            if (manifestRes.data.includes('"main.js"') || manifestRes.data.includes('main.js,')) {
              console.log('⚠️  FOUND: Reference to "main.js" WITHOUT hash!');
            }
            if (manifestRes.data.includes('"polyfills.js"') || manifestRes.data.includes('polyfills.js,')) {
              console.log('⚠️  FOUND: Reference to "polyfills.js" WITHOUT hash!');
            }

            console.log('\n📄 Manifest preview (first 300 chars):');
            console.log(manifestRes.data.substring(0, 300));
          } else {
            console.log(`❌ Failed to load _buildManifest.js: ${manifestRes.status}`);
          }
        }
      }
    } else {
      console.log(`❌ Failed to load page: ${pageRes.status}`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkVercel();

console.log('\n🔍 ===== END CHECK =====\n');
