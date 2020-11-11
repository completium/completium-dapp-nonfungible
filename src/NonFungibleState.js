import { useState } from 'react';
import constate from "constate";

export function useNonFungibleState() {
  const [nonFungibleState, setNonFungibleState] = useState({
    forsales : [],
    botwallet: [],
    basket   : []
  });
  const setForSales = (ids) => { setNonFungibleState({
    forsales : ids,
    botwallet: nonFungibleState.botwallet,
    basket   : nonFungibleState.basket
  })};
  const setBotWallet = (ids) => { setNonFungibleState({
    forsales : nonFungibleState.forsales,
    botwallet: ids,
    basket   : nonFungibleState.basket
  })};
  const setBasket = (ids) => { setNonFungibleState({
    forsales : nonFungibleState.forsales,
    botwallet: nonFungibleState.botwallet,
    basket   : ids
  })};
  return { nonFungibleState, setForSales, setBotWallet, setBasket };
}

export const [NonFungibleStateProvider, useNonFungibleStateContext] = constate(useNonFungibleState);
