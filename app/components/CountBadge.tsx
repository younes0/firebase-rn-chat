import React from "react";
import { Badge } from "react-native-paper";

export interface Props {
  count: string | number;
  hasLargeCount?: boolean;
  isPrimary?: boolean;
  size?: number;
}

const CountBadge = ({
  count,
  hasLargeCount,
  isPrimary = true,
  size = 18,
}: Props) => (
  <Badge
    size={size}
    style={{
      fontSize: size / (hasLargeCount ? 2 : 1.5),
    }}
    theme={{
      colors: {
        error: isPrimary ? "#822cad" : "#667182",
      },
    }}
  >
    {count}
  </Badge>
);

export default CountBadge;
