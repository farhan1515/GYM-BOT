'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dumbbell, 
  Zap, 
  Target, 
  Clock, 
  Star, 
  MessageCircle,
  ArrowRight,
  CheckCircle,
  Users,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}; // This is fine, as 'transition' is allowed in the animate variant for staggerChildren

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="relative z-10 px-4 py-6">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <Dumbbell className="h-8 w-8 text-blue-400" />
            <span className="text-2xl font-bold text-white">FitAI</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:flex items-center space-x-6"
          >
            {/* <Badge variant="secondary" className="bg-blue-500/20 text-blue-200 border-blue-400/30">
              <Zap className="h-3 w-3 mr-1" />
              AI Powered
            </Badge> */}
          </motion.div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 pt-12 pb-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="text-center"
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <Badge className="bg-green-500/20 text-green-200 border-green-400/30 mb-4">
                <Star className="h-3 w-3 mr-1" />
                100% Free Diet Plan
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            >
              Get Your
              <span className="block bg-gradient-to-r from-blue-400 via-green-400 to-orange-400 bg-clip-text text-transparent">
                Personalized Diet Plan
              </span>
              in 2 Minutes
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              Our smart assistant builds your ideal nutrition plan…, 
              fitness level, and dietary preferences. No generic advice - just results.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/chat">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Start Free Chat
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg"
                className="border-slate-600 text-slate-500 hover:bg-slate-800 px-8 py-6 text-lg rounded-xl"
              >
                <Clock className="mr-2 h-4 w-4" />
                2 Min Setup
              </Button>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex items-center justify-center space-x-8 text-slate-400">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                <span>No Signup Required</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                <span>Instant Results</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                <span>100% Free</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Background Decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why FitAI is the Smarter Way to Train?
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Next-Gen Coaching Tailored to Your Goals
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Target,
                title: "Personalized Plans",
                description: "Tailored nutrition plans based on your specific goals, body type, and preferences",
                color: "text-blue-400"
              },
              {
                icon: Zap,
                title: "Smart Engineered",
                description: "Built to understand your fitness profile and personalize accordingly",
                color: "text-green-400"
              },
              {
                icon: Clock,
                title: "Quick Setup",
                description: "Get your complete diet plan in just 2 minutes with our smart questionnaire",
                color: "text-orange-400"
              },
              {
                icon: MessageCircle,
                title: "Chat Interface",
                description: "Chat with your virtual wellness guide – no forms, just conversation",
                color: "text-purple-400"
              },
              {
                icon: Users,
                title: "Expert Backed",
                description: "Plans created using knowledge from certified nutritionists and trainers",
                color: "text-pink-400"
              },
              {
                icon: TrendingUp,
                title: "Proven Results",
                description: "Thousands of users have achieved their fitness goals with our plans",
                color: "text-cyan-400"
              }
            ].map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="bg-slate-900/50 border-slate-700 hover:bg-slate-900/70 transition-all duration-300 h-full">
                  <CardContent className="p-6">
                    <feature.icon className={`h-12 w-12 ${feature.color} mb-4`} />
                    <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                    <p className="text-slate-300 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Real People. Real Results. Personalized Just for You.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                name: "Sarah M.",
                role: "Busy Professional",
                content: "Lost 15 lbs in 8 weeks with a plan that felt tailor-made. The personalized touch made all the difference!",
                rating: 5
              },
              {
                name: "Mike T.",
                role: "Fitness Beginner", 
                content: "Finally found a plan that works with my schedule. It felt like it truly understood my lifestyle",
                rating: 5
              },
              {
                name: "Jessica L.",
                role: "Working Mom",
                content: "The meal prep suggestions were game-changing. Saved me hours each week while eating healthier.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="bg-slate-900/50 border-slate-700 h-full">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-slate-300 mb-4 italic">"{testimonial.content}"</p>
                    <div>
                      <p className="text-white font-semibold">{testimonial.name}</p>
                      <p className="text-slate-400 text-sm">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 bg-gradient-to-r from-blue-600/20 to-green-600/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Nutrition?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Join thousands who've already discovered their perfect diet plan. 
              Your personalized journey starts with just one conversation.
            </p>
            <Link href="/chat">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-12 py-6 text-xl font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <MessageCircle className="mr-3 h-6 w-6" />
                Get My Free Diet Plan Now
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Dumbbell className="h-8 w-8 text-blue-400" />
            <span className="text-2xl font-bold text-white">FitAI</span>
          </div>
          <p className="text-slate-400">
          Smarter Fitness. Smarter Nutrition. Better You.
          </p>
        </div>
      </footer>
    </div>
  );
}