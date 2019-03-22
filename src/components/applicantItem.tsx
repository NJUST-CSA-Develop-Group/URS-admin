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
import NotesIcon from '@material-ui/icons/Notes'
// myself utils code
import { ApplicantItemStruct } from '@/utils/struct'

const style = createStyles({
    hover: {
        backgroundColor: grey[300]
    }
})

interface ApplicantItemProps extends React.Props<ApplicantItem>, WithStyles<typeof style> {
    value: ApplicantItemStruct
    remove(id: string, unique: string): void
    detail(data: ApplicantItemStruct): void
}

interface ApplicantItemState {
    hover: boolean
}

class ApplicantItem extends React.Component<ApplicantItemProps, ApplicantItemState> {
    constructor(props: ApplicantItemProps) {
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
    detail = () => {
        this.props.detail(this.props.value)
    }
    remove = () => {
        this.props.remove(this.props.value.id, this.props.value.unique)
    }
    render() {
        const classes = this.props.classes
        return (
            <ListItem
                className={this.state.hover ? classes.hover : ''}
                onMouseEnter={this.enter}
                onMouseLeave={this.leave}>
                <IconButton onClick={this.detail}>
                    <NotesIcon />
                </IconButton>
                <ListItemText>{this.props.value.unique || this.props.value.id}</ListItemText>
                <IconButton onClick={this.remove}>
                    <DeleteIcon />
                </IconButton>
            </ListItem>
        )
    }
}

export default withStyles(style)(ApplicantItem)
