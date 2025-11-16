# 📸 Checklist de Assets Necessários para Nova Homepage

## ✅ Status: Aguardando Coleta de Fotos Reais

---

## 📂 Estrutura de Pastas Criada

```
public/assets/
├── images/
│   ├── patients/          → Fotos de pacientes reais
│   ├── products/          → Fotos dos alinhadores e produtos
│   ├── technology/        → Fotos de tecnologia (scanner, PETG, etc)
│   └── testimonials/      → Antes/depois de pacientes
```

---

## 🎯 Assets Prioritários (Homepage)

### 1. Hero Section (Página Principal)
**Local:** `/placeholder-patient-smiling.jpg`
- ✅ **Descrição:** Paciente real feliz usando/mostrando alinhador
- ✅ **Resolução:** Mínimo 600x700px (portrait)
- ✅ **Formato:** WebP ou AVIF (otimizado)
- ✅ **Autorização:** Termo de uso de imagem assinado
- ✅ **Destino:** `/assets/images/patients/hero-patient-smiling.webp`

### 2. Carrossel de Etapas (3 imagens)

#### Etapa 1: Escaneamento 3D
**Local:** `/placeholder-scan.jpg`
- ✅ **Descrição:** Foto do scanner intraoral em uso (ou closeup do scanner)
- ✅ **Resolução:** 800x600px (landscape)
- ✅ **Destino:** `/assets/images/technology/scanner-3d-intraoral.webp`

#### Etapa 2: Alinhadores no Estojo
**Local:** `/placeholder-aligners.jpg`
- ✅ **Descrição:** Alinhadores Atma no estojo oficial com logo
- ✅ **Resolução:** 800x600px (landscape)
- ✅ **Destino:** `/assets/images/products/aligners-case-kit.webp`

#### Etapa 3: Antes/Depois
**Local:** `/placeholder-result.jpg`
- ✅ **Descrição:** Comparação lado a lado (antes → depois) de paciente real
- ✅ **Resolução:** 800x600px
- ✅ **Autorização:** Termo assinado
- ✅ **Destino:** `/assets/images/testimonials/before-after-1.webp`

### 3. Seção de Social Proof (3 cards)
**Locais:** Atualmente placeholders (divs vazios)
- ✅ **Descrição:** 3 fotos de antes/depois autorizadas
- ✅ **Resolução:** 400x400px (quadradas)
- ✅ **Nomes:** Ana Carolina (28), Pedro Silva (34), Juliana Santos (42)
- ✅ **Destino:** `/assets/images/testimonials/before-after-[2-4].webp`

### 4. Tecnologia PETG
**Local:** `/placeholder-technology.jpg`
- ✅ **Descrição:** Material PETG + certificados ISO/CE/ANVISA
- ✅ **Resolução:** 600x400px (landscape)
- ✅ **Sugestão:** Foto do rolo de PETG ou close dos alinhadores + certificados impressos
- ✅ **Destino:** `/assets/images/technology/petg-certifications.webp`

---

## 🎯 Assets Secundários (Páginas Internas)

### Página: /pacientes/criancas
**Local:** `/placeholder-child-smiling.jpg`
- ✅ **Descrição:** Criança (6-12 anos) sorrindo com ou sem alinhador
- ✅ **Resolução:** 600x700px
- ✅ **Destino:** `/assets/images/patients/child-smiling.webp`

**Local:** `/placeholder-child-brushing.jpg`
- ✅ **Descrição:** Criança escovando os dentes (mostrando higiene)
- ✅ **Resolução:** 600x600px
- ✅ **Destino:** `/assets/images/patients/child-brushing.webp`

### Página: /pacientes/adolescentes
**Local:** `/placeholder-teen-smiling.jpg`
- ✅ **Descrição:** Adolescente (13-17 anos) sorrindo naturalmente
- ✅ **Resolução:** 600x700px
- ✅ **Destino:** `/assets/images/patients/teen-smiling.webp`

### Página: /pacientes/adultos
**Local:** `/placeholder-adult-professional.jpg`
- ✅ **Descrição:** Adulto profissional (18+) em ambiente de trabalho ou formal
- ✅ **Resolução:** 600x700px
- ✅ **Destino:** `/assets/images/patients/adult-professional.webp`

### Página: /tecnologia
**Local:** `/placeholder-petg-material.jpg`
- ✅ **Descrição:** Close do material PETG ou alinhadores sendo fabricados
- ✅ **Resolução:** 600x600px
- ✅ **Destino:** `/assets/images/technology/petg-material-closeup.webp`

---

## 📋 Requisitos Técnicos

### Formatos Aceitos
- ✅ **Primeira escolha:** WebP (melhor compressão, suporte amplo)
- ✅ **Segunda escolha:** AVIF (compressão superior, menos suporte)
- ⚠️ **Evitar:** JPG/PNG (tamanhos maiores)

### Otimização
- ✅ **Compressão:** 80-85% de qualidade
- ✅ **Tamanho máximo:** 200KB por imagem
- ✅ **Responsivo:** Criar versões @1x, @2x, @3x se necessário

### Ferramentas Recomendadas
```bash
# Converter JPG → WebP
npx sharp -i input.jpg -o output.webp -q 85

# Ou usar imagemagick
convert input.jpg -quality 85 output.webp
```

---

## ⚖️ Requisitos Legais (LGPD)

### Termo de Autorização de Uso de Imagem
Cada foto de paciente deve ter:

```
TERMO DE AUTORIZAÇÃO DE USO DE IMAGEM

Eu, [NOME COMPLETO], CPF [XXX.XXX.XXX-XX], autorizo a
Atma Aligner a utilizar minha imagem (fotografia) para
fins de divulgação em:

[X] Website institucional
[X] Redes sociais
[X] Materiais de marketing

Esta autorização é gratuita e por prazo indeterminado.

Data: ___/___/______
Assinatura: _______________________
```

### Dados Sensíveis
- ✅ **Não mostrar:** RG, CPF, endereço completo
- ✅ **Permitido:** Primeiro nome, idade, cidade (ex: "Ana, 28 anos - São Paulo")
- ✅ **Anonimizar** se solicitado pelo paciente

---

## 🎨 Diretrizes de Estilo Fotográfico

### Iluminação
- ✅ Luz natural ou luz branca suave
- ❌ Evitar flash direto (cria sombras duras)
- ✅ Fundo neutro ou levemente desfocado

### Composição
- ✅ Sorrisos naturais (não forçados)
- ✅ Olhar para câmera ou levemente desviado
- ✅ Enquadramento do peito para cima (portrait)

### Diversidade
- ✅ Incluir diferentes idades (crianças, adolescentes, adultos)
- ✅ Incluir diferentes etnias
- ✅ Incluir homens e mulheres

---

## 📊 Priorização de Coleta

### Prioridade 1 (Crítico - Bloqueia lançamento)
1. `/placeholder-patient-smiling.jpg` → Hero da homepage
2. `/placeholder-scan.jpg` → Scanner 3D
3. `/placeholder-aligners.jpg` → Produto no estojo
4. `/placeholder-result.jpg` → Antes/depois principal

### Prioridade 2 (Importante - Lançar com placeholders temporários OK)
5. 3 fotos de antes/depois para social proof
6. `/placeholder-technology.jpg` → Material PETG

### Prioridade 3 (Pode usar stock photos temporariamente)
7. Fotos de crianças/adolescentes/adultos para páginas internas
8. Fotos de tecnologia/fabricação

---

## 🔄 Próximos Passos

1. **Sessão de Fotos:**
   - Agendar com 3-5 pacientes que concluíram tratamento
   - Coletar termos de autorização assinados
   - Fotografar produtos (alinhadores, estojo, scanner)

2. **Otimização:**
   ```bash
   cd Frontend/public/assets/images
   # Converter todas as fotos para WebP
   for img in *.jpg; do npx sharp -i "$img" -o "${img%.jpg}.webp" -q 85; done
   ```

3. **Substituir Placeholders:**
   - Atualizar caminhos em `page.tsx`
   - Testar carregamento e responsividade
   - Validar alt texts para SEO

4. **Deploy:**
   - Commit assets otimizados
   - Deploy em staging
   - Lighthouse audit (target: 90+ performance)
   - Deploy em produção

---

**Última atualização:** 2025-01-16
**Responsável:** Equipe Atma
**Status:** ⏳ Aguardando coleta de fotos reais
