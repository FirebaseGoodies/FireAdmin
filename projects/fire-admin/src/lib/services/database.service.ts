import { AngularFirestore, DocumentReference, QueryFn, AngularFirestoreDocument, AngularFirestoreCollection, DocumentData } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class DatabaseService {

  constructor(private db: AngularFirestore) { }

  /**
   * Add collection
   * 
   * @param path 
   * @param data 
   */
  addCollection(path: string, data: any): Promise<DocumentReference> {
    return this.db.collection(path).add(data);
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
      return this.setDocument(collectionPath, documentPath, data);
    } else {
      return this.addCollection(collectionPath, data);
    }
  }

  /**
   * Set document
   * 
   * @param collectionPath 
   * @param documentPath 
   * @param data 
   */
  setDocument(collectionPath: string, documentPath: string, data: any, merge: boolean = true): Promise<void> {
    return this.db.collection(collectionPath).doc(documentPath).set(data, { merge: merge });
  }

  /**
   * Update document
   * 
   * @param collectionPath 
   * @param documentPath 
   * @param data 
   */
  updateDocument(collectionPath: string, documentPath: string, data: any): Promise<void> {
    return this.db.collection(collectionPath).doc(documentPath).update(data);
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
  deleteDocument(collectionPath: string, documentPath: string): Promise<void> {
    return this.db.collection(collectionPath).doc(documentPath).delete();
  }

  /**
   * Get documents data as a promise
   * 
   * @param collectionPath 
   * @param queryFn 
   */
  async getDocumentsDataAsPromise(collectionPath: string, queryFn?: QueryFn): Promise<DocumentData[]> {
    const ref = await this.getCollectionRef(collectionPath, queryFn).get().toPromise();
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
