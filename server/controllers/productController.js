const Product = require('../models/Product');
const path = require('path');
const fs = require('fs');


exports.getProducts = async (req, res, next) => {
  try {
    const { search, category, minPrice, maxPrice, featured } = req.query;
    const sort = req.query.sort || '-createdAt';
    const page = req.query.page || 1;
    const limit = req.query.limit || 12;


    const query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (category) {
      query.category = category;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    // price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    // run both queries at the same time
    const [products, total] = await Promise.all([
      Product.find(query).sort(sort).skip(skip).limit(limitNum),
      Product.countDocuments(query),
    ]);

    res.json({
      success: true,
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

// get a single product by id
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('ratings.user', 'name');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// create a new product (admin only)
exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, stock, featured } = req.body;

    // handle uploaded images
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(function (file) {
        return { url: '/uploads/' + file.filename, alt: name };
      });
    }

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      category,
      stock: Number(stock),
      featured: featured === 'true',
      images,
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// update an existing product (admin only)
exports.updateProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, stock, featured } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // only update fields that were provided
    if (name) product.name = name;
    if (description) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (category) product.category = category;
    if (stock !== undefined) product.stock = Number(stock);
    if (featured !== undefined) {
      product.featured = featured === 'true' || featured === true;
    }

    // append new images if any were uploaded
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(function (file) {
        return {
          url: '/uploads/' + file.filename,
          alt: name || product.name,
        };
      });
      product.images = [...product.images, ...newImages];
    }

    await product.save();
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// delete a product and its image files from disk
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // clean up image files from disk
    for (const img of product.images) {
      const filePath = path.join(__dirname, '../', img.url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await product.deleteOne();
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
};

// let a user add a review to a product
exports.addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // check if user already left a review
    const alreadyReviewed = product.ratings.find(function (r) {
      return r.user.toString() === req.user._id.toString();
    });

    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'Product already reviewed' });
    }

    product.ratings.push({
      user: req.user._id,
      rating: Number(rating),
      comment,
    });

    product.calcAverageRating();
    await product.save();

    res.status(201).json({ success: true, message: 'Review added' });
  } catch (error) {
    next(error);
  }
};
