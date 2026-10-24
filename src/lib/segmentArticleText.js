const LOCALES = {
  en: 'en-US',
  id: 'id-ID',
  zh: 'zh-CN',
}

const PARAGRAPH_BREAK = String.fromCharCode(10) + String.fromCharCode(10)
const SENTENCE_ENDINGS = new Set(['.', '!', '?', '。', '！', '？'])

function fallbackSentenceSegments(text) {
  const segments = []
  let current = ''

  for (const character of text) {
    current += character
    if (SENTENCE_ENDINGS.has(character)) {
      if (current.trim()) segments.push(current.trim())
      current = ''
    }
  }

  if (current.trim()) segments.push(current.trim())
  return segments.length ? segments : [text]
}

export function segmentArticleText(text, language, inlineImages = []) {
  const blocks = []
  const locale = LOCALES[language] || LOCALES.en
  const normalized = text ? text.split(String.fromCharCode(13)).join('') : ''
  const paragraphs = normalized
    .split(PARAGRAPH_BREAK)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

  paragraphs.forEach((paragraph, paragraphIndex) => {
    let sentences
    if (typeof Intl.Segmenter === 'function') {
      const segmenter = new Intl.Segmenter(locale, { granularity: 'sentence' })
      sentences = Array.from(segmenter.segment(paragraph), (entry) => entry.segment.trim()).filter(Boolean)
    } else {
      sentences = fallbackSentenceSegments(paragraph)
    }

    const image = inlineImages.find((img) => img.paragraphIndex === paragraphIndex)

    sentences.forEach((sentence, sentenceIndex) => {
      blocks.push({
        type: 'text',
        text: sentence,
        paragraphStart: paragraphIndex > 0 && sentenceIndex === 0,
        paragraphIndex,
        image: sentenceIndex === 0 ? image : null,
      })
    })
  })

  return blocks
}

export function joinSentenceUnits(units) {
  return units.reduce((text, unit, index) => {
    if (index === 0) return unit.text
    return text + (unit.paragraphStart ? PARAGRAPH_BREAK : ' ') + unit.text
  }, '')
}
