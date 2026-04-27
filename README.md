# C-Level & Developer AI Survey (Next.js)

모바일 우선 인터랙티브 수요조사 페이지입니다.

## 핵심 기능

- C-레벨 / 개발자 트랙 분기
- 질문 중심 구성
  - 어디까지 알고 있어요?
  - 어떤 걸 알고 싶어요?
  - 중점적으로 다루었으면 하는 키워드
- 제출 시 서버 API에서 이메일 전송
- Airbnb 스타일 토큰 기반 UI
  - Rausch `#ff385c` 포인트 컬러
  - 화이트 캔버스 + 헤어라인 + 라운드 컴포넌트
  - 모바일 하단 고정 CTA

## 로컬 실행

```bash
npm ci
cp .env.example .env.local
npm run dev
```

`http://localhost:3000`

## 환경변수

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SURVEY_TO_EMAIL` (응답을 받을 이메일)
- `SURVEY_FROM_EMAIL` (발신자 표기)

## Render 배포

이 저장소 루트의 `render.yaml`을 사용합니다.

1. 저장소를 GitHub로 푸시
2. Render Web Service 또는 Blueprint 생성 시 해당 저장소 선택
3. 환경변수 설정
4. 배포

## 주의사항

- Gmail 사용 시 일반 비밀번호가 아닌 **앱 비밀번호**가 필요합니다.
- 일부 SMTP 제공자는 `SURVEY_FROM_EMAIL`을 계정 이메일과 동일하게 요구합니다.
