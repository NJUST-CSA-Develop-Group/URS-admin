// framework
import * as React from 'react'
import { RouteComponentProps } from 'react-router'
// theme & style
import { Theme, WithStyles, withStyles } from '@material-ui/core/styles'
import { OverflowYProperty, PositionProperty, UserSelectProperty } from 'csstype'
// style components
import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Toolbar from '@material-ui/core/Toolbar'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import AddIcon from '@material-ui/icons/Add'
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight'
import SaveIcon from '@material-ui/icons/Save'
// myself utils code
import constValue from '@/utils/constValue'
import { Activity, EditorData, FormItem } from '@/utils/struct'
// myself components
import ActivityItem from '@/components/activityItem'
import Editor from '@/components/editor'
import Toolbox from '@/components/toolbox'

const style = (theme: Theme) => ({
    root: {
        height: '100vh',
        overflowY: 'hidden' as OverflowYProperty
    },
    scrollContent: {
        height: '100vh',
        overflowY: 'auto' as OverflowYProperty
    },
    titleContent: {
        width: '100vw',
        position: 'fixed' as PositionProperty,
        left: 0
    },
    title: {
        display: 'flex',
        alignItems: 'center',
        paddingRight: theme.spacing.unit
    },
    titleMain: {
        flexGrow: 1
    },
    appBarSpacer: theme.mixins.toolbar,
    listOverLayer: {
        position: 'fixed' as PositionProperty,
        top: 0,
        width: '25%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    editOverLayer: {
        position: 'fixed' as PositionProperty,
        top: 0,
        width: '50%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    list: {
        backgroundColor: '#eeeeee'
    },
    info: {
        color: theme.palette.grey[500],
        userSelect: 'none' as UserSelectProperty
    }
})

interface IndexParams {
    id: string
}

interface IndexProps
    extends React.Props<Index>,
        RouteComponentProps<IndexParams>,
        WithStyles<typeof style> {}

interface IndexState {
    listLoading: boolean
    anchorEl?: HTMLElement
    activities: Activity[]
    create: boolean
    dirty: boolean
    openDialog: boolean
    reason: string
    tempId: string
    removeNewItem?(): void
    getData?(): EditorData
    clipboard: FormItem[]
}

class Index extends React.Component<IndexProps, IndexState> {
    constructor(props: IndexProps) {
        super(props)
        this.state = {
            listLoading: true,
            anchorEl: undefined,
            activities: [],
            create: false,
            dirty: false,
            openDialog: false,
            reason: '',
            tempId: '_',
            clipboard: []
        }
    }
    componentDidMount() {
        window.onbeforeunload = (e: any) => {
            if (this.state.dirty) {
                if (!!e) {
                    e.returnValue = '编辑区的内容尚未保存'
                }
                return '编辑区的内容尚未保存'
            }
            return null
        }
        this.load()
    }
    load = (callback?: () => void) => {
        fetch(constValue.hostName + '/admin/activity', {
            mode: constValue.corsType,
            cache: 'no-cache'
        })
            .then((res) => {
                if (!res.ok) throw res.status
                return res.json()
            })
            .then((activities) => {
                this.setState({
                    listLoading: false,
                    activities
                })
                if (callback) {
                    callback()
                }
            })
            .catch((error) => {
                console.log(error)
                alert('无法获取活动列表\n请联系科协技术部')
            })
    }
    handleGo = (id: string) => {
        if (this.state.dirty) {
            this.setState({
                openDialog: true,
                reason: '切换活动',
                tempId: `activity/${id}`
            })
        } else {
            this.go(`activity/${id}`)
        }
    }
    go = (id: string) => {
        if (id === 'login') {
            fetch(constValue.hostName + '/logout', {
                mode: constValue.corsType,
                cache: 'no-cache'
            })
        }
        this.props.history.replace(/*constValue.rootPath + */id)
    }
    handleSure = () => {
        this.go(this.state.tempId)
        this.setState({
            create: false,
            dirty: false,
            openDialog: false,
            tempId: '_'
        })
    }
    handleClose = () => {
        this.setState({
            openDialog: false,
            tempId: '_'
        })
    }
    handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
        this.setState({
            anchorEl: e.currentTarget
        })
    }
    handleMenuClose = () => {
        this.setState({
            anchorEl: undefined
        })
    }
    handleDirty = () => {
        this.setState({
            dirty: true
        })
    }
    removeNewItem = () => {
        if (this.state.removeNewItem) {
            this.state.removeNewItem()
        }
    }
    handleRemoveNewItem = (fn: () => void) => {
        this.setState({
            removeNewItem: fn
        })
    }
    handleData = (fn: () => EditorData) => {
        this.setState({
            getData: fn
        })
    }
    create = () => {
        this.setState({
            create: true
        })
        this.handleGo(`-${new Date().getTime()}`)
    }
    save = () => {
        if (!this.state.getData) {
            alert('技术故障\n请联系科协技术部')
            return
        }
        let editorData = this.state.getData()
        let data = {
            name: editorData.name,
            startTime: editorData.startTime,
            endTime: editorData.endTime,
            items: editorData.items
        }
        if (this.state.create) {
            fetch(`${constValue.hostName}/admin/activity`, {
                method: 'POST',
                mode: constValue.corsType,
                cache: 'no-cache',
                headers: { 'Content-Type': 'application/json; charset=UTF-8' },
                body: JSON.stringify(data)
            })
                .then((res) => {
                    if (!res.ok) {
                        throw res.status
                    }
                    return res.json()
                })
                .then((data: { id: string }) => {
                    this.setState({
                        listLoading: true,
                        create: false,
                        dirty: false
                    })
                    this.load(() => {
                        this.handleGo(data.id)
                    })
                })
                .catch((error) => {
                    console.log(error)
                    alert('提交报名信息失败\n请联系科协技术部')
                })
        } else {
            fetch(`${constValue.hostName}/admin/activity/${editorData.id}`, {
                method: 'PUT',
                mode: constValue.corsType,
                cache: 'no-cache',
                headers: { 'Content-Type': 'application/json; charset=UTF-8' },
                body: JSON.stringify(data)
            })
                .then((res) => {
                    if (!res.ok) {
                        throw res.status
                    }
                    this.setState({
                        listLoading: true,
                        dirty: false
                    })
                    this.load()
                })
                .catch((error) => {
                    console.log(error)
                    alert('修改报名信息失败\n请联系科协技术部')
                })
        }
    }
    logout = () => {
        this.setState({
            anchorEl: undefined
        })
        if (this.state.dirty) {
            this.setState({
                openDialog: true,
                reason: '注销',
                tempId: 'login'
            })
        } else {
            this.go('login')
        }
    }
    canEdit = () => {
        let activity = this.state.activities.find(
            (value) => value.id === this.props.match.params.id
        )
        if (!activity) {
            return true
        }
        return activity.status === 0
    }
    copy = (items: FormItem[]) => {
        this.setState({
            clipboard: items
        })
    }
    paste = () => {
        return this.state.clipboard
    }
    render() {
        const classes = this.props.classes
        return (
            <div>
                <AppBar>
                    <Toolbar>
                        <Grid container className={classes.titleContent}>
                            <Grid item sm={3} className={classes.title}>
                                <KeyboardArrowRightIcon />
                                <Typography
                                    variant="h6"
                                    color="inherit"
                                    className={classes.titleMain}>
                                    活动列表
                                </Typography>
                                <Tooltip title="新建报名" placement="bottom">
                                    <div>
                                        <IconButton color="inherit" onClick={this.create}>
                                            <AddIcon />
                                        </IconButton>
                                    </div>
                                </Tooltip>
                            </Grid>
                            <Grid item sm={6} className={classes.title}>
                                <KeyboardArrowRightIcon />
                                <Typography
                                    variant="h6"
                                    color="inherit"
                                    className={classes.titleMain}>
                                    编辑区
                                </Typography>
                                <Tooltip title="保存" placement="bottom">
                                    <div>
                                        <IconButton
                                            color="inherit"
                                            onClick={this.save}
                                            disabled={!this.canEdit()}>
                                            <SaveIcon />
                                        </IconButton>
                                    </div>
                                </Tooltip>
                            </Grid>
                            <Grid item sm={3} className={classes.title}>
                                <KeyboardArrowRightIcon />
                                <Typography
                                    variant="h6"
                                    color="inherit"
                                    className={classes.titleMain}>
                                    工具箱
                                </Typography>
                                <IconButton color="inherit" onClick={this.handleMenuOpen}>
                                    <AccountCircleIcon />
                                </IconButton>
                                <Menu
                                    anchorEl={this.state.anchorEl}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right'
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right'
                                    }}
                                    open={!!this.state.anchorEl}
                                    onClose={this.handleMenuClose}>
                                    <MenuItem onClick={this.logout}>注销</MenuItem>
                                </Menu>
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
                <Grid container className={classes.root}>
                    <Grid item sm={3} className={classes.scrollContent + ' ' + classes.list}>
                        <div className={classes.appBarSpacer} />
                        {this.state.activities.map((item) => (
                            <ActivityItem
                                activity={item}
                                currentId={this.props.match.params.id}
                                key={item.id}
                                go={this.handleGo}
                                refresh={this.load}
                            />
                        ))}
                        {this.state.listLoading && (
                            <div className={classes.listOverLayer}>
                                <div className="line-scale">
                                    <div />
                                    <div />
                                    <div />
                                    <div />
                                    <div />
                                </div>
                            </div>
                        )}
                    </Grid>
                    <Grid item sm={6} className={classes.scrollContent}>
                        <div className={classes.appBarSpacer} />
                        {this.props.match.params.id === '_' ? (
                            <div className={classes.editOverLayer}>
                                <Typography variant="h4" className={classes.info}>
                                    没有选中任何活动
                                </Typography>
                            </div>
                        ) : (
                            <Editor
                                key={this.props.match.params.id}
                                activity={
                                    this.state.activities.find(
                                        (value) => value.id === this.props.match.params.id
                                    ) ||
                                    ({ id: '-', name: '', publisher: '', status: 0 } as Activity)
                                }
                                dirty={this.handleDirty}
                                disabled={!this.canEdit()}
                                removeNewItemHandle={this.handleRemoveNewItem}
                                dataHandle={this.handleData}
                                copy={this.copy}
                                paste={this.paste}
                            />
                        )}
                    </Grid>
                    <Grid item sm={3} className={classes.scrollContent + ' ' + classes.list}>
                        <div className={classes.appBarSpacer} />
                        <Toolbox
                            disabled={this.props.match.params.id === '_' || !this.canEdit()}
                            removeNewItem={this.removeNewItem}
                        />
                    </Grid>
                </Grid>
                <Dialog open={this.state.openDialog} onClose={this.handleClose}>
                    <DialogTitle id="alert-dialog-title">编辑的内容尚未保存！</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            编辑的内容尚未保存，如果{this.state.reason}
                            ，将失去全部的已编辑数据。是否仍然要{this.state.reason}？
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary" autoFocus>
                            取消
                        </Button>
                        <Button onClick={this.handleSure} color="primary">
                            仍要{this.state.reason}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

export default withStyles(style)(Index)
