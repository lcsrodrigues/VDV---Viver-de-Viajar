export class BaseService<T extends { id: string }> {
  protected data: T[];
  protected storageKey: string;

  constructor(storageKey: string, initialData: T[]) {
    this.storageKey = storageKey;
    const storedData = localStorage.getItem(this.storageKey);
    this.data = storedData ? JSON.parse(storedData) : initialData;
    this.saveData(); // Ensure initial data is in localStorage
  }

  private saveData(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.data));
  }

  async list(): Promise<T[]> {
    return Promise.resolve(this.data);
  }

  async get(id: string): Promise<T | undefined> {
    return Promise.resolve(this.data.find(item => item.id === id));
  }

  async create(item: Omit<T, 'id'>): Promise<T> {
    const newItem = { ...item, id: String(Date.now()) } as T;
    this.data.push(newItem);
    this.saveData();
    return Promise.resolve(newItem);
  }

  async update(id: string, updatedItem: Partial<T>): Promise<T | undefined> {
    const index = this.data.findIndex(item => item.id === id);
    if (index > -1) {
      this.data[index] = { ...this.data[index], ...updatedItem };
      this.saveData();
      return Promise.resolve(this.data[index]);
    }
    return Promise.resolve(undefined);
  }

  async delete(id: string): Promise<boolean> {
    const initialLength = this.data.length;
    this.data = this.data.filter(item => item.id !== id);
    if (this.data.length < initialLength) {
      this.saveData();
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }
}

