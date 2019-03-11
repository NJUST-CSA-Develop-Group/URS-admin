// framework
import * as React from 'react'
// theme & style
import { Theme, WithStyles, withStyles } from '@material-ui/core/styles'
import {} from 'csstype'
// style components
import IconButton from '@material-ui/core/IconButton'
import Paper from '@material-ui/core/Paper'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import DeleteIcon from '@material-ui/icons/Delete'
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight'
import PauseIcon from '@material-ui/icons/Pause'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import SaveAltIcon from '@material-ui/icons/SaveAlt'
import StopIcon from '@material-ui/icons/Stop'
// myself utils code
import constValue from '@/utils/constValue'
import { Activity } from '@/utils/struct'

const style = (theme: Theme) => ({
    root: {
        margin: theme.spacing.unit,
        padding: theme.spacing.unit
    },
    titleContent: {
        display: 'flex',
        width: '100%',
        alignItems: 'center'
    },
    title: {
        flexGrow: 1
    },
    publisher: {
        color: theme.palette.grey[500]
    },
    buttons: {
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between'
    }
})

interface ActivityItemProps extends React.Props<ActivityItem>, WithStyles<typeof style> {
    activity: Activity
    currentId: string
    go(id: string): void
    refresh(callback?: () => void): void
}

interface ActivityItemState {}

class ActivityItem extends React.Component<ActivityItemProps, ActivityItemState> {
    go = (_: React.MouseEvent<HTMLElement>) => {
        this.props.go(this.props.activity.id)
    }
    setStatus = (status: 1 | 2 | 3) => {
        fetch(`${constValue.hostName}/admin/activity/${this.props.activity.id}/status`, {
            method: 'PUT',
            mode: constValue.corsType,
            cache: 'no-cache',
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
            body: JSON.stringify({ status })
        })
            .then((res) => {
                if (!res.ok) {
                    throw res.status
                }
                this.props.refresh()
            })
            .catch((error) => {
                console.log(error)
                alert('无法修改状态\n请联系科协技术部')
            })
    }
    publish = () => {
        this.setStatus(1)
    }
    pasue = () => {
        this.setStatus(2)
    }
    resume = () => {
        this.setStatus(1)
    }
    stop = () => {
        this.setStatus(3)
    }
    delete = () => {
        fetch(`${constValue.hostName}/admin/activity/${this.props.activity.id}`, {
            method: 'DELETE',
            mode: constValue.corsType,
            cache: 'no-cache'
        })
            .then((res) => res.json())
            .then((data: { reason: string }) => {
                if (data.reason != '') {
                    alert(data.reason)
                    return
                }
                this.props.refresh(() => {
                    if (this.props.currentId === this.props.activity.id) {
                        this.props.go('_')
                    }
                })
            })
            .catch((error) => {
                console.log(error)
                alert('无法删除报名\n请联系科协技术部')
            })
    }
    download = () => {
        let a = document.createElement('a')
        a.style.display = 'none'
        document.body.appendChild(a)
        a.href = `${constValue.hostName}/admin/activity/${this.props.activity.id}/file`
        a.click()
    }
    render() {
        const classes = this.props.classes
        return (
            <Paper className={classes.root}>
                <div className={classes.titleContent}>
                    <Typography variant="h6" className={classes.title}>
                        {this.props.activity.name}
                    </Typography>
                    <Tooltip title="详情" placement="bottom">
                        <IconButton onClick={this.go}>
                            <KeyboardArrowRightIcon />
                        </IconButton>
                    </Tooltip>
                </div>
                <Typography className={classes.publisher}>
                    发布者: {this.props.activity.publisher}
                </Typography>
                {this.props.activity.startTime != undefined && (
                    <Typography>
                        报名开始时间: <br />
                        {this.props.activity.startTime}
                    </Typography>
                )}
                {this.props.activity.endTime != undefined && (
                    <Typography>
                        报名截止时间: <br />
                        {this.props.activity.endTime}
                    </Typography>
                )}
                <div className={classes.buttons}>
                    {this.props.activity.status == 0 && (
                        <Tooltip title="发布" placement="top">
                            <IconButton onClick={this.publish}>
                                <PlayArrowIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                    {this.props.activity.status == 1 && (
                        <Tooltip title="暂停报名" placement="top">
                            <IconButton onClick={this.pasue}>
                                <PauseIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                    {this.props.activity.status == 2 && (
                        <Tooltip title="继续报名" placement="top">
                            <IconButton onClick={this.resume}>
                                <PlayArrowIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                    {this.props.activity.status > 0 && this.props.activity.status < 3 && (
                        <Tooltip title="终止报名" placement="top">
                            <IconButton onClick={this.stop}>
                                <StopIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                    {this.props.activity.status == 3 && (
                        <Tooltip title="下载报名信息" placement="top">
                            <IconButton onClick={this.download}>
                                <SaveAltIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                    {(this.props.activity.status == 0 || this.props.activity.status == 3) && (
                        <Tooltip title="删除" placement="top">
                            <div>
                                <IconButton
                                    onClick={this.delete}
                                    disabled={
                                        this.props.activity.status == 0 &&
                                        this.props.currentId === this.props.activity.id
                                    }>
                                    <DeleteIcon />
                                </IconButton>
                            </div>
                        </Tooltip>
                    )}
                </div>
            </Paper>
        )
    }
}

export default withStyles(style)(ActivityItem)
