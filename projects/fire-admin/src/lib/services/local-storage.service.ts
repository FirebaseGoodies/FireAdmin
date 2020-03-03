import { Injectable } from "@angular/core";

@Injectable()
export class LocalStorageService {

  constructor() { }

  get(key: string): any {
    const value = localStorage.getItem(key);
    let finalValue;
    try {
      finalValue = JSON.parse(value);
    }
    catch(error) {
      finalValue = value;
    }
    return finalValue;
  }

  set(key: string, value: any): void {
    let finalValue;
    try {
      finalValue = JSON.stringify(value);
    }
    catch(error) {
      finalValue = value;
    }
    localStorage.setItem(key, finalValue);
  }

}
