import { defineUserConfig, defaultTheme } from 'vuepress'

export default defineUserConfig({
  title: 'Electron Kits',
  description: 'A electron kits, combined with Electron/Vue3/AntiDesign/SQLite3.',
  head: [
    ['link', { rel: 'icon', href: '/images/logo.png' }]
  ],
  lang: 'en-US',
  theme: defaultTheme({
    logo: '/images/logo.png',
    repo: 'sunquakes/electron-kits',
    editLinks: true,
    locales: {
      '/': {
        selectLanguageName: 'English',
        selectLanguageText: 'Languages',
        selectLanguageAriaLabel: 'Languages',
        editLinkText: 'Edit this page on GitHub',
        navbar: [{ text: 'Guide', link: '/guide/getting-started' }],
        sidebar: {
          '/guide/': [
            {
              children: ['/guide/getting-started.md', '/guide/sqlite3.md']
            }
          ]
        }
      },
      '/zh/': {
        selectLanguageName: '简体中文',
        selectLanguageText: '选择语言',
        selectLanguageAriaLabel: '选择语言',
        editLinkText: '在 GitHub 上编辑此页',
        navbar: [{ text: '指南', link: '/zh/guide/getting-started' }],
        sidebar: {
          '/zh/guide/': [
            {
              children: ['/zh/guide/getting-started.md', '/zh/guide/sqlite3.md']
            }
          ]
        }
      }
    }
  }),
  locales: {
    '/': {
      lang: 'English',
      title: 'Electron Kits',
      description: 'A out of the box kits for cross-platform desktop application development.'
    },
    '/zh/': {
      lang: '简体中文',
      title: 'Electron Kits',
      description: '一个开箱即用的跨平台桌面程序开发套件'
    }
  }
})
