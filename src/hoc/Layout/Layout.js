import React from 'react';
import './Layout.scss';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

// const styles = theme => ({ });

function Layout(props) {

  return (
    <React.Fragment>
      <div className="Container__Root">
        <div className="Container__AppFrame">
            <AppBar className="Container__AppBar">
              <Toolbar disableGutters={true} >
                <img className='cImg' alt='img' src='https://ca.slack-edge.com/T4CLERADV-U4C2PQQBF-2ac7bd3e51e2-48' />
                <Typography className="bubble Container__AppBar__Toolbar_Typography" variant="h5" color="inherit" noWrap>
                  It's Noko Time!
                </Typography>
              </Toolbar>
            </AppBar>
            <main id="MainContainer" className="Container__Content">
                {props.children}
            </main>
        </div>
      </div>
    </React.Fragment>
)
}

export default Layout;