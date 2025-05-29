# 1. Node.js 20 기반 이미지 사용
FROM node:20-alpine

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. pnpm 설치
RUN corepack enable && corepack prepare pnpm@latest --activate

# 4. 종속성 파일 복사
COPY pnpm-lock.yaml ./ 
COPY package.json ./

# 5. 종속성 설치
RUN pnpm install --frozen-lockfile

# 6. 전체 소스 복사
COPY . .

# 7. Next.js 빌드
RUN pnpm build

# 8. 포트 설정
EXPOSE 3001

# 9. 실행 명령
CMD ["pnpm", "start"]
