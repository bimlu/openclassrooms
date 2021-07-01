import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * College schema
 */
const collegeSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    description: String,
    image: String,
    imagePublicId: String,
    verified: Boolean,
    programmes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Programme',
      },
    ],
    programmesCount: {
      type: Number,
      default: 0,
    },
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    studentsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('College', collegeSchema);
