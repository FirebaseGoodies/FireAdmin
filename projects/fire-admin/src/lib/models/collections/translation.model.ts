
export interface Translation {
  id?: string;
  [key: string]: string; // key: value
}

export interface TranslationData {
  key: string;
  value: string;
  lang: string;
}
