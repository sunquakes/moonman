import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zh from './language/zh.js'
import en from './language/en.js'
Vue.use(VueI18n)

const DEFAULT_LANG = 'en'
const LOCALE_KEY = 'locale'

const getLocale = () => {
  let lang
  const locale = undefined
  if (locale != undefined && locale.startsWith('zh')) {
    lang = 'zh'
  }
  if (locales[lang] === undefined) {
    lang = DEFAULT_LANG
  }
  return lang
}

const locales = {
  zh,
  en
}

const i18n = new VueI18n({
  locale: getLocale(),
  messages: locales
})

export default i18n
