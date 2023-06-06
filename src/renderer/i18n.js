import Vue from 'vue'
import VueI18n from 'vue-i18n'
const Store = require('electron-store')
const store = new Store()
Vue.use(VueI18n)

const DEFAULT_LANG = 'en'
const LOCALE_KEY = 'locale'

const getLocale = () => {
  let lang
  const locale = store.get(LOCALE_KEY)
  if (locale.startsWith('zh')) {
    lang = 'zh'
  }
  if (locales[lang] === undefined) {
    lang = DEFAULT_LANG
  }
  return lang
}

const locales = {
  zh: require('./language/zh.js'),
  en: require('./language/en.js')
}

const i18n = new VueI18n({
  locale: getLocale(),
  messages: locales
})

export default i18n
