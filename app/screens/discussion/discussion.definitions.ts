export enum ChatPictureSize {
  Full = "full",
  Medium = "medium",
  Small = "small",
}

export interface PlaybackStatus {
  didJustFinish: boolean;
  durationMillis: number;
  isBuffering: boolean;
  isLoaded: boolean;
  isLooping: boolean;
  isMuted: boolean;
  isPlaying: boolean;
  positionMillis: number;
  progressUpdateIntervalMillis: number;
  rate: number;
  shouldCorrectPitch: boolean;
  shouldPlay: boolean;
  uri: string;
}

export enum ReplyTypes {
  FromMeToMe = "from_me_to_me",
  FromMeToPeer = "from_me_to_peer",
  FromPeerToMe = "from_peer_to_me",
  FromPeerToPeer = "from_peer_to_peer",
}
