import React, {useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {postLogEntries} from '../../../API/api';
import TextField from '@material-ui/core/TextField';
import classNames from 'classnames';
import MuiDatePicker from '../DateSelect'
import Moment from 'moment';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Checkmark, Crossmark } from '../Checkmark/Checkmark'; 
import Fade from '@material-ui/core/Grow';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleUp } from '@fortawesome/free-solid-svg-icons';

const useStyles = makeStyles(theme => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center'
    },
    wrapper: {
      margin: theme.spacing(),
      position: 'relative',
      marginTop: 'auto',
      marginBottom: 'auto',
    },
    descField: {
      marginLeft: theme.spacing(),
      marginRight: theme.spacing(),
      width: 175,
    },
    minField: {
        marginLeft: theme.spacing(),
        marginRight: theme.spacing(),
        width: 75,
    },
    button: {
      margin: theme.spacing(),
    },
    leftIcon: {
      marginRight: theme.spacing(),
    },
    iconSmall: {
      fontSize: 20,
    },
    logBtn: {
      maxHeight: 20,
      marginTop: 'auto',
      marginBottom: 'auto',
      borderRadius: 18,
      transition: 'all 500ms ease-in',
      lineHeight: '13px'
    },
    buttonProgress: {
      position: 'absolute',
      color: theme.palette.blue.main,
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12,
    },
    projectList: {
        width: 200,
      marginLeft: 8,
      marginRight: 8,
      marginTop: 32,
      marginBottom: 8
    },
    errColor: {
      color: '#F47F64'
    },
}));


var enumerateDaysBetweenDates = function(startDate, endDate) {
    var dates = [];

    var currDate = Moment(startDate,'YYYY-MM-DD');
    var lastDate = Moment(endDate,'YYYY-MM-DD');

    while(currDate.diff(lastDate) <= 0) {
        dates.push(Moment(currDate.clone()));
        currDate.add(1, 'days');
    }

    return dates;
};

function TimeRow(props) {
    const [minutes,setMinutes] = useState('')
    const [project_id,setProject_id] = useState('')
    const [description,setDescription] = useState('')
    const [mounted,setMounted] = useState(false)
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [errorTracker, setErrorTracker] = useState({
        loading: false,
        minutesError: false,
        project_idError: false,
        descriptionError: false,
        showError: false,
        showSuccess: false,
    })

    const handleChangeArray = {
        minutes: setMinutes,
        project_id: setProject_id,
        description: setDescription,
    }

    useEffect(()=>{
        // [ Disabling due to complications - may implement in future ]
        // Push the child components handleUpdate into the parents array.
        // This will enable the parent to set off all the childrens updates, one ofter the other.
        // props.setClick(handleUpdateTime);
        
        setMounted(true); // <-- used for fade in effect
        
    })

    const handleChange = name => event => {
        handleChangeArray[name](event.target.value)
        setErrorTracker({...errorTracker,[name+'Error']:false})
        // errorTracker[name+'Error'](false)
    };
    const handleChangeStart = (val) => {
        if(!Moment(val,'YYYY-MM-DD').isValid()) return;
        if(endDate && Moment(val).isSameOrBefore(endDate)) {
            setStartDate(val)
            setErrorTracker({...errorTracker, showSuccess:false, showError: false})
        } else {
            setStartDate(val)
            setErrorTracker({...errorTracker, showSuccess:false, showError: false})
        }
    }
    const handleChangeEnd = (val) => {
        if(!Moment(val,'YYYY-MM-DD').isValid()) return;
        if(Moment(val).isSameOrAfter(startDate)) {
            setEndDate(val)
			// let arr = enumerateDaysBetweenDates(startDate,val);

			// update the timeout based on the number of days, track it with an array
			// props.handleUpdateTimeoutArray({rowNum:props.rowNum,time:(arr.length*500)});
        }
    }
    const nullCheck = (val) => {
        return (val === null || typeof val === 'undefined' || val.trim() === '');
    }
    const checkErrors = () => {
        let updateErrObj = {};

        if(nullCheck(minutes) || minutes.match(/[^0-9]/g))
            updateErrObj.minutesError = true;

        if(project_id !== 250931){ // Time Off does not require a Description Tag
            if(nullCheck(project_id.toString()) || project_id.toString().match(/[^0-9]/g))
                updateErrObj.project_idError = true;
        }
        if(nullCheck(description) || !description.match(/^#/g))
            updateErrObj.descriptionError = true;

        if(Object.keys(updateErrObj).length > 0) {
            updateErrObj.loading = false;
            setErrorTracker({...errorTracker,...updateErrObj})
            return true;
        }

        return false;
    }

    const handleUpdateTime = (callback) => {
        if(!startDate) return;
        if(!Moment(startDate,'YYYY-MM-DD').isValid()) return;
          
        setErrorTracker({...errorTracker,loading:true, showError: false})
        
        let start = Moment(startDate).format('YYYY-MM-DD');
        let end;
              
        if(checkErrors()) return;

        let mins = parseInt(minutes, 10);
        let pId = parseInt(project_id, 10);
        let desc = description;

        var data = {
            'date': start,
            'minutes': mins,
            'project_id': pId,
            'description': desc,
        };
        var options = {};
        if(endDate && !Moment(endDate).isSame(startDate)) {
            if(!Moment(endDate,'YYYY-MM-DD').isValid()) {return};
            end = endDate ? Moment(endDate).format('YYYY-MM-DD') : null;
          options['dateArray'] = enumerateDaysBetweenDates(start,end);
        }
        options.payload = JSON.stringify(data);
        options.token = props.token;

        postLogEntries(options)
        .then(resp => {
            const {error} = resp; // only care if there's an error or not
            if(error) {
                console.log('Error trying to post entry: ',error)
                setErrorTracker({...errorTracker,loading:false,showError:true})
                setStartDate(undefined)
                setEndDate(undefined)
            } else {
                setErrorTracker({...errorTracker,loading:false,showSuccess:true})
                setStartDate(undefined)
                setEndDate(undefined)
                
				if(callback !== null && typeof callback === 'function') {
					callback()
				}
            }
        })
    }

    const classes = useStyles();

    return (
        <>
            <Fade in={mounted}>
                <div name="TimeRow" className={classNames(classes.container)}>
                    {errorTracker.showSuccess && <Checkmark />}
                    {errorTracker.showError && <Crossmark />}
                    <TextField
                      disabled={errorTracker.loading}
                      error={errorTracker.minutesError ? true : null}
                      label="Minutes"
                      id="minutes"
                      value={minutes}
                      onChange={(event)=>handleChange('minutes')(event)}
                      className={classes.minField}
                      helperText="Time must be in minutes"
                      margin="normal"
                    />
			    	<FormControl className={classNames(classes.formControl,classes.projectList)} >
                            <Select
                                labelId='project ID'
			    				value={project_id ? project_id : ''} 
			    				onChange={(event)=>handleChange('project_id')(event)} 
			    				displayEmpty 
			    				className={errorTracker.project_idError ? classes.errColor : null}
			    				error={errorTracker.project_idError ? true : null}
                                disabled={errorTracker.loading }
                                inputProps={{
                                    'aria-label':'project id'
                                }}
			    			>
      		    	  	  <MenuItem value="" disabled>
			    			  Project ID
      		    	  	  </MenuItem>
			    			{
			    				props.projectList.length > 0
			    				?	props.projectList.map(obj => <MenuItem key={obj.id} value={obj.id}>{obj.name}</MenuItem>)
			    				: null
			    			}
      		    	  	</Select>
			    		<FormHelperText className={errorTracker.project_idError ? classes.errColor : null}>Project ID</FormHelperText>
      		    	</FormControl>
                    <TextField
                      disabled={errorTracker.loading}
                      error={errorTracker.descriptionError ? true : null}
                      label="Tags"
                      id="tags"
                      value={description}
                      onChange={(event)=>handleChange('description')(event)}
                      className={classes.descField}
                      helperText="#TagName"
                      margin="normal"
                    />
                    <MuiDatePicker
                        handleChangeStart={handleChangeStart} 
                        handleChangeEnd={handleChangeEnd}
                        startDate={startDate}
                        endDate={endDate}
                        loading={errorTracker.loading}
                    />
                    <div className={classes.wrapper}>
                    <Button 
                        color="secondary"
                        name="entryButton" 
                        disabled={((startDate && !errorTracker.loading) || props.posting) ? false : true} 
                        variant="contained" 
                        size="small" 
                        className={classNames(classes.button,classes.logBtn,{[classes.logBtnActive]:((startDate && !errorTracker.loading) || !props.posting)})} 
                        onClick={handleUpdateTime}
                        >
                            <FontAwesomeIcon icon={faArrowCircleUp} />
                            <i className={classNames(classes.leftIcon, classes.iconSmall,"fas fa-arrow-circle-up")}></i>
                        Log It
                    </Button>
                    {errorTracker.loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                    </div>
                </div>
			</Fade>
        </>
    )
}

TimeRow.propTypes = {
    token: PropTypes.string.isRequired,
    rowNum: PropTypes.number.isRequired,
    projectList: PropTypes.array.isRequired,
    // setClick: PropTypes.func.isRequired,
    posting: PropTypes.bool.isRequired
};

export default TimeRow;