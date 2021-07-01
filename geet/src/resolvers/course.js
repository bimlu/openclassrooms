import { transformer } from '../utils/image-transform';
import { uploadToS3Bucket, deleteFromS3Bucket } from '../utils/s3-bucket';
import { assertAdmin } from './user';

const Query = {
  /**
   * Gets course by id or name
   *
   * @param {string} id
   * @param {string} name
   */
  getCourse: async (root, { id, name }, { Course }) => {
    if (!name && !id) {
      throw new Error('name or id is required params.');
    }

    if (name && id) {
      throw new Error('please pass only name or only id as a param');
    }

    const query = name ? { name: name } : { _id: id };

    const course = await Course.findOne(query)
      .populate('programme')
      .populate('college')
      .populate('createdBy')
      .populate('posts')
      .populate('students');

    if (!course) {
      throw new Error("Course with given params doesn't exits.");
    }

    return course;
  },
  /**
   * Gets all courses
   *
   * @param {int} skip how many courses to skip
   * @param {int} limit how many courses to limit
   */
  getCourses: async (root, { skip, limit }, { Course }) => {
    const query = {};

    const courseCount = await Course.where(query).countDocuments();
    const allCourses = await Course.find(query)
      .populate('programme')
      .populate('college')
      .populate('posts')
      .skip(skip)
      .limit(limit)
      .sort({ postsCount: 'desc' })
      .sort({ createdAt: -1 });

    return { courses: allCourses, count: courseCount };
  },
  /**
   * Gets courses of a specific programme of a specific college
   * college > programme > courses
   *
   * @param {string} collegeId
   * @param {string} programmeId
   * @param {int} skip how many courses to skip
   * @param {int} limit how many courses to limit
   */
  getCollegeProgrammeCourses: async (root, { collegeId, programmeId, skip, limit }, { Course }) => {
    if (!collegeId || !programmeId) {
      throw new Error('collegeId and programmeId are required params.');
    }

    const query = { $and: [{ college: collegeId }, { programme: programmeId }] };

    const count = await Course.find(query).countDocuments();
    const courses = await Course.find(query)
      .populate('students')
      .populate('posts')
      .skip(skip)
      .limit(limit)
      .sort({ postsCount: 'desc' })
      .sort({ createdAt: -1 });

    return { courses, count };
  },
};

const Mutation = {
  /**
   * Creates a new course
   *
   * @param {string} name
   * @param {string} description
   * @param {string} collegeId
   * @param {string} programmeId
   */
  createCourse: async (
    root,
    { input: { name, fullName, term, createdBy, description, image, collegeId, programmeId } },
    { Course, Programme, authUser }
  ) => {
    if (!name || !fullName || !createdBy || !collegeId || !programmeId) {
      throw new Error('name, fullName, createdBy, collegeId, programmeId params are required.');
    }

    assertAdmin(authUser);

    let imageUrl, imagePublicId;

    if (image) {
      // // upload to cloudinary
      // const { createReadStream } = await image;
      // const stream = createReadStream();
      // const uploadImage = await uploadToCloudinary(stream, 'course', transformer({ width: 420 }));

      // if (!uploadImage.secure_url) {
      //   throw new Error('Something went wrong while uploading image to Cloudinary');
      // }

      // imageUrl = uploadImage.secure_url;
      // imagePublicId = uploadImage.public_id;

      // upload to s3 bucket
      const { createReadStream } = await image;
      const stream = createReadStream();
      let uploadImage;

      try {
        uploadImage = await uploadToS3Bucket(stream, 'course', transformer({ width: 420 }));
      } catch (err) {
        throw new Error('Something went wrong while uploading image to s3 bucket');
      }

      imageUrl = uploadImage.Location;
      imagePublicId = uploadImage.Key;
    }

    // create new course in database and return it
    const newCourse = await new Course({
      name,
      fullName,
      term,
      createdBy,
      description,
      image: imageUrl,
      imagePublicId,
      college: collegeId,
      programme: programmeId,
    }).save();

    await Programme.findOneAndUpdate(
      { _id: programmeId },
      { $push: { courses: newCourse.id }, $inc: { coursesCount: 1 } }
    );

    return newCourse;
  },
  /**
   * Deletes a course
   * @param {string} id is the ID of course to delete
   * @param {string} imagePublicId
   */
  /**
   * Updates a new college
   *
   * @param {string} name
   * @param {string} description
   */
  updateCourse: async (
    root,
    { input: { id, name, fullName, term, updatedBy, description, image } },
    { Course, authUser }
  ) => {
    if (!id || !updatedBy) {
      throw new Error('id, updatedBy params are required.');
    }

    assertAdmin(authUser);

    let imageUrl, imagePublicId;

    if (image) {
      // upload to s3 bucket
      const { createReadStream, filename, mimetype } = await image;
      const stream = createReadStream();
      let uploadImage;

      try {
        uploadImage = await uploadToS3Bucket(stream, 'course', transformer({ width: 420 }));
      } catch (err) {
        throw new Error('Something went wrong while uploading image to s3 bucket');
      }

      imageUrl = uploadImage.Location;
      imagePublicId = uploadImage.Key;
    } else {
      const oldCourse = await Course.findOne({ _id: id });
      imageUrl = oldCourse.image;
      imagePublicId = oldCourse.imagePublicId;
    }

    const course = await Course.findOneAndUpdate(
      { _id: id },
      {
        name,
        fullName,
        term,
        updatedBy,
        description,
        image: imageUrl,
        imagePublicId,
      }
    );

    return course;
  },
  deleteCourse: async (root, { input: { id, imagePublicId } }, { Course, Programme, User, Post, authUser }) => {
    if (!id) {
      throw new Error('id param is required.');
    }

    assertAdmin(authUser);

    // only allow deletion if there are no collection refrencing this course
    const cannotDelete = (await Post.findOne({ course: id })) || (await User.findOne({ course: id }));

    if (cannotDelete) {
      throw new Error('Cannot delete a course that has reference in other collection');
    }

    // // Remove course image from cloudinary, if imagePublicId is present
    // if (imagePublicId) {
    //   const deleteImage = await deleteFromCloudinary(imagePublicId);

    //   if (deleteImage.result !== 'ok') {
    //     throw new Error('Something went wrong while deleting image from Cloudinary');
    //   }
    // }

    // Remove programme image from s3, if imagePublicId is present
    if (imagePublicId) {
      try {
        await deleteFromS3Bucket(imagePublicId);
      } catch (err) {
        throw new Error('Something went wrong while deleting image from s3 bucket');
      }
    }

    const course = await Course.findByIdAndRemove(id).populate('programme');

    await Programme.findOneAndUpdate(
      { _id: course.programme.id },
      { $pull: { courses: course.id }, $inc: { coursesCount: -1 } }
    );

    return course;
  },
  /**
   * Toggles verification of a Course
   * @param {string} id is the ID of course to verify/unverify
   */
  toggleCourseVerification: async (root, { id }, { Course, authUser }) => {
    if (!id) {
      throw new Error('id param is required.');
    }

    assertAdmin(authUser);

    const course = await Course.findById(id);

    const updatedCourse = await Course.findOneAndUpdate({ _id: id }, { verified: !course.verified });
    return updatedCourse;
  },
};

export default { Query, Mutation };
