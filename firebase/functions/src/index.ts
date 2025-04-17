import { onDocumentUpdated } from "firebase-functions/v2/firestore";

import { sendNewMessageNotification } from "./handlers";

exports.handleNewMessage = onDocumentUpdated(
  "threads/{recipientId}/collection/{senderId}",
  (event) => sendNewMessageNotification(event),
);
