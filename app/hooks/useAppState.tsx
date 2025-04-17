import React, { useCallback, useEffect } from "react";
import { AppState, AppStateStatus } from "react-native";

export interface Props {
  onChange?: (state: AppStateStatus) => void;
  onForeground?: () => void;
  onBackground?: () => void;
}

const useAppState = ({ onChange, onForeground, onBackground }: Props) => {
  const appState = React.useRef<AppStateStatus>(AppState.currentState);

  const handleAppStateChange = useCallback(
    (nextAppState: AppStateStatus) => {
      if (
        onForeground &&
        appState.current !== "active" &&
        nextAppState === "active"
      ) {
        onForeground();
      } else if (
        onBackground &&
        appState.current === "active" &&
        (nextAppState === "inactive" || nextAppState === "background")
      ) {
        onBackground();
      }

      appState.current = nextAppState;

      if (onChange) {
        onChange(nextAppState);
      }
    },
    [onBackground, onChange, onForeground]
  );

  useEffect(() => {
    const subs = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      subs.remove();
    };
  }, [handleAppStateChange]);
};

export default useAppState;
