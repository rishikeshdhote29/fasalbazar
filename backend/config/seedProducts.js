const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const Product = require("../models/Product"); // adjust path

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error("MONGO_URI is not configured");
}

mongoose.connect(mongoUri, { dbName: "fasalbazar" })
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ Connection error:", err));

async function seedProducts() {
  try {
    const products = [];

    for (let i = 0; i < 100; i++) {
      products.push({
        name: faker.commerce.productName(),
        price: faker.commerce.price(50, 5000),
        description: faker.commerce.productDescription(),
        images: faker.image.url(),
        discount: faker.number.int({ min: 0, max: 80 }),
        isInactive: false,
        isAvailable: true,
        quantity: faker.number.int({ min: 1, max: 1000 }),
        unit: "piece",
        seller: "69f567e1d86953bcc2ab7f88", // your seller ID
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await Product.insertMany(products);
    console.log("✅ 100 demo products inserted successfully!");
  } catch (err) {
    console.error("❌ Error seeding products:", err);
  } finally {
    mongoose.connection.close();
  }
}

seedProducts();
