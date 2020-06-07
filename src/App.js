import React from 'react';
import './App.css';

import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Layout from './hoc/Layout/Layout';
import FreckleForm from './components/FreckleForm/';

function App({themeObj}) {
  
  const themeBuilder = themeObj ? themeObj : window.muiTheme;
  const theme = createMuiTheme(themeBuilder);

  return (
    <ThemeProvider theme={theme}>
      <div style={{height:'100%'}} >
      <Layout>
          <FreckleForm />
      </Layout>
      </div>
    </ThemeProvider>

  )
}

export default App;
