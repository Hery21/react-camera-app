export default {
  name: 'Fix scan result translation keys',
  steps: [
    {
      type: 'note',
      label: 'scope reminder',
      message: 'Adds viewDetails and scanAgain under the result namespace in all three locale files. ScanResultScreen already calls result.viewDetails and result.scanAgain but result was empty. Does not touch any other screen or CSS.',
    },
    {
      type: 'write',
      label: 'add result translations to en.js',
      path: 'src/i18n/locales/en.js',
      content: `// English UI strings. Exhibit content lives in src/data/exhibits.js, not here.
export const en = {
  app: {
    eyebrow: 'Cultural Expo',
    title: 'The Storytelling Mirror',
    tagline: 'Scan · Explore · Discover'
  },
  language: {
    label: 'Language',
    en: 'EN',
    id: 'ID',
    zh: '中文',
    enFullName: 'English',
    idFullName: 'Bahasa Indonesia',
    zhFullName: 'Mandarin Chinese'
  },
  welcome: {
    explanation: 'Scan the QR code beside any exhibit to uncover its story.',
    cameraNotice: 'This experience uses your camera. You will be asked for permission when you start.',
    subTagline: 'More than just a scan, it is a journey through heritage.',
    cta: 'Start Exploring'
  },
  menu: {
    title: 'Choose your journey',
    tour: 'Tour',
    tourDesc: 'Scan exhibits to explore their stories',
    info: 'Extra Information',
    infoDesc: 'Learn more about Peranakan culture',
    quiz: 'Quiz',
    quizDesc: 'Test what you have learned',
    collage: 'Photo and Collage',
    collageDesc: 'Take a keepsake home',
    comingSoon: 'Coming soon',
    back: 'Back to welcome'
  },
  scanner: {
    back: 'Back to welcome',
    instructions: 'Point your camera at the exhibit QR code.',
    start: 'Start Camera',
    stop: 'Stop Camera',
    starting: 'Starting…',
    requesting: 'Requesting camera…',
    cameraOff: 'Camera off',
    error: 'Camera error',
    tryAgain: 'Try Again',
    cancel: 'Cancel',
    scanAnother: 'Scan Another',
    viewDetails: 'View Details',
    matched: 'Matched',
    invalidCode: 'Invalid code',
    unknownExhibit: 'Unknown exhibit',
    keepScanning: 'keep scanning'
  },
  result: {
    detected: 'Item detected!',
    viewDetails: 'View Details',
    scanAgain: 'Scan Again'
  },
  exhibit: {},
  errors: {},
  accessibility: {}
}
`,
    },
    {
      type: 'write',
      label: 'add result translations to id.js',
      path: 'src/i18n/locales/id.js',
      content: `// Bahasa Indonesia UI strings. Exhibit content lives in src/data/exhibits.js, not here.
export const id = {
  app: {
    eyebrow: 'Pameran Budaya',
    title: 'The Storytelling Mirror',
    tagline: 'Pindai · Jelajahi · Temukan'
  },
  language: {
    label: 'Bahasa',
    en: 'EN',
    id: 'ID',
    zh: '中文',
    enFullName: 'English',
    idFullName: 'Bahasa Indonesia',
    zhFullName: 'Bahasa Mandarin'
  },
  welcome: {
    explanation: 'Pindai kode QR di samping setiap pameran untuk mengungkap ceritanya.',
    cameraNotice: 'Pengalaman ini menggunakan kamera Anda. Anda akan diminta izin saat memulai.',
    subTagline: 'Lebih dari sekadar pindai, ini adalah perjalanan melalui warisan budaya.',
    cta: 'Mulai Menjelajah'
  },
  menu: {
    title: 'Pilih perjalanan Anda',
    tour: 'Tur',
    tourDesc: 'Pindai pameran untuk menjelajahi ceritanya',
    info: 'Informasi Tambahan',
    infoDesc: 'Pelajari lebih lanjut tentang budaya Peranakan',
    quiz: 'Kuis',
    quizDesc: 'Uji apa yang telah Anda pelajari',
    collage: 'Foto dan Kolase',
    collageDesc: 'Bawa pulang kenang-kenangan',
    comingSoon: 'Segera hadir',
    back: 'Kembali ke beranda'
  },
  scanner: {
    back: 'Kembali ke beranda',
    instructions: 'Arahkan kamera Anda ke kode QR pameran.',
    start: 'Nyalakan Kamera',
    stop: 'Matikan Kamera',
    starting: 'Memulai…',
    requesting: 'Meminta izin kamera…',
    cameraOff: 'Kamera mati',
    error: 'Kesalahan kamera',
    tryAgain: 'Coba Lagi',
    cancel: 'Batal',
    scanAnother: 'Pindai Lagi',
    viewDetails: 'Lihat Detail',
    matched: 'Cocok',
    invalidCode: 'Kode tidak valid',
    unknownExhibit: 'Pameran tidak dikenal',
    keepScanning: 'terus pindai'
  },
  result: {
    detected: 'Item terdeteksi!',
    viewDetails: 'Lihat Detail',
    scanAgain: 'Pindai Lagi'
  },
  exhibit: {},
  errors: {},
  accessibility: {}
}
`,
    },
    {
      type: 'write',
      label: 'add result translations to zh.js',
      path: 'src/i18n/locales/zh.js',
      content: `// Mandarin Chinese (Simplified) UI strings. Exhibit content lives in src/data/exhibits.js, not here.
export const zh = {
  app: {
    eyebrow: '文化展览',
    title: 'The Storytelling Mirror',
    tagline: '扫描 · 探索 · 发现'
  },
  language: {
    label: '语言',
    en: 'EN',
    id: 'ID',
    zh: '中文',
    enFullName: 'English',
    idFullName: 'Bahasa Indonesia',
    zhFullName: '中文'
  },
  welcome: {
    explanation: '扫描任何展品旁边的二维码，揭开它的故事。',
    cameraNotice: '此体验需要使用您的相机。开始时系统会请求您的许可。',
    subTagline: '不只是扫描，更是一段穿越文化传承的旅程。',
    cta: '开始探索'
  },
  menu: {
    title: '选择您的旅程',
    tour: '导览',
    tourDesc: '扫描展品探索它们的故事',
    info: '更多信息',
    infoDesc: '了解娘惹文化的更多内容',
    quiz: '问答',
    quizDesc: '测试您所学的知识',
    collage: '照片与拼贴',
    collageDesc: '带走一份纪念',
    comingSoon: '即将推出',
    back: '返回首页'
  },
  scanner: {
    back: '返回首页',
    instructions: '将相机对准展品二维码。',
    start: '开启相机',
    stop: '关闭相机',
    starting: '启动中…',
    requesting: '正在请求相机权限…',
    cameraOff: '相机已关闭',
    error: '相机错误',
    tryAgain: '重试',
    cancel: '取消',
    scanAnother: '再次扫描',
    viewDetails: '查看详情',
    matched: '已匹配',
    invalidCode: '无效代码',
    unknownExhibit: '未知展品',
    keepScanning: '继续扫描'
  },
  result: {
    detected: '已识别展品！',
    viewDetails: '查看详情',
    scanAgain: '再次扫描'
  },
  exhibit: {},
  errors: {},
  accessibility: {}
}
`,
    },
    {
      type: 'check',
      label: 'lint',
      command: 'npm run lint',
    },
    {
      type: 'check',
      label: 'check i18n',
      command: 'npm run check:i18n',
    },
    {
      type: 'commit',
      label: 'commit result translation keys',
      message: 'fix(i18n): add missing result namespace translations',
      paths: [
        'src/i18n/locales/en.js',
        'src/i18n/locales/id.js',
        'src/i18n/locales/zh.js',
      ],
      as: 'result-i18n',
    },
    {
      type: 'write',
      label: 'record progress',
      path: 'PROGRESS.md',
      mode: 'append',
      content: `
## Fix — Missing result namespace translations

**Status:** Complete
**Goal:** Fix the ScanResultScreen buttons showing raw keys (result.viewDetails, result.scanAgain) instead of translated text.
**Root cause:** ScanResultScreen calls getTranslation with result.viewDetails and result.scanAgain, but the result namespace was empty in all three locale files. getTranslation returns the key verbatim when no translation exists, so the raw key appeared on the buttons. This was a latent bug that became visible when an earlier refactor removed the || 'View Details' fallbacks.
**Files changed:** src/i18n/locales/en.js, src/i18n/locales/id.js, src/i18n/locales/zh.js (added result.detected, result.viewDetails, result.scanAgain to each).
**User-visible result:** Scan Result buttons now show View Details / Scan Again in English, Lihat Detail / Pindai Lagi in Indonesian, and 查看详情 / 再次扫描 in Chinese.
**Automated checks:** npm run lint; npm run check:i18n.
**Unit tests:** Intentionally omitted per urgent-policy override.
**Manual checks:** Pending. Scan any exhibit and confirm the two buttons read in the active language.
**Not checked:** npm run build.
**Remaining risks:** scanner.viewDetails and scanner.scanAnother still exist as unused duplicates of result.viewDetails and result.scanAgain. A future cleanup could remove the scanner namespace duplicates, but doing so now risks touching working code. The naming inconsistency (scanner.scanAnother vs result.scanAgain) was preserved to keep the current ScanResultScreen call sites untouched.
**Decisions made:** Added missing keys rather than renaming ScanResultScreen call sites so the diff is three locale files only. Used scanAgain (not scanAnother) in result namespace to match the exact key ScanResultScreen looks up. User's earlier decorativeAssets.js edit (separate top-left and top-right floral corners) is unrelated and left untouched.
**Next part:** Resume normal roadmap.
**Commit:** {{hash.result-i18n}}
`,
    },
    {
      type: 'commit',
      label: 'commit progress',
      message: 'docs(progress): record result i18n fix',
      paths: ['PROGRESS.md'],
      as: 'docs',
    },
  ],
}