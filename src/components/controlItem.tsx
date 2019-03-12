// framework
import * as React from 'react'
// theme & style
import { Theme, WithStyles, withStyles } from '@material-ui/core/styles'
import { grey } from '@material-ui/core/colors'
import { FlexDirectionProperty } from 'csstype'
// style components
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Input from '@material-ui/core/Input'
import InputAdornment from '@material-ui/core/InputAdornment'
import InputLabel from '@material-ui/core/InputLabel'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Paper from '@material-ui/core/Paper'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import Switch from '@material-ui/core/Switch'
import TextField from '@material-ui/core/TextField'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'
import DragHandleIcon from '@material-ui/icons/DragHandle'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight'
import RefreshIcon from '@material-ui/icons/Refresh'
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
import { FormItem, FormItemType, DragData } from '@/utils/struct'
// myself components
import CaseItem from '@/components/caseItem'

const style = (theme: Theme) => ({
    hover: {
        backgroundColor: grey[100]
    },
    dragger: {
        cursor: 'move'
    },
    draggerDisabled: {
        cursor: 'not-allowed'
    },
    content: {
        backgroundColor: grey[100],
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 4}px`
    },
    itemContent: {
        display: 'flex',
        flexDirection: 'column' as FlexDirectionProperty,
        paddingRight: theme.spacing.unit * 4
    },
    caseContent: {
        marginTop: theme.spacing.unit * 2,
        paddingTop: theme.spacing.unit,
        display: 'flex',
        flexDirection: 'column' as FlexDirectionProperty
    },
    caseInput: {
        marginLeft: theme.spacing.unit * 2,
        marginRight: theme.spacing.unit * 2
    }
})

interface ControlItemSourceProps {
    isDragging: boolean
    connectDragSource: ConnectDragSource
    connectDragPreview: ConnectDragPreview
}

interface ControlItemTargetProps {
    connectDropTarget: ConnectDropTarget
}

interface ControlItemProps extends React.Props<ControlItem>, WithStyles<typeof style> {
    fromItem: FormItem
    disabled: boolean
    addItem(data: DragData): void
    getIndex(id: number): number
    moveItem(id: number, index: number): void
    //removeAddItem(): boolean
    update(
        id: number,
        name: FormItemType,
        value: string | boolean | undefined | number[] | string[]
    ): void
    delete(id: number): void
    caseAdd(id: number, value: string): void
    caseRemove(id: number, index: number): void
}

interface ControlItemState {
    hover: boolean
    expand: boolean
    addCase: string
    addCaseError: string
}

class ControlItem extends React.Component<
    ControlItemProps & ControlItemSourceProps & ControlItemTargetProps,
    ControlItemState
> {
    constructor(props: ControlItemProps & ControlItemSourceProps & ControlItemTargetProps) {
        super(props)
        this.state = {
            hover: false,
            expand: false,
            addCase: '',
            addCaseError: ''
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
    toogleExpand = () => {
        this.setState({
            expand: !this.state.expand
        })
    }
    handleAddCase = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            addCase: e.target.value,
            addCaseError: ''
        })
    }
    inputUpdate = (
        e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>
    ) => {
        this.props.update(this.props.fromItem.id, e.target.name as FormItemType, e.target.value)
    }
    switchUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.props.update(this.props.fromItem.id, e.target.value as FormItemType, e.target.checked)
    }
    rangeUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
        let range = this.props.fromItem.range
        if (e.target.id === 'minValue') {
            range[0] = parseInt(e.target.value)
        } else if (e.target.id === 'maxValue') {
            range[1] = parseInt(e.target.value)
        }
        this.props.update(this.props.fromItem.id, 'range', range)
    }
    delete = () => {
        this.props.delete(this.props.fromItem.id)
    }
    caseAdd = () => {
        if (this.props.fromItem.case!.indexOf(this.state.addCase) >= 0) {
            this.setState({
                addCaseError: '已经存在这个选项'
            })
            return
        }
        this.props.caseAdd(this.props.fromItem.id, this.state.addCase)
        this.setState({
            addCase: ''
        })
    }
    caseRemove = (value: string) => {
        let index = this.props.fromItem.case!.indexOf(value)
        this.props.caseRemove(this.props.fromItem.id, index)
    }
    caseReset = () => {
        this.props.update(
            this.props.fromItem.id,
            'case',
            constValue.defaultCase(this.props.fromItem.extension)
        )
    }
    render() {
        const classes = this.props.classes
        return this.props.connectDragPreview(
            this.props.connectDropTarget(
                <div>
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
                        <IconButton onClick={this.toogleExpand}>
                            {this.state.expand ? (
                                <KeyboardArrowDownIcon />
                            ) : (
                                <KeyboardArrowRightIcon />
                            )}
                        </IconButton>
                        <ListItemText>
                            {constValue.extensionName[this.props.fromItem.extension]}
                            {' : '}
                            {this.props.fromItem.name}
                        </ListItemText>
                        <IconButton onClick={this.delete} disabled={this.props.disabled}>
                            <DeleteIcon />
                        </IconButton>
                    </ListItem>
                    {this.state.expand && (
                        <div className={classes.content}>
                            <Grid container>
                                <Grid item xs={12} md={6}>
                                    <FormControl className={classes.itemContent} required>
                                        <InputLabel htmlFor="name">名称</InputLabel>
                                        <Input
                                            id="name"
                                            name="name"
                                            required
                                            value={this.props.fromItem.name}
                                            onChange={this.inputUpdate}
                                            disabled={this.props.disabled}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl className={classes.itemContent}>
                                        <InputLabel htmlFor="tip">填写提示</InputLabel>
                                        <Input
                                            id="tip"
                                            name="tip"
                                            required
                                            value={this.props.fromItem.tip}
                                            onChange={this.inputUpdate}
                                            disabled={this.props.disabled}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControlLabel
                                        label="是否必填"
                                        control={
                                            <Switch
                                                checked={this.props.fromItem.require}
                                                onChange={this.switchUpdate}
                                                value="require"
                                                disabled={this.props.disabled}
                                            />
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControlLabel
                                        label="是否验证唯一性"
                                        control={
                                            <Switch
                                                checked={this.props.fromItem.unique}
                                                onChange={this.switchUpdate}
                                                value="unique"
                                                disabled={this.props.disabled}
                                            />
                                        }
                                    />
                                </Grid>
                                {this.props.fromItem.rangeName != '' && (
                                    <Grid item xs={12}>
                                        <FormControlLabel
                                            label="是否使用范围限制"
                                            control={
                                                <Switch
                                                    checked={this.props.fromItem.useRange}
                                                    onChange={this.switchUpdate}
                                                    value="useRange"
                                                    disabled={this.props.disabled}
                                                />
                                            }
                                        />
                                    </Grid>
                                )}
                                {this.props.fromItem.rangeName != '' && (
                                    <Grid item xs={12} md={6}>
                                        <FormControl
                                            className={classes.itemContent}
                                            disabled={
                                                !this.props.fromItem.useRange || this.props.disabled
                                            }>
                                            <InputLabel htmlFor="minValue">
                                                最小{this.props.fromItem.rangeName}
                                            </InputLabel>
                                            <Input
                                                id="minValue"
                                                type="number"
                                                value={this.props.fromItem.range[0]}
                                                onChange={this.rangeUpdate}
                                            />
                                        </FormControl>
                                    </Grid>
                                )}
                                {this.props.fromItem.rangeName != '' && (
                                    <Grid item xs={12} md={6}>
                                        <FormControl
                                            className={classes.itemContent}
                                            disabled={
                                                !this.props.fromItem.useRange || this.props.disabled
                                            }>
                                            <InputLabel htmlFor="maxValue">
                                                最大{this.props.fromItem.rangeName}
                                            </InputLabel>
                                            <Input
                                                id="maxValue"
                                                type="number"
                                                value={this.props.fromItem.range[1]}
                                                onChange={this.rangeUpdate}
                                            />
                                        </FormControl>
                                    </Grid>
                                )}
                                <Grid item xs={12} md={6}>
                                    <FormControl className={classes.itemContent}>
                                        <InputLabel htmlFor="defaultValue">默认值</InputLabel>
                                        {this.props.fromItem.case != undefined ? (
                                            <Select
                                                value={this.props.fromItem.defaultValue}
                                                onChange={this.inputUpdate}
                                                disabled={this.props.disabled}
                                                inputProps={{
                                                    id: 'defaultValue',
                                                    name: 'defaultValue'
                                                }}>
                                                <MenuItem value="">
                                                    <em>无默认值</em>
                                                </MenuItem>
                                                {this.props.fromItem.case.map((value) => (
                                                    <MenuItem value={value} key={value}>
                                                        {value}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        ) : (
                                            <Input
                                                id="defaultValue"
                                                name="defaultValue"
                                                value={this.props.fromItem.defaultValue}
                                                onChange={this.inputUpdate}
                                                disabled={this.props.disabled}
                                            />
                                        )}
                                    </FormControl>
                                    {this.props.fromItem.caseEditable && (
                                        <div className={classes.itemContent}>
                                            <Paper className={classes.caseContent}>
                                                <FormControl
                                                    className={classes.caseInput}
                                                    error={this.state.addCaseError !== ''}>
                                                    <InputLabel htmlFor="addCase">
                                                        新选项
                                                    </InputLabel>
                                                    <Input
                                                        id="addCase"
                                                        fullWidth
                                                        value={this.state.addCase}
                                                        onChange={this.handleAddCase}
                                                        disabled={this.props.disabled}
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    disabled={
                                                                        this.state.addCase === '' ||
                                                                        this.props.disabled
                                                                    }
                                                                    onClick={this.caseAdd}>
                                                                    <AddIcon />
                                                                </IconButton>
                                                            </InputAdornment>
                                                        }
                                                    />
                                                    <FormHelperText>
                                                        {this.state.addCaseError}
                                                    </FormHelperText>
                                                </FormControl>
                                                <List>
                                                    {this.props.fromItem.case!.map((value) => (
                                                        <CaseItem
                                                            value={value}
                                                            key={value}
                                                            remove={this.caseRemove}
                                                            disabled={this.props.disabled}
                                                        />
                                                    ))}
                                                    <ListItem
                                                        button
                                                        onClick={this.caseReset}
                                                        disabled={this.props.disabled}>
                                                        <ListItemIcon>
                                                            <RefreshIcon />
                                                        </ListItemIcon>
                                                        <ListItemText>重置选项</ListItemText>
                                                    </ListItem>
                                                </List>
                                            </Paper>
                                        </div>
                                    )}
                                </Grid>
                                <Grid item xs={12} md={this.props.fromItem.caseEditable ? 6 : 12}>
                                    <FormControl className={classes.itemContent}>
                                        <TextField
                                            id="description"
                                            name="description"
                                            variant="outlined"
                                            multiline
                                            placeholder="描述"
                                            margin="normal"
                                            value={this.props.fromItem.description}
                                            onChange={this.inputUpdate}
                                            disabled={this.props.disabled}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </div>
                    )}
                </div>
            )
        )
    }
}

const dragSpec = {
    beginDrag(props: ControlItemProps) {
        return {
            id: props.fromItem.id,
            originIndex: props.getIndex(props.fromItem.id),
            type: props.fromItem.extension
        } as DragData
    },
    canDrag(props: ControlItemProps) {
        return !props.disabled
    },
    endDrag(props: ControlItemProps, monitor: DragSourceMonitor) {
        const { id: dropId, originIndex } = monitor.getItem()
        const didDrop = monitor.didDrop()
        if (!didDrop) {
            props.moveItem(dropId, originIndex)
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

const dropSpec = {
    canDrop() {
        return false
    },
    hover(props: ControlItemProps, monitor: DropTargetMonitor) {
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
    DropTarget<ControlItemProps, ControlItemTargetProps>(
        constValue.DragDropConst,
        dropSpec,
        dropCollect
    )(
        DragSource<ControlItemProps, ControlItemSourceProps>(
            constValue.DragDropConst,
            dragSpec,
            dragCollect
        )(ControlItem)
    )
)
