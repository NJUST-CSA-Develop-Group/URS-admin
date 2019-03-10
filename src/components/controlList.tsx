// framework
import * as React from 'react'
import update from 'immutability-helper'
// theme & style
import { Theme, WithStyles, withStyles } from '@material-ui/core/styles'
// style components
import List from '@material-ui/core/List'
import ListSubheader from '@material-ui/core/ListSubheader'
import Paper from '@material-ui/core/Paper'
// drag & drop
import { ConnectDropTarget, DropTarget, DropTargetConnector, DropTargetMonitor } from 'react-dnd'
// myself utils code
import constValue from '@/utils/constValue'
import { FormItem, FormItemType, DragData, BackFormItem } from '@/utils/struct'
import { Front2Back } from '@/utils/utils'
// myself components
import ControlItem from '@/components/controlItem'

const style = (_: Theme) => ({})

interface ControlListTargetProps {
    connectDropTarget: ConnectDropTarget
}

interface ControlListProps extends React.Props<ControlList>, WithStyles<typeof style> {
    formItems: FormItem[]
    dirty(): void
    disabled: boolean
    removeNewItemHandle(fn: () => void): void
    dataHandle(fn: () => BackFormItem[]): void
}

interface ControlListState {
    formItems: FormItem[]
    id: bigint
    addItemId: bigint
}

class ControlList extends React.Component<
    ControlListProps & ControlListTargetProps,
    ControlListState
> {
    constructor(props: ControlListProps & ControlListTargetProps) {
        super(props)
        let id = BigInt(0)
        let formItems = this.props.formItems.map((value) => {
            value.id = id
            id++
            return value
        })
        this.state = {
            id,
            formItems,
            addItemId: BigInt(-1)
        }
    }
    componentDidMount() {
        this.props.removeNewItemHandle(this.removeAddItem)
        this.props.dataHandle(() => {
            return this.state.formItems.map((value) => Front2Back(value))
        })
    }
    addItem = (data: DragData) => {
        data.id = this.state.id
        data.originIndex = this.state.formItems.length
        this.setState({
            id: this.state.id + BigInt(1),
            addItemId: data.id,
            formItems: update(this.state.formItems, {
                $push: [constValue.defaultValue(data.id, data.type)]
            })
        })
    }
    getIndex = (id: bigint) => {
        return this.state.formItems.findIndex((value) => value.id === id)
    }
    moveItem = (id: bigint, index: number) => {
        let itemIndex = this.state.formItems.findIndex((value) => value.id === id)
        let item = this.state.formItems[itemIndex]
        this.setState({
            formItems: update(this.state.formItems, {
                $splice: [[itemIndex, 1], [index, 0, item]]
            })
        })
        this.props.dirty()
    }
    removeAddItem = () => {
        if (this.state.addItemId == BigInt(-1)) {
            this.props.dirty()
            return false
        }
        let index = this.state.formItems.findIndex((value) => value.id == this.state.addItemId)
        this.setState({
            formItems: update(this.state.formItems, {
                $splice: [[index, 1]]
            })
        })
        return true
    }
    update = (
        id: bigint,
        name: FormItemType,
        value: string | boolean | undefined | number[] | string[]
    ) => {
        //console.log(id, ':', name, ':', value)
        let index = this.state.formItems.findIndex((item) => item.id === id)
        this.setState({
            formItems: update(this.state.formItems, {
                [index]: { [name]: { $set: value } }
            })
        })
        this.props.dirty()
    }
    delete = (id: bigint) => {
        let index = this.state.formItems.findIndex((item) => item.id === id)
        this.setState({
            formItems: update(this.state.formItems, {
                $splice: [[index, 1]]
            })
        })
        this.props.dirty()
    }
    caseAdd = (id: bigint, value: string) => {
        let index = this.state.formItems.findIndex((item) => item.id === id)
        this.setState({
            formItems: update(this.state.formItems, {
                [index]: { case: { $push: [value] } }
            })
        })
        this.props.dirty()
    }
    caseRemove = (id: bigint, caseIndex: number) => {
        let index = this.state.formItems.findIndex((item) => item.id === id)
        this.setState({
            formItems: update(this.state.formItems, {
                [index]: { case: { $splice: [[caseIndex, 1]] } }
            })
        })
        this.props.dirty()
    }
    render() {
        //const classes = this.props.classes
        return (
            <Paper>
                {this.props.connectDropTarget(
                    <div>
                        <List subheader={<ListSubheader>报名表单结构</ListSubheader>}>
                            {this.state.formItems.map((item) => (
                                <ControlItem
                                    key={item.id.toString()}
                                    fromItem={item}
                                    addItem={this.addItem}
                                    getIndex={this.getIndex}
                                    moveItem={this.moveItem}
                                    update={this.update}
                                    delete={this.delete}
                                    caseAdd={this.caseAdd}
                                    caseRemove={this.caseRemove}
                                    disabled={this.props.disabled}
                                />
                            ))}
                        </List>
                    </div>
                )}
            </Paper>
        )
    }
}

const dropSpec = {
    drop(_: ControlListProps, monitor: DropTargetMonitor, component: ControlList) {
        if (component.state.formItems.length == 0) {
            const data = monitor.getItem()
            component.setState({
                id: component.state.id + BigInt(1),
                formItems: [constValue.defaultValue(component.state.id, data.type)]
            })
        } else {
            component.setState({
                addItemId: BigInt(-1)
            })
        }
    }
}

function dropCollect(connect: DropTargetConnector) {
    return {
        connectDropTarget: connect.dropTarget()
    }
}

export default withStyles(style)(
    DropTarget<ControlListProps, ControlListTargetProps>(
        constValue.DragDropConst,
        dropSpec,
        dropCollect
    )(ControlList)
)
