"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  BookOpen,
  Headphones,
  TrendingUp,
  ChevronRight,
  Sparkles,
  Lock,
  Calendar,
  Clock,
  Zap,
  Heart,
  Brain,
  Sun,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { FAQAccordion } from "@/components/ui/accordion";
import { BiorhythmWheel } from "@/components/biorhythm/wheel";
import { chapters, getProgressStats } from "@/lib/data/chapters";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 21 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] as const },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.13,
      delayChildren: 0.2,
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] as const },
  },
};

// Feature data
const features = [
  {
    icon: Activity,
    title: "Biorhythm Sync",
    description:
      "Chapters unlock based on your unique physical, emotional, intellectual, and spiritual cycles. Practice when your body is ready.",
    color: "octave",
  },
  {
    icon: BookOpen,
    title: "12 Transformative Chapters",
    description:
      "A complete journey from awakening to integration, each canticle building upon the last in a spiral of growth.",
    color: "transform",
  },
  {
    icon: Headphones,
    title: "Audio Practices",
    description:
      "Immersive audio guides for each chapter, designed to activate specific somatic responses and deepen embodiment.",
    color: "witness",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description:
      "Visualize your journey with intuitive progress indicators, cycle forecasts, and completion insights.",
    color: "build",
  },
];

// How it works steps
const steps = [
  {
    number: "01",
    title: "Enter Birth Data",
    description:
      "Share your birth date and time to calculate your unique biorhythm patterns.",
    icon: Calendar,
    color: "octave",
  },
  {
    number: "02",
    title: "Calculate Cycles",
    description:
      "Our system maps your physical, emotional, intellectual, and spiritual cycles.",
    icon: Clock,
    color: "transform",
  },
  {
    number: "03",
    title: "Unlock Chapters",
    description:
      "Canticles become available when your corresponding cycle reaches its peak.",
    icon: Lock,
    color: "solar",
  },
  {
    number: "04",
    title: "Practice Daily",
    description:
      "Engage with audio practices, reflections, and somatic exercises tailored to your rhythm.",
    icon: Sparkles,
    color: "build",
  },
];

// Testimonials
const testimonials = [
  {
    quote:
      "Somatic Canticles has completely transformed my relationship with my body. The biorhythm-based unlocking creates anticipation that makes each chapter feel like a gift.",
    author: "Maya T.",
    role: "Yoga Instructor",
    cycle: "Physical Cycle Peak",
  },
  {
    quote:
      "I've tried many meditation apps, but this is the first that truly honors the body's wisdom. The audio practices are profound—I've never felt so grounded.",
    author: "James R.",
    role: "Software Engineer",
    cycle: "Intellectual Cycle Peak",
  },
  {
    quote:
      "The integration of biorhythms with somatic practice is genius. It's like the app knows exactly what I need, exactly when I need it.",
    author: "Sofia K.",
    role: "Therapist",
    cycle: "Emotional Cycle Peak",
  },
];

// FAQ data
const faqItems = [
  {
    question: "What are biorhythms and how do they work?",
    answer:
      "Biorhythms are natural cycles that affect your physical, emotional, intellectual, and spiritual states. Based on your birth date, we calculate where you are in each cycle—high points are ideal for corresponding practices, while low points invite rest and integration.",
  },
  {
    question: "Do I need any prior experience with somatic practice?",
    answer:
      "Not at all. Somatic Canticles is designed for all levels. The first chapters focus on foundational practices like conscious breathing and grounding, making it accessible whether you're new to embodiment work or have years of experience.",
  },
  {
    question: "How long does each chapter take to complete?",
    answer:
      "Each chapter includes a 19-21 minute audio practice, plus reflection exercises that can take 5-15 minutes. The beauty of the system is that chapters unlock based on your cycles, giving you natural intervals between practices.",
  },
  {
    question: "Can I access chapters before they unlock?",
    answer:
      "Chapters are designed to unlock based on your biorhythm peaks for a reason—the practices are most effective when your corresponding cycle is at its high point. However, once unlocked, chapters remain available for review.",
  },
  {
    question: "Is my birth data kept private?",
    answer:
      "Absolutely. Your birth information is used solely for biorhythm calculations and is never shared with third parties. You can delete your account and all associated data at any time.",
  },
  {
    question: "What happens after I complete all 12 chapters?",
    answer:
      "Completion of the 12 canticles is just the beginning. Many practitioners revisit chapters during different cycle peaks, discovering new layers of depth. The final chapter guides you in creating a personalized ongoing practice.",
  },
];

// Chapter preview data (first 4 chapters)
const previewChapters = chapters.slice(0, 4);

// Cycle colors mapping
const cycleColors: Record<string, string> = {
  physical: "octave",
  emotional: "transform",
  intellectual: "witness",
  spiritual: "solar",
};

const cycleIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  physical: Activity,
  emotional: Heart,
  intellectual: Brain,
  spiritual: Sun,
};

export default function LandingPage() {
  const stats = getProgressStats();
  // Demo birth date for the hero wheel
  const demoBirthDate = new Date("1990-06-15");

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-surface via-surface to-surface-elevated" />

        {/* Animated biorhythm wheel background */}
        <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 opacity-30 hidden lg:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -180 }}
            animate={{ opacity: 0.3, scale: 1, rotate: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <BiorhythmWheel
              birthDate={demoBirthDate}
              size="lg"
              showLegend={false}
            />
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-octave/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-transform/5 rounded-full blur-3xl" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-13 py-32">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-3xl"
          >
            <motion.div variants={fadeInUp} className="mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-octave/10 text-octave text-sm font-medium border border-octave/20">
                <Sparkles className="w-4 h-4" />
                Now in Open Beta
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-8"
            >
              <span className="bg-gradient-to-r from-octave via-transform to-witness bg-clip-text text-transparent">
                Somatic Canticles
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl sm:text-2xl text-text-muted leading-relaxed mb-8 max-w-2xl"
            >
              Your body&apos;s rhythm unlocks chapters of transformation. A
              biorhythm-synced journey through 12 canticles of somatic practice.
            </motion.p>

            <motion.p
              variants={fadeInUp}
              className="text-base text-text-muted/70 mb-12 max-w-xl"
            >
              Enter your birth data. Let your cycles guide you. Each chapter
              unlocks when your body is ready—not when an algorithm decides.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap gap-4"
            >
              <Link href="/signup">
                <Button size="lg" className="group">
                  Start Your Journey
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeInUp}
              className="mt-16 grid grid-cols-3 gap-8 max-w-md"
            >
              <div>
                <div className="text-3xl font-bold text-octave">12</div>
                <div className="text-sm text-text-muted">Canticles</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-transform">4</div>
                <div className="text-sm text-text-muted">Cycles</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-build">∞</div>
                <div className="text-sm text-text-muted">Possibilities</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-text-muted/30 flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-2 bg-text-muted/50 rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 lg:py-32 bg-surface-elevated/30">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-13">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-octave to-transform bg-clip-text text-transparent">
                Aligned with Your Rhythm
              </span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-text-muted max-w-2xl mx-auto"
            >
              Unlike other wellness apps, Somatic Canticles respects your natural
              cycles. Each feature is designed to work with your body, not
              against it.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-6 lg:gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={scaleIn}
                className="group relative p-8 rounded-2xl bg-surface border border-white/5 hover:border-octave/20 transition-all duration-500"
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-${feature.color}/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}
                >
                  <feature.icon
                    className={`w-7 h-7 text-${feature.color}`}
                  />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-text">
                  {feature.title}
                </h3>
                <p className="text-text-muted leading-relaxed">
                  {feature.description}
                </p>
                <div
                  className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-${feature.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-2xl`}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 lg:py-32">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-13">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-transform to-witness bg-clip-text text-transparent">
                How It Works
              </span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-text-muted max-w-2xl mx-auto"
            >
              A simple four-step process that puts your body&apos;s wisdom in the
              driver&apos;s seat.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                variants={fadeInUp}
                className="relative"
              >
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-white/10 to-transparent" />
                )}

                <div className="relative">
                  <span
                    className={`text-6xl font-bold text-${step.color}/20 absolute -top-4 -left-2`}
                  >
                    {step.number}
                  </span>
                  <div
                    className={`w-12 h-12 rounded-xl bg-${step.color}/10 flex items-center justify-center mb-6 relative z-10`}
                  >
                    <step.icon className={`w-6 h-6 text-${step.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-text">
                    {step.title}
                  </h3>
                  <p className="text-text-muted leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Chapter Preview Section */}
      <section className="py-24 lg:py-32 bg-surface-elevated/30">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-13">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-witness to-build bg-clip-text text-transparent">
                The 12 Canticles
              </span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-text-muted max-w-2xl mx-auto"
            >
              A complete journey through body and consciousness, organized by
              biorhythm cycles.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {previewChapters.map((chapter, index) => {
              const CycleIcon = cycleIcons[chapter.cycle];
              const isLocked = chapter.status === "locked";

              return (
                <motion.div
                  key={chapter.id}
                  variants={scaleIn}
                  className={`relative group rounded-2xl overflow-hidden transition-all duration-500 ${
                    isLocked ? "opacity-60" : ""
                  }`}
                >
                  <div
                    className={`p-6 h-full bg-surface border border-white/5 ${
                      isLocked ? "" : "hover:border-octave/20"
                    } transition-colors duration-500`}
                  >
                    {/* Locked overlay */}
                    {isLocked && (
                      <div className="absolute inset-0 backdrop-blur-sm bg-surface/50 flex items-center justify-center">
                        <div className="text-center">
                          <Lock className="w-8 h-8 text-text-muted mx-auto mb-2" />
                          <span className="text-sm text-text-muted">
                            Cycle Locked
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start justify-between mb-4">
                      <span
                        className={`text-4xl font-bold text-${cycleColors[chapter.cycle]}/30`}
                      >
                        {String(chapter.number).padStart(2, "0")}
                      </span>
                      <div
                        className={`p-2 rounded-lg bg-${cycleColors[chapter.cycle]}/10`}
                      >
                        {CycleIcon && (
                          <CycleIcon
                            className={`w-5 h-5 text-${cycleColors[chapter.cycle]}`}
                          />
                        )}
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold mb-2 text-text">
                      {chapter.title}
                    </h3>
                    <p className="text-sm text-text-muted mb-4 line-clamp-2">
                      {chapter.description}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-text-muted/70">
                      <span className="capitalize">{chapter.cycle} Cycle</span>
                      <span>·</span>
                      <span>{chapter.estimatedDuration} min</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <Link href="/chapters">
              <Button variant="outline">
                View All Chapters
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-13">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-solar to-unity bg-clip-text text-transparent">
                Voices from the Journey
              </span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-text-muted max-w-2xl mx-auto"
            >
              Early practitioners share their experiences with Somatic Canticles.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                variants={fadeInUp}
                className="relative p-8 rounded-2xl bg-surface-elevated/50 border border-white/5"
              >
                <div className="absolute -top-4 left-8">
                  <div className="w-8 h-8 rounded-full bg-octave flex items-center justify-center">
                    <span className="text-white text-lg">&ldquo;</span>
                  </div>
                </div>

                <blockquote className="text-text/90 leading-relaxed mb-6 mt-2">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-text">
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-text-muted">
                      {testimonial.role}
                    </div>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-build/10 text-build">
                    {testimonial.cycle}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing/Access Section */}
      <section className="py-24 lg:py-32 bg-surface-elevated/30">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-13">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-build/10 text-build text-sm font-medium border border-build/20 mb-8"
            >
              <Zap className="w-4 h-4" />
              Free During Beta
            </motion.div>

            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-build to-creative bg-clip-text text-transparent">
                Begin Your Journey Today
              </span>
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="text-lg text-text-muted mb-8"
            >
              Somatic Canticles is currently free during our open beta. Help
              shape the future of biorhythm-synced practice and lock in early
              adopter benefits.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="grid sm:grid-cols-3 gap-6 text-left mb-12"
            >
              <div className="p-6 rounded-xl bg-surface border border-white/5">
                <div className="text-2xl font-bold text-octave mb-2">Free</div>
                <div className="text-sm text-text-muted mb-4">
                  During Beta Period
                </div>
                <ul className="space-y-2 text-sm text-text-muted">
                  <li className="flex items-center gap-2">
                    <span className="text-build">✓</span> All 12 chapters
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-build">✓</span> Full audio library
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-build">✓</span> Biorhythm tracking
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-xl bg-surface border border-octave/30 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-octave text-white text-xs font-medium rounded-full">
                  Future
                </div>
                <div className="text-2xl font-bold text-text mb-2">$12/mo</div>
                <div className="text-sm text-text-muted mb-4">
                  Standard Access
                </div>
                <ul className="space-y-2 text-sm text-text-muted">
                  <li className="flex items-center gap-2">
                    <span className="text-text-muted">○</span> Everything in
                    Free
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-text-muted">○</span> Advanced
                    analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-text-muted">○</span> Community
                    features
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-xl bg-surface border border-white/5">
                <div className="text-2xl font-bold text-text mb-2">$44/yr</div>
                <div className="text-sm text-text-muted mb-4">
                  Commitment Saver
                </div>
                <ul className="space-y-2 text-sm text-text-muted">
                  <li className="flex items-center gap-2">
                    <span className="text-text-muted">○</span> Everything in
                    Standard
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-text-muted">○</span> 70% savings
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-text-muted">○</span> Bonus content
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Link href="/signup">
                <Button size="lg" className="group">
                  Get Started Free
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <p className="mt-4 text-sm text-text-muted">
                No credit card required. Cancel anytime.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-13">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-3xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-unity to-creative bg-clip-text text-transparent">
                  Frequently Asked Questions
                </span>
              </h2>
              <p className="text-lg text-text-muted">
                Everything you need to know about Somatic Canticles.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <FAQAccordion items={faqItems} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-surface to-surface-elevated" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-octave/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-transform/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-13">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-2xl mx-auto text-center"
          >
            <motion.div
              variants={fadeInUp}
              className="w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-to-br from-octave via-transform to-witness flex items-center justify-center"
            >
              <Sparkles className="w-10 h-10 text-white" />
            </motion.div>

            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6"
            >
              Ready to Begin Your
              <span className="block bg-gradient-to-r from-octave via-transform to-witness bg-clip-text text-transparent">
                Somatic Journey?
              </span>
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="text-lg text-text-muted mb-10"
            >
              Join thousands of practitioners who are discovering the wisdom of
              their bodies through biorhythm-synced practice. Your first
              canticle awaits.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap justify-center gap-4"
            >
              <Link href="/signup">
                <Button size="lg" className="group">
                  Start Your Journey
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg">
                  Already a Member? Sign In
                </Button>
              </Link>
            </motion.div>

            {/* Power numbers decoration */}
            <motion.div
              variants={fadeInUp}
              className="mt-16 flex items-center justify-center gap-3 text-sm text-text-muted/50"
            >
              <span className="hover:text-octave transition-colors">8</span>
              <span>·</span>
              <span className="hover:text-transform transition-colors">
                13
              </span>
              <span>·</span>
              <span className="hover:text-solar transition-colors">19</span>
              <span>·</span>
              <span className="hover:text-build transition-colors">21</span>
              <span>·</span>
              <span className="hover:text-witness transition-colors">44</span>
              <span>·</span>
              <span className="hover:text-unity transition-colors">125</span>
              <span>·</span>
              <span className="hover:text-creative transition-colors">
                152
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
