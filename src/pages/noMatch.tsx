import * as React from 'react'
import { createStyles, WithStyles, withStyles } from '@material-ui/core'

const style = createStyles({
    root: {
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    }
})

interface NoMatchProps extends React.Props<NoMatch>, WithStyles<typeof style> {}

interface NoMatchState {}

class NoMatch extends React.Component<NoMatchProps, NoMatchState> {
    render() {
        return (
            <div className={this.props.classes.root}>
                <h1>404</h1>
                <p>file not found.</p>
            </div>
        )
    }
}

export default withStyles(style)(NoMatch)
