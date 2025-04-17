import { useEffect, useState } from "react";

import { UserProfile } from "@/api/chat/chat.definitions";
import { getDoc } from "@/modules/firebase/adapters/firestore.adapter";
import { getUserProfileDoc } from "@/modules/user/queries/user.queries";

type UseGetProfileOptions = {
  profileId?: string;
  skip?: boolean;
};

type UseGetProfileResult = {
  data: UserProfile | null | undefined;
  error: Error | null;
  loading: boolean;
};

const useGetProfile = ({
  profileId,
  skip = false,
}: UseGetProfileOptions): UseGetProfileResult => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<UserProfile | undefined | null>(undefined);

  useEffect(() => {
    (async () => {
      if (!profileId || skip) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const snapshot = await getDoc(getUserProfileDoc(profileId));

        setData(snapshot.exists() ? (snapshot.data() as UserProfile) : null);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Unknown error occurred")
        );
        setData(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [profileId, skip]);

  return {
    data,
    error,
    loading,
  };
};

export default useGetProfile;
