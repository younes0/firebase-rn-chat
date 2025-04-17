import {
  assertFails,
  assertSucceeds,
  RulesTestEnvironment,
} from "@firebase/rules-unit-testing";

import { getAdmin, getTestEnv, useEmulator } from "./utils/test.utils";
import {
  adminCreateThread,
  getMessages,
  getThread,
  getMessageObject,
} from "./utils/firestore.utils";
import { FirestoreCollection } from "./test.definitions";

describe("app", () => {
  useEmulator();
  let adminDb: FirebaseFirestore.Firestore;
  let testEnv: RulesTestEnvironment;

  beforeAll(async () => {
    adminDb = getAdmin().firestore();
    testEnv = await getTestEnv();
  });

  afterAll(async () => {
    // await testEnv.cleanup();
  });

  beforeEach(async () => {
    await testEnv.clearFirestore();
    await adminCreateThread(adminDb, "1", "2");
    await adminCreateThread(adminDb, "3", "4");
  });

  // helpers
  // ----------------------------------------------------------------------
  const getFirestore = async (userId: string) =>
    testEnv.authenticatedContext(userId).firestore();

  // messages
  // ----------------------------------------------------------------------
  describe("messages", () => {
    describe("HIS messages", () => {
      it("user 1 can READ message 1/2", async () => {
        const firestore = await getFirestore("1");
        const messages = await getMessages(firestore, "1_2");

        await assertSucceeds(messages.get());
        await assertSucceeds(
          messages.collection(FirestoreCollection.SubCollection).get()
        );
      });

      it("user 2 can READ message 1/2", async () => {
        const firestore = await getFirestore("1");
        const messages = await getMessages(firestore, "1_2");

        await assertSucceeds(messages.get());
        await assertSucceeds(
          messages.collection(FirestoreCollection.SubCollection).get()
        );
      });

      it("user 1 CAN WRITE message 1/2", async () => {
        const firestore = await getFirestore("1");
        const messages = await getMessages(firestore, "1_2");

        await assertSucceeds(
          messages
            .collection(FirestoreCollection.SubCollection)
            .add(getMessageObject("1"))
        );
      });

      it("user 2 CAN WRITE message 1/2", async () => {
        const firestore = await getFirestore("2");
        const messages = await getMessages(firestore, "1_2");

        await assertSucceeds(
          messages
            .collection(FirestoreCollection.SubCollection)
            .add(getMessageObject("2"))
        );
      });

      it("user 1 CAN't WRITE message 1/2 as user 2", async () => {
        const firestore = await getFirestore("1");
        const messages = await getMessages(firestore, "1_2");
        await assertFails(
          messages
            .collection(FirestoreCollection.SubCollection)
            .add(getMessageObject("2"))
        );
      });
    });

    describe("NOT HIS messages", () => {
      it("user 1 CAN'T READ message 3/4", async () => {
        const firestore = await getFirestore("1");
        const messages = await getMessages(firestore, "3_4");

        await assertFails(messages.get());
        await assertFails(
          messages.collection(FirestoreCollection.SubCollection).get()
        );
      });

      it("user 1 CAN'T WRITE message 3/4", async () => {
        const firestore = await getFirestore("1");
        const messages = await getMessages(firestore, "3_4");

        await assertFails(messages.update(getMessageObject("1")));
        await assertFails(
          messages
            .collection(FirestoreCollection.SubCollection)
            .add(getMessageObject("1"))
        );
      });

      it("user 11 CAN'T READ message 1/2", async () => {
        const firestore = await getFirestore("11");
        const messages = await getMessages(firestore, "1_2");

        await assertFails(messages.get());
        await assertFails(
          messages.collection(FirestoreCollection.SubCollection).get()
        );
      });

      it("user 21 CAN'T READ message 1/2", async () => {
        const firestore = await getFirestore("21");
        const messages = await getMessages(firestore, "1_2");

        await assertFails(messages.get());
        await assertFails(
          messages.collection(FirestoreCollection.SubCollection).get()
        );
      });
    });
  });

  // threads
  // ----------------------------------------------------------------------
  describe("messages", () => {
    describe("his threads/collection", () => {
      it("user 1 can GET his threads collection", async () => {
        const firestore = await getFirestore("1");
        const threads = firestore.collection("threads").doc("1");

        await assertSucceeds(
          threads.collection(FirestoreCollection.SubCollection).get()
        );
      });

      it("user 1 can read thread 1/2", async () => {
        const firestore = await getFirestore("1");
        const thread = await getThread(firestore, "1", "2");

        await assertSucceeds(thread.get());
      });

      it("user 1 can write on thread 1/2", async () => {
        const firestore = await getFirestore("1");
        const thread = await getThread(firestore, "1", "2");

        await assertSucceeds(thread.update({ isLastMessageMine: true }));
      });

      it("user 1 can't read thread 2/1", async () => {
        const firestore = await getFirestore("1");
        const thread = await getThread(firestore, "2", "1");

        await assertFails(thread.get());
      });

      it("user 1 can write on thread 2/1", async () => {
        const firestore = await getFirestore("1");
        const thread = await getThread(firestore, "2", "1");

        await assertSucceeds(thread.update({ isLastMessageMine: true }));
      });

      it("user 1 can't write unallowed fields on thread 2/1", async () => {
        const firestore = await getFirestore("1");
        const thread = await getThread(firestore, "2", "1");

        await assertFails(thread.update({ isBlocked: true }));
      });
    });

    // not his threads
    // ---------------------------------------------------------------------------------
    describe("not his threads/collection", () => {
      it("user 1 can not get other threads collection", async () => {
        const firestore = await getFirestore("1");
        const threads = firestore
          .collection(FirestoreCollection.Threads)
          .doc("2");

        await assertFails(threads.get());
        await assertFails(
          threads.collection(FirestoreCollection.Threads).get()
        );
      });

      it("user 1 can not read thread of anyone else", async () => {
        const firestore = await getFirestore("1");
        const thread = await getThread(firestore, "2", "3");

        await assertFails(thread.get());
      });

      it("user 1 can not write on thread of anyone else", async () => {
        const firestore = await getFirestore("1");
        const thread = await getThread(firestore, "2", "3");

        await assertFails(thread.update({ isLastMessageMine: true }));
      });
    });
  });
});
