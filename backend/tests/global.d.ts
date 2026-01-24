// Global test functions for TypeScript
declare global {
  namespace jest {
    interface Matchers<R> {
      toBe(expected: R): R;
    }
  }
}

declare function describe(name: string, fn: () => void): void;
declare function it(name: string, fn: () => void): void;
declare function test(name: string, fn: () => void): void;
declare function beforeEach(fn: () => void): void;
declare function afterEach(fn: () => void): void;
declare function beforeAll(fn: () => void): void;
declare function afterAll(fn: () => void): void;
declare function expect<T>(value: T): jest.Matchers<T>;
declare const jest: {
  setTimeout(timeout: number): void;
};