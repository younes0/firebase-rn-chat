import { useContext } from "react";
import { View, Text, Platform } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import CustomAppbar from "@/components/CustomAppbar";
import DiscussionAppbarUnselectedMenu from "./DiscussionAppbarUnselectedMenu";
import DiscussionIsTyping from "./DiscussionIsTyping";
import ProfileMainPhoto from "@/components/ProfileMainPhoto";
import useGetProfile from "@/modules/user/hooks/useGetProfile";
import { DiscussionContext } from "@/definitions/contexts";
import { typo } from "@/definitions/styles.definitions";

const DiscussionAppbarUnselected = () => {
  const { peerId } = useContext(DiscussionContext);

  // fetch data
  // ------------------------------------------------------------------------------------
  const { data: peerProfile } = useGetProfile({ profileId: peerId });

  // render
  // -----------------------------------------------------------------------------
  const { styles } = useStyles(stylesheet);

  return peerProfile ? (
    <CustomAppbar hasBackAction={true}>
      <View style={styles.header}>
        <View style={styles.touchable}>
          <ProfileMainPhoto profile={peerProfile} size="xxs" />

          <View>
            <Text numberOfLines={1} style={styles.title}>
              {peerProfile.firstName} {peerProfile.lastName}
            </Text>

            <DiscussionIsTyping />
          </View>
        </View>
      </View>

      <DiscussionAppbarUnselectedMenu />
    </CustomAppbar>
  ) : null;
};

const stylesheet = createStyleSheet(() => ({
  header: {
    alignItems: "center",
    columnGap: 10,
    flexDirection: "row",
    flex: 1,
  },
  touchable: {
    alignItems: "center",
    columnGap: 10,
    flex: 1,
    flexDirection: "row",
    paddingVertical: 5,
  },
  title: {
    ...typo.textXl,
    color: "#505050",
    fontWeight: Platform.select({
      android: "800",
      default: "500",
    }),
  },
}));

export default DiscussionAppbarUnselected;
