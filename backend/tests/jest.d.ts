import 'jest';

declare global {
  namespace jest {
    interface Matchers<R = void> {
      toBe(expected: any): R;
      toHaveProperty(prop: string, value?: any): R;
      toHaveLength(length: number): R;
      toBeDefined(): R;
      toEqual(expected: any): R;
      toMatch(pattern: string | RegExp): R;
      toContain(item: any): R;
      toBeNull(): R;
      toBeUndefined(): R;
      toBeGreaterThan(value: number): R;
      toBeLessThan(value: number): R;
      toThrow(message?: string | RegExp): R;
      toHaveBeenCalled(): R;
      toHaveBeenCalledTimes(count: number): R;
      toHaveBeenCalledWith(...args: any[]): R;
    }
  }
}