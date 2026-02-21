"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Lang = "en" | "ru" | "sr";
type ChatMsg = { role: "user" | "assistant"; content: string };

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function getInitialLang(): Lang {
  if (typeof window === "undefined") return "en";
  const saved = window.localStorage.getItem("aimax_lang");
  if (saved === "en" || saved === "ru" || saved === "sr") return saved;
  const n = (navigator.language || "").toLowerCase();
  if (n.startsWith("ru")) return "ru";
  if (n.startsWith("sr")) return "sr";
  return "en";
}

const COPY: Record<
  Lang,
  {
    nav: { problem: string; solution: string; work: string; pricing: string; team: string; contact: string };
    top: { talk: string; getStarted: string; badge: string; sub: string; cta1: string; cta2: string };
    hero: { h1a: string; h1b: string; lead: string };
    proof: { a: string; b: string; c: string };
    stats: { s1t: string; s1d: string; s2t: string; s2d: string; s3t: string; s3d: string; s4t: string; s4d: string };

    problem: { title: string; h2: string; lead: string; p1t: string; p1d: string; p2t: string; p2d: string; p3t: string; p3d: string };
    solution: { title: string; h2: string; lead: string; s1t: string; s1d: string; s2t: string; s2d: string; s3t: string; s3d: string };
    demo: { title: string; h2: string; lead: string; d1t: string; d1d: string; d2t: string; d2d: string; d3t: string; d3d: string; };

    work: { title: string; h2: string; lead: string; items: { title: string; meta: string; text: string }[] };
    pricing: { title: string; h2: string; lead: string; oneTime: string; monthly: string; onePrice: string; monthPrice: string; bullets1: string[]; bullets2: string[]; roi: string };
    team: { title: string; h2: string; lead: string; people: { initials: string; role: string; name: string; bio: string }[] };

    contact: { title: string; h2: string; lead: string; name: string; contact: string; company: string; website: string; msg: string; send: string; success: string; direct: string; };
    chat: { fabOpen: string; fabClose: string; headerTitle: string; headerSub: string; inputPh: string; send: string; thinking: string; welcome: string; };
    misc: { langEN: string; langRU: string; langSR: string; footer: string; };
  }
> = {
  en: {
    nav: { problem: "Problem", solution: "Solution", work: "Work", pricing: "Pricing", team: "Team", contact: "Get Started" },
    top: { talk: "Talk to AI Agent", getStarted: "Get Started", badge: "AI-Powered · 3–5 Days · Enterprise-Grade", sub: "AI Agent →", cta1: "Get Started from €1,000", cta2: "Talk to AI Agent" },
    hero: {
      h1a: "Your Business Deserves a",
      h1b: "Digital Employee, Not Just a Website",
      lead:
        "We replace slow, expensive development with an AI pipeline — enterprise-grade smart websites and autonomous agents in 3–5 days.",
    },
    proof: { a: "CIO Awards 2021", b: "⭐ 5× Digital Disruption", c: "Lyon Startup" },
    stats: {
      s1t: "3–5", s1d: "Days to Launch",
      s2t: "€62K", s2d: "Pipeline Contracts",
      s3t: "24/7", s3d: "AI Agent Works",
      s4t: "AEO", s4d: "Visible in AI Search",
    },
    problem: {
      title: "The Problem",
      h2: "Why 90% of SMB Websites Fail to Bring Clients",
      lead: "Small businesses are stuck between expensive agencies and tools that don’t deliver real results.",
      p1t: "Your website is silent",
      p1d: "It looks nice but can’t sell, answer, or book. It’s a brochure, not a business tool.",
      p2t: "Agencies are too slow (and costly)",
      p2d: "Months. Thousands. Still no AI. SMB can’t afford to wait or overpay.",
      p3t: "You’re invisible to AI search",
      p3d: "If ChatGPT doesn’t know you exist, your future clients won’t find you. AEO is the new SEO.",
    },
    solution: {
      title: "Our Solution",
      h2: "One System. Three Superpowers.",
      lead: "We don’t sell websites. We sell digital employees that work for your business around the clock.",
      s1t: "Smart Website",
      s1d: "Modern, fast, conversion-optimized. AEO-ready — appears in AI answers.",
      s2t: "AI Administrator",
      s2d: "Built-in agent that communicates, sells, answers and books — 24/7, no salary.",
      s3t: "Auto-Promotion",
      s3d: "Content generation keeps your business visible to AI search engines.",
    },
    demo: {
      title: "Live Demo",
      h2: "Don’t Take Our Word for It — Talk to the Agent",
      lead: "This is exactly what your clients experience on your website.",
      d1t: "Answers instantly",
      d1d: "No waiting. No “we’ll get back to you”.",
      d2t: "Qualifies & converts",
      d2d: "Trained to turn visitors into leads and customers.",
      d3t: "Multilingual",
      d3d: "EN / RU / SR — speaks your client’s language.",
    },
    work: {
      title: "Portfolio",
      h2: "Built by AIMAX. Running on Autopilot.",
      lead: "Each project is a fully autonomous digital system — not just a website.",
      items: [
        { title: "AI Scheduling", meta: "AI Assistant · SaaS", text: "Personal AI for scheduling across Telegram, Slack & M365." },
        { title: "AI Dispatcher", meta: "AI Agent · B2B", text: "Cuts through communication noise and prevents missed deals." },
        { title: "AI Events Platform", meta: "AI Platform · Events", text: "Connects event industry players and crafts unique experiences." },
      ],
    },
    pricing: {
      title: "Pricing",
      h2: "Less Than 3 Days of a Human Administrator’s Salary",
      lead: "Your AI employee works 24/7 and never calls in sick.",
      oneTime: "One-Time Setup",
      monthly: "Monthly Subscription",
      onePrice: "€1,000+",
      monthPrice: "€50–100 / month",
      bullets1: ["Smart website or app", "AI agent integration", "AEO-ready architecture", "Delivered in 3–5 days"],
      bullets2: ["AI agent operation 24/7", "Hosting & infrastructure", "Auto content generation", "Analytics & support"],
      roi: "ROI in month 1 — guaranteed.",
    },
    team: {
      title: "The Team",
      h2: "People Behind AIMAX",
      lead: "Small, focused, moving fast. Enterprise systems — now accessible to everyone.",
      people: [
        { initials: "NK", role: "CEO", name: "Natalia Kochetkova", bio: "ex-KROK. Complex project & team management. Turns vision into execution." },
        { initials: "MT", role: "CBDO", name: "Maxim Tarasenko", bio: "Building partner network for scalable EU sales. Expansion into France & EU." },
        { initials: "EK", role: "CTO", name: "Evgeny Krivov", bio: "Creator of Altrp. Architect of the AI pipeline delivering sites in 3–5 days." },
      ],
    },
    contact: {
      title: "Get Started",
      h2: "Ready to Hire Your First AI Employee?",
      lead: "Fill in the form — we’ll come back within 24 hours with a tailored plan.",
      name: "Name",
      contact: "Email or Telegram",
      company: "Company (optional)",
      website: "Website (optional)",
      msg: "What do you want to automate / sell / book?",
      send: "Send",
      success: "✅ Got it! We’ll reach you within 24 hours.",
      direct: "Or reach us directly: info@aimax.rs · +381 62 935 38 60",
    },
    chat: {
      fabOpen: "Talk to AI",
      fabClose: "Close",
      headerTitle: "AIMAX Agent",
      headerSub: "Landing, MVP, automation",
      inputPh: "Type your message…",
      send: "Send",
      thinking: "Thinking…",
      welcome:
        "Hi. I’m AIMAX Agent.\nDescribe your business and what you want to improve (sales, bookings, support) — I’ll propose a plan.",
    },
    misc: { langEN: "EN", langRU: "RU", langSR: "SR", footer: "© AIMAX · Serbia · France · EU" },
  },

  ru: {
    nav: { problem: "Проблема", solution: "Решение", work: "Проекты", pricing: "Цены", team: "Команда", contact: "Заявка" },
    top: { talk: "AI Агент", getStarted: "Начать", badge: "AI-Платформа · 3–5 дней · Enterprise-уровень", sub: "AI Агент →", cta1: "Начать от €1,000", cta2: "Поговорить с агентом" },
    hero: {
      h1a: "Ваш бизнес заслуживает",
      h1b: "цифрового сотрудника, а не просто сайта",
      lead:
        "Заменяем дорогую и долгую разработку AI-конвейером — умные сайты и автономные агенты уровня Enterprise за 3–5 дней.",
    },
    proof: { a: "CIO Awards 2021", b: "⭐ 5× Digital Disruption", c: "Lyon Startup" },
    stats: {
      s1t: "3–5", s1d: "дней до запуска",
      s2t: "€62K", s2d: "контракты в работе",
      s3t: "24/7", s3d: "агент работает",
      s4t: "AEO", s4d: "видимость в AI",
    },
    problem: {
      title: "Проблема",
      h2: "Почему 90% сайтов МСБ не приносят клиентов",
      lead: "Малый и средний бизнес застрял между дорогими агентствами и инструментами без результата.",
      p1t: "Ваш сайт молчит",
      p1d: "Красивый, но не продаёт, не отвечает, не записывает. Брошюра, а не инструмент.",
      p2t: "Агентства — дорого и долго",
      p2d: "Месяцы. Тысячи евро. И всё равно без AI. МСБ не может ждать и переплачивать.",
      p3t: "Вас нет в AI-поиске",
      p3d: "Если ChatGPT вас не знает — клиенты вас не найдут. AEO — это новый SEO.",
    },
    solution: {
      title: "Наше решение",
      h2: "Одна система. Три суперсилы.",
      lead: "Мы продаём не сайты. Мы продаём цифровых сотрудников, работающих круглосуточно.",
      s1t: "Умный сайт",
      s1d: "Быстрый, конверсионный, AEO-готов — появляется в AI-ответах.",
      s2t: "AI-администратор",
      s2d: "Встроенный агент: общается, продаёт, отвечает и записывает 24/7. Без зарплаты.",
      s3t: "Авто-продвижение",
      s3d: "Автогенерация контента поддерживает видимость в AI-поиске.",
    },
    demo: {
      title: "Живое демо",
      h2: "Не верьте на слово — поговорите с агентом",
      lead: "Именно так ваши клиенты общаются на сайте.",
      d1t: "Отвечает мгновенно",
      d1d: "Без ожидания и «мы перезвоним».",
      d2t: "Квалифицирует и закрывает",
      d2d: "Обучен превращать посетителей в заявки и клиентов.",
      d3t: "Многоязычный",
      d3d: "RU / EN / SR — говорит на языке клиента.",
    },
    work: {
      title: "Портфолио",
      h2: "Создано AIMAX. Работает на автопилоте.",
      lead: "Каждый проект — автономная цифровая система, а не просто сайт.",
      items: [
        { title: "AI-планирование", meta: "AI Assistant · SaaS", text: "Персональный AI для планирования в Telegram, Slack и M365." },
        { title: "AI-диспетчер", meta: "AI Agent · B2B", text: "Убирает хаос в чатах и помогает не терять сделки." },
        { title: "AI-платформа ивентов", meta: "AI Platform · Events", text: "Объединяет участников рынка и создаёт персонализированные сценарии." },
      ],
    },
    pricing: {
      title: "Цены",
      h2: "Дешевле зарплаты администратора за 3 дня",
      lead: "Ваш AI-сотрудник работает 24/7 и никогда не берёт больничный.",
      oneTime: "Единоразово",
      monthly: "Ежемесячно",
      onePrice: "€1,000+",
      monthPrice: "€50–100 / мес",
      bullets1: ["Умный сайт или приложение", "Интеграция AI агента", "AEO-готовая архитектура", "Готово за 3–5 дней"],
      bullets2: ["Работа агента 24/7", "Хостинг и инфраструктура", "Автогенерация контента", "Аналитика и поддержка"],
      roi: "Окупаемость в 1-й месяц — гарантировано.",
    },
    team: {
      title: "Команда",
      h2: "Люди за AIMAX",
      lead: "Небольшая команда, быстрые решения. Enterprise-уровень — теперь доступен МСБ.",
      people: [
        { initials: "НК", role: "CEO", name: "Natalia Kochetkova", bio: "ex-KROK. Управление сложными проектами и командами. Переводит видение в результат." },
        { initials: "МТ", role: "CBDO", name: "Maxim Tarasenko", bio: "Строит партнёрскую сеть. Ведёт экспансию во Францию и ЕС." },
        { initials: "ЕК", role: "CTO", name: "Evgeny Krivov", bio: "Создатель Altrp. Архитектор AI-конвейера для создания сайтов за 3–5 дней." },
      ],
    },
    contact: {
      title: "Начать",
      h2: "Готовы нанять первого AI-сотрудника?",
      lead: "Оставьте заявку — ответим в течение 24 часов с планом под ваш бизнес.",
      name: "Имя",
      contact: "Email или Telegram",
      company: "Компания (необязательно)",
      website: "Сайт (необязательно)",
      msg: "Что хотите улучшить: лиды / записи / поддержка / продажи?",
      send: "Отправить",
      success: "✅ Получили! Напишем в течение 24 часов.",
      direct: "Или напишите напрямую: info@aimax.rs · +381 62 935 38 60",
    },
    chat: {
      fabOpen: "Чат с AI",
      fabClose: "Закрыть",
      headerTitle: "AIMAX Agent",
      headerSub: "Лендинг, MVP, автоматизация",
      inputPh: "Напиши сообщение…",
      send: "Отправить",
      thinking: "Думаю…",
      welcome:
        "Привет. Я AIMAX Agent.\nОпиши бизнес и что хочешь улучшить (лиды/записи/поддержка) — предложу план.",
    },
    misc: { langEN: "EN", langRU: "RU", langSR: "SR", footer: "© AIMAX · Serbia · France · EU" },
  },

  sr: {
    nav: { problem: "Problem", solution: "Rešenje", work: "Projekti", pricing: "Cene", team: "Tim", contact: "Počnite" },
    top: { talk: "AI Agent", getStarted: "Počnite", badge: "AI platforma · 3–5 dana · Enterprise", sub: "AI Agent →", cta1: "Počnite od €1,000", cta2: "Razgovarajte s agentom" },
    hero: {
      h1a: "Vaš biznis zaslužuje",
      h1b: "digitalnog zaposlenog, ne samo sajt",
      lead:
        "Zamenjujemo skupi i spori razvoj AI pipeline-om — pametni sajtovi i autonomni agenti za 3–5 dana.",
    },
    proof: { a: "CIO Awards 2021", b: "⭐ 5× Digital Disruption", c: "Lyon Startup" },
    stats: {
      s1t: "3–5", s1d: "dana do lansiranja",
      s2t: "€62K", s2d: "ugovori u toku",
      s3t: "24/7", s3d: "agent radi",
      s4t: "AEO", s4d: "vidljivost u AI",
    },
    problem: {
      title: "Problem",
      h2: "Zašto 90% sajtova MSP ne donosi klijente",
      lead: "MSP su zaglavljeni između skupih agencija i alata koji ne daju rezultat.",
      p1t: "Vaš sajt ćuti",
      p1d: "Izgleda lepo, ali ne prodaje, ne odgovara, ne zakazuje. Brošura, ne alat.",
      p2t: "Agencije su spore i skupe",
      p2d: "Meseci. Hiljade evra. I dalje bez AI. MSP ne može da čeka niti da preplaćuje.",
      p3t: "Nevidljivi ste u AI pretrazi",
      p3d: "Ako ChatGPT ne zna da postojite — klijenti vas neće naći. AEO je novi SEO.",
    },
    solution: {
      title: "Naše rešenje",
      h2: "Jedan sistem. Tri supermoći.",
      lead: "Ne prodajemo sajtove. Prodajemo digitalne zaposlene koji rade 24/7 za vaš biznis.",
      s1t: "Pametni sajt",
      s1d: "Brz, konverziono optimizovan, AEO-spreman — pojavljuje se u AI odgovorima.",
      s2t: "AI Administrator",
      s2d: "Ugrađeni agent: komunicira, prodaje, odgovara i zakazuje 24/7. Bez plate.",
      s3t: "Auto-promocija",
      s3d: "Auto sadržaj održava vidljivost u AI pretraživačima.",
    },
    demo: {
      title: "Uživo demo",
      h2: "Ne verujte na reč — razgovarajte s agentom",
      lead: "Tačno ovako vaši klijenti doživljavaju vaš sajt.",
      d1t: "Odgovara odmah",
      d1d: "Bez čekanja i „javićemo se“. ",
      d2t: "Kvalifikuje i konvertuje",
      d2d: "Obučen da pretvori posetioce u lead-ove i klijente.",
      d3t: "Višejezičan",
      d3d: "SR / EN / RU — govori jezik klijenta.",
    },
    work: {
      title: "Portfolio",
      h2: "Napravljeno od AIMAX. Radi na autopilotu.",
      lead: "Svaki projekat je autonomni digitalni sistem — ne samo sajt.",
      items: [
        { title: "AI zakazivanje", meta: "AI Assistant · SaaS", text: "Lično AI zakazivanje kroz Telegram, Slack i M365." },
        { title: "AI dispečer", meta: "AI Agent · B2B", text: "Eliminiše komunikacioni šum i sprečava gubitak deal-ova." },
        { title: "AI event platforma", meta: "AI Platform · Events", text: "Povezuje učesnike industrije i pravi jedinstvena iskustva." },
      ],
    },
    pricing: {
      title: "Cene",
      h2: "Manje od 3 dana plate ljudskog administratora",
      lead: "Vaš AI zaposleni radi 24/7 i nikad ne uzima bolovanje.",
      oneTime: "Jednokratno",
      monthly: "Mesečno",
      onePrice: "€1,000+",
      monthPrice: "€50–100 / mesečno",
      bullets1: ["Pametni sajt ili aplikacija", "Integracija AI agenta", "AEO-spremna arhitektura", "Isporučeno za 3–5 dana"],
      bullets2: ["Rad agenta 24/7", "Hosting i infrastruktura", "Auto generisanje sadržaja", "Analitika i podrška"],
      roi: "Povrat u prvom mesecu — garantovano.",
    },
    team: {
      title: "Tim",
      h2: "Ljudi iza AIMAX-a",
      lead: "Mali, fokusirani, brzi. Enterprise sistemi — sada dostupni MSP.",
      people: [
        { initials: "NK", role: "CEO", name: "Natalia Kochetkova", bio: "ex-KROK. Upravljanje projektima i timovima. Pretvara viziju u izvršenje." },
        { initials: "MT", role: "CBDO", name: "Maxim Tarasenko", bio: "Gradi partnersku mrežu. Vodi ekspanziju u Francusku i EU." },
        { initials: "EK", role: "CTO", name: "Evgeny Krivov", bio: "Kreator Altrp. Arhitekta AI pipeline-a za 3–5 dana." },
      ],
    },
    contact: {
      title: "Počnite",
      h2: "Spremni da zaposlite prvog AI radnika?",
      lead: "Popunite formu — javićemo se u roku od 24h sa planom za vaš biznis.",
      name: "Ime",
      contact: "Email ili Telegram",
      company: "Kompanija (opciono)",
      website: "Sajt (opciono)",
      msg: "Šta želite da unapredite: prodaju / zakazivanje / podršku?",
      send: "Pošalji",
      success: "✅ Primili smo! Javićemo se u roku od 24h.",
      direct: "Ili kontaktirajte direktno: info@aimax.rs · +381 62 935 38 60",
    },
    chat: {
      fabOpen: "AI chat",
      fabClose: "Zatvori",
      headerTitle: "AIMAX Agent",
      headerSub: "Landing, MVP, automatizacija",
      inputPh: "Unesite poruku…",
      send: "Pošalji",
      thinking: "Razmišljam…",
      welcome:
        "Zdravo. Ja sam AIMAX Agent.\nOpišite biznis i šta želite da unapredite (prodaja/zakazivanje/podrška) — predložiću plan.",
    },
    misc: { langEN: "EN", langRU: "RU", langSR: "SR", footer: "© AIMAX · Serbia · France · EU" },
  },
};

export default function Page() {
  const [lang, setLang] = useState<Lang>("en");
  useEffect(() => setLang(getInitialLang()), []);
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("aimax_lang", lang);
    document.documentElement.lang = lang === "sr" ? "sr" : lang;
  }, [lang]);

  const t = COPY[lang];

  // Chat
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([{ role: "assistant", content: COPY.en.chat.welcome }]);
  useEffect(() => {
    setMessages((prev) => (prev.length === 1 && prev[0]?.role === "assistant" ? [{ role: "assistant", content: t.chat.welcome }] : prev));
  }, [t.chat.welcome]);
  const listRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!chatOpen) return;
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    });
  }, [chatOpen, messages]);

  const canSendChat = useMemo(() => chatInput.trim().length > 0 && !chatLoading, [chatInput, chatLoading]);

  async function sendChat() {
    const text = chatInput.trim();
    if (!text || chatLoading) return;

    setChatInput("");
    const next = [...messages, { role: "user", content: text } as ChatMsg];
    setMessages(next);
    setChatLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ lang, messages: next }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error?.message || `Request failed (${res.status})`);

      setMessages((prev) => [...prev, { role: "assistant", content: data?.message?.content ?? "" }]);
    } catch (e: any) {
      setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${String(e?.message || e)}` }]);
    } finally {
      setChatLoading(false);
    }
  }

  // Lead form
  const [leadName, setLeadName] = useState("");
  const [leadContact, setLeadContact] = useState("");
  const [leadCompany, setLeadCompany] = useState("");
  const [leadWebsite, setLeadWebsite] = useState("");
  const [leadMsg, setLeadMsg] = useState("");
  const [leadLoading, setLeadLoading] = useState(false);
  const [leadDone, setLeadDone] = useState(false);

  const canSendLead = useMemo(() => {
    return !leadLoading && leadName.trim() && leadContact.trim() && leadMsg.trim();
  }, [leadLoading, leadName, leadContact, leadMsg]);

  async function sendLead(e: React.FormEvent) {
    e.preventDefault();
    if (!canSendLead) return;

    setLeadLoading(true);
    setLeadDone(false);

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          lang,
          name: leadName.trim(),
          contact: leadContact.trim(),
          company: leadCompany.trim() || undefined,
          website: leadWebsite.trim() || undefined,
          message: leadMsg.trim(),
          page: "/",
          source: "landing-form",
        }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error?.message || data?.error || `Request failed (${res.status})`);

      setLeadDone(true);
      setLeadName("");
      setLeadContact("");
      setLeadCompany("");
      setLeadWebsite("");
      setLeadMsg("");
    } catch {
      // тихо, чтобы не пугать. Можно улучшить позже.
      alert(lang === "ru" ? "Ошибка отправки. Попробуй ещё раз." : lang === "sr" ? "Greška pri slanju. Pokušajte ponovo." : "Send failed. Please try again.");
    } finally {
      setLeadLoading(false);
    }
  }

  function LangSwitcher() {
    return (
      <div className="langRow" aria-label="Language">
        <button className={`btn ${lang === "en" ? "btnPrimary" : ""}`} onClick={() => setLang("en")} aria-pressed={lang === "en"}>
          {t.misc.langEN}
        </button>
        <button className={`btn ${lang === "ru" ? "btnPrimary" : ""}`} onClick={() => setLang("ru")} aria-pressed={lang === "ru"}>
          {t.misc.langRU}
        </button>
        <button className={`btn ${lang === "sr" ? "btnPrimary" : ""}`} onClick={() => setLang("sr")} aria-pressed={lang === "sr"}>
          {t.misc.langSR}
        </button>
      </div>
    );
  }

  return (
    <>
      <header className="nav">
        <div className="container navInner">
          <div className="brand" role="button" tabIndex={0} onClick={() => scrollToId("top")}>
            <span className="logoDot" />
            AIMAX
          </div>

          <nav className="navLinks" aria-label="Sections">
            <a href="#problem">{t.nav.problem}</a>
            <a href="#solution">{t.nav.solution}</a>
            <a href="#work">{t.nav.work}</a>
            <a href="#pricing">{t.nav.pricing}</a>
            <a href="#team">{t.nav.team}</a>
          </nav>

          <div className="navRight">
            <LangSwitcher />
            <button className="btn" onClick={() => setChatOpen(true)}>
              {t.top.talk}
            </button>
            <button className="btn btnPrimary" onClick={() => scrollToId("contact")}>
              {t.top.getStarted}
            </button>
          </div>
        </div>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="hero heroAimax">
          <div className="container heroGridAimax">
            <div>
              <div className="eyebrowRow">
                <span className="chip">{t.top.sub}</span>
                <span className="chip chipGhost">{t.top.badge}</span>
              </div>

              <h1 className="heroTitle">
                {t.hero.h1a} <span>{t.hero.h1b}</span>
              </h1>

              <p className="heroLead">{t.hero.lead}</p>

              <div className="heroCtas">
                <button className="btn btnPrimary" onClick={() => scrollToId("contact")}>
                  {t.top.cta1} →
                </button>
                <button className="btn" onClick={() => setChatOpen(true)}>
                  {t.top.cta2}
                </button>
              </div>

              <div className="proofRow">
                <div className="proofBadge">{t.proof.a}</div>
                <div className="proofBadge">{t.proof.b}</div>
                <div className="proofBadge">{t.proof.c}</div>
              </div>
            </div>

            <aside className="statsGrid">
              <div className="statCard">
                <div className="statVal">{t.stats.s1t}</div>
                <div className="statLbl">{t.stats.s1d}</div>
              </div>
              <div className="statCard">
                <div className="statVal">{t.stats.s2t}</div>
                <div className="statLbl">{t.stats.s2d}</div>
              </div>
              <div className="statCard">
                <div className="statVal">{t.stats.s3t}</div>
                <div className="statLbl">{t.stats.s3d}</div>
              </div>
              <div className="statCard">
                <div className="statVal">{t.stats.s4t}</div>
                <div className="statLbl">{t.stats.s4d}</div>
              </div>
            </aside>
          </div>
        </section>

        {/* PROBLEM */}
        <section className="section" id="problem">
          <div className="container">
            <div className="sectionHeadAimax">
              <div className="sectionKicker">{t.problem.title}</div>
              <h2 className="sectionTitle">{t.problem.h2}</h2>
              <p className="sectionLead">{t.problem.lead}</p>
            </div>

            <div className="grid3">
              <div className="card itemA">
                <div className="iconDot">✦</div>
                <h3>{t.problem.p1t}</h3>
                <p>{t.problem.p1d}</p>
              </div>
              <div className="card itemA">
                <div className="iconDot">⏳</div>
                <h3>{t.problem.p2t}</h3>
                <p>{t.problem.p2d}</p>
              </div>
              <div className="card itemA">
                <div className="iconDot">◎</div>
                <h3>{t.problem.p3t}</h3>
                <p>{t.problem.p3d}</p>
              </div>
            </div>
          </div>
        </section>

        {/* SOLUTION */}
        <section className="section" id="solution">
          <div className="container">
            <div className="sectionHeadAimax">
              <div className="sectionKicker">{t.solution.title}</div>
              <h2 className="sectionTitle">{t.solution.h2}</h2>
              <p className="sectionLead">{t.solution.lead}</p>
            </div>

            <div className="grid3">
              <div className="card itemA">
                <div className="iconDot">⚡</div>
                <h3>{t.solution.s1t}</h3>
                <p>{t.solution.s1d}</p>
              </div>
              <div className="card itemA">
                <div className="iconDot">🤖</div>
                <h3>{t.solution.s2t}</h3>
                <p>{t.solution.s2d}</p>
              </div>
              <div className="card itemA">
                <div className="iconDot">📣</div>
                <h3>{t.solution.s3t}</h3>
                <p>{t.solution.s3d}</p>
              </div>
            </div>

            <div className="demoCard card">
              <div className="demoLeft">
                <div className="sectionKicker">{t.demo.title}</div>
                <h3 className="demoTitle">{t.demo.h2}</h3>
                <p className="demoLead">{t.demo.lead}</p>
                <div className="demoBullets">
                  <div className="demoBullet">
                    <b>{t.demo.d1t}</b>
                    <span>{t.demo.d1d}</span>
                  </div>
                  <div className="demoBullet">
                    <b>{t.demo.d2t}</b>
                    <span>{t.demo.d2d}</span>
                  </div>
                  <div className="demoBullet">
                    <b>{t.demo.d3t}</b>
                    <span>{t.demo.d3d}</span>
                  </div>
                </div>

                <div className="demoActions">
                  <button className="btn btnPrimary" onClick={() => setChatOpen(true)}>
                    {t.top.talk}
                  </button>
                  <button className="btn" onClick={() => scrollToId("contact")}>
                    {t.top.getStarted}
                  </button>
                </div>
              </div>

              <div className="demoRight">
                <div className="miniCard">
                  <div className="miniTop">
                    <b>AIMAX Agent</b>
                    <span className="miniSub">Online</span>
                  </div>
                  <div className="miniMsg">{t.chat.welcome}</div>
                  <button className="btn btnPrimary" onClick={() => setChatOpen(true)}>
                    {t.top.talk} →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WORK */}
        <section className="section" id="work">
          <div className="container">
            <div className="sectionHeadAimax">
              <div className="sectionKicker">{t.work.title}</div>
              <h2 className="sectionTitle">{t.work.h2}</h2>
              <p className="sectionLead">{t.work.lead}</p>
            </div>

            <div className="grid3">
              {t.work.items.map((it) => (
                <div className="card itemA" key={it.title}>
                  <div className="miniMeta">{it.meta}</div>
                  <h3>{it.title}</h3>
                  <p>{it.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className="section" id="pricing">
          <div className="container">
            <div className="sectionHeadAimax">
              <div className="sectionKicker">{t.pricing.title}</div>
              <h2 className="sectionTitle">{t.pricing.h2}</h2>
              <p className="sectionLead">{t.pricing.lead}</p>
            </div>

            <div className="grid2">
              <div className="card priceCard">
                <div className="priceTop">
                  <div className="priceKicker">{t.pricing.oneTime}</div>
                  <div className="priceVal">{t.pricing.onePrice}</div>
                </div>
                <ul className="ul">
                  {t.pricing.bullets1.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <div className="priceNote">{lang === "ru" ? "Единоразово. Ваше навсегда." : lang === "sr" ? "Jednokratno. Vaše zauvek." : "One-time investment. Yours forever."}</div>
              </div>

              <div className="card priceCard">
                <div className="priceTop">
                  <div className="priceKicker">{t.pricing.monthly}</div>
                  <div className="priceVal">{t.pricing.monthPrice}</div>
                </div>
                <ul className="ul">
                  {t.pricing.bullets2.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <div className="priceNote priceNoteStrong">{t.pricing.roi}</div>
              </div>
            </div>
          </div>
        </section>

        {/* TEAM */}
        <section className="section" id="team">
          <div className="container">
            <div className="sectionHeadAimax">
              <div className="sectionKicker">{t.team.title}</div>
              <h2 className="sectionTitle">{t.team.h2}</h2>
              <p className="sectionLead">{t.team.lead}</p>
            </div>

            <div className="grid3">
              {t.team.people.map((p) => (
                <div className="card personCard" key={p.name}>
                  <div className="personTop">
                    <div className="avatar">{p.initials}</div>
                    <div>
                      <div className="personRole">{p.role}</div>
                      <div className="personName">{p.name}</div>
                    </div>
                  </div>
                  <p className="personBio">{p.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section className="section" id="contact">
          <div className="container">
            <div className="contactCard card">
              <div className="contactLeft">
                <div className="sectionKicker">{t.contact.title}</div>
                <h2 className="sectionTitle">{t.contact.h2}</h2>
                <p className="sectionLead">{t.contact.lead}</p>

                <form onSubmit={sendLead} className="form">
                  <div className="formRow">
                    <label className="label">
                      {t.contact.name}
                      <input className="input" value={leadName} onChange={(e) => setLeadName(e.target.value)} placeholder={t.contact.name} />
                    </label>

                    <label className="label">
                      {t.contact.contact}
                      <input className="input" value={leadContact} onChange={(e) => setLeadContact(e.target.value)} placeholder={t.contact.contact} />
                    </label>
                  </div>

                  <div className="formRow">
                    <label className="label">
                      {t.contact.company}
                      <input className="input" value={leadCompany} onChange={(e) => setLeadCompany(e.target.value)} placeholder={t.contact.company} />
                    </label>

                    <label className="label">
                      {t.contact.website}
                      <input className="input" value={leadWebsite} onChange={(e) => setLeadWebsite(e.target.value)} placeholder={t.contact.website} />
                    </label>
                  </div>

                  <label className="label">
                    {t.contact.msg}
                    <textarea className="textarea" value={leadMsg} onChange={(e) => setLeadMsg(e.target.value)} placeholder={t.contact.msg} rows={4} />
                  </label>

                  <div className="formActions">
                    <button className={`btn ${canSendLead ? "btnPrimary" : ""}`} type="submit" disabled={!canSendLead}>
                      {leadLoading ? (lang === "ru" ? "Отправка…" : lang === "sr" ? "Slanje…" : "Sending…") : t.contact.send} →
                    </button>
                    <button className="btn" type="button" onClick={() => setChatOpen(true)}>
                      {t.top.talk}
                    </button>
                  </div>

                  {leadDone && <div className="success">{t.contact.success}</div>}

                  <div className="direct">{t.contact.direct}</div>
                </form>
              </div>

              <div className="contactRight">
                <div className="contactMini card">
                  <div className="contactMiniTitle">{lang === "ru" ? "Что вы получите" : lang === "sr" ? "Šta dobijate" : "What you get"}</div>
                  <div className="contactMiniItem">
                    <b>{lang === "ru" ? "План внедрения" : lang === "sr" ? "Plan implementacije" : "Implementation plan"}</b>
                    <span>{lang === "ru" ? "Под вашу нишу и процессы" : lang === "sr" ? "Za vašu nišu i procese" : "For your niche & workflows"}</span>
                  </div>
                  <div className="contactMiniItem">
                    <b>{lang === "ru" ? "Оценка сроков" : lang === "sr" ? "Procena rokova" : "Timeline estimate"}</b>
                    <span>{lang === "ru" ? "Реалистично: 3–5 дней запуск" : lang === "sr" ? "Realno: lansiranje 3–5 dana" : "Realistic: 3–5 days launch"}</span>
                  </div>
                  <div className="contactMiniItem">
                    <b>{lang === "ru" ? "Следующие шаги" : lang === "sr" ? "Sledeći koraci" : "Next steps"}</b>
                    <span>{lang === "ru" ? "Без созвона на 60 минут" : lang === "sr" ? "Bez 60-min call-a" : "No 60-minute call required"}</span>
                  </div>

                  <button className="btn btnPrimary" onClick={() => setChatOpen(true)}>
                    {t.top.talk} →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="footer">
          <div className="container footerInner">
            <div className="footBrand">
              <span className="logoDot" />
              AIMAX
            </div>
            <div className="footLinks">
              <a href="#problem">{t.nav.problem}</a>
              <a href="#solution">{t.nav.solution}</a>
              <a href="#work">{t.nav.work}</a>
              <a href="#pricing">{t.nav.pricing}</a>
              <a href="mailto:info@aimax.rs">info@aimax.rs</a>
            </div>
            <div className="footCopy">{t.misc.footer}</div>
          </div>
        </footer>
      </main>

      {/* Floating chat button */}
      <button
        className={`btn ${chatOpen ? "" : "btnPrimary"} chatFab`}
        onClick={() => setChatOpen((v) => !v)}
        aria-expanded={chatOpen}
        aria-controls="aimax-chat"
      >
        {chatOpen ? t.chat.fabClose : t.chat.fabOpen}
        <span className="mini">{chatLoading ? "…" : ""}</span>
      </button>

      {/* Chat panel */}
      {chatOpen && (
        <div className="card chatPanel" id="aimax-chat" role="dialog" aria-label="AIMAX chat">
          <div className="chatHeader">
            <div style={{ display: "flex", flexDirection: "column" }}>
              <b>{t.chat.headerTitle}</b>
              <span>{t.chat.headerSub}</span>
            </div>
            <button className="btn" onClick={() => setChatOpen(false)}>
              ×
            </button>
          </div>

          <div className="chatBody" ref={listRef}>
            {messages.map((m, idx) => (
              <div key={idx} className={`bubble ${m.role}`}>
                {m.content}
              </div>
            ))}
            {chatLoading && <div className="bubble assistant">{t.chat.thinking}</div>}
          </div>

          <div className="chatInputRow">
            <input
              className="chatInput"
              value={chatInput}
              placeholder={t.chat.inputPh}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey || !e.shiftKey)) {
                  e.preventDefault();
                  sendChat();
                }
              }}
              disabled={chatLoading}
            />
            <button className={`btn ${canSendChat ? "btnPrimary" : ""}`} onClick={sendChat} disabled={!canSendChat}>
              {t.chat.send}
            </button>
          </div>
        </div>
      )}
    </>
  );
}