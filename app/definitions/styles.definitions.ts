import { StyleSheet } from "react-native";

export const colors = {
  icon: "#555555",
  text: {
    default: "#000000",
    error: "#F5222D",
    helper: "#777777",
    secondary: "#575757",
  },
  background: {
    default: "#ffffff",
    light: "rgba(253, 251, 255, 1)",
    list: "rgba(228, 225, 232, 1)",
  },
  border: {
    default: "rgba(228, 225, 232, 1)",
    light: "#f3f3f3",
  },
  appbar: {
    backgroundColor: "#ffffff",
  },
};

export const typo = StyleSheet.create({
  text3xl: {
    fontSize: 22,
    lineHeight: 30,
    fontWeight: "500",
    color: "rgba(47, 48, 54, 1)",
  },
  text2xl: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "500",
    color: "rgba(47, 48, 54, 1)",
  },
  textXl: {
    fontSize: 18,
    lineHeight: 26,
    color: "rgba(47, 48, 54, 1)",
    fontWeight: "500",
  },
  textLgSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
  },
  textLg: {
    fontSize: 16,
    lineHeight: 24,
  },
  textMd: {
    fontSize: 15,
    lineHeight: 22,
  },
  textSm: {
    fontSize: 14,
    lineHeight: 20,
  },
  textXs: {
    fontSize: 13,
    lineHeight: 16,
  },
  textXxs: {
    fontSize: 12,
    lineHeight: 14,
  },
  titleLg: {
    color: colors.text.secondary,
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
  },
  titleSm: {
    color: colors.text.secondary,
    fontWeight: "500",
    lineHeight: 20,
  },
  titleXs: {
    color: colors.text.secondary,
    fontWeight: "500",
    fontSize: 13,
    lineHeight: 16,
  },
});
