# 🌐 GitHub Pages 배포 가이드

## 📋 배포 완료 단계:

### ✅ 1. GitHub 저장소에 코드 업로드 완료
- 저장소: `https://github.com/neveroutz/vite-sample`
- 모든 기능 코드 업로드됨

### ✅ 2. GitHub Actions 워크플로우 설정 완료
- 자동 빌드 및 배포 설정
- GitHub Pages 연동

### 🔧 3. GitHub Secrets 설정 (중요!)

GitHub 저장소에서 환경변수를 설정해야 합니다:

1. **GitHub 저장소 페이지 접속**: https://github.com/neveroutz/vite-sample
2. **Settings** 탭 클릭
3. **Secrets and variables** > **Actions** 클릭
4. **New repository secret** 버튼으로 다음 3개 추가:

```
이름: VITE_GOOGLE_API_KEY
값: [새로_발급받은_API_키_입력]

이름: VITE_GOOGLE_SHEET_ID
값: [본인의_스프레드시트_ID_입력]

이름: VITE_GOOGLE_SHEET_NAME
값: sample-users-database
```

⚠️ **보안 주의**: 실제 API 키는 GitHub Secrets에만 저장하고, 문서에는 절대 평문으로 적지 마세요!

### 🚀 4. GitHub Pages 활성화

1. **Settings** 탭에서 **Pages** 메뉴 클릭
2. **Source**: "GitHub Actions" 선택
3. **Save** 클릭

### 🎯 5. 배포 URL

설정 완료 후 다음 URL에서 확인 가능:
**https://neveroutz.github.io/vite-sample/**

## 📝 배포 프로세스:

1. `main` 브랜치에 코드 푸시
2. GitHub Actions 자동 실행
3. 빌드 및 배포 완료 (약 2-3분)
4. 웹사이트 접속 가능

## 🔄 업데이트 방법:

코드 변경 후 다음 명령어로 배포:
```bash
git add .
git commit -m "업데이트 내용"
git push origin main
```

자동으로 GitHub Pages가 업데이트됩니다!

## 🚨 문제 해결:

- **Actions** 탭에서 빌드 상태 확인
- **Settings > Pages**에서 배포 상태 확인
- 환경변수 설정 재확인
