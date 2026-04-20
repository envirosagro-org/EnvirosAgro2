import localforage from 'localforage';

const storage = localforage.createInstance({
  name: 'envirosagro-persist',
  storeName: 'cache'
});

export const persistItem = async (key: string, value: any) => {
  await storage.setItem(key, value);
};

export const fetchPersistedItem = async (key: string) => {
  return await storage.getItem(key);
};

export const queueAction = async (action: any) => {
  const queue = (await storage.getItem<any[]>('action_queue')) || [];
  await storage.setItem('action_queue', [...queue, { ...action, timestamp: Date.now() }]);
};
