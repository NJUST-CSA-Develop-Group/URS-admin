// framework
import * as React from 'react'
// theme & style
import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles'
import { grey } from '@material-ui/core/colors'
// style components
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ExtensionIcon from '@material-ui/icons/Extension'
// drag & drop
import {
    ConnectDragSource,
    ConnectDragPreview,
    DragSource,
    DragSourceConnector,
    DragSourceMonitor
} from 'react-dnd'
// myself utils code
import constValue from '@/utils/constValue'
import { DragData, ExtensionType } from '@/utils/struct'

const style = createStyles({
    hover: {
        backgroundColor: grey[300]
    },
    draggerRoot: {
        marginRight: -16
    },
    dragger: {
        cursor: 'move'
    },
    draggerDisabled: {
        cursor: 'not-allowed'
    }
})

interface ToolItemSourceProps {
    isDragging: boolean
    connectDragSource: ConnectDragSource
    connectDragPreview: ConnectDragPreview
}

interface ToolItemProps extends React.Props<ToolItem>, WithStyles<typeof style> {
    type: ExtensionType
    disabled: boolean
    removeNewItem(): void
}

interface ToolItemState {
    hover: boolean
}

class ToolItem extends React.Component<ToolItemProps & ToolItemSourceProps, ToolItemState> {
    constructor(props: ToolItemProps & ToolItemSourceProps) {
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
    render() {
        const classes = this.props.classes
        return this.props.connectDragPreview(
            <div
                onMouseEnter={this.enter}
                onMouseLeave={this.leave}
                className={this.state.hover ? classes.hover : ''}>
                <ListItem disabled={this.props.disabled}>
                    {this.props.connectDragSource(
                        <div className={classes.draggerRoot}>
                            <ListItemIcon
                                className={
                                    this.props.disabled ? classes.draggerDisabled : classes.dragger
                                }>
                                <ExtensionIcon />
                            </ListItemIcon>
                        </div>
                    )}
                    <ListItemText>{constValue.extensionName[this.props.type]}</ListItemText>
                </ListItem>
            </div>
        )
    }
}

const dragSpec = {
    beginDrag(props: ToolItemProps) {
        return { id: BigInt(-1), originIndex: -1, type: props.type } as DragData
    },
    canDrag(props: ToolItemProps) {
        return !props.disabled
    },
    endDrag(props: ToolItemProps, monitor: DragSourceMonitor) {
        const didDrop = monitor.didDrop()
        if (!didDrop) {
            props.removeNewItem()
        }
    }
}

function dragCollect(connect: DragSourceConnector, monitor: DragSourceMonitor) {
    return {
        connectDragPreview: connect.dragPreview(),
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}

export default withStyles(style)(
    DragSource<ToolItemProps, ToolItemSourceProps>(constValue.DragDropConst, dragSpec, dragCollect)(
        ToolItem
    )
)
