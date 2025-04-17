import { Button } from "react-native-paper";
import * as Clipboard from "expo-clipboard";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import CustomAppbar from "@/components/CustomAppbar";
import ThreadsAppbarSelected from "@/screens/threads/appbar/ThreadsAppbarSelected";
import useGetProfile from "@/modules/user/hooks/useGetProfile";
import useGetUserId from "@/modules/firebase/hooks/useGetUserId";
import { useThreadsStore } from "@/stores/threads.store";

export interface Props {
  isArchived?: boolean;
}

const ThreadsAppbar = ({ isArchived = false }: Props) => {
  const selected = useThreadsStore((state) => state.selected);

  // fetch data
  // ------------------------------------------------------------------------
  const userId = useGetUserId();
  const { data: currentProfile } = useGetProfile({
    profileId: userId as string,
    skip: !userId,
  });

  // handlers
  // ------------------------------------------------------------------------
  const handleCopyUserId = () => {
    if (userId) {
      Clipboard.setStringAsync(userId);
    }
  };
  // render
  // ------------------------------------------------------------------------
  const { styles } = useStyles(stylesheet);

  return selected ? (
    <ThreadsAppbarSelected />
  ) : isArchived ? (
    <CustomAppbar hasBackAction={true} title="Archived" />
  ) : (
    <>
      <CustomAppbar title="Discussions">
        {currentProfile ? (
          <Button
            mode="contained-tonal"
            onPress={handleCopyUserId}
            style={styles.copyButton}
          >
            Copy ID
          </Button>
        ) : null}
      </CustomAppbar>
    </>
  );
};

const stylesheet = createStyleSheet(() => ({
  copyButton: {
    marginRight: 15,
  },
}));

export default ThreadsAppbar;
