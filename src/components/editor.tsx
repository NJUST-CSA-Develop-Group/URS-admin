// framework
import * as React from 'react'
import update from 'immutability-helper'
import { Dayjs } from 'dayjs'
import DayjsUtils from '@date-io/dayjs'
// theme & style
import { Theme, WithStyles, withStyles } from '@material-ui/core/styles'
import { FlexDirectionProperty } from 'csstype'
// style components
import FormControlLabel from '@material-ui/core/FormControlLabel'
import IconButton from '@material-ui/core/IconButton'
import Paper from '@material-ui/core/Paper'
import Switch from '@material-ui/core/Switch'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { MuiPickersUtilsProvider, DateTimePicker } from 'material-ui-pickers'
import EditIcon from '@material-ui/icons/Edit'
// myself utils code
import constValue from '@/utils/constValue'
import { Activity, BackFormItem, FormItem, EditorData } from '@/utils/struct'
import { Back2Front } from '@/utils/utils'
// myself components
import ApplicantList from '@/components/applicantList'
import ControlList from '@/components/controlList'

const style = (theme: Theme) => ({
    root: {
        padding: theme.spacing.unit * 2
    },
    activityEditor: {
        padding: theme.spacing.unit * 2
    },
    titleContent: {
        display: 'flex',
        alignItems: 'center',
        height: 48
    },
    title: {
        flexGrow: 1
    },
    input: {
        fontSize: '1.25rem',
        display: 'flex',
        flexDirection: 'column' as FlexDirectionProperty
    },
    timeContent: {
        display: 'flex'
    },
    time: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column' as FlexDirectionProperty
    },
    controlList: {
        marginTop: theme.spacing.unit * 2
    },
    loading: {
        marginTop: theme.spacing.unit * 2,
        display: 'flex',
        flexDirection: 'column' as FlexDirectionProperty,
        alignItems: 'center'
    }
})

interface EditorProps extends React.Props<Editor>, WithStyles<typeof style> {
    activity: Activity
    dirty(): void
    disabled: boolean
    removeNewItemHandle(fn: () => void): void
    dataHandle(fn: () => EditorData): void
    copy(items: FormItem[]): void
    paste(): FormItem[]
}

interface EditorState {
    loading: boolean
    activity: Activity
    titleEdit: boolean
    startUsed: boolean
    endUsed: boolean
    items: FormItem[]
    getData?(): BackFormItem[]
}

class Editor extends React.Component<EditorProps, EditorState> {
    constructor(props: EditorProps) {
        super(props)
        this.state = {
            loading: true,
            activity: props.activity,
            titleEdit: false,
            startUsed: !!props.activity.startTime,
            endUsed: !!props.activity.endTime,
            items: []
        }
    }
    componentDidMount() {
        if (this.props.activity.id === '-') {
            this.props.dataHandle(this.ActivityData)
            this.setState({
                loading: false
            })
            return
        }
        fetch(`${constValue.hostName}/admin/activity/${this.props.activity.id}`, {
            mode: constValue.corsType,
            cache: 'no-cache'
        })
            .then((res) => {
                if (!res.ok) throw res.status
                return res.json()
            })
            .then((data: BackFormItem[]) => {
                this.props.dataHandle(this.ActivityData)
                this.setState({
                    loading: false,
                    items: data.reduce(
                        (pre, value) => pre.concat(Back2Front(value)),
                        [] as FormItem[]
                    )
                })
            })
            .catch((error) => {
                console.log(error)
                alert('无法获取报名格式\n请联系科协技术部')
            })
    }
    titleEdit = () => {
        this.setState({
            titleEdit: true
        })
    }
    titleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            activity: update(this.state.activity, { name: { $set: e.target.value } })
        })
        this.props.dirty()
    }
    titleBlur = () => {
        this.setState({
            titleEdit: false
        })
    }
    timeUse = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === 'start') {
            this.setState({
                startUsed: !this.state.startUsed
            })
        } else if (e.target.value === 'end') {
            this.setState({
                endUsed: !this.state.endUsed
            })
        }
        this.props.dirty()
    }
    startTimeChange = (e: Dayjs) => {
        this.setState({
            activity: update(this.state.activity, {
                startTime: { $set: e.format('YYYY-MM-DD HH:mm:ss') }
            })
        })
        this.props.dirty()
    }
    endTimeChange = (e: Dayjs) => {
        this.setState({
            activity: update(this.state.activity, {
                endTime: { $set: e.format('YYYY-MM-DD HH:mm:ss') }
            })
        })
        this.props.dirty()
    }
    ActivityData = () => {
        return {
            id: this.state.activity.id,
            name: this.state.activity.name,
            startTime: this.state.startUsed ? this.state.activity.startTime : undefined,
            endTime: this.state.endUsed ? this.state.activity.endTime : undefined,
            items: this.state.getData ? this.state.getData() : []
        }
    }
    handleData = (fn: () => FormItem[]) => {
        this.setState({
            getData: fn
        })
    }
    render() {
        const classes = this.props.classes
        return (
            <div className={classes.root}>
                <Paper className={classes.activityEditor}>
                    <div className={classes.titleContent}>
                        <Typography variant="h6" className={classes.title}>
                            {this.state.titleEdit ? (
                                <TextField
                                    autoFocus
                                    className={classes.input}
                                    value={this.state.activity.name}
                                    onBlur={this.titleBlur}
                                    onChange={this.titleChange}
                                />
                            ) : (
                                this.state.activity.name
                            )}
                        </Typography>
                        {!this.state.titleEdit && (
                            <IconButton onClick={this.titleEdit} disabled={this.props.disabled}>
                                <EditIcon />
                            </IconButton>
                        )}
                    </div>
                    <MuiPickersUtilsProvider utils={DayjsUtils}>
                        <div className={classes.timeContent}>
                            <div className={classes.time}>
                                <FormControlLabel
                                    label="报名开始时间"
                                    control={
                                        <Switch
                                            checked={this.state.startUsed}
                                            onChange={this.timeUse}
                                            value="start"
                                            disabled={this.props.disabled}
                                        />
                                    }
                                />
                                <div>
                                    <DateTimePicker
                                        disabled={!this.state.startUsed || this.props.disabled}
                                        value={this.state.activity.startTime}
                                        onChange={this.startTimeChange}
                                        format="YYYY-MM-DD HH:mm:ss"
                                    />
                                </div>
                            </div>
                            <div className={classes.time}>
                                <FormControlLabel
                                    label="报名截止时间"
                                    control={
                                        <Switch
                                            checked={this.state.endUsed}
                                            onChange={this.timeUse}
                                            value="end"
                                            disabled={this.props.disabled}
                                        />
                                    }
                                />
                                <div>
                                    <DateTimePicker
                                        disabled={!this.state.endUsed || this.props.disabled}
                                        value={this.state.activity.endTime}
                                        onChange={this.endTimeChange}
                                        format="YYYY-MM-DD HH:mm:ss"
                                    />
                                </div>
                            </div>
                        </div>
                    </MuiPickersUtilsProvider>
                </Paper>
                {this.state.activity.status > 0 && (
                    <ApplicantList
                        finish={this.state.activity.status == 3}
                        activityId={this.state.activity.id}
                    />
                )}
                <div className={classes.controlList}>
                    {this.state.loading ? (
                        <div className={classes.loading}>
                            <div className="line-scale">
                                <div />
                                <div />
                                <div />
                                <div />
                                <div />
                            </div>
                        </div>
                    ) : (
                        <ControlList
                            formItems={this.state.items}
                            dirty={this.props.dirty}
                            disabled={this.props.disabled}
                            removeNewItemHandle={this.props.removeNewItemHandle}
                            dataHandle={this.handleData}
                            copy={this.props.copy}
                            paste={this.props.paste}
                        />
                    )}
                </div>
            </div>
        )
    }
}

export default withStyles(style)(Editor)
