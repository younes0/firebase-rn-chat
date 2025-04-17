import { DocumentData } from "firebase/firestore";

import { FirebaseThread, Thread } from "./chat.definitions";
import { getUserProfilesQuery } from "../user/queries/user.queries";
import { getDocs } from "../firebase/adapters/firestore.adapter";
import { UserProfile } from "@/api/chat/chat.definitions";

export const getRelationFid = (
  userId: string | string,
  peerId: string | string
) => {
  return userId.localeCompare(peerId, "en") < 0
    ? `${userId}_${peerId}`
    : `${peerId}_${userId}`;
};

// other
// ---------------------------------------------------------------------------------
export const parseFirebaseThread = (document: DocumentData) => {
  const data: FirebaseThread = document.data();

  return <Thread>{
    ...data,
    userId: document.id,
    lastMessageCreatedAt: data.lastMessageCreatedAt?.toDate
      ? data.lastMessageCreatedAt.toDate()
      : new Date(),
  };
};

// other methods
// ----------------------------------------------------------------------
export const fetchProfiles = async (threads: Thread[]) => {
  const profileIds = threads.map((thread) => Number.parseInt(thread.userId));

  if (profileIds.length) {
    const profileQuery = getUserProfilesQuery();
    const querySnapshot = await getDocs(profileQuery);

    const profiles: UserProfile[] = [];
    querySnapshot.forEach((doc) => {
      profiles.push(doc.data() as UserProfile);
    });

    return profiles;
  }
};
