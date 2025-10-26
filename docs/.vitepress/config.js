import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'SnailMail',
  description: 'SnailMail Documentation',
  base: '/',

  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Deployment', link: '/deployment' },
      { text: 'Development', link: '/development' }
    ],

    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Introduction', link: '/' },
          { text: 'Development', link: '/development' },
          { text: 'Deployment', link: '/deployment' }
        ]
      },
      {
        text: 'Architecture',
        items: [
          { text: 'Frontend', link: '/frontend' },
          { text: 'Backend', link: '/backend' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/EdwardVNguyen/SnailMail' }
    ],

    footer: {
      message: 'Released under the ISC License.',
      copyright: 'Copyright © 2024-present SnailMail'
    }
  }
})
