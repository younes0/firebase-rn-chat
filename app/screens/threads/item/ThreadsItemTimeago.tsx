import React, { useMemo } from "react";
import { Text } from "react-native";
import { format, isSameDay, isYesterday } from "date-fns";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export interface Props {
  date: Date;
  isUnread?: boolean;
}

const ThreadItemTimeAgo = React.memo(({ date, isUnread = false }: Props) => {
  const today = useMemo(() => new Date(), []);

  // render
  // -----------------------------------------------------------------------------
  const { styles } = useStyles(stylesheet);

  return (
    <Text style={isUnread ? styles.unread : styles.base}>
      {isSameDay(date, today)
        ? format(date, "HH:mm")
        : isYesterday(date)
        ? "Yesterday"
        : format(date, "dd/MM/yyyy")}
    </Text>
  );
});

const stylesheet = createStyleSheet(() => ({
  base: {
    fontSize: 13,
    alignSelf: "flex-end",
  },
  unread: {
    alignSelf: "flex-end",
    color: "rgba(67, 55, 139, 1)",
    fontWeight: "500",
  },
}));

ThreadItemTimeAgo.displayName = "ThreadItemTimeAgo";

export default ThreadItemTimeAgo;
