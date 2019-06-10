import React from 'react';
import {
  Card,
  Typography,
} from '@material-ui/core';
import { Slider } from '@material-ui/lab';
import { withStyles } from '@material-ui/core/styles';
import HistoryChart from '~/components/charts/HistoryChart';
import {
  dateToString,
  deriveLine,
  deriveXAxis,
  deriveYAxis,
} from '~/helpers/FormatHistory';
import { linesByName } from '~/helpers/LineInfo';

const styles = theme => ({
  card: {
    maxWidth: 1200,
    margin: 'auto',
    marginTop: 20,
  },
  chartContainer: {
    margin: 'auto',
    width: '100%',
    marginTop: '1em',
    marginBottom: '1em',
    paddingTop: '2em',
    paddingBottom: '2em',
    paddingLeft: '5%',
    paddingRight: '5%',
    backgroundColor: '#f8f8f8',
  },
  headerContainer: {
    marginTop: '1em',
    paddingBottom: '1em',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  header: {
    fontSize: 36,
    marginBottom: '-.25em',
    textAlign: 'center',
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
    marginLeft: '.5em',
    marginBottom: '-.25em',
  },
  avatar: {
    width: 16,
    height: 16,
    marginRight: '.5em',
  },
  slider: {
    padding: '22px 0px',
  },
  sliderContainer: {
    width: '30%',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingBottom: '1em',
    paddingTop: '1em',
    textAlign: 'center',
  },
  trackBefore: {
    opacity: '.2',
  },
  trackAfter: {
    opacity: '1',
  },
});

class LineComparison extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      graphData: [],
      allLineGraph: [],
      xAxis: 'All Daily Data',
      xTickFormat: [],
      yTickFormat: {
        formatter() {
          return `${this.value}%`;
        },
      },
      value: 0,
      sliderLabel: 'All Time',
    };
  }

  static getDerivedStateFromProps(props, state) {
    const {
      graphData,
      allLineGraph,
      xAxis,
    } = state;
    const {
      allLineData,
      formattedData,
      currentLine,
      arrivalWindow,
    } = props;
    if (!graphData[0] && !allLineGraph[0]) {
      if (currentLine !== 'All') {
        return {
          graphData: deriveYAxis(
            deriveXAxis(
              deriveLine(formattedData, currentLine, allLineData),
              xAxis,
            ),
            arrivalWindow,
          ),
          allLineGraph: deriveYAxis(
            deriveXAxis(
              deriveLine(formattedData, 'All Lines', allLineData),
              xAxis,
            ),
            arrivalWindow,
          ),
        };
      }
      return {
        allLineGraph: deriveYAxis(
          deriveXAxis(
            deriveLine(formattedData, 'All Lines', allLineData),
            xAxis,
          ),
          arrivalWindow,
        ),
      };
    }
    return null;
  }

  componentDidMount() {
    this.setState(prevState => ({
      xTickFormat: prevState.graphData.map((item, i) => (
        dateToString(prevState.graphData.length - 1 - i)
      )),
    }));
  }

  componentDidUpdate(prevProps) {
    const { currentLine, arrivalWindow } = this.props;
    const { value } = this.state;
    if (prevProps.currentLine !== currentLine || prevProps.arrivalWindow !== arrivalWindow) {
      this.formatGraphData(value);
    }
  }

  setLabel = (value) => {
    switch (value) {
      case 0:
        this.setState({ sliderLabel: 'All Time' });
        break;
      case 1:
        this.setState({ sliderLabel: '90 Days' });
        break;
      case 2:
        this.setState({ sliderLabel: '30 Days' });
        break;
      default:
        this.setState({ sliderLabel: '7 Days' });
        break;
    }
  };

  formatGraphData = (value) => {
    const {
      formattedData,
      allLineData,
      currentLine,
      arrivalWindow,
    } = this.props;
    const { xAxis } = this.state;
    let cutOff;
    switch (value) {
      case 0:
        cutOff = formattedData.length;
        break;
      case 1:
        if (formattedData.length > 90) {
          cutOff = 90;
        }
        break;
      case 2:
        cutOff = 30;
        break;
      default:
        cutOff = 7;
        break;
    }
    if (currentLine !== 'All') {
      this.setState({
        graphData: deriveYAxis(
          deriveXAxis(
            deriveLine(
              formattedData.slice(
                formattedData.length - cutOff,
                formattedData.length,
              ),
              currentLine,
              allLineData.slice(allLineData.length - cutOff, allLineData.length),
            ),
            xAxis,
          ),
          arrivalWindow,
        ),
      });
    } else {
      this.setState({
        graphData: [],
      });
    }
    this.setState({
      allLineGraph: deriveYAxis(
        deriveXAxis(
          deriveLine(
            formattedData.slice(
              formattedData.length - cutOff,
              formattedData.length,
            ),
            'All Lines',
            allLineData.slice(allLineData.length - cutOff, allLineData.length),
          ),
          xAxis,
        ),
        arrivalWindow,
      ),
    });
  };

  handleSlide = (event, value) => {
    this.setState({ value });
    this.setLabel(value);
    this.formatGraphData(value);
  };

  render() {
    const { classes, currentLine, arrivalWindow } = this.props;
    const {
      value,
      graphData,
      allLineGraph,
      xTickFormat,
      yTickFormat,
      sliderLabel,
    } = this.state;
    const { color } = currentLine === 'All' ? '#000' : linesByName[currentLine];

    return (
      <Card>
        <div className={classes.headerContainer}>
          <Typography className={classes.header}>
            {currentLine}
            {' '}
            Line Performance Chart
          </Typography>
        </div>
        <div className={classes.chartContainer}>
          <HistoryChart
            chartFormat="line"
            bgColor="#f8f8f8"
            graphData={graphData}
            color={color}
            xTickFormat={xTickFormat}
            yTickFormat={yTickFormat}
            yAxis={arrivalWindow}
            secondSeries={{
              name: '',
              color: '#c8c8c8',
              data: allLineGraph,
            }}
          />
        </div>
        <div className={classes.sliderContainer}>
          <Typography id="slider-icon">
            View data for
            {' '}
            {sliderLabel}
          </Typography>
          <Slider
            classes={{
              container: classes.slider,
              trackBefore: classes.trackBefore,
              trackAfter: classes.trackAfter,
            }}
            value={value}
            min={0}
            max={3}
            step={1}
            onChange={this.handleSlide}
          />
        </div>
      </Card>
    );
  }
}

export default withStyles(styles)(LineComparison);
