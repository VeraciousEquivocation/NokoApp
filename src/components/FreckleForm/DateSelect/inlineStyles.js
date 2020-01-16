import {hexToRgbString} from '../../../store/utility';

export const inlineStyles = theme => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      width: 200,
    },
    formControl: {
      margin: theme.spacing.unit,
      minWidth: 60,
      maxWidth: 300,
    },
    filterButtons: {
        display:'flex',
        marginTop: 'auto !important',
        marginBottom: '25px !important'
    },
    filterButtons_open: {
        justifyContent: 'space-around'
    },
    filterTextFieldRoot: {
        margin: 8,
        minWidth: 120,
        maxWidth: 300,
    },
    filterTextFieldInput: {
        backgroundColor: theme.palette.white,
    },
    selectBoxes: {
        backgroundColor: theme.palette.white,
        textIndent: 10
    },
    selectLabel: {
        zIndex: 100
    },
    selectedMenuItem: {
        // backgroundColor: theme.palette.blue.blue3+'!important',
        // 'rgba(119,176,221,0.6)'
        backgroundColor: hexToRgbString(theme.palette.blue.blue3,0.6)+'!important',
        color: theme.palette.white+'!important'
    },
    filterText: {
        color: theme.palette.white,
        marginLeft: 12
    },
    drawerFilterIcon: {
        color: '#fff'
    },
    drawerFilterIcon_open_true: {
        marginLeft: 'auto',
        marginRight: 7,
        display: 'flex'
    },
    dateInput: {
        cursor:'pointer',
        transition:"background-color 0.4s"
    },
    outerDiv: {  
        marginTop: 'auto',
        marginBottom: 'auto',
    }
});