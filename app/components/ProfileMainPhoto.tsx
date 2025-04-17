import React from "react";
import { Image } from "expo-image";

import { ProfilePhotoSize, ProfileMainPhotoSize } from "@/definitions/enums";
import { UserProfile } from "@/api/chat/chat.definitions";

export interface Props {
  profile: UserProfile;
  size?: "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
}

const getPhotoSize = (size: NonNullable<Props["size"]>) =>
  ({
    ["xxs"]: ProfilePhotoSize.Small,
    ["xs"]: ProfilePhotoSize.Small,
    ["sm"]: ProfilePhotoSize.Medium,
    ["md"]: ProfilePhotoSize.Medium,
    ["lg"]: ProfilePhotoSize.Medium,
    ["xl"]: ProfilePhotoSize.Full,
    ["2xl"]: ProfilePhotoSize.Full,
  }[size]);

const ProfileMainPhoto = ({ profile, size = "md" }: Props) =>
  profile.photoUrl ? (
    <Image
      recyclingKey={profile.photoUrl} // TODO: change id
      source={profile.photoUrl}
      style={{
        borderRadius: 500,
        height: ProfileMainPhotoSize[size],
        width: ProfileMainPhotoSize[size],
      }}
    />
  ) : null;

export default ProfileMainPhoto;
