import { Notification } from "@notifee/react-native";

// notifications
// ----------------------------------------------------------------------------
export enum ChannelIdentifier {
  Default = "Default",
  MessageNew = "MessageNew",
}

// for android & not used
export enum ChannelGroupIdentifier {
  Message = "Message",
}

// notifications
// ----------------------------------------------------------------------------
export type ChatNotification = Notification & {
  data: Notification["data"] & {
    chatPeerId: string;
    imageUrl: string;
  };
  ios: {
    communicationInfo: {
      sender: {
        id: string;
      };
    };
  };
};

// unused for now
// ----------------------------------------------------------------------------
export enum ActionIdentifier {
  Reply = "Reply",
  Mute = "Mute",
}

export enum CategoryIdentifier {
  Message = "Message",
}
