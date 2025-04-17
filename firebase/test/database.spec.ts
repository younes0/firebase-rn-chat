import {
  assertFails,
  assertSucceeds,
  RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { database } from "firebase-admin";

import { getAdmin, getTestEnv, useEmulator } from "./utils/test.utils";

describe("app", () => {
  let adminDb: database.Database;
  let testEnv: RulesTestEnvironment;

  beforeAll(async () => {
    useEmulator();
    adminDb = getAdmin().database();
    testEnv = await getTestEnv();
  });

  afterAll(async () => {
    await testEnv.cleanup();
  });

  beforeEach(async () => {
    await adminDb.ref().set(null);
  });

  // helpers
  // ----------------------------------------------------------------------
  const getDatabase = async (userId: string) =>
    testEnv.authenticatedContext(userId).database();

  // tests
  // -----------------------------------------------------------------------------------------
  describe("test write permissions", () => {
    it("1 reads 1_2/1", async () => {
      const database = await getDatabase("1");

      await assertSucceeds(database.ref("typing/1_2/1").get());
    });

    it("1 reads 1_2/2", async () => {
      const database = await getDatabase("1");

      await assertSucceeds(database.ref("typing/1_2/2").get());
    });

    it("1 write 1_2/1", async () => {
      const database = await getDatabase("1");

      await assertSucceeds(database.ref("typing/1_2/1").set(true));
    });

    it("1 can't write 1_2/2", async () => {
      const database = await getDatabase("1");

      await assertFails(database.ref("typing/1_2/2").set(true));
    });

    it("1 can't write string", async () => {
      const database = await getDatabase("1");

      await assertFails(database.ref("typing/1_2/2").set("dummy"));
    });

    it("3 can't read 1_2/1", async () => {
      const database = await getDatabase("3");

      await assertFails(database.ref("typing/1_2/1").get());
    });

    it("3 can't write 1_2/1", async () => {
      const database = await getDatabase("3");

      await assertFails(database.ref("typing/1_2/1").get());
    });

    it("11 can't read 1_2/1", async () => {
      const database = await getDatabase("11");

      await assertFails(database.ref("typing/1_2/1").get());
    });

    it("22 can't read 1_2/1", async () => {
      const database = await getDatabase("11");

      await assertFails(database.ref("typing/1_2/1").get());
    });
  });
});
