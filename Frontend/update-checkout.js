const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app/infoproduto/relatorio-viabilidade/checkout/page.tsx');

let content = fs.readFileSync(filePath, 'utf8');

// Substituir o bloco de código
const oldCode = `      if (data.success) {
        // Em produção, redirecionar para URL do Mercado Pago
        // window.location.href = data.checkoutUrl

        // Por enquanto, simular sucesso e ir para página de sucesso
        router.push('/infoproduto/relatorio-viabilidade/sucesso')
      } else {
        alert('Erro ao processar pagamento. Tente novamente.')
      }`;

const newCode = `      if (data.success && data.checkoutUrl) {
        // Redirecionar para Checkout Pro do Mercado Pago
        console.log('✅ Redirecionando para Mercado Pago:', data.preferenceId)
        window.location.href = data.checkoutUrl
      } else {
        console.error('❌ Erro:', data)
        alert('Erro ao processar pagamento. Tente novamente.')
      }`;

content = content.replace(oldCode, newCode);

fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Arquivo atualizado com sucesso!');
