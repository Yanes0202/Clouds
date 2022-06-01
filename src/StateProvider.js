import React, { createContext, useContext, useReducer } from "react";

export const StateContext = createContext();

export const StateProvider = ({ reducer, inicialState, children })=> (
        <StateContext.Provider value={useReducer(reducer, inicialState)}>
            {children}
        </StateContext.Provider>
    );

export const useStateValue = () => useContext(StateContext);