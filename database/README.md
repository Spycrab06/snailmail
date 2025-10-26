# SnailMail Database Tools

A complete set of database utilities for managing your SnailMail MySQL database.

## 🚀 Quick Start

```bash
# Navigate to database directory
cd database

# Install dependencies
npm install

# Test connection to Railway database
npm run test-connection

# Run interactive SQL CLI
npm run interactive
```

## 📦 Installation

The database tools use the same `.env` file from your `/server` directory, so no additional configuration is needed!

```bash
cd database
npm install
```

## 🛠️ Available Tools

### 1. Test Connection

Verify your database connection and see database info.

```bash
npm run test-connection
```

**Output:**
- ✅ Connection status
- 📊 Database list
- 📋 Tables in current database
- 🔢 MySQL version
- ⏱️ Server uptime

---

### 2. Interactive SQL CLI

A MySQL command-line interface for running queries interactively.

```bash
npm run interactive
```

**Features:**
- Execute SQL queries in real-time
- Multi-line query support
- Syntax: End queries with `;` to execute
- Commands: `exit`, `quit`, `clear`, `help`

**Example session:**
```sql
mysql> show tables;
mysql> select * from users;
mysql> describe messages;
mysql> select count(*) from messages where is_read = false;
mysql> exit
```

---

### 3. Query Runner

Execute SQL queries from command line or files.

**Run inline query:**
```bash
npm run query -- "SELECT * FROM users"
npm run query -- "SHOW TABLES"
npm run query -- "SELECT COUNT(*) as total FROM messages"
```

**Run query from file:**
```bash
npm run query -- --file queries/get-all-users.sql
npm run query -- -f queries/get-all-messages.sql
```

---

### 4. Migration Runner

Manage database schema changes with migrations.

**Run all pending migrations:**
```bash
npm run migrate
```

**Create a new migration:**
```bash
npm run migrate -- create "add user roles table"
npm run migrate -- create "add email verified column"
```

**Check migration status:**
```bash
npm run migrate -- status
```

**How it works:**
1. Migrations are stored in `/database/migrations/`
2. Each migration is a `.sql` file with timestamp
3. Executed migrations are tracked in `migrations` table
4. Migrations run in chronological order

---

### 5. Database Seeder

Populate database with sample data.

**Run default seed:**
```bash
npm run seed
```

**Run specific seed file:**
```bash
npm run seed -- seeds/test-data.sql
npm run seed -- seeds/production-data.sql
```

---

## 📁 Directory Structure

```
database/
├── package.json              # Database tools package
├── db-config.js              # Database connection config
├── query-runner.js           # Query execution utility
├── interactive-cli.js        # Interactive SQL CLI
├── migrate.js                # Migration runner
├── seed.js                   # Database seeder
├── test-connection.js        # Connection tester
│
├── migrations/               # Database migrations
│   └── 20251026000000-create-initial-tables.sql
│
├── seeds/                    # Seed data files
│   └── seed.sql
│
└── queries/                  # Saved SQL queries
    ├── get-all-users.sql
    ├── get-all-messages.sql
    ├── get-unread-messages.sql
    └── show-tables.sql
```

## 📚 Example Workflows

### Initial Database Setup

```bash
# 1. Test connection
npm run test-connection

# 2. Run migrations to create tables
npm run migrate

# 3. Seed with sample data
npm run seed

# 4. Verify tables were created
npm run query -- "SHOW TABLES"

# 5. View sample data
npm run query -- --file queries/get-all-users.sql
```

### Daily Development

```bash
# Quick query
npm run query -- "SELECT * FROM messages WHERE is_read = false"

# Interactive session for exploration
npm run interactive

# Run saved query
npm run query -- --file queries/get-unread-messages.sql
```

### Adding New Features

```bash
# 1. Create migration for schema changes
npm run migrate -- create "add profile picture to users"

# 2. Edit the generated migration file
# database/migrations/[timestamp]-add-profile-picture-to-users.sql

# 3. Run the migration
npm run migrate

# 4. Verify changes
npm run query -- "DESCRIBE users"
```

## 🎯 Sample Queries

### Show all tables
```bash
npm run query -- --file queries/show-tables.sql
```

### Get all users
```bash
npm run query -- --file queries/get-all-users.sql
```

### Get all messages with user details
```bash
npm run query -- --file queries/get-all-messages.sql
```

### Get unread messages
```bash
npm run query -- --file queries/get-unread-messages.sql
```

### Custom inline queries
```bash
npm run query -- "SELECT COUNT(*) as total_users FROM users"
npm run query -- "SELECT * FROM users WHERE created_at > NOW() - INTERVAL 7 DAY"
npm run query -- "UPDATE messages SET is_read = true WHERE id = 1"
```

## 🔧 Configuration

The tools automatically use environment variables from `/server/.env`:

```env
DB_HOST=turntable.proxy.rlwy.net
DB_USER=root
DB_PASSWORD=QiKmEvAEDvFpnrBzcWTNOmsCnGppkTrE
DB_NAME=railway
DB_PORT=56189
```

No additional configuration needed!

## 📝 Creating Custom Queries

Save frequently used queries in the `/database/queries/` directory:

```bash
# Create new query file
echo "SELECT * FROM users WHERE email LIKE '%@gmail.com';" > queries/gmail-users.sql

# Run it
npm run query -- --file queries/gmail-users.sql
```

## 🔄 Migration Best Practices

1. **Always use migrations** for schema changes
2. **Never edit executed migrations** - create a new one instead
3. **Test migrations** on development database first
4. **Use descriptive names** for migrations
5. **Include rollback instructions** in comments

Example migration:
```sql
-- Migration: Add user roles
-- Created: 2025-10-26

CREATE TABLE user_roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  role VARCHAR(50) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Rollback (manual):
-- DROP TABLE user_roles;
```

## 🌱 Seeding Best Practices

1. **Separate seeds** for development vs production
2. **Use transactions** for large seed operations
3. **Make seeds idempotent** (can run multiple times safely)
4. **Don't seed sensitive data** in version control

## 🐛 Troubleshooting

### Connection fails
```bash
# Check Railway database status
# Visit: https://railway.app/dashboard

# Verify .env file exists
cat ../server/.env

# Test connection explicitly
npm run test-connection
```

### Migration fails
```bash
# Check migration status
npm run migrate -- status

# Review migration file for SQL errors
cat migrations/[migration-file].sql

# Check MySQL error logs in Railway dashboard
```

### Query syntax error
```bash
# Use interactive CLI to test queries
npm run interactive

# Test small parts of complex queries first
npm run query -- "SELECT 1"
```

## 🔒 Security Notes

- ⚠️ Never commit `.env` files
- ⚠️ Don't include real passwords in seed files
- ⚠️ Use parameterized queries in application code
- ✅ Database credentials are in `/server/.env` (gitignored)

## 💡 Pro Tips

1. **Use interactive CLI** for exploration and testing
2. **Save complex queries** as files in `/queries`
3. **Test migrations** on development database first
4. **Use descriptive migration names** for easy tracking
5. **Check migration status** before running: `npm run migrate -- status`

## 🚀 Advanced Usage

### Transactions in migrations

```sql
-- migrations/xxx-complex-changes.sql
START TRANSACTION;

CREATE TABLE new_table (...);
ALTER TABLE existing_table ADD COLUMN ...;
INSERT INTO new_table SELECT ... FROM existing_table;

COMMIT;
```

### Custom connection pooling

Edit `db-config.js` to customize pool settings:
```javascript
const pool = mysql.createPool({
  // ... existing config
  connectionLimit: 20,        // max connections
  queueLimit: 0,              // no queue limit
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});
```

## 📖 Documentation

For more information:
- [Main Documentation](../docs/backend.md)
- [Deployment Guide](../DEPLOYMENT.md)
- [Setup Complete](../SETUP_COMPLETE.md)

## 🆘 Getting Help

- Check [Railway Dashboard](https://railway.app/dashboard) for database status
- Review MySQL error messages in query output
- Use `npm run test-connection` to verify connectivity
- Check `/server/.env` for correct credentials

---

**Happy querying!** 🎉
