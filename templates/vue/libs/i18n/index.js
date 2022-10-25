import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n)
function loadLocaleMessages() {
  const locales = import.meta.glob('./locales/*.json');
  const messages = {};
  Object.keys(locales).forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locale[key];
    }
  })
  return messages;
}
export default new VueI18n({
  locale: 'fr',
  fallbackLocale: 'fr',
  messages: loadLocaleMessages(),
});
