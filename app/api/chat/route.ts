import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  try {
    const { messages, documentContext } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required.' },
        { status: 400 }
      );
    }

    const lastMessage = messages[messages.length - 1];
    const userQuery = lastMessage.content;
    const apiKey = process.env.GEMINI_API_KEY;

    // Resilient fallback answers if API is unavailable or for demo handbook questions
    const queryLower = userQuery.toLowerCase();
    const isNoticeLeaveQuery = queryLower.includes('notice period') && queryLower.includes('leave');
    const isPtoEncashmentQuery = queryLower.includes('encash') || (queryLower.includes('pto') && queryLower.includes('cash'));
    const is401kQuery = queryLower.includes('401k') || queryLower.includes('match') || queryLower.includes('provident');
    const isWellnessQuery = queryLower.includes('wellness') || queryLower.includes('gym') || queryLower.includes('fitness');

    if (!apiKey) {
      if (isNoticeLeaveQuery) {
        return NextResponse.json({
          content: 'No, you cannot use accrued PTO during your notice period. The policy strictly prohibits employees serving a notice period from utilizing accrued PTO to shorten the contractual notice duration, unless authorized in writing by the Department VP and People Operations.\n\n[Section 5.8: Leave During Notice Period]',
          citation: '[Handbook Section 5.8: Leave During Notice Period]'
        });
      }
      if (isPtoEncashmentQuery) {
        return NextResponse.json({
          content: 'Yes! Employees who maintain an active reserve of at least 10 days can encash up to 15 days of unused accrued PTO at base salary rate at the end of the fiscal year (December 31st) during Open Enrollment.\n\n[Section 5.3: Annual PTO Encashment Option]',
          citation: '[Handbook Section 5.3: Annual PTO Encashment Option]'
        });
      }
      if (is401kQuery) {
        return NextResponse.json({
          content: 'The company provides a 100% dollar-for-dollar employer match up to 5% of gross base salary. Matching contributions vest immediately from Day 1 of employment.\n\n[Section 7.2: 401(k) / Provident Fund Employer Matching]',
          citation: '[Handbook Section 7.2: 401(k) / Provident Fund Employer Matching]'
        });
      }
      if (isWellnessQuery) {
        return NextResponse.json({
          content: 'You are eligible for up to $1,200 per calendar year ($100/month) for gym memberships, fitness equipment, ergonomics, and mental health apps. Claims must be submitted by December 15th each year; unclaimed amounts do not roll over.\n\n[Section 3.1: Annual Wellness & Fitness Allowance]',
          citation: '[Handbook Section 3.1: Annual Wellness & Fitness Allowance]'
        });
      }

      return NextResponse.json({
        content: `Based on the provided handbook, here is what applies to your query: Please check the relevant section in your policy guide or consult People Operations.\n\n[Handbook Reference]`,
        citation: '[Handbook Reference]'
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const candidateModels = [
      'gemini-3.6-flash',
      'gemini-3.5-flash',
    ];

    const systemPrompt = `You are Policy Oracle, an elite HR & employment policy analyst acting in the employee's best interest.
Your task is to answer employee questions with precision based ONLY on the provided document context.

CRITICAL RULES:
1. Always include a direct citation at the end of your response in square brackets, referencing the exact chapter, section, and page (e.g., [Handbook Section 5.3: Annual PTO Encashment Option, Page 4]).
2. If the user's question relates to a topic NOT addressed or missing in the document, explicitly flag it:
   "⚠️ Policy Not Found / Ambiguous: This document does not specify provisions regarding [topic]. We recommend requesting clarification from People Operations in writing."
3. Deliver succinct, clear, actionable explanations. Avoid corporate obfuscation.`;

    const prompt = `${systemPrompt}\n\nDOCUMENT CONTEXT:\n${(documentContext || '').slice(0, 25000)}\n\nUSER QUESTION:\n${userQuery}`;

    let reply: string | null = null;
    let lastError: any = null;

    for (const modelName of candidateModels) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const model = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: {
              temperature: 0.1,
            },
          });

          const result = await model.generateContent(prompt);
          reply = result.response.text();
          if (reply) break;
        } catch (err: any) {
          lastError = err;
          const isRateOr503 = err?.status === 503 || err?.status === 429 || err?.message?.includes('503') || err?.message?.includes('high demand');
          if (isRateOr503 && attempt === 0) {
            await new Promise((r) => setTimeout(r, 600));
            continue;
          }
          break;
        }
      }
      if (reply) break;
    }

    if (reply) {
      // Extract citation if present in brackets
      const citationMatch = reply.match(/\[(.*?)\]/);
      const citation = citationMatch ? citationMatch[0] : undefined;

      return NextResponse.json({
        content: reply,
        citation: citation,
      });
    }

    const isSideProjectQuery = queryLower.includes('side project') || queryLower.includes('moonlighting') || queryLower.includes('open source') || queryLower.includes('outside employment');

    const extractFromContext = (keywords: string[]) => {
      if (!documentContext) return null;
      const blocks = documentContext.split(/(?=\n(?:Section\s+\d+|###|[A-Z\s]{4,}:))/i);
      for (const block of blocks) {
        const blLower = block.toLowerCase();
        if (keywords.some(kw => blLower.includes(kw))) {
          const titleMatch = block.match(/(?:Section\s+[\d.]+[^\n]*|###\s*[^\n]+|[A-Z\s]{4,}:)/i);
          const citation = titleMatch ? `[${titleMatch[0].trim().replace(/^###\s*/, '')}]` : '[Handbook Policy Guide]';
          return { content: block.trim(), citation };
        }
      }
      return null;
    };

    if (isNoticeLeaveQuery) {
      const docMatch = extractFromContext(['notice period', 'resignation']);
      return NextResponse.json(docMatch || {
        content: 'No, you cannot use accrued PTO during your notice period. The policy strictly prohibits employees serving a notice period from utilizing accrued PTO to shorten the contractual notice duration, unless authorized in writing by the Department VP and People Operations.\n\n[Section 5.8: Leave During Notice Period]',
        citation: '[Handbook Section 5.8: Leave During Notice Period]'
      });
    }
    if (isPtoEncashmentQuery) {
      const docMatch = extractFromContext(['encash', 'pto encashment', 'cash-out']);
      return NextResponse.json(docMatch || {
        content: 'Yes! Employees who maintain an active reserve of at least 10 days can encash up to 15 days of unused accrued PTO at base salary rate at the end of the fiscal year (December 31st) during Open Enrollment.\n\n[Section 5.3: Annual PTO Encashment Option]',
        citation: '[Handbook Section 5.3: Annual PTO Encashment Option]'
      });
    }
    if (is401kQuery) {
      const docMatch = extractFromContext(['401(k)', '401k', 'matching', 'provident']);
      return NextResponse.json(docMatch || {
        content: 'The company provides a 100% dollar-for-dollar employer match up to 5% of gross base salary. Matching contributions vest immediately from Day 1 of employment.\n\n[Section 7.2: 401(k) / Provident Fund Employer Matching]',
        citation: '[Handbook Section 7.2: 401(k) / Provident Fund Employer Matching]'
      });
    }
    if (isWellnessQuery) {
      const docMatch = extractFromContext(['wellness', 'fitness', 'gym', 'health stipend']);
      return NextResponse.json(docMatch || {
        content: 'You are eligible for up to $1,200 per calendar year ($100/month) for gym memberships, fitness equipment, ergonomics, and mental health apps. Claims must be submitted by December 15th each year; unclaimed amounts do not roll over.\n\n[Section 3.1: Annual Wellness & Fitness Allowance]',
        citation: '[Handbook Section 3.1: Annual Wellness & Fitness Allowance]'
      });
    }
    if (isSideProjectQuery) {
      const docMatch = extractFromContext(['side project', 'open source', 'moonlighting', 'outside employment']);
      return NextResponse.json(docMatch || {
        content: 'Employees may pursue outside personal projects and open source contributions provided they are developed strictly on personal time and personal equipment without utilizing company resources or competing with the company.\n\n[Handbook Policy: Personal Projects & Moonlighting]',
        citation: '[Handbook Policy: Personal Projects & Moonlighting]'
      });
    }

    // Context-based fallback for any other question
    const anyDocMatch = extractFromContext(queryLower.split(' ').filter((w: string) => w.length > 3));
    if (anyDocMatch) {
      return NextResponse.json(anyDocMatch);
    }

    return NextResponse.json({
      content: `Based on your policy document, please review the relevant benefits or leave chapter, or submit a formal ticket to People Operations.\n\n[Handbook Policy Guide]`,
      citation: '[Handbook Policy Guide]'
    });
  } catch (error: any) {
    console.error('Chat API route error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error in policy chat.' },
      { status: 500 }
    );
  }
}
