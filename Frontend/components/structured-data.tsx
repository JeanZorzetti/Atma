export function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "name": "Atma Aligner",
    "description": "Alinhadores invisíveis premium e acessíveis com tecnologia 3D avançada",
    "url": "https://atma.roilabs.com.br",
    "logo": {
      "@type": "ImageObject",
      "url": "https://atma.roilabs.com.br/logo.png"
    },
    "image": {
      "@type": "ImageObject",
      "url": "https://atma.roilabs.com.br/og-image.jpg"
    },
    "telephone": "+55-47-9200-0924",
    "email": "atma.aligner@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Passo Fundo",
      "addressRegion": "RS",
      "addressCountry": "BR"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Brasil"
    },
    "medicalSpecialty": "Orthodontics",
    "sameAs": [
      "https://www.facebook.com/people/Atma-Aligner/61581147385394/",
      "https://www.instagram.com/atma.aligner/",
      "https://www.linkedin.com/company/atma-aligner/"
    ],
    "founder": {
      "@type": "Organization",
      "name": "ROI Labs"
    },
    "foundingDate": "2024-01-01"
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Atma Aligner",
    "url": "https://atma.roilabs.com.br",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://atma.roilabs.com.br/blog?search={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Atma Aligner"
    }
  }

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    "name": "Alinhadores Invisíveis",
    "description": "Tratamento ortodôntico com alinhadores transparentes personalizados usando tecnologia 3D",
    "procedureType": "Orthodontic Treatment",
    "bodyLocation": {
      "@type": "AnatomicalStructure",
      "name": "Dentes"
    },
    "preparation": "Consulta inicial, scan 3D dos dentes e planejamento digital",
    "followup": "Consultas de acompanhamento a cada 4-6 semanas"
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "O que são alinhadores invisíveis?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Alinhadores invisíveis são aparelhos ortodônticos transparentes e removíveis que corrigem a posição dos dentes gradualmente. São feitos sob medida usando tecnologia 3D."
        }
      },
      {
        "@type": "Question",
        "name": "Quanto tempo dura o tratamento com alinhadores?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "O tratamento varia de 6 a 24 meses, dependendo da complexidade do caso. A maioria dos pacientes vê resultados em 3-6 meses."
        }
      },
      {
        "@type": "Question",
        "name": "Os alinhadores são realmente invisíveis?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim, os alinhadores são praticamente invisíveis quando usados. São feitos de material transparente de alta qualidade que se adapta perfeitamente aos dentes."
        }
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  )
}