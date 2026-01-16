// Collection utilities
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export function flatten<T>(array: any[]): T[] {
  return array.reduce(
    (acc, val) => acc.concat(Array.isArray(val) ? flatten(val) : val),
    []
  );
}

export function groupBy<T>(array: T[], key: keyof T | ((item: T) => string)): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = typeof key === 'function' ? key(item) : String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

export function partition<T>(array: T[], predicate: (item: T) => boolean): [T[], T[]] {
  return array.reduce(
    ([pass, fail], item) => {
      return predicate(item) ? [[...pass, item], fail] : [pass, [...fail, item]];
    },
    [[], []] as [T[], T[]]
  );
}

export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function sample<T>(array: T[], count = 1): T[] {
  const shuffled = shuffle(array);
  return shuffled.slice(0, count);
}

export function intersection<T>(arrays: T[][]): T[] {
  if (arrays.length === 0) return [];
  return arrays.reduce((acc, curr) => acc.filter(item => curr.includes(item)));
}

export function difference<T>(array1: T[], array2: T[]): T[] {
  return array1.filter(item => !array2.includes(item));
}

export function union<T>(...arrays: T[][]): T[] {
  return [...new Set(arrays.flat())];
}

export function countBy<T>(array: T[], fn: (item: T) => string): Record<string, number> {
  return array.reduce((counts, item) => {
    const key = fn(item);
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);
}

export function sortBy<T>(array: T[], key: keyof T | ((item: T) => any), order: 'asc' | 'desc' = 'asc'): T[] {
  const getValue = typeof key === 'function' ? key : (item: T) => item[key];
  const multiplier = order === 'asc' ? 1 : -1;
  
  return [...array].sort((a, b) => {
    const aVal = getValue(a);
    const bVal = getValue(b);
    return aVal < bVal ? -multiplier : aVal > bVal ? multiplier : 0;
  });
}
