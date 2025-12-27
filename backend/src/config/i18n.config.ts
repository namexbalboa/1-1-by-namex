import { AcceptLanguageResolver, I18nOptions } from 'nestjs-i18n';
import * as path from 'path';

export const i18nConfig: I18nOptions = {
  fallbackLanguage: 'pt',
  loaderOptions: {
    path: path.join(process.cwd(), 'src/locales/'),
    watch: true,
  },
  resolvers: [AcceptLanguageResolver],
};
