import React, { Fragment, useState } from "react";
import axios from 'axios';
import Moment from 'moment';
import scss from './ViewEntries.module.scss';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Zoom from '@material-ui/core/Zoom';
import Card from '@material-ui/core/Card';
// import CardActionArea from '@material-ui/core/CardActionArea';
// import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

function Alert(props) {
    return <MuiAlert elevation={6} {...props} />;
}

const initialValues = {
    loading: false,
    errorFetching: false,
    errorMessage: '',
    entries:[],
    openErrAlert: false
};

function ViewEntries(props) {
    const [display, handleDisplayChange] = useState('today');
    const [stateValues, updateStateValues] = useState(initialValues);
    const [ignored, forceUpdate] = React.useReducer(x => x + 1, 0);

    React.useEffect( ()=>{
        //GET THE CURRENT DISPLAY ENTRIES
        updateStateValues(oldVals => { return{...oldVals,loading:true,entries:[]} });
        var data = {};
        var options = {display};

        switch (display) {
            case 'lastweek':
                    data = {
                        'from': Moment().subtract(7,'days').startOf('isoWeek').format('YYYY-MM-DD'),
                        'to':Moment().subtract(7,'days').endOf('isoWeek').format('YYYY-MM-DD')
                    };
                    
                break;
            case 'yesterday':
                    data = {
                        'from': Moment().subtract(1,'days').format('YYYY-MM-DD'),
                        'to':Moment().subtract(1,'days').format('YYYY-MM-DD')
                    };
                break;
            case 'tomorrow':
                    data = {
                        'from': Moment().add(1,'days').format('YYYY-MM-DD'),
                        'to':Moment().add(1,'days').format('YYYY-MM-DD')
                    };
                break;
            case 'thisweek':
                    data = {
                        'from': Moment().startOf('isoWeek').format('YYYY-MM-DD'),
                        'to':Moment().endOf('isoWeek').format('YYYY-MM-DD')
                    };
                    break;
            default:
                    data = {
                        'from': Moment().format('YYYY-MM-DD'),
                        'to':Moment().format('YYYY-MM-DD')
                    };
                break;
        }

        options.payload = JSON.stringify(data);
        options.token = props.token;
        
        axios.post('/api/fetchEntries', options)
            .then( result => {
                // SET ENTRY ROWS

                updateStateValues(oldVals => { return{...oldVals,loading:false,entries:result.data} });

                // tempObj.id = obj.id;
	    	    // tempObj.date = obj.date;
	    	    // tempObj.minutes = obj.minutes;
	    	    // tempObj.tags = obj.tags;
	    	    // tempObj.projectId = obj.projectId;
	    	    // tempObj.projectName = obj.projectName;
	    	    // tempObj.projectColor = obj.projectColor;
            })
            .catch(error => {
                console.log(error)
                updateStateValues(oldVals => { return{...oldVals,loading:false,errorFetching:!oldVals.errorFetching, errorMessage:'ERROR: Could Not Delete Entry',openErrAlert:true} });
        });
    },[display,props.token,updateStateValues,ignored]);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        updateStateValues(oldVals => { return{...oldVals,errorMessage:'',openErrAlert:false} });
    };

    const handleDelete = React.useCallback((id)=>{
        if(!id || id==='') return; // for now we just return
        
        updateStateValues(oldVals => { return{...oldVals,loading:true} });
        
        var options = {};
        options.payload = JSON.stringify({id});
        options.token = props.token;
        
        axios.post('/api/delete', options)
            .then( result => {
                // force fetch to refresh values
                setTimeout(()=>{
                    forceUpdate();
                },600);
            })
            .catch(error => {
                console.log(error)

                updateStateValues(oldVals => { return{...oldVals,loading:false, errorMessage:'ERROR: Could Not Delete Entry',openErrAlert:true} });
        });
    },[props.token]);

    const buildCard = React.useCallback((entry) => {
        return(
            <React.Fragment>
                <Grid container spacing={1}>
                <Grid item xs={1} md={2} >
                    <div className={scss.colorDiv} style={{backgroundColor:entry.projectColor}}>
                    </div>
                </Grid>
                <Grid item xs={8} md={8}>
                    <div className={scss.rowCardText}>
                        <div>
                            <Typography variant="body2" color="textSecondary" component="p">
                                {entry.projectName}
                            </Typography>
                        </div>
                        <div>
                            <Typography variant="body2" color="textSecondary" component="p">
                                {entry.minutes+' Minutes'}
                            </Typography>
                        </div>
                        {entry.tags.length > 0 && <div>
                            <Typography variant="body2" color="textSecondary" component="p">
                                {entry.tags.map((tag,indx)=>{
                                    if(entry.tags.length > 0 && indx !== (entry.tags.length - 1)) {
                                        return(
                                            <span key={indx}>{tag+' '}</span>
                                        );
                                    } else {
                                        return(
                                            <span key={indx}>{tag}</span>
                                        );
                                    }
                                })}
                            </Typography>
                        </div>}
                    </div>
                </Grid>
                <Grid item xs={2} >
                    <div className={{}}>
                        <IconButton aria-label="delete" size="small" onClick={()=>handleDelete(entry.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                    </div>
                </Grid>
                </Grid>
            </React.Fragment>
        );
    },[handleDelete]);

    let calendar = null;

    let buildWeekLayout = React.useCallback(()=>{
        // Build out the ThisWeek Layout
        let weekArray = [];
        let compare = (dateToCompare) => {
            if(display === 'lastweek'){
                return dateToCompare.isSameOrBefore(Moment().subtract(7,'days').endOf('isoWeek'));
            } else {
                return dateToCompare.isSameOrBefore(Moment().endOf('isoWeek'));
            }
        };
        for(
            let i = display==='lastweek' ? Moment().subtract(7,'days').startOf('isoWeek') : Moment().startOf('isoWeek'); 
            compare(i);
            i.add(1,'days')
        ) {
            let currentDaysRows = [];

            
            if(stateValues.loading) {
                currentDaysRows.push((
                    <Card className={scss.rowCard}>
                        <div className={scss.emptyRow}>
                            <div>
                                <Skeleton variant="rect" width={20} height={56} />
                            </div>
                        </div>
                    </Card>
                ));
            } else {
                let currentDayEntries = stateValues.entries.filter((entry)=>{
                    return Moment(entry.date).isSame(i.format('YYYY-MM-DD'));
                });
                if(currentDayEntries.length>0) {
                    currentDaysRows = currentDayEntries.map((entry,indx) => {
                        return(
                            <Card key={indx} className={scss.rowCard}>
                                {buildCard(entry)}
                            </Card>
                        );
                    });
                } else {
                    currentDaysRows.push((
                        <Card className={scss.rowCard}>
                            <div className={scss.emptyRow}>
                                No Entries
                            </div>
                        </Card>
                    ));
                }
            }
            
            weekArray.push((
                <Grid item xs={12} sm={4} md={3} >
                    <Card raised className={scss.card}>
                        <CardHeader className={scss.cardHeader}
                            title={i.format('dddd')}
                        >
                        </CardHeader>
                        <CardContent>
                            {currentDaysRows}
                        </CardContent>
                    </Card>
                </Grid>
            ));
        }
        
        return weekArray;
    },[stateValues.entries,display,stateValues.loading]);

    switch (display) {
        case 'yesterday':
            calendar = (
                <Card raised className={scss.card}>
                    <CardHeader className={scss.cardHeader}
                        title="YESTERDAY"
                    >
                    </CardHeader>
                    <CardContent>
                    {/* First filter only today, then map rows  */}
                    {stateValues.entries.filter((entry)=>{
                        return Moment(entry.date).isSame(Moment().subtract(1,'days').format('YYYY-MM-DD'));
                    }).map((entry,indx) => {
                            return(
                                <Card key={indx} className={scss.rowCard}>
                                    {buildCard(entry)}
                                </Card>
                            );
                    })}
                    {stateValues.entries.filter((entry)=>{
                        return Moment(entry.date).isSame(Moment().subtract(1,'days').format('YYYY-MM-DD'));
                    }).length <= 0 && 
                        <Card className={scss.rowCard}>
                            <div className={scss.emptyRow}>
                                No Entries
                            </div>
                        </Card>
                    }
                    </CardContent>
                </Card>
            );
            break;
        case 'tomorrow':
            calendar = (
                <Card raised className={scss.card}>
                    <CardHeader className={scss.cardHeader}
                        title="TOMORROW"
                    >
                    </CardHeader>
                    <CardContent>
                    {/* First filter only today, then map rows  */}
                    {stateValues.entries.filter((entry)=>{
                        return Moment(entry.date).isSame(Moment().add(1,'days').format('YYYY-MM-DD'));
                    }).map((entry,indx) => {
                            return(
                                <Card key={indx} className={scss.rowCard}>
                                    {buildCard(entry)}
                                </Card>
                            );
                    })}
                    {stateValues.entries.filter((entry)=>{
                        return Moment(entry.date).isSame(Moment().add(1,'days').format('YYYY-MM-DD'));
                    }).length <= 0 && 
                        <Card className={scss.rowCard}>
                            <div className={scss.emptyRow}>
                                No Entries
                            </div>
                        </Card>
                    }
                    </CardContent>
                </Card>
            );
            break;
        case 'thisweek':
        case 'lastweek':
            calendar = (
                <Grid container spacing={1}>
                    {
                        buildWeekLayout()
                    }
                </Grid>
            );
            break;
        default:
            calendar = (
                <Card raised className={scss.card}>
                    <CardHeader className={scss.cardHeader}
                        title="TODAY"
                    >
                    </CardHeader>
                    <CardContent>
                    {/* First filter only today, then map rows  */}
                    {stateValues.entries.filter((entry)=>{
                        return Moment(entry.date).isSame(Moment().format('YYYY-MM-DD'));
                    }).map((entry,indx) => {
                            return(
                                <Card key={indx} className={scss.rowCard}>
                                    {buildCard(entry)}
                                </Card>
                            );
                    })}
                    {stateValues.entries.filter((entry)=>{
                        return Moment(entry.date).isSame(Moment().format('YYYY-MM-DD'));
                    }).length <= 0 && 
                        <Card className={scss.rowCard}>
                            <div className={scss.emptyRow}>
                                No Entries
                            </div>
                        </Card>
                    }
                    </CardContent>
                </Card>
            );
            break;
    }

  return (
    <Fragment>
        <React.Fragment>
            <Snackbar anchorOrigin={{ vertical:'top', horizontal:'center' }} open={stateValues.openErrAlert} autoHideDuration={6000} onClose={handleClose}>
              <Alert onClose={handleClose} severity="error">
                {stateValues.errorMessage}
              </Alert>
            </Snackbar>
            <div className={scss.btnGrpFix}></div>
            <div className={scss.btnGroup}>
            <Zoom in={true}>
            <ButtonGroup color="secondary" size="small" aria-label="small outlined button group">
                <Button
                    disabled={display === 'lastweek'}
                    variant={display === 'lastweek' ? null : 'contained'}
                    onClick={()=>handleDisplayChange('lastweek')}
                >
                    Last Week
                </Button>
                <Button
                    disabled={display === 'yesterday'}
                    variant={display === 'yesterday' ? null : 'contained'}
                    onClick={()=>handleDisplayChange('yesterday')}
                >
                    Yesterday
                </Button>
                <Button 
                    disabled={display === 'today'}
                    variant={display === 'today' ? null : 'contained'}
                    onClick={()=>handleDisplayChange('today')}
                >
                    Today
                </Button>
                <Button 
                    disabled={display === 'tomorrow'}
                    variant={display === 'tomorrow' ? null : 'contained'}
                    onClick={()=>handleDisplayChange('tomorrow')}
                >
                    Tomorrow
                </Button>
                
                <Button 
                    disabled={display === 'thisweek'}
                    variant={display === 'thisweek' ? null : 'contained'}
                    onClick={()=>handleDisplayChange('thisweek')}
                >
                    This Week
                </Button>
            </ButtonGroup>
            </Zoom>
            </div>
            <div className={scss.calendar}>
                {calendar}
            </div>
        </React.Fragment>
    </Fragment>
  );
}

export default ViewEntries;