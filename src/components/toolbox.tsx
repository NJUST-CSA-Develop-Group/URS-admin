// framework
import * as React from 'react'
// theme & style
import { Theme, WithStyles, withStyles } from '@material-ui/core/styles'
// style components
//import Divider from '@material-ui/core/Divider'
// myself utils code
import { ExtensionType } from '@/utils/struct'
// myself components
import Folder from '@/components/folder'
import ToolItem from '@/components/toolItem'

const style = (_: Theme) => ({})

interface ToolboxProps extends React.Props<Toolbox>, WithStyles<typeof style> {
    disabled: boolean
    removeNewItem(): void
}

interface ToolboxState {}

const basic = ['text', 'number', 'radio', 'checkbox', 'date', 'textarea', 'group']
const extension = [
    'personName',
    'teamName',
    'sex',
    'nation',
    'political',
    'studentNumber',
    'phone',
    'qq',
    'email',
    'idcard',
    'GPA',
    'rank'
]

class Toolbox extends React.Component<ToolboxProps, ToolboxState> {
    render() {
        //const classes = this.props.classes
        return (
            <div>
                <Folder name="基础内容" disabled={this.props.disabled}>
                    {basic.map((value) => (
                        <ToolItem
                            key={value}
                            disabled={this.props.disabled}
                            type={value as ExtensionType}
                            removeNewItem={this.props.removeNewItem}
                        />
                    ))}
                    {/*<ToolItem
                        disabled={this.props.disabled}
                        type="text"
                        removeNewItem={this.props.removeNewItem}
                    />*/}
                </Folder>
                <Folder name="扩展内容" disabled={this.props.disabled}>
                    {extension.map((value) => (
                        <ToolItem
                            key={value}
                            disabled={this.props.disabled}
                            type={value as ExtensionType}
                            removeNewItem={this.props.removeNewItem}
                        />
                    ))}
                    {/*<ToolItem
                        disabled={this.props.disabled}
                        type="group"
                        removeNewItem={this.props.removeNewItem}
                    />*/}
                </Folder>
            </div>
        )
    }
}

export default withStyles(style)(Toolbox)
