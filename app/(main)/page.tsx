'use client'

import { motion } from 'framer-motion'
import { HeroSection } from '@/components/sections/HeroSection'
import { ServicesSection } from '@/components/sections/ServicesSection'
import { PortfolioSection } from '@/components/sections/PortfolioSection'
import { PackagesSection } from '@/components/sections/PackagesSection'
import { WhyChooseUs } from '@/components/sections/WhyChooseUs'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { FAQSection } from '@/components/ui/FAQSection'
import { ContactSection } from '@/components/sections/ContactSection'
import { CTASection } from '@/components/sections/CTASection'

export default function HomePage() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <HeroSection />
            <ServicesSection />
            <PortfolioSection />
            <PackagesSection />
            <WhyChooseUs />
            <TestimonialsSection />
            <FAQSection />
            <CTASection />
            <ContactSection />
        </motion.div>
    )
}
