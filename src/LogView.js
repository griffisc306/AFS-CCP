import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx';
import { fade, withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';

const styles = (theme) => ({
  root: {},
  menuButton: {
    marginRight: theme.spacing(2),
  },
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
    minWidth: 120,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  regexFilter: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.45),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.75),
    },
    marginLeft: 0,
    flexGrow: 1,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
  },
  levelFilter: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  content: {
    width: 'auto',
    overflowX: 'scroll',
    fontFamily: '"Monaco", monospace',
    fontSize: 12,
    padding: theme.spacing(2, 0),
    whiteSpace: 'pre',
    backgroundColor: 'transparent',
    color: '#222222',
    fontWeight: 400,
    outline: 'none',
  },
  rows: {
    width: 'max-content',
  },
  row: {
    padding: theme.spacing(0, 2),
    width: '100%',
    '&:hover': {
      background: 'rgba(0,0,0,0.1)',
    }
  },
  rowError: {
    color: 'red',
    fontWeight: 'bold',
  },
  rowWarn: {
    color: '#ca9106',
    fontWeight: 'bold',
  },
  rowInfo: {
    color: '#005eda',
  },
  rowTrace: {
    color: '#616161',
  },
  rowDebug: {
    color: 'inherit',
  },
  rowLog: {
    color: '#616161',
  },
  rowSelected: {
    background: 'rgba(255,255,0,0.3)',
  },
  timestamp: {},
  level: {},
  text: {},
})

const LogLevel = {
  'ERROR': { value: 6, string: 'error' },
  'WARN':  { value: 5, string: 'warn' },
  'INFO':  { value: 4, string: 'info' },
  'TRACE': { value: 3, string: 'trace' },
  'DEBUG': { value: 2, string: 'debug' },
  'LOG':   { value: 1, string: 'log' },
}

class LogView extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = this._getInitialState()
    this._handleChangeLevelFilter = this._handleChangeLevelFilter.bind(this)
    this._handleChangeRegexFilter = this._handleChangeRegexFilter.bind(this)
  }
  
  _getInitialState() {
    return {
      levelFilter: 'LOG',
      regexFilter: '',
    }
  }
  
  _handleChangeLevelFilter(event) {
    event.preventDefault()
    this.setState({ levelFilter: event.target.value })
  }
  
  _handleChangeRegexFilter(event) {
    event.preventDefault()
    this.setState({ regexFilter: event.target.value })
  }
  
  render() {
    const { classes, log, selected = [] } = this.props
    const { levelFilter, regexFilter } = this.state
    console.log(selected)
    
    let re = null, regexError = null
    try {
      re = regexFilter !== '' ? new RegExp(regexFilter) : null
    } catch (err) {
      console.error(err)
      regexError = err.message
    }
    
    return (
      <div className="LogView">
        <Paper className={classes.root}>
          <div className={classes.header}>
            <div className={classes.headerInside}>
              <Typography className={classes.title} variant="h6" component="h3">
                Log
              </Typography>
              <div className={classes.regexFilter}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
                <InputBase
                  placeholder="Filter…"
                  value={regexFilter}
                  onChange={this._handleChangeRegexFilter}
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                  inputProps={{ 'aria-label': 'search' }}
                />
              </div>
              <FormControl className={classes.levelFilter}>
                <Select
                  value={levelFilter}
                  onChange={this._handleChangeLevelFilter}
                  inputProps={{
                    name: 'level',
                    id: 'level-filter',
                  }}
                >
                  <MenuItem value={"ERROR"}>ERROR</MenuItem>
                  <MenuItem value={"WARN"}>WARN</MenuItem>
                  <MenuItem value={"INFO"}>INFO</MenuItem>
                  <MenuItem value={"TRACE"}>TRACE</MenuItem>
                  <MenuItem value={"DEBUG"}>DEBUG</MenuItem>
                  <MenuItem value={"LOG"}>LOG</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
          <div className={classes.content}>
            <div className={classes.rows}>
              {log.map((event) => {
                if (LogLevel[event.level].value < LogLevel[levelFilter].value
                    || (re && !re.exec(`${event.time} ${event.level} ${event.text}`))) {
                  return null // ignore this line
                } else {
                  return (
                    <div key={event._key} className={clsx(classes.row, {
                      [classes.rowSelected]: selected.includes(event._key),
                      [classes.rowError]: event.level === 'ERROR',
                      [classes.rowWarn]: event.level === 'WARN',
                      [classes.rowInfo]: event.level === 'INFO',
                      [classes.rowTrace]: event.level === 'TRACE',
                      [classes.rowDebug]: event.level === 'DEBUG',
                      [classes.rowLog]: event.level === 'LOG',
                    })}>
                      <span className={classes.timestamp}>{event.time}</span>&nbsp;
                      <span className={classes.level}>{event.level}</span>&nbsp;
                      <span className={classes.text}>{event.text}</span>
                    </div>
                  )
                }
              })}
            </div>
          </div>
        </Paper>
      </div>
    )
  }
}

LogView.propTypes = {
  classes: PropTypes.object.isRequired,
  log: PropTypes.array.isRequired,
  selected: PropTypes.array,
}

export default withStyles(styles)(LogView)
