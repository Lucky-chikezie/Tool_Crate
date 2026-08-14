const mongoose = require('mongoose');

const toolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tool name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      lowercase: true,
    },
    link: {
      type: String,
      required: [true, 'Link is required'],
      trim: true,
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    upvoteCount: {
      type: Number,
      default: 0,
    },
    upvoters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

toolSchema.index({ createdAt: -1 });
toolSchema.index({ upvoteCount: -1 });
toolSchema.index({ name: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Tool', toolSchema);