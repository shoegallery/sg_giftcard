import React, { useState, createContext } from "react";

export const StateContext = createContext();

export const StateContextHistory = createContext();
export const StateContextLoan = createContext();

export const StateProvider = (props) => {
  const [userData, setUserData] = useState();
  const [userTransactionData, setUserTransactionData] = useState();
  const [userLoanData, setUserLoanData] = useState();
  return (
    <StateContext.Provider value={[userData, setUserData]}>
      <StateContextHistory.Provider
        value={[userTransactionData, setUserTransactionData]}
      >
        <StateContextLoan.Provider value={[userLoanData, setUserLoanData]}>
          {props.children}
        </StateContextLoan.Provider>
      </StateContextHistory.Provider>
    </StateContext.Provider>
  );
};
