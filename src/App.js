import React, { createRef } from 'react'
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Dropzone from 'react-dropzone'
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import './App.css'

import EmptyView from './EmptyView'
import DraggingView from './DraggingView'
import LoadingView from './LoadingView'
import SnapshotListView from './SnapshotListView'
import LogView from './LogView'

import CCP_LOG from './agent-log'

const styles = {
  root: {
    flexGrow: 1,
  },
  content: {
    zIndex: 2,
    paddingTop: 16,
    paddingBottom: 16,
  },
  dropping: {
    background: 'rgba(255,0,0,0.5)',
  },
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = this._getInitialState()
    this.selectLog = this.selectLog.bind(this)
    this.selectSnapshots = this.selectSnapshots.bind(this)
    this._handleOnDrop = this._handleOnDrop.bind(this)
    this._dropzoneRef = createRef()
    
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      // Great success! All the File APIs are supported.
    } else {
      alert('The File APIs are not fully supported in this browser.')
    }
  }
  
  _getInitialState() {
    return {
      isInitial: true,
      isLoading: false,
      log: [],
      selectedLog: [],
      selectedSnapshots: [],
    }
  }
  
  componentDidMount() {
    // this._onLoadLog(CCP_LOG) // use this for debugging
  }
  
  _onLoadLog(log) {
    this.setState({
      isInitial: false,
      log: log.map((event, idx) => ({...event, _key: idx})), // 行番号 (key) をプロパティに追加
      selectedLog: [],
      selectedSnapshots: [],
    })
  }
  
  selectLog(selectedLog) {
    this.setState({ selectedLog })
  }
  
  selectSnapshots(selectedSnapshots) {
    this.setState({ selectedSnapshots })
  }
  
  _handleOnDrop(files) {
    const reader = new FileReader()
    reader.onload = (e) => { this._onLoadLog(JSON.parse(e.target.result)) }
    reader.onloadend = () => { this.setState({ isLoading: false }) }
    
    this.setState({ isLoading: true })
    reader.readAsText(files[0])
  }
  
  render() {
    const { isInitial, isLoading, log, selectedLog, selectedSnapshots } = this.state
    const { classes } = this.props
    console.log(this.state)
    
    return (
      <div className={classes.root}>
        <Dropzone
          ref={this._dropzoneRef}
          disableClick
          noClick={true}
          onDrop={this._handleOnDrop}
          accept="text/plain">
            {({getRootProps, isDragActive}) => (
              <div {...getRootProps()}>
                <AppBar position="static">
                  <Toolbar variant="dense">
                    <Typography variant="h6" color="inherit">
                      CCP Log Viewer
                    </Typography>
                  </Toolbar>
                </AppBar>
                
                { (isDragActive) && <DraggingView /> }
                
                { 
                  (isInitial && !isLoading) ? <EmptyView /> :
                  (isLoading) ? <LoadingView /> :
                  <Container className={classes.content}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={3}>
                        <SnapshotListView log={log} 
                          selected={selectedSnapshots} 
                          selectLog={this.selectLog} 
                          selectSnapshots={this.selectSnapshots} />
                      </Grid>
                      <Grid item xs={12} md={9}>
                        <LogView log={log} 
                          selected={selectedLog} />
                      </Grid>
                    </Grid>
                  </Container>
                }
              </div>
            )}
        </Dropzone>
      </div>
    )
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(App)
