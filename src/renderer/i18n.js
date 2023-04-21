import Vue from 'vue'
import VueI18n from 'vue-i18n'
const { app } = require('electron')

Vue.use(VueI18n)

const DEFAULT_LANG = 'en'
const LOCALE_KEY = 'locale'

const locales = {
  zh: require('./language/zh.js'),
  en: require('./language/en.js')
}

const i18n = new VueI18n({
  locale: DEFAULT_LANG,
  messages: locales
})

export const setup = (lang) => {
  const locale = app.getLocale()
  console.log('locale', locale)
  if (locale.startsWith('zh')) {
    lang = 'zh'
  }
  if (lang === undefined) {
    lang = window.localStorage.getItem(LOCALE_KEY)
    if (locales[lang] === undefined) {
      lang = DEFAULT_LANG
    }
  }
  window.localStorage.setItem(LOCALE_KEY, lang)

  Vue.config.lang = lang
  i18n.locale = lang
}

// setup()
export default i18n
