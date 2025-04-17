interface ButtonProps {
  text: string;
  style?: "default" | "destructive";
  onPress?: (value?: string) => void;
}

const injectStyles = () => {
  if (!document.getElementById("alert-dialog-styles")) {
    const styleElement = document.createElement("style");
    styleElement.id = "alert-dialog-styles";
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
  }
};

const createDialogElement = (
  title: string,
  message: string,
  buttons: ButtonProps[],
  inputField: string | null = null,
) => {
  injectStyles();

  const dialog = document.createElement("dialog");
  dialog.className = "alert-dialog";

  // Build dialog content
  dialog.innerHTML = `
    <div class="alert-container">
      <div class="alert-text-container">
        <h1 class="alert-header">${title}</h1>
        ${
          inputField || message
            ? `<div class="alert-body">
                ${message ? `<p class="alert-message">${message}</p>` : ""}
                ${inputField || ""}
              </div>`
            : ""
        }
      </div>
      <div class="alert-footer" id="buttons"></div>
    </div>
  `;

  const buttonsContainer = dialog.querySelector("#buttons");
  buttons.forEach(({ text, style, onPress }) => {
    const button = document.createElement("button");
    button.innerText = text;
    button.className =
      style === "destructive" ? "alert-btn-destructive" : "alert-btn-default";
    button.addEventListener("click", () => {
      dialog.close();
      if (onPress) {
        onPress(inputField ? dialog.querySelector("input")?.value : undefined);
      }
    });

    buttonsContainer?.appendChild(button);
  });

  // If there are exactly two buttons, set confirm style
  if (buttons.length === 2) {
    dialog.classList.add("alert-confirm");
  }

  return dialog;
};

class Alert {
  static alert(
    title: string,
    message: string,
    buttons: ButtonProps[] = [{ text: "OK", style: "default" }],
  ) {
    const dialog = createDialogElement(title, message, buttons);
    document.body.appendChild(dialog);
    dialog.showModal();
    dialog.addEventListener("close", () => {
      document.body.removeChild(dialog);
    });
  }

  static prompt(
    title: string,
    message: string,
    buttons: ButtonProps[] = [
      { text: "OK", style: "default", onPress: () => undefined },
    ],
    inputType: "plain-text" | "secure-text" = "plain-text",
    defaultValue: string = "",
  ) {
    const inputField = `
      <input type="${
        inputType === "secure-text" ? "password" : "text"
      }" value="${defaultValue}" class="alert-input" />
    `;

    const dialog = createDialogElement(title, message, buttons, inputField);
    document.body.appendChild(dialog);
    dialog.showModal();
    dialog.addEventListener("close", () => {
      document.body.removeChild(dialog);
    });
  }
}

const styles = `
@keyframes fadeInScale {
  0% {
    opacity: 0;
    transform: scale(1.05);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.alert-dialog {
  bottom: 30%;
  font-family: 'Inter', sans-serif;
  max-width: 240px;
  background-color: #F9F9F9;
  color: #000;
  border-radius: 16px;
  padding: 0;
  border: 0;
  animation: fadeInScale 0.3s ease-out;
}

.alert-text-container {
  margin: 20px;
}

.alert-header {
  font-size: 16px;
  text-align: center;
  margin: 0;
}

.alert-body {
  font-size: 14px;
  line-height: 18px;
  text-align: center;
  word-wrap: break-word;
}

.alert-message h1 {
  margin: 0px;
  font-size: 14px;
  line-height: 18px;
}

.alert-footer {
  display: flex;
  flex-direction: row;
  border-top: 0.5px solid #AFAFAE;
}

.alert-footer button {
  padding: 12px;
  width: 100%;
  background: none;
  border: none;
  outline: none;
  color: #007AFF;
  cursor: pointer;
  font-size: 16px;
}

.alert-footer button:focus {
  background-color: #E7E7E7;
}

.alert-footer button.alert-btn-destructive {
  color: #FF3B30;
}

.alert-footer button:hover {
  background-color: #E7E7E7;
}

.alert-confirm .alert-footer button {
  display: inline-block;
}

.alert-footer:has(> button:nth-of-type(2)) button:first-of-type {
  border-right: 0.5px solid #ADAEAD;
}

.alert-input {
  width: 90%;
  padding: 6px;
  font-size: 14px;
  background-color: #FFF;
  color: #000;
  border: 0.5px solid #ADAEAD;
  border-radius: 8px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
  outline: none;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.alert-input:focus {
  border-color: #007AFF;
  box-shadow: 0 0 5px rgba(0, 122, 255, 0.3);
}
`;

export default Alert;
