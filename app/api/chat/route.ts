import { NextResponse } from "next/server";

export const runtime = "nodejs";

type InMsg = { role: "user" | "assistant" | "system"; content: string };
type Body = { lang?: "en" | "ru" | "sr"; messages?: InMsg[] };

function maskKey(key: string) {
  if (!key) return "(empty)";
  const k = key.trim();
  const head = k.slice(0, 7); // e.g. sk-proj-
  const tail = k.slice(-4);
  return `${head}…${tail} (len=${k.length})`;
}

function systemPrompt(lang: "en" | "ru" | "sr") {
  if (lang === "ru") {
    return [
      "Ты — AIMAX Agent. Отвечай по-русски.",
      "Стиль: кратко, по делу, структурировано (буллеты/шаги).",
      "Цель: помочь с лендингом/МVP/автоматизацией и интеграцией AI.",
      "Если данных не хватает — задай 1–2 уточняющих вопроса.",
      "Всегда заканчивай конкретными next steps.",
    ].join("\n");
  }

  if (lang === "sr") {
    return [
      "Ti si AIMAX Agent. Odgovaraj na srpskom.",
      "Stil: kratko, jasno, strukturisano (bulleti/koraci).",
      "Cilj: pomoći oko landing-a/MVP-a/automatizacije i AI integracije.",
      "Ako fali info — postavi 1–2 pitanja.",
      "Uvek završi konkretnim next steps.",
    ].join("\n");
  }

  return [
    "You are AIMAX Agent. Reply in English.",
    "Style: concise, practical, structured (bullets/steps).",
    "Goal: help with landing/MVP/automation and AI integration.",
    "If info is missing, ask 1–2 clarifying questions.",
    "Always finish with concrete next steps.",
  ].join("\n");
}

/**
 * DIAGNOSTIC ENDPOINT
 * Open: http://localhost:3000/api/chat
 * If you see ok:true and the key mask looks correct — env is loaded.
 */
export async function GET() {
  const apiKey = (process.env.OPENAI_API_KEY || "").trim();
  return NextResponse.json({
    ok: true,
    hasKey: Boolean(apiKey),
    keyMask: maskKey(apiKey),
    note:
      "If hasKey=false or keyMask is not your current key, .env.local is not being read (wrong location / wrong project / no restart).",
  });
}

export async function POST(req: Request) {
  try {
    const apiKeyRaw = process.env.OPENAI_API_KEY || "";
    const apiKey = apiKeyRaw.trim();

    if (!apiKey) {
      return NextResponse.json(
        {
          error: {
            message: "Missing OPENAI_API_KEY in .env.local",
            debug: { hasKey: false, keyMask: maskKey(apiKeyRaw) },
          },
        },
        { status: 500 }
      );
    }

    const body = (await req.json().catch(() => null)) as Body | null;

    const lang: "en" | "ru" | "sr" =
      body?.lang === "ru" || body?.lang === "sr" || body?.lang === "en"
        ? body.lang
        : "en";

    const messages = body?.messages;
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: { message: "Body must include { messages: [...] }" } },
        { status: 400 }
      );
    }

    const cleaned: InMsg[] = messages
      .filter(
        (m) =>
          m &&
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string"
      )
      .map((m) => ({ role: m.role, content: m.content }));

    const payload = {
      model: "gpt-4.1-mini",
      temperature: 0.6,
      messages: [{ role: "system", content: systemPrompt(lang) }, ...cleaned],
    };

    const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await upstream.json().catch(() => null);

    if (!upstream.ok) {
      const msg = data?.error?.message || `OpenAI API error (${upstream.status})`;
      return NextResponse.json(
        {
          error: {
            message: msg,
            debug: {
              keyMask: maskKey(apiKey),
              hint:
                "If the keyMask is not the key you expect, you are editing the wrong .env.local or not restarting dev server.",
            },
          },
        },
        { status: upstream.status }
      );
    }

    const content: string = data?.choices?.[0]?.message?.content ?? "";
    return NextResponse.json({ message: { role: "assistant", content } });
  } catch (e: any) {
    return NextResponse.json(
      { error: { message: String(e?.message || e) } },
      { status: 500 }
    );
  }
}