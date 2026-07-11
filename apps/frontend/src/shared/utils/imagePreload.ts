const imagePreloadCache = new Map<string, Promise<void>>();

type ImagePriority = "high" | "low" | "auto";

type PreloadImageOptions = {
  priority?: ImagePriority;
  timeoutMs?: number;
};

export function preloadImage(src: string, { priority = "auto", timeoutMs = 2400 }: PreloadImageOptions = {}) {
  const cacheKey = `${src}:${priority}`;
  const cached = imagePreloadCache.get(cacheKey);
  if (cached) return cached;

  const promise = new Promise<void>((resolve) => {
    const image = new Image();
    let settled = false;
    let timeoutId = 0;

    const finish = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeoutId);
      resolve();
    };

    const decodeAndFinish = () => {
      if ("decode" in image) {
        void image.decode().then(finish, finish);
        return;
      }

      finish();
    };

    timeoutId = window.setTimeout(finish, timeoutMs);
    image.decoding = "async";
    image.fetchPriority = priority;
    image.onload = decodeAndFinish;
    image.onerror = finish;
    image.src = src;

    if (image.complete) {
      decodeAndFinish();
    }
  });

  imagePreloadCache.set(cacheKey, promise);
  return promise;
}

export function preloadImages(srcList: string[], options?: PreloadImageOptions) {
  return Promise.allSettled(srcList.map((src) => preloadImage(src, options))).then(() => undefined);
}
