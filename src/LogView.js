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
import Button from '@material-ui/core/Button';
import UnfoldLess from '@material-ui/icons/UnfoldLess';
import UnfoldMore from '@material-ui/icons/UnfoldMore';
import ReactJson from 'react-json-view';

const styles = (theme) => ({
  root: {},
  menuButton: {
    marginRight: theme.spacing(2),
  },
  header: {
    position: 'sticky',
    top: 0,
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
  expand: {
    display: 'none',
    minWidth: 16,
    [theme.breakpoints.up('md')]: {
      display: 'inherit',
    },
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
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  line: {
    display: 'flex',
    flexDirection: 'row',
    padding: theme.spacing(0, 2, 0, 0),
    '&:hover': {
      background: 'rgba(0,0,0,0.1)',
    },
    '&$error': {
      color: 'red',
      fontWeight: 'bold',
    },
    '&$warn': {
      color: '#ca9106',
      fontWeight: 'bold',
    },
    '&$info': {
      color: '#005eda',
    },
    '&$trace': {
      color: '#616161',
    },
    '&$debug': {
      color: 'inherit',
    },
    '&$log': {
      color: '#616161',
    },
    '&$selected': {
      background: 'rgba(255,255,0,0.3)',
    },
  },
  moreInfoToggle: {
    width: theme.spacing(2),
    textAlign: 'center',
    '&$notExists': {},
    '&$exists': {
      '&$open': {
        '&::after': {
          content: `"-"`,
        }
      },
      '&$closed': {
        '&::after': {
          content: `"+"`,
        }
      }
    }
  },
  component: {},
  timestamp: {},
  level: {},
  text: {},
  moreInfo: {
    background: '#f5f5f588',
    boxShadow: 'inset 0px 10px 16px -10px #0000001a, inset 0px -10px 16px -10px #0000001a',
    padding: theme.spacing(2, 1),
    fontSize: 14,
    zoom: 0.9,
    '&$closed': {
      display: 'none',
    },
  },
  error: {},
  warn: {},
  info: {},
  trace: {},
  debug: {},
  log: {},
  selected: {},
  exists: {},
  notExists: {},
  open: {},
  closed: {},
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
      moreInfoOpen: [],
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
  
  _toggleMoreInfo(key) {
    const moreInfoOpen = this.state.moreInfoOpen.slice()
    let idx = moreInfoOpen.indexOf(key)
    
    if (idx < 0) {
      moreInfoOpen.push(key)
    } else {
      moreInfoOpen.splice(idx, 1)
    }
    
    this.setState({ moreInfoOpen })
  }
  
  render() {
    const { classes, className: classNameProp, log, selected = [], isExpanded = false, expand } = this.props
    const { levelFilter, regexFilter, moreInfoOpen } = this.state
    
    let re = null, regexError = null
    try {
      re = regexFilter !== '' ? new RegExp(regexFilter) : null
    } catch (err) {
      console.error(err)
      regexError = err.message
    }
    
    return (
      <div className="LogView" className={clsx(classes.root, classNameProp)}>
        <Paper>
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
              
              { !isExpanded ?
                <Button className={classes.expand} onClick={() => expand()}><UnfoldMore style={{transform: 'rotate(90deg)'}} /></Button> :
                <Button className={classes.expand} onClick={() => expand()}><UnfoldLess style={{transform: 'rotate(90deg)'}} /></Button> }
            </div>
          </div>
          <div className={classes.content}>
            <div className={classes.rows}>
              {log.map((event) => {
                let hasMoreInfo = event.exception || event.objects.length > 0
                
                if (LogLevel[event.level].value < LogLevel[levelFilter].value
                    || (re && !re.exec(`${event.time} ${event.level} ${event.text}`))) {
                  return null // ignore this line
                } else {
                  return (
                    <div id={`L${event._key}`} key={event._key} className={classes.row}>
                      
                      <div className={clsx(classes.line, {
                        [classes.selected]: selected.includes(event._key),
                        [classes.wrror]: event.level === 'ERROR',
                        [classes.warn]: event.level === 'WARN',
                        [classes.info]: event.level === 'INFO',
                        [classes.trace]: event.level === 'TRACE',
                        [classes.debug]: event.level === 'DEBUG',
                        [classes.log]: event.level === 'LOG',
                      })}>
                        <div className={clsx(classes.moreInfoToggle, {
                          [classes.exists]: hasMoreInfo,
                          [classes.notExists]: !hasMoreInfo,
                          [classes.open]: moreInfoOpen.includes(event._key),
                          [classes.closed]: !moreInfoOpen.includes(event._key),
                        })} onClick={() => hasMoreInfo && this._toggleMoreInfo(event._key)}>
                        </div>
                        <div style={{ display: 'inline' }}>
                          <span className={classes.timestamp}>{event.time}</span>&nbsp;
                          <span className={classes.component}>{event.component}</span>&nbsp;
                          <span className={classes.level}>{event.level}</span>&nbsp;
                          <span className={classes.text}>{event.text}</span>
                        </div>
                      </div>
                      
                      { hasMoreInfo &&
                        <div className={clsx(classes.moreInfo, {
                          [classes.closed]: !moreInfoOpen.includes(event._key)
                        })}>
                          <ReactJson src={event} name={false} displayObjectSize={false} displayDataTypes={false} />
                        </div>
                      }
                      
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
  className: PropTypes.string,
  log: PropTypes.array.isRequired,
  selected: PropTypes.array,
  isExpanded: PropTypes.bool,
  expand: PropTypes.func.isRequired,
}

export default withStyles(styles)(LogView)
