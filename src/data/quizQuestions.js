// 5 Tatung-themed quiz questions. Indonesian text is the source;
// English and Chinese are translations to be reviewed before launch.
// Each question carries correctOptionId (used for client-side scoring).
// Question 4 displays the PSBIKT-009 cover image above the question text.

export const quizQuestions = [
  {
    id: 'Q1',
    question: {
      id: 'Apa yang dimaksud dengan tatung?',
      en: 'What is a tatung?',
      zh: '什么是 tatung（童身）？',
    },
    options: [
      {
        id: 'A',
        text: {
          id: 'Tarian tradisional masyarakat Tionghoa',
          en: 'A traditional dance performed by Chinese communities',
          zh: '华人群体的传统舞蹈',
        },
      },
      {
        id: 'B',
        text: {
          id: 'Orang yang tubuhnya dijadikan media atau perantara roh leluhur atau dewa',
          en: 'A person whose body is used as a medium or channel for ancestral spirits or deities',
          zh: '身体被用作祖先神灵或神明媒介或通道的人',
        },
      },
      {
        id: 'C',
        text: {
          id: 'Pemimpin pemerintahan masyarakat Tionghoa',
          en: 'A leader of Chinese community governance',
          zh: '华人社区的政府领袖',
        },
      },
      {
        id: 'D',
        text: {
          id: 'Pertunjukan seni bela diri tradisional',
          en: 'A traditional martial arts performance',
          zh: '传统武术表演',
        },
      },
    ],
    correctOptionId: 'B',
  },
  {
    id: 'Q2',
    question: {
      id: 'Apa tujuan utama ritual Tatung pada zaman dahulu?',
      en: 'What was the primary purpose of the Tatung ritual in the past?',
      zh: '古代 Tatung 仪式的主要目的是什么？',
    },
    options: [
      {
        id: 'A',
        text: {
          id: 'Menarik wisatawan asing',
          en: 'Attracting foreign tourists',
          zh: '吸引外国游客',
        },
      },
      {
        id: 'B',
        text: {
          id: 'Merayakan pergantian musim',
          en: 'Celebrating the change of seasons',
          zh: '庆祝季节交替',
        },
      },
      {
        id: 'C',
        text: {
          id: 'Mengusir roh jahat dan melindungi masyarakat dari gangguan buruk',
          en: 'Warding off evil spirits and protecting the community from harm',
          zh: '驱邪并保护社区免受侵扰',
        },
      },
      {
        id: 'D',
        text: {
          id: 'Memperkenalkan pakaian tradisional',
          en: 'Introducing traditional clothing',
          zh: '介绍传统服饰',
        },
      },
    ],
    correctOptionId: 'C',
  },
  {
    id: 'Q3',
    question: {
      id: 'Dalam bahasa Mandarin, istilah Tatung berkaitan dengan sebutan apa?',
      en: 'In Mandarin, what term is Tatung associated with?',
      zh: '在中文里，Tatung 与哪个称谓相关？',
    },
    options: [
      {
        id: 'A',
        text: {
          id: 'Da Lao Ye',
          en: 'Da Lao Ye',
          zh: '大老爷',
        },
      },
      {
        id: 'B',
        text: {
          id: 'Tong Ji',
          en: 'Tong Ji',
          zh: '童乩',
        },
      },
      {
        id: 'C',
        text: {
          id: 'Feng Shui',
          en: 'Feng Shui',
          zh: '风水',
        },
      },
      {
        id: 'D',
        text: {
          id: 'Gong Xi',
          en: 'Gong Xi',
          zh: '恭喜',
        },
      },
    ],
    correctOptionId: 'B',
  },
  {
    id: 'Q4',
    image: '/images/exhibits/PSBIKT-009/cover.webp',
    question: {
      id: 'Siapa nama Dewa di bawah ini?',
      en: 'Who is the deity shown below?',
      zh: '下图中是哪位神明？',
    },
    options: [
      {
        id: 'A',
        text: {
          id: 'Ng Fong Pak Kung',
          en: 'Ng Fong Pak Kung',
          zh: '五福伯公',
        },
      },
      {
        id: 'B',
        text: {
          id: 'San Tai Zi',
          en: 'San Tai Zi',
          zh: '三太子',
        },
      },
      {
        id: 'C',
        text: {
          id: 'Chau Liu Nyian Shai',
          en: 'Chau Liu Nyian Shai',
          zh: '周刘年师',
        },
      },
      {
        id: 'D',
        text: {
          id: 'Sun Go Kong',
          en: 'Sun Go Kong',
          zh: '孙悟空',
        },
      },
    ],
    correctOptionId: 'B',
  },
  {
    id: 'Q5',
    question: {
      id: 'Apa makna penggunaan senjata tajam dalam atraksi Tatung?',
      en: 'What is the meaning of using sharp weapons in the Tatung attraction?',
      zh: 'Tatung 表演中使用锋利武器的含义是什么？',
    },
    options: [
      {
        id: 'A',
        text: {
          id: 'Sebagai simbol kekayaan',
          en: 'A symbol of wealth',
          zh: '财富的象征',
        },
      },
      {
        id: 'B',
        text: {
          id: 'Sebagai perlengkapan peperangan',
          en: 'War equipment',
          zh: '战争装备',
        },
      },
      {
        id: 'C',
        text: {
          id: 'Sebagai simbol kekuatan spiritual dan perlindungan',
          en: 'A symbol of spiritual power and protection',
          zh: '精神力量与护佑的象征',
        },
      },
      {
        id: 'D',
        text: {
          id: 'Sebagai alat pertunjukan tari biasa',
          en: 'An ordinary dance performance prop',
          zh: '普通舞蹈表演道具',
        },
      },
    ],
    correctOptionId: 'C',
  },
]
