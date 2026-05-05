import { useState, type FormEvent } from "react";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";
import { MagneticButton } from "./MagneticButton";
import { FadeUp } from "./SplitReveal";
import { toast } from "sonner";

export function ContactSection() {
  const [sending, setSending] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    const data = new FormData(e.currentTarget);
    const subject = encodeURIComponent(`Portfolio · ${data.get("name") ?? "Hello"}`);
    const body = encodeURIComponent(`${data.get("message")}\n\n— ${data.get("name")} (${data.get("email")})`);
    window.location.href = `mailto:hello@anushka.dev?subject=${subject}&body=${body}`;
    setTimeout(() => {
      setSending(false);
      toast("Message ready to send — your mail client should be open.");
    }, 600);
  };

  return (
    <section id="contact" className="relative px-6 py-32 md:px-12 md:py-44">
      <div className="mx-auto max-w-5xl">
        <FadeUp className="text-center">
          <div className="font-mono-tech text-[10px] uppercase tracking-[0.4em] text-accent">
            08 / Transmission
          </div>
          <h2 className="font-display mt-6 text-5xl font-light leading-[0.95] md:text-7xl">
            Let&apos;s build something
            <span className="block gradient-text">interesting.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-foreground/65">
            Got an idea or just want to connect? I&apos;m always open to new conversations.
          </p>
        </FadeUp>

        <FadeUp delay={0.15} className="mt-16">
          <form
            onSubmit={onSubmit}
            className="glass mx-auto grid max-w-2xl grid-cols-1 gap-5 rounded-3xl border border-primary/20 p-8 md:p-10"
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <label className="block">
                <span className="font-mono-tech text-[10px] uppercase tracking-[0.3em] text-foreground/55">
                  Name
                </span>
                <input
                  required
                  name="name"
                  data-hover
                  className="mt-2 w-full rounded-xl border border-foreground/15 bg-background/50 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
                  placeholder="Your name"
                />
              </label>
              <label className="block">
                <span className="font-mono-tech text-[10px] uppercase tracking-[0.3em] text-foreground/55">
                  Email
                </span>
                <input
                  required
                  type="email"
                  name="email"
                  data-hover
                  className="mt-2 w-full rounded-xl border border-foreground/15 bg-background/50 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
                  placeholder="you@domain.com"
                />
              </label>
            </div>
            <label className="block">
              <span className="font-mono-tech text-[10px] uppercase tracking-[0.3em] text-foreground/55">
                Message
              </span>
              <textarea
                required
                name="message"
                data-hover
                rows={5}
                className="mt-2 w-full resize-none rounded-xl border border-foreground/15 bg-background/50 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
                placeholder="Tell me what you're cooking up..."
              />
            </label>
            <div className="flex items-center justify-between pt-2">
              <div className="font-mono-tech text-[10px] uppercase tracking-[0.3em] text-foreground/40">
                Avg reply: 24h
              </div>
              <MagneticButton
                onClick={() => {}}
                className="group rounded-full border border-primary/60 bg-gradient-to-r from-primary/30 to-accent/30 px-8 py-3.5 font-mono-tech text-[11px] uppercase tracking-[0.3em] text-foreground transition-all hover:border-primary hover:shadow-neon"
              >
                <button type="submit" disabled={sending} className="cursor-none">
                  {sending ? "Sending..." : "Send message →"}
                </button>
              </MagneticButton>
            </div>
          </form>
        </FadeUp>

        <div className="mt-16 flex flex-wrap justify-center gap-6">
          {[
            { icon: Github, label: "GitHub", href: "#" },
            { icon: Linkedin, label: "LinkedIn", href: "#" },
            { icon: Twitter, label: "Twitter", href: "#" },
            { icon: Mail, label: "Email", href: "mailto:hello@anushka.dev" },
          ].map((s) => (
            <a
              key={s.label}
              href={s.href}
              data-hover
              className="group flex items-center gap-2 rounded-full border border-foreground/15 px-5 py-2.5 font-mono-tech text-[10px] uppercase tracking-[0.3em] text-foreground/70 transition-all hover:border-accent hover:text-accent"
            >
              <s.icon className="h-3.5 w-3.5" />
              {s.label}
            </a>
          ))}
        </div>

        <div className="mt-20 text-center font-mono-tech text-[9px] uppercase tracking-[0.3em] text-foreground/30">
          © 2026 Anushka Mishra · Crafted with code + caffeine
        </div>
      </div>
    </section>
  );
}