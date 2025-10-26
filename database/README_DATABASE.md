# Database Tools - Complete!

Your Post Office database schema has been successfully loaded into Railway!

## ✅ What's Loaded

### Tables Created (9 total)
- ✅ `authentication` - User authentication (6 sample users)
- ✅ `address` - Address records
- ✅ `customer` - Customer accounts
- ✅ `employee` - Employee records
- ✅ `facility` - Post office facilities
- ✅ `package` - Package tracking
- ✅ `complaint` - Customer/employee complaints
- ✅ `tracking_event` - Package tracking events
- ✅ `transaction` - Shipping transactions

### Sample Data
- 6 authentication records (users with login credentials)
- Schema is ready for you to add address, customer, and employee data

## 🚀 Quick Commands

### Test Connection
```bash
cd database
npm run test-connection
```

### Run SQL Queries
```bash
# Inline query
npm run query -- "SELECT * FROM authentication"

# From file
npm run query -- --file queries/example.sql
```

### Interactive SQL CLI
```bash
npm run interactive
```
Then type SQL and end with `;`:
```sql
mysql> SELECT * FROM authentication;
mysql> SELECT COUNT(*) FROM customer;
mysql> exit
```

### View All Tables
```bash
npm run query -- "SHOW TABLES"
```

### Reset Database (DANGER!)
```bash
npm run reset    # Drops all tables
npm run load-schema  # Recreate schema
```

## 📊 Sample Queries

```bash
# List all users
npm run query -- "SELECT * FROM authentication"

# Show table structure
npm run query -- "DESCRIBE customer"

# Count records
npm run query -- "SELECT COUNT(*) FROM authentication"
```

## 🔧 Available Tools

| Command | Description |
|---------|-------------|
| `npm run test-connection` | Test Railway database connection |
| `npm run interactive` | Start interactive SQL CLI |
| `npm run query -- "SQL"` | Run inline SQL query |
| `npm run query -- --file path.sql` | Run SQL from file |
| `npm run reset` | Drop all tables (destructive!) |
| `npm run load-schema` | Load the post office schema |

## 📁 Directory Structure

```
database/
├── package.json              # Database tools scripts
├── db-config.js              # Database connection
├── query-runner.js           # Run SQL queries
├── interactive-cli.js        # Interactive SQL CLI
├── reset-database.js         # Reset database
├── load-schema.js            # Load schema file
├── test-connection.js        # Test connection
├── verify-schema.js          # Verify schema
│
├── load-schema.sql           # Your post office schema
├── README.md                 # Main documentation
└── README_DATABASE.md        # This file
```

## 💡 Tips

1. **Use the interactive CLI** for exploring:
   ```bash
   npm run interactive
   ```

2. **Save common queries** in `/database/queries/`:
   ```bash
   npm run query -- --file queries/my-query.sql
   ```

3. **Always test queries** before running in production

4. **Backup before reset**:
   ```bash
   # Export data first!
   npm run query -- "SELECT * FROM customer" > backup.json
   ```

## 🔒 Security

- ✅ Database credentials in `/server/.env` (gitignored)
- ✅ Connection to Railway MySQL via SSL
- ⚠️ Sample passwords are NOT hashed - hash them in production!

## 🌐 Railway Database Info

- **Host**: turntable.proxy.rlwy.net
- **Port**: 56189
- **Database**: railway
- **User**: root
- **Status**: ✅ Connected and ready

## 📚 Documentation

- [Main Database Tools README](./README.md) - Full documentation
- [Deployment Guide](../DEPLOYMENT.md) - Deploy to Vercel
- [Setup Complete](../SETUP_COMPLETE.md) - Project overview

## 🎯 Next Steps

1. **Add more sample data** via interactive CLI or seed files
2. **Build your API** in `/server` to access this database
3. **Test queries** using the CLI tools
4. **Deploy to Vercel** when ready!

---

**Database successfully configured!** 🎉

Use `npm run interactive` to start querying your database.
