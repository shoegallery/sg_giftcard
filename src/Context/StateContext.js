import React, { useState, createContext } from "react";

export const StateContext = createContext();

export const StateProvider = (props) => {
  const [userData, setUserData] = useState();
  return (
    <StateContext.Provider value={[userData, setUserData]}>
      {props.children}
    </StateContext.Provider>
  );
};
