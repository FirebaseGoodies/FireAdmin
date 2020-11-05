import { DocumentTranslation } from './document-translation';
import { Observable } from 'rxjs';

export interface Page {
  id?: string;
  title: string;
  slug: string;
  lang: string;
  blocks?: { [key: string]: PageBlock };
  createdAt?: number;
  updatedAt?: number;
  createdBy?: string;
  author?: string|Observable<string>;
  updatedBy?: string;
  translationId?: string;
  translations?: PageTranslation; // used to store translations on object fetch
  isTranslatable?: boolean;
}

export interface PageBlock {
  key?: string;
  name: string;
  type: PageBlockType;
  content: string;
}

export enum PageBlockType {
  Text = 'text',
  HTML = 'html',
  JSON = 'json'
}

export interface PageTranslation extends DocumentTranslation { }
