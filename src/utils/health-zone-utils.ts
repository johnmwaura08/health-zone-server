/* eslint-disable @typescript-eslint/no-namespace */
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { DateTime } from 'luxon';

export namespace HealthZoneUtils {
  export const generatePassword = (
    length = 16,
    characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$',
  ) =>
    Array.from(crypto.randomFillSync(new Uint32Array(length)))
      .map((x) => characters[x % characters.length])
      .join('');

  export async function hashPassword(password: string) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  export function convertToISODate(date: string) {
    const isoDate = new Date(date).toISOString();
    return isoDate;
  }

  export function isValidId(val: any) {
    return val !== undefined && val !== null && !isNaN(+val) && +val > 0;
  }

  export function getISODate(dayOfMonth: number | null) {
    // Get the current date and set the provided day of the month
    if (dayOfMonth) {
      const currentDate = DateTime.local().set({ day: dayOfMonth });

      // Format the date to ISO string
      const isoDateString = currentDate.toISO();

      return isoDateString;
    }

    return null;
  }
  export function getUserEmailFromAccessToken(req: any): string {
    return req?.user?.userEmail;
  }

  export function getUserIdFromAccessToken(req: any): string {
    return req?.user?.userId;
  }

  export const stringIsNullOrEmpty = (str: string | undefined): boolean =>
    str === null || str === undefined || str === '' || str.trim().length === 0;

  export function formatPhoneNumber(phoneNumber: string) {
    return `+1${phoneNumber}`;
  }
  export function formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1),
      day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [month, day, year].join('/');
  }
  export const getFirstNameFromFullName = (fullName: string) => {
    return fullName.split(' ')[0] || fullName;
  };
}
