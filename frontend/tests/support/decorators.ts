import { test } from '@playwright/test';

/**
 * Decorator to wrap async class methods in Playwright test.step for reporting.
 * Only use on async methods.
 */
export function step() {
  return function (
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ): void | PropertyDescriptor {
    // Only decorate methods
    if (!descriptor || typeof descriptor.value !== 'function') {
      return descriptor;
    }
    const originalMethod = descriptor.value;
    if (originalMethod.constructor.name !== 'AsyncFunction') {
      throw new Error(`@step can only be used on async methods. "${String(propertyKey)}" is not async.`);
    }
    descriptor.value = async function (...args: any[]) {
      return await test.step(String(propertyKey), async () => {
        return await originalMethod.apply(this, args);
      });
    };
    return descriptor;
  };
}
