import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type Payload = {
  role: "C_LEVEL" | "DEVELOPER";
  name: string;
  respondentEmail: string;
  knownLevel: string;
  currentKnowledgeText: string;
  wantsToLearn: string[];
  desiredOutcomeText: string;
  focusKeywords: string[];
};

function badRequest(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function validate(body: Partial<Payload>): string | null {
  if (!body.name || body.name.trim().length === 0) return "이름을 입력해주세요.";
  if (!body.respondentEmail || !body.respondentEmail.includes("@")) {
    return "이메일 형식이 올바르지 않습니다.";
  }
  if (!body.knownLevel) return "AI 이해 수준을 선택해주세요.";
  if (!body.currentKnowledgeText || body.currentKnowledgeText.trim().length === 0) {
    return "현재 이해 수준 설명을 입력해주세요.";
  }
  if (!body.wantsToLearn || body.wantsToLearn.length === 0) {
    return "알고 싶은 주제를 선택해주세요.";
  }
  if (!body.desiredOutcomeText || body.desiredOutcomeText.trim().length === 0) {
    return "원하는 학습 결과를 입력해주세요.";
  }
  if (!body.focusKeywords || body.focusKeywords.length === 0) {
    return "중점 키워드를 선택해주세요.";
  }
  return null;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<Payload>;
    const validationError = validate(body);
    if (validationError) return badRequest(validationError);

    const smtpHost = process.env.SMTP_HOST;
    const smtpPortRaw = process.env.SMTP_PORT ?? "587";
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const toEmail = process.env.SURVEY_TO_EMAIL;
    const fromEmail =
      process.env.SURVEY_FROM_EMAIL ?? "AI Survey <no-reply@ai-foundations.local>";

    if (!smtpHost || !smtpUser || !smtpPass || !toEmail) {
      return badRequest(
        "메일 서버 환경변수(SMTP_HOST, SMTP_USER, SMTP_PASS, SURVEY_TO_EMAIL)가 설정되지 않았습니다.",
        500
      );
    }

    const smtpPort = Number.parseInt(smtpPortRaw, 10);
    if (Number.isNaN(smtpPort)) {
      return badRequest("SMTP_PORT 값이 숫자가 아닙니다.", 500);
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });

    const roleLabel = body.role === "C_LEVEL" ? "C-레벨" : "개발자";
    const wantsToLearn = body.wantsToLearn ?? [];
    const focusKeywords = body.focusKeywords ?? [];

    const html = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,sans-serif;color:#222222">
        <h2 style="margin:0 0 16px">AI 기초 강의 수요조사 응답</h2>
        <p style="margin:0 0 12px"><strong>대상:</strong> ${escapeHtml(roleLabel)}</p>
        <p style="margin:0 0 12px"><strong>이름:</strong> ${escapeHtml(body.name!.trim())}</p>
        <p style="margin:0 0 20px"><strong>회신 이메일:</strong> ${escapeHtml(
          body.respondentEmail!.trim()
        )}</p>
        <hr style="border:none;border-top:1px solid #dddddd;margin:16px 0" />
        <p><strong>1) 어디까지 알고 있어요?</strong></p>
        <p style="margin-top:0">${escapeHtml(body.knownLevel!)}</p>
        <p style="white-space:pre-wrap">${escapeHtml(body.currentKnowledgeText!)}</p>
        <p><strong>2) 어떤 걸 알고 싶어요?</strong></p>
        <ul>${wantsToLearn.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        <p style="white-space:pre-wrap">${escapeHtml(body.desiredOutcomeText!)}</p>
        <p><strong>3) 중점 키워드</strong></p>
        <p>${focusKeywords.map((keyword) => `#${escapeHtml(keyword)}`).join(" ")}</p>
      </div>
    `;

    const text = [
      "AI 기초 강의 수요조사 응답",
      `대상: ${roleLabel}`,
      `이름: ${body.name}`,
      `회신 이메일: ${body.respondentEmail}`,
      "",
      "1) 어디까지 알고 있어요?",
      body.knownLevel ?? "",
      body.currentKnowledgeText ?? "",
      "",
      "2) 어떤 걸 알고 싶어요?",
      ...wantsToLearn.map((item) => `- ${item}`),
      body.desiredOutcomeText ?? "",
      "",
      "3) 중점 키워드",
      ...focusKeywords.map((keyword) => `#${keyword}`)
    ].join("\n");

    await transporter.sendMail({
      from: fromEmail,
      to: toEmail,
      subject: `[AI 수요조사] ${roleLabel} - ${body.name}`,
      replyTo: body.respondentEmail?.trim(),
      text,
      html
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "제출 처리 중 예기치 못한 오류가 발생했습니다.";
    return badRequest(message, 500);
  }
}
