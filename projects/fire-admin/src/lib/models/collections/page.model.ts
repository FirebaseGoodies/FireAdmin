
export interface Page {
  id?: string,
  title: string,
  slug: string,
  lang: string,
  blocks: { [key: string]: PageBlock }[],
  createdAt?: number,
  updatedAt?: number,
  createdBy?: string,
  updatedBy?: string
}

export interface PageBlock {
  key?: string,
  name: string,
  type: PageBlockType,
  content: string
}

export enum PageBlockType {
  Text = 'text',
  HTML = 'html',
  JSON = 'json'
}

export interface PageTranslation {
  [key: string]: string // key == lang, value == page id
}
