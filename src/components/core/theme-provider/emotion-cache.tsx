'use client';

import type { JSX } from 'react';
import * as React from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import createCache from '@emotion/cache';
import type { EmotionCache, Options as OptionsOfCreateCache } from '@emotion/cache';
import { CacheProvider as DefaultCacheProvider } from '@emotion/react';

interface Registry {
  cache: EmotionCache;
  flush: () => { name: string; isGlobal: boolean }[];
}

export interface NextAppDirEmotionCacheProviderProps {
  options: Omit<OptionsOfCreateCache, 'insertionPoint'>;
  CacheProvider?: (props: { value: EmotionCache; children: React.ReactNode }) => React.JSX.Element | null;
  children: React.ReactNode;
}

export default function NextAppDirEmotionCacheProvider(
  props: NextAppDirEmotionCacheProviderProps
): React.JSX.Element {
  const { options, CacheProvider = DefaultCacheProvider, children } = props;

  const registry = React.useMemo<Registry>(() => {
    const cache = createCache(options);
    cache.compat = true;

    const prevInsert = cache.insert.bind(cache);
    let inserted: { name: string; isGlobal: boolean }[] = [];

    cache.insert = (...args) => {
      const [selector, serialized] = args;

      if (cache.inserted[serialized.name] === undefined) {
        inserted.push({ name: serialized.name, isGlobal: !selector });
      }

      return prevInsert(...args);
    };

    const flush = (): { name: string; isGlobal: boolean }[] => {
      const prevInserted = inserted;
      inserted = [];
      return prevInserted;
    };

    return { cache, flush };
  }, [options]);

  useServerInsertedHTML(() => {
    const insertedStyles = registry.flush();
    if (insertedStyles.length === 0) return null;

    const nonGlobals: string[] = [];
    const globals: JSX.Element[] = [];

    let dataEmotionAttribute = registry.cache.key;

    insertedStyles.forEach(({ name, isGlobal }) => {
      const style = registry.cache.inserted[name];

      if (typeof style === 'string') {
        if (isGlobal) {
          globals.push(
            <style
              key={name}
              data-emotion={`${registry.cache.key}-global ${name}`}
              dangerouslySetInnerHTML={{ __html: style }}
            />
          );
        } else {
          nonGlobals.push(style);
          dataEmotionAttribute += ` ${name}`;
        }
      }
    });

    return (
      <>
        {globals}
        {nonGlobals.length > 0 && (
          <style
            data-emotion={dataEmotionAttribute}
            dangerouslySetInnerHTML={{ __html: nonGlobals.join('') }}
          />
        )}
      </>
    );
  });

  return <CacheProvider value={registry.cache}>{children}</CacheProvider>;
}
