import { firestore } from 'firebase/app';

export function timestampToDate(timestamp: firestore.Timestamp): Date {
  if (timestamp instanceof firestore.Timestamp) {
    return new Date(+timestamp.seconds * 1000);
  } else {
    console.warn(`could not convert ${timestamp} to date!`);
    return timestamp;
  }
}
