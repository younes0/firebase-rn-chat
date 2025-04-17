import { MessageContentType } from "@/api/chat/chat.definitions";
import { ThreadService } from "@/api/chat/thread.service";
import { generateFirebaseFid } from "@/api/chat/chat.utils";

const threadService = new ThreadService();

export async function POST(request: Request) {
  const { data } = await request.json();

  await threadService.create({
    createThreadInput: {
      lastMessageContentType: MessageContentType.Text,
      lastMessageId: generateFirebaseFid(),
      lastMessageCreatedAt: new Date(),
      lastMessageText: "Hello",
    },
    peerId: data.peerId,
    userId: data.userId,
  });

  return Response.json({
    message: "Thread created",
  });
}
