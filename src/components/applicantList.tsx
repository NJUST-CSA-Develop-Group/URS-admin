// framework
import * as React from 'react'
// theme & style
import { Theme, WithStyles, withStyles } from '@material-ui/core/styles'
// style components
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListSubheader from '@material-ui/core/ListSubheader'
import Paper from '@material-ui/core/Paper'
import Tooltip from '@material-ui/core/Tooltip'
import SyncIcon from '@material-ui/icons/Sync'
// myself utils code
import constValue from '@/utils/constValue'
import { ApplicantItemStruct } from '@/utils/struct'
// myself components
import ApplicantItem from '@/components/applicantItem'

const style = (theme: Theme) => ({
    head: {
        paddingTop: theme.spacing.unit,
        display: 'flex',
        alignItems: 'center'
    },
    root: {
        marginTop: theme.spacing.unit * 2
    }
})

interface ApplicantListProps extends React.Props<ApplicantList>, WithStyles<typeof style> {
    finish: boolean
    activityId: string
}

interface ApplicantListState {
    items: ApplicantItemStruct[]
    detail?: ApplicantItemStruct
    removeId?: string
    removeUnique?: string
}

class ApplicantList extends React.Component<ApplicantListProps, ApplicantListState> {
    constructor(props: ApplicantListProps) {
        super(props)
        this.state = {
            items: []
        }
    }
    refresh = () => {
        fetch(`${constValue.hostName}/admin/activity/${this.props.activityId}/applicant`, {
            mode: constValue.corsType,
            cache: 'no-cache'
        })
            .then((res) => res.json())
            .then((data: ApplicantItemStruct[]) => {
                this.setState({
                    items: data
                })
            })
            .catch((error) => {
                console.log(error)
                alert('未能获取报名数据\n请联系科协技术部')
            })
    }
    detail = (item: ApplicantItemStruct) => {
        this.setState({
            detail: item
        })
    }
    remove = (id: string, unique: string) => {
        this.setState({
            removeId: id,
            removeUnique: unique
        })
    }
    closeDetail = () => {
        this.setState({
            detail: undefined
        })
    }
    detailRemove = () => {
        this.setState({
            removeId: this.state.detail!.id,
            removeUnique: this.state.detail!.unique,
            detail: undefined
        })
    }
    closeRemove = () => {
        this.setState({
            removeId: undefined,
            removeUnique: undefined
        })
    }
    removeRequest = () => {
        fetch(
            `${constValue.hostName}/admin/activity/${this.props.activityId}/applicant/${
                this.state.removeId
            }`,
            {
                method: 'DELETE',
                mode: constValue.corsType,
                cache: 'no-cache'
            }
        )
            .then((res) => res.json())
            .then((data: { reason: string }) => {
                if (data.reason != '') {
                    alert(data.reason)
                    return
                }
                this.refresh()
            })
            .catch((error) => {
                console.log(error)
                alert('无法删除报名\n请联系科协技术部')
            })
        this.setState({
            removeId: undefined,
            removeUnique: undefined
        })
    }
    /*detailRender(data: object) {
        let result = ''
        let str = JSON.stringify(data)
        let fold = 0
        let inStr = false
        for (let i = 0; i < str.length; i++) {
            if (inStr) {
                if (str[i] == '"') {
                    inStr = false
                }
                if (str[i] == '\\') {
                    result += str[i]
                    i++
                }
                result += str[i]
            } else {
                switch (str[i]) {
                    case '{':
                        fold++
                        result += '{\n' + repeatTab(fold)
                        break
                    case '[':
                        fold++
                        result += '[\n' + repeatTab(fold)
                        break
                    case '}':
                        fold--
                        result += '\n' + repeatTab(fold) + '}'
                        break
                    case ']':
                        fold--
                        result += '\n' + repeatTab(fold) + ']'
                        break
                    case ',':
                        result += '\n' + repeatTab(fold)
                        break
                    case '"':
                        inStr = true
                        result += '"'
                        break
                    default:
                        result += str[i]
                }
            }
        }
        return result
    }*/
    render() {
        const classes = this.props.classes
        return (
            <Paper className={classes.root}>
                <List
                    subheader={
                        <ListSubheader className={classes.head}>
                            <Tooltip title="加载/刷新">
                                <IconButton onClick={this.refresh}>
                                    <SyncIcon />
                                </IconButton>
                            </Tooltip>
                            {this.props.finish ? '请在右侧下载报名结果的xlsx文件' : '报名数据'}
                        </ListSubheader>
                    }>
                    {this.state.items.map((item) => (
                        <ApplicantItem
                            key={item.id}
                            value={item}
                            detail={this.detail}
                            remove={this.remove}
                        />
                    ))}
                    {/*<ListItem>
                        <ListItemText>123</ListItemText>
                        <IconButton>
                            <DeleteIcon />
                        </IconButton>
                    </ListItem>*/}
                </List>
                <Dialog fullWidth open={this.state.detail != undefined} onClose={this.closeDetail}>
                    <DialogTitle>
                        详细信息:
                        {this.state.detail != undefined &&
                            (this.state.detail.unique || this.state.detail.id)}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText component="pre">
                            {this.state.detail &&
                                JSON.stringify(this.state.detail.data, null, '\t')}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button color="secondary" onClick={this.detailRemove}>
                            删除
                        </Button>
                        <Button color="primary" onClick={this.closeDetail}>
                            关闭
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    fullWidth
                    open={this.state.removeId != undefined}
                    onClose={this.closeRemove}>
                    <DialogTitle>
                        确定要删除“
                        {this.state.removeId != undefined &&
                            (this.state.removeUnique || this.state.removeId)}
                        ”吗？
                    </DialogTitle>
                    <DialogActions>
                        <Button color="secondary" onClick={this.removeRequest}>
                            删除
                        </Button>
                        <Button color="primary" onClick={this.closeRemove}>
                            放弃
                        </Button>
                    </DialogActions>
                </Dialog>
            </Paper>
        )
    }
}

/*function repeatTab(n: number) {
    let result = ''
    for (let i = 0; i < n; i++) {
        result += '\t'
    }
    return result
}*/

export default withStyles(style)(ApplicantList)
