# Logos e Assets Visuais

Esta pasta contém todas as variações de logo e assets visuais do projeto.

## Estrutura de Pastas

### `/atma/`
Logos relacionados ao produto Atma Aligner:
- Logo principal
- Logo horizontal
- Logo vertical
- Logo marca (sem texto)
- Variações dark/light

### `/roi-labs/`
Logos da empresa ROI Labs:
- Logo principal
- Logo horizontal
- Logo vertical
- Logo marca (sem texto)
- Variações dark/light

### `/icons/`
Ícones e elementos gráficos:
- Favicons
- Ícones de aplicativo
- Elementos de interface

## Formatos Recomendados

### Logos Principais
- **SVG**: Para máxima qualidade e escalabilidade
- **PNG**: Para compatibilidade (fundos transparentes)
- **JPG**: Para fundos sólidos quando necessário

### Tamanhos Sugeridos
- **Logo horizontal**: 200px altura (manter proporção)
- **Logo vertical**: 150px largura (manter proporção)
- **Logo marca**: 64x64px, 128x128px, 256x256px
- **Favicon**: 16x16px, 32x32px, 48x48px

## Nomenclatura Sugerida

```
atma/
├── atma-logo-horizontal.svg
├── atma-logo-horizontal-dark.svg
├── atma-logo-horizontal-light.svg
├── atma-logo-vertical.svg
├── atma-logo-vertical-dark.svg
├── atma-logo-vertical-light.svg
├── atma-marca.svg
└── atma-marca-dark.svg

roi-labs/
├── roi-labs-logo-horizontal.svg
├── roi-labs-logo-horizontal-dark.svg
├── roi-labs-logo-horizontal-light.svg
├── roi-labs-logo-vertical.svg
└── roi-labs-marca.svg

icons/
├── favicon.ico
├── favicon-16x16.png
├── favicon-32x32.png
├── apple-touch-icon.png
└── android-chrome-192x192.png
```

## Como Usar no Código

```jsx
// Importar logo SVG
import AtmaLogo from '/assets/logos/atma/atma-logo-horizontal.svg'

// Usar como imagem
<img src="/assets/logos/atma/atma-logo-horizontal.svg" alt="Atma Logo" />

// Com Next.js Image
import Image from 'next/image'
<Image src="/assets/logos/atma/atma-logo-horizontal.svg" alt="Atma Logo" width={200} height={50} />
```