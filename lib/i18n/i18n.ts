import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from '../../assets/translations/en.json';
import pt from '../../assets/translations/pt.json';
import es from '../../assets/translations/es.json';
import de from '../../assets/translations/de.json';

const resources: Record<string, { translation: any }> = {
  en: { translation: en },
  pt: { translation: pt },
  es: { translation: es },
  de: { translation: de },
};

const LANGUAGE_KEY = 'app_language';

// Detect language
const getDeviceLanguage = () => {
  const locales = Localization.getLocales();
  const deviceLanguage = locales[0]?.languageCode || 'en';
  return resources[deviceLanguage] ? deviceLanguage : 'en';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getDeviceLanguage(), // Initial sync detection
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: 'v4', // Required for React Native
  });

// Async load saved language
AsyncStorage.getItem(LANGUAGE_KEY).then((savedLanguage) => {
  if (savedLanguage && savedLanguage !== i18n.language) {
    i18n.changeLanguage(savedLanguage);
  }
});

export default i18n;
