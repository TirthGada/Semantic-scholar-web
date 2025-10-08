export function formatAuthors(authors: string): string {
  const authorList = authors.split(',').map(a => a.trim());
  if (authorList.length <= 3) {
    return authorList.join(', ');
  }
  return `${authorList.slice(0, 3).join(', ')} +${authorList.length - 3} more`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
