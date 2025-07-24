"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState, useRef, useEffect } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import {
  Diamond,
  TrendingUp,
  Shield,
  Users,
  Eye,
  Clock,
  CheckCircle,
  ArrowRight,
  Star,
  Menu,
  X,
  BarChart3,
  Zap,
  Target
} from "lucide-react"

// Animated Counter Component
function AnimatedCounter({ end, duration = 2, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref)

  useEffect(() => {
    if (isInView) {
      const startTime = Date.now()
      const endTime = startTime + duration * 1000

      const updateCount = () => {
        const now = Date.now()
        const progress = Math.min((now - startTime) / (endTime - startTime), 1)
        setCount(Math.floor(progress * end))

        if (progress < 1) {
          requestAnimationFrame(updateCount)
        }
      }

      updateCount()
    }
  }, [isInView, end, duration])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

// Timeline Chart Component
function InvestmentTimeline() {
  const timelineRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(timelineRef, { once: true })

  const phases = [
    { phase: "Seed/Private", timing: "12-18 months early", gains: "50-100x", color: "from-emerald-500 to-green-600", position: 15 },
    { phase: "Pre-Sale", timing: "6-12 months early", gains: "10-50x", color: "from-blue-500 to-indigo-600", position: 35 },
    { phase: "IDO/IEO", timing: "1-3 months early", gains: "2-10x", color: "from-purple-500 to-violet-600", position: 60 },
    { phase: "CEX Listing", timing: "Public launch", gains: "1-3x", color: "from-orange-500 to-red-500", position: 85 }
  ]

  return (
    <div ref={timelineRef} className="relative">
      <div className="flex justify-between items-center mb-8">
        <div className="text-center">
          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 mb-2">
            CapitalNodes Members
          </Badge>
          <div className="text-sm text-gray-600">Get in early</div>
        </div>
        <div className="text-center">
          <Badge className="bg-red-100 text-red-700 border-red-200 mb-2">
            Regular Investors
          </Badge>
          <div className="text-sm text-gray-600">Too late</div>
        </div>
      </div>

      <div className="relative h-32 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-2 bg-gradient-to-r from-emerald-500 via-blue-500 via-purple-500 to-red-500 rounded-full mx-4" />
        </div>

        {phases.map((phase, index) => (
          <motion.div
            key={phase.phase}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="absolute"
            style={{ left: `${phase.position}%`, top: '10%', transform: 'translateX(-50%)' }}
          >
            <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${phase.color} border-2 border-white shadow-lg`} />
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-center min-w-max">
              <div className="text-xs font-semibold text-gray-900">{phase.phase}</div>
              <div className="text-xs text-gray-600">{phase.gains}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 text-center text-sm text-gray-600">
        Investment Timeline: Earlier = Higher Returns
      </div>
    </div>
  )
}

// Enhanced navigation button component
function NavButton({
  children,
  href,
  isSpecial = false,
  onClick,
  isMobile = false
}: {
  children: React.ReactNode
  href?: string
  isSpecial?: boolean
  onClick?: () => void
  isMobile?: boolean
}) {
  const buttonRef = useRef<HTMLButtonElement>(null)

  const playSound = () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(600, audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1)

      gainNode.gain.setValueAtTime(0.05, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.1)
    } catch (error) {
      console.log('Audio not supported')
    }
  }

  const createRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return

    const button = buttonRef.current
    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2

    const ripple = document.createElement('span')
    ripple.className = 'nav-ripple'
    ripple.style.width = ripple.style.height = size + 'px'
    ripple.style.left = x + 'px'
    ripple.style.top = y + 'px'

    button.appendChild(ripple)

    setTimeout(() => {
      ripple.remove()
    }, 600)
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    createRipple(e)
    playSound()
    if (onClick) onClick()
  }

  if (isSpecial) {
    return (
      <Button
        ref={buttonRef}
        className={`nav-button nav-button-special text-white px-6 py-2 rounded-xl font-medium ${isMobile ? 'w-full justify-center' : ''}`}
        onClick={handleClick}
      >
        {children}
      </Button>
    )
  }

  return (
    <button
      ref={buttonRef}
      className={`nav-button text-gray-700 hover:text-indigo-600 transition-colors font-medium px-4 py-2 rounded-xl relative overflow-hidden ${isMobile ? 'w-full text-left' : ''}`}
      onClick={handleClick}
    >
      {children}
    </button>
  )
}

export default function Home() {
  const [isSticky, setIsSticky] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { scrollY } = useScroll()

  // Parallax transforms
  const backgroundY = useTransform(scrollY, [0, 1000], [0, -100])
  const heroY = useTransform(scrollY, [0, 500], [0, -50])

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="gradient-bg">
      {/* Animated Background Elements with Parallax */}
      <motion.div
        style={{ y: backgroundY }}
        className="fixed inset-0 pointer-events-none overflow-hidden"
      >
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-indigo-400/15 to-purple-400/15 rounded-full blur-xl animate-float" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-purple-400/15 to-pink-400/15 rounded-full blur-xl animate-float-reverse" />
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-gradient-to-r from-blue-400/15 to-indigo-400/15 rounded-full blur-xl animate-float" />
        <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-gradient-to-r from-pink-400/15 to-purple-400/15 rounded-full blur-xl animate-float-reverse" />
      </motion.div>

      {/* Enhanced Navigation */}
      <nav className={`nav-container ${isSticky ? 'nav-sticky' : ''}`}>
        <div className="nav-glass-container">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm transform rotate-45" />
              </div>
              <span className="text-xl font-bold text-gray-900">CapitalNodes</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              <NavButton onClick={() => scrollToSection('how-it-works')}>How it Works</NavButton>
              <NavButton onClick={() => scrollToSection('testimonials')}>Testimonials</NavButton>
              <NavButton onClick={() => scrollToSection('faq')}>FAQ</NavButton>
              <NavButton isSpecial>
                Get Early Access
              </NavButton>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          <motion.div
            initial={false}
            animate={{
              height: isMobileMenuOpen ? 'auto' : 0,
              opacity: isMobileMenuOpen ? 1 : 0
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden"
          >
            <div className="px-6 pb-4 space-y-2 border-t border-gray-200/50 pt-4 mt-4">
              <NavButton isMobile onClick={() => scrollToSection('how-it-works')}>How it Works</NavButton>
              <NavButton isMobile onClick={() => scrollToSection('testimonials')}>Testimonials</NavButton>
              <NavButton isMobile onClick={() => scrollToSection('faq')}>FAQ</NavButton>
              <NavButton isMobile isSpecial>
                🚀 Get Early Access
              </NavButton>
            </div>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section
        style={{ y: heroY }}
        className="relative z-10 px-6 py-32 pt-40"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Badge className="mb-6 bg-gradient-to-r from-red-100 to-orange-100 text-red-700 border-red-200 px-4 py-2 text-sm font-semibold">
                  ⚠️ Exclusive Access Only
                </Badge>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
              >
                If you see a coin on
                <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent"> Binance, Kraken, or Uniswap</span>,
                you're already too late.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl text-gray-600 mb-8 leading-relaxed"
              >
                The real gains are made <strong>before</strong> a project ever gets listed on major exchanges.
                Join the platform that gives you exclusive access to VC deals, whitelists, and insider analysis
                – before the masses even hear about them.
              </motion.p>

              {/* USPs */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="space-y-4 mb-8"
              >
                {[
                  "Access to early-stage investments & pre-sales",
                  "Exclusive whitelists and private rounds",
                  "Daily VC deal updates and in-depth analysis",
                  "Direct insights from industry insiders"
                ].map((usp, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{usp}</span>
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button className="btn-primary text-white px-8 py-4 text-lg rounded-xl font-semibold flex items-center justify-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Get Early Access Now
                </Button>
                <Button className="btn-secondary px-8 py-4 text-lg rounded-xl font-semibold">
                  See How It Works
                </Button>
              </motion.div>
            </div>

            {/* Right Column - Timeline Chart */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="lg:pl-8"
            >
              <Card className="section-card border-0 shadow-2xl">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                    Investment Timeline
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    When different investors enter the market
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <InvestmentTimeline />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative z-10 px-6 py-16 bg-gradient-to-r from-indigo-50/50 to-purple-50/50"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">
                <AnimatedCounter end={47} suffix="x" />
              </div>
              <div className="text-gray-600 font-medium">Average Early Gains</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">
                <AnimatedCounter end={2847} />+
              </div>
              <div className="text-gray-600 font-medium">Members</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2">
                <AnimatedCounter end={127} />+
              </div>
              <div className="text-gray-600 font-medium">VC Deals Tracked</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">
                $<AnimatedCounter end={340} />M+
              </div>
              <div className="text-gray-600 font-medium">VC Funding Tracked</div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        id="how-it-works"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative z-10 px-6 py-20"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How CapitalNodes Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get insider access to the most profitable crypto investments before they go public
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Eye,
                title: "Exclusive Intel",
                description: "Access VC deal flow, private rounds, and whitelist opportunities before public announcement."
              },
              {
                icon: Target,
                title: "Early Entry",
                description: "Invest at seed/pre-sale prices with 10-100x potential before exchange listings."
              },
              {
                icon: TrendingUp,
                title: "Insider Analysis",
                description: "Get deep-dive research and insider insights from our network of VC partners."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="section-card h-full border-0 shadow-lg text-center">
                  <CardHeader className="pb-4">
                    <div className="w-16 h-16 mx-auto mb-4 gradient-icon-bg rounded-2xl flex items-center justify-center">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Trust Logos */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative z-10 px-6 py-16 bg-gray-50/50"
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-gray-600 mb-8"
          >
            Trusted by investors who got early access to
          </motion.p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {["Solana", "Polygon", "Avalanche", "Chainlink", "Uniswap", "Aave"].map((name, index) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-xl font-bold text-gray-400"
              >
                {name}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.section
        id="testimonials"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative z-10 px-6 py-20"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-16"
          >
            Success Stories
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "Early Investor",
                content: "Got into 3 projects at seed stage through CapitalNodes. Already seeing 40x returns on one of them before it even hit exchanges.",
                gains: "40x gains",
                avatar: "SC"
              },
              {
                name: "Marcus Rodriguez",
                role: "VC Fund Manager",
                content: "The deal flow here is incredible. CapitalNodes gives retail investors access to the same opportunities I see in institutional rounds.",
                gains: "Institutional access",
                avatar: "MR"
              },
              {
                name: "Alex Thompson",
                role: "Crypto Investor",
                content: "Made more in 6 months with early access than I did in 3 years trading on exchanges. This platform is a game changer.",
                gains: "6-month ROI",
                avatar: "AT"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{testimonial.name}</div>
                        <div className="text-gray-600 text-sm">{testimonial.role}</div>
                      </div>
                      <Badge className="ml-auto bg-emerald-100 text-emerald-700 border-emerald-200 text-xs">
                        {testimonial.gains}
                      </Badge>
                    </div>
                    <p className="text-gray-700 italic">"{testimonial.content}"</p>
                    <div className="flex text-yellow-400 mt-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        id="faq"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative z-10 px-6 py-20 bg-gray-50/50"
      >
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-16"
          >
            Frequently Asked Questions
          </motion.h2>

          <div className="space-y-6">
            {[
              {
                q: "How early do I get access to these deals?",
                a: "Our members typically get access 6-18 months before public listings, during seed rounds, pre-sales, and private investment rounds."
              },
              {
                q: "What kind of returns can I expect?",
                a: "While past performance doesn't guarantee future results, our tracked early-stage investments have seen average returns of 10-100x before public exchange listings."
              },
              {
                q: "Is this only for accredited investors?",
                a: "No. While some deals require accredited status, we provide access to many opportunities available to retail investors, including whitelists and community rounds."
              },
              {
                q: "How do you source these deals?",
                a: "Our team has direct relationships with top VCs, founders, and industry insiders who share deal flow and investment opportunities with our platform."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                    <p className="text-gray-600">{faq.a}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Final CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative z-10 px-6 py-20 bg-gradient-to-r from-indigo-600 to-purple-600"
      >
        <div className="max-w-4xl mx-auto text-center text-white">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Don't Wait for the Next Bull Run
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl mb-8 opacity-90"
          >
            Position yourself before the masses. Get exclusive access to the next generation
            of crypto projects while they're still in stealth mode.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Button className="bg-white text-indigo-600 hover:bg-gray-50 px-10 py-4 text-xl rounded-2xl font-bold flex items-center justify-center mx-auto">
              <Zap className="w-6 h-6 mr-2" />
              Get Early Access Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-sm opacity-75 mt-4">
              Limited spots available • No credit card required
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-gray-200/50 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm transform rotate-45" />
            </div>
            <span className="text-xl font-bold text-gray-900">CapitalNodes</span>
          </div>
          <p className="text-gray-600 mb-6">
            Exclusive access to early-stage crypto investments
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-500">
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Contact</a>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200/50 text-gray-500 text-sm">
            <p>&copy; 2025 CapitalNodes. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
