import {
  LayoutChangeEvent,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from "react-native";

const useAdjustInputHeight = ({ maxHeight = 100 }) => ({
  adjustInputHeight: (
    event: LayoutChangeEvent | NativeSyntheticEvent<TextInputChangeEventData>,
  ) => {
    // @ts-ignore
    const el = event?.target || event?.nativeEvent?.target;
    // @ts-ignore
    const height = parseInt(el?.style.height.replace("px", "")) || 0;

    if (el) {
      // @ts-ignore
      el.style.height = 0;
      // @ts-ignore
      const newHeight = el.offsetHeight - el.clientHeight + el.scrollHeight;
      // @ts-ignore
      el.style.height =
        newHeight <= maxHeight ? `${newHeight}px` : `${maxHeight}px`;
    }
  },
});

export default useAdjustInputHeight;
