import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx';
import { scroller } from 'react-scroll';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';

const styles = (theme) => ({
  root: {},
  header: {
    position: 'static',
    width: '100%',
    display: 'flex',
    zIndex: 1100,
    boxSizing: 'border-box',
    flexShrink: 0,
    flexDirection: 'column',
    padding: theme.spacing(1, 2),
    background: '#f7f7f7',
  },
  headerInside: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    flexGrow: 1,
    display: 'block',
  },
  content: {
    padding: theme.spacing(0, 0),
  },
  list: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
  },
  listSection: {
    backgroundColor: 'inherit',
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0,
  },
  item: {
    padding: theme.spacing(0.5, 2),
  },
  selected: {
    background: 'rgba(255,255,0,0.3)',
  },
})

class SnapshotListView extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = this._getInitialState()
  }
  
  _getInitialState() {
    return {
      selected: []
    }
  }
  
  _handleClickSnapshot(e, snapshot) {
    e.preventDefault()
    console.log(snapshot)
    this.props.selectLog(snapshot._targetEventKeys)
    this.props.selectSnapshots([snapshot._key])
    
    const anchor = `L${snapshot._targetEventKeys[0]}`
    scroller.scrollTo(anchor, {
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart',
    })
  }
  
  render() {
    const { classes, log, selected = [] } = this.props
    console.log(selected)
    
    const snapshots = log
      .filter((event) => (event.text === "GET_AGENT_SNAPSHOT succeeded."))
      .flatMap((event) => {
        return event.objects.map((object, idx) => ({
          ...object.snapshot,
          _event: event,
          _key: `${event._key}-${idx}`,
          _date: object.snapshot.snapshotTimestamp.substring(0, 10),
          _time: object.snapshot.snapshotTimestamp.substring(11, 23),
          _timezone: object.snapshot.snapshotTimestamp.substring(23),
        }))
      })
      .map((snapshot, idx, arr) => {
        let eventKeyFrom = snapshot._event._key
        let eventKeyTo = (idx != arr.length - 1) ? arr[idx + 1]._event._key : log[log.length - 1]._key
        return {
          ...snapshot,
          _targetEventKeys: Array.from(Array(eventKeyTo - eventKeyFrom), (v, k) => (k + eventKeyFrom))
        }
      })
      
    console.log(snapshots)
    
    const snapshotsByDate = snapshots
      .reduce((acc, snapshot) => {
        if (snapshot._date in acc) { acc[snapshot._date].push(snapshot) }
        else acc[snapshot._date] = [snapshot]
        return acc
      }, {})
    
    console.log(snapshotsByDate)
    
    return (
      <div className="SnapshotListView">
        <Paper className={classes.root}>
          <div className={classes.header}>
            <div className={classes.headerInside}>
              <Typography className={classes.title} variant="h6" component="h3">
                Snapshots
              </Typography>
            </div>
          </div>
          <div className={classes.content}>
            <List className={classes.list} subheader={<li />}>
              {Object.keys(snapshotsByDate).map(date => (
                <li key={`section-${date}`} className={classes.listSection}>
                  <ul className={classes.ul}>
                    <ListSubheader>{date}</ListSubheader>
                    {snapshotsByDate[date].map(snapshot => (
                      <ListItem button key={`item-${snapshot._key}`}
                        className={clsx(classes.item, {
                          [classes.selected]: selected.includes(snapshot._key),
                        })}
                        onClick={(e) => this._handleClickSnapshot(e, snapshot)}>
                        <ListItemText primary={`${snapshot._time}${snapshot._timezone} ${snapshot.state.name}`} />
                      </ListItem>
                    ))}
                  </ul>
                </li>
              ))}
            </List>
          </div>
        </Paper>
      </div>
    )
  }
}

SnapshotListView.propTypes = {
  classes: PropTypes.object.isRequired,
  log: PropTypes.array.isRequired,
  selected: PropTypes.array,
  selectLog: PropTypes.func.isRequired,
  selectSnapshots: PropTypes.func.isRequired,
}

export default withStyles(styles)(SnapshotListView)
