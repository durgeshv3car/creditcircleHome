// import {notFound} from 'next/navigation';
// import {getRequestConfig} from 'next-intl/server';
// import {routing} from './routing';
 
// export default getRequestConfig(async ({locale}) => {
//   // Validate that the incoming `locale` parameter is valid
//   if (!routing.locales.includes(locale as any)) notFound();
 
//   return {
//     messages: (await import(`../messages/${locale}.json`)).default
//   };
// });

export default async function getRequestConfig() {
  return {
    messages: (await import(`../messages/en.json`)).default // Use a default language (e.g., English)
  };
}
