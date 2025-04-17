import { Alert as RNAlert } from "react-native";
import prompt, { PromptOptions } from "react-native-prompt-android";

type ButtonProps = {
  text: string;
  style?: "default" | "cancel" | "destructive";
  onPress?: (value?: string) => void;
};

const Alert = {
  ...RNAlert,

  prompt(
    title: string,
    message: string,
    buttons: ButtonProps[] = [
      { text: "OK", style: "default", onPress: () => undefined },
    ],
    inputType: "plain-text" | "secure-text" = "plain-text",
    defaultValue: string = "",
  ) {
    const options: PromptOptions = {
      defaultValue,
      placeholder: "",
      type: inputType === "secure-text" ? "secure-text" : "plain-text",
      style: "shimo",
    };

    if (!buttons.length) {
      prompt(title, message, [{ text: "OK" }], options);
    } else if (buttons.length === 1) {
      prompt(
        title,
        message,
        [
          {
            text: buttons[0].text || "OK",
            onPress: (value) => buttons[0].onPress?.(value),
          },
        ],
        options,
      );
    } else {
      prompt(
        title,
        message,
        buttons.map((button) => ({
          text: button.text,
          onPress: (value: string) => button.onPress?.(value),
          style: button.style,
        })),
        options,
      );
    }
  },
};

export default Alert;
