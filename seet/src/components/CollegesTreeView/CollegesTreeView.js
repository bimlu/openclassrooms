import React, { useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import StyledTreeItem from './StyledTreeItem';
import Label from '@material-ui/icons/Label';
import AddIcon from '@material-ui/icons/Add';

import { CollegeIcon } from 'components/icons';
import { ProgrammeIcon } from 'components/icons';
import { CourseIcon } from 'components/icons';

import { TermType } from 'constants/TermType';
import { DegreeType } from 'constants/DegreeType';

import * as Routes from 'routes';
import { useStore } from 'store';
import { SET_COLLEGE_TREE } from 'store/collegeTree';

const useStyles = makeStyles((theme) => ({
  link: {
    color: theme.palette.primary.main,
  },
}));

// keep track of expanded nodes and save to store before this component unmounts
let expanded = ['allColleges', '605a4638198e3f5b2e715c8c']; // colleges and IGNOU

export default function CollegesTreeView({ selectedNodeValue, setSelectedNodeValue }) {
  const classes = useStyles();
  const [{ datatree, collegeTree }, dispatch] = useStore();

  useLayoutEffect(() => {
    return () => {
      dispatch({ type: SET_COLLEGE_TREE, payload: expanded });
    };
  }, []);

  if (!datatree.colleges) return '';

  const colleges = datatree.colleges;

  const [collegeId, programmeId, courseId] = selectedNodeValue.split('-');

  return (
    <TreeView
      defaultExpanded={collegeTree.defaultExpanded}
      defaultCollapseIcon={<ArrowDropDownIcon />}
      defaultExpandIcon={<ArrowRightIcon />}
      defaultEndIcon={<div style={{ width: 24 }} />}
      onNodeToggle={(_e, nodeIds) => (expanded = nodeIds)}
      onNodeSelect={(_e, value) => {
        setSelectedNodeValue(value);
      }}
    >
      <StyledTreeItem
        nodeId="allColleges"
        labelText="All Colleges"
        labelIcon={() => <Label fontSize="small" />}
        labelInfo={colleges.length === 0 ? '' : `${String(colleges.length)} Univ`}
        color="#1a73e8"
        bgColor="#e8f0fe"
      >
        {/* *************COLLEGE-LIST************* */}
        {colleges.map((college) => {
          const programmes = college.programmes;
          const degrees = Array.from(new Array(DegreeType.length)).map(() => []);
          programmes.forEach((programme) => degrees[programme.degree].push(programme));

          return (
            <StyledTreeItem
              key={college.id}
              nodeId={college.id}
              labelText={
                <Link
                  to={`${Routes.PROGRAMMES}?collegeId=${college.id}&collegeName=${college.name}`}
                  className={classes.link}
                >
                  {college.name}
                </Link>
              }
              labelIcon={() => <CollegeIcon width="20" />}
              labelInfo={programmes.length === 0 ? '' : `${String(programmes.length)} Prg`}
              color="#e3742f"
              bgColor="#fcefe3"
            >
              {/* **************DEGREE-LIST************* */}
              {degrees.map((degree, idx) => {
                return (
                  <StyledTreeItem
                    key={idx}
                    nodeId={`degree-${idx}`}
                    labelText={`${DegreeType[idx]}`}
                    labelInfo={degree.length === 0 ? '' : `${String(degree.length)} Prg`}
                  >
                    {/* ************PROGRAMME-LIST*********** */}
                    {degree.map((programme) => {
                      const courses = programme.courses;
                      const terms = Array.from(new Array(programme.termsCount)).map(() => []);
                      courses.forEach((course) => terms[course.term - 1].push(course));

                      return (
                        <StyledTreeItem
                          key={programme.id}
                          nodeId={`${college.id}-${programme.id}`}
                          labelText={
                            <Link
                              to={`${Routes.COURSES}?collegeId=${college.id}&collegeName=${college.name}&programmeId=${programme.id}&programmeName=${programme.name}&termType=${programme.termType}&termsCount=${programme.termsCount}#term=all`}
                              className={classes.link}
                            >
                              {programme.name}
                            </Link>
                          }
                          labelIcon={() => <ProgrammeIcon width="19" />}
                          labelInfo={courses.length === 0 ? '' : `${String(courses.length)} Crs`}
                          color="#a250f5"
                          bgColor="#f3e8fd"
                        >
                          {/* ************TERM-LIST************** */}
                          {terms.map((term, idx) => {
                            return (
                              <StyledTreeItem
                                key={idx}
                                nodeId={`term-${idx}`}
                                labelText={
                                  <Link
                                    to={`${Routes.COURSES}?collegeId=${college.id}&collegeName=${
                                      college.name
                                    }&programmeId=${programme.id}&programmeName=${programme.name}&termType=${
                                      programme.termType
                                    }&termsCount=${programme.termsCount}#term=${idx + 1}`}
                                    className={classes.link}
                                  >
                                    {`${TermType[programme.termType]}-${idx + 1}`}
                                  </Link>
                                }
                                labelInfo={term.length === 0 ? '' : `${String(term.length)} Crs`}
                              >
                                {/* *************COURSE-LIST************* */}
                                {term.map((course) => {
                                  return (
                                    <StyledTreeItem
                                      key={course.id}
                                      nodeId={`${college.id}-${programme.id}-${course.id}`}
                                      labelText={
                                        <Link
                                          to={`${Routes.POSTS}?collegeId=${college.id}&collegeName=${college.name}&programmeId=${programme.id}&programmeName=${programme.name}&termType=${programme.termType}&termsCount=${programme.termsCount}&term=${course.term}&courseId=${course.id}&courseName=${course.name}`}
                                          className={classes.link}
                                        >
                                          {course.name}
                                        </Link>
                                      }
                                      labelIcon={() => <CourseIcon width="18" />}
                                      labelInfo={
                                        selectedNodeValue !== `${college.id}-${programme.id}-${course.id}` ? (
                                          ''
                                        ) : (
                                          <Link
                                            to={`${Routes.CREATE_POST}?collegeId=${collegeId}&programmeId=${programmeId}&courseId=${courseId}&courseName=${course.name}&type=pdf`}
                                          >
                                            <AddIcon fontSize="small" color="secondary" />
                                          </Link>
                                        )
                                      }
                                      color="#3c8039"
                                      bgColor="#e6f4ea"
                                    />
                                  );
                                })}
                              </StyledTreeItem>
                            );
                          })}
                        </StyledTreeItem>
                      );
                    })}
                  </StyledTreeItem>
                );
              })}
            </StyledTreeItem>
          );
        })}
      </StyledTreeItem>
    </TreeView>
  );
}
