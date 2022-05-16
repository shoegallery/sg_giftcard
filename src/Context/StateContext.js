import React, { useState, createContext } from "react";

export const StateContext = createContext();

export const StateContextHistory = createContext();

export const StateProvider = (props) => {
  const [userData, setUserData] = useState();
  const [userTransactionData, setUserTransactionData] = useState();
  return (
    <StateContext.Provider value={[userData, setUserData]}>
      <StateContextHistory.Provider
        value={[userTransactionData, setUserTransactionData]}
      >
        {props.children}
      </StateContextHistory.Provider>
    </StateContext.Provider>
  );
};
