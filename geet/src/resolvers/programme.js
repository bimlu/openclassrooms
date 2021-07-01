import { transformer } from '../utils/image-transform';
import { uploadToS3Bucket, deleteFromS3Bucket } from '../utils/s3-bucket';
import { assertAdmin } from './user';

const Query = {
  /**
   * Gets programme by id or name
   *
   * @param {string} id
   * @param {string} name
   */
  getProgramme: async (root, { id, name }, { Programme }) => {
    if (!name && !id) {
      throw new Error('name or id is required params.');
    }

    if (name && id) {
      throw new Error('please pass only name or only id as a param');
    }

    const query = name ? { name: name } : { _id: id };

    const programme = await Programme.findOne(query)
      .populate('college')
      .populate('createdBy')
      .populate('courses')
      .populate('students');

    if (!programme) {
      throw new Error("Programme with given params doesn't exits.");
    }

    return programme;
  },
  /**
   * Gets all programmes
   *
   * @param {int} skip how many programmes to skip
   * @param {int} limit how many programmes to limit
   */
  getProgrammes: async (root, { skip, limit }, { Programme }) => {
    const query = {};

    const programmesCount = await Programme.find(query).countDocuments();
    const allProgrammes = await Programme.find(query)
      .populate('courses')
      .skip(skip)
      .limit(limit)
      .sort({ coursesCount: 'desc' })
      .sort({ createdAt: -1 });

    return { programmes: allProgrammes, count: programmesCount };
  },
  /**
   * Gets programmes of a specific college
   * college > programmes
   *
   * @param {string} collegeId
   * @param {int} skip how many programmes to skip
   * @param {int} limit how many programmes to limit
   */
  getCollegeProgrammes: async (root, { collegeId, skip, limit }, { Programme }) => {
    if (!collegeId) {
      throw new Error('collegeId param is required');
    }

    const query = { college: collegeId };

    const count = await Programme.find(query).countDocuments();
    const programmes = await Programme.find(query)
      .populate('courses')
      .populate('students')
      .skip(skip)
      .limit(limit)
      .sort({ coursesCount: 'desc' })
      .sort({ createdAt: -1 });

    return { programmes, count };
  },
};

const Mutation = {
  /**
   * Creates a new programme
   *
   * @param {string} name
   * @param {string} description
   * @param {string} collegeId
   */
  createProgramme: async (
    root,
    { input: { name, fullName, createdBy, description, image, collegeId, degree, termType, termsCount } },
    { Programme, College, authUser }
  ) => {
    if (!name || !fullName || !createdBy || !collegeId) {
      throw new Error('name, fullName, createdBy, collegeId params are required.');
    }

    assertAdmin(authUser);

    let imageUrl, imagePublicId;

    if (image) {
      // // upload to cloudinary
      // const { createReadStream } = await image;
      // const stream = createReadStream();
      // const uploadImage = await uploadToCloudinary(stream, 'programme', transformer({ width: 420 }));

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
        uploadImage = await uploadToS3Bucket(stream, 'programme', transformer({ width: 420 }));
      } catch (err) {
        throw new Error('Something went wrong while uploading image to s3 bucket');
      }

      imageUrl = uploadImage.Location;
      imagePublicId = uploadImage.Key;
    }

    // create new programme in database and return it
    const newProgramme = await new Programme({
      name,
      fullName,
      createdBy,
      description,
      image: imageUrl,
      imagePublicId,
      college: collegeId,
      degree,
      termType,
      termsCount,
    }).save();

    await College.findOneAndUpdate(
      { _id: collegeId },
      { $push: { programmes: newProgramme.id }, $inc: { programmesCount: 1 } }
    );

    return newProgramme;
  },
  /**
   * Updates a new programme
   *
   * @param {string} name
   * @param {string} description
   */
  updateProgramme: async (
    root,
    { input: { id, name, fullName, updatedBy, description, image, degree, termType, termsCount } },
    { Programme, authUser }
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
        uploadImage = await uploadToS3Bucket(stream, 'programme', transformer({ width: 420 }));
      } catch (err) {
        throw new Error('Something went wrong while uploading image to s3 bucket');
      }

      imageUrl = uploadImage.Location;
      imagePublicId = uploadImage.Key;
    } else {
      const oldProgramme = await Programme.findOne({ _id: id });
      imageUrl = oldProgramme.image;
      imagePublicId = oldProgramme.imagePublicId;
    }

    const programme = await Programme.findOneAndUpdate(
      { _id: id },
      {
        name,
        fullName,
        updatedBy,
        description,
        image: imageUrl,
        imagePublicId,
        degree,
        termType,
        termsCount,
      }
    );

    return programme;
  },
  /**
   * Deletes a programme
   * @param {string} id is the ID of programme to delete
   * @param {string} imagePublicId
   */
  deleteProgramme: async (
    root,
    { input: { id, imagePublicId } },
    { Programme, College, Course, User, Post, authUser }
  ) => {
    if (!id) {
      throw new Error('id param is required.');
    }

    assertAdmin(authUser);

    // only allow deletion if there are no collection refrencing this programme
    const cannotDelete =
      (await Course.findOne({ programme: id })) ||
      (await Post.findOne({ programme: id })) ||
      (await User.findOne({ programme: id }));

    if (cannotDelete) {
      throw new Error('Cannot delete a programme that has reference in other collection');
    }

    // // Remove programme image from cloudinary, if imagePublicId is present
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

    const programme = await Programme.findByIdAndRemove(id).populate('college');

    await College.findOneAndUpdate(
      { _id: programme.college.id },
      { $pull: { programmes: programme.id }, $inc: { programmesCount: -1 } }
    );

    return programme;
  },
  /**
   * Toggles verification of a Programme
   * @param {string} id is the ID of programme to verify/unverify
   */
  toggleProgrammeVerification: async (root, { id }, { Programme, authUser }) => {
    if (!id) {
      throw new Error('id param is required.');
    }

    assertAdmin(authUser);

    const programme = await Programme.findById(id);

    const updatedProgramme = await Programme.findOneAndUpdate({ _id: id }, { verified: !programme.verified });
    return updatedProgramme;
  },
};

export default { Query, Mutation };
