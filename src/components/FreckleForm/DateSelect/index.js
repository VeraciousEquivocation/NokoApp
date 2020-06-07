import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx'
// import format from "date-fns/format";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
// import Grid from '@material-ui/core/Grid';
import {IconButton} from '@material-ui/core';
import DateUtils from '@date-io/date-fns'
import { 
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';

const dateFns = new DateUtils();

const overrideTheme = outerTheme => createMuiTheme({
    overrides: {
      MuiPickersDay: {
        daySelected: {
          backgroundColor: outerTheme.palette.secondary.main,
        },
      },
    },
});

const useStyles = makeStyles(theme => ({
    firstDateSelector: {
        // first-of-type not working?
        paddingRight: 8
    },
    dateSelector: {
        width: 125,
    },
    day: {
      width: 36,
      height: 36,
      fontSize: '0.875rem',
      margin: "0 2px",
      color: "inherit",
    },
    highlight: {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.common.white,
        '&:hover':{
            backgroundColor: theme.palette.primary.main,
        }
    },
    nonCurrentMonthDay: {
      color: theme.palette.text.disabled,
    },
}))

function DateSelect({startDate, endDate, handleChangeEnd, handleChangeStart,loading,rowNum}) {
    // The first commit of Material-UI
    // const [selectedDate, setSelectedDate] = React.useState(new Date('2014-08-18T21:11:54'));

    const classes = useStyles()

    // const renderTheDay = (date, selectedDate, dayInCurrentMonth) => {
    //     // [ NOTE ]
    //     /*
    //         date = current day being rendered to calendar
    //         selectedDate = a day, if one was selected already
    //         dayInCurrentMonth = boolean, if a day is within this current month
    //     */

    //     let disableDay = false;

    //     disableDay = endDate ? dateFns.isAfterDay(date,endDate) : false;

    //     if(dateFns.isAfterDay(date,new Date()))
    //         disableDay = true

    //     const dayClassName = clsx(classes.day, {
    //         [classes.highlight]: dateFns.isSameDay(selectedDate,date),
    //         [classes.nonCurrentMonthDay]: !dayInCurrentMonth,
    //     });
    //     return (
    //         <IconButton disabled={!dayInCurrentMonth || disableDay} className={dayClassName} role='TheButton'>
    //             <span> {format(date, "d")} </span>
    //         </IconButton>
    //     )
    // }

    return (
        <ThemeProvider theme={overrideTheme}>
            <MuiPickersUtilsProvider  utils={DateUtils}>
              {/* <Grid container justify="space-around"> */}
                {/* <Hidden smDown> */}
                  <KeyboardDatePicker
                    className={clsx(classes.dateSelector,classes.firstDateSelector)}
                    autoOk
                    maxDate={endDate ? endDate : dateFns.date()}
                    disabled={loading}
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    id={`StartDate_${rowNum}`}
                    label="Start Date"
                    value={startDate}
                    onChange={handleChangeStart}
                    // renderDay={renderTheDay}
                    KeyboardButtonProps={{
                      'aria-label': 'change start date',
                    }}
                  />
                {/* </Hidden>
                <Hidden smDown> */}
                  <KeyboardDatePicker
                    className={classes.dateSelector}
                    autoOk
                    minDate={startDate}
                    maxDate={dateFns.date()}
                    disabled={loading ||typeof startDate==='undefined' || startDate === null}
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    id={`EndDate_${rowNum}`}
                    label="End Date"
                    value={endDate}
                    onChange={handleChangeEnd}
                    KeyboardButtonProps={{
                      'aria-label': 'change end date',
                    }}
                  />
                {/* </Hidden> */}
                {/* <KeyboardDatePicker
                  margin="normal"
                  id="date-picker-dialog"
                  label="Date picker dialog"
                  format="MM/dd/yyyy"
                  value={selectedDate}
                  onChange={handleDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                /> */}
              {/* </Grid> */}
            </MuiPickersUtilsProvider>
        </ThemeProvider>
    );
  }

  DateSelect.propTypes = {
    startDate: PropTypes.instanceOf(Date),
    endDate: PropTypes.instanceOf(Date),
    handleChangeEnd: PropTypes.func.isRequired,
    handleChangeStart: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
  };

  export default DateSelect