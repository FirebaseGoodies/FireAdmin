import { Injectable } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Category } from '../../models/collections/category.model';
import { now } from '../../helpers/functions.helper';
import { AuthService } from '../auth.service';

@Injectable()
export class CategoriesService {

  constructor(private db: DatabaseService, private auth: AuthService) { }

  add(data: Category) {
    const category: Category = {
      label: data.label,
      slug: data.slug,
      lang: data.lang,
      createdAt: now(), // timestamp
      updatedAt: null,
      createdBy: this.auth.currentUser.id,
      updatedBy: null
    };
    return this.db.addDocument('categories', category);
  }

  get(id: string) {
    return this.db.getDocument('categories', id);
  }

  getAll() {
    return this.db.getCollection('categories');
  }

  getWhere(field: string, operator: firebase.firestore.WhereFilterOp, value: string) {
    return this.db.getCollection('categories', ref => ref.where(field, operator, value));
  }

  edit(id: string, data: Category) {
    const category: Category = {
      label: data.label,
      slug: data.slug,
      lang: data.lang,
      updatedAt: now(),
      updatedBy: this.auth.currentUser.id
    };
    return this.db.setDocument('categories', id, category);
  }

  delete(id: string) {
    return this.db.deleteDocument('categories', id);
  }

}
