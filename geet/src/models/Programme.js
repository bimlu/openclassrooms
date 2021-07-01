import mongoose from 'mongoose';

import { TermType, Degree } from '../constants/types';

const Schema = mongoose.Schema;

/**
 * Programme schema that has references to College schema
 */
const programmeSchema = Schema(
  {
    degree: {
      type: Degree,
      required: true,
      default: Degree.Bachelor,
    },
    termType: {
      type: TermType,
      required: true,
      default: TermType.Semester,
    },
    termsCount: {
      type: Number,
      required: true,
      default: 6,
    },
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
    college: {
      type: Schema.Types.ObjectId,
      ref: 'College',
    },
    courses: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],
    coursesCount: {
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

export default mongoose.model('Programme', programmeSchema);
