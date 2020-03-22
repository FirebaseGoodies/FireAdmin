
/**
 * Stolen from: https://medium.com/@mhagemann/the-ultimate-way-to-slugify-a-url-string-in-javascript-b8e4a0d849e1
 */
export function slugify(str: string): string {
  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
  const p = new RegExp(a.split('').join('|'), 'g')

  return str.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\u0600-\u06FF\w\-]+/g, '') // Remove all non-word characters ([\u0600-\u06FF] represent arabic letters)
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

export function now(): number {
  return !Date.now ? +new Date() : Date.now(); //new Date().getTime();
}

/**
 * Stolen from: https://stackoverflow.com/a/13403498
 */
export function guid(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Stolen from: https://stackoverflow.com/a/60461693
 */
export const isFile = (input: File|any) => 'File' in window && input instanceof File;

/**
 * Stolen from: https://stackoverflow.com/a/24221895
 */
export function resolve(obj: object, ...path: string[]){
  let current = obj;
  while(path.length) {
    if(typeof current !== 'object') return undefined;
    current = current[path.shift()];
  }
  return current as any;
}
