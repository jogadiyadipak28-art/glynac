import { useEffect, type Dispatch, type SetStateAction } from "react";

const storageKey = "glynac-admin-search";
const eventName = "glynac-admin-search";

export function useGlobalSearch(setQuery: Dispatch<SetStateAction<string>>) {
  useEffect(() => {
    const pendingSearch = window.sessionStorage.getItem(storageKey);
    if (pendingSearch !== null) {
      window.sessionStorage.removeItem(storageKey);
      setQuery(pendingSearch);
    }

    function handleSearch(event: Event) {
      const searchEvent = event as CustomEvent<string>;
      setQuery(searchEvent.detail ?? "");
    }

    window.addEventListener(eventName, handleSearch);
    return () => window.removeEventListener(eventName, handleSearch);
  }, [setQuery]);
}
