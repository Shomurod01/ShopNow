const mongoose = require('mongoose');
const slugify = require('slugify');

// sub-schema for reviews
const ratingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Toys', 'Other'],
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        alt: {
          type: String,
          default: '',
        },
      },
    ],
    ratings: [ratingSchema],
    averageRating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// auto-generate a slug from the product name
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

// recalculate average rating after adding reviews
productSchema.methods.calcAverageRating = function () {
  if (this.ratings.length === 0) {
    this.averageRating = 0;
    this.numReviews = 0;
    return;
  }

  const sum = this.ratings.reduce((acc, r) => acc + r.rating, 0);
  this.averageRating = Math.round((sum / this.ratings.length) * 10) / 10;
  this.numReviews = this.ratings.length;
};

module.exports = mongoose.model('Product', productSchema);
