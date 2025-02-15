import { defineNuxtConfig } from 'nuxt/config';
import path from 'path';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@nuxt/icon',
    '@nuxtjs/color-mode',
    [
      '@pinia/nuxt',
      {
        autoImports: ['defineStore'],
      },
    ],
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils/module',
    '@nuxtjs/fontaine',
    '@nuxt/fonts',
  ],
  fonts: {
    providers: {
      custom: '~/providers/custom',
    },
    families: [
      { name: 'Abel', provider: 'bunny' },
      { name: 'Satoshi', provider: 'fontshare' },
      { name: 'Kode Mono', provider: 'none' },
      { name: 'MyCustom', src: '/custom-font.woff2' },
      { name: 'CustomGlobal', global: true, src: '/fonts/custom-font.woff2' },
      { name: 'Oswald', fallbacks: ['Times New Roman'] },
      { name: 'Aleo', provider: 'adobe' },
      { name: 'Barlow Semi Condensed', provider: 'adobe' },
      { name: 'Barlow', preload: true },
      { name: 'Roboto Mono', provider: 'fontsource' },
      { name: 'Roboto Flex', provider: 'fontsource' },
    ],
    adobe: {
      id: ['sij5ufr', 'grx7wdj'],
    },
    defaults: {
      fallbacks: {
        monospace: ['Tahoma'],
      },
    },
  },
  icon: {
    clientBundle: {
      scan: true,
    },
    serverBundle: {
      collections: ['uil', 'mdi', 'lucide'],
    },
  },
  shadcn: {
    prefix: '',
    componentDir: './components/ui',
  },
  routeRules: {
    '/': { prerender: true },
  },
  colorMode: {
    classSuffix: '',
  },
  runtimeConfig: {
    public: {
      backendUrl: 'https://localhost:8443',
      apiUrl: 'https://localhost:8443',
      appClientUrl: 'https://localhost:3000',
      collabDocPrefix: 'doc_',
      tiptapCollabAppId: 'lyra-app',
    },
    tiptapCollabSecret: 'secret',
  },
  vite: {
    resolve: {
      alias: {
        // Ensure that all imports of 'yjs' resolve to the same instance
        'yjs': path.resolve(__dirname, './node_modules/yjs'),
      },
    },
    build: {
      rollupOptions: {
        plugins: [
          {
            name: 'svg-loader',
            transform(src, id) {
              if (id.endsWith('.svg')) {
                return {
                  code: `export default ${JSON.stringify(src)}`,
                  map: null,
                };
              }
            },
          },
        ],
      },
    },
  },
});
