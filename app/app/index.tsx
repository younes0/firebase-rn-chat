import { createStyleSheet, useStyles } from "react-native-unistyles";
import { FAB } from "react-native-paper";
import { useRouter } from "expo-router";

import Alert from "@/components/alert/Alert";
import ThreadsAppbar from "@/screens/threads/appbar/ThreadsAppbar";
import ThreadsList from "@/screens/threads/list/ThreadsList";
import ThreadsMainListHeader from "@/screens/threads/headers/ThreadsMainListHeader";
import useGetUserId from "@/modules/firebase/hooks/useGetUserId";
import { ThreadType } from "@/modules/chat/chat.definitions";
import { useCreateThread } from "@/hooks/api/useCreateThread";

const ThreadsMainScreen = () => {
  const router = useRouter();
  const userId = useGetUserId();

  // mutations
  // ------------------------------------------------------------------------
  const { mutate: createThread } = useCreateThread();

  // handlers
  // ------------------------------------------------------------------------
  const handleFabPress = () => {
    Alert.prompt(
      "Chat with peer",
      "Enter user ID of the person you want to chat with",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Submit",
          onPress: async (peerId) => {
            if (peerId && userId) {
              await createThread({
                peerId,
                userId,
              });

              router.navigate({
                pathname: "/discussion/[peerId]",
                params: { peerId },
              });
            }
          },
        },
      ],
      "plain-text",
      "",
      "default"
    );
  };

  // render
  // ------------------------------------------------------------------------
  const { styles } = useStyles(stylesheet);

  return (
    <>
      <ThreadsAppbar />
      <ThreadsList
        type={ThreadType.Main}
        ListHeaderComponent={ThreadsMainListHeader}
      />

      <FAB
        icon="message"
        style={styles.fab}
        disabled={!userId}
        onPress={handleFabPress}
      />
    </>
  );
};

const stylesheet = createStyleSheet(() => ({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  copyButton: {
    marginRight: 15,
  },
}));

export default ThreadsMainScreen;
