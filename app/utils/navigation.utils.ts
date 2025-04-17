import {
  NavigationState,
  createNavigationContainerRef,
} from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef();

/**
 * Get the current parent route name.
 * see: https://stackoverflow.com/a/72028016/822837
 * @param state Navigation state
 */
export const getCurrentParentRoute = (state?: NavigationState) =>
  state?.routes && state?.index ? state.routes[state.index].name : undefined;

// business logic
// --------------------------------------------------------------------------------------
/**
 * Used for iOS Quit Chat Notification:
 * using Zustand store to get the current chat peer id is not working when we open the app from the notification.
 * @returns The current chat peer id
 */
export const getCurrentChatPeerId = () => {
  if (navigationRef.isReady()) {
    const state = navigationRef.getState();

    if (!state) {
      return null;
    }

    const findPeerId = (routes: any[]): string | null => {
      for (let route of routes) {
        if (route.params?.peerId) {
          return route.params.peerId;
        }

        if (route.state?.routes) {
          const foundPeerId = findPeerId(route.state.routes);
          if (foundPeerId) {
            return foundPeerId;
          }
        }
      }

      return null;
    };

    if (state.routes) {
      return findPeerId(state.routes);
    }
  }

  return null;
};
