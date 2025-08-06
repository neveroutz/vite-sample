const fs = require('fs');

const csvHeader = 'ID,제목,내용,작성자,조회수,등록일\n';

const topics = [
  {
    title: "웹팩 설정 완전 정복",
    content: "복잡한 웹팩 설정을 이해하고 프로젝트에 맞는 최적화된 빌드 환경을 구성해봅시다.\n\n기본 설정:\nmodule.exports = {\n  entry: './src/index.js',\n  output: {\n    path: __dirname + '/dist',\n    filename: 'bundle.js'\n  },\n  module: {\n    rules: [\n      {\n        test: /\\.js$/,\n        exclude: /node_modules/,\n        use: 'babel-loader'\n      },\n      {\n        test: /\\.css$/,\n        use: ['style-loader', 'css-loader']\n      }\n    ]\n  }\n};\n\n최적화 설정:\n- 코드 스플리팅\n- 트리 셰이킹\n- 미니파이케이션\n- 소스맵 생성\n\n개발 환경과 프로덕션 환경을 분리하여 효율적인 빌드 파이프라인을 구축할 수 있습니다.",
    author: "웹팩왕",
    views: 98,
    date: "2025-01-25"
  },
  {
    title: "Docker 컨테이너 기초",
    content: "개발 환경 통일을 위한 Docker 컨테이너 기초 개념과 실제 활용 사례를 알아봅니다.\n\nDockerfile 작성:\nFROM node:18-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nEXPOSE 3000\nCMD [\"npm\", \"start\"]\n\n컨테이너 실행:\ndocker build -t my-app .\ndocker run -p 3000:3000 my-app\n\nDocker Compose:\nversion: '3.8'\nservices:\n  web:\n    build: .\n    ports:\n      - \"3000:3000\"\n  db:\n    image: postgres:13\n    environment:\n      POSTGRES_DB: myapp\n\n컨테이너화를 통해 일관된 개발 환경을 구축하고 배포를 단순화할 수 있습니다.",
    author: "도커맨",
    views: 221,
    date: "2025-01-26"
  }
];

// 더 많은 주제들을 동적으로 생성
const additionalTopics = [];
const techStacks = [
  { name: "AWS 클라우드 서비스", author: "아마존", content: "Amazon Web Services의 주요 서비스들과 클라우드 아키텍처 설계 기초를 학습합니다." },
  { name: "GraphQL vs REST API", author: "그래프큐엘", content: "전통적인 REST API와 현대적인 GraphQL의 장단점을 비교하고 선택 기준을 제시합니다." },
  { name: "Next.js SSR과 SSG", author: "넥스트", content: "Next.js의 서버사이드 렌더링과 정적 사이트 생성 기능을 깊이 있게 알아봅시다." },
  { name: "Sass와 Less 전처리기", author: "사스리스", content: "CSS 전처리기의 강력한 기능들을 활용한 효율적인 스타일 개발 방법을 소개합니다." },
  { name: "Jest를 활용한 단위 테스트", author: "제스트", content: "JavaScript 애플리케이션의 안정성을 위한 Jest 단위 테스트 작성법을 배워봅시다." }
];

let csvContent = csvHeader;

// 기존 10개 항목
const existingItems = [
  'React 개발 환경 설정 가이드,"React 프로젝트를 시작하기 위한 개발 환경 설정 방법을 알아보겠습니다.',
  'JavaScript ES6+ 신기능 정리,"ES6부터 최신 JavaScript까지의 새로운 기능들을 정리했습니다.',
  'CSS Grid와 Flexbox 비교,"레이아웃을 위한 CSS Grid와 Flexbox의 차이점과 언제 어떤 것을 사용해야 하는지 알아봅시다.',
  'Node.js API 서버 구축하기,"Express.js를 사용한 RESTful API 서버 구축 과정을 단계별로 설명합니다.',
  'Git 브랜치 전략 가이드,"효율적인 Git 브랜치 관리를 위한 Git Flow와 GitHub Flow 전략을 비교 분석합니다.',
  'TypeScript 기본부터 고급까지,"TypeScript는 JavaScript에 정적 타입을 추가한 언어로, 대규모 애플리케이션 개발에 필수적인 도구입니다.',
  'Vue.js 3 Composition API 활용법,"Vue 3의 Composition API는 로직 재사용성과 타입 추론을 개선한 새로운 API입니다.',
  '웹 성능 최적화 기법,"웹 애플리케이션의 성능을 향상시키기 위한 다양한 최적화 기법들을 알아봅시다.',
  'MongoDB 데이터 모델링,"NoSQL 데이터베이스인 MongoDB의 효율적인 데이터 모델링 패턴을 학습합니다.',
  'React Hooks 심화 가이드,"React Hooks의 고급 활용법과 커스텀 훅 개발 방법을 상세히 알아봅시다.'
];

// 나머지 240개 항목 생성
for (let i = 11; i <= 250; i++) {
  const topicIndex = (i - 11) % techStacks.length;
  const topic = techStacks[topicIndex];
  const randomViews = Math.floor(Math.random() * 300) + 50;
  const date = new Date('2025-01-01');
  date.setDate(date.getDate() + i - 1);
  const formattedDate = date.toISOString().split('T')[0];

  const detailedContent = `${topic.content}

주요 특징:
- 현대적인 개발 방법론 적용
- 실무 중심의 실용적 접근
- 단계별 상세 가이드 제공
- 최신 트렌드 반영

구현 방법:
1. 기본 개념 이해
2. 실습 환경 구성
3. 핵심 기능 구현
4. 최적화 및 배포

코드 예제:
// 기본 설정
const config = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js'
  }
};

// 고급 설정
module.exports = {
  ...config,
  module: {
    rules: [
      {
        test: /\\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    })
  ]
};

실제 프로젝트에서 이러한 기술들을 적용하면 더 효율적이고 유지보수가 용이한 코드를 작성할 수 있습니다.

추가 학습 자료:
- 공식 문서 참조
- 커뮤니티 베스트 프랙티스
- 실제 프로젝트 적용 사례
- 성능 최적화 기법

이러한 내용들을 체계적으로 학습하면 실무에서 바로 활용할 수 있는 실력을 기를 수 있습니다.`;

  csvContent += `${i},"${topic.name} ${i}","${detailedContent}",${topic.author},${randomViews},${formattedDate}\n`;
}

fs.writeFileSync('sample-bbs-data-full.csv', csvContent, 'utf8');
console.log('250개 항목이 포함된 CSV 파일이 생성되었습니다.');
