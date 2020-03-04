import { Observable } from 'rxjs';

export interface PostData {
  id?: string,
  lang?: string,
  title: string,
  slug: string,
  date: number,
  image?: File|string|Observable<string>,
  content: string,
  status: string,
  categories: string[],
  createdAt?: number,
  updatedAt?: number
}

export interface Post {
  [key: string]: PostData // key == lang
}
