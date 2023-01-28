import { useEffect, useState,useContext } from "react";

import { I18nProvider } from "@lingui/react";
import { Web3ReactProvider } from "@web3-react/core";
import { Provider } from "react-redux";
import { i18n } from "@lingui/core";
import { SnackbarProvider } from 'notistack';
import App from "./App";
import store from "./store";
import ThemeProvider, { ThemedGlobalStyle } from "./theme";
import getLibrary from "./utils/ethers";
import { initLocale } from "./locales";

import { SearchContext } from "./hooks/useSearchContext";

import { IPS_CNS_KEY } from "./constants";

function Root() {
 
	const [searchState, setOldSearchState] = useState("")
	const [newSearchState, setNewSearchState] = useState("")

	useEffect(() => {
		initLocale();
	}, []);

	useEffect(() => {
		if (newSearchState) {
			sessionStorage.setItem(IPS_CNS_KEY, newSearchState)
			setOldSearchState(newSearchState)
		}
	}, [newSearchState])


	return (
		<Web3ReactProvider getLibrary={getLibrary}>
			<I18nProvider i18n={i18n}>
				<Provider store={store}>
					<SearchContext.Provider value={{ searchState, setSearchState: setNewSearchState }}>
							<SnackbarProvider maxSnack={10}>
								<ThemeProvider>
									<ThemedGlobalStyle />
									<App />
								</ThemeProvider>
							</SnackbarProvider>
						</SearchContext.Provider>
				</Provider>
			</I18nProvider>
		</Web3ReactProvider>
	)
}
export default Root