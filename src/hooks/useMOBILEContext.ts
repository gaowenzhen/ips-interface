import { createContext, Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
 

export type MOBILEContextData = {
	btnState: boolean;
	setBtnState: Dispatch<SetStateAction<boolean>>
} | undefined

export const MOBILEContext = createContext<MOBILEContextData>(undefined);

// useSearchContext

export function useMOBILE() {
 
	const [btnState, setBtnState] = useState(false);
	const [newBtnState, setNewBtnState] = useState(false)
  
	useEffect(() => {
	  if (newBtnState) {
		  setBtnState(!btnState)
	  }
  }, [newBtnState])

	return ({ btnState, setBtnState: setNewBtnState })
}
