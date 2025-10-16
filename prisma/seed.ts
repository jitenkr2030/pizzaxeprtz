import { db } from "../src/lib/db"
import bcrypt from "bcryptjs"
import { convertUSDToINR } from "../src/lib/currency"

async function main() {
  console.log("Seeding database...")

  // Create demo user
  const hashedPassword = await bcrypt.hash("demo123", 12)
  
  const demoUser = await db.user.upsert({
    where: { email: "demo@pizzaxperts.com" },
    update: {},
    create: {
      email: "demo@pizzaxperts.com",
      name: "Demo User",
      password: hashedPassword,
      emailVerified: true,
    },
  })

  // Create demo store
  const demoStore = await db.store.create({
    data: {
      name: "Pizzaxperts Main Store",
      description: "Our flagship store with the best pizzas in town!",
      address: "123 Pizza Street, Food City, FC 12345",
      phone: "+91 98765 43210",
      email: "main@pizzaxperts.com",
      openingHours: JSON.stringify({
        monday: "11:00 AM - 10:00 PM",
        tuesday: "11:00 AM - 10:00 PM",
        wednesday: "11:00 AM - 10:00 PM",
        thursday: "11:00 AM - 10:00 PM",
        friday: "11:00 AM - 11:00 PM",
        saturday: "11:00 AM - 11:00 PM",
        sunday: "12:00 PM - 9:00 PM",
      }),
      deliveryRadius: 10.0,
      minOrderAmount: convertUSDToINR(15.0),
      deliveryFee: convertUSDToINR(2.99),
      taxRate: 0.18, // GST rate in India
    },
  })

  // Create categories
  const pizzaCategory = await db.category.create({
    data: {
      name: "Pizzas",
      description: "Our signature pizzas made with fresh ingredients",
      storeId: demoStore.id,
      displayOrder: 1,
    },
  })

  const sidesCategory = await db.category.create({
    data: {
      name: "Sides",
      description: "Delicious sides to complement your meal",
      storeId: demoStore.id,
      displayOrder: 2,
    },
  })

  const drinksCategory = await db.category.create({
    data: {
      name: "Drinks",
      description: "Refreshing beverages",
      storeId: demoStore.id,
      displayOrder: 3,
    },
  })

  // Create menu items
  const margheritaPizza = await db.menuItem.create({
    data: {
      name: "Margherita Classic",
      description: "Fresh mozzarella, tomato sauce, basil leaves",
      price: convertUSDToINR(12.99),
      isVegetarian: true,
      preparationTime: 15,
      categoryId: pizzaCategory.id,
      storeId: demoStore.id,
    },
  })

  const pepperoniPizza = await db.menuItem.create({
    data: {
      name: "Pepperoni Feast",
      description: "Double pepperoni, mozzarella cheese, tomato sauce",
      price: convertUSDToINR(15.99),
      preparationTime: 18,
      categoryId: pizzaCategory.id,
      storeId: demoStore.id,
    },
  })

  const veggiePizza = await db.menuItem.create({
    data: {
      name: "Veggie Supreme",
      description: "Bell peppers, mushrooms, onions, olives, tomatoes",
      price: convertUSDToINR(14.99),
      isVegetarian: true,
      isVegan: true,
      preparationTime: 20,
      categoryId: pizzaCategory.id,
      storeId: demoStore.id,
    },
  })

  const garlicBread = await db.menuItem.create({
    data: {
      name: "Garlic Bread",
      description: "Fresh baked bread with garlic butter and herbs",
      price: convertUSDToINR(6.99),
      isVegetarian: true,
      isVegan: true,
      preparationTime: 8,
      categoryId: sidesCategory.id,
      storeId: demoStore.id,
    },
  })

  // Create customizations
  await db.menuItemCustomization.createMany({
    data: [
      {
        name: "Large Size",
        type: "size",
        priceAdjustment: convertUSDToINR(3.00),
        menuItemId: margheritaPizza.id,
      },
      {
        name: "Extra Cheese",
        type: "extra",
        priceAdjustment: convertUSDToINR(2.00),
        menuItemId: margheritaPizza.id,
      },
      {
        name: "Large Size",
        type: "size",
        priceAdjustment: convertUSDToINR(3.00),
        menuItemId: pepperoniPizza.id,
      },
      {
        name: "Extra Pepperoni",
        type: "topping",
        priceAdjustment: convertUSDToINR(3.00),
        menuItemId: pepperoniPizza.id,
      },
    ],
  })

  // Create inventory items
  await db.inventoryItem.createMany({
    data: [
      {
        menuItemId: margheritaPizza.id,
        storeId: demoStore.id,
        quantity: 100,
        unit: "portions",
        lowStockThreshold: 20,
      },
      {
        menuItemId: pepperoniPizza.id,
        storeId: demoStore.id,
        quantity: 80,
        unit: "portions",
        lowStockThreshold: 15,
      },
      {
        menuItemId: veggiePizza.id,
        storeId: demoStore.id,
        quantity: 60,
        unit: "portions",
        lowStockThreshold: 10,
      },
      {
        menuItemId: garlicBread.id,
        storeId: demoStore.id,
        quantity: 150,
        unit: "pieces",
        lowStockThreshold: 30,
      },
    ],
  })

  // Create loyalty points for demo user
  await db.loyaltyPoint.create({
    data: {
      userId: demoUser.id,
      points: 100,
      description: "Welcome bonus",
    },
  })

  // Create a sample promotion
  await db.promotion.create({
    data: {
      name: "Welcome Discount",
      description: "10% off your first order",
      code: "WELCOME10",
      type: "percentage",
      value: 10.0,
      minOrderAmount: convertUSDToINR(20.0),
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      storeId: demoStore.id,
    },
  })

  console.log("Database seeded successfully!")
  console.log("Demo user credentials:")
  console.log("Email: demo@pizzaxperts.com")
  console.log("Password: demo123")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })