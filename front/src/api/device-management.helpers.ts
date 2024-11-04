import { nanoid } from "nanoid";

const storeName = "User";
const deviceStoreKey = "deviceStoreKey";

export const getDeviceId = async () => {
  const db = await new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open("GoodSanction", 1);

    request.onupgradeneeded = () => {
      request.result.createObjectStore(storeName, {
        keyPath: deviceStoreKey,
        autoIncrement: false,
      });
    };

    request.onsuccess = () => resolve(request.result);
  });

  const tx = db.transaction(storeName, "readwrite");
  const store = tx.objectStore(storeName);

  const existingDevice: { deviceId: string } | undefined = await new Promise(
    (resolve) => {
      const req = store.get(deviceStoreKey);
      req.onsuccess = () => resolve(req.result);
    },
  );

  if (!existingDevice) {
    const deviceId = nanoid();
    await new Promise((resolve) => {
      const req = store.put({ deviceId, deviceStoreKey });
      req.onsuccess = () => resolve(req.result);
    });

    return deviceId;
  }

  return existingDevice.deviceId;
};
