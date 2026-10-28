// Three-day quiz. Day selection is date-based via Asia/Jakarta timezone.
// If today is after Day 3, the most recent past day is used (visitors still get a quiz).
// If today is before Day 1, Day 1 is used (preview mode).
// Override via quizConfig.forceDay for manual control or testing.

const day1Questions = [
  {
    id: 'Q1',
    question: {
      id: 'Apa yang dimaksud dengan tatung?',
      en: 'What is a tatung?',
      zh: '什么是 tatung（童身）？',
    },
    options: [
      { id: 'A', text: { id: 'Tarian tradisional masyarakat Tionghoa', en: 'A traditional dance performed by Chinese communities', zh: '华人群体的传统舞蹈' } },
      { id: 'B', text: { id: 'Orang yang tubuhnya dijadikan media atau perantara roh leluhur atau dewa', en: 'A person whose body is used as a medium for ancestral spirits or deities', zh: '身体被用作祖先神灵或神明媒介的人' } },
      { id: 'C', text: { id: 'Pemimpin pemerintahan masyarakat Tionghoa', en: 'A leader of Chinese community governance', zh: '华人社区的政府领袖' } },
      { id: 'D', text: { id: 'Pertunjukan seni bela diri tradisional', en: 'A traditional martial arts performance', zh: '传统武术表演' } },
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
      { id: 'A', text: { id: 'Menarik wisatawan asing', en: 'Attracting foreign tourists', zh: '吸引外国游客' } },
      { id: 'B', text: { id: 'Merayakan pergantian musim', en: 'Celebrating the change of seasons', zh: '庆祝季节交替' } },
      { id: 'C', text: { id: 'Mengusir roh jahat dan melindungi masyarakat dari gangguan buruk', en: 'Warding off evil spirits and protecting the community', zh: '驱邪并保护社区免受侵扰' } },
      { id: 'D', text: { id: 'Memperkenalkan pakaian tradisional', en: 'Introducing traditional clothing', zh: '介绍传统服饰' } },
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
      { id: 'A', text: { id: 'Da Lao Ye', en: 'Da Lao Ye', zh: '大老爷' } },
      { id: 'B', text: { id: 'Tong Ji', en: 'Tong Ji', zh: '童乩' } },
      { id: 'C', text: { id: 'Feng Shui', en: 'Feng Shui', zh: '风水' } },
      { id: 'D', text: { id: 'Gong Xi', en: 'Gong Xi', zh: '恭喜' } },
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
      { id: 'A', text: { id: 'Ng Fong Pak Kung', en: 'Ng Fong Pak Kung', zh: '五福伯公' } },
      { id: 'B', text: { id: 'San Tai Zi', en: 'San Tai Zi', zh: '三太子' } },
      { id: 'C', text: { id: 'Chau Liu Nyian Shai', en: 'Chau Liu Nyian Shai', zh: '周刘年师' } },
      { id: 'D', text: { id: 'Sun Go Kong', en: 'Sun Go Kong', zh: '孙悟空' } },
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
      { id: 'A', text: { id: 'Sebagai simbol kekayaan', en: 'A symbol of wealth', zh: '财富的象征' } },
      { id: 'B', text: { id: 'Sebagai perlengkapan peperangan', en: 'War equipment', zh: '战争装备' } },
      { id: 'C', text: { id: 'Sebagai simbol kekuatan spiritual dan perlindungan', en: 'A symbol of spiritual power and protection', zh: '精神力量与护佑的象征' } },
      { id: 'D', text: { id: 'Sebagai alat pertunjukan tari biasa', en: 'An ordinary dance performance prop', zh: '普通舞蹈表演道具' } },
    ],
    correctOptionId: 'C',
  },
]

const day2Questions = [
  {
    id: 'Q1',
    question: {
      id: 'Dimanakah tempat kelahiran John Lie?',
      en: 'Where was John Lie born?',
      zh: 'John Lie 出生在哪里？',
    },
    options: [
      { id: 'A', text: { id: 'Jakarta', en: 'Jakarta', zh: '雅加达' } },
      { id: 'B', text: { id: 'Manado', en: 'Manado', zh: '万鸦老' } },
      { id: 'C', text: { id: 'Pekanbaru', en: 'Pekanbaru', zh: '北干巴鲁' } },
      { id: 'D', text: { id: 'Palembang', en: 'Palembang', zh: '巨港' } },
    ],
    correctOptionId: 'B',
  },
  {
    id: 'Q2',
    question: {
      id: 'Pada tahun berapakah John Lie meninggalkan Manado dan berangkat ke Batavia?',
      en: 'In what year did John Lie leave Manado for Batavia?',
      zh: 'John Lie 哪一年离开万鸦老前往巴达维亚？',
    },
    options: [
      { id: 'A', text: { id: '1926', en: '1926', zh: '1926' } },
      { id: 'B', text: { id: '1927', en: '1927', zh: '1927' } },
      { id: 'C', text: { id: '1928', en: '1928', zh: '1928' } },
      { id: 'D', text: { id: '1929', en: '1929', zh: '1929' } },
    ],
    correctOptionId: 'C',
  },
  {
    id: 'Q3',
    question: {
      id: 'Apa nama kapal yang digunakan John Lie saat mencoba menembus blokade Belanda?',
      en: 'What was the name of the ship John Lie used to break the Dutch blockade?',
      zh: 'John Lie 突破荷兰封锁时使用的船叫什么名字？',
    },
    options: [
      { id: 'A', text: { id: 'Inlaw', en: 'Inlaw', zh: 'Inlaw' } },
      { id: 'B', text: { id: 'Inlow', en: 'Inlow', zh: 'Inlow' } },
      { id: 'C', text: { id: 'Outlaw', en: 'Outlaw', zh: 'Outlaw' } },
      { id: 'D', text: { id: 'Outlow', en: 'Outlow', zh: 'Outlow' } },
    ],
    correctOptionId: 'A',
  },
  {
    id: 'Q4',
    question: {
      id: 'Pada tahun berapakah John Lie bergabung dengan Angkatan Laut Republik Indonesia?',
      en: 'In what year did John Lie join the Indonesian Navy?',
      zh: 'John Lie 哪一年加入印度尼西亚海军？',
    },
    options: [
      { id: 'A', text: { id: '1944', en: '1944', zh: '1944' } },
      { id: 'B', text: { id: '1946', en: '1946', zh: '1946' } },
      { id: 'C', text: { id: '1948', en: '1948', zh: '1948' } },
      { id: 'D', text: { id: '1950', en: '1950', zh: '1950' } },
    ],
    correctOptionId: 'B',
  },
  {
    id: 'Q5',
    question: {
      id: 'Di mana tempat John Lie dimakamkan?',
      en: 'Where is John Lie buried?',
      zh: 'John Lie 安葬在哪里？',
    },
    options: [
      { id: 'A', text: { id: 'Taman Makam Pahlawan Patriot Bangsa', en: 'Patriot Bangsa Heroes Cemetery', zh: '民族英雄公墓' } },
      { id: 'B', text: { id: 'Taman Makam Pahlawan Sawala', en: 'Sawala Heroes Cemetery', zh: '萨瓦拉英雄公墓' } },
      { id: 'C', text: { id: 'Taman Makam Pahlawan Kalibata', en: 'Kalibata Heroes Cemetery', zh: '卡利巴塔英雄公墓' } },
      { id: 'D', text: { id: 'Taman Makam Pahlawan Tenjolaya', en: 'Tenjolaya Heroes Cemetery', zh: '登约拉亚英雄公墓' } },
    ],
    correctOptionId: 'C',
  },
]

const day3Questions = [
  {
    id: 'Q1',
    question: {
      id: 'Apa nama lain dari Selat Panjang?',
      en: 'What is another name for Selat Panjang?',
      zh: '石叻班让的另一个名称是什么？',
    },
    options: [
      { id: 'A', text: { id: 'Kota Kepulauan', en: 'Island City', zh: '群岛之城' } },
      { id: 'B', text: { id: 'Kota Sagu', en: 'Sago City', zh: '西米之城' } },
      { id: 'C', text: { id: 'Kota Pantai', en: 'Beach City', zh: '海滨之城' } },
      { id: 'D', text: { id: 'Kota Ramai', en: 'Busy City', zh: '繁华之城' } },
    ],
    correctOptionId: 'B',
  },
  {
    id: 'Q2',
    question: {
      id: 'Pada saat merayakan apakah pistol air digunakan?',
      en: 'During what celebration are water pistols used?',
      zh: '在哪个庆典中会使用水枪？',
    },
    options: [
      { id: 'A', text: { id: 'Saat di Hutan Mangrove agar tanah tumbuh subur', en: 'At the Mangrove Forest so the soil becomes fertile', zh: '在红树林使土壤肥沃' } },
      { id: 'B', text: { id: 'Saat di Festival Cian Cui', en: 'At the Cian Cui Festival', zh: '在 Cian Cui 节庆中' } },
      { id: 'C', text: { id: 'Saat di pantai Dorak', en: 'At Dorak Beach', zh: '在 Dorak 海滩' } },
      { id: 'D', text: { id: 'Semua benar', en: 'All of the above', zh: '以上皆是' } },
    ],
    correctOptionId: 'B',
  },
  {
    id: 'Q3',
    question: {
      id: 'Apa nama makanan kuliner khas Selat Panjang?',
      en: 'What is the signature dish of Selat Panjang?',
      zh: '石叻班让的特色美食叫什么名字？',
    },
    options: [
      { id: 'A', text: { id: 'Sempolet dan Mie Sagu', en: 'Sempolet and Sago Noodles', zh: 'Sempolet 和西米面' } },
      { id: 'B', text: { id: 'Sempolet dan Bihun Sagu', en: 'Sempolet and Sago Vermicelli', zh: 'Sempolet 和西米粉' } },
      { id: 'C', text: { id: 'Sampolet dan Mie Sagu', en: 'Sampolet and Sago Noodles', zh: 'Sampolet 和西米面' } },
      { id: 'D', text: { id: 'Sampolet dan Bihun Sagu', en: 'Sampolet and Sago Vermicelli', zh: 'Sampolet 和西米粉' } },
    ],
    correctOptionId: 'A',
  },
  {
    id: 'Q4',
    image: '/images/exhibits/PSBIKT-001/cover.webp',
    question: {
      id: 'Ada berapa kuda dalam lukisan kuda?',
      en: 'How many horses are in the horse painting?',
      zh: '这幅马的画中有多少匹马？',
    },
    options: [
      { id: 'A', text: { id: '7', en: '7', zh: '7' } },
      { id: 'B', text: { id: '8', en: '8', zh: '8' } },
      { id: 'C', text: { id: '9', en: '9', zh: '9' } },
      { id: 'D', text: { id: '10', en: '10', zh: '10' } },
    ],
    correctOptionId: 'B',
  },
  {
    id: 'Q5',
    question: {
      id: 'Pada tanggal berapa kebakaran besar terjadi di Selat Panjang?',
      en: 'On what date did the major fire occur in Selat Panjang?',
      zh: '石叻班让发生大火是哪一天？',
    },
    options: [
      { id: 'A', text: { id: '14 Februari 1960', en: '14 February 1960', zh: '1960年2月14日' } },
      { id: 'B', text: { id: '14 Februari 1962', en: '14 February 1962', zh: '1962年2月14日' } },
      { id: 'C', text: { id: '14 Februari 1964', en: '14 February 1964', zh: '1964年2月14日' } },
      { id: 'D', text: { id: '14 Februari 1966', en: '14 February 1966', zh: '1966年2月14日' } },
    ],
    correctOptionId: 'C',
  },
]

export const quizSets = [
  { id: 'day1', date: '2026-10-27', title: 'Kuis Day 1', questions: day1Questions },
  { id: 'day2', date: '2026-10-28', title: 'Kuis Day 2', questions: day2Questions },
  { id: 'day3', date: '2026-10-29', title: 'Kuis Day 3', questions: day3Questions },
]

export function getJakartaToday() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())
  const y = parts.find((p) => p.type === 'year').value
  const m = parts.find((p) => p.type === 'month').value
  const d = parts.find((p) => p.type === 'day').value
  return y + '-' + m + '-' + d
}

export function getActiveQuizSet(todayStr) {
  const today = todayStr || getJakartaToday()
  const sorted = [...quizSets].sort((a, b) => a.date.localeCompare(b.date))
  let active = sorted[0]
  for (const qs of sorted) {
    if (qs.date <= today) active = qs
    else break
  }
  return active
}
