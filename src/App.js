import React, { createRef } from 'react'
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Dropzone from 'react-dropzone';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import './App.css'

import EmptyView from './EmptyView'
import DraggingView from './DraggingView'
import LoadingView from './LoadingView'
import SnapshotListView from './SnapshotListView'
import LogView from './LogView'

// import CCP_LOG from './agent-log' // uncomment this for debugging

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  content: {
    zIndex: 2,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  dropping: {
    background: 'rgba(255,0,0,0.5)',
  },
  sidebar: {
    position: 'sticky',
    top: theme.spacing(2),
  },
})

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = this._getInitialState()
    this.selectLog = this.selectLog.bind(this)
    this.selectSnapshots = this.selectSnapshots.bind(this)
    this._handleOnDrop = this._handleOnDrop.bind(this)
    this._handleExpandLogView = this._handleExpandLogView.bind(this)
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
      isExpanded: false,
      filename: null,
      log: [],
      selectedLog: [],
      selectedSnapshots: [],
    }
  }
  
  componentDidMount() {
    // this._onLoadLog(CCP_LOG) // uncomment this for debugging
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
    
    this.setState({ isLoading: true, filename: files[0].name })
    reader.readAsText(files[0])
  }
  
  _handleExpandLogView() {
    this.setState({ isExpanded: !this.state.isExpanded })
  }
  
  render() {
    const { isInitial, isLoading, isExpanded, filename, log, selectedLog, selectedSnapshots } = this.state
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
                    <Typography variant="h6" color="inherit">
                      { filename && (<span>&nbsp;:&nbsp;{filename}</span>) }
                    </Typography>
                  </Toolbar>
                </AppBar>
                
                { (isDragActive) && <DraggingView /> }
                
                { 
                  (isInitial && !isLoading) ? <EmptyView /> :
                  (isLoading) ? <LoadingView /> :
                  <Container className={classes.content}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={3} style={isExpanded ? {display: 'none'} : {}}>
                        <SnapshotListView
                          className={classes.sidebar}
                          log={log}
                          selected={selectedSnapshots} 
                          selectLog={this.selectLog} 
                          selectSnapshots={this.selectSnapshots} />
                      </Grid>
                      <Grid item xs={12} md={9} style={isExpanded ? {minWidth: '100%', maxWidth: '100%'} : {}}>
                        <LogView log={log} 
                          selected={selectedLog}
                          isExpanded={isExpanded}
                          expand={this._handleExpandLogView} />
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
