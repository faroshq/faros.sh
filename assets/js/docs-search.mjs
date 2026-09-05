const words = (value) => value.normalize('NFKD').toLowerCase().match(/[\p{L}\p{N}]+/gu) || [];
export function searchDocs(pages, query, provider = '') {
  const terms = [...new Set(words(query))];
  if (!terms.length) return [];
  return pages.filter(page => !provider || page.provider === provider).map(page => {
    const title = words(page.title).join(' ');
    const description = words(page.description).join(' ');
    const body = words(page.text).join(' ');
    const label = words(page.providerTitle).join(' ');
    if (!terms.every(term => `${title} ${description} ${body} ${label}`.includes(term))) return null;
    const score = terms.reduce((sum, term) => sum + (title.includes(term) ? 12 : 0) + (description.includes(term) ? 5 : 0) + (label.includes(term) ? 2 : 0), 0);
    return { ...page, score };
  }).filter(Boolean).sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
}
