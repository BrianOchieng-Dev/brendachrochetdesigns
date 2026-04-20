/**
 * Sparse persistence layer for simulation mode.
 * Allows users to "publish" and see their results without a real backend.
 */

const STORAGE_KEYS = {
  PRODUCTS: 'studio_published_products',
  PORTFOLIO: 'studio_published_portfolio',
  INQUIRIES: 'studio_published_inquiries',
  PROFILES: 'studio_published_profiles',
  NARRATIVES: 'studio_published_narratives',
  ACTIVITIES: 'studio_published_activities'
};

export const simulationStorage = {
  getItems: <T>(key: keyof typeof STORAGE_KEYS): T[] => {
    const data = localStorage.getItem(STORAGE_KEYS[key]);
    return data ? JSON.parse(data) : [];
  },

  addItem: <T>(key: keyof typeof STORAGE_KEYS, item: T) => {
    const items = simulationStorage.getItems<T>(key);
    const newItem = { ...item, id: Math.random().toString(36).substr(2, 9), created_at: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEYS[key], JSON.stringify([newItem, ...items]));
    // Dispatch a custom event so the same tab can react immediately
    window.dispatchEvent(new Event('simulation_update'));
    return newItem;
  },

  updateItem: <T extends { id: string }>(key: keyof typeof STORAGE_KEYS, id: string, updates: Partial<T>) => {
    const items = simulationStorage.getItems<T>(key);
    const updated = items.map(item => item.id === id ? { ...item, ...updates } : item);
    localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(updated));
    window.dispatchEvent(new Event('simulation_update'));
  },

  upsertNarrative: (section: string, content: string) => {
    const narratives = simulationStorage.getItems<any>('NARRATIVES');
    const existingIndex = narratives.findIndex((n: any) => n.section === section);
    if (existingIndex > -1) {
      narratives[existingIndex].content = content;
    } else {
      narratives.push({ section, content });
    }
    localStorage.setItem(STORAGE_KEYS.NARRATIVES, JSON.stringify(narratives));
  }
};
