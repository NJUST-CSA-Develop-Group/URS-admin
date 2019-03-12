// framework
import * as React from 'react'
// theme & style
import { Theme, WithStyles, withStyles } from '@material-ui/core/styles'
import { grey } from '@material-ui/core/colors'
//import { FlexDirectionProperty } from 'csstype'
// style components
import IconButton from '@material-ui/core/IconButton'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { PopoverPosition } from '@material-ui/core/Popover'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import DeleteIcon from '@material-ui/icons/Delete'
import DragHandleIcon from '@material-ui/icons/DragHandle'
import EditIcon from '@material-ui/icons/Edit'
//import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
//import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight'
// drag & drop
import {
    ConnectDragSource,
    ConnectDragPreview,
    DragSource,
    DragSourceConnector,
    DragSourceMonitor,
    ConnectDropTarget,
    DropTarget,
    DropTargetConnector,
    DropTargetMonitor
} from 'react-dnd'
// myself utils code
import constValue from '@/utils/constValue'
import { FormItem, DragData } from '@/utils/struct'

const style = (_: Theme) => ({
    hover: {
        backgroundColor: grey[100]
    },
    dragger: {
        cursor: 'move'
    },
    draggerDisabled: {
        cursor: 'not-allowed'
    },
    name: {
        display: 'flex',
        alignItems: 'center'
    }
})

interface GroupStartSourceProps {
    isDragging: boolean
    connectDragSource: ConnectDragSource
    connectDragPreview: ConnectDragPreview
}

interface GroupStartTargetProps {
    connectDropTarget: ConnectDropTarget
}

interface GroupStartProps extends React.Props<GroupStart>, WithStyles<typeof style> {
    fromItem: FormItem
    disabled: boolean
    fold(id: number): void
    unfold(): void
    addItem(data: DragData): void
    getIndex(id: number): number
    moveItem(id: number, index: number): void
    //removeAddItem(): boolean
    //update(id: number, name: FormItemType, value: string): void
    nameUpdate(id: number, value: string): void
    delete(id: number): void
    contextMenu(id: number, position: PopoverPosition): void
}

interface GroupStartState {
    hover: boolean
    nameEdit: boolean
}

class GroupStart extends React.Component<
    GroupStartProps & GroupStartSourceProps & GroupStartTargetProps,
    GroupStartState
> {
    constructor(props: GroupStartProps & GroupStartSourceProps & GroupStartTargetProps) {
        super(props)
        this.state = {
            hover: false,
            nameEdit: false
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
    change = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.props.nameUpdate(this.props.fromItem.id, e.target.value)
    }
    delete = () => {
        this.props.delete(this.props.fromItem.id)
    }
    edit = () => {
        this.setState({
            nameEdit: true
        })
    }
    blur = () => {
        this.setState({
            nameEdit: false
        })
    }
    menu = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault()
        console.log(e.clientX, e.clientY)
        this.props.contextMenu(this.props.fromItem.id, { left: e.clientX, top: e.clientY })
        this.setState({
            hover: false
        })
    }
    render() {
        const classes = this.props.classes
        return this.props.connectDragPreview(
            this.props.connectDropTarget(
                <div onContextMenu={this.menu}>
                    <ListItem
                        onMouseEnter={this.handleEnter}
                        onMouseLeave={this.handleLeave}
                        className={this.state.hover ? classes.hover : ''}>
                        {this.props.connectDragSource(
                            <div>
                                <ListItemIcon>
                                    <DragHandleIcon
                                        className={
                                            this.props.disabled
                                                ? classes.draggerDisabled
                                                : classes.dragger
                                        }
                                    />
                                </ListItemIcon>
                            </div>
                        )}
                        <IconButton onClick={this.edit} disabled={this.props.disabled}>
                            <EditIcon />
                        </IconButton>
                        <ListItemText>
                            <Typography className={classes.name} component="div">
                                {'分组 : '}
                                {this.state.nameEdit ? (
                                    <TextField
                                        autoFocus
                                        value={this.props.fromItem.name}
                                        onBlur={this.blur}
                                        onChange={this.change}
                                    />
                                ) : (
                                    this.props.fromItem.name
                                )}
                            </Typography>
                        </ListItemText>
                        <IconButton onClick={this.delete} disabled={this.props.disabled}>
                            <DeleteIcon />
                        </IconButton>
                    </ListItem>
                </div>
            )
        )
    }
}

const dragSpec = {
    beginDrag(props: GroupStartProps) {
        props.fold(props.fromItem.id)
        return {
            id: props.fromItem.id,
            originIndex: props.getIndex(props.fromItem.id),
            type: props.fromItem.extension
        } as DragData
    },
    canDrag(props: GroupStartProps) {
        return !props.disabled
    },
    endDrag(props: GroupStartProps, monitor: DragSourceMonitor) {
        const { id: dropId, originIndex } = monitor.getItem()
        const didDrop = monitor.didDrop()
        if (!didDrop) {
            props.moveItem(dropId, originIndex)
        }
        props.unfold()
    }
}

function dragCollect(connect: DragSourceConnector, monitor: DragSourceMonitor) {
    return {
        connectDragPreview: connect.dragPreview(),
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}

const dropSpec = {
    canDrop() {
        return false
    },
    hover(props: GroupStartProps, monitor: DropTargetMonitor) {
        if (monitor.getItem().id == -1) {
            props.addItem(monitor.getItem())
        }
        const { id: dragId } = monitor.getItem()
        const overId = props.fromItem.id
        if (dragId !== overId) {
            const overIndex = props.getIndex(overId)
            props.moveItem(dragId, overIndex)
        }
    }
}

function dropCollect(connect: DropTargetConnector) {
    return {
        connectDropTarget: connect.dropTarget()
    }
}

export default withStyles(style)(
    DropTarget<GroupStartProps, GroupStartTargetProps>(
        constValue.DragDropConst,
        dropSpec,
        dropCollect
    )(
        DragSource<GroupStartProps, GroupStartSourceProps>(
            constValue.DragDropConst,
            dragSpec,
            dragCollect
        )(GroupStart)
    )
)
