import { Mail } from "lucide-react";
import Link from "next/link";
import CurrentYear from "./current-year";
import { Suspense } from "react";
import GithubIcon from "../icons/github-icon";
import XIcon from "../icons/x-icon";
import { Reveal } from "@/components/motion/reveal";

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

export default function Footer() {
  const footerLinks: { title: string; links: FooterLink[] }[] = [
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
    },
    {
      title: "More Projects",
      links: [
        {
          label: "BrowserStay",
          href: "https://browserstay.com/",
          external: true
        }
      ]
    }
  ];

  return (
    <footer className="mt-24 border-t-2 border-foreground bg-background">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        {/* Giant wordmark */}
        <Reveal y={40} className="overflow-hidden py-10 sm:py-14">
          <p
            aria-hidden
            className="select-none text-center font-sans text-[19vw] leading-[0.82] font-black tracking-[-0.05em] uppercase sm:text-[17vw]"
          >
            Quizzy
          </p>
          <p className="mt-4 text-center font-mono text-[10px] font-bold uppercase tracking-[0.35em] text-muted-foreground sm:text-xs">
            An AI-free quiz broadsheet — est. by curious minds
          </p>
        </Reveal>

        {/* Link columns */}
        <div className="rule-dotted grid grid-cols-2 gap-x-6 gap-y-10 py-10 sm:grid-cols-4">
          <div className="col-span-2 space-y-5">
            <p className="max-w-sm font-sans text-sm leading-relaxed text-muted-foreground">
              Thousands of hand-curated questions across every topic we could think of — no AI slop, no sign-up,
              no nonsense. Pick a category, keep score, argue about the answers.
            </p>
            <div className="flex gap-3">
              <SocialLink icon={<GithubIcon className="h-4 w-4" />} href="#" label="GitHub" />
              <SocialLink icon={<XIcon className="h-4 w-4" />} href="#" label="X" />
              <SocialLink icon={<Mail className="h-4 w-4" />} href="mailto:me@probirsarkar.com" label="Email" />
            </div>
          </div>

          {footerLinks.map((section) => (
            <nav key={section.title} aria-label={section.title} className="space-y-4">
              <h4 className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-sans text-sm font-bold underline-offset-4 hover:underline"
                      >
                        {link.label} ↗
                      </a>
                    ) : (
                      <Link href={link.href} className="font-sans text-sm font-bold underline-offset-4 hover:underline">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Colophon bar */}
        <div className="flex flex-col items-center justify-between gap-3 border-t-2 border-foreground py-5 sm:flex-row">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            © <Suspense fallback="2026"><CurrentYear /></Suspense> Quizzy. All rights reserved.
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Set in Archivo &amp; Space Mono
          </p>
        </div>
      </div>
    </footer>
  );
}

const SocialLink = ({ icon, href, label }: { icon: React.ReactNode; href: string; label: string }) => (
  <Link
    href={href}
    aria-label={label}
    className="pop-hover flex h-10 w-10 items-center justify-center border-2 border-foreground bg-background shadow-pop [--pop:var(--pop-cyan)] [--pop-x:3px] [--pop-y:3px] hover:bg-foreground hover:text-background"
  >
    {icon}
  </Link>
);
