// framework
import * as React from 'react'
import { RouteComponentProps } from 'react-router'
// theme & style
import { Theme, WithStyles, withStyles } from '@material-ui/core/styles'
import { OverflowYProperty, PositionProperty } from 'csstype'
// style components
import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import Fab from '@material-ui/core/Fab'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Switch from '@material-ui/core/Switch'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Zoom from '@material-ui/core/Zoom'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import CloudDownloadIcon from '@material-ui/icons/CloudDownload'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight'
import RefreshIcon from '@material-ui/icons/Refresh'
// myself utils code
import constValue from '@/utils/constValue'
// myself components
import ScoreUpdate from '@/components/scoreUpdate'
import RequestReview from '@/components/requestReview'
import FreeList from '@/components/freeList'

const style = (theme: Theme) => ({
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
    titleTabs: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingRight: theme.spacing.unit
    },
    titleButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingRight: theme.spacing.unit
    },
    titleMain: {
        // flexGrow: 1
    },
    tab: {
        height: 64
    },
    root: {
        height: '100vh',
        overflowY: 'hidden' as OverflowYProperty
    },
    scrollContent: {
        height: '100vh',
        overflowY: 'auto' as OverflowYProperty
    },
    appBarSpacer: theme.mixins.toolbar,
    fab: {
        position: 'absolute' as PositionProperty,
        bottom: theme.spacing.unit * 2,
        right: theme.spacing.unit * 2
    },
    switchName: {
        paddingLeft: theme.spacing.unit * 2
    }
})

interface CspFreeProps
    extends React.Props<CspFree>,
        RouteComponentProps,
        WithStyles<typeof style> {}

interface CspFreeState {
    anchorEl?: HTMLElement
    tab: number
    doing: boolean
    uploader?: () => Promise<void>
    refresher?: () => Promise<void>
    downloader?: () => Promise<void>
    status: boolean
    loading: boolean
}

class CspFree extends React.Component<CspFreeProps, CspFreeState> {
    constructor(props: CspFreeProps) {
        super(props)
        this.state = {
            anchorEl: undefined,
            tab: 0,
            doing: false,
            uploader: undefined,
            refresher: undefined,
            downloader: undefined,
            status: false,
            loading: true
        }
    }
    componentDidMount() {
        this.load()
    }
    load = async () => {
        this.setState({
            loading: true
        })
        try {
            let res = await fetch(`${constValue.hostName}/csp/audit/status`, {
                method: 'GET',
                mode: constValue.corsType,
                cache: 'no-cache'
            })
            if (!res.ok) {
                throw res.status
            }
            let data = await res.json()
            this.setState({
                loading: false,
                status: data.status === 'STATUS_OPEN'
            })
        } catch (error) {
            console.log(error)
            alert('加载失败\n请联系科协技术部')
        }
    }
    go = (id: string) => {
        if (id === 'login') {
            fetch(constValue.hostName + '/logout', {
                mode: constValue.corsType,
                cache: 'no-cache'
            })
        }
        this.props.history.replace(/*constValue.rootPath + */ '/' + id)
    }
    handleTab = (_: React.ChangeEvent<{}>, tab: number) => {
        this.setState({
            tab: tab
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
    logout = () => {
        this.setState({
            anchorEl: undefined
        })
        this.go('login')
    }
    toggleCSP = () => {
        this.go('activity/_')
    }
    toggleStatus = async (e: React.ChangeEvent<HTMLInputElement>) => {
        let oldStatus = this.state.status
        this.setState({
            loading: true,
            status: e.target.checked
        })
        try {
            let res = await fetch(`${constValue.hostName}/admin/csp/audit`, {
                method: 'PUT',
                mode: constValue.corsType,
                cache: 'no-cache',
                body: JSON.stringify({
                    status: e.target.checked ? 'STATUS_OPEN' : 'STATUS_CLOSED'
                })
            })
            if (!res.ok) {
                throw res.status
            }
            this.setState({
                loading: false
            })
        } catch (error) {
            console.log(error)
            alert('加载失败\n请联系科协技术部')
            this.setState({
                loading: false,
                status: oldStatus
            })
        }
    }
    render() {
        const classes = this.props.classes
        const transitionDuration = {
            enter: 250,
            exit: 250
        }
        const fabs = [
            {
                action: async () => {
                    this.setState({
                        doing: true
                    })
                    if (this.state.uploader != null) {
                        await this.state.uploader()
                    } else {
                        alert('遇到不可预知的问题，请联系科协技术部')
                    }
                    this.setState({
                        doing: false
                    })
                },
                icon: <CloudUploadIcon />
            },
            {
                action: async () => {
                    this.setState({
                        doing: true
                    })
                    if (this.state.refresher != null) {
                        await this.state.refresher()
                    } else {
                        alert('遇到不可预知的问题，请联系科协技术部')
                    }
                    this.setState({
                        doing: false
                    })
                },
                icon: <RefreshIcon />
            },
            {
                action: async () => {
                    this.setState({
                        doing: true
                    })
                    if (this.state.downloader != null) {
                        await this.state.downloader()
                    } else {
                        alert('请等待数据加载完成')
                    }
                    this.setState({
                        doing: false
                    })
                },
                icon: <CloudDownloadIcon />
            }
        ]
        return (
            <div>
                <AppBar>
                    <Toolbar disableGutters>
                        <Grid container className={classes.titleContent}>
                            <Grid item sm={3} className={classes.title}>
                                <KeyboardArrowRightIcon />
                                <Typography
                                    variant="h6"
                                    color="inherit"
                                    className={classes.titleMain}>
                                    CSP免费资格管理
                                </Typography>
                                <Typography className={classes.switchName} color="inherit">
                                    允许申请
                                </Typography>
                                <Switch
                                    checked={this.state.status}
                                    onChange={this.toggleStatus}
                                    disabled={this.state.loading}
                                    color="secondary"
                                />
                            </Grid>
                            <Grid item sm={6} className={classes.titleTabs}>
                                <Tabs
                                    variant="standard"
                                    value={this.state.tab}
                                    onChange={this.handleTab}>
                                    <Tab
                                        disabled={this.state.doing}
                                        label="分数上传"
                                        className={classes.tab}
                                    />
                                    <Tab
                                        disabled={this.state.doing}
                                        label="申请审核"
                                        className={classes.tab}
                                    />
                                    <Tab
                                        disabled={this.state.doing}
                                        label="资格使用名单"
                                        className={classes.tab}
                                    />
                                </Tabs>
                            </Grid>
                            <Grid item sm={3} className={classes.titleButton}>
                                <Button
                                    color="inherit"
                                    disabled={this.state.doing}
                                    onClick={this.toggleCSP}>
                                    报名系统
                                </Button>
                                <IconButton
                                    color="inherit"
                                    disabled={this.state.doing}
                                    onClick={this.handleMenuOpen}>
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
                                    <MenuItem disabled={this.state.doing} onClick={this.logout}>
                                        注销
                                    </MenuItem>
                                </Menu>
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
                <Grid container className={classes.root}>
                    <Grid item sm={2} />
                    <Grid item sm={8} className={classes.scrollContent}>
                        <div className={classes.appBarSpacer} />
                        {this.state.tab === 0 && (
                            <ScoreUpdate
                                setUploader={(uploader) => {
                                    this.setState({
                                        uploader: uploader
                                    })
                                }}
                            />
                        )}
                        {this.state.tab === 1 && (
                            <RequestReview
                                setRefresher={(refresher) => {
                                    this.setState({
                                        refresher: refresher
                                    })
                                }}
                            />
                        )}
                        {this.state.tab === 2 && (
                            <FreeList
                                setDownloader={(downloader) => {
                                    this.setState({
                                        downloader: downloader
                                    })
                                }}
                            />
                        )}
                    </Grid>
                    <Grid item sm={2}>
                        {fabs.map((fab, index) => (
                            <Zoom
                                key={index}
                                in={this.state.tab === index}
                                timeout={transitionDuration}
                                style={{
                                    transitionDelay: `${
                                        this.state.tab === index ? transitionDuration.exit : 0
                                    }ms`
                                }}
                                unmountOnExit>
                                <Fab
                                    className={classes.fab}
                                    color="secondary"
                                    disabled={this.state.doing}
                                    onClick={fab.action}>
                                    {fab.icon}
                                </Fab>
                            </Zoom>
                        ))}
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default withStyles(style)(CspFree)
