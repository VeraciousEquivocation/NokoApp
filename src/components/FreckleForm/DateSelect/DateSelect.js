
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Moment from 'moment';
import DatePicker from 'react-datepicker';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import './DateSelect.scss';
import 'react-datepicker/dist/react-datepicker.css';

import {inlineStyles} from './inlineStyles';
const styles = inlineStyles;

class DateSelect extends Component {
    state = {
    };
    render () {
        const { classes, startDate, endDate, handleChangeEnd, handleChangeStart,loading} = this.props;
        return (
            <div className={classes.outerDiv}>
                <FormControl className={classes.formControl}>
                    <Typography className={classNames({'dateDisabled': loading} )}>Start Date</Typography>
                    <DatePicker
                        selected={startDate}
                        selectsStart
                        disabled={loading}
                        maxDate={Moment()}
                        startDate={startDate}
                        endDate={endDate}
                        className={classNames(classes.dateInput,"dateInputHov", {'dateDisabled': loading} )}
                        customInput={(<div>{startDate ? Moment(startDate).format('YYYY-MM-DD').toString() : '...'}</div>)}
                        onChange={handleChangeStart}
                    />
                </FormControl>
                <FormControl className={classes.formControl}>
                    <React.Fragment>
                    <Typography className={classNames({'dateDisabled': loading} )}>End Date</Typography>     
                    <DatePicker
                        selected={endDate}
                        selectsEnd
                        disabled={loading||typeof startDate==='undefined'}
                        minDate={startDate}
                        maxDate={Moment()}
                        startDate={startDate}
                        endDate={endDate}
                        className={classNames(classes.dateInput,"dateInputHov", {'dateDisabled': loading} )}
                        customInput={(<div>{endDate ? Moment(endDate).format('YYYY-MM-DD').toString() : '...'}</div>)}
                        onChange={handleChangeEnd}
                    />
                    </React.Fragment>
                </FormControl>
            </div>
        )
    }
};

DateSelect.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DateSelect);
    
    
    