const https = require('https');
const fs = require('fs');

console.log('\n🔍 ===== VERCEL HTML ANALYSIS =====\n');

const domain = 'atma.roilabs.com.br';

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data, headers: res.headers }));
    }).on('error', reject);
  });
}

async function analyze() {
  try {
    console.log('📄 Fetching homepage...');
    const homeRes = await httpsGet(`https://${domain}/`);

    if (homeRes.status === 200) {
      console.log('✅ Homepage loaded:', homeRes.status);

      // Salvar HTML para análise
      fs.writeFileSync('vercel-homepage.html', homeRes.data);
      console.log('💾 Saved to vercel-homepage.html');

      // Procurar por scripts
      const scriptMatches = homeRes.data.match(/<script[^>]*src="([^"]+)"[^>]*>/g);
      if (scriptMatches) {
        console.log('\n📦 Script tags found:', scriptMatches.length);

        scriptMatches.slice(0, 15).forEach((tag, i) => {
          const srcMatch = tag.match(/src="([^"]+)"/);
          if (srcMatch) {
            const src = srcMatch[1];
            const hasHash = /-[a-f0-9]{16,}\.js/.test(src);
            console.log(`  ${i + 1}. ${hasHash ? '✅' : '❌'} ${src}`);
          }
        });
      }

      // Procurar especificamente por main.js e polyfills.js
      const hasMainWithoutHash = /src="[^"]*\/main\.js"/.test(homeRes.data);
      const hasPolyfillsWithoutHash = /src="[^"]*\/polyfills\.js"/.test(homeRes.data);

      console.log('\n🔍 References WITHOUT hash:');
      console.log('  main.js:', hasMainWithoutHash ? '❌ FOUND' : '✅ Not found');
      console.log('  polyfills.js:', hasPolyfillsWithoutHash ? '❌ FOUND' : '✅ Not found');

      // Procurar por __NEXT_DATA__
      const nextDataMatch = homeRes.data.match(/<script id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/s);
      if (nextDataMatch) {
        try {
          const nextData = JSON.parse(nextDataMatch[1]);
          console.log('\n📊 __NEXT_DATA__:');
          console.log('  buildId:', nextData.buildId);
          console.log('  page:', nextData.page);
        } catch (e) {
          console.log('\n⚠️  Could not parse __NEXT_DATA__');
        }
      }

      // Procurar por _buildManifest
      const buildManifestMatch = homeRes.data.match(/_next\/static\/([^/]+)\/_buildManifest\.js/);
      if (buildManifestMatch) {
        const buildId = buildManifestMatch[1];
        console.log('\n🆔 Build ID from manifest URL:', buildId);

        // Tentar buscar o manifest
        console.log('\n📋 Fetching _buildManifest.js...');
        const manifestRes = await httpsGet(`https://${domain}/_next/static/${buildId}/_buildManifest.js`);

        if (manifestRes.status === 200) {
          console.log('✅ Manifest loaded');
          fs.writeFileSync('vercel-buildManifest.js', manifestRes.data);
          console.log('💾 Saved to vercel-buildManifest.js');

          // Extrair informações do manifest
          const hasMainJsRef = manifestRes.data.includes('"main.js"');
          const hasPolyfillsJsRef = manifestRes.data.includes('"polyfills.js"');

          console.log('\n⚠️  Manifest contains references:');
          console.log('  "main.js":', hasMainJsRef ? '❌ YES (PROBLEM!)' : '✅ No');
          console.log('  "polyfills.js":', hasPolyfillsJsRef ? '❌ YES (PROBLEM!)' : '✅ No');
        } else {
          console.log('❌ Failed to load manifest:', manifestRes.status);
        }
      }

    } else {
      console.log('❌ Failed to load homepage:', homeRes.status);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

analyze().then(() => {
  console.log('\n🔍 ===== END ANALYSIS =====\n');
});
