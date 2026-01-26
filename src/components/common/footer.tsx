"use client";

import { Sparkles, Github, Twitter, Mail, Heart } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Explore",
      links: [
        { label: "Home", href: "/" },
        { label: "Categories", href: "/category" },
        { label: "Horoscope", href: "/horoscope" },
        { label: "History", href: "/this-day-in-history" }
      ]
    },
    {
      title: "Community",
      links: [
        { label: "About Us", href: "#" },
        { label: "Submit Quiz", href: "#" },
        { label: "Help Center", href: "#" },
        { label: "Privacy Policy", href: "#" }
      ]
    }
  ];

  return (
    <footer className="relative mt-32 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 px-6 py-16 transition-colors duration-500">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-violet-500/20">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">Quiz Zone</span>
            </Link>
            <p className="text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              Elevate your knowledge journey with curated quizzes across thousands of topics. The ultimate destination
              for curious minds.
            </p>
            <div className="flex gap-4">
              <SocialLink icon={<Github className="w-5 h-5" />} href="#" />
              <SocialLink icon={<Twitter className="w-5 h-5" />} href="#" />
              <SocialLink icon={<Mail className="w-5 h-5" />} href="#" />
            </div>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title} className="space-y-6">
              <h4 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors text-sm font-medium"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-slate-500 text-sm">© {currentYear} Quiz Zone. All rights reserved.</p>
          <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-rose-500 animate-pulse fill-rose-500" />
            <span>for knowledge seekers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

const SocialLink = ({ icon, href }: { icon: React.ReactNode; href: string }) => (
  <Link
    href={href}
    className="w-10 h-10 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-white hover:border-violet-200 dark:hover:border-white/20 transition-all duration-300 shadow-sm dark:shadow-none"
  >
    {icon}
  </Link>
);
