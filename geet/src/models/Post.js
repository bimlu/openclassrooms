import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * Post schema that has references to Assignment, User, Like and Comment schemas
 */
const postSchema = Schema(
  {
    title: String,
    pdf: String,
    pdfPublicId: String,
    images: [String],
    imagePublicIds: [String],
    thumbnail: String, // is just a ref to images[0]
    college: {
      type: Schema.Types.ObjectId,
      ref: 'College',
    },
    programme: {
      type: Schema.Types.ObjectId,
      ref: 'Programme',
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Like',
      },
    ],
    likesCount: {
      type: Number,
      default: 0,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    downloadsCount: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Post', postSchema);
