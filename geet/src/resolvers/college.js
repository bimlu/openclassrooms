import { transformer } from '../utils/image-transform';
import { uploadToS3Bucket, deleteFromS3Bucket } from '../utils/s3-bucket';
import { assertAdmin } from './user';

const Query = {
  /**
   * Gets college by id or name
   *
   * @param {string} id
   * @param {string} name
   */
  getCollege: async (root, { id, name }, { College }) => {
    if (!name && !id) {
      throw new Error('name or id is required params.');
    }

    if (name && id) {
      throw new Error('please pass only name or only id as a param');
    }

    const query = name ? { name: name } : { _id: id };

    const college = await College.findOne(query).populate('createdBy').populate('programmes').populate('students');

    if (!college) {
      throw new Error("College with given params doesn't exits.");
    }

    return college;
  },
  /**
   * Gets all colleges
   *
   * @param {int} skip how many colleges to skip
   * @param {int} limit how many colleges to limit
   */
  getColleges: async (root, { skip, limit }, { College }) => {
    const query = {};

    const collegesCount = await College.find(query).countDocuments();
    const allColleges = await College.find(query)
      .populate({
        path: 'programmes',
        populate: [{ path: 'courses', options: { skip, limit, sort: { postsCount: 'desc' } } }],
        options: { sort: { coursesCount: 'desc' }, skip, limit },
      })
      .populate('students')
      .skip(skip)
      .limit(limit)
      .sort({ programmesCount: 'desc' })
      .sort({ createdAt: -1 });

    return { colleges: allColleges, count: collegesCount };
  },
};

const Mutation = {
  /**
   * Creates a new college
   *
   * @param {string} name
   * @param {string} description
   */
  createCollege: async (root, { input: { name, fullName, createdBy, description, image } }, { College, authUser }) => {
    if (!name || !fullName || !createdBy) {
      throw new Error('name, fullName, createdBy params are required.');
    }

    assertAdmin(authUser);

    let imageUrl, imagePublicId;

    if (image) {
      // // upload to cloudinary
      // const { createReadStream } = await image;
      // const stream = createReadStream();
      // const uploadImage = await uploadToCloudinary(stream, 'college', transformer({ width: 420 }));

      // if (!uploadImage.secure_url) {
      //   throw new Error('Something went wrong while uploading image to Cloudinary');
      // }

      // imageUrl = uploadImage.secure_url;
      // imagePublicId = uploadImage.public_id;

      // upload to s3 bucket
      const { createReadStream, filename, mimetype } = await image;
      const stream = createReadStream();
      let uploadImage;

      try {
        uploadImage = await uploadToS3Bucket(stream, 'college', transformer({ width: 420 }));
      } catch (err) {
        throw new Error('Something went wrong while uploading image to s3 bucket');
      }

      imageUrl = uploadImage.Location;
      imagePublicId = uploadImage.Key;
    }

    // create new college in database and return it
    const newCollege = await new College({
      name,
      fullName,
      createdBy,
      description,
      image: imageUrl,
      imagePublicId,
    }).save();

    return newCollege;
  },
  /**
   * Updates a new college
   *
   * @param {string} name
   * @param {string} description
   */
  updateCollege: async (
    root,
    { input: { id, name, fullName, updatedBy, description, image } },
    { College, authUser }
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
        uploadImage = await uploadToS3Bucket(stream, 'college', transformer({ width: 420 }));
      } catch (err) {
        throw new Error('Something went wrong while uploading image to s3 bucket');
      }

      imageUrl = uploadImage.Location;
      imagePublicId = uploadImage.Key;
    } else {
      const oldCollege = await College.findOne({ _id: id });
      imageUrl = oldCollege.image;
      imagePublicId = oldCollege.imagePublicId;
    }

    const college = await College.findOneAndUpdate(
      { _id: id },
      {
        name,
        fullName,
        updatedBy,
        description,
        image: imageUrl,
        imagePublicId,
      }
    );

    return college;
  },
  /**
   * Deletes a college
   * @param {string} id is the ID of college to delete
   * @param {string} imagePublicId
   */
  deleteCollege: async (
    root,
    { input: { id, imagePublicId } },
    { College, Programme, Course, User, Post, authUser }
  ) => {
    if (!id) {
      throw new Error('id param is required.');
    }

    assertAdmin(authUser);

    // only allow deletion if there are no collection refrencing this college
    const cannotDelete =
      (await Programme.findOne({ college: id })) ||
      (await Course.findOne({ college: id })) ||
      (await Post.findOne({ college: id })) ||
      (await User.findOne({ college: id }));

    if (cannotDelete) {
      throw new Error('Cannot delete a college that has reference in other collection');
    }

    // // Remove college image from cloudinary, if imagePublicId is present
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

    const college = await College.findByIdAndRemove(id);

    return college;
  },
  /**
   * Toggles verification of a College
   * @param {string} id is the ID of college to verify/unverify
   */
  toggleCollegeVerification: async (root, { id }, { College, authUser }) => {
    if (!id) {
      throw new Error('id param is required.');
    }

    assertAdmin(authUser);

    const college = await College.findById(id);

    const updatedCollege = await College.findOneAndUpdate({ _id: id }, { verified: !college.verified });
    return updatedCollege;
  },
};

export default { Query, Mutation };
