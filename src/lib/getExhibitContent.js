export function getExhibitContent(exhibit, language) {
  if (!exhibit?.content) return null

  return exhibit.content[language] || exhibit.content.id || exhibit.content.en || Object.values(exhibit.content).find(Boolean) || null
}
