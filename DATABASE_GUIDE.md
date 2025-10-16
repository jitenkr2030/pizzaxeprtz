# 🗄️ PizzaXperts Database Complete Guide

## 📋 Database Overview

Your PizzaXperts application uses **SQLite** as the database with **Prisma ORM** for efficient data management.

### **Database Configuration:**
- **Database Type**: SQLite
- **Database File**: `/db/custom.db`
- **ORM**: Prisma
- **Schema File**: `/prisma/schema.prisma`
- **Database Client**: `@prisma/client`

---

## 🏗️ Database Structure

### **Core Entity Relationships:**

```
User (Customers, Staff, Admin)
├── Address (delivery addresses)
├── Orders (pizza orders)
├── Reviews (order feedback)
├── Payments (transaction records)
├── LoyaltyPoints (reward system)
└── StoreStaff (staff management)

Store (Restaurant locations)
├── MenuItems (food items)
├── Categories (food categories)
├── Orders (restaurant orders)
├── Inventory (stock management)
├── Promotions (discount offers)
└── Staff (employees)

Order (Customer orders)
├── OrderItems (individual items)
├── Payments (payment processing)
├── Reviews (customer feedback)
└── DeliveryOrder (delivery tracking)
```

### **Key Database Tables:**

#### **1. Users Table (`users`)**
- **Purpose**: Stores all user information
- **Roles**: CUSTOMER, STAFF, MANAGER, ADMIN, DELIVERY_PARTNER
- **Key Fields**: email, name, phone, role, isActive

#### **2. Stores Table (`stores`)**
- **Purpose**: Restaurant location information
- **Key Fields**: name, address, phone, deliveryRadius, operatingHours

#### **3. MenuItems Table (`menu_items`)**
- **Purpose**: Food items available for order
- **Key Fields**: name, price, category, preparationTime, dietary info

#### **4. Orders Table (`orders`)**
- **Purpose**: Customer order records
- **Status**: PENDING, ACCEPTED, PREPARING, READY_FOR_PICKUP, OUT_FOR_DELIVERY, DELIVERED, CANCELLED
- **Key Fields**: orderNumber, status, totalAmount, paymentStatus

#### **5. OrderItems Table (`order_items`)**
- **Purpose**: Individual items within each order
- **Key Fields**: quantity, unitPrice, totalPrice, customizations

---

## 🔍 How to View Database Data

### **Method 1: Using Prisma Studio (Recommended)**

#### **Step 1: Open Prisma Studio**
```bash
# Navigate to your project directory
cd /path/to/pizzaxeprtz

# Open Prisma Studio
npx prisma studio
```

#### **Step 2: Access the Interface**
- **URL**: http://localhost:5555
- **Interface**: Visual database browser
- **Features**: View, create, edit, delete records

#### **Step 3: Browse Data**
- **Tables**: Click on any table to view its data
- **Filter**: Use search and filter options
- **Relations**: View related data across tables
- **Export**: Export data as CSV or JSON

### **Method 2: Using SQLite Command Line**

#### **Step 1: Install SQLite Browser (if not installed)**
```bash
# On Ubuntu/Debian
sudo apt-get install sqlite3

# On macOS
brew install sqlite

# On Windows
# Download from https://www.sqlite.org/download.html
```

#### **Step 2: Open Database**
```bash
# Navigate to database file
cd /path/to/pizzaxeprtz

# Open SQLite with your database
sqlite3 db/custom.db
```

#### **Step 3: Run SQL Queries**
```sql
-- View all tables
.tables

-- View users table structure
.schema users

-- View all users
SELECT * FROM users;

-- View recent orders
SELECT * FROM orders ORDER BY createdAt DESC LIMIT 10;

-- View menu items with categories
SELECT mi.*, c.name as category_name 
FROM menu_items mi 
JOIN categories c ON mi.categoryId = c.id;

-- View order statistics
SELECT status, COUNT(*) as count 
FROM orders 
GROUP BY status;
```

### **Method 3: Using Database Browser GUI**

#### **Recommended Tools:**
1. **DB Browser for SQLite** (Free, Cross-platform)
2. **SQLiteStudio** (Free, Cross-platform)
3. **DBeaver** (Free, Cross-platform)

#### **Using DB Browser for SQLite:**
1. **Download**: https://sqlitebrowser.org/
2. **Install**: Follow installation instructions
3. **Open Database**: File → Open Database → Select `db/custom.db`
4. **Browse Data**: Use the "Browse Data" tab
5. **Execute SQL**: Use the "Execute SQL" tab

### **Method 4: Using Prisma Queries in Code**

#### **Create a Data Viewer Script:**
```javascript
// scripts/view-data.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function viewData() {
  try {
    // View all users
    const users = await prisma.user.findMany();
    console.log('Users:', users);

    // View all stores
    const stores = await prisma.store.findMany();
    console.log('Stores:', stores);

    // View recent orders
    const orders = await prisma.order.findMany({
      include: {
        user: true,
        store: true,
        orderItems: {
          include: {
            menuItem: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });
    console.log('Recent Orders:', orders);

    // View menu items
    const menuItems = await prisma.menuItem.findMany({
      include: {
        category: true,
        store: true
      }
    });
    console.log('Menu Items:', menuItems);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

viewData();
```

#### **Run the script:**
```bash
node scripts/view-data.js
```

---

## 📊 Common Data Views

### **1. User Management Data**
```sql
-- View all users with their roles
SELECT id, email, name, role, isActive, createdAt 
FROM users 
ORDER BY createdAt DESC;

-- View user statistics by role
SELECT role, COUNT(*) as user_count 
FROM users 
GROUP BY role;

-- View active vs inactive users
SELECT isActive, COUNT(*) as count 
FROM users 
GROUP BY isActive;
```

### **2. Order Management Data**
```sql
-- View all orders with status
SELECT o.orderNumber, o.status, o.totalAmount, u.name as customer_name, s.name as store_name
FROM orders o
LEFT JOIN users u ON o.userId = u.id
LEFT JOIN stores s ON o.storeId = s.id
ORDER BY o.createdAt DESC;

-- View order statistics
SELECT status, COUNT(*) as order_count, SUM(totalAmount) as total_revenue
FROM orders
GROUP BY status;

-- View today's orders
SELECT * FROM orders 
WHERE DATE(createdAt) = DATE('now');
```

### **3. Menu & Inventory Data**
```sql
-- View all menu items with categories
SELECT mi.name, mi.price, mi.isActive, c.name as category, s.name as store
FROM menu_items mi
JOIN categories c ON mi.categoryId = c.id
JOIN stores s ON mi.storeId = s.id
ORDER BY mi.categoryId, mi.name;

-- View inventory levels
SELECT mi.name, ii.quantity, ii.unit, ii.lowStockThreshold
FROM inventory_items ii
JOIN menu_items mi ON ii.menuItemId = mi.id
WHERE ii.quantity < ii.lowStockThreshold;
```

### **4. Financial Data**
```sql
-- View payment methods usage
SELECT paymentMethod, COUNT(*) as count, SUM(amount) as total_amount
FROM payments
GROUP BY paymentMethod;

-- View daily revenue
SELECT DATE(createdAt) as date, SUM(totalAmount) as daily_revenue
FROM orders
GROUP BY DATE(createdAt)
ORDER BY date DESC;
```

---

## 🛠️ Database Management Commands

### **Prisma Commands:**
```bash
# Generate Prisma client
npx prisma generate

# View database schema
npx prisma db show

# Push schema changes to database
npx prisma db push

# Reset database (CAUTION: Deletes all data)
npx prisma db push --force-reset

# Seed database with sample data
npm run db:seed
```

### **SQLite Commands:**
```bash
# Open database
sqlite3 db/custom.db

# Backup database
sqlite3 db/custom.db ".backup db/backup.db"

# Export data to CSV
sqlite3 db/custom.db ".headers on" ".mode csv" ".output data.csv" "SELECT * FROM users"

# Import data from CSV
sqlite3 db/custom.db ".import data.csv users"
```

---

## 🔧 Database Configuration

### **Environment Variables:**
```env
DATABASE_URL=file:/home/z/my-project/db/custom.db
```

### **For Production:**
```env
DATABASE_URL=file:/var/www/pizzaxeprtz/db/custom.db
```

### **For Cloud Deployment:**
```env
DATABASE_URL=file:./db/custom.db
```

---

## 📈 Monitoring & Analytics

### **Database Health Checks:**
```javascript
// Check database connection
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connection successful');
    
    // Check table counts
    const userCount = await prisma.user.count();
    const orderCount = await prisma.order.count();
    const storeCount = await prisma.store.count();
    
    console.log(`📊 Database Stats:`);
    console.log(`   Users: ${userCount}`);
    console.log(`   Orders: ${orderCount}`);
    console.log(`   Stores: ${storeCount}`);
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
}

checkDatabase();
```

---

## 🎯 Best Practices

### **1. Data Backup:**
- Regular backup of `db/custom.db` file
- Use version control for schema changes
- Keep production and development data separate

### **2. Security:**
- Never commit database files with sensitive data
- Use environment variables for database configuration
- Implement proper user authentication and authorization

### **3. Performance:**
- Use Prisma query optimization
- Implement proper indexing
- Monitor query performance

### **4. Maintenance:**
- Regular database health checks
- Clean up old data periodically
- Update Prisma client regularly

---

## 🚀 Quick Start Guide

### **To View Your Data Right Now:**

#### **Option 1: Prisma Studio (Easiest)**
```bash
cd /path/to/pizzaxeprtz
npx prisma studio
```
Then open http://localhost:5555 in your browser.

#### **Option 2: SQLite Command Line**
```bash
cd /path/to/pizzaxeprtz
sqlite3 db/custom.db
```
Then run SQL commands like `.tables` or `SELECT * FROM users;`

#### **Option 3: GUI Tool**
1. Install DB Browser for SQLite
2. Open `db/custom.db` file
3. Browse data visually

---

**🎉 Your PizzaXperts database is ready for exploration!** Use any of these methods to view and manage your application data.