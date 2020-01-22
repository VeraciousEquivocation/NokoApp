import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import classNames from 'classnames';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import TimeRow from './TimeRow/TimeRow';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import './FreckleForm.scss';
import Zoom from '@material-ui/core/Zoom';
import ViewEntries from './ViewEntries';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { faArrowCircleUp } from '@fortawesome/free-solid-svg-icons';

const styles = theme => ({
  btnGrpFix: {
      height:'1px'
  },
  btnGroup: {
      margin:16,
      display: 'flex',
      justifyContent: 'center'
  },
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
    width: 512,
    marginLeft: 12
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
    marginTop: -48,
    marginLeft: -48,
  },
  overlay: {
	  backgroundColor: 'black',
	  opacity: 0.3,
	  width: '100%',
	  height: '100%',
	  position:'absolute',
	  zIndex:999
  }
});
class FreckleForm extends Component {
    state = {
        usernameError: '',
        passwordError: '',
		entryRowCount: 1,
		projectList:[],
		timeoutArray:[],
        posting: false,
        openSnack: false,
        token:'',
        page: 'create'
    }
    componentDidMount() {
      
    }
    childrenClicks = [];
    getProjectIDs = () => {
        this.setState({loadingProjects:true});
        let options = {};
        if(!this.state.token || this.state.token.trim() === '') {
            this.setState({tokenError:true});
            return;
        }
        options.token = this.state.token;
		axios.post('/api/getList',options)
            .then( result => {
				this.setState({loadingProjects:false,projectList:result.data});
            })
            .catch(error => {
                console.log('ERROR',error)
                this.setState({loadingProjects:false,tokenError:true,openSnack:true});
            });
    }
	handleUpdateTimeoutArray = (timeoutObj) => {
		let updatedTimeoutArray=[];
		let updateIndex = 0;
		if(this.state.timeoutArray.length > 0) {
			this.state.timeoutArray.forEach(obj => {console.log('each timeoutArrayObj...',obj);updatedTimeoutArray.push({...obj})});
			updateIndex = updatedTimeoutArray.findIndex(obj=>obj.rowNum===timeoutObj.rowNum);
		}
		if(updateIndex>=0)
			updatedTimeoutArray[updateIndex] = {...timeoutObj};
		else
			updatedTimeoutArray.push({...timeoutObj});

		this.setState({timeoutArray:updatedTimeoutArray});
    }
    toggleSnack = () => {
        this.setState(oldState => {return{openSnack:!oldState.openSnack}})
    }
    handleChange = name => event => {
        this.setState({
          [name]: event.target.value,
          [name+'Error']: false
        });
    };
    handlePageChange = (page) => {
        if(page === this.state.page) return;
        this.setState({page});
    }
    handleAddRow = () => {
        if(this.state.entryRowCount < 6)
            this.setState((state) => {return {entryRowCount:(state.entryRowCount)+=1}});
        else return;
	};
	togglePosting= () => {
		this.setState(oldState => {return{posting:!oldState.posting}});
	};
    handleClickAll = () => {
    if(this.childrenClicks.length <= 0) return;
		// call each TimeRow instance's handleUpdateTime Method
		this.setState({posting:true});
        this.childrenClicks.forEach((func,indx) => {
      let rateLimit = 0;
      
      // Here we combine the current rows timeout, with all previous row timeouts.
			if(func !== null && typeof func === 'function') {
				if(indx > 0) {
					for (let i = indx; i >= 0; i--) {
						let thisRowObj = this.state.timeoutArray.find(obj=>obj.rowNum===i);
						if(i !== indx) {
							rateLimit += thisRowObj.time;
						}
					}
				}

        // Noko API v2 has a 2 per 1 second ratelimit. 
        // this timeout should allow us to wait until one row is
        // done updating before firing off the next rows updates
				setTimeout(() => {
					if(indx === (this.childrenClicks.length -1))
						func(this.togglePosting);
					else
						func();
				}, rateLimit+500);
			}
		});
    }
    render() {
        const { classes } = this.props;
        const {entryRowCount,posting} = this.state;

        let entryRows=null;
        if(this.state.token && this.state.projectList.length>0) {
		    entryRows = Array.from({length: entryRowCount}, (v, i) => 
		    	<TimeRow key={"timeRow_"+i} 
                    handleUpdateTimeoutArray={this.handleUpdateTimeoutArray}
                    token={this.state.token}
		    		rowNum={i} 
		    		projectList={this.state.projectList} 
		    		setClick={click => this.childrenClicks.push(click)}
                    posting={this.state.posting}
		    	/>
            );
        }
        return (
            <React.Fragment>
                <Snackbar
                    anchorOrigin={{ vertical:'top', horizontal:'center' }}
                    key={`top,center`}
                    // classes={{anchorOriginTopCenter:'snackError'}}
                    className={'snackError'}
                    open={this.state.openSnack}
                    autoHideDuration={6000}
                    onClose={this.toggleSnack}
                    message={<div><FontAwesomeIcon icon={faExclamationTriangle} /><span className={''}>ERROR: Could not get Project IDs, Check Token</span></div>}
                />
                <Toolbar className={"actionBar"} disableGutters={true}>
                    {(this.state.page==='create' && entryRows && entryRows.length > 1) &&
                        <Zoom in={true}>
                        <Button 
                            variant="outlined"
                            disabled={posting} size="small" 
                            className={classNames('actionBarWhite',posting&&'colorDisabled')} 
                            onClick={this.handleClickAll}
                            startIcon={<FontAwesomeIcon icon={faArrowCircleUp} />}
                        >
			    	    	<span>LOG ALL</span>
                        </Button>
                        </Zoom>
                    }
                </Toolbar>
                <div className={"freckleForm"}>
                    {(this.state.token && this.state.projectList.length>0) &&
                        <React.Fragment>
                        <div className={classes.btnGrpFix}></div>
                        <div className={classes.btnGroup}>
                        <Zoom in={true}>
                        <ButtonGroup color="secondary" size="small" aria-label="small outlined button group">
                            <Button
                                disabled={this.state.page === 'create'}
                                variant={this.state.page === 'create' ? null : 'contained'}
                                onClick={()=>this.handlePageChange('create')}
                            >
                                Create Entries
                            </Button>
                            <Button 
                                disabled={this.state.page === 'view'}
                                variant={this.state.page === 'view' ? null : 'contained'}
                                onClick={()=>this.handlePageChange('view')}
                            >
                                View Entries
                            </Button>
                        </ButtonGroup>
                        </Zoom>
                        </div>
                        </React.Fragment>
                    }
                    {this.state.page==='view'
                    ?   <ViewEntries token={this.state.token} />  
                    : <React.Fragment>
			    		{posting && <div className={classes.overlay}>
			    			<CircularProgress size={96} className={classes.buttonProgress} />
			    			</div>
                        }
                        {(this.state.projectList.length<=0) &&
                        <TextField
                            error={this.state.tokenError ? true : null}
                            label="Token"
                            id="token"
                            value={this.state.token}
                            onChange={this.handleChange('token')}
                            className={classes.textField}
                            helperText="Your Personal Access Token for Noko"
                            margin="normal"
                            type={'password'}
                            autoComplete={"off"}
                        />
                      }
                        {(this.state.token && this.state.token !== '' && this.state.projectList.length <= 0) &&
                            <Button name="PIDButton" variant="contained" size="small" className={classNames(classes.button,classes.logBtn)} onClick={this.getProjectIDs}>
                                <i className={classNames(classes.leftIcon, classes.iconSmall,"fas fa-arrow-circle-up")}></i>
                                Get Project IDs
                            </Button>
                        }
                	    {entryRows}
                	    {entryRowCount < 5 &&
                	        <div className="addBtnContainer">
                	        <IconButton  size="small" className={classNames('rowBtn')} onClick={this.handleAddRow}>
                	            <FontAwesomeIcon icon={faPlusCircle} />
                	        </IconButton>
                	        </div>
                        }
                        </React.Fragment>
                    }
            	</div>
            </React.Fragment>
        );
    }
};

FreckleForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FreckleForm);
