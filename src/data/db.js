const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../flashcards.db');

class Database {
  constructor() {
    this.db = null;
  }

  /**
   * Initialize and connect to SQLite database
   */
  async initialize() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          console.error('Error opening database:', err.message);
          reject(err);
        } else {
          console.log('✓ Connected to SQLite database at', dbPath);
          this.createTables()
            .then(resolve)
            .catch(reject);
        }
      });
    });
  }

  /**
   * Create tables if they don't exist
   */
  async createTables() {
    const queries = [
      `CREATE TABLE IF NOT EXISTS flashcards (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        topic TEXT NOT NULL,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        correctCount INTEGER DEFAULT 0,
        wrongCount INTEGER DEFAULT 0,
        deleted INTEGER DEFAULT 0,
        UNIQUE(userId, topic, question)
      )`,
      
      `CREATE INDEX IF NOT EXISTS idx_userId_topic ON flashcards(userId, topic)`,
      `CREATE INDEX IF NOT EXISTS idx_userId ON flashcards(userId)`,
      `CREATE INDEX IF NOT EXISTS idx_deleted ON flashcards(deleted)`
    ];

    for (const query of queries) {
      await this.run(query);
    }

    console.log('✓ Database schema initialized');
  }

  /**
   * Execute a query that returns no result (INSERT, UPDATE, DELETE)
   */
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, (err) => {
        if (err) {
          console.error('Database run error:', err.message);
          reject(err);
        } else {
          resolve(this);
        }
      });
    });
  }

  /**
   * Execute a query that returns a single row (SELECT with LIMIT 1)
   */
  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          console.error('Database get error:', err.message);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  /**
   * Execute a query that returns multiple rows (SELECT)
   */
  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          console.error('Database all error:', err.message);
          reject(err);
        } else {
          resolve(rows || []);
        }
      });
    });
  }

  /**
   * Close database connection
   */
  close() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            console.error('Error closing database:', err.message);
            reject(err);
          } else {
            console.log('✓ Database connection closed');
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }
}

// Singleton instance
const database = new Database();

module.exports = database;
