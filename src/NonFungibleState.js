import { useState } from 'react';
import constate from "constate";

export function useNonFungibleState() {
  const [nonFungibleState, setNonFungibleState] = useState({
    ready    : false,
    forsales : [],
    botwallet: [],
    basket   : []
  });
  const setForSales = (ids) => { setNonFungibleState({
    ready    : true,
    forsales : ids,
    botwallet: nonFungibleState.botwallet,
    basket   : nonFungibleState.basket
  })};
  const setBotWallet = (ids) => { setNonFungibleState({
    ready    : true,
    forsales : nonFungibleState.forsales,
    botwallet: ids,
    basket   : nonFungibleState.basket
  })};
  const setBasket = (ids) => { setNonFungibleState({
    ready    : nonFungibleState.ready,
    forsales : nonFungibleState.forsales,
    botwallet: nonFungibleState.botwallet,
    basket   : ids
  })};
  const isReady = () => {
    return nonFungibleState.ready;
  }
  const setNotReady = () => { setNonFungibleState({
    ready    : false,
    forsales : [],
    botwallet: [],
    basket   : nonFungibleState.basket,
  })

  }
  return { nonFungibleState, setForSales, setBotWallet, setBasket, isReady, setNonFungibleState, setNotReady };
}

export const [NonFungibleStateProvider, useNonFungibleStateContext] = constate(useNonFungibleState);
