// SQLite In-Memory Database
import Database from 'better-sqlite3';

export interface DatabaseInterface {
    getStories(): any[];
    addStory(story: any): void;
    updateStory(id: string, updates: any): void;
    deleteStory(id: string): void;
    getProjects(): any[];
    createProject(name: string, description: string): any;
    deleteProject(id: string): void;
    getConfig(key: string): any;
    setConfig(key: string, value: any): void;
    save(): void;
    load(): void;
}

export class InMemoryDatabase implements DatabaseInterface {
    private db: Database.Database;

    constructor() {
        this.db = new Database(':memory:');
        this.initTables();
    }

    private initTables(): void {
        this.db.exec(`
            CREATE TABLE stories (id TEXT PRIMARY KEY, data TEXT);
            CREATE TABLE projects (id TEXT PRIMARY KEY, name TEXT, description TEXT);
            CREATE TABLE config (key TEXT PRIMARY KEY, value TEXT);
        `);
    }

    getStories(): any[] {
        const stmt = this.db.prepare('SELECT * FROM stories');
        return stmt.all().map((row: any) => JSON.parse(row.data));
    }

    addStory(story: any): void {
        const stmt = this.db.prepare('INSERT INTO stories (id, data) VALUES (?, ?)');
        stmt.run(story.id, JSON.stringify(story));
    }

    updateStory(id: string, updates: any): void {
        const current = this.db.prepare('SELECT data FROM stories WHERE id = ?').get(id);
        if (current) {
            const updated = { ...JSON.parse(current.data), ...updates };
            const stmt = this.db.prepare('UPDATE stories SET data = ? WHERE id = ?');
            stmt.run(JSON.stringify(updated), id);
        }
    }

    deleteStory(id: string): void {
        this.db.prepare('DELETE FROM stories WHERE id = ?').run(id);
    }

    getProjects(): any[] {
        return this.db.prepare('SELECT * FROM projects').all();
    }

    createProject(name: string, description: string): any {
        const project = { id: 'proj-' + Date.now(), name, description, stories: [] };
        this.db.prepare('INSERT INTO projects (id, name, description) VALUES (?, ?, ?)').run(project.id, name, description);
        return project;
    }

    deleteProject(id: string): void {
        this.db.prepare('DELETE FROM projects WHERE id = ?').run(id);
    }

    getConfig(key: string): any {
        const result = this.db.prepare('SELECT value FROM config WHERE key = ?').get(key);
        return result ? JSON.parse(result.value) : null;
    }

    setConfig(key: string, value: any): void {
        this.db.prepare('INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)').run(key, JSON.stringify(value));
    }

    save(): void {}
    load(): void {}
}