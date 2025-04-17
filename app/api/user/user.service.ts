import * as admin from "firebase-admin";
import { faker } from "@faker-js/faker";
import axios from "axios";

import { app, firestore } from "../utils/firebase";
import {
  FirestoreCollection,
  UserProfile,
  MessageContentType,
} from "../chat/chat.definitions";
import { generateFirebaseFid } from "../chat/chat.utils";
import { ThreadService } from "../chat/thread.service";

export class UserService {
  private auth: admin.auth.Auth;
  private threadService: ThreadService;

  constructor() {
    this.auth = admin.auth(app);
    this.threadService = new ThreadService();
  }

  async getUser(userId: string) {
    try {
      return await this.auth.getUser(userId);
    } catch (error) {
      return null;
    }
  }

  async init(userId: string) {
    const profileDoc = await this.getProfile(userId).get();

    if (!profileDoc.exists) {
      await this.setProfile(userId);
      const fakeUsers = await this.createFakeUsers(3);

      for (const fakeUser of fakeUsers) {
        await this.createThreadWithUser(userId, fakeUser);
      }
    }

    return true;
  }

  async setProfile(userId: string) {
    const profile = await this.getProfile(userId);

    const randomUserResponse = await axios.get("https://randomuser.me/api/");
    const photoUrl = randomUserResponse.data.results[0].picture.large;

    return profile.set(<UserProfile>{
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      photoUrl,
    });
  }

  // Create multiple fake users
  async createFakeUsers(count: number): Promise<string[]> {
    const userIds: string[] = [];

    for (let i = 0; i < count; i++) {
      const fakeUserId = generateFirebaseFid();
      await this.setProfile(fakeUserId);
      userIds.push(fakeUserId);
    }

    return userIds;
  }

  async createThreadWithUser(userId: string, peerId: string) {
    return this.threadService.create({
      createThreadInput: {
        lastMessageContentType: MessageContentType.Text,
        lastMessageCreatedAt: new Date(),
        lastMessageId: generateFirebaseFid(),
        lastMessageText: faker.lorem.sentence(),
      },
      peerId,
      userId,
    });
  }

  // private methods
  // ----------------------------------------------------------------
  private getProfile(userId: string) {
    return firestore.collection(FirestoreCollection.UserProfiles).doc(userId);
  }
}
