import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx';
import { fade, withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import SaveAltIcon from '@material-ui/icons/SaveAlt';

const styles = (theme) => ({
  root: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255, 255, 255, 0.8)',
    zIndex: 999,
  },
  container: {
    width: 600,
    height: 300,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 160,
    color: 'rgba(0,0,0,0.25)',
  },
  text: {
    color: 'rgba(0,0,0,0.5)',
  },
})

class DraggingView extends React.Component {
  render() {
    const { classes } = this.props
    
    return (
      <div className={classes.root}>
        <div className={classes.container}>
          <SaveAltIcon className={classes.icon} />
          <Typography className={classes.text} variant="h5" component="h3">
            Drag &amp; Drop your CCP log file to load
          </Typography>
        </div>
      </div>
    )
  }
}

DraggingView.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(DraggingView)
