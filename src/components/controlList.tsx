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
import GroupStart from '@/components/groupStart'
import GroupEnd from '@/components/groupEnd'

const style = (_: Theme) => ({
    groupBox: {
        marginLeft: 27,
        borderLeft: '2px solid lightgrey',
        paddingLeft: 23
    }
})

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
    foldId: bigint
}

class ControlList extends React.Component<
    ControlListProps & ControlListTargetProps,
    ControlListState
> {
    constructor(props: ControlListProps & ControlListTargetProps) {
        super(props)
        let id = BigInt(0)
        let formItems = [] as FormItem[]
        for (let it of this.props.formItems) {
            if (it.id === BigInt(-1)) {
                it.id = id
                if (it.groupTo != undefined) {
                    it.groupTo.id = id
                }
                id++
            }
            formItems.push(it)
        }
        /*this.props.formItems.map((value) => {
            value.id = id
            id++
            return value
        })*/
        this.state = {
            id,
            formItems,
            addItemId: BigInt(-1),
            foldId: BigInt(-1)
        }
    }
    componentDidMount() {
        this.props.removeNewItemHandle(this.removeAddItem)
        this.props.dataHandle(() => {
            return Front2Back(this.state.formItems, 0) //.map((value) => Front2Back(value))
        })
    }
    addItem = (data: DragData) => {
        data.id = this.state.id
        data.originIndex = this.state.formItems.length
        let items = []
        if (data.type === 'group') {
            items = [
                constValue.defaultValue(data.id, data.type),
                constValue.defaultValue(data.id, data.type)
            ]
            items[0].type = 'begin'
            items[1].type = 'end'
        } else {
            items = [constValue.defaultValue(data.id, data.type)]
        }
        this.setState({
            id: this.state.id + BigInt(1),
            addItemId: data.id,
            formItems: update(this.state.formItems, {
                $push: items
            })
        })
        //console.log(this.state.formItems)
    }
    getIndex = (id: bigint) => {
        return this.state.formItems.findIndex((value) => value.id === id)
    }
    moveItem = (id: bigint, index: number) => {
        //console.log(id, index)
        let itemIndex = this.state.formItems.findIndex((value) => value.id === id)
        let item = [this.state.formItems[itemIndex]]
        if (item[0].extension === 'group') {
            let endIndex = this.state.formItems.findIndex(
                (value) => value.id === id && value.type === 'end'
            )
            //console.log(itemIndex, endIndex)
            item = this.state.formItems.slice(itemIndex, endIndex + 1)
        }
        //console.log(itemIndex, itemIndex > index ? index : index - item.length + 1, item)
        this.setState({
            formItems: update(this.state.formItems, {
                $splice: [
                    [itemIndex, item.length],
                    [itemIndex > index ? index : index - item.length + 1, 0, ...item]
                ]
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
        let length = 1
        if (this.state.formItems[index].extension === 'group') {
            let endIndex = this.state.formItems.findIndex(
                (value) => value.id === this.state.addItemId && value.type === 'end'
            )
            length = endIndex - index + 1
        }
        this.setState({
            formItems: update(this.state.formItems, {
                $splice: [[index, length]]
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
        let length = 1
        if (this.state.formItems[index].extension === 'group') {
            let endIndex = this.state.formItems.findIndex(
                (value) => value.id === id && value.type === 'end'
            )
            length = endIndex - index + 1
        }
        this.setState({
            formItems: update(this.state.formItems, {
                $splice: [[index, length]]
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
        //console.log(this.state.formItems[index].extension)
        this.setState({
            formItems: update(this.state.formItems, {
                [index]: { case: { $splice: [[caseIndex, 1]] } }
            })
        })
        this.props.dirty()
    }
    foldNameUpdate = (id: bigint, value: string) => {
        let startIndex = this.state.formItems.findIndex(
            (item) => item.id === id && item.type === 'begin'
        )
        let endIndex = this.state.formItems.findIndex(
            (item) => item.id === id && item.type === 'end'
        )
        this.setState({
            formItems: update(this.state.formItems, {
                [startIndex]: { name: { $set: value } },
                [endIndex]: { name: { $set: value } }
            })
        })
    }
    fold = (id: bigint) => {
        this.setState({
            foldId: id
        })
    }
    unfold = () => {
        this.setState({
            foldId: BigInt(-1)
        })
    }
    packItem(item: JSX.Element, count: number, key: string) {
        let result = item
        for (let i = 0; i < count; i++) {
            result = <div className={this.props.classes.groupBox}>{result}</div>
        }
        result = <div key={key}>{result}</div>
        return result
    }
    render() {
        //const classes = this.props.classes
        let pack = 0
        let curFold = false
        let list = []
        for (let item of this.state.formItems) {
            if (item.extension === 'group') {
                if (item.type == 'begin') {
                    list.push(
                        this.packItem(
                            <GroupStart
                                fromItem={item}
                                fold={this.fold}
                                unfold={this.unfold}
                                addItem={this.addItem}
                                getIndex={this.getIndex}
                                moveItem={this.moveItem}
                                nameUpdate={this.foldNameUpdate}
                                delete={this.delete}
                                disabled={this.props.disabled}
                            />,
                            pack,
                            item.id.toString() + ':begin'
                        )
                    )
                    pack++
                    curFold =
                        item.id != this.state.addItemId ? item.id === this.state.foldId : curFold
                } else if (item.type === 'end') {
                    pack--
                    if (!curFold && item.id !== this.state.addItemId) {
                        list.push(
                            this.packItem(
                                <GroupEnd fromItem={item} disabled={this.props.disabled} />,
                                pack,
                                item.id.toString() + ':end'
                            )
                        )
                    }
                    curFold =
                        item.id != this.state.addItemId && item.id === this.state.foldId
                            ? false
                            : curFold
                }
            } else {
                if (curFold) {
                    continue
                }
                list.push(
                    this.packItem(
                        <ControlItem
                            fromItem={item}
                            addItem={this.addItem}
                            getIndex={this.getIndex}
                            moveItem={this.moveItem}
                            update={this.update}
                            delete={this.delete}
                            caseAdd={this.caseAdd}
                            caseRemove={this.caseRemove}
                            disabled={this.props.disabled}
                        />,
                        pack,
                        item.id.toString()
                    )
                )
            }
        }
        return (
            <Paper>
                {this.props.connectDropTarget(
                    <div>
                        <List subheader={<ListSubheader>报名表单结构</ListSubheader>}>
                            {list}
                            {/*this.state.formItems.map((item) => (
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
                            ))*/}
                            {/*<GroupStart
                                fromItem={this.props.formItems[0]}
                                addItem={this.addItem}
                                getIndex={this.getIndex}
                                moveItem={this.moveItem}
                                update={this.update}
                                delete={this.delete}
                                disabled={this.props.disabled}
                            />
                            <div className={classes.groupBox}>
                                <ControlItem
                                    key={this.props.formItems[0].id.toString()}
                                    fromItem={this.props.formItems[0]}
                                    addItem={this.addItem}
                                    getIndex={this.getIndex}
                                    moveItem={this.moveItem}
                                    update={this.update}
                                    delete={this.delete}
                                    caseAdd={this.caseAdd}
                                    caseRemove={this.caseRemove}
                                    disabled={this.props.disabled}
                                />
                            </div>
                            <GroupEnd
                                fromItem={this.props.formItems[0]}
                                disabled={this.props.disabled}
                            />*/}
                        </List>
                    </div>
                )}
            </Paper>
        )
    }
}

const dropSpec = {
    drop(_: ControlListProps, monitor: DropTargetMonitor, component: ControlList) {
        //console.log(component.state.formItems)
        if (component.state.formItems.length == 0) {
            const data = monitor.getItem()
            let items = []
            if (data.type === 'group') {
                items = [
                    constValue.defaultValue(component.state.id, data.type),
                    constValue.defaultValue(component.state.id + BigInt(1), data.type)
                ]
                items[0].type = 'begin'
                items[1].type = 'end'
            } else {
                items = [constValue.defaultValue(component.state.id, data.type)]
            }
            component.setState({
                id: component.state.id + BigInt(items.length),
                formItems: items
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
