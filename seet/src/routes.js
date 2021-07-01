/**
 * Main App routes
 */
export const HOME = '/';

export const AUTH = '/auth';

export const LOG_IN = '/auth'; // for backward compatibility

export const EXPLORE = '/explore';

export const PEOPLE = '/students';

export const NOTIFICATIONS = '/notifications';

export const USER_PROFILE = '/:id';

export const MESSAGES = '/messages/:userId';

/**
 * College App
 */
export const COLLEGES = '/colleges';

export const PROGRAMMES = '/programmes';

export const COURSES = '/courses';

export const POSTS = '/posts';

export const COLLEGE = '/college/:id';

export const PROGRAMME = '/programme/:id';

export const COURSE = '/course/:id';

export const POST = '/post/:id/:type'; // type='image' or 'pdf'

export const CREATE_COLLEGE = '/create/college';

export const CREATE_PROGRAMME = '/create/programme';

export const CREATE_COURSE = '/create/course';

export const CREATE_POST = '/create/post';

/**
 * About pages
 */
export const PRIVACY_POLICY = '/privacy-policy';

export const TERMS_AND_CONDITIONS = '/terms-and-conditions';

export const DISCLAIMER = '/disclaimer';

export const ABOUT_US = '/about-us';

export const CONTACT_US = '/contact-us';

/**
 * Value that's used in place of id when creating something new.
 */
export const NEW_ID_VALUE = 'new';
