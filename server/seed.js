const dotenv = require('dotenv')
dotenv.config()
const mongoose = require('mongoose')
const User = require('./models/User')
const Product = require('./models/Product')

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('connected to mongo')

    await User.deleteMany()
    await Product.deleteMany()
    console.log('cleared old data')

    await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    })

    await User.create({
      name: 'John Doe',
      email: 'user@example.com',
      password: 'user123',
      role: 'customer'
    })

    console.log('users done')

    const products = [
      {
        name: 'Wireless Noise-Cancelling Headphones',
        description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and exceptional sound quality. Perfect for travel and work-from-home.',
        price: 299.99,
        category: 'Electronics',
        stock: 45,
        featured: true,
        images: [{ url: '/uploads/headphones.png', alt: 'Headphones' }]
      },
      {
        name: 'Mechanical Gaming Keyboard',
        description: 'RGB mechanical keyboard with Cherry MX switches, programmable keys, and dedicated media controls.',
        price: 149.99,
        category: 'Electronics',
        stock: 30,
        featured: true,
        images: [{ url: '/uploads/keyboard.png', alt: 'Keyboard' }]
      },
      {
        name: 'Classic Fit Cotton T-Shirt',
        description: '100% organic cotton t-shirt. Soft, breathable, and durable. Available in multiple colors.',
        price: 29.99,
        category: 'Clothing',
        stock: 150,
        images: [{ url: '/uploads/tshirt.png', alt: 'T-Shirt' }]
      },
      {
        name: 'The Art of Clean Code',
        description: 'A guide to writing clean, maintainable code. Covers design patterns, refactoring, and best practices.',
        price: 39.99,
        category: 'Books',
        stock: 80,
        images: [{ url: '/uploads/book.png', alt: 'Book' }]
      },
      {
        name: 'Yoga Mat Premium',
        description: 'Eco-friendly non-slip yoga mat with alignment lines. 6mm thickness. Includes carrying strap.',
        price: 59.99,
        category: 'Sports',
        stock: 60,
        featured: true,
        images: [{ url: '/uploads/yogamat.png', alt: 'Yoga Mat' }]
      },
      {
        name: 'Smart LED Desk Lamp',
        description: 'Adjustable color temperature and brightness with USB charging port and touch controls.',
        price: 79.99,
        category: 'Home & Garden',
        stock: 40,
        images: [{ url: '/uploads/desklamp.png', alt: 'Desk Lamp' }]
      },
      {
        name: 'Portable Bluetooth Speaker',
        description: 'Waterproof IPX7 speaker with 360 sound and 24-hour battery. Great for outdoors.',
        price: 89.99,
        category: 'Electronics',
        stock: 55,
        images: [{ url: '/uploads/speaker.png', alt: 'Speaker' }]
      },
      {
        name: 'Running Shoes Pro',
        description: 'Lightweight running shoes with responsive foam cushioning and breathable mesh upper.',
        price: 119.99,
        category: 'Sports',
        stock: 70,
        images: [{ url: '/uploads/shoes.png', alt: 'Running Shoes' }]
      }
    ]

    for (const p of products) {
      await Product.create(p)
    }

    console.log(`${products.length} products created`)
    console.log('seed done!')
    console.log('admin: admin@example.com / admin123')
    console.log('user: user@example.com / user123')
    process.exit(0)
  } catch (err) {
    console.error('seed failed:', err)
    process.exit(1)
  }
}

seedData()
