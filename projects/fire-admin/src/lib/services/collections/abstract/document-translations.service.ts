import { DatabaseService } from '../../database.service';
import { DocumentTranslation } from '../../../models/collections/document-translation';

export abstract class DocumentTranslationsService {

  constructor(protected db: DatabaseService, private collectionPath: string) { }

  protected addTranslation(lang: string, id: string, parentId?: string) {
    const translation = { [lang]: id };
    return parentId ? this.db.setDocument(this.collectionPath, parentId, translation) : this.db.addDocument(this.collectionPath, translation);
  }

  protected getTranslations(id: string) {
    return this.db.getDocument(this.collectionPath, id);
  }

  protected getTranslationsWhere(field: string, operator: firebase.firestore.WhereFilterOp, value: string) {
    return this.db.getCollection(this.collectionPath, ref => ref.where(field, operator, value));
  }

  protected deleteTranslation(id: string, lang?: string, translations?: DocumentTranslation) {
    const newTranslations = lang && translations ? Object.keys(translations).reduce((object, key) => {
      if (key !== lang) {
        object[key] = translations[key];
      }
      return object;
    }, {}) : {};
    return Object.keys(newTranslations).length > 0 ? this.db.setDocument(this.collectionPath, id, newTranslations, false) : this.db.deleteDocument(this.collectionPath, id);
  }

}
