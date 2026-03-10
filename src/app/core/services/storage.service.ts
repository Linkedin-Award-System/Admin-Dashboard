import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly secretKey = 'creatorflow-secret-key'; // In production, this should be more secure

  constructor() { }

  /**
   * Set item in localStorage with optional encryption
   */
  setItem(key: string, value: any, encrypt: boolean = false): void {
    const data = typeof value === 'string' ? value : JSON.stringify(value);
    const finalValue = encrypt ? this.encrypt(data) : data;
    localStorage.setItem(key, finalValue);
  }

  /**
   * Get item from localStorage with optional decryption
   */
  getItem<T>(key: string, decrypt: boolean = false): T | null {
    const data = localStorage.getItem(key);
    if (!data) return null;

    try {
      const finalValue = decrypt ? this.decrypt(data) : data;
      return JSON.parse(finalValue) as T;
    } catch (e) {
      return (decrypt ? this.decrypt(data) : data) as unknown as T;
    }
  }

  /**
   * Remove item from localStorage
   */
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * Clear all items from localStorage
   */
  clear(): void {
    localStorage.clear();
  }

  /**
   * Set item in sessionStorage
   */
  setSessionItem(key: string, value: any): void {
    const data = typeof value === 'string' ? value : JSON.stringify(value);
    sessionStorage.setItem(key, data);
  }

  /**
   * Get item from sessionStorage
   */
  getSessionItem<T>(key: string): T | null {
    const data = sessionStorage.getItem(key);
    if (!data) return null;

    try {
      return JSON.parse(data) as T;
    } catch (e) {
      return data as unknown as T;
    }
  }

  /**
   * Remove item from sessionStorage
   */
  removeSessionItem(key: string): void {
    sessionStorage.removeItem(key);
  }

  private encrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, this.secretKey).toString();
  }

  private decrypt(data: string): string {
    const bytes = CryptoJS.AES.decrypt(data, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
