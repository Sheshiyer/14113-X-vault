// Database client configuration
// This is a placeholder - replace with your actual database client setup

export interface DatabaseClient {
  query: <T>(sql: string, params?: unknown[]) => Promise<T[]>;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

class MockDatabaseClient implements DatabaseClient {
  async query<T>(_sql: string, _params?: unknown[]): Promise<T[]> {
    return [];
  }

  async connect(): Promise<void> {
    console.log("Database connected");
  }

  async disconnect(): Promise<void> {
    console.log("Database disconnected");
  }
}

export const db: DatabaseClient = new MockDatabaseClient();
