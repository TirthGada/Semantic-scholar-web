export interface Paper {
  corpusid: string;
  title: string;
  authors: string;
  venue?: string;
  year?: number;
  citationCount?: number;
  abstract?: string;
  url?: string;
}
