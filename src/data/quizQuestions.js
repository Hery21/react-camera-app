// Placeholder quiz questions. Replace with final expo content.
// Each question needs an id, question text in en/id/zh, and options.
// Each option needs an id (A/B/C/D) and text in en/id/zh.
// The submission payload will contain { questionId, optionId } pairs,
// so the sheet can be scored by mapping against the correct answers.

export const quizQuestions = [
  {
    id: 'Q1',
    question: {
      en: 'Which festival is this Storytelling Mirror experience designed for?',
      id: 'Festival apa yang menjadi tema pengalaman Cermin Bercerita ini?',
      zh: '本次故事之镜体验为哪个节日而设？',
    },
    options: [
      {
        id: 'A',
        text: {
          en: 'Pekan Seni Budaya 2026',
          id: 'Pekan Seni Budaya 2026',
          zh: 'Pekan Seni Budaya 2026',
        },
      },
      {
        id: 'B',
        text: {
          en: 'Chinese New Year',
          id: 'Tahun Baru Imlek',
          zh: '春节',
        },
      },
      {
        id: 'C',
        text: {
          en: 'Mid-Autumn Festival',
          id: 'Festival Pertengahan Musim Gugur',
          zh: '中秋节',
        },
      },
      {
        id: 'D',
        text: {
          en: 'Dragon Boat Festival',
          id: 'Festival Perahu Naga',
          zh: '端午节',
        },
      },
    ],
  },
  {
    id: 'Q2',
    question: {
      en: 'What should you do to reveal an exhibit story?',
      id: 'Apa yang harus Anda lakukan untuk mengungkap cerita pameran?',
      zh: '您应该怎么做才能揭开展品的故事？',
    },
    options: [
      {
        id: 'A',
        text: {
          en: 'Open the exhibit by hand',
          id: 'Buka pameran dengan tangan',
          zh: '亲手打开展品',
        },
      },
      {
        id: 'B',
        text: {
          en: 'Scan the QR code',
          id: 'Pindai kode QR',
          zh: '扫描二维码',
        },
      },
      {
        id: 'C',
        text: {
          en: 'Read the label',
          id: 'Baca label',
          zh: '阅读标签',
        },
      },
      {
        id: 'D',
        text: {
          en: 'Ask a guide',
          id: 'Tanya pemandu',
          zh: '询问导览员',
        },
      },
    ],
  },
  {
    id: 'Q3',
    question: {
      en: 'Which Chinese character is commonly displayed upside down for good luck?',
      id: 'Karakter Tionghoa apa yang sering dipasang terbalik untuk keberuntungan?',
      zh: '哪个汉字常被倒贴以求好运？',
    },
    options: [
      {
        id: 'A',
        text: {
          en: 'Xi (喜)',
          id: 'Xi (喜)',
          zh: '喜',
        },
      },
      {
        id: 'B',
        text: {
          en: 'Fu (福)',
          id: 'Fu (福)',
          zh: '福',
        },
      },
      {
        id: 'C',
        text: {
          en: 'Chun (春)',
          id: 'Chun (春)',
          zh: '春',
        },
      },
      {
        id: 'D',
        text: {
          en: 'Shou (寿)',
          id: 'Shou (寿)',
          zh: '寿',
        },
      },
    ],
  },
]
