// framework
import * as React from 'react'
// theme & style
import { Theme, WithStyles, withStyles } from '@material-ui/core/styles'
// style components
import Collapse from '@material-ui/core/Collapse'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight'

const style = (theme: Theme) => ({
    content: {
        paddingLeft: theme.spacing.unit * 4
    }
})

interface FolderProps extends React.Props<Folder>, WithStyles<typeof style> {
    name: string
    disabled: boolean
}

interface FolderState {
    expand: boolean
}

class Folder extends React.Component<FolderProps, FolderState> {
    constructor(props: FolderProps) {
        super(props)
        this.state = {
            expand: false
        }
    }
    toggleExpand = () => {
        this.setState({
            expand: !this.state.expand
        })
    }
    render() {
        const classes = this.props.classes
        return [
            <ListItem
                button
                onClick={this.toggleExpand}
                disabled={this.props.disabled}
                key={this.props.name + '-item'}>
                {this.state.expand ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
                <ListItemText>{this.props.name}</ListItemText>
            </ListItem>,
            <Collapse in={this.state.expand} key={this.props.name + '-folder'}>
                <List disablePadding className={classes.content}>
                    {this.state.expand && this.props.children}
                </List>
            </Collapse>,
            <Divider key={this.props.name + '-divider'} />
        ]
    }
}

export default withStyles(style)(Folder)
