import React, { useMemo } from "react";
import { Linking, Text } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import ParsedText from "react-native-parsed-text";
import * as WebBrowser from "expo-web-browser";

import { isPureEmojiString } from "@/screens/discussion/discussion.utils";
import { colors } from "@/screens/discussion/discussion.styles";

export interface Props {
  text: string;
}

const regexes = {
  phone: /^[\+\(\s.\-\/\d\)]{5,30}$/,
};

const MessageText = ({ text }: Props) => {
  // handlers
  // ------------------------------------------------------------------------------------
  const handleUrlPress = (url: string) => {
    if (url.startsWith("www")) {
      // linking fails when url does not include scheme
      handleUrlPress(`https://${url}`);
    } else {
      WebBrowser.openBrowserAsync(url);
    }
  };

  const handleEmailPress = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const handlePhonePress = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  // render
  // ------------------------------------------------------------------------------------
  const { styles } = useStyles(stylesheet);

  const isEmoji = useMemo(() => isPureEmojiString(text), [text]);

  return isEmoji ? (
    <Text style={styles.emoji}>{text}</Text>
  ) : (
    <ParsedText
      parse={[
        { type: "email", style: styles.link, onPress: handleEmailPress },
        { type: "url", style: styles.link, onPress: handleUrlPress },
        {
          pattern: regexes.phone,
          style: styles.link,
          onPress: handlePhonePress,
        },
      ]}
      style={styles.root}
    >
      {text}
    </ParsedText>
  );
};

const stylesheet = createStyleSheet(() => ({
  root: {
    fontSize: 16,
    lineHeight: 20,
    color: "#1f1f1f",
  },
  emoji: {
    fontSize: 28,
    lineHeight: 36,
  },
  link: {
    color: colors.blue,
  },
}));

export default MessageText;
