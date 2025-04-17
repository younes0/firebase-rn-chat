import i18next from "i18next";
import { ClientLang } from "./definitions";

i18next.init({
  fallbackLng: ClientLang.En,
  resources: {
    [ClientLang.En]: {
      translation: {
        threadText: {
          audio: "You have received a vocal message",
          image: "You have received an image",
        },
      },
    },
  },
});

export default i18next;
