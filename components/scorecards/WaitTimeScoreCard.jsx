import React, { Fragment } from 'react';
import {
  Typography,
  Grid,
  Divider,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import TooltipCustom from '~/components/TooltipCustom';
import Circle from '~/components/Circle';
import { linesByName, linesById } from '~/helpers/LineInfo';
import ScoreCard from './ScoreCard';
import Comparison from './Comparison';

const styles = theme => ({
  separator: {
    margin: '10px 0',
    width: '100%'
  },
});

const WaitTimeScoreCard = (props) => {
  const {
    classes,
    data,
    currentLine,
    formattedLineData,
    width,
  } = props;

  const lineId = linesByName[currentLine]
  ;
  const waitData = lineId && lineId.id
    ? formattedLineData[formattedLineData.length - 1][`${lineId.id}_lametro-rail`]
    : data;

  const tooltip = (
    <TooltipCustom title={(
      <Fragment>
        <Typography color="inherit">Average Wait Time</Typography>
        This is an average over all stop intervals measured for the day so far.
        Obviously, this interval should be split by time of day since trains run
        more frequently during peak times. Feature coming soon!
      </Fragment>
    )}
    />
  );

  const title = 'Average Wait Time';

  const mostFrequent = {
    title: 'Most Frequent',
    color: linesById[waitData.most_frequent.name].color,
    text: (
      <Fragment>
      {linesById[waitData.most_frequent.name].name}
      {' Line every '}
      {Math.round(waitData.most_frequent.mean_time_between / 60)}
      {' minutes'}
      </Fragment>
    )
  };

  const leastFrequent = {
    title: 'Least Frequent',
    color: linesById[waitData.least_frequent.name].color,
    text: (
      <Fragment>
      {linesById[waitData.least_frequent.name].name}
      {' Line every '}
      {Math.round(waitData.least_frequent.mean_time_between / 60)}
      {' minutes'}
      </Fragment>
    )
  };

  const content = (
    <Fragment>
      <Grid item xs={6}>
        <img
          alt="waiting"
          src="/static/images/waiting.svg"
        />
      </Grid>
      <Grid item xs={6}>
        <Typography
          variant={width === 'xs'
            ? 'h3'
            : 'h1'}
          component="p"
          align="center"
        >
          {Math.round(waitData.mean_time_between / 60)}
        </Typography>
        <Typography variant="body1" align="center">
          minutes
        </Typography>
      </Grid>
      <Divider light variant="middle" className={classes.separator} />
      <Comparison comparisons={[mostFrequent, leastFrequent]} />
    </Fragment>
  );

  return <ScoreCard title={title} content={content} tooltip={tooltip} />
};

export default withStyles(styles)(WaitTimeScoreCard);
