export function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "name": "Atma Aligner",
    "alternateName": "Atma",
    "description": "Alinhadores invisíveis premium com tecnologia alemã. Certificações ISO 13485, CE e ANVISA. Preços até 50% menores que concorrentes internacionais.",
    "url": "https://atma.roilabs.com.br",
    "logo": {
      "@type": "ImageObject",
      "url": "https://atma.roilabs.com.br/logo.png",
      "width": "200",
      "height": "60"
    },
    "image": {
      "@type": "ImageObject",
      "url": "https://atma.roilabs.com.br/og-image.jpg",
      "width": "1200",
      "height": "630"
    },
    "telephone": "+55-47-9200-0924",
    "email": "atma.aligner@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Rua Independência, 502",
      "addressLocality": "Passo Fundo",
      "addressRegion": "RS",
      "postalCode": "99010-040",
      "addressCountry": "BR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "-28.2620",
      "longitude": "-52.4080"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Brasil"
    },
    "priceRange": "R$ 3.990 - R$ 8.990",
    "currenciesAccepted": "BRL",
    "paymentAccepted": "Cartão de Crédito, PIX, Boleto, Financiamento",
    "openingHours": "Mo-Fr 09:00-18:00",
    "medicalSpecialty": {
      "@type": "MedicalSpecialty",
      "@id": "https://schema.org/Dentistry"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "5000",
      "bestRating": "5",
      "worstRating": "1"
    },
    "slogan": "Tecnologia Alemã, Preço Brasileiro",
    "knowsAbout": [
      "Alinhadores Invisíveis",
      "Ortodontia Digital",
      "Planejamento 3D",
      "Tecnologia PETG Alemã",
      "Certificação ISO 13485"
    ],
    "sameAs": [
      "https://www.facebook.com/people/Atma-Aligner/61581147385394/",
      "https://www.instagram.com/atma.aligner/",
      "https://www.linkedin.com/company/atma-aligner/"
    ],
    "founder": {
      "@type": "Organization",
      "name": "ROI Labs"
    },
    "foundingDate": "2024-01-01",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Alinhadores Invisíveis",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Alinhador Invisível - Casos Simples",
            "description": "Até 20 alinhadores para casos leves"
          },
          "price": "3990",
          "priceCurrency": "BRL"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Alinhador Invisível - Casos Moderados",
            "description": "21-35 alinhadores para casos moderados"
          },
          "price": "5990",
          "priceCurrency": "BRL"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Alinhador Invisível - Casos Complexos",
            "description": "Mais de 35 alinhadores para casos complexos"
          },
          "price": "8990",
          "priceCurrency": "BRL"
        }
      ]
    }
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Atma Aligner - Alinhadores Invisíveis com Tecnologia Alemã",
    "alternateName": "Atma",
    "url": "https://atma.roilabs.com.br",
    "description": "Alinhadores invisíveis premium com tecnologia alemã. Certificado ISO 13485. Preços a partir de R$ 3.990. Atendemos todo Brasil.",
    "inLanguage": "pt-BR",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://atma.roilabs.com.br/blog?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Atma Aligner",
      "logo": {
        "@type": "ImageObject",
        "url": "https://atma.roilabs.com.br/logo.png"
      }
    },
    "copyrightYear": "2024",
    "copyrightHolder": {
      "@type": "Organization",
      "name": "Atma Aligner"
    }
  }

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    "name": "Tratamento com Alinhadores Invisíveis Atma",
    "alternateName": ["Alinhadores Transparentes", "Ortodontia Invisível", "Aparelho Invisível"],
    "description": "Tratamento ortodôntico não-invasivo com alinhadores transparentes personalizados fabricados com PETG alemão de grau médico usando tecnologia de escaneamento 3D e planejamento com inteligência artificial.",
    "procedureType": {
      "@type": "MedicalProcedureType",
      "@id": "https://schema.org/NoninvasiveProcedure"
    },
    "bodyLocation": "Dentes, gengivas e estruturas bucais",
    "preparation": "Consulta inicial gratuita, escaneamento intraoral 3D digital (sem massa), análise ortodôntica completa e planejamento digital com simulação 3D do resultado final",
    "howPerformed": "Alinhadores removíveis transparentes trocados a cada 7-14 dias, uso de 20-22 horas por dia, sem restrições alimentares, higiene normal mantida",
    "followup": "Consultas de acompanhamento presenciais ou online a cada 4-6 semanas para monitoramento do progresso e entrega de novos alinhadores",
    "expectedPrognosis": "Taxa de sucesso de 96.8% em casos tratáveis com alinhadores. Tempo médio de tratamento: 6-18 meses dependendo da complexidade",
    "risks": "Desconforto leve nos primeiros dias de cada alinhador novo, possível necessidade de refinamentos adicionais em 15-20% dos casos",
    "typicalTest": "Radiografias panorâmicas e periapicais, fotografias intra e extraorais, escaneamento 3D digital",
    "contraindication": "Periodontite severa não tratada, doença óssea ativa, problemas de mordida severos que requerem cirurgia ortognática"
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