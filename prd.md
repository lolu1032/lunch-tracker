# 점심 지출 계산기 (Lunch Tracker) - PRD

## 1. 개요

**목적**: 회사 월 점심비 20만원 한도를 모바일에서 간편하게 기록하고 잔액을 관리하는 개인용 웹앱

**사용자**: 본인 1명 (로그인/인증 없음)

**플랫폼**: 모바일 반응형 웹

---

## 2. 핵심 기능

### 2.1 메인 대시보드 (`/`)
- 이번 달 **잔액** (20만원 - 사용 금액) 크게 표시
- 이번 달 **총 사용 금액**
- **남은 영업일 기준 일평균** 사용 가능 금액
- 최근 기록 5건 미리보기
- 점심 기록 추가 버튼 (하단 플로팅 또는 상단)

### 2.2 점심 기록 입력 (`/add`)
- **날짜**: 기본값 오늘, 달력 선택 가능
- **금액**: 숫자 키패드 입력 (원 단위)
- **메모**: 자유 입력 (식당명, 메뉴 등 / 선택사항)
- 저장 후 메인으로 이동

### 2.3 기록 관리 (`/history`)
- 월별 기록 리스트 (최신순)
- 월 선택 드롭다운 (이전 달 조회)
- 각 기록 탭하면 수정/삭제 가능
- 월별 합계 표시

---

## 3. 기술 스택

| 항목 | 선택 | 이유 |
|------|------|------|
| **프레임워크** | Next.js 15 (App Router) | Vercel 최적, SSR/API 통합 |
| **스타일링** | Tailwind CSS | 빠른 모바일 UI 개발 |
| **ORM** | Prisma | 타입 안전, 마이그레이션 관리 |
| **DB (개발)** | 로컬 PostgreSQL | 로컬 개발 환경 |
| **DB (프로덕션)** | Neon PostgreSQL 무료 티어 | Vercel 통합 최적, 무료 0.5GB |
| **배포** | Vercel 무료 플랜 | 무료, Next.js 최적 |

---

## 4. 데이터 모델

### lunch_records 테이블

```sql
CREATE TABLE lunch_records (
  id          SERIAL PRIMARY KEY,
  date        DATE NOT NULL,
  amount      INTEGER NOT NULL,        -- 원 단위
  memo        VARCHAR(200),            -- 선택사항
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);
```

### settings 테이블

```sql
CREATE TABLE settings (
  id             SERIAL PRIMARY KEY,
  monthly_budget INTEGER NOT NULL DEFAULT 200000  -- 월 예산 (원)
);
```

---

## 5. API 설계

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/records?month=2026-03` | 월별 기록 조회 |
| POST | `/api/records` | 기록 추가 |
| PUT | `/api/records/[id]` | 기록 수정 |
| DELETE | `/api/records/[id]` | 기록 삭제 |
| GET | `/api/summary?month=2026-03` | 월별 요약 (잔액, 합계, 일평균) |

---

## 6. 페이지 구성

```
/                 → 메인 대시보드 (잔액 + 최근 기록)
/add              → 점심 기록 입력 폼
/history          → 월별 기록 리스트 (수정/삭제)
```

---

## 7. 모바일 UI 가이드

- **최소 터치 타겟**: 44px
- **금액 입력**: 큰 숫자 표시, 숫자 키보드 자동 활성화 (`inputmode="numeric"`)
- **폰트**: 잔액은 크게 (2rem 이상), 리스트는 읽기 편한 크기
- **색상**: 잔액 여유 → 초록, 부족 → 빨강/주황
- **뷰포트**: `max-width: 480px` 기준 최적화

---

## 8. 배포 계획

```
1. 로컬 개발: 로컬 PostgreSQL + next dev
2. Neon DB 생성: neon.tech 무료 가입 → DB 생성 → connection string 확보
3. Vercel 배포: GitHub 연결 → 환경변수 설정 (DATABASE_URL) → 자동 배포
4. Prisma 마이그레이션: npx prisma migrate deploy
```

---

## 9. 범위 외 (V1에서 제외)

- 로그인/회원가입
- 팀/그룹 기능
- 사진 첨부
- 카테고리 분류
- 통계/차트
- PWA / 푸시 알림
- 예산 변경 UI (DB에서 직접 수정)
