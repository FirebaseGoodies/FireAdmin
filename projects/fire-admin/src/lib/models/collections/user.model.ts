import { Observable } from 'rxjs';

export enum UserRole {
  Administrator = 'admin',
  Editor = 'editor',
  // Author = 'author',
  // Contributor = 'contributor',
  Guest = 'guest'
}

export interface User {
  id?: string; // document id == firebase user id
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthDate: number; // timestamp
  role: UserRole;
  bio: string;
  avatar?: File|string|Observable<string>|{ path: string|any, url: string|Observable<string> };
  createdAt?: number;
  updatedAt?: number;
  createdBy?: string; // creator id
  creator?: string|Observable<string>; // used to fetch creator name without overriding createdBy field
  updatedBy?: string;
}
