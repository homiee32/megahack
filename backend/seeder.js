import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Simulation from './models/Simulation.js';
import Assessment from './models/Assessment.js';

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await Simulation.deleteMany();
    await Assessment.deleteMany();

    const createdUsers = await User.create([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        skillScore: 82,
        marketValueMin: 65000,
        marketValueMax: 80000,
        industryReadiness: 74
      }
    ]);

    const adminUser = createdUsers[0]._id;

    await Simulation.create([
      {
        title: 'Software Engineering II',
        subtitle: 'Ac. Year 2025-26',
        status: 'In Progress',
        instructor: 'Pankaj Patil',
        timeLeft: '12h',
        masteryLevel: 65,
        image: '/src/assets/simulation_se_ii.png',
        avatar: '/src/assets/react.svg'
      },
      {
        title: 'Analysis of Algorithms',
        subtitle: 'Batch A - Advanced',
        status: 'Completed',
        instructor: 'Dr. Nilesh Deotale',
        masteryLevel: 100,
        image: '/src/assets/simulation_algorithms.png',
        avatar: '/src/assets/react.svg'
      },
      {
        title: 'MDM & IoT Systems',
        subtitle: 'Advanced Workshop',
        status: 'Trending',
        instructor: 'Hiral Patel',
        timeLeft: '12h',
        masteryLevel: 42,
        image: '/src/assets/simulation_iot.png',
        avatar: '/src/assets/react.svg'
      }
    ]);

    await Assessment.create([
      {
        user: adminUser,
        title: 'React Fundamentals Assessment',
        score: 85,
        isCompleted: true,
        completedAt: Date.now()
      }
    ]);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

importData();
