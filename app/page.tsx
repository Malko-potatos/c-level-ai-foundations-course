"use client";

import { FormEvent, useMemo, useState } from "react";

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

const roleOptions: Array<{ value: Role; label: string; description: string }> = [
  {
    value: "C_LEVEL",
    label: "C-레벨",
    description: "경영 의사결정과 AI 투자/리스크 관점"
  },
  {
    value: "DEVELOPER",
    label: "개발자",
    description: "실무 구현과 개발 생산성 관점"
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
  "우리 조직에 맞는 도입 전략",
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
    if (form.name.trim().length > 1) score += 1;
    if (form.respondentEmail.includes("@")) score += 1;
    if (form.knownLevel.length > 0) score += 1;
    if (form.currentKnowledgeText.trim().length > 15) score += 1;
    if (form.wantsToLearn.length > 0) score += 1;
    if (form.desiredOutcomeText.trim().length > 15) score += 1;
    if (form.focusKeywords.length > 0) score += 1;

    return Math.round((score / 7) * 100);
  }, [form]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResultMessage("");
    setIsSuccess(false);

    if (!form.knownLevel) {
      setResultMessage("현재 AI 이해 수준을 선택해주세요.");
      return;
    }
    if (form.wantsToLearn.length === 0) {
      setResultMessage("알고 싶은 주제를 1개 이상 선택해주세요.");
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
      <header className="hero">
        <p className="hero-eyebrow">AI Foundations Survey</p>
        <h1>C-레벨과 개발자를 위한 AI 기초 강의 수요조사</h1>
        <p className="hero-copy">
          어디까지 알고 있는지, 무엇을 알고 싶은지, 무엇에 집중하고 싶은지를 빠르게 수집해
          강의 커리큘럼에 반영합니다.
        </p>
      </header>

      <section className="progress-card" aria-label="응답 진행률">
        <div className="progress-topline">
          <span>응답 완성도</span>
          <strong>{completion}%</strong>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${completion}%` }} />
        </div>
      </section>

      <form className="survey-form" onSubmit={handleSubmit}>
        <section className="panel">
          <h2>1) 대상 구분</h2>
          <p className="panel-description">
            커리큘럼 난이도와 사례를 분기하기 위한 기본 정보입니다.
          </p>
          <div className="option-grid">
            {roleOptions.map((role) => (
              <button
                key={role.value}
                type="button"
                className={`selectable ${form.role === role.value ? "active" : ""}`}
                onClick={() => setForm((prev) => ({ ...prev, role: role.value }))}
              >
                <span className="selectable-title">{role.label}</span>
                <span className="selectable-caption">{role.description}</span>
              </button>
            ))}
          </div>
          <div className="field-grid">
            <label className="field">
              <span>이름</span>
              <input
                type="text"
                placeholder="홍길동"
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
          <h2>2) 어디까지 알고 있어요?</h2>
          <p className="panel-description">현재 AI 활용 수준을 알려주세요.</p>
          <div className="chip-wrap">
            {levelOptions.map((option) => (
              <button
                key={option}
                type="button"
                className={`chip ${form.knownLevel === option ? "active" : ""}`}
                onClick={() => setForm((prev) => ({ ...prev, knownLevel: option }))}
              >
                {option}
              </button>
            ))}
          </div>
          <label className="field">
            <span>현재 알고 있는 범위를 조금 더 설명해주세요</span>
            <textarea
              placeholder="예: ChatGPT는 사용하지만 프롬프트 구조화가 어려워요. LLM과 RAG 차이가 헷갈립니다."
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
          <h2>3) 어떤 걸 알고 싶어요?</h2>
          <p className="panel-description">필요한 주제를 복수 선택해주세요.</p>
          <div className="chip-wrap">
            {learnOptions.map((option) => (
              <button
                key={option}
                type="button"
                className={`chip ${form.wantsToLearn.includes(option) ? "active" : ""}`}
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
              placeholder="예: 우리 팀의 AI 도입 우선순위를 정하고, 개발/비개발 인력이 공통 언어를 갖고 싶어요."
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
          <h2>4) 중점적으로 다루면 좋은 키워드</h2>
          <p className="panel-description">핵심 키워드를 선택해 주세요.</p>
          <div className="chip-wrap">
            {keywordOptions.map((keyword) => (
              <button
                key={keyword}
                type="button"
                className={`chip ${form.focusKeywords.includes(keyword) ? "active" : ""}`}
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
            <span>{form.role === "C_LEVEL" ? "C-레벨 트랙" : "개발자 트랙"}</span>
            <strong>{completion}% 작성됨</strong>
          </div>
          <button type="submit" className="primary-cta" disabled={isSubmitting}>
            {isSubmitting ? "전송 중..." : "수요조사 제출하기"}
          </button>
        </footer>
      </form>

      {resultMessage ? (
        <aside className={`feedback ${isSuccess ? "success" : "error"}`}>{resultMessage}</aside>
      ) : null}
    </main>
  );
}
