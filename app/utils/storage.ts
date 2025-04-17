import { MMKV } from "react-native-mmkv";
import { createJSONStorage } from "zustand/middleware";
import { StateStorage } from "zustand/middleware";

const storage = new MMKV();

export const genericMmkvStorage = {
  setItem: (key: string, value: any) => {
    storage.set(key, value);
  },
  getItem: (key: string) => {
    const value = storage.getString(key);
    return value === undefined ? null : value;
  },
  removeItem: (key: string) => {
    storage.delete(key);
  },
};

export const zustandMmkvStorage = createJSONStorage(
  () => genericMmkvStorage as StateStorage,
);

export default storage;
