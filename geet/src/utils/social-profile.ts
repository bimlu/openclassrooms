import User from '../models/user';
import { v4 as uuid } from 'uuid';

export interface SocialProfile {
  id?: string;
  facebookId?: string;
  googleId?: string;
  githubId?: string;
  fullName?: string;
  username?: string;
  email?: string;
  about?: string;
  website?: string;
  image?: string;
  coverImage?: string;
}

export const getUserInfoFromFacebook = async (profile: any): Promise<SocialProfile> => {
  const user = {
    facebookId: profile.id,
    googleId: '',
    githubId: '',
    fullName: '',
    username: '',
    email: '',
    about: '',
    website: '',
    image: '',
    coverImage: '',
  };

  const firstName = profile.name && profile.name.givenName ? profile.name.givenName : '';
  const lastName = profile.name && profile.name.familyName ? profile.name.familyName : '';

  if (firstName && lastName) {
    user.fullName = `${firstName} ${lastName}`;
  } else if (firstName && !lastName) {
    user.fullName = firstName;
  } else if (lastName && !firstName) {
    user.fullName = lastName;
  } else if (profile.displayName) {
    user.fullName = profile.displayName;
  } else if (profile._json.name) {
    user.fullName = profile._json.name;
  }

  user.email =
    profile.emails && profile.emails.length > 0 && profile.emails[0].value !== undefined ? profile.emails[0].value : '';
  user.about = profile.about ? profile.about : '';
  user.website = profile.website ? profile.website : '';
  user.image =
    profile.photos && profile.photos.length > 0 && profile.photos[0].value !== undefined ? profile.photos[0].value : '';
  user.coverImage = profile._json.cover ? profile._json.cover.source : '';

  if (!profile.username) {
    user.username = user.email ? user.email.split('@')[0] : uuid();
  } else {
    const userNameExists = await User.findOne({ username: profile.username });
    user.username = !userNameExists ? profile.username : user.email ? user.email.split('@')[0] : uuid();
  }

  return user;
};

export const getUserInfoFromGoogle = async (profile: any): Promise<SocialProfile> => {
  const user = {
    googleId: profile.id,
    facebookId: '',
    githubId: '',
    fullName: '',
    username: '',
    email: '',
    about: '',
    website: '',
    image: '',
    coverImage: '',
  };

  const firstName = profile.name && profile.name.givenName ? profile.name.givenName : '';
  const lastName = profile.name && profile.name.familyName ? profile.name.familyName : '';

  if (firstName && lastName) {
    user.fullName = `${firstName} ${lastName}`;
  } else if (firstName && !lastName) {
    user.fullName = firstName;
  } else if (lastName && !firstName) {
    user.fullName = lastName;
  } else if (profile.displayName) {
    user.fullName = profile.displayName;
  } else if (profile.name) {
    user.fullName = profile.name;
  }

  user.email = (profile.emails && profile.emails.length > 0 && profile.emails[0].value) || '';
  user.about = profile.tagline ? profile.tagline : '';
  user.website = profile._json.urls && profile._json.urls.length > 0 ? profile._json.urls[0].value : '';
  user.image = (profile.photos && profile.photos.length > 0 && profile.photos[0].value) || '';
  user.coverImage =
    profile._json.cover && profile._json.cover.coverPhoto && profile._json.cover.coverPhoto.url
      ? profile._json.cover.coverPhoto.url
      : '';

  if (!profile.username) {
    user.username = user.email ? user.email.split('@')[0] : uuid();
  } else {
    const userNameExists = await User.findOne({ username: profile.username });
    user.username = !userNameExists ? profile.username : user.email ? user.email.split('@')[0] : uuid();
  }

  return user;
};

export const getUserInfoFromGithub = async (profile: any): Promise<SocialProfile> => {
  const user = {
    githubId: profile.id,
    facebookId: '',
    googleId: '',
    fullName: '',
    username: '',
    email: '',
    about: '',
    website: '',
    image: '',
    coverImage: '',
  };

  // const splitProfileUrl = profile.profileUrl.split('/');
  // const fallbackUsername = splitProfileUrl[splitProfileUrl.length - 1];

  user.fullName = profile.displayName || profile.username || profile._json.name || '';
  user.email = (profile.emails && profile.emails.length > 0 && profile.emails[0].value) || '';
  user.about = profile._json.bio || '';
  user.website = profile._json.blog || '';
  user.image = (profile._json.avatar_url && profile._json.avatar_url) || '';

  if (!profile.username) {
    user.username = user.email ? user.email.split('@')[0] : uuid();
  } else {
    const userNameExists = await User.findOne({ username: profile.username });
    user.username = !userNameExists ? profile.username : user.email ? user.email.split('@')[0] : uuid();
  }

  return user;
};