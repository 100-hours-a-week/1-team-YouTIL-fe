# YouTIL

깃허브 커밋 목록을 바탕으로 **TIL (Today I Learned)** 을 생성하고, 생성된 TIL을 기반으로 예상 면접 질문을 생성해주는 웹 서비스입니다.  
사용자는 생성된 TIL과 면접 질문을 기록하고 공유함으로써, 하루 동안의 개발 내용을 복습하고 학습 효율을 높일 수 있습니다.

---

## 📌 프로젝트 개요
- **목적**  
  - 개발자가 깃허브 커밋 데이터를 바탕으로 매일의 학습 내용을 자동 생성
  - 생성된 TIL을 기반으로 면접 대비용 예상 질문 자동 생성
- **기능**  
  - 깃허브 OAuth 로그인
  - 커밋 데이터 기반 TIL 자동 생성
  - AI 기반 면접 질문 생성
  - TIL 및 질문 기록, 공유
  - 생성된 TIL 깃허브 자동 업로드
  - 히트맵 형태의 활동 기록 시각화

---

## 🛠 사용 기술

### **Core**
- **Next.js**
- **TypeScript**
- **Zustand**
- **TanStack Query**
- **Query Key Factory**

### **UI/UX**
- **Sass + dart**
- **Cal-Heatmap**
- **date-fns**
- **react-markdown**

---


## 💡 주요 기능
1. **TIL 자동 생성** — 깃허브 커밋 데이터를 기반으로 당일 학습 내용 요약
2. **AI 면접 질문 생성** — 생성된 TIL에서 맞춤형 질문 제공



## 📦 설치 및 실행

```bash
# 패키지 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 빌드
pnpm build

# 프로덕션 실행
pnpm start
