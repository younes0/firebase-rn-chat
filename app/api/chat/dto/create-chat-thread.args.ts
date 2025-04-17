import { CreateThreadInput } from "./create-thread.input";

export interface CreateChatThreadArgs {
  userId: string;
  peerId: string;
  createThreadInput: CreateThreadInput;
}
