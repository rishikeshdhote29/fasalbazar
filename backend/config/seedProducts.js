const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const Product = require("../models/Product"); // adjust path

mongoose.connect("mongodb://localhost:27017/fasalbazar")
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
