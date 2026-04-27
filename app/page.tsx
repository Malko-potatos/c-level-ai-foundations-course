"use client";

import type { CSSProperties, FormEvent } from "react";
import { useMemo, useState } from "react";

type Role = "C_LEVEL" | "DEVELOPER";

type SurveyFormState = {
  role: Role;
  name: string;
  respondentEmail: string;
  knownLevel: string;
  currentKnowledgeText: string;
  wantsToLearn: string[];
  desiredOutcomeText: string;
  focusKeywords: string[];
};

const roleOptions: Array<{ value: Role; label: string; description: string; meta: string }> = [
  {
    value: "C_LEVEL",
    label: "C-레벨",
    description: "의사결정, 투자 판단, 리스크 관리 관점",
    meta: "Strategy"
  },
  {
    value: "DEVELOPER",
    label: "개발자",
    description: "구현, 자동화, 개발 생산성 관점",
    meta: "Build"
  }
];

const levelOptions = [
  "AI 개념은 거의 처음",
  "생성형 AI를 써봤지만 원리는 잘 모름",
  "업무에 일부 활용 중",
  "팀 차원 도입/개발까지 진행 중"
];

const learnOptions = [
  "AI 기본 개념(LLM, RAG, Agent)",
  "조직에 맞는 AI 도입 전략",
  "생성형 AI 보안/컴플라이언스",
  "프롬프트 작성 실습",
  "개발 파이프라인 통합(CI/CD, 테스트)",
  "ROI 측정과 KPI 설계"
];

const keywordOptions = [
  "AI 리터러시",
  "LLM",
  "RAG",
  "Agent",
  "프롬프트 엔지니어링",
  "업무 자동화",
  "개발 생산성",
  "거버넌스",
  "보안",
  "ROI"
];

function toggleOption(source: string[], value: string) {
  return source.includes(value)
    ? source.filter((item) => item !== value)
    : [...source, value];
}

function isStepComplete(step: number, form: SurveyFormState) {
  if (step === 1) return Boolean(form.name.trim()) && form.respondentEmail.includes("@");
  if (step === 2) return Boolean(form.knownLevel) && Boolean(form.currentKnowledgeText.trim());
  if (step === 3) return form.wantsToLearn.length > 0 && Boolean(form.desiredOutcomeText.trim());
  return form.focusKeywords.length > 0;
}

export default function HomePage() {
  const [form, setForm] = useState<SurveyFormState>({
    role: "C_LEVEL",
    name: "",
    respondentEmail: "",
    knownLevel: "",
    currentKnowledgeText: "",
    wantsToLearn: [],
    desiredOutcomeText: "",
    focusKeywords: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const completion = useMemo(() => {
    let score = 0;
    if (form.name.trim().length > 0) score += 1;
    if (form.respondentEmail.includes("@")) score += 1;
    if (form.knownLevel.length > 0) score += 1;
    if (form.currentKnowledgeText.trim().length > 0) score += 1;
    if (form.wantsToLearn.length > 0) score += 1;
    if (form.desiredOutcomeText.trim().length > 0) score += 1;
    if (form.focusKeywords.length > 0) score += 1;

    return Math.round((score / 7) * 100);
  }, [form]);

  const roleLabel = form.role === "C_LEVEL" ? "C-레벨 트랙" : "개발자 트랙";
  const sceneItems = [
    { number: "01", label: "Profile", done: isStepComplete(1, form) },
    { number: "02", label: "Level", done: isStepComplete(2, form) },
    { number: "03", label: "Need", done: isStepComplete(3, form) },
    { number: "04", label: "Focus", done: isStepComplete(4, form) }
  ];
  const currentScene = Math.min(sceneItems.filter((scene) => scene.done).length + 1, 4);

  const nextPrompt = useMemo(() => {
    if (!form.name.trim()) return "이름을 입력하면 시작됩니다";
    if (!form.respondentEmail.includes("@")) return "회신 이메일을 확인해주세요";
    if (!form.knownLevel) return "현재 AI 이해 수준을 선택해주세요";
    if (!form.currentKnowledgeText.trim()) return "알고 있는 범위를 적어주세요";
    if (form.wantsToLearn.length === 0) return "알고 싶은 주제를 선택해주세요";
    if (!form.desiredOutcomeText.trim()) return "원하는 학습 결과를 적어주세요";
    if (form.focusKeywords.length === 0) return "중점 키워드를 선택해주세요";
    return "제출 준비가 끝났습니다";
  }, [form]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResultMessage("");
    setIsSuccess(false);

    if (!form.knownLevel) {
      setResultMessage("현재 AI 이해 수준을 선택해주세요.");
      return;
    }
    if (!form.currentKnowledgeText.trim()) {
      setResultMessage("현재 알고 있는 범위를 입력해주세요.");
      return;
    }
    if (form.wantsToLearn.length === 0) {
      setResultMessage("알고 싶은 주제를 1개 이상 선택해주세요.");
      return;
    }
    if (!form.desiredOutcomeText.trim()) {
      setResultMessage("강의를 듣고 얻고 싶은 결과를 입력해주세요.");
      return;
    }
    if (form.focusKeywords.length === 0) {
      setResultMessage("중점 키워드를 1개 이상 선택해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !data.ok) {
        throw new Error(data.error ?? "제출에 실패했습니다.");
      }

      setIsSuccess(true);
      setResultMessage("응답이 제출되었고, 담당자 이메일로 전송되었습니다.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";
      setResultMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="page-shell">
      <header className="survey-header">
        <nav className="topbar" aria-label="설문 정보">
          <span className="brand-mark">AI Survey</span>
          <div className="topbar-meta">
            <span>Scene {String(currentScene).padStart(2, "0")}</span>
            <span className="duration-pill">약 3분</span>
          </div>
        </nav>

        <section className="intro-panel" aria-labelledby="survey-title">
          <div className="intro-copy">
            <p className="eyebrow">C-level & Developer</p>
            <h1 id="survey-title">AI 기초 강의 수요조사</h1>
            <p>
              현재 이해 수준, 알고 싶은 주제, 강의에서 꼭 다뤄야 할 키워드를 모아
              커리큘럼의 밀도를 조정합니다.
            </p>
          </div>
          <div
            className="progress-orbit"
            role="progressbar"
            aria-label={`응답 완성도 ${completion}%`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={completion}
            style={{ "--percent": completion } as CSSProperties}
          >
            <span>{completion}</span>
            <small>%</small>
          </div>
        </section>

        <div className="scene-strip" aria-label="설문 장면 진행 상태">
          {sceneItems.map((scene, index) => (
            <span
              key={scene.number}
              className={`scene-dot ${scene.done ? "done" : ""} ${
                currentScene === index + 1 ? "current" : ""
              }`}
              aria-current={currentScene === index + 1 ? "step" : undefined}
            >
              <strong>{scene.number}</strong>
              <small>{scene.label}</small>
            </span>
          ))}
        </div>
      </header>

      <section className="progress-card" aria-label="다음 입력 안내" aria-live="polite">
        <div>
          <span className="progress-label">{roleLabel}</span>
          <strong>{nextPrompt}</strong>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${completion}%` }} />
        </div>
      </section>

      <form className="survey-form" onSubmit={handleSubmit}>
        <section className="panel">
          <div className="section-heading">
            <span>01</span>
            <h2>대상과 회신 정보</h2>
          </div>
          <div className="role-switch" role="group" aria-label="대상 선택">
            {roleOptions.map((role) => (
              <button
                key={role.value}
                type="button"
                className={`role-option ${form.role === role.value ? "active" : ""}`}
                aria-pressed={form.role === role.value}
                onClick={() => setForm((prev) => ({ ...prev, role: role.value }))}
              >
                <small>{role.meta}</small>
                <strong>{role.label}</strong>
                <span>{role.description}</span>
              </button>
            ))}
          </div>
          <div className="field-grid">
            <label className="field">
              <span>이름</span>
              <input
                type="text"
                placeholder="홍길동"
                autoComplete="name"
                value={form.name}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, name: event.target.value }))
                }
                required
              />
            </label>
            <label className="field">
              <span>회신 이메일</span>
              <input
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                inputMode="email"
                value={form.respondentEmail}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, respondentEmail: event.target.value }))
                }
                required
              />
            </label>
          </div>
        </section>

        <section className="panel">
          <div className="section-heading">
            <span>02</span>
            <h2>어디까지 알고 있어요?</h2>
          </div>
          <div className="chip-wrap">
            {levelOptions.map((option) => (
              <button
                key={option}
                type="button"
                className={`chip ${form.knownLevel === option ? "active" : ""}`}
                aria-pressed={form.knownLevel === option}
                onClick={() => setForm((prev) => ({ ...prev, knownLevel: option }))}
              >
                {option}
              </button>
            ))}
          </div>
          <label className="field">
            <span>현재 알고 있는 범위</span>
            <textarea
              placeholder="예: ChatGPT는 써봤지만 LLM과 RAG의 차이는 아직 헷갈립니다."
              value={form.currentKnowledgeText}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, currentKnowledgeText: event.target.value }))
              }
              rows={4}
              required
            />
          </label>
        </section>

        <section className="panel">
          <div className="section-heading">
            <span>03</span>
            <h2>어떤 걸 알고 싶어요?</h2>
          </div>
          <div className="chip-wrap">
            {learnOptions.map((option) => (
              <button
                key={option}
                type="button"
                className={`chip ${form.wantsToLearn.includes(option) ? "active" : ""}`}
                aria-pressed={form.wantsToLearn.includes(option)}
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    wantsToLearn: toggleOption(prev.wantsToLearn, option)
                  }))
                }
              >
                {option}
              </button>
            ))}
          </div>
          <label className="field">
            <span>강의를 듣고 얻고 싶은 결과</span>
            <textarea
              placeholder="예: 경영진과 개발자가 AI 도입 우선순위를 같은 언어로 논의하고 싶습니다."
              value={form.desiredOutcomeText}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, desiredOutcomeText: event.target.value }))
              }
              rows={4}
              required
            />
          </label>
        </section>

        <section className="panel">
          <div className="section-heading">
            <span>04</span>
            <h2>중점 키워드</h2>
          </div>
          <div className="chip-wrap keyword-grid">
            {keywordOptions.map((keyword) => (
              <button
                key={keyword}
                type="button"
                className={`chip keyword ${form.focusKeywords.includes(keyword) ? "active" : ""}`}
                aria-pressed={form.focusKeywords.includes(keyword)}
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    focusKeywords: toggleOption(prev.focusKeywords, keyword)
                  }))
                }
              >
                #{keyword}
              </button>
            ))}
          </div>
        </section>

        <footer className="sticky-submit">
          <div className="submit-summary">
            <span>{roleLabel}</span>
            <strong>{completion}% 작성됨</strong>
          </div>
          <button type="submit" className="primary-cta" disabled={isSubmitting} aria-busy={isSubmitting}>
            {isSubmitting ? "전송 중..." : "제출"}
          </button>
        </footer>
      </form>

      {resultMessage ? (
        <aside className={`feedback ${isSuccess ? "success" : "error"}`} role={isSuccess ? "status" : "alert"}>
          {resultMessage}
        </aside>
      ) : null}
    </main>
  );
}
