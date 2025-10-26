# How to Import an Entire SQL Dump

You now have multiple ways to import a complete SQL dump into your Railway database.

## ✅ Method 1: Using the Import Script (Recommended)

### Step 1: Copy your SQL dump to the database folder

Save your SQL dump file as `custom-query.sql` in the `/database` folder, or use any filename you prefer.

### Step 2: Run the import command

```bash
cd database

# Import custom-query.sql (default)
npm run import

# Or import a specific file
npm run import custom-query.sql
npm run import my-dump.sql
```

The importer will:
- ✅ Handle multiple SQL statements automatically
- ✅ Clean up MySQL dump directives
- ✅ Show progress for each table
- ✅ Skip errors for existing tables
- ✅ Give you a summary report

## 📝 Method 2: Paste into custom-query.sql

I've created a file specifically for this: [database/custom-query.sql](database/custom-query.sql)

**Steps:**

1. Open `database/custom-query.sql`
2. Paste your entire SQL dump (replace the example content)
3. Run:
   ```bash
   cd database
   npm run import
   ```

## 🎯 Method 3: Create a New File

```bash
cd database

# Save your SQL dump as a new file
# Then import it
npm run import your-dump-file.sql
```

## 🔄 Quick Workflow

### Reset and Import Fresh Schema

```bash
cd database

# 1. Drop all existing tables
npm run reset

# 2. Import your SQL dump
npm run import custom-query.sql

# 3. Verify it worked
npm run query -- "SHOW TABLES"
npm run query -- "SELECT * FROM authentication"
```

## 💡 Example: Import the db_ver4.sql you showed me

```bash
cd database

# Copy your file
# (Copy db_ver4.sql from Downloads to /database folder)

# Import it
npm run import db_ver4.sql

# Or if you want to use custom-query.sql:
# 1. Open custom-query.sql
# 2. Paste your entire SQL dump
# 3. Save
# 4. Run:
npm run import
```

## 📊 What the Importer Handles

The import script automatically processes:
- ✅ `/*!40101 ... */` MySQL directives
- ✅ Multi-line comments `/* ... */`
- ✅ Single-line comments `-- ...`
- ✅ `LOCK TABLES` / `UNLOCK TABLES`
- ✅ Multiple `INSERT` statements
- ✅ `CREATE TABLE` statements
- ✅ `DROP TABLE` statements
- ✅ Foreign key constraints

## 🎨 Output Example

```
📥 SQL Dump Importer

📄 Reading: custom-query.sql

✅ Database connection successful!
📊 Connected to: railway @ turntable.proxy.rlwy.net:56189
🔄 Processing SQL statements...

📊 Found 25 SQL statement(s) to execute

   ⏳ Dropping table: authentication... ✅
   ⏳ Creating table: authentication... ✅
   ⏳ Inserting into: authentication... ✅
   ⏳ Creating table: address... ✅
   ⏳ Inserting into: address... ✅
   ...

════════════════════════════════════════════════════════════
📊 Import Summary:
   ✅ Successful: 23
   ⚠️  Skipped: 2
   ❌ Errors: 0
════════════════════════════════════════════════════════════

✅ Import completed successfully!
```

## ⚠️ Tips

1. **Always backup** before importing (or reset first)
2. **Test with small files** first if you're unsure
3. **Check the summary** - it tells you what succeeded and what failed
4. **Use reset** to clear tables before importing:
   ```bash
   npm run reset && npm run import custom-query.sql
   ```

## 🚀 Quick Commands Reference

```bash
# Reset database
npm run reset

# Import SQL dump
npm run import custom-query.sql

# Verify tables
npm run query -- "SHOW TABLES"

# Check data
npm run query -- "SELECT * FROM customer"

# Interactive mode
npm run interactive
```

---

**Ready to import your SQL dump!** Just paste it into `custom-query.sql` and run `npm run import`!
