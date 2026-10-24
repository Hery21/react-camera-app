export function mergeExhibitTranslations(exhibits, translations) {
  return exhibits.map((exhibit) => ({
    ...exhibit,
    content: {
      ...exhibit.content,
      ...(translations[exhibit.id] || {}),
    },
  }))
}
