import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'node:dns';
import { Category } from '../models/Category.js';
import { Book } from '../models/Book.js';
import { User } from '../models/User.js';
import { initialCategories, initialBooks } from '../utils/seedData.js';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore fallback errors
}

dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pandora_bookstore';

const seedDatabase = async () => {
  try {
    console.log(`[Seed Script] Connecting to MongoDB: ${uri}`);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    console.log('[Seed Script] Connected successfully.');

    // Upsert Categories
    const categoryMap = {};
    for (const catData of initialCategories) {
      const cat = await Category.findOneAndUpdate(
        { slug: catData.slug },
        catData,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      categoryMap[cat.slug] = cat._id;
      console.log(`[Seed Script] Category ready: ${cat.name} (${cat._id})`);
    }

    // Upsert Books
    for (const bookData of initialBooks) {
      const categoryId = categoryMap[bookData.categorySlug];
      if (!categoryId) {
        console.warn(`[Seed Script] Warning: No category found for ${bookData.title}`);
        continue;
      }

      const { categorySlug, ...rest } = bookData;
      await Book.findOneAndUpdate(
        { title: bookData.title },
        { ...rest, categoryId },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log(`[Seed Script] Book ready: "${bookData.title}" by ${bookData.author}`);
    }

    // Upsert Demo Users
    const adminPasswordHash = await User.hashPassword('Admin@123');
    await User.findOneAndUpdate(
      { email: 'admin@brivon.com' },
      {
        name: 'Brivon Admin Desk',
        email: 'admin@brivon.com',
        passwordHash: adminPasswordHash,
        role: 'admin',
        phone: '+91 98765 43210',
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    const adminUser = await User.findOneAndUpdate(
      { email: 'admin@pagehaven.com' },
      {
        name: 'Brivon Admin Desk',
        email: 'admin@pagehaven.com',
        passwordHash: adminPasswordHash,
        role: 'admin',
        phone: '+91 98765 43210',
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    await User.findOneAndUpdate(
      { email: 'admin@pandora.com' },
      {
        name: 'Brivon Admin Desk',
        email: 'admin@pandora.com',
        passwordHash: adminPasswordHash,
        role: 'admin',
        phone: '+91 98765 43210',
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`[Seed Script] Admin account ready: ${adminUser.email} & admin@brivon.com (Role: ${adminUser.role})`);

    const customerPasswordHash = await User.hashPassword('Reader@123');
    await User.findOneAndUpdate(
      { email: 'collector@brivon.com' },
      {
        name: 'Jyoti Sharma',
        email: 'collector@brivon.com',
        passwordHash: customerPasswordHash,
        role: 'customer',
        phone: '+91 98123 45678',
        addresses: [
          {
            fullName: 'Jyoti Sharma',
            phone: '+91 98123 45678',
            street: '42 Brivon Design Studio, Hauz Khas',
            city: 'New Delhi',
            state: 'Delhi',
            postalCode: '110016',
            isDefault: true,
          },
        ],
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    const customerUser = await User.findOneAndUpdate(
      { email: 'reader@pagehaven.com' },
      {
        name: 'Jyoti Sharma',
        email: 'reader@pagehaven.com',
        passwordHash: customerPasswordHash,
        role: 'customer',
        phone: '+91 98765 12345',
        addresses: [
          {
            fullName: 'Jyoti Sharma',
            phone: '+91 98765 12345',
            street: '12 Sunrise Boulevard, Suite 404',
            city: 'Bengaluru',
            state: 'Karnataka',
            postalCode: '560034',
            isDefault: true,
          },
        ],
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    await User.findOneAndUpdate(
      { email: 'reader@pandora.com' },
      {
        name: 'Jyoti Sharma',
        email: 'reader@pandora.com',
        passwordHash: customerPasswordHash,
        role: 'customer',
        phone: '+91 98765 12345',
        addresses: [
          {
            fullName: 'Jyoti Sharma',
            phone: '+91 98765 12345',
            street: '12 Sunrise Boulevard, Suite 404',
            city: 'Bengaluru',
            state: 'Karnataka',
            postalCode: '560034',
            isDefault: true,
          },
        ],
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`[Seed Script] Demo Customer account ready: ${customerUser.email} (Role: ${customerUser.role})`);

    console.log('[Seed Script] Database seeding completed successfully!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error(`[Seed Script Error] Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
