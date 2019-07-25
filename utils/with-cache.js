let requestCache = new WeakMap();

export function withCache(request, options = {}) {
  return function(body) {
    if (
      typeof options.expired === 'number' &&
      requestCache.has(request) &&
      requestCache.get(request).start &&
      Date.now() - requestCache.get(request).start > options.expired
    ) {
      requestCache.delete(request);
    }

    if (requestCache.has(request)) {
      return requestCache.get(request).data;
    } else {
      const cache = {
        start: Date.now(),
        data: request(body).catch(() => {
          requestCache.delete(request);
        }),
      };
      requestCache.set(request, cache);
      return cache.data;
    }
  };
}

export function clearCache(key) {
  if (key) {
    requestCache.delete(key);
  } else {
    requestCache = new WeakMap();
  }
}
