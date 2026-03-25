import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@/hooks/useActor";
import {
  ArrowRight,
  BarChart2,
  CheckCircle2,
  ChevronRight,
  Clock,
  Code2,
  Cpu,
  Database,
  ExternalLink,
  Eye,
  GitBranch,
  Github,
  Globe,
  Layers,
  Layout,
  Linkedin,
  Loader2,
  Mail,
  Menu,
  MessageCircle,
  Moon,
  Server,
  Shield,
  Star,
  Sun,
  Twitter,
  X,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ── Theme ──────────────────────────────────────────────────────────────────
function useTheme() {
  const [theme, setTheme] = useState<"dark" | "light">("light");
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);
  return {
    theme,
    toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
  };
}

// ── 3D Tilt Hook ──────────────────────────────────────────────────────────
function use3DTilt() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateX = (y - 0.5) * -12;
      const rotateY = (x - 0.5) * 12;
      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    };

    const onMouseLeave = () => {
      el.style.transform =
        "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
    };

    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseleave", onMouseLeave);
    return () => {
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return ref;
}

// ── Intersection Observer (reveal on scroll) ───────────────────────────────
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12 },
    );
    for (const el of document.querySelectorAll(".reveal")) {
      io.observe(el);
    }
    return () => io.disconnect();
  }, []);
}

// ── Smooth scroll ──────────────────────────────────────────────────────────
function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

// ── Data ───────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "About", id: "about" },
  { label: "Skills", id: "skills" },
  { label: "Projects", id: "projects" },
  { label: "Services", id: "services" },
  { label: "Contact", id: "contact" },
];

const SKILLS = [
  {
    category: "Frontend",
    icon: <Code2 className="w-5 h-5" />,
    items: [
      { name: "Angular", icon: <Code2 className="w-6 h-6" /> },
      { name: "TypeScript", icon: <Code2 className="w-6 h-6" /> },
      { name: "HTML5", icon: <Globe className="w-6 h-6" /> },
      { name: "CSS3", icon: <Layout className="w-6 h-6" /> },
      { name: "JavaScript", icon: <Zap className="w-6 h-6" /> },
    ],
  },
  {
    category: "Backend",
    icon: <Server className="w-5 h-5" />,
    items: [
      { name: "Node.js", icon: <Server className="w-6 h-6" /> },
      { name: "Express", icon: <Layers className="w-6 h-6" /> },
      { name: "REST APIs", icon: <GitBranch className="w-6 h-6" /> },
    ],
  },
  {
    category: "Database & More",
    icon: <Database className="w-5 h-5" />,
    items: [
      { name: "MongoDB", icon: <Database className="w-6 h-6" /> },
      { name: "SQL", icon: <Database className="w-6 h-6" /> },
      { name: "System Design", icon: <Cpu className="w-6 h-6" /> },
    ],
  },
];

const PROJECTS = [
  {
    id: "crm",
    featured: true,
    title: "Automotive CRM System",
    tagline: "Lead management platform that increased conversion rates by 40%",
    problem:
      "Automotive dealerships needed a unified platform to track leads, manage calling operations, and provide role-based dashboards for their teams.",
    features: [
      "Lead pipeline management",
      "Calling dashboard & logs",
      "Role-based access control",
      "Real-time analytics",
    ],
    stack: ["Angular", "Node.js", "MongoDB", "Express", "Chart.js"],
    thumb: "thumb-crm",
    stripe: "project-stripe-crm",
    category: "crm",
  },
  {
    id: "realestate",
    featured: false,
    title: "Real Estate Platform",
    tagline: "Property listing site with advanced search & inquiry management",
    problem:
      "A real estate agency needed a modern web presence to showcase properties, capture leads, and manage inquiries efficiently.",
    features: [
      "Property listings",
      "Advanced filters",
      "Lead capture",
      "Admin panel",
    ],
    stack: ["Angular", "Node.js", "MongoDB"],
    thumb: "thumb-realestate",
    stripe: "project-stripe-web",
    category: "web",
  },
  {
    id: "landing",
    featured: false,
    title: "Business Landing Page",
    tagline: "High-converting landing page with integrated lead capture form",
    problem:
      "A B2B services company needed a conversion-optimised landing page that clearly communicates value and drives enquiries.",
    features: [
      "Conversion-optimised",
      "SEO structured",
      "Fast load",
      "CRM integration",
    ],
    stack: ["HTML", "CSS", "JavaScript", "REST API"],
    thumb: "thumb-landing",
    stripe: "project-stripe-landing",
    category: "web",
  },
  {
    id: "dashboard",
    featured: false,
    title: "Analytics Dashboard UI",
    tagline: "Real-time data dashboard for operations monitoring",
    problem:
      "Operations teams needed a unified view of KPIs, performance metrics, and live data streams in a clean, intuitive interface.",
    features: [
      "Real-time charts",
      "KPI widgets",
      "Data export",
      "Role-based views",
    ],
    stack: ["Angular", "Chart.js", "Node.js", "WebSocket"],
    thumb: "thumb-dashboard",
    stripe: "project-stripe-dashboard",
    category: "dashboard",
  },
];

const SERVICES = [
  {
    icon: <Globe className="w-7 h-7" />,
    title: "Website Development",
    description:
      "Pixel-perfect, performant web applications built with modern frameworks — from landing pages to complex SaaS products.",
  },
  {
    icon: <BarChart2 className="w-7 h-7" />,
    title: "CRM Development",
    description:
      "Custom CRM systems tailored for your business — lead management, sales pipelines, calling dashboards, and role-based access.",
  },
  {
    icon: <Layout className="w-7 h-7" />,
    title: "Dashboard & Admin Panels",
    description:
      "Intuitive admin interfaces with real-time data, charts, and powerful controls to help teams make data-driven decisions.",
  },
  {
    icon: <GitBranch className="w-7 h-7" />,
    title: "API Integration",
    description:
      "Seamless third-party integrations — payment gateways, CRMs, telephony, analytics, and any REST/GraphQL API your business needs.",
  },
];

const WHY_ME = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Business-Focused Development",
    description:
      "I don't just write code — I understand your business goals and build systems that directly improve your bottom line.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Clean & Scalable Code",
    description:
      "Architectured for long-term maintainability. Modular, documented, and built to scale without expensive rewrites.",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "On-Time Delivery",
    description:
      "Structured sprints, daily updates, and a commitment to deadlines — because your launch date matters.",
  },
  {
    icon: <Star className="w-6 h-6" />,
    title: "Indian Market Expertise",
    description:
      "Deep understanding of Indian business workflows, compliance needs, and user expectations built over 3+ years.",
  },
];

const TECH_STRIP = [
  "Angular",
  "Node.js",
  "Express",
  "MongoDB",
  "TypeScript",
  "REST API",
  "SQL",
  "Chart.js",
];

// ── Components ─────────────────────────────────────────────────────────────

function NavBar({
  theme,
  toggleTheme,
}: { theme: string; toggleTheme: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (id: string) => {
    scrollTo(id);
    setMobileOpen(false);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 flex justify-center transition-all duration-300 ${
        scrolled ? "py-3" : "py-4"
      }`}
    >
      <nav
        className={`glass-nav flex items-center justify-between gap-6 px-5 rounded-2xl transition-all duration-300 ${
          scrolled ? "w-[95%] max-w-5xl" : "w-[92%] max-w-5xl"
        }`}
        style={{ minHeight: 56 }}
      >
        {/* Brand */}
        <button
          type="button"
          className="font-bold text-base text-foreground tracking-tight shrink-0 font-display"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <span className="gradient-text">Dev</span>
          <span className="text-foreground">.in</span>
        </button>

        {/* Desktop nav */}
        <div
          className="hidden md:flex items-center gap-1"
          data-ocid="nav.panel"
        >
          {NAV_LINKS.map((l) => (
            <button
              type="button"
              key={l.id}
              data-ocid={`nav.${l.id}.link`}
              onClick={() => handleNav(l.id)}
              className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-primary/5"
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            data-ocid="nav.theme.toggle"
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
          <Button
            data-ocid="nav.hire_me.button"
            size="sm"
            className="hidden md:flex items-center gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 btn-glow font-semibold rounded-xl"
            onClick={() => handleNav("contact")}
          >
            Hire Me <ArrowRight className="w-3.5 h-3.5" />
          </Button>
          <button
            type="button"
            data-ocid="nav.mobile_menu.toggle"
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-colors"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Menu"
          >
            {mobileOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div
          className="mobile-menu-enter md:hidden absolute top-[72px] inset-x-4 glass-nav rounded-2xl p-4 flex flex-col gap-1"
          data-ocid="nav.mobile_menu.panel"
        >
          {NAV_LINKS.map((l) => (
            <button
              type="button"
              key={l.id}
              onClick={() => handleNav(l.id)}
              className="text-left px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-xl hover:bg-primary/5 transition-colors"
            >
              {l.label}
            </button>
          ))}
          <Button
            size="sm"
            className="mt-2 w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-xl"
            onClick={() => handleNav("contact")}
          >
            Hire Me
          </Button>
        </div>
      )}
    </header>
  );
}

function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-28 pb-20 px-4 overflow-hidden"
    >
      {/* Floating orbs */}
      <div
        className="orb absolute top-1/4 right-1/4 w-96 h-96"
        style={{ background: "oklch(0.72 0.18 264)" }}
      />
      <div
        className="orb absolute top-1/2 left-1/6 w-72 h-72"
        style={{
          background: "oklch(0.72 0.18 295)",
          animationDelay: "-4s",
          animationDuration: "10s",
        }}
      />
      <div
        className="orb-sm absolute bottom-1/4 right-1/3 w-48 h-48"
        style={{ background: "oklch(0.76 0.14 210)" }}
      />

      <div className="w-full max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Photo with 3D frame */}
          <div className="order-2 lg:order-1 reveal">
            <div className="relative mx-auto w-fit">
              {/* Outer glow */}
              <div
                className="absolute -inset-6 rounded-[2.5rem] pointer-events-none"
                style={{
                  background: "oklch(0.58 0.22 264 / 0.12)",
                  filter: "blur(40px)",
                }}
              />
              {/* 3D photo container */}
              <div className="hero-photo-3d relative rounded-3xl overflow-hidden card-3d">
                <img
                  src="/assets/uploads/1774465067043-019d265f-7016-7280-905a-64e0a61b8782-1.png"
                  alt="Developer Full Stack Engineer"
                  className="w-full max-w-sm lg:max-w-none lg:w-[420px] h-[480px] lg:h-[540px] object-cover object-top"
                />
                {/* Overlay gradient */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(99,102,241,0.15) 0%, transparent 50%)",
                  }}
                />
                {/* Badge overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div
                    className="glass-pill rounded-2xl px-4 py-3 flex items-center gap-3"
                    style={{
                      background: "rgba(255,255,255,0.92)",
                      border: "1px solid rgba(99,102,241,0.15)",
                    }}
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 ring-2 ring-green-500/30" />
                    <span className="text-sm font-semibold text-foreground">
                      Available for Freelance
                    </span>
                    <div className="ml-auto">
                      <Badge
                        variant="outline"
                        className="text-xs border-primary/40 text-primary"
                      >
                        Hire Now
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text */}
          <div
            className="order-1 lg:order-2 flex flex-col gap-6 reveal"
            style={{ transitionDelay: "120ms" }}
          >
            <div className="flex items-center gap-2">
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{
                  background: "oklch(0.58 0.22 264 / 0.1)",
                  border: "1px solid oklch(0.58 0.22 264 / 0.25)",
                  color: "oklch(0.48 0.22 264)",
                }}
              >
                <Zap className="w-3.5 h-3.5" />
                Full Stack Developer · India
              </div>
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight text-foreground">
              I Build <span className="gradient-text">Scalable</span>
              <br />
              Web Systems
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg">
              Full Stack Developer specializing in CRM systems, dashboards, and
              high-performance web applications. I don't just write code — I
              architect solutions.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button
                data-ocid="hero.view_projects.button"
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 btn-glow font-semibold rounded-xl px-6"
                onClick={() => scrollTo("projects")}
              >
                View Projects <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
              <Button
                data-ocid="hero.hire_me.button"
                size="lg"
                variant="outline"
                className="font-semibold rounded-xl px-6 border-border hover:bg-primary/5 hover:border-primary/30 transition-all"
                onClick={() => scrollTo("contact")}
              >
                Hire Me
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 pt-2">
              {[
                { value: "3+", label: "Years Experience" },
                { value: "20+", label: "Projects Delivered" },
                { value: "15+", label: "Happy Clients" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <span className="text-2xl font-bold font-display gradient-text">
                    {stat.value}
                  </span>
                  <span className="text-xs text-muted-foreground mt-0.5">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom skill cards */}
        <div
          className="mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 reveal stagger"
          style={{ transitionDelay: "200ms" }}
        >
          {[
            {
              icon: <Code2 className="w-5 h-5" />,
              title: "Frontend",
              desc: "Angular · TypeScript",
            },
            {
              icon: <Server className="w-5 h-5" />,
              title: "Backend",
              desc: "Node.js · Express",
            },
            {
              icon: <BarChart2 className="w-5 h-5" />,
              title: "CRM Systems",
              desc: "Lead mgmt · Roles",
            },
            {
              icon: <Database className="w-5 h-5" />,
              title: "Databases",
              desc: "MongoDB · SQL",
            },
            {
              icon: <Layout className="w-5 h-5" />,
              title: "Dashboards",
              desc: "Analytics · Charts",
            },
            {
              icon: <Cpu className="w-5 h-5" />,
              title: "System Design",
              desc: "Scalable arch.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="card-3d tilt-card rounded-2xl p-4 flex flex-col gap-2 cursor-default"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "oklch(0.58 0.22 264 / 0.1)" }}
              >
                <span className="text-primary">{item.icon}</span>
              </div>
              <div>
                <p className="font-semibold text-foreground text-xs">
                  {item.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TechStrip() {
  return (
    <section className="py-12 px-4 border-y border-border/50 section-tint reveal">
      <div className="max-w-5xl mx-auto">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-8">
          Trusted Technologies
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {TECH_STRIP.map((tech) => (
            <span
              key={tech}
              className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors px-4 py-2 rounded-xl skill-tile cursor-default"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="py-24 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="reveal">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
              About Me
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-foreground mb-6 leading-tight">
              Building Systems That{" "}
              <span className="gradient-text">Matter</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-5">
              I'm a Full Stack Developer based in India with 3+ years of
              experience building scalable web applications and
              business-critical systems. My work focuses on CRM platforms,
              dashboards, and high-performance web apps that solve real
              problems.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              I specialise in Angular on the frontend paired with Node.js +
              Express on the backend. Whether it's an automotive lead management
              system or a real-time analytics dashboard, I approach every
              project with a business-first mindset.
            </p>
            <Button
              data-ocid="about.contact.button"
              className="bg-primary text-primary-foreground hover:bg-primary/90 btn-glow font-semibold rounded-xl"
              onClick={() => scrollTo("contact")}
            >
              Let's Work Together <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div
            className="grid grid-cols-2 gap-4 reveal stagger"
            style={{ transitionDelay: "120ms" }}
          >
            {[
              {
                icon: <Code2 className="w-6 h-6" />,
                title: "Frontend",
                desc: "Angular, TypeScript, RxJS",
              },
              {
                icon: <Server className="w-6 h-6" />,
                title: "Backend",
                desc: "Node.js, Express, REST APIs",
              },
              {
                icon: <BarChart2 className="w-6 h-6" />,
                title: "CRM Systems",
                desc: "Lead mgmt, pipelines, roles",
              },
              {
                icon: <Database className="w-6 h-6" />,
                title: "Databases",
                desc: "MongoDB, SQL, Query opt.",
              },
              {
                icon: <Layout className="w-6 h-6" />,
                title: "Dashboards",
                desc: "Analytics, charts, admin",
              },
              {
                icon: <Cpu className="w-6 h-6" />,
                title: "System Design",
                desc: "Scalable, maintainable arch.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="card-3d tilt-card rounded-2xl p-5 flex flex-col gap-3 cursor-default"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "oklch(0.58 0.22 264 / 0.1)" }}
                >
                  <span className="text-primary">{item.icon}</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SkillsSection() {
  return (
    <section
      id="skills"
      className="py-24 px-4 relative section-tint section-mesh"
    >
      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-14 reveal">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            Expertise
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-foreground">
            Skills & <span className="gradient-text">Technologies</span>
          </h2>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto">
            A focused stack built around delivering high-quality business
            applications.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-8">
          {SKILLS.map((group, gi) => (
            <div
              key={group.category}
              className="reveal"
              style={{ transitionDelay: `${gi * 100}ms` }}
            >
              <div className="flex items-center gap-2 mb-5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "oklch(0.58 0.22 264 / 0.12)" }}
                >
                  <span className="text-primary">{group.icon}</span>
                </div>
                <h3 className="font-display font-bold text-foreground text-lg">
                  {group.category}
                </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-1 gap-3">
                {group.items.map((item) => (
                  <div
                    key={item.name}
                    className="skill-tile rounded-2xl p-4 flex items-center gap-3 cursor-default"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: "oklch(0.58 0.22 264 / 0.1)" }}
                    >
                      <span className="text-primary">{item.icon}</span>
                    </div>
                    <span className="font-semibold text-foreground text-sm">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  idx,
}: {
  project: (typeof PROJECTS)[number];
  idx: number;
}) {
  const tiltRef = use3DTilt();

  return (
    <div
      ref={tiltRef}
      data-ocid={`projects.item.${idx + 1}`}
      className={`card-3d tilt-card rounded-3xl overflow-hidden reveal ${
        project.featured ? "sm:col-span-2" : ""
      }`}
      style={{ transitionDelay: `${idx * 80}ms` }}
    >
      {/* Colorful accent stripe */}
      <div className={`${project.stripe} h-1`} />

      {/* Thumbnail */}
      <div
        className={`${project.thumb} relative ${
          project.featured ? "h-56" : "h-44"
        } flex items-center justify-center overflow-hidden`}
      >
        {project.featured && (
          <div
            className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{
              background: "rgba(255,255,255,0.9)",
              border: "1px solid rgba(99,102,241,0.2)",
              color: "oklch(0.48 0.22 264)",
            }}
          >
            <Star className="w-3.5 h-3.5 text-yellow-500" />
            Featured Project
          </div>
        )}
        <div className="text-center px-6">
          <p
            className="text-3xl font-black tracking-tighter font-display"
            style={{ color: "oklch(0.35 0.12 264 / 0.6)" }}
          >
            {project.title.split(" ").slice(0, 2).join(" ")}
          </p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-transparent" />
      </div>

      <div className="p-6">
        <div
          className={`${project.featured ? "grid sm:grid-cols-2 gap-6" : ""}`}
        >
          <div>
            <h3 className="font-display font-bold text-foreground text-lg mb-1">
              {project.title}
            </h3>
            <p className="text-sm text-primary font-semibold mb-3">
              {project.tagline}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {project.problem}
            </p>
            {project.featured && (
              <div className="mt-4 grid grid-cols-2 gap-2">
                {project.features.map((f) => (
                  <div
                    key={f}
                    className="flex items-center gap-2 text-xs text-muted-foreground"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div
            className={`${
              project.featured ? "flex flex-col justify-between" : "mt-4"
            }`}
          >
            {!project.featured && (
              <div className="flex flex-wrap gap-2 mb-4">
                {project.features.map((f) => (
                  <span
                    key={f}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground"
                  >
                    <CheckCircle2 className="w-3 h-3 text-primary" />
                    {f}
                  </span>
                ))}
              </div>
            )}
            <div>
              <div className="flex flex-wrap gap-2 mb-5">
                {project.stack.map((s) => (
                  <Badge
                    key={s}
                    variant="outline"
                    className="text-xs border-primary/20 text-primary bg-primary/5 rounded-full px-3"
                  >
                    {s}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-3">
                <Button
                  data-ocid={`projects.item.${idx + 1}.button`}
                  size="sm"
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 btn-glow rounded-xl font-semibold text-xs"
                >
                  <Eye className="w-3.5 h-3.5 mr-1.5" /> Live Demo
                </Button>
                <Button
                  data-ocid={`projects.item.${idx + 1}.secondary_button`}
                  size="sm"
                  variant="outline"
                  className="flex-1 rounded-xl font-semibold text-xs border-border hover:bg-primary/5 hover:border-primary/30"
                >
                  <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectsSection() {
  const [filter, setFilter] = useState("all");
  const FILTERS = ["all", "crm", "web", "dashboard"];

  const filtered =
    filter === "all" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

  return (
    <section id="projects" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 reveal">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            Portfolio
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-foreground">
            Selected <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto">
            Real solutions for real businesses — each built to solve a specific
            problem.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center justify-center gap-2 mb-10 flex-wrap reveal">
          {FILTERS.map((f) => (
            <button
              type="button"
              key={f}
              data-ocid="projects.filter.tab"
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold capitalize transition-all duration-200 ${
                filter === f
                  ? "bg-primary text-primary-foreground shadow-glow-indigo"
                  : "text-muted-foreground hover:text-foreground hover:bg-primary/5 border border-border"
              }`}
            >
              {f === "all" ? "All Work" : f.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 gap-6">
          {filtered.map((project, idx) => (
            <ProjectCard key={project.id} project={project} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  return (
    <section
      id="services"
      className="py-24 px-4 relative section-tint section-mesh"
    >
      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-14 reveal">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            What I Offer
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-foreground">
            My <span className="gradient-text">Services</span>
          </h2>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto">
            End-to-end development services designed around your business
            objectives.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map((svc, i) => (
            <div
              key={svc.title}
              data-ocid={`services.item.${i + 1}`}
              className="card-3d tilt-card rounded-3xl p-6 flex flex-col gap-4 reveal cursor-default"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: "oklch(0.58 0.22 264 / 0.1)" }}
              >
                <span className="text-primary">{svc.icon}</span>
              </div>
              <div>
                <h3 className="font-display font-bold text-foreground mb-2">
                  {svc.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {svc.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyMeSection() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 reveal">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            Why Work With Me
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-foreground">
            The <span className="gradient-text">Difference</span>
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {WHY_ME.map((item, i) => (
            <div
              key={item.title}
              className="card-3d tilt-card rounded-3xl p-6 reveal cursor-default"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: "oklch(0.58 0.22 264 / 0.1)" }}
              >
                <span className="text-primary">{item.icon}</span>
              </div>
              <h3 className="font-display font-bold text-foreground mb-2 text-sm">
                {item.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const { actor } = useActor();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!actor) return;
      setSubmitting(true);
      try {
        await actor.submitContactForm(form.name, form.email, form.message);
        toast.success("Message sent! I'll get back to you soon.");
        setForm({ name: "", email: "", message: "" });
      } catch {
        toast.error("Something went wrong. Try WhatsApp instead.");
      } finally {
        setSubmitting(false);
      }
    },
    [actor, form],
  );

  return (
    <section id="contact" className="py-24 px-4 relative section-tint">
      <div className="absolute inset-0 glow-hero pointer-events-none" />
      <div className="max-w-6xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div className="reveal">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
              Let's Talk
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-foreground mb-5 leading-tight">
              Ready to Build Something{" "}
              <span className="gradient-text">Exceptional?</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-sm">
              Whether you need a CRM, a dashboard, or a complete web application
              — I'd love to hear about your project. Let's discuss how I can
              help.
            </p>

            <div className="flex flex-col gap-4">
              <a
                data-ocid="contact.whatsapp.button"
                href="https://wa.me/91XXXXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-5 py-4 rounded-2xl font-semibold text-sm transition-all duration-200 hover:-translate-y-1"
                style={{
                  background: "#25D366",
                  color: "#fff",
                  boxShadow: "0 8px 32px -8px rgba(37,211,102,0.4)",
                }}
              >
                <MessageCircle className="w-5 h-5" />
                Chat on WhatsApp
                <ArrowRight className="w-4 h-4 ml-auto" />
              </a>
              <a
                data-ocid="contact.email.link"
                href="mailto:hello@yourdomain.com"
                className="flex items-center gap-3 px-5 py-4 rounded-2xl font-semibold text-sm skill-tile hover:-translate-y-1 transition-all duration-200"
              >
                <Mail className="w-5 h-5 text-primary" />
                <span className="text-foreground">hello@yourdomain.com</span>
                <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground" />
              </a>
            </div>
          </div>

          {/* Right: form */}
          <div
            className="card-3d rounded-3xl p-8 reveal"
            style={{ transitionDelay: "120ms" }}
            data-ocid="contact.dialog"
          >
            <h3 className="font-display font-bold text-foreground mb-6 text-xl">
              Send a Message
            </h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="contact-name"
                  className="text-xs font-semibold text-muted-foreground mb-1.5 block"
                >
                  Your Name
                </label>
                <Input
                  id="contact-name"
                  data-ocid="contact.name.input"
                  placeholder="John Smith"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  required
                  className="bg-background border-border focus:border-primary rounded-xl"
                />
              </div>
              <div>
                <label
                  htmlFor="contact-email"
                  className="text-xs font-semibold text-muted-foreground mb-1.5 block"
                >
                  Email Address
                </label>
                <Input
                  id="contact-email"
                  data-ocid="contact.email.input"
                  type="email"
                  placeholder="john@company.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  required
                  className="bg-background border-border focus:border-primary rounded-xl"
                />
              </div>
              <div>
                <label
                  htmlFor="contact-message"
                  className="text-xs font-semibold text-muted-foreground mb-1.5 block"
                >
                  Message
                </label>
                <Textarea
                  id="contact-message"
                  data-ocid="contact.message.textarea"
                  placeholder="Tell me about your project..."
                  value={form.message}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, message: e.target.value }))
                  }
                  required
                  rows={4}
                  className="bg-background border-border focus:border-primary rounded-xl resize-none"
                />
              </div>
              <Button
                data-ocid="contact.submit.button"
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 btn-glow font-semibold rounded-xl py-5 mt-1"
              >
                {submitting ? (
                  <>
                    <Loader2
                      className="w-4 h-4 mr-2 animate-spin"
                      data-ocid="contact.loading_state"
                    />{" "}
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border/50 py-12 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="font-display font-bold text-lg mb-3">
              <span className="gradient-text">Dev</span>
              <span className="text-foreground">.in</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Full Stack Developer building scalable systems that drive business
              growth. Based in India, serving clients worldwide.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Navigation
            </p>
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map((l) => (
                <button
                  type="button"
                  key={l.id}
                  data-ocid={`footer.${l.id}.link`}
                  onClick={() => scrollTo(l.id)}
                  className="text-left text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Connect
            </p>
            <div className="flex gap-3">
              {[
                {
                  icon: <Github className="w-4 h-4" />,
                  href: "https://github.com",
                  label: "GitHub",
                },
                {
                  icon: <Linkedin className="w-4 h-4" />,
                  href: "https://linkedin.com",
                  label: "LinkedIn",
                },
                {
                  icon: <Twitter className="w-4 h-4" />,
                  href: "https://twitter.com",
                  label: "Twitter",
                },
              ].map((s) => (
                <a
                  key={s.label}
                  data-ocid={`footer.${s.label.toLowerCase()}.link`}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-10 h-10 rounded-xl skill-tile flex items-center justify-center text-muted-foreground hover:text-primary transition-all"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>
            © {year}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors underline underline-offset-2"
            >
              caffeine.ai
            </a>
          </span>
          <span>Designed & Developed in India 🇮🇳</span>
        </div>
      </div>
    </footer>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────
export default function App() {
  const { theme, toggle } = useTheme();
  useReveal();

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />
      <NavBar theme={theme} toggleTheme={toggle} />
      <main>
        <HeroSection />
        <TechStrip />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ServicesSection />
        <WhyMeSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
