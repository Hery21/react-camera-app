import { joinSentenceUnits, segmentArticleText } from '../src/lib/segmentArticleText.js'

function check(condition, label) {
  console.log((condition ? 'OK  ' : 'FAIL') + label)
  if (!condition) process.exitCode = 1
}

const english = segmentArticleText('First sentence. Second sentence! Third sentence?', 'en')
check(english.length === 3, 'English sentences segmented')
check(english[0].text === 'First sentence.', 'English punctuation preserved')

const indonesian = segmentArticleText('Kalimat pertama. Kalimat kedua.', 'id')
check(indonesian.length === 2, 'Indonesian sentences segmented')

const chinese = segmentArticleText('第一句。第二句！第三句？', 'zh')
check(chinese.length === 3, 'Chinese sentences segmented')

const paragraphs = segmentArticleText('First paragraph.\n\nSecond paragraph.', 'en')
check(paragraphs[1].paragraphStart === true, 'Paragraph boundary preserved')
check(joinSentenceUnits(paragraphs).includes('\n\n'), 'Paragraph spacing restored')

if (process.exitCode) process.exit(1)
console.log('All sentence segmentation checks passed')
