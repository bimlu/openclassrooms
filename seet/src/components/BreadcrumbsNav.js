import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';

import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

import * as Routes from 'routes';
import { TermType } from 'constants/TermType';

const LinkRouter = (props) => <Link {...props} component={RouterLink} />;

const BreadcrumbsNav = () => {
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const collegeId = query.get('collegeId');
  const collegeName = query.get('collegeName');
  const programmeId = query.get('programmeId');
  const programmeName = query.get('programmeName');
  const termType = query.get('termType');
  const termsCount = query.get('termsCount');
  const courseId = query.get('courseId');
  const courseName = query.get('courseName');

  const [term, setTerm] = useState(query.get('term'));

  useEffect(() => {
    window.location.hash && setTerm(window.location.hash.slice(6)); // slice '#term=1'
  }, [window.location.hash]);

  let last;
  if (courseId) {
    last = 'course';
  } else if (!courseId && term) {
    last = 'term';
  } else if (!term && programmeId) {
    last = 'programme';
  } else if (!programmeId && collegeId) {
    last = 'college';
  }

  return (
    <Breadcrumbs separator={'›'} maxItems={3} itemsBeforeCollapse={1} itemsAfterCollapse={1} aria-label="breadcrumb">
      <LinkRouter color="inherit" to={Routes.COLLEGES}>
        Explore
      </LinkRouter>

      {collegeId &&
        (last === 'college' ? (
          <Typography color="textPrimary">{collegeName}</Typography>
        ) : (
          <LinkRouter color="inherit" to={`${Routes.PROGRAMMES}?collegeId=${collegeId}&collegeName=${collegeName}`}>
            {collegeName}
          </LinkRouter>
        ))}

      {programmeId &&
        (last === 'programme' ? (
          <Typography color="textPrimary">{programmeName}</Typography>
        ) : (
          <LinkRouter
            color="inherit"
            to={`${Routes.COURSES}?collegeId=${collegeId}&collegeName=${collegeName}&programmeId=${programmeId}&programmeName=${programmeName}&termType=${termType}&termsCount=${termsCount}#term=all`}
          >
            {programmeName}
          </LinkRouter>
        ))}

      {term &&
        term !== 'all' &&
        (last === 'term' ? (
          <Typography color="textPrimary">{`${TermType[termType]}-${term}`}</Typography>
        ) : (
          <LinkRouter
            color="inherit"
            to={`${Routes.COURSES}?collegeId=${collegeId}&collegeName=${collegeName}&programmeId=${programmeId}&programmeName=${programmeName}&termType=${termType}&termsCount=${termsCount}#term=${term}`}
          >
            {`${TermType[termType]}-${term}`}
          </LinkRouter>
        ))}

      {courseId &&
        (last === 'course' ? (
          <Typography color="textPrimary">{courseName}</Typography>
        ) : (
          <LinkRouter
            color="inherit"
            to={`${Routes.POSTS}?collegeId=${collegeId}&collegeName=${collegeName}&programmeId=${programmeId}&programmeName=${programmeName}&termType=${termType}&termsCount=${termsCount}&term=${term}&courseId=${courseId}&courseName=${courseName}`}
          >
            {courseName}
          </LinkRouter>
        ))}
    </Breadcrumbs>
  );
};

export default BreadcrumbsNav;
