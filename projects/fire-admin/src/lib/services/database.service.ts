import { AngularFirestore, DocumentReference, QueryFn, AngularFirestoreDocument, AngularFirestoreCollection, DocumentData } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/collections/user.model';
import { I18nService } from './i18n.service';
import { CurrentUserService } from './current-user.service';

@Injectable()
export class DatabaseService {

  private _currentUserService: CurrentUserService = null;

  constructor(private db: AngularFirestore, private i18n: I18nService) { }

  /**
   * Set current user service instance
   *
   * @param instance
   */
  setCurrentUser(instance: CurrentUserService): void {
    this._currentUserService = instance;
  }

  /**
   * Return current user data
   */
  get currentUser(): User {
    return this._currentUserService.data || null;
  }

  /**
   * Check user role before perfoming an action/promise
   *
   * @param promise
   */
  private afterUserRoleCheck(promiseFn: Function): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this._currentUserService || this._currentUserService.isGuest()) {
        reject({ message: this.i18n.get('GuestsAreNotAllowedToPerformChanges') });
      } else {
        promiseFn().then((value?: DocumentReference) => {
          resolve(value);
        }).catch((error: Error) => {
          reject(error);
        });
      }
    });
  }

  /**
   * Check if collection exists
   *
   * @param path
   */
  async collectionExists(path: string): Promise<boolean> {
    const query = await this.db.collection(path).get().toPromise().catch((error: firebase.FirebaseError) => {
      console.log(error);
    });
    return query ? !!query.size : false;
  }

  /**
   * Add collection
   *
   * @param path
   * @param data
   */
  addCollection(path: string, data: any): Promise<DocumentReference|any> {
    return this.afterUserRoleCheck(() => this.db.collection(path).add(data));
  }

  /**
   * Get collection ref
   *
   * @param path
   */
  getCollectionRef(path: string, queryFn?: QueryFn): AngularFirestoreCollection<DocumentData> {
    return this.db.collection(path, queryFn);
  }

  /**
   * Get collection
   *
   * known issue on several subscriptions: https://github.com/angular/angularfire/issues/1405
   *
   * @param path
   */
  getCollection(path: string, queryFn?: QueryFn): Observable<any> {
    return this.getCollectionRef(path, queryFn).snapshotChanges().pipe(
      map((changes) => {
        // console.log(changes);
        let docs = [];
        changes.forEach(({ payload: { doc } }) => {
          // console.log(change);
          docs.push({ id: doc.id, ...(doc.data() as object) });
        });
        // console.log(docs);
        return docs;
      })
    );
  }

  /**
   * Add document
   *
   * @param collectionPath
   * @param data
   * @param documentPath
   */
  addDocument(collectionPath: string, data: any, documentPath?: string): Promise<any> {
    if (documentPath && documentPath.length) {
      return this.afterUserRoleCheck(() => this.setDocument(collectionPath, documentPath, data));
    } else {
      return this.afterUserRoleCheck(() => this.addCollection(collectionPath, data));
    }
  }

  /**
   * Set document
   *
   * @param collectionPath
   * @param documentPath
   * @param data
   */
  setDocument(collectionPath: string, documentPath: string, data: any, merge: boolean = true): Promise<void|any> {
    return this.afterUserRoleCheck(() => this.db.collection(collectionPath).doc(documentPath).set(data, { merge: merge }));
  }

  /**
   * Update document
   *
   * @param collectionPath
   * @param documentPath
   * @param data
   */
  updateDocument(collectionPath: string, documentPath: string, data: any): Promise<void|any> {
    return this.afterUserRoleCheck(() => this.db.collection(collectionPath).doc(documentPath).update(data));
  }

  /**
   * Get document ref
   *
   * @param collectionPath
   * @param documentPath
   */
  getDocumentRef(collectionPath: string, documentPath: string): AngularFirestoreDocument<DocumentData> {
    return this.db.collection(collectionPath).doc(documentPath);
  }

  /**
   * Get document
   *
   * @param collectionPath
   * @param documentPath
   */
  getDocument(collectionPath: string, documentPath: string): Observable<any> {
    return this.getDocumentRef(collectionPath, documentPath).valueChanges();
  }

  /**
   * Delete document
   *
   * @param collectionPath
   * @param documentPath
   */
  deleteDocument(collectionPath: string, documentPath: string): Promise<void|any> {
    return this.afterUserRoleCheck(() => this.db.collection(collectionPath).doc(documentPath).delete());
  }

  /**
   * Get documents data as a promise
   *
   * @param collectionPath
   * @param queryFn
   */
  async getDocumentsDataAsPromise(collectionPath: string, queryFn?: QueryFn): Promise<DocumentData[]> {
    const ref = await this.getCollectionRef(collectionPath, queryFn).get().toPromise().catch((error: firebase.FirebaseError) => {
      console.log(error);
    });
    return ref ? ref.docs : [];
  }

  /**
   * Get documents count
   *
   * @param collectionPath
   * @param queryFn
   */
  async getDocumentsCount(collectionPath: string, queryFn?: QueryFn): Promise<number> {
    const docs = await this.getDocumentsDataAsPromise(collectionPath, queryFn);
    return docs.length;
  }

}
