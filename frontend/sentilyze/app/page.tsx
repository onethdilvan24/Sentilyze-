"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Zap,
  Shield,
  Target,
  ChevronRight,
  Star,
  Check,
  Menu,
  X,
  LayoutDashboard,
} from "lucide-react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default function SentilyzeLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Real-Time Sentiment Analysis",
      description:
        "AI-powered real-time market sentiment across 15K+ traders worldwide",
      color: "from-emerald-400 to-teal-500",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "AI-Powered Signals",
      description:
        "Get over 1M+ AI recommendations tested by traders and algorithms",
      color: "from-violet-400 to-purple-500",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Multi-Source Data",
      description:
        "Real-time data from Twitter, Reddit, Telegram, news outlets, and more",
      color: "from-fuchsia-400 to-pink-500",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Historical Analysis",
      description:
        "Access tested data to backtest strategies and market sentiment",
      color: "from-cyan-400 to-blue-500",
    },
  ];

  const stats = [
    { value: "15K+", label: "Active Traders" },
    { value: "1M+", label: "AI Signals" },
    { value: "99.9%", label: "Uptime" },
    { value: "<100ms", label: "Response Time" },
  ];

  const markets = [
    {
      name: "Stocks",
      desc: "Analyze millions of sent, stocks and global stock markets",
    },
    {
      name: "Cryptocurrency",
      desc: "Real-time crypto sentiment from trusted media and news",
    },
    {
      name: "Forex",
      desc: "Navigate the foreign exchange market with sentiment tracking",
    },
    {
      name: "Commodities",
      desc: "Get sentiment on gold, oil, and other major commodities",
    },
    {
      name: "Indices",
      desc: "Track market-wide sentiment for major global indices",
    },
    {
      name: "ETFs",
      desc: "Sentiment tracking for passive exchange-traded funds",
    },
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$0",
      period: "forever",
      description: "For beginners exploring the sentiment analysis",
      features: [
        "7-day trading history",
        "2 alerts tracking",
        "Basic sentiment analysis",
        "Email support",
        "Community access",
      ],
      cta: "Get Started Free",
      popular: false,
    },
    {
      name: "Pro",
      price: "$39",
      period: "/month",
      description: "Best for serious traders",
      features: [
        "90-day trading history",
        "Unlimited alerts",
        "Advanced sentiment analysis",
        "Real-time data access",
        "SMS & Email alerts",
        "Historical data access",
        "Priority support",
        "Custom webhooks",
        "Portfolio analytics",
      ],
      cta: "Start Pro Trial",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$159",
      period: "/month",
      description: "For professional traders",
      features: [
        "Unlimited trading history",
        "White-label solution",
        "Advanced ML algorithms",
        "All alert channels + webhooks",
        "Full historical data access",
        "Dedicated account manager",
        "API access",
        "Custom integrations",
        "99.9 uptime SLA",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  const testimonials = [
    {
      name: "Alex Chen",
      role: "Day Trader",
      rating: 5,
      text: "Sentilyze has completely transformed my trading strategy. The sentiment analysis is incredibly accurate, and I've increased my portfolio returns significantly.",
      avatar: "AC",
    },
    {
      name: "Sarah Mitchell",
      role: "Crypto Investor",
      rating: 5,
      text: "As a crypto trader, timing is everything. Sentilyze helps me catch market sentiment shifts before they reflect in price, giving me a critical edge.",
      avatar: "SM",
    },
    {
      name: "Michael Torres",
      role: "Portfolio Manager",
      rating: 5,
      text: "I've integrated Sentilyze into our research workflow and it's incredibly valuable. The multi-source data helps me make smarter, data-driven decisions.",
      avatar: "MT",
    },
    {
      name: "Emily Watson",
      role: "Swing Trader",
      rating: 5,
      text: "The sentiment analysis is spot on. I especially love the real-time alerts that help me catch opportunities I would have otherwise missed.",
      avatar: "EW",
    },
    {
      name: "David Park",
      role: "Algorithmic Trader",
      rating: 5,
      text: "I love it. The API makes it super easy to integrate Sentilyze insights into my algos, and the results are very impressive.",
      avatar: "DP",
    },
    {
      name: "Jennifer Lee",
      role: "Financial Analyst",
      rating: 5,
      text: "Sentilyze provides insights that traditional financial platforms miss. The AI-powered signals save me hours of research and are quite highly recommended.",
      avatar: "JL",
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Connect Your Assets",
      description:
        "Link your exchange or brokerage account securely. Our system alerts monitoring happens instantly.",
      metric: "$67,432",
      metricLabel: "+2.1%",
      color: "emerald",
    },
    {
      step: "02",
      title: "AI Analyzes Sentiment",
      description:
        "Our AI scans social media, news, and financial reports to analyze market sentiment in real-time.",
      metric: "$189.25",
      metricLabel: "+0.5%",
      color: "amber",
    },
    {
      step: "03",
      title: "Get Trading Signals",
      description:
        "Receive real-time, high-quality signals and confidence scores and detailed reasoning.",
      metric: "1,0842",
      metricLabel: "+1.2%",
      color: "blue",
    },
    {
      step: "04",
      title: "Trade with Confidence",
      description:
        "Execute trades with confidence. Track your performance and refine your strategy over time.",
      metric: "Active",
      metricLabel: "Live",
      color: "fuchsia",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Syne', sans-serif;
        }
        
        .font-mono {
          font-family: 'Space Mono', monospace;
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideRight {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }
        
        .animate-slide-up {
          animation: slideUp 0.8s ease-out forwards;
        }
        
        .animate-slide-right {
          animation: slideRight 0.8s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
        
        .delay-100 {
          animation-delay: 0.1s;
        }
        
        .delay-200 {
          animation-delay: 0.2s;
        }
        
        .delay-300 {
          animation-delay: 0.3s;
        }
        
        .delay-400 {
          animation-delay: 0.4s;
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #00f5ff 0%, #00a6ff 50%, #7b2cbf 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .chart-pattern {
          background-image: 
            linear-gradient(to right, rgba(0, 245, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 245, 255, 0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        
        .glow-card {
          position: relative;
          transition: all 0.3s ease;
        }
        
        .glow-card::before {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(135deg, rgba(0, 245, 255, 0.4), rgba(123, 44, 191, 0.4));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .glow-card:hover::before {
          opacity: 1;
        }
        
        .glow-card:hover {
          transform: translateY(-4px);
        }
      `}</style>

      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-black/95 backdrop-blur-xl border-b border-white/20" : "bg-transparent"}`}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold whitespace-nowrap">
                Sentilyze
              </span>
            </div>

            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              <a
                href="#features"
                className="text-sm font-medium hover:text-cyan-400 transition-colors whitespace-nowrap"
              >
                Features
              </a>
              <a
                href="#markets"
                className="text-sm font-medium hover:text-cyan-400 transition-colors whitespace-nowrap"
              >
                Markets
              </a>
              <a
                href="#pricing"
                className="text-sm font-medium hover:text-cyan-400 transition-colors whitespace-nowrap"
              >
                Pricing
              </a>
              <a
                href="#testimonials"
                className="text-sm font-medium hover:text-cyan-400 transition-colors whitespace-nowrap"
              >
                Testimonials
              </a>
            </div>

            <div className="hidden lg:flex items-center gap-3 xl:gap-4 flex-shrink-0">
              <SignedOut>
                <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                  <button className="text-sm font-medium hover:text-cyan-400 transition-colors whitespace-nowrap">
                    Login
                  </button>
                </SignInButton>
                <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                  <button className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-4 xl:px-6 py-2 rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all whitespace-nowrap">
                    Get Started
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Link
                  href="/dashboard"
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-4 xl:px-6 py-2 rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all whitespace-nowrap flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  View Dashboard
                </Link>
                <UserButton />
              </SignedIn>
            </div>

            <button
              className="lg:hidden flex-shrink-0"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-black/98 backdrop-blur-xl border-t border-white/20">
            <div className="px-4 sm:px-6 py-4 space-y-3">
              <a
                href="#features"
                className="block text-sm font-medium hover:text-cyan-400 transition-colors py-2"
              >
                Features
              </a>
              <a
                href="#markets"
                className="block text-sm font-medium hover:text-cyan-400 transition-colors py-2"
              >
                Markets
              </a>
              <a
                href="#pricing"
                className="block text-sm font-medium hover:text-cyan-400 transition-colors py-2"
              >
                Pricing
              </a>
              <a
                href="#testimonials"
                className="block text-sm font-medium hover:text-cyan-400 transition-colors py-2"
              >
                Testimonials
              </a>
              <div className="pt-3 border-t border-white/10 space-y-2">
                <SignedOut>
                  <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                    <button className="w-full text-sm font-medium text-left hover:text-cyan-400 transition-colors py-2">
                      Login
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                    <button className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-3 rounded-lg text-sm font-semibold">
                      Get Started
                    </button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <Link
                    href="/dashboard"
                    className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    View Dashboard
                  </Link>
                  <div className="flex items-center gap-3 py-2">
                    <UserButton />
                    <span className="text-sm text-gray-400">Account</span>
                  </div>
                </SignedIn>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-28 md:pt-32 lg:pt-36 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 chart-pattern opacity-20"></div>

        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse-glow delay-200"></div>

        <div className="w-full max-w-7xl mx-auto relative">
          <div className="text-center mb-8 sm:mb-12 animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-cyan-500/40 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6">
              <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-mono whitespace-nowrap">
                Trusted by 15,000+ traders worldwide
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 leading-tight px-4">
              Start trading like
              <br />
              <span className="gradient-text">smart money</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-6 sm:mb-8 px-4">
              The #1 AI agent to find strategies, powered by
              <br className="hidden sm:block" />
              the best trading indicators used by 15,000+ traders
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
              <button className="w-full sm:w-auto group bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold hover:shadow-2xl hover:shadow-cyan-500/50 transition-all flex items-center justify-center gap-2">
                Start Analyzing Now
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full sm:w-auto border border-white/30 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold hover:bg-white/10 transition-all">
                Watch Demo
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8 sm:mt-12 md:mt-16 animate-slide-up delay-200 px-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text mb-1 sm:mb-2">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 relative"
      >
        <div className="w-full max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 px-4">
              Everything You Need to{" "}
              <span className="gradient-text">Trade Smarter</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto px-4">
              Powerful tools and insights to help you make data-driven trading
              decisions with confidence.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="glow-card bg-zinc-950/80 border border-white/20 rounded-2xl p-6 sm:p-8 backdrop-blur-sm"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 sm:mb-6`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Markets Section */}
      <section id="markets" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="w-full max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 px-4">
              Analyze Any Market,{" "}
              <span className="gradient-text">Anywhere</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto px-4">
              Get AI-powered sentiment analysis across all major financial
              markets. From stocks to crypto, we've got you covered.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {markets.map((market, idx) => (
              <div
                key={idx}
                className="glow-card bg-zinc-950/80 border border-white/20 rounded-2xl p-5 sm:p-6 backdrop-blur-sm"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-cyan-500/30 to-purple-600/30 flex items-center justify-center mb-3 sm:mb-4">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">
                  {market.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400">
                  {market.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 relative">
        <div className="w-full max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 px-4">
              Start Trading in{" "}
              <span className="gradient-text">4 Simple Steps</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto px-4">
              From setup to your first trade, the fastest sentiment analysis
              accelerated and personalized.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-cyan-500/50 to-transparent"></div>
                )}
                <div className="glow-card bg-zinc-950/80 border border-white/20 rounded-2xl p-6 backdrop-blur-sm h-full">
                  <div
                    className={`inline-block px-3 py-1 rounded-lg bg-${step.color}-500/20 text-${step.color}-400 text-sm font-mono font-bold mb-4`}
                  >
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-sm text-gray-400 mb-6">
                    {step.description}
                  </p>
                  <div
                    className={`bg-${step.color}-500/10 border border-${step.color}-500/30 rounded-lg p-4`}
                  >
                    <div
                      className={`text-2xl font-bold text-${step.color}-400`}
                    >
                      {step.metric}
                    </div>
                    <div className="text-xs text-gray-400">
                      {step.metricLabel}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="w-full max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 px-4">
              Simple, Transparent <span className="gradient-text">Pricing</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto px-4">
              Choose the perfect plan for your trading style. All plans include
              a 14-day free trial.
            </p>
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mt-3 sm:mt-4">
              <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm text-emerald-400 font-mono whitespace-nowrap">
                30-Day Money-Back Guarantee
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {pricingPlans.map((plan, idx) => (
              <div
                key={idx}
                className={`glow-card relative bg-zinc-950/80 border rounded-2xl p-6 sm:p-8 backdrop-blur-sm ${
                  plan.popular
                    ? "border-cyan-500/60 bg-gradient-to-b from-cyan-500/10 to-purple-600/10"
                    : "border-white/20"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap">
                    Most Popular
                  </div>
                )}

                <div className="mb-5 sm:mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4">
                    {plan.description}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-bold">
                      {plan.price}
                    </span>
                    <span className="text-sm sm:text-base text-gray-400">
                      {plan.period}
                    </span>
                  </div>
                </div>

                <button
                  className={`w-full py-2.5 sm:py-3 rounded-xl font-semibold mb-5 sm:mb-6 transition-all text-sm sm:text-base ${
                    plan.popular
                      ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:shadow-lg hover:shadow-cyan-500/50"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {plan.cta}
                </button>

                <div className="space-y-2.5 sm:space-y-3">
                  <div className="text-xs sm:text-sm font-bold mb-2 sm:mb-3">
                    What's Included:
                  </div>
                  {plan.features.map((feature, fidx) => (
                    <div key={fidx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-gray-300">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="testimonials"
        className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 relative overflow-hidden"
      >
        <div className="w-full max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 px-4">
              Loved by <span className="gradient-text">15,000+ Traders</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-300 px-4">
              Don't just take our word for it. Here's what our community has to
              say about Sentilyze.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10 md:mb-12">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="glow-card bg-zinc-950/80 border border-white/20 rounded-2xl p-5 sm:p-6 backdrop-blur-sm"
              >
                <div className="flex items-center gap-1 mb-3 sm:mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-gray-300 mb-4 sm:mb-6 leading-relaxed">
                  {testimonial.text}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-xs sm:text-sm">
                      {testimonial.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold gradient-text mb-1.5 sm:mb-2">
                4.9/5
              </div>
              <div className="text-xs sm:text-sm text-gray-400">
                Average Rating
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold gradient-text mb-1.5 sm:mb-2">
                2,500+
              </div>
              <div className="text-xs sm:text-sm text-gray-400">
                5-Star Reviews
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold gradient-text mb-1.5 sm:mb-2">
                98%
              </div>
              <div className="text-xs sm:text-sm text-gray-400">
                Would Recommend
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="w-full max-w-4xl mx-auto">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 px-4">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-300 px-4">
              Everything you need to know about Sentilyze
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {[
              {
                q: "What is sentiment analysis and how does Sentilyze use it?",
                a: "Sentiment analysis is the process of determining the emotional tone behind text. Sentilyze uses advanced AI and machine-language processing to analyze thousands of news articles, social media posts, and financial reports to gauge market sentiment.",
              },
              {
                q: "How accurate are the trading signals?",
                a: "Our AI-powered signals have been backtested across thousands of market conditions with a proven track record. While past performance doesn't guarantee future results, our signals maintain high accuracy through continuous learning and adaptation.",
              },
              {
                q: "What data sources do you analyze?",
                a: "We analyze data from Twitter, Reddit, Telegram, major news outlets, financial reports, and more to provide comprehensive sentiment analysis across all relevant sources.",
              },
              {
                q: "Is there an API available for automated trading?",
                a: "Yes! Our Pro and Enterprise plans include API access, allowing you to integrate Sentilyze insights directly into your trading algorithms and automated systems.",
              },
              {
                q: "How do I cancel my subscription?",
                a: "You can cancel anytime from your account settings. We also offer a 30-day money-back guarantee if you're not satisfied with our service.",
              },
            ].map((faq, idx) => (
              <details
                key={idx}
                className="glow-card bg-zinc-950/80 border border-white/20 rounded-xl p-5 sm:p-6 backdrop-blur-sm group"
              >
                <summary className="font-bold cursor-pointer flex items-center justify-between text-sm sm:text-base">
                  {faq.q}
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-open:rotate-90 flex-shrink-0 ml-2" />
                </summary>
                <p className="text-gray-400 mt-3 sm:mt-4 text-xs sm:text-sm leading-relaxed">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/10 to-purple-600/10"></div>
        <div className="w-full max-w-4xl mx-auto text-center relative">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 px-4">
            Ready to Trade Like{" "}
            <span className="gradient-text">Smart Money?</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Join 15,000+ traders who are making smarter, data-driven decisions
            with AI-powered sentiment analysis. Start your free trial today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
            <button className="w-full sm:w-auto group bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold hover:shadow-2xl hover:shadow-cyan-500/50 transition-all flex items-center justify-center gap-2">
              Get Started Free
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto border border-white/30 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold hover:bg-white/10 transition-all">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/20 py-8 sm:py-10 md:py-12 px-4 sm:px-6">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-10 md:mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="text-lg sm:text-xl font-bold">Sentilyze</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-400">
                AI-powered sentiment analysis for smarter trading decisions.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-3 sm:mb-4 text-sm sm:text-base">
                Product
              </h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Integrations
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-3 sm:mb-4 text-sm sm:text-base">
                Resources
              </h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Webinars
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-3 sm:mb-4 text-sm sm:text-base">
                Legal
              </h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Disclaimer
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 pt-6 sm:pt-8 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400">
            <p>© 2026 Sentilyze. All rights reserved.</p>
            <div className="flex items-center gap-4 sm:gap-6">
              <a href="#" className="hover:text-cyan-400 transition-colors">
                Twitter
              </a>
              <a href="#" className="hover:text-cyan-400 transition-colors">
                LinkedIn
              </a>
              <a href="#" className="hover:text-cyan-400 transition-colors">
                Discord
              </a>
              <a href="#" className="hover:text-cyan-400 transition-colors">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
