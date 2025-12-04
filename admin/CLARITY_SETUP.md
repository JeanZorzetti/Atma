# Microsoft Clarity - Guia de Configuração

## O que é o Microsoft Clarity?

Microsoft Clarity é uma ferramenta gratuita de análise de comportamento do usuário que fornece:
- 🎥 **Gravações de sessões** - Veja como os usuários interagem com seu site
- 🔥 **Mapas de calor** - Visualize onde os usuários clicam e rolam
- 📊 **Insights** - Entenda o comportamento do usuário
- 🚀 **Performance** - 100% gratuito, sem limite de tráfego

## Como obter seu Clarity ID

### Passo 1: Criar uma conta no Clarity
1. Acesse [https://clarity.microsoft.com](https://clarity.microsoft.com)
2. Faça login com sua conta Microsoft (ou crie uma)

### Passo 2: Criar um novo projeto
1. Clique em "Add new project"
2. Preencha:
   - **Name**: Atma Aligner - Admin
   - **Website URL**: https://atmaadmin.roilabs.com.br
3. Clique em "Create"

### Passo 3: Obter o Clarity ID
Após criar o projeto, você verá o código de instalação:

```javascript
<script type="text/javascript">
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "YOUR_CLARITY_ID");
</script>
```

O **YOUR_CLARITY_ID** é o ID que você precisa. Exemplo: `abc123def456`

### Passo 4: Configurar no projeto

1. Abra o arquivo `.env.local` na pasta `admin/`
2. Adicione ou atualize a linha:
   ```
   NEXT_PUBLIC_CLARITY_ID=abc123def456
   ```
   (substitua `abc123def456` pelo seu ID real)

3. Reinicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## Verificar se está funcionando

### Método 1: Console do navegador
1. Abra o site no navegador
2. Abra o DevTools (F12)
3. No console, você deve ver: `Microsoft Clarity initialized with ID: abc123def456`

### Método 2: Dashboard do Clarity
1. Acesse [https://clarity.microsoft.com](https://clarity.microsoft.com)
2. Selecione seu projeto
3. Aguarde alguns minutos
4. Verifique se aparecem novas sessões na dashboard

## Recursos do Clarity

### 1. Gravações de Sessões
- Veja exatamente como os usuários navegam no site
- Identifique onde eles têm dificuldades
- Descubra bugs que você não sabia que existiam

### 2. Mapas de Calor
- **Click Heatmaps**: Onde os usuários clicam mais
- **Scroll Heatmaps**: Até onde os usuários rolam a página
- **Area Heatmaps**: Áreas mais visualizadas

### 3. Insights Automáticos
- **Dead Clicks**: Cliques em elementos não clicáveis
- **Rage Clicks**: Cliques repetitivos (frustração)
- **Quick Backs**: Usuários que voltam rapidamente
- **Excessive Scrolling**: Rolagem excessiva

### 4. Filtros Avançados
- Filtrar por dispositivo (Desktop, Mobile, Tablet)
- Filtrar por país/região
- Filtrar por página específica
- Filtrar por duração da sessão

## Como usar os dados

### Para BI de Conversão
Use o Clarity para entender:
1. **Onde usuários abandonam o funil**
   - Grave sessões de usuários que cancelam
   - Identifique padrões de comportamento

2. **Problemas de UX**
   - Dead clicks em botões importantes
   - Rage clicks em formulários
   - Áreas confusas da interface

3. **Otimização de formulários**
   - Veja quais campos causam mais hesitação
   - Identifique campos que usuários pulam
   - Descubra onde eles desistem

### Para Ortodontistas
1. **Mapa de calor do dashboard**
   - Quais métricas são mais consultadas?
   - Ortodontistas usam os filtros?

2. **Gravações de sessões**
   - Como eles navegam na lista de pacientes?
   - Qual fluxo para agendar consultas?

## Boas Práticas

### ✅ DO:
- Use filtros para focar em páginas específicas
- Assista gravações de usuários que converteram vs que abandonaram
- Configure segmentos personalizados
- Revise insights semanalmente

### ❌ DON'T:
- Não ignore dead clicks (podem indicar UX ruim)
- Não assuma - sempre valide com dados
- Não esqueça de filtrar por dispositivo (mobile vs desktop)

## Privacidade e LGPD

O Clarity **NÃO captura**:
- ❌ Senhas
- ❌ Dados de cartão de crédito
- ❌ Campos marcados como sensíveis

Para ocultar dados sensíveis manualmente, adicione a classe CSS:
```html
<input type="text" class="clarity-mask" />
```

Ou via JavaScript:
```javascript
clarity.set("userConsent", true); // Quando usuário aceitar cookies
```

## Integração com outras ferramentas

### Google Analytics
Clarity pode ser usado em conjunto com GA4:
- Clarity: Como os usuários interagem
- GA4: Quantos usuários, de onde vêm

### Hotjar (alternativa paga)
Clarity é gratuito e similar ao Hotjar:
| Feature | Clarity | Hotjar |
|---------|---------|--------|
| Gravações | ✅ Ilimitado | ⚠️ Limitado no plano grátis |
| Heatmaps | ✅ Sim | ✅ Sim |
| Surveys | ❌ Não | ✅ Sim |
| Feedback | ❌ Não | ✅ Sim |
| Preço | 🎉 Grátis | 💰 $39+/mês |

## Troubleshooting

### Problema: Clarity não aparece na dashboard
**Solução:**
1. Verifique se o CLARITY_ID está correto
2. Aguarde 5-10 minutos (delay de processamento)
3. Limpe o cache do navegador
4. Verifique se não há bloqueador de ads

### Problema: "Clarity ID not configured"
**Solução:**
1. Certifique-se de que `.env.local` tem a variável `NEXT_PUBLIC_CLARITY_ID`
2. Reinicie o servidor: `npm run dev`
3. Verifique se a variável tem o prefixo `NEXT_PUBLIC_`

### Problema: Dados não aparecem em produção
**Solução:**
1. Faça deploy das mudanças
2. Verifique se a variável de ambiente está configurada no Vercel/hosting
3. Acesse o site em produção (não localhost)

## Links Úteis

- 📚 [Documentação Oficial](https://learn.microsoft.com/en-us/clarity/)
- 🎥 [Vídeos Tutorial](https://www.youtube.com/c/MicrosoftClarity)
- 💬 [Suporte](https://clarity.microsoft.com/support)
- 📦 [NPM Package](https://www.npmjs.com/package/@microsoft/clarity)

## Próximos Passos

1. ✅ Criar conta no Clarity
2. ✅ Obter Clarity ID
3. ✅ Configurar `.env.local`
4. ✅ Deploy para produção
5. ⏳ Aguardar primeiras sessões (5-10 min)
6. 📊 Analisar dados e otimizar
7. 🚀 Melhorar conversão baseado em insights

---

**Última atualização:** 03/12/2025
