import { i18n } from "@lingui/core";
import { en, zh } from "make-plural/plurals";
import { LOCAL_KEY } from "../constants";

// Declare locales
interface ILocale {
	flag: string;
	text: string;
	plurals: (n: number | string, ord?: boolean) => "zero" | "one" | "two" | "few" | "many" | "other";
}
interface ILocales {
	[locale: string]: ILocale;
}
export const locales: ILocales = {
	en: { flag: "en", plurals: en, text: "English (EN)" },
	zh: { flag: "zh", plurals: zh, text: "繁體中文" },
};

// Load locale data
for (var [key, locale] of Object.entries(locales)) {
	i18n.loadLocaleData(key, { plurals: locale.plurals });
}

async function fetchLocale(locale: string = "en") {
	const { messages } = await import(
    /* webpackChunkName: "[request]" */ `../locales/language/${locale}/messages`
	);
	i18n.load(locale, messages);
	i18n.activate(locale);
}
export function selectLocale(locale: string) {
	window.localStorage.setItem(LOCAL_KEY, locale);
	return fetchLocale(locale);
}
export function initLocale() {
	var locale = window.localStorage.getItem(LOCAL_KEY) as string;
	if (!Object.keys(locales).includes(locale)) locale = "en";
	fetchLocale(locale);
}
