/**
 * EXEMPLOS DE CÓDIGO PARA HOMEPAGE REDESIGN
 * Copiar e adaptar conforme necessário
 */

// ============================================
// 1. HERO SECTION COM VÍDEO DE FUNDO
// ============================================

export function VideoHeroSection() {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Vídeo de Fundo */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        poster="/images/hero-poster.jpg" // Imagem enquanto carrega
      >
        <source src="/videos/hero-background.webm" type="video/webm" />
        <source src="/videos/hero-background.mp4" type="video/mp4" />
      </video>

      {/* Overlay Gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-purple-900/60 to-transparent" />

      {/* Conteúdo */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Transforme Seu Sorriso
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Sem Sair de Casa
          </span>
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Alinhadores invisíveis a partir de <strong>R$ 99/mês</strong>
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button size="lg" className="text-lg px-8 py-6">
            Sou Paciente
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-white/10 backdrop-blur">
            Sou Ortodontista
          </Button>
        </motion.div>

        {/* Trust Badge */}
        <motion.div
          className="mt-8 flex items-center justify-center gap-2 text-yellow-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Star className="w-5 h-5 fill-current" />
          <Star className="w-5 h-5 fill-current" />
          <Star className="w-5 h-5 fill-current" />
          <Star className="w-5 h-5 fill-current" />
          <Star className="w-5 h-5 fill-current" />
          <span className="ml-2 text-white">4,9/5 (5.000+ avaliações)</span>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <ChevronDown className="w-8 h-8 text-white/60" />
      </motion.div>
    </section>
  )
}

// ============================================
// 2. TRUST BADGES SECTION
// ============================================

export function TrustBadgesSection() {
  const stats = [
    { value: "5.000+", label: "Sorrisos Transformados", icon: Users },
    { value: "4.9★", label: "Satisfação dos Pacientes", icon: Star },
    { value: "ISO 13485", label: "Certificação Internacional", icon: Award },
    { value: "-50%", label: "vs. Importados", icon: TrendingDown },
  ]

  return (
    <section className="py-12 bg-white/80 backdrop-blur-sm border-y border-slate-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <stat.icon className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-slate-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================
// 3. PARALLAX IMAGE SECTION
// ============================================

export function ParallaxSection() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 1000], [0, 300])
  const opacity = useTransform(scrollY, [0, 500, 1000], [1, 0.8, 0.5])

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background com Parallax */}
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 -z-10"
      >
        <Image
          src="/images/dental-lab-background.jpg"
          alt="Laboratório Atma"
          fill
          className="object-cover"
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900/80" />
      </motion.div>

      {/* Conteúdo */}
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Tecnologia Alemã de Ponta
          </h2>
          <p className="text-xl mb-8">
            Fabricados com PETG de grau médico, nossos alinhadores passam por
            rigoroso controle de qualidade ISO 13485.
          </p>
          <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur">
            Conheça Nossa Tecnologia
          </Button>
        </div>
      </div>
    </section>
  )
}

// ============================================
// 4. BEFORE/AFTER GALLERY
// ============================================

export function BeforeAfterGallery() {
  const cases = [
    {
      before: "/images/casos/antes-1.jpg",
      after: "/images/casos/depois-1.jpg",
      name: "Maria, 28 anos",
      treatment: "12 meses",
    },
    {
      before: "/images/casos/antes-2.jpg",
      after: "/images/casos/depois-2.jpg",
      name: "João, 35 anos",
      treatment: "8 meses",
    },
    {
      before: "/images/casos/antes-3.jpg",
      after: "/images/casos/depois-3.jpg",
      name: "Ana, 42 anos",
      treatment: "10 meses",
    },
    // ... mais casos
  ]

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">
          Resultados Comprovados
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cases.map((caso, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Before/After Slider */}
              <div className="relative h-64">
                <ReactCompareSlider
                  itemOne={
                    <ReactCompareSliderImage
                      src={caso.before}
                      alt="Antes"
                    />
                  }
                  itemTwo={
                    <ReactCompareSliderImage
                      src={caso.after}
                      alt="Depois"
                    />
                  }
                />
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-lg">{caso.name}</h3>
                <p className="text-sm text-slate-600">
                  Tratamento: {caso.treatment}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================
// 5. VIDEO TESTIMONIAL SECTION
// ============================================

export function VideoTestimonials() {
  const testimonials = [
    {
      video: "/videos/depoimento-maria.mp4",
      thumbnail: "/images/thumbnails/maria.jpg",
      name: "Maria Silva",
      age: 28,
      profession: "Designer",
    },
    {
      video: "/videos/depoimento-joao.mp4",
      thumbnail: "/images/thumbnails/joao.jpg",
      name: "João Santos",
      age: 35,
      profession: "Engenheiro",
    },
    // ... mais depoimentos
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">
          O Que Nossos Pacientes Dizem
        </h2>
        <p className="text-center text-slate-600 mb-12">
          Histórias reais de transformação
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-lg"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative">
                <video
                  className="w-full h-64 object-cover"
                  poster={testimonial.thumbnail}
                  controls
                >
                  <source src={testimonial.video} type="video/mp4" />
                </video>
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-lg mb-1">
                  {testimonial.name}
                </h3>
                <p className="text-sm text-slate-600">
                  {testimonial.age} anos • {testimonial.profession}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================
// 6. ANIMATED COUNTER (para stats)
// ============================================

export function AnimatedStat({ end, duration = 2, suffix = "" }) {
  const [count, setCount] = useState(0)
  const { ref, inView } = useInView({ triggerOnce: true })

  useEffect(() => {
    if (inView) {
      let startTime: number
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const progress = (timestamp - startTime) / (duration * 1000)

        if (progress < 1) {
          setCount(Math.floor(end * progress))
          requestAnimationFrame(animate)
        } else {
          setCount(end)
        }
      }
      requestAnimationFrame(animate)
    }
  }, [inView, end, duration])

  return (
    <div ref={ref} className="text-4xl font-bold text-blue-600">
      {count.toLocaleString('pt-BR')}{suffix}
    </div>
  )
}

// Uso:
// <AnimatedStat end={5000} suffix="+" />

// ============================================
// 7. FLOATING CTA BUTTON (sticky bottom)
// ============================================

export function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 800)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
        >
          <Button
            size="lg"
            className="shadow-2xl px-8 py-6 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Começar Agora - R$ 99/mês
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ============================================
// 8. OPTIMIZED VIDEO COMPONENT
// ============================================

export function OptimizedVideo({
  src,
  poster,
  className = "",
  autoPlay = true,
  loop = true,
  muted = true,
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const { ref, inView } = useInView({ threshold: 0.5 })

  useEffect(() => {
    if (videoRef.current) {
      if (inView) {
        videoRef.current.play()
      } else {
        videoRef.current.pause()
      }
    }
  }, [inView])

  return (
    <div ref={ref}>
      <video
        ref={videoRef}
        className={className}
        poster={poster}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline
        preload="metadata"
      >
        <source src={`${src}.webm`} type="video/webm" />
        <source src={`${src}.mp4`} type="video/mp4" />
      </video>
    </div>
  )
}

// ============================================
// 9. IMAGE WITH LAZY LOAD + BLUR PLACEHOLDER
// ============================================

export function OptimizedImage({ src, alt, className = "", priority = false }) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div className="relative">
      {/* Blur Placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse" />
      )}

      <Image
        src={src}
        alt={alt}
        fill
        className={`${className} transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoadingComplete={() => setIsLoaded(true)}
        priority={priority}
        quality={90}
      />
    </div>
  )
}

// ============================================
// 10. SCROLL-TRIGGERED FADE IN
// ============================================

export function FadeInWhenVisible({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  )
}

// Uso:
// <FadeInWhenVisible delay={0.2}>
//   <Card>Conteúdo</Card>
// </FadeInWhenVisible>
