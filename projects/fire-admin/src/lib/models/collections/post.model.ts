
export interface PostData {
  id?: string,
  lang?: string,
  title: string,
  slug: string,
  date: number,
  image: string,
  content: string,
  status: string,
  categories: string[],
  createdAt?: number,
  updatedAt?: number
}

export interface Post {
  [key: string]: PostData // key == lang
}
