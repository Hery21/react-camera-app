import { readFileSync, writeFileSync } from 'node:fs'

const JSON_PATH = 'src/data/exhibits.json'

const newExhibits = [
  {
    id: 'PSBIKT-009',
    coverImage: '/images/exhibits/PSBIKT-009/cover.webp',
    content: {
      id: {
        title: 'San Tai Zi',
        summary:
          'San Tai Zi (三太子) secara harfiah berarti Pangeran Ketiga. Dalam tradisi populer masyarakat Tionghoa, sebutan ini sering digunakan untuk merujuk kepada Na Zha, yang juga dikenal dengan nama Nezha.',
        coverAlt: 'Patung San Tai Zi dengan tombak dan ornamen teratai',
        pages: [
          {
            text: 'San Tai Zi (三太子) secara harfiah berarti Pangeran Ketiga. Dalam tradisi populer masyarakat Tionghoa, sebutan ini sering digunakan untuk merujuk kepada Na Zha, yang juga dikenal dengan nama Nezha. Na Zha digambarkan sebagai sosok dewa muda yang memiliki keberanian, kekuatan, dan semangat untuk melawan kejahatan. Dalam kepercayaan tradisional Tionghoa, ia dihormati sebagai pelindung yang membantu mengusir kekuatan jahat dan menjaga keselamatan manusia.\n\nSalah satu kisah yang terkenal menceritakan bahwa Na Zha merupakan putra Li Jing, seorang tokoh militer dalam legenda Tiongkok. Sejak kecil, Na Zha digambarkan memiliki kekuatan yang luar biasa. Akan tetapi, kekuatannya juga membuatnya terlibat dalam berbagai konflik. Dalam salah satu cerita terkenal, Na Zha berkonflik dengan makhluk-makhluk dari kerajaan naga. Setelah peristiwa yang tragis, ia mengorbankan dirinya demi melindungi keluarganya.\n\nNamun, kisahnya tidak berakhir di sana. Dalam versi legenda yang populer, Na Zha kemudian dihidupkan kembali dengan tubuh yang terbentuk dari bunga teratai. Ia memperoleh kehidupan baru dan melanjutkan perjuangannya melawan kejahatan. Cerita tersebut menjadi salah satu alasan mengapa Na Zha dipandang sebagai simbol keberanian, pengorbanan, dan kelahiran kembali.',
          },
          {
            text: 'San Tai Zi memiliki ciri khas yang membedakannya dari banyak dewa lain dalam tradisi Tionghoa. Beberapa atribut yang sering ditemukan dalam penggambarannya adalah:\n\n• Wajah muda: melambangkan semangat, keberanian, dan kekuatan yang tidak mengenal usia.\n• Tombak: menjadi simbol kemampuan bertempur dan melawan kejahatan.\n• Roda angin dan api: menggambarkan kekuatan serta kecepatannya.\n• Lingkaran emas: dalam sejumlah penggambaran Na Zha, lingkaran ini menjadi salah satu senjata khasnya.\n• Tubuh atau ornamen teratai: berkaitan dengan kisah kelahirannya kembali dalam legenda.',
          },
          {
            text: 'Bagi para penganutnya, San Tai Zi bukan sekadar tokoh dalam cerita kuno. Sosok ini dapat memiliki sejumlah makna spiritual dan budaya, antara lain:\n\n• Keberanian: mengingatkan manusia agar berani menghadapi kesulitan.\n• Perlindungan: menjadi simbol harapan akan keselamatan bagi keluarga dan lingkungan.\n• Pengorbanan: mengingatkan pentingnya tanggung jawab dan kesediaan berkorban demi orang lain.\n• Pelestarian tradisi: menjadi bagian dari warisan budaya yang diteruskan melalui cerita, patung, ritual, dan kegiatan di kelenteng.',
          },
        ],
      },
      en: {
        title: 'San Tai Zi',
        summary:
          'San Tai Zi (三太子) literally means Third Prince. In popular Chinese tradition, this title often refers to Na Zha (Nezha), a young deity known for courage, strength, and the spirit to fight evil.',
        coverAlt: 'Statue of San Tai Zi holding a spear with lotus ornaments',
        pages: [
          {
            text: 'San Tai Zi (三太子) literally means Third Prince. In popular Chinese tradition, this title often refers to Na Zha (Nezha), depicted as a young deity with courage, strength, and spirit to fight evil. In traditional Chinese belief, he is honored as a protector who helps drive away evil forces and safeguard humanity.\n\nOne well-known story tells that Na Zha was the son of Li Jing, a military figure in Chinese legend. From a young age, Na Zha was depicted with extraordinary powers. However, his strength also drew him into many conflicts. In one famous tale, Na Zha clashed with creatures from the dragon kingdom. After a tragic event, he sacrificed himself to protect his family.\n\nBut his story did not end there. In the popular legend, Na Zha was resurrected with a body formed from lotus flowers. He received new life and continued his fight against evil. This story is one reason Na Zha is seen as a symbol of courage, sacrifice, and rebirth.',
          },
          {
            text: 'San Tai Zi has distinctive features that set him apart from many other deities in Chinese tradition. Some of the attributes often seen in his depiction are:\n\n• Youthful face: symbolizes spirit, courage, and strength that knows no age.\n• Spear: a symbol of combat ability and the fight against evil.\n• Wind and fire wheels: represent his power and speed.\n• Golden ring: in several depictions of Na Zha, this ring is one of his signature weapons.\n• Lotus body or ornaments: tied to the legend of his rebirth.',
          },
          {
            text: 'For his devotees, San Tai Zi is not merely a figure from ancient stories. This figure can carry several spiritual and cultural meanings, including:\n\n• Courage: reminds people to face hardships bravely.\n• Protection: symbolizes hope for safety for family and community.\n• Sacrifice: reminds us of the importance of responsibility and willingness to sacrifice for others.\n• Preservation of tradition: part of the cultural heritage passed down through stories, statues, rituals, and activities at the temple.',
          },
        ],
      },
      zh: {
        title: '三太子',
        summary:
          '三太子字面意为第三位王子。在华人民间传统中，此称号常指哪吒，一位以勇气、力量和对邪邪恶精神著称的年轻神祇。',
        coverAlt: '手持长矛、饰有莲花的三太子神像',
        pages: [
          {
            text: '三太子字面意为第三位王子。在华人民间传统中，此称号常指哪吒。哪吒被描绘为一位年轻神祇，具备勇气、力量以及对抗邪恶的精神。在华人传统信仰中，他被尊为守护者，能驱除邪恶力量并保佑世人平安。\n\n一则著传说称，哪吒是李靖之子，李靖是中国传说中的一位武将。哪吒自幼便展现出非凡的力量。然而，他的力量也让他卷入诸多冲突。在一则著故事中，哪吒与龙族发生冲突。历经一场悲剧后，他为保护家人而牺牲自己。\n\n但他的故事并未就此结束。在广为流传的传说版本中，哪吒以莲花之身重生。他重获新生，继续与邪恶抗争。这段故事是「哪吒被视为勇气、牺牲与重生象征」的原因之一。',
          },
          {
            text: '三太子具有与其他众多华人神明不同的显著特征。常见于其造像中的几项特征包括：\n\n• 少年面容：象征精神、勇气及不受年龄限制的力量。\n• 长矛：象征战斗能力及对抗邪恶的力量。\n• 风火轮：表现其力量与速度。\n• 金圈：在「哪吒的多种造像」中，此圈是其标志性武器之一。\n• 莲花之身或莲花装饰：与其传说中重生的故事相关。',
          },
          {
            text: '对其信徒而言，三太子不仅是一位古老故事中的人物。这一形象可承载多重精神与文化意义，包括：\n\n• 勇气：提醒人们勇敢面对困难。\n• 守护：象征对家庭与社区平安的希望。\n• 牺牲：提醒我们承担责任及为他人牺牲的重要性。\n• 传统延续：作为通过故事、神像、仪式及庙宇活动传承的文化遗产的一部分。',
          },
        ],
      },
    },
  },
  {
    id: 'PSBIKT-010',
    coverImage: '/images/exhibits/PSBIKT-010/cover.webp',
    content: {
      id: {
        title: 'Tradisi Minum Teh',
        summary:
          'Tradisi minum teh China merupakan salah satu warisan budaya tertua di dunia. Bagi masyarakat Tionghoa, teh bukan sekadar minuman, melainkan simbol penghormatan, keharmonisan, kesederhanaan, dan hubungan antarmanusia.',
        coverAlt: 'Peralatan tradisional Gongfu Cha dengan teko kecil, gaiwan, dan cangkir teh',
        pages: [
          {
            text: 'Tradisi minum teh China merupakan salah satu warisan budaya tertua di dunia. Bagi masyarakat Tiongkok, teh bukan sekadar minuman, melainkan simbol penghormatan, keharmonisan, kesederhanaan, dan hubungan antarmanusia. Tradisi ini dikenal dengan istilah Cha Dao (茶道), yang berarti Jalan Teh. Istilah ini menggambarkan filosofi dan cara menikmati teh dengan penuh perhatian, ketenangan, serta penghargaan terhadap setiap proses penyeduhannya.\n\nMenurut legenda Tiongkok, teh ditemukan oleh Shennong, seorang tokoh legendaris yang dikenal sebagai penguasa pertanian dan pengobatan herbal. Konon, daun teh jatuh ke dalam air panas yang sedang direbusnya dan menghasilkan minuman dengan aroma yang menyegarkan. Perkembangan tradisi teh dapat dibagi menjadi beberapa periode.',
          },
          {
            text: '1. Dinasti Han (206 SM–220 M)\nPenggunaan teh mulai dikenal di sejumlah wilayah Tiongkok, meskipun bukti mengenai kebiasaan meminumnya pada masa awal ini masih terbatas.\n\n2. Dinasti Tang (618–907 M)\nTeh semakin populer dan berkembang menjadi bagian penting kehidupan sosial serta budaya. Penulis Lu Yu menulis The Classic of Tea atau Cha Jing, karya penting yang membahas tanaman teh, peralatan, dan cara menyiapkannya.\n\n3. Dinasti Song (960–1279 M)\nBudaya teh berkembang pesat. Teh bubuk dikocok bersama air panas, dan kegiatan menikmati teh menjadi bagian dari pertemuan sosial serta apresiasi seni.\n\n4. Dinasti Ming dan Qing (1368–1912 M)\nPenyeduhan daun teh utuh dalam air panas semakin berkembang. Berbagai teknik penyeduhan dan peralatan teh yang dikenal saat ini juga berkembang melalui tradisi dari periode tersebut.\n\nSeiring waktu, teh menjadi bagian dari kehidupan sehari-hari, perayaan keluarga, hubungan sosial, dan penghormatan kepada orang yang lebih tua.',
          },
          {
            text: 'Dalam kebudayaan Tiongkok, minum teh dapat mengandung berbagai makna filosofis.\n\n1. Harmoni (和 — Hé)\nTeh melambangkan keharmonisan antara manusia, alam, dan lingkungan. Proses menyeduh teh mengajarkan seseorang untuk menikmati waktu, menghargai bahan alami, dan menciptakan suasana yang tenang.\n\n2. Rasa Hormat (敬 — Jìng)\nMenyajikan teh kepada orang lain merupakan bentuk penghormatan. Dalam keluarga, anak-anak dapat menyuguhkan teh kepada orang tua sebagai tanda bakti. Dalam pertemuan sosial, tuan rumah menyajikan teh kepada tamu untuk menunjukkan keramahan.\n\n3. Ketenangan (静 — Jìng)\nTradisi minum teh mengajak seseorang untuk memperlambat aktivitas dan memperhatikan hal-hal sederhana, seperti aroma daun teh, suhu air, warna seduhan, dan rasa yang muncul.\n\n4. Kesederhanaan (俭 — Jiǎn)\nKenikmatan teh tidak selalu bergantung pada peralatan mahal atau bahan yang mewah. Bahkan secangkir teh sederhana dapat menjadi sarana untuk menikmati kebersamaan.',
          },
          {
            text: 'Salah satu tradisi penyeduhan teh China yang paling dikenal adalah Gongfu Cha (工夫茶). Istilah Gongfu Cha dapat dipahami sebagai penyeduhan teh dengan keterampilan, ketelitian, dan latihan. Tradisi ini sangat dikenal di wilayah Guangdong, terutama Chaoshan, serta di kalangan masyarakat Tionghoa di Fujian dan wilayah lainnya. Berbeda dengan cara menyeduh teh dalam teko besar, Gongfu Cha biasanya menggunakan teko kecil atau mangkuk bertutup yang disebut gaiwan. Salah satu keistimewaan Gongfu Cha adalah daun teh yang sama dapat diseduh berkali-kali. Setiap seduhan dapat menghasilkan aroma dan karakter rasa yang berbeda.\n\nPeralatan yang digunakan:\n• Teko teh kecil: untuk menyeduh daun teh.\n• Gaiwan: mangkuk bertutup yang dapat digunakan untuk menyeduh dan menuangkan teh.\n• Cangkir kecil: untuk menikmati teh sedikit demi sedikit.\n• Cha hai: wadah penampung teh sebelum dibagikan ke cangkir.\n• Nampan teh: untuk menampung air yang tumpah selama proses penyeduhan.\n• Penjepit dan alat teh: digunakan dalam beberapa tata cara tradisional untuk membantu menjaga kebersihan peralatan.',
          },
          {
            text: 'Bagaimana prosesnya?\n1. Menghangatkan peralatan, teko dan cangkir dibilas dengan air panas.\n2. Memasukkan daun teh, daun teh berkualitas dimasukkan ke dalam teko atau gaiwan.\n3. Menuangkan air panas, suhu air disesuaikan dengan jenis teh.\n4. Menyeduh dalam waktu singkat, lama penyeduhan bergantung pada jenis teh dan selera.\n5. Menuangkan hasil seduhan, teh dipindahkan ke wadah penampung agar kekuatan rasanya merata.\n6. Menyajikan teh, teh dibagikan ke cangkir-cangkir kecil.\n7. Menikmati aromanya, teh diminum perlahan sambil memperhatikan aroma dan rasanya.\n\nTradisi minum teh terus bertahan karena mudah menyatu dengan kehidupan sehari-hari. Di rumah, teh dapat menjadi teman saat keluarga berkumpul. Di kedai teh, teh menjadi sarana bertemu teman dan berbincang. Dalam perayaan keluarga, teh dapat menjadi simbol penghormatan dan rasa syukur. Tradisi ini juga diwariskan melalui kebiasaan sederhana di mana orang tua mengajarkan anak-anak cara menyeduh teh, memilih daun teh, dan menyuguhkannya kepada tamu. Bagi sebagian orang, kegiatan ini bahkan menjadi kesempatan untuk beristirahat sejenak dari kesibukan sehari-hari. Dengan demikian, tradisi minum teh tidak hanya bertahan karena cita rasanya, tetapi juga karena nilai sosial dan budaya yang menyertainya.',
          },
        ],
      },
      en: {
        title: 'Tea Drinking Tradition',
        summary:
          'The Chinese tea drinking tradition is one of the world\u2019s oldest cultural heritages. For Chinese communities, tea is more than a beverage \u2014 it symbolizes respect, harmony, simplicity, and human connection.',
        coverAlt: 'Traditional Gongfu Cha set with a small teapot, gaiwan, and tea cups',
        pages: [
          {
            text: 'The Chinese tea drinking tradition is one of the world\u2019s oldest cultural heritages. For Chinese communities, tea is more than a beverage \u2014 it symbolizes respect, harmony, simplicity, and human connection. This tradition is known as Cha Dao (茶道), meaning the Way of Tea. The term describes a philosophy and a way of enjoying tea with full attention, calmness, and appreciation for every step of brewing.\n\nAccording to Chinese legend, tea was discovered by Shennong, a legendary figure known as the ruler of agriculture and herbal medicine. It is said that tea leaves fell into the hot water he was boiling, producing a drink with a refreshing aroma. The development of the tea tradition can be divided into several periods.',
          },
          {
            text: '1. Han Dynasty (206 BCE \u2013 220 CE)\nTea use began to be known in several regions of China, though evidence of early tea drinking habits is still limited.\n\n2. Tang Dynasty (618 \u2013 907 CE)\nTea grew in popularity and became an important part of social and cultural life. The writer Lu Yu authored The Classic of Tea (Cha Jing), an important work on the tea plant, utensils, and methods of preparation.\n\n3. Song Dynasty (960 \u2013 1279 CE)\nTea culture flourished. Powdered tea was whisked with hot water, and enjoying tea became part of social gatherings and artistic appreciation.\n\n4. Ming and Qing Dynasties (1368 \u2013 1912 CE)\nBrewing whole tea leaves in hot water became more widespread. Many brewing techniques and tea utensils familiar today developed through traditions from this period.\n\nOver time, tea became part of daily life, family celebrations, social relationships, and respect for elders.',
          },
          {
            text: 'In Chinese culture, tea drinking can carry various philosophical meanings.\n\n1. Harmony (和 \u2014 Hé)\nTea symbolizes harmony between people, nature, and the environment. The process of brewing tea teaches us to enjoy time, appreciate natural ingredients, and create a calm atmosphere.\n\n2. Respect (敬 \u2014 Jìng)\nServing tea to others is a form of respect. In a family, children may serve tea to their parents as a sign of filial devotion. In social gatherings, hosts serve tea to guests as a gesture of hospitality.\n\n3. Tranquility (静 \u2014 Jìng)\nThe tea drinking tradition invites us to slow down and notice simple things \u2014 the aroma of the leaves, the water temperature, the color of the brew, and the flavors that emerge.\n\n4. Simplicity (俭 \u2014 Jiǎn)\nThe enjoyment of tea does not depend on expensive equipment or luxurious ingredients. Even a simple cup of tea can be a way to enjoy togetherness.',
          },
          {
            text: 'One of the most well-known Chinese tea brewing traditions is Gongfu Cha (工夫茶). The term Gongfu Cha can be understood as brewing tea with skill, care, and practice. This tradition is especially known in Guangdong, particularly Chaoshan, and among Chinese communities in Fujian and other regions. Unlike brewing tea in a large teapot, Gongfu Cha typically uses a small teapot or a lidded bowl called a gaiwan. One of the special features of Gongfu Cha is that the same tea leaves can be brewed many times. Each brewing can produce a different aroma and flavor character.\n\nEquipment used:\n• Small teapot: for brewing the tea leaves.\n• Gaiwan: a lidded bowl used for brewing and pouring tea.\n• Small cups: for enjoying tea sip by sip.\n• Cha hai: a vessel to collect the brewed tea before it is shared into cups.\n• Tea tray: to catch water that spills during brewing.\n• Tongs and tea tools: used in some traditional routines to help keep the tools clean.',
          },
          {
            text: 'How does the process work?\n1. Warming the equipment \u2014 the teapot and cups are rinsed with hot water.\n2. Adding tea leaves \u2014 quality tea leaves are placed into the teapot or gaiwan.\n3. Pouring hot water \u2014 water temperature is adjusted for the type of tea.\n4. Brewing briefly \u2014 brewing time depends on the tea type and personal preference.\n5. Pouring the brewed tea \u2014 tea is transferred to the collecting vessel so the flavor is even.\n6. Serving the tea \u2014 tea is shared into small cups.\n7. Enjoying the aroma \u2014 tea is sipped slowly while noticing its aroma and flavor.\n\nThe tea drinking tradition endures because it fits easily into daily life. At home, tea can accompany family gatherings. In teahouses, tea becomes a way to meet friends and talk. At family celebrations, tea can symbolize respect and gratitude. The tradition is also passed on through simple habits, where parents teach children how to brew tea, choose tea leaves, and serve guests. For some, this is even an opportunity to take a break from daily busyness. The tea drinking tradition thus survives not only for its taste, but also for the social and cultural values that accompany it.',
          },
        ],
      },
      zh: {
        title: '饮茶传统',
        summary:
          '中国饮茶传统是世界上最古老的文化遗产之一。对华人而言，茶不仅是饮品，更象征敬意、和谐、简朴与人际关系。',
        coverAlt: '传统功夫茶具，包括小茶壶、盖碗和茶杯',
        pages: [
          {
            text: '中国饮茶传统是世界上最古老的文化遗产之一。对华人而言，茶不仅是饮品，更象征敬意、和谐、简朴与人际关系。这一传统被称为茶道，意即茶之道。此词描述一种以专注、宁静及珍视冲泡每一环节的方式品味茶的哲学与实践。\n\n据中国传说，茶由神农发现，神农是传说中的农业与草药之神。相传，茶叶飘落至他煮水时滚烫的热水中，因而产生带有清新香气的饮品。茶传统的发展可分为数个时期。',
          },
          {
            text: '1. 汉代（公元前206年—公元220年）\n中国多个地区开始认识茶的用途，但关于早期饮茶习惯的证据仍然有限。\n\n2. 唐代（618–907年）\n茶日益普及，成为社会与文化生活的重要组成部分。陆羽撰写《茶经》，为一部论述茶树、茶具及冲泡方法的重要著作。\n\n3. 宋代（960–1279年）\n茶文化蓬勃发展。人们将茶粉与热水搅拌成茶汤，品茶成为社交聚会与赏艺活动的一部分。\n\n4. 明清时期（1368–1912年）\n以热水冲泡整叶茶的方式愈发普及。今日所熟知的许多冲泡技法与茶具亦承自该时期的传统。\n\n随时间推移，茶成为日常生活、家庭庆典、社交往来及尊重长辈的一部分。',
          },
          {
            text: '在中华文化中，饮茶蕴含多种哲学意义。\n\n1. 和 — Hé\n茶象征人与自然、环境之间的和谐。冲泡茶叶的过程教会人们享受时光、珍惜自然原料，并营造宁静的氛围。\n\n2. 敬 — Jìng\n为他人奉茶是一种敬意。在家庭中，子女为父母奉茶以表达孝心。在社交聚会中，主人为宾客奉茶以示款待。\n\n3. 静 — Jìng\n饮茶传统邀请人们放慢节奏，关注简单事物——茶叶香气、水温、茶汤颜色及滋味。\n\n4. 俭 — Jiǎn\n品茶之乐并不依赖昂贵器具或奢华原料。即便一杯清茶亦可成为共享美好时光的途径。',
          },
          {
            text: '最广为人知的中国冲泡传统之一是工夫茶。工夫茶一词可理解为以技艺、细致及练习冲泡茶。该传统在广东尤其是潮汕地区以及福建等地的华人社群中尤为流行。与大壶泡茶不同，工夫茶通常使用小茶壶或带盖的碗——盖碗。工夫茶的一大特色是同一批茶叶可反复冲泡多次。每次冲泡可呈现不同香气与味道。\n\n所用器具：\n• 小茶壶：用于冲泡茶叶。\n• 盖碗：带盖的碗，可用于冲泡与出汤。\n• 小茶杯：用于细细品茶。\n• 茶海：在分茶入杯前盛接茶汤的容器。\n• 茶盘：承接冲泡过程中溢出的水。\n• 茶夹与茶具：在部分传统步骤中用于保持器具清洁。',
          },
          {
            text: '冲泡流程：\n1. 温器——以热水冲洗茶壶与茶杯。\n2. 置茶——将优质茶叶放入茶壶或盖碗。\n3. 注水——根据茶叶种类调整水温。\n4. 短暂冲泡——冲泡时长取决于茶叶种类及个人偏好。\n5. 出汤——将茶汤倒入容器中，使滋味更均匀。\n6. 分茶——将茶汤分入小茶杯中。\n7. 品味——慢慢啜饮，留意其香气与滋味。\n\n饮茶传统之所以延续至今，是因为它容易融入日常生活。在家中，茶伴随家人相聚。在茶馆，茶成为会友闲谈的媒介。在家庭庆典中，茶象征敬意与感恩。这一传统亦通过简单习惯代代相传——父母教孩子如何泡茶、选茶及待客。对部分人而言，这更是从日常忙碌中短暂休憩的机会。因此，饮茶传统得以延续，不仅因其滋味，更因其背后的社会与文化价值。',
          },
        ],
      },
    },
  },
]

const current = JSON.parse(readFileSync(JSON_PATH, 'utf8'))
const existingIds = new Set(current.map((e) => e.id))

let added = 0
for (const exhibit of newExhibits) {
  if (!existingIds.has(exhibit.id)) {
    current.push(exhibit)
    existingIds.add(exhibit.id)
    added += 1
  }
}

writeFileSync(JSON_PATH, JSON.stringify(current, null, 2) + '\n')
console.log('Added ' + added + ' exhibit(s). Total is now ' + current.length + '.')
