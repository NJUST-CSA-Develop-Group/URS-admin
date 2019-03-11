// framework
import * as React from 'react'
// theme & style
import { Theme, WithStyles, withStyles } from '@material-ui/core/styles'
import { grey } from '@material-ui/core/colors'
//import { FlexDirectionProperty } from 'csstype'
// style components
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
//import ListItemIcon from '@material-ui/core/ListItemIcon'
//import ListItemText from '@material-ui/core/ListItemText'
//import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
// myself utils code
//import constValue from '@/utils/constValue'
import { FormItem } from '@/utils/struct'

const style = (_: Theme) => ({
    hover: {
        backgroundColor: grey[100]
    },
    /*iconContent: {
        margin: 0,
        padding: 12
    },
    iconSpace: {
        width: 24
    },*/
    divider: {
        width: '100%'
    }
})

interface GroupEndProps extends React.Props<GroupEnd>, WithStyles<typeof style> {
    fromItem: FormItem
    disabled: boolean
}

interface GroupEndState {
    hover: boolean
}

class GroupEnd extends React.Component<GroupEndProps, GroupEndState> {
    constructor(props: GroupEndProps) {
        super(props)
        this.state = {
            hover: false
        }
    }
    handleEnter = () => {
        this.setState({
            hover: true
        })
    }
    handleLeave = () => {
        this.setState({
            hover: false
        })
    }
    render() {
        const classes = this.props.classes
        return (
            <div>
                <ListItem
                    onMouseEnter={this.handleEnter}
                    onMouseLeave={this.handleLeave}
                    className={this.state.hover ? classes.hover : ''}>
                    <div className={classes.divider}>
                        <Divider />
                    </div>
                    {/*<ListItemIcon>
                        <div className={classes.iconSpace} />
                    </ListItemIcon>
                    <ListItemIcon className={classes.iconContent}>
                        <KeyboardArrowUpIcon />
                    </ListItemIcon>
                    <ListItemText>
                        {'分组 : '}
                        {this.props.fromItem.name}
                    </ListItemText>*/}
                </ListItem>
            </div>
        )
    }
}

export default withStyles(style)(GroupEnd)
