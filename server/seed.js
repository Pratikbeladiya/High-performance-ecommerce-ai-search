import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import { initialProducts } from '../src/data/products.js';

dotenv.config();

const importData = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI is missing in .env file');
      process.exit(1);
    }
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding');

    await Product.deleteMany();
    await Product.insertMany(initialProducts);

    console.log('Data Imported successfully');
    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

importData();
