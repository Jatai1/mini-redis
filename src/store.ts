const data = new Map<string, string>();

export function set(key: string, value: string): void {
  data.set(key, value);
}
export function get(key: string): string | undefined {
  return data.get(key);
}
export function del(key: string): boolean {
  return data.delete(key);
}
