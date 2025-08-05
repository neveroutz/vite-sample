# 🔒 보안 가이드

## ⚠️ **긴급! API 키 노출 해결 방법**

### **1단계: 즉시 노출된 API 키 삭제**
1. [Google Cloud Console](https://console.cloud.google.com) 접속
2. **API 및 서비스** → **사용자 인증 정보**
3. 노출된 API 키 찾아서 **삭제** 클릭
4. **새 API 키 생성** 후 제한 설정

### **2단계: 새 API 키 보안 설정**
1. **API 제한사항** → **키 제한** 선택
2. **Google Sheets API**만 선택
3. **HTTP 추천인** 또는 **IP 주소** 제한 설정
4. **저장**

### **3단계: GitHub Secrets 업데이트**
1. GitHub 저장소 → **Settings** → **Secrets and variables** → **Actions**
2. 기존 `VITE_GOOGLE_API_KEY` 삭제
3. 새로운 API 키로 재생성

### **4단계: Git 히스토리 정리 (고급)**
```bash
# 특정 파일에서 민감한 정보 제거
git filter-branch --force --index-filter \
'git rm --cached --ignore-unmatch DEPLOY_GUIDE.md' \
--prune-empty --tag-name-filter cat -- --all

# 강제 푸시 (주의: 협업 시 팀원들과 상의 필요)
git push origin --force --all
```

## 🛡️ **예방 조치**

### **절대 하지 말아야 할 것:**
- ❌ API 키를 코드나 문서에 평문으로 작성
- ❌ .env 파일을 Git에 커밋
- ❌ 스크린샷에 API 키 노출
- ❌ 공개 채팅이나 이메일로 API 키 공유

### **안전한 방법:**
- ✅ GitHub Secrets 사용
- ✅ 환경변수만 사용
- ✅ .env.example 파일로 구조만 공유
- ✅ API 키에 제한 설정
- ✅ 정기적인 키 로테이션

## 🔍 **모니터링**

### **GitGuardian 경고 시 조치:**
1. 즉시 노출된 키 무효화
2. 새 키 발급 및 제한 설정
3. Git 히스토리 정리
4. 팀원들에게 알림

### **예방 도구:**
- [git-secrets](https://github.com/awslabs/git-secrets)
- [GitGuardian](https://www.gitguardian.com/)
- [TruffleHog](https://github.com/dxa4481/truffleHog)

## 📞 **긴급 연락처**
- Google Cloud Support
- GitHub Security Team
- 사내 보안팀
