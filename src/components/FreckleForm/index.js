import React, {useState} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import {getProjectList} from '../../API/api'; // API USED FOR MOCKING IN TESTS
import clsx from 'classnames';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import TimeRow from './TimeRow/';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import scss from './Form.module.scss';
import Zoom from '@material-ui/core/Zoom';
import ViewEntries from './ViewEntries';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
// import { faArrowCircleUp } from '@fortawesome/free-solid-svg-icons';

const useStyles = makeStyles(theme => ({
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
      margin: theme.spacing(),
      position: 'relative',
      marginTop: 'auto',
      marginBottom: 'auto',
    },
    textField: {
      width: 512,
      marginLeft: 12
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
}));

function FreckleForm() {
    const [tokenError, setTokenError] = useState('');
    const [entryRowCount, setEntryRowCount] = useState(1);
    const [projectList, setProjectList] = useState([]);
    // const [timeoutArray, setTimeoutArray] = useState([]);
    const [posting, setPosting] = useState(false);
    const [openSnack, setOpenSnack] = useState(false);
    const [token, setToken] = useState('');
    const [page, setPage] = useState('create');
    // const [childrenClicks, setChildrenClicks] = useState([]);
    
    const getProjectIDs = () => {
        let options = {};
        if(!token || token.trim() === '') {
            setTokenError(true)
            return;
        }
        options.token = token;
        getProjectList(options)
        .then( resp => {
            const {result, error} = resp;
            if(error) {
                console.log('Getting List',error)
                setTokenError(true)
                setOpenSnack(true)
            } else {
                setProjectList(result.data)
            }
        })
    }
    
    // const handleUpdateTimeoutArray = (timeoutObj) => {
	// 	let updatedTimeoutArray=[];
	// 	let updateIndex = 0;
	// 	if(timeoutArray.length > 0) {
	// 		timeoutArray.forEach(obj => {
    //             updatedTimeoutArray.push({...obj})
    //         });
	// 		updateIndex = updatedTimeoutArray.findIndex(obj=>obj.rowNum===timeoutObj.rowNum);
	// 	}
	// 	if(updateIndex>=0)
	// 		updatedTimeoutArray[updateIndex] = {...timeoutObj};
	// 	else
	// 		updatedTimeoutArray.push({...timeoutObj});

    //     setTimeoutArray(updatedTimeoutArray)
    // }

    const toggleSnack = () => {
        setOpenSnack(oldBool => !oldBool)
    }

    const handleUpdateToken = event => {
        setTokenError(false)
        setToken(event.target.value)
    };
    const handlePageChange = (selectedPage) => {
        if(selectedPage === page) return;
        setPage(selectedPage)
    }
    const handleAddRow = () => {
        if(entryRowCount < 4)
            setEntryRowCount(cur => ++cur)
        else return;
	};
	// const togglePosting= () => {
    //     setPosting(oldBool => !oldBool)
    // };
    
    // const storeChildrenClicks = (click,rowNum) => {
    //     setChildrenClicks((oldArr) => {
    //         // cannot use .push() because element is a constant? protections in place?
    //         oldArr[rowNum] = click;
    //         return oldArr
    //     })
    // }

    // const handleClickAll = () => {
    // if(childrenClicks.length <= 0) return;
    //     // call each TimeRow instance's handleUpdateTime Method
    //     setPosting(true)

    //     childrenClicks.forEach((func,indx) => {
    //         let rateLimit = 0;

    //     // Here we combine the current rows timeout, with all previous row timeouts.
	// 		if(func !== null && typeof func === 'function') {
	// 			if(indx > 0 && timeoutArray.length > 0) {
	// 				for (let i = indx; i >= 0; i--) {
	// 					let thisRowObj = timeoutArray.find(obj=>obj.rowNum===i);
	// 					if(i !== indx) {
	// 						rateLimit += thisRowObj.time;
	// 					}
	// 				}
    //             } else if(indx > 0) {
    //                 rateLimit += 500;
    //             }
                
    //     // Noko API v2 has a 2 per 1 second ratelimit. 
    //     // this timeout should allow us to wait until one row is
    //     // done updating before firing off the next rows updates
	// 			setTimeout(() => {
	// 				if(indx === (childrenClicks.length -1))
	// 					func(togglePosting);
	// 				else
	// 					func();
	// 			}, rateLimit+500);
	// 		}
	// 	});
    // }

    const classes = useStyles();
    let entryRows=null;

    // first create an empty array, with a length equal to the number of entry rows
    // then fill with TimeRow components
    if(token && projectList.length>0) {
        entryRows = Array.from({length: entryRowCount}, (v, i) => 
            <TimeRow key={"timeRow_"+i} 
                // handleUpdateTimeoutArray={handleUpdateTimeoutArray}
                token={token}
                rowNum={i} 
                projectList={projectList} 
                // setClick={storeChildrenClicks}
                posting={posting}
            />
        );
    }
    return (
        <>
            <Snackbar
                anchorOrigin={{ vertical:'top', horizontal:'center' }}
                key={`top,center`}
                className={scss.snackError}
                open={openSnack}
                autoHideDuration={6000}
                onClose={toggleSnack}
                message={<div><FontAwesomeIcon icon={faExclamationTriangle} /><span className={''}>ERROR: Could not get Project IDs, Check Token</span></div>}
            />
            <Toolbar className={scss.actionBar} disableGutters={true}>
                {/* {(page ==='create' && entryRows && entryRows.length > 1) &&
                    <Zoom in={true}>
                    <Button 
                        variant="outlined"
                        disabled={posting} size="small" 
                        className={clsx(scss.actionBarWhite,posting&&scss.colorDisabled)} 
                        onClick={handleClickAll}
                        startIcon={<FontAwesomeIcon icon={faArrowCircleUp} />}
                    >
                        <span>LOG ALL</span>
                    </Button>
                    </Zoom>
                } */}
            </Toolbar>
            <div data-testid="form" className={scss.freckleForm}>
                {(token && projectList.length>0) &&
                    <>
                        <div className={classes.btnGrpFix}></div>
                        <div className={classes.btnGroup}>
                        <Zoom in={true}>
                        <ButtonGroup color="secondary" size="small" aria-label="small outlined button group">
                            <Button
                                disabled={page === 'create'}
                                variant={page === 'create' ? null : 'contained'}
                                onClick={()=>handlePageChange('create')}
                            >
                                Create Entries
                            </Button>
                            <Button 
                                disabled={page === 'view'}
                                variant={page === 'view' ? null : 'contained'}
                                onClick={()=>handlePageChange('view')}
                            >
                                View Entries
                            </Button>
                        </ButtonGroup>
                        </Zoom>
                        </div>
                    </>
                }
                {page === 'view'
                ?   <ViewEntries token={token} />  
                : <>
					{posting && <div className={classes.overlay}>
						<CircularProgress size={96} className={classes.buttonProgress} />
						</div>
                    }
                    {(projectList.length<=0) &&
                    <TextField
                        error={tokenError ? true : null}
                        label="Token"
                        id="token"
                        value={token}
                        onChange={handleUpdateToken}
                        className={classes.textField}
                        helperText="Your Personal Access Token for Noko"
                        margin="normal"
                        type={'password'}
                        autoComplete={"off"}
                    />
                  }
                    {(token && token !== '' && projectList.length <= 0) &&
                        <Button name="PIDButton" variant="contained" size="small" className={clsx(classes.button,classes.logBtn)} onClick={getProjectIDs}>
                            <i className={clsx(classes.leftIcon, classes.iconSmall,"fas fa-arrow-circle-up")}></i>
                            Get Project IDs
                        </Button>
                    }
            	    {entryRows}
            	    {entryRowCount < 4 && (projectList.length>0) &&
            	        <div className={scss.addBtnContainer}>
            	        <IconButton role='PlusBtn'  size="small" className={clsx(scss.rowBtn)} onClick={handleAddRow}>
            	            <FontAwesomeIcon icon={faPlusCircle} />
            	        </IconButton>
            	        </div>
                    }
                    </>
                }
            </div>
        </>
    )
}

export default FreckleForm;