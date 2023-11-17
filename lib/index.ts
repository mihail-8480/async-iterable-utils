export function filter<T>(
  callback: (item: T) => boolean
): (source: AsyncIterable<T>) => AsyncIterable<T> {
  return async function* (it: AsyncIterable<T>) {
    for await (const item of it) {
      if (callback(item)) {
        yield item;
      }
    }
  };
}

export async function* resolve<T>(
  it: AsyncIterable<Promise<T>>
): AsyncIterable<T> {
  for await (const item of it) {
    yield await item;
  }
}

export function take<T>(
  items: number
): (source: AsyncIterable<T>) => AsyncIterable<T> {
  return async function* (source: AsyncIterable<T>) {
    for await (const item of source) {
      if (items-- === 0) {
        break;
      }
      yield item;
    }
  };
}

export function skip<T>(
  items: number
): (source: AsyncIterable<T>) => AsyncIterable<T> {
  return async function* (source: AsyncIterable<T>) {
    for await (const item of source) {
      if (items-- === 0) {
        continue;
      }
      yield item;
    }
  };
}

export function join<T, TMiddle, TResult>(
  a: (source: AsyncIterable<T>) => AsyncIterable<TMiddle>,
  b: (source: AsyncIterable<TMiddle>) => AsyncIterable<TResult>
): (source: AsyncIterable<T>) => AsyncIterable<TResult> {
  return function (source: AsyncIterable<T>) {
    return b(a(source));
  };
}
