// framework
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
// theme & style
import {
    createMuiTheme,
    MuiThemeProvider,
    createStyles,
    WithStyles,
    withStyles
} from '@material-ui/core/styles'
import { blue, pink } from '@material-ui/core/colors'
// style components
import CssBaseline from '@material-ui/core/CssBaseline'
import Hidden from '@material-ui/core/Hidden'
import Typography from '@material-ui/core/Typography'
// drag & drop
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
// myself utils code
import constValue from '@/utils/constValue'
// pages
import Login from '@/pages/login'
import Index from '@/pages/index'
import CspFree from '@/pages/cspFree'
import NoMatch from '@/pages/noMatch'

const theme = createMuiTheme({
    palette: {
        primary: blue,
        secondary: pink
    },
    typography: {
        useNextVariants: true
    }
})

const style = createStyles({
    sizeWarning: {
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    root: {
        overflowY: 'hidden'
    }
})

interface AppProps extends React.Props<App>, WithStyles<typeof style> {}

interface AppState {}

class App extends React.Component<AppProps, AppState> {
    render() {
        const classes = this.props.classes
        return (
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                <Hidden smUp>
                    <div className={classes.sizeWarning}>
                        <Typography>
                            <strong>请在尺寸更大的屏幕上使用管理端</strong>
                        </Typography>
                    </div>
                </Hidden>
                <Hidden xsDown className={classes.root}>
                    <Router basename={constValue.rootPath}>
                        <Switch>
                            <Redirect from="/" to="/activity/_" exact strict />
                            <Route path="/login" exact component={Login} />
                            <Route path="/activity/:id" exact component={Index} />
                            <Route path="/csp" exact component={CspFree} />
                            <Route component={NoMatch} />
                        </Switch>
                    </Router>
                </Hidden>
            </MuiThemeProvider>
        )
    }
}

const Root = DragDropContext(HTML5Backend)(withStyles(style)(App))

ReactDOM.render(<Root />, document.getElementById('app'))
