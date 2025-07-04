/* eslint-disable react/prop-types */

import {createContext, useContext, useEffect} from "react";
import {getCurrentUser} from "./db/apiAuth";
import useFetch from "./hooks/use-fetch";

const UrlContext = createContext();
const UrlProvider = ({children}) => {
  const {data: user, loading, fn: fetchUser, error} = useFetch(getCurrentUser);

  const isAuthenticated = user?.role === "authenticated";

  useEffect(() => {
    fetchUser();
  }, []);

  // Add error logging
  useEffect(() => {
    if (error) {
      console.error("Auth error:", error);
    }
  }, [error]);

  return (
    <UrlContext.Provider value={{user, fetchUser, loading, isAuthenticated}}>
      {children}
    </UrlContext.Provider>
  );
};


export const UrlState = () => {
  return useContext(UrlContext);
};

export default UrlProvider;
