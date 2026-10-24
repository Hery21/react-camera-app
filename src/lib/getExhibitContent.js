export function resolveExhibitContent(exhibit, language) {
  if (!exhibit?.content) return { content: null, sourceLanguage: null, isFallback: false }

  if (exhibit.content[language]) {
    return { content: exhibit.content[language], sourceLanguage: language, isFallback: false }
  }

  const fallbackOrder = ['id', 'en', ...Object.keys(exhibit.content)]
  const sourceLanguage = fallbackOrder.find((code) => exhibit.content[code]) || null
  const content = sourceLanguage ? exhibit.content[sourceLanguage] : null

  return { content, sourceLanguage, isFallback: Boolean(content && sourceLanguage !== language) }
}

export function getExhibitContent(exhibit, language) {
  return resolveExhibitContent(exhibit, language).content
}
