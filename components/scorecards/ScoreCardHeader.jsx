import React, { Fragment } from 'react';
import {
  CardHeader,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import TooltipCustom from '~/components/TooltipCustom';

const styles = () => ({
  root: {
    backgroundColor: '#eee',
    height: '3em',
  },
  title: {
    fontSize: '1em',
    textAlign: 'center',
  },
  iconPosition: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
});

const ScoreCardHeader = (props) => {
  const { title, tooltip, classes } = props;
  return (
    <Fragment>
      <CardHeader classes={{ root: classes.root, title: classes.title }} title={title} />
      <div className={classes.iconPosition}>
        <TooltipCustom title={tooltip.title} content={tooltip.content} />
      </div>
    </Fragment>
  );
};

export default withStyles(styles)(ScoreCardHeader);
