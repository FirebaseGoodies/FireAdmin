import { Injectable } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Translation, TranslationData } from '../../models/collections/translation.model';
import { take, map } from 'rxjs/operators';

@Injectable()
export class TranslationsService {

  constructor(private db: DatabaseService) { }

  add(data: TranslationData) {
    const translation: Translation = { [data.key]: data.value };
    return this.db.setDocument('translations', data.lang, translation);
  }

  get(lang: string) {
    return this.db.getDocument('translations', lang);
  }

  getAll() {
    return this.db.getCollection('translations').pipe(map((translations: Translation[]) => {
      //console.log(translations);
      const allTranslations: TranslationData[] = [];
      translations.forEach((translation: Translation) => {
        //console.log(translation);
        const lang = translation.id;
        const keys = Object.keys(translation).filter((key: string) => key !== 'id');
        keys.forEach((key: string) => {
          allTranslations.push({
            key: key,
            value: translation[key],
            lang: lang
          });
        });
      });
      return allTranslations;
    }));
  }

  getWhere(field: string, operator: firebase.firestore.WhereFilterOp, value: string) {
    return this.db.getCollection('translations', ref => ref.where(field, operator, value));
  }

  edit(data: TranslationData) {
    return this.add(data);
  }

  delete(key: string, lang: string) {
    return new Promise(async (resolve, reject) => {
      const translations: Translation = await this.get(lang).pipe(take(1)).toPromise();
      if (translations[key]) {
        delete translations[key];
        this.db.setDocument('translations', lang, translations, false).then(() => {
          resolve();
        }).catch((error: Error) => {
          reject(error);
        });
      } else {
        resolve();
      }
    });
  }

  keyExists(key: string, lang: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.getDocumentRef('translations', lang).get().toPromise().then((doc) => {
        const translations = doc.data();
        if (translations[key]) {
          resolve(true);
        } else {
          resolve(false);
        }
      }).catch((error: Error) => {
        console.log(error);
        resolve(false);
      });
    });
  }

}
