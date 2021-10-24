import { goTrySync } from "go-try";
import { useCallback, useEffect, useState } from "react";

// Syncs state to localStorage and vice versa
export function useSyncedState(key, initialValue) {
  const getValueFromStorage = useCallback(
    () =>
      goTrySync(() => JSON.parse(localStorage.getItem(key) ?? "")).data ??
      initialValue,
    [initialValue, key]
  );

  const [state, setState] = useState(() => getValueFromStorage());

  useEffect(() => {
    function handleStorageChange() {
      setState(getValueFromStorage);
    }

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [getValueFromStorage]);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}
