// framework
import * as React from 'react'
// theme & style
import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles'
import { grey } from '@material-ui/core/colors'
// style components
import IconButton from '@material-ui/core/IconButton'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import DeleteIcon from '@material-ui/icons/Delete'

const style = createStyles({
    hover: {
        backgroundColor: grey[300]
    }
})

interface CaseItemProps extends React.Props<CaseItem>, WithStyles<typeof style> {
    value: string
    disabled: boolean
    remove(value: string): void
}

interface CaseItemState {
    hover: boolean
}

class CaseItem extends React.Component<CaseItemProps, CaseItemState> {
    constructor(props: CaseItemProps) {
        super(props)
        this.state = {
            hover: false
        }
    }
    enter = () => {
        this.setState({
            hover: true
        })
    }
    leave = () => {
        this.setState({
            hover: false
        })
    }
    remove = () => {
        this.props.remove(this.props.value)
    }
    render() {
        const classes = this.props.classes
        return (
            <ListItem
                className={this.state.hover ? classes.hover : ''}
                onMouseEnter={this.enter}
                onMouseLeave={this.leave}>
                <ListItemText>{this.props.value}</ListItemText>
                <IconButton onClick={this.remove} disabled={this.props.disabled}>
                    <DeleteIcon />
                </IconButton>
            </ListItem>
        )
    }
}

export default withStyles(style)(CaseItem)
