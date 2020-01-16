import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import classNames from 'classnames';
import DateSelect from '../DateSelect/DateSelect'
import Moment from 'moment';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Checkmark, Crossmark } from '../Checkmark/Checkmark'; 
import Fade from '@material-ui/core/Grow';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  wrapper: {
    margin: theme.spacing.unit,
    position: 'relative',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  button: {
    margin: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
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
});

class TimeRow extends Component {
    state = {
        minutesError: false,
        project_idError: false,
        descriptionError: false,
        minutes: '',
        project_id: '',
        description: '',
        username: '',
        password: '',
		loading: false,
        loadingProjects: false,
        showSuccess: false,
		showError: false,
		mounted:false
    }
    componentDidMount() {
		// Push the child components handleUpdate into the parents array.
		// This will enable the parent to set off all the childrens updates, one ofter the other.
		this.props.setClick(this.handleUpdateTime);
		this.setState({mounted:true});
	}
    handleChange = name => event => {
        this.setState({
          [name]: event.target.value,
          [name+'Error']: false
        });
    };
    handleChangeStart = (val) => {
        if(!Moment(val,'YYYY-MM-DD').isValid()) return;
        if(Moment(val).isSameOrBefore(this.state.endDate)) {
            this.setState({startDate:val, showSuccess: false});
        }
    }
    handleChangeEnd = (val) => {
        if(!Moment(val,'YYYY-MM-DD').isValid()) return;
        if(Moment(val).isSameOrAfter(this.state.startDate)) {
			this.setState({endDate:val});
			let arr = enumerateDaysBetweenDates(this.state.startDate,val);

			// update the timeout based on the number of days, track it with an array
			this.props.handleUpdateTimeoutArray({rowNum:this.props.rowNum,time:(arr.length*500)});
        }
    }
    nullCheck = (val) => {
        return (val === null || typeof val === 'undefined' || val.trim() === '');
    }
    checkErrors = () => {
		const {minutes,project_id,description} = this.state;
            let updateStateObj = {};
        if(this.nullCheck(minutes) || minutes.match(/[^0-9]/g))
            updateStateObj.minutesError = true;
        if(this.nullCheck(project_id.toString()) || project_id.toString().match(/[^0-9]/g))
            updateStateObj.project_idError = true;
        if(this.nullCheck(description) || !description.match(/^#/g))
            updateStateObj.descriptionError = true;

        if(Object.keys(updateStateObj).length > 0) {
            updateStateObj.loading = false;
            this.setState(updateStateObj)
            return true;
        }

        return false;
    }

    handleUpdateTime = (callback) => {
      	if(!this.state.startDate) return;
      	if(!Moment(this.state.startDate,'YYYY-MM-DD').isValid()) return;
		
      	this.setState({loading:true, showError: false});
        
        let start = Moment(this.state.startDate).format('YYYY-MM-DD');
        let end;
        
        if(this.checkErrors()) return;

        let minutes = parseInt(this.state.minutes, 10);
        let project_id = parseInt(this.state.project_id, 10);
        let description = this.state.description;

        var data = {
            'date': start,
            'minutes': minutes,
            'project_id': project_id,
            'description': description,
        };
        var options = {};
        if(this.state.endDate && !Moment(this.state.endDate).isSame(this.state.startDate)) {
            if(!Moment(this.state.endDate,'YYYY-MM-DD').isValid()) {return};
            end = this.state.endDate ? Moment(this.state.endDate).format('YYYY-MM-DD') : null;
          options['dateArray'] = enumerateDaysBetweenDates(start,end);
        }
        options.payload = JSON.stringify(data);
        options.token = this.props.token;
        axios.post('/api/post', options)
            .then( result => {
				this.setState({loading:false, startDate:undefined, endDate:undefined, showSuccess: true});
				if(callback !== null && typeof callback === 'function') {
					callback()
				}
            })
            .catch(error => {
                console.log(error)
                this.setState({loading:false, startDate:undefined, endDate:undefined, showError: true})
            });
    }
    render() {
        const { classes } = this.props;
		const {startDate, loading, loadingProjects, showSuccess, showError} = this.state;
        return (
            <React.Fragment>
				<Fade in={this.state.mounted}>
                <div className={classNames(classes.container)}>
                    {showSuccess && <Checkmark />}
                    {showError && <Crossmark />}
                    <TextField
                      disabled={loading}
                      error={this.state.minutesError ? true : null}
                      label="Minutes"
                      id="minutes"
                      value={this.state.minutes}
                      onChange={this.handleChange('minutes')}
                      className={classes.textField}
                      helperText="Time must be in minutes"
                      margin="normal"
                    />
					<FormControl className={classNames(classes.formControl,classes.projectList)} >
							<Select 
								value={this.state.project_id} 
								onChange={this.handleChange('project_id')} 
								displayEmpty 
								className={this.state.project_idError ? classes.errColor : null}
								error={this.state.project_idError ? true : null}
								disabled={loading || loadingProjects}
							>
      				  	  <MenuItem value="" disabled>
							  Project ID
      				  	  </MenuItem>
							{
								this.props.projectList.length > 0
								?	this.props.projectList.map(obj => <MenuItem key={obj.id} value={obj.id}>{obj.name}</MenuItem>)
								: null

							}
      				  	</Select>
						<FormHelperText className={this.state.project_idError ? classes.errColor : null}>{loadingProjects ? <div><CircularProgress size={24} className={classes.buttonProgress} />Project ID</div> : "Project ID"}</FormHelperText>
      				</FormControl>
                    <TextField
                      disabled={loading}
                      error={this.state.descriptionError ? true : null}
                      label="Tags"
                      id="tags"
                      value={this.state.description}
                      onChange={this.handleChange('description')}
                      className={classes.textField}
                      helperText="#TagName"
                      margin="normal"
                    />
                    <DateSelect 
                        handleChangeStart={this.handleChangeStart} 
                        handleChangeEnd={this.handleChangeEnd}
                        startDate={this.state.startDate}
                        endDate={this.state.endDate}
                        loading={this.state.loading}
                    />
                    <div className={classes.wrapper}>
                    <Button name="entryButton" disabled={((startDate && !loading) || this.props.posting) ? false : true} variant="contained" size="small" className={classNames(classes.button,classes.logBtn)} onClick={this.handleUpdateTime}>
                        <i className={classNames(classes.leftIcon, classes.iconSmall,"fas fa-arrow-circle-up")}></i>
                        Log It
                    </Button>
                    {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                    </div>
                </div>
				</Fade>
            </React.Fragment>
        );
    }
};

TimeRow.propTypes = {
  classes: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
  rowNum: PropTypes.number.isRequired,
  projectList: PropTypes.array.isRequired,
  setClick: PropTypes.func.isRequired,
  posting: PropTypes.bool.isRequired
};

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

export default withStyles(styles)(TimeRow);
