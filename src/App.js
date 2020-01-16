import React, { Component } from 'react';
import './App.css';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
// import './App.scss';
import Layout from './hoc/Layout/Layout';
import FreckleForm from './components/FreckleForm/FreckleForm';

class App extends Component {
  componentDidMount () {
  }
  comnponentWillUpdate () {
  }
  render () {
  
  const theme = createMuiTheme(window.muiTheme);
    return (
      <MuiThemeProvider theme={theme}>
      <div style={{height:'100%'}} >
		  <Layout>
          <FreckleForm />
		  </Layout>
      </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
