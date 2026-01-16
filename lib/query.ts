// Query string utilities
export function parseQueryString(search: string): Record<string, string> {
  const params = new URLSearchParams(search);
  const result: Record<string, string> = {};
  
  params.forEach((value, key) => {
    result[key] = value;
  });
  
  return result;
}

export function stringifyQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  
  return searchParams.toString();
}

export function addQueryParams(url: string, params: Record<string, any>): string {
  const [baseUrl, existingSearch] = url.split('?');
  const existingParams = existingSearch ? parseQueryString(existingSearch) : {};
  const mergedParams = { ...existingParams, ...params };
  const queryString = stringifyQueryString(mergedParams);
  
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

export function removeQueryParams(url: string, keys: string[]): string {
  const [baseUrl, search] = url.split('?');
  if (!search) return url;
  
  const params = parseQueryString(search);
  keys.forEach(key => delete params[key]);
  
  const queryString = stringifyQueryString(params);
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

export function getQueryParam(search: string, key: string): string | null {
  const params = new URLSearchParams(search);
  return params.get(key);
}
