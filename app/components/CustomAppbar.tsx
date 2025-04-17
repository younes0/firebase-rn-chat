import React, { PropsWithChildren } from "react";
import { View, Text, StyleProp, TextStyle } from "react-native";
import { Appbar } from "react-native-paper";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";
import { useRouter } from "expo-router";

import { colors, typo } from "@/definitions/styles.definitions";

export interface Props extends PropsWithChildren {
  backActionHandler?: () => void;
  backIcon?: IconSource;
  hasBackAction?: boolean;
  hasTabsUnder?: boolean;
  isBackActionDisabled?: boolean;
  title?: string;
  titleStyle?: StyleProp<TextStyle>;
}

const CustomAppbar = ({
  backActionHandler,
  backIcon,
  children,
  hasBackAction = false,
  hasTabsUnder = false,
  isBackActionDisabled = false,
  title,
  titleStyle = {},
}: Props) => {
  // handlers
  // ------------------------------------------------------------------------------
  const router = useRouter();

  const handleBackPress = () => {
    if (backActionHandler) {
      backActionHandler();
    } else {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.navigate("/");
      }
    }
  };

  // render
  // ------------------------------------------------------------------------------
  const { styles } = useStyles(stylesheet);
  const hasBack = hasBackAction || backActionHandler;

  return (
    <Appbar.Header style={styles.root(hasTabsUnder)}>
      {hasBack ? (
        <Appbar.Action
          animated={false}
          disabled={isBackActionDisabled}
          iconColor="#5f5f5f"
          onPress={handleBackPress}
          icon={backIcon || "arrow-left"}
        />
      ) : null}

      {title ? (
        <View style={styles.titleWrapper(hasBack)}>
          <Text numberOfLines={1} style={[styles.title, titleStyle]}>
            {title}
          </Text>
        </View>
      ) : null}

      {children}
    </Appbar.Header>
  );
};

const stylesheet = createStyleSheet(() => ({
  root: (hasTabsUnder = false) => ({
    backgroundColor: colors.appbar.backgroundColor,
    borderBottomColor: colors.border.default,
    borderBottomWidth: hasTabsUnder ? 0 : 1,
    marginBottom: hasTabsUnder ? -10 : 0,
    paddingHorizontal: 0,
  }),
  titleWrapper: (hasBack = false) => ({
    marginLeft: 0,
    paddingLeft: hasBack ? 10 : 15,
    alignItems: "flex-start",
    flex: 1,
  }),
  title: {
    ...typo.textLgSemiBold,
    color: "#393939",
  },
}));

export default CustomAppbar;
