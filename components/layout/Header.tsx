"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useModal } from "@/lib/modal-context";
import { useLanguage } from "@/lib/language-context";
import { t, tr } from "@/lib/translations";
import { ProjectTrackerModal } from "@/components/frontend/ProjectTrackerModal";

interface SiteConfig {
  site_name: string;
  logo_url: string | null;
}

const navigation = [
  { key: "home" as const, href: "/" },
  { key: "portfolio" as const, href: "/portfolio" },
  { key: "showcase" as const, href: "/showcase" },
  { key: "articles" as const, href: "/articles" },
];

const policyLinks = [
  { key: "privacy" as const, href: "/privacy" },
  { key: "terms" as const, href: "/terms" },
  { key: "cookies" as const, href: "/cookies" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const { openProjectTracker, isProjectTrackerOpen, closeProjectTracker } =
    useModal();
  const { lang, toggleLang } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function fetchSiteConfig() {
      try {
        const { data, error } = await supabase
          .from("site_config")
          .select("site_name, logo_url")
          .single();

        if (error) throw error;
        if (data) setSiteConfig(data);
      } catch (error) {
        console.error("Error fetching site config:", error);
      }
    }
    fetchSiteConfig();
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white",
        isScrolled && "shadow-lg shadow-secondary-900/5",
      )}
    >
      <nav className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center"
            >
              {siteConfig?.logo_url ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={siteConfig.logo_url}
                  alt={siteConfig.site_name || "Logo"}
                  className="h-14 md:h-18 w-auto object-contain"
                />
              ) : (
                <Image
                  src="/logos/navbar-logo.png"
                  alt={siteConfig?.site_name || "VELOZI | Dev Logo"}
                  width={200}
                  height={60}
                  className="h-14 md:h-18 w-auto object-contain"
                  priority
                />
              )}
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {/* Home link */}
            <Link
              href="/"
              className="px-4 py-2 font-medium text-secondary-600 hover:text-primary-600 transition-colors relative group"
            >
              {tr(t.nav.home, lang)}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary-500 transition-all group-hover:w-3/4" />
            </Link>

            {/* Services Dropdown (hover) */}
            <div
              className="relative"
              onMouseEnter={() => setIsServicesOpen(true)}
              onMouseLeave={() => setIsServicesOpen(false)}
            >
              <Link
                href="/#services"
                className="px-4 py-2 font-medium text-secondary-600 hover:text-primary-600 transition-colors flex items-center gap-1"
              >
                {tr(t.nav.services, lang)}
                <ChevronDown
                  className={cn(
                    "w-4 h-4 transition-transform",
                    isServicesOpen && "rotate-180",
                  )}
                />
              </Link>

              <AnimatePresence>
                {isServicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-0 pt-2"
                  >
                    <div className="w-56 bg-white rounded-xl shadow-xl border border-secondary-100 overflow-hidden">
                      <Link
                        href="/#services"
                        className="block px-4 py-3 text-secondary-600 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                      >
                        {tr(t.nav.services, lang)}
                      </Link>
                      <Link
                        href="/#packages"
                        className="block px-4 py-3 text-secondary-600 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                      >
                        {tr(t.nav.packages, lang)}
                      </Link>
                      <button
                        onClick={() => {
                          setIsServicesOpen(false);
                          openProjectTracker();
                        }}
                        className="block w-full text-left px-4 py-3 text-secondary-600 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                      >
                        {tr(t.nav.trackOrder, lang)}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Other nav links */}
            {navigation
              .filter((n) => n.key !== "home")
              .map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className="px-4 py-2 font-medium text-secondary-600 hover:text-primary-600 transition-colors relative group"
                >
                  {tr(t.nav[item.key], lang)}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary-500 transition-all group-hover:w-3/4" />
                </Link>
              ))}

            {/* Policy Dropdown (hover) */}
            <div
              className="relative"
              onMouseEnter={() => setIsPolicyOpen(true)}
              onMouseLeave={() => setIsPolicyOpen(false)}
            >
              <button className="px-4 py-2 font-medium text-secondary-600 hover:text-primary-600 transition-colors flex items-center gap-1">
                {tr(t.nav.policy, lang)}
                <ChevronDown
                  className={cn(
                    "w-4 h-4 transition-transform",
                    isPolicyOpen && "rotate-180",
                  )}
                />
              </button>

              <AnimatePresence>
                {isPolicyOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-0 pt-2"
                  >
                    <div className="w-56 bg-white rounded-xl shadow-xl border border-secondary-100 overflow-hidden">
                      {policyLinks.map((link) => (
                        <Link
                          key={link.key}
                          href={link.href}
                          className="block px-4 py-3 text-secondary-600 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                          onClick={() => setIsPolicyOpen(false)}
                        >
                          {tr(t.nav[link.key], lang)}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* CTA Buttons + Language Toggle */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={toggleLang}
              className="flex items-center bg-secondary-100 rounded-full p-0.5 text-xs font-semibold"
            >
              <span
                className={cn(
                  "px-2.5 py-1.5 rounded-full transition-all",
                  lang === "th"
                    ? "bg-primary-600 text-white shadow-sm"
                    : "text-secondary-500",
                )}
              >
                TH
              </span>
              <span
                className={cn(
                  "px-2.5 py-1.5 rounded-full transition-all",
                  lang === "en"
                    ? "bg-primary-600 text-white shadow-sm"
                    : "text-secondary-500",
                )}
              >
                EN
              </span>
            </button>

            <Link href="/login" className="btn-outline text-sm py-2">
              {lang === "th" ? "เข้าสู่ระบบ" : "Login"}
            </Link>
            <Link href="#contact" className="btn-primary text-sm py-2">
              {lang === "th" ? "ปรึกษาฟรี" : "Contact Us"}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-secondary-600 hover:text-primary-600 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2 border-t border-secondary-100">
                <Link
                  href="/"
                  className="block px-4 py-3 text-secondary-600 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {tr(t.nav.home, lang)}
                </Link>

                {/* Services group */}
                <div className="pt-2 border-t border-secondary-100">
                  <p className="px-4 py-2 text-xs text-secondary-400 uppercase tracking-wider">
                    {tr(t.nav.services, lang)}
                  </p>
                  <Link
                    href="/#services"
                    className="block px-4 py-3 text-secondary-600 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {tr(t.nav.services, lang)}
                  </Link>
                  <Link
                    href="/#packages"
                    className="block px-4 py-3 text-secondary-600 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {tr(t.nav.packages, lang)}
                  </Link>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      openProjectTracker();
                    }}
                    className="block w-full text-left px-4 py-3 text-secondary-600 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
                  >
                    {tr(t.nav.trackOrder, lang)}
                  </button>
                </div>

                {/* Other nav links */}
                {navigation
                  .filter((n) => n.key !== "home")
                  .map((item) => (
                    <Link
                      key={item.key}
                      href={item.href}
                      className="block px-4 py-3 text-secondary-600 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {tr(t.nav[item.key], lang)}
                    </Link>
                  ))}

                {/* Policy links */}
                <div className="pt-2 border-t border-secondary-100">
                  <p className="px-4 py-2 text-xs text-secondary-400 uppercase tracking-wider">
                    {tr(t.nav.policy, lang)}
                  </p>
                  {policyLinks.map((link) => (
                    <Link
                      key={link.key}
                      href={link.href}
                      className="block px-4 py-3 text-secondary-600 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {tr(t.nav[link.key], lang)}
                    </Link>
                  ))}
                </div>
                <div className="pt-4 px-4 space-y-2">
                  <Link
                    href="/login"
                    className="btn-outline w-full justify-center"
                  >
                    {tr(t.nav.login, lang)}
                  </Link>
                  <Link
                    href="#contact"
                    className="btn-primary w-full justify-center"
                  >
                    {tr(t.nav.cta, lang)}
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Project Tracker Modal */}
      <ProjectTrackerModal
        isOpen={isProjectTrackerOpen}
        onClose={closeProjectTracker}
      />
    </header>
  );
}
