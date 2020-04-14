// framework
import * as React from 'react'
// theme & style
import { Theme, WithStyles, withStyles } from '@material-ui/core/styles'
import { OverflowXProperty } from 'csstype'
// style components
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight'
// myself utils code
import constValue from '@/utils/constValue'

const style = (theme: Theme) => ({
    root: {
        margin: theme.spacing.unit,
        padding: theme.spacing.unit
    },
    titleContent: {
        display: 'flex',
        alignItems: 'center',
        height: 48
    },
    title: {
        flexGrow: 1
    },
    tableContent: {
        width: '100%',
        overflowX: 'auto' as OverflowXProperty
    },
    tableFoot: {
        display: 'flex',
        alignItems: 'center'
    },
    spacer: {
        flexGrow: 1
    }
})

interface DataItem {
    Id: string
    schoolId: string
    name: string
    reason: string
}

interface RequestReviewProps extends React.Props<RequestReview>, WithStyles<typeof style> {
    setRefresher(refresher: () => Promise<void>): void
}

interface RequestReviewState {
    page: number
    totalPage: number
    data: DataItem[]
    currentId: string
    submitting: boolean
    loading: boolean
    reason: string
}

class RequestReview extends React.Component<RequestReviewProps, RequestReviewState> {
    constructor(props: RequestReviewProps) {
        super(props)
        this.state = {
            page: 1,
            totalPage: 2,
            data: [],
            currentId: '',
            submitting: false,
            loading: false,
            reason: ''
        }
        this.props.setRefresher(this.load)
    }
    componentDidMount() {
        this.load()
    }
    load = async () => {
        this.setState({
            loading: true,
            data: []
        })
        try {
            let res = await fetch(
                `${constValue.hostName}/admin/csp/audit/list/${this.state.page}`,
                {
                    method: 'GET',
                    mode: constValue.corsType,
                    cache: 'no-cache'
                }
            )
            if (!res.ok) {
                throw res.status
            }
            let data = await res.json()
            this.setState({
                totalPage: data.totalPage,
                data: data.data,
                loading: false
            })
            if (this.state.page > this.state.totalPage) {
                this.setState({
                    page: this.state.totalPage
                })
                await this.load()
            }
        } catch (error) {
            console.log(error)
            alert('加载失败\n请联系科协技术部')
            this.setState({
                loading: false
            })
        }
    }
    openDialog = (id: string) => {
        return () => {
            this.setState({
                currentId: id
            })
            console.log(id)
        }
    }
    handlePrev = async () => {
        if (this.state.page > 1) {
            this.setState({
                page: this.state.page - 1
            })
            await this.load()
        }
    }
    handleNext = async () => {
        if (this.state.page < this.state.totalPage) {
            this.setState({
                page: this.state.page + 1
            })
            await this.load()
        }
    }
    handleClose = () => {
        this.setState({
            currentId: ''
        })
    }
    handleReason = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            reason: e.target.value
        })
    }
    handlePermit = async () => {
        this.setState({
            submitting: true
        })
        try {
            let res = await fetch(
                `${constValue.hostName}/admin/csp/audit/${this.state.currentId}`,
                {
                    method: 'POST',
                    mode: constValue.corsType,
                    cache: 'no-cache',
                    headers: { 'Content-type': 'application/json; charset=UTF-8' },
                    body: JSON.stringify({
                        result: 'AUDIT_PERMIT',
                        comment: ''
                    })
                }
            )
            if (!res.ok) {
                throw res.status
            }
            this.setState({
                submitting: false
            })
            this.handleClose()
            await this.load()
        } catch (error) {
            console.log(error)
            alert('提交失败\n请联系科协技术部')
            this.setState({
                submitting: false
            })
            this.handleClose()
        }
    }
    handleReject = async () => {
        this.setState({
            submitting: true
        })
        try {
            let res = await fetch(
                `${constValue.hostName}/admin/csp/audit/${this.state.currentId}`,
                {
                    method: 'POST',
                    mode: constValue.corsType,
                    cache: 'no-cache',
                    headers: { 'Content-type': 'application/json; charset=UTF-8' },
                    body: JSON.stringify({
                        result: 'AUDIT_REJECT',
                        comment: this.state.reason
                    })
                }
            )
            if (!res.ok) {
                throw res.status
            }
            this.setState({
                submitting: false
            })
            this.handleClose()
            // reload
        } catch (error) {
            console.log(error)
            alert('提交失败\n请联系科协技术部')
            this.setState({
                submitting: false
            })
            this.handleClose()
        }
    }
    render() {
        const classes = this.props.classes
        const current =
            this.state.currentId != ''
                ? this.state.data.find((val) => val.Id === this.state.currentId)
                : undefined
        return (
            <div>
                <div className={classes.titleContent}>
                    <Typography variant="h6" className={classes.title}>
                        审核对于免费名额的申请
                    </Typography>
                </div>
                <Paper className={classes.root}>
                    <div className={classes.tableContent}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">学号</TableCell>
                                    <TableCell align="center">姓名</TableCell>
                                    <TableCell align="center">申请原因</TableCell>
                                    <TableCell align="center">操作</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.data.map((row) => (
                                    <TableRow key={row.Id}>
                                        <TableCell align="center">{row.schoolId}</TableCell>
                                        <TableCell align="center">{row.name}</TableCell>
                                        <TableCell align="center">{row.reason}</TableCell>
                                        <TableCell align="center">
                                            <Button
                                                disabled={this.state.submitting}
                                                onClick={this.openDialog(row.Id)}>
                                                审核
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className={classes.tableFoot}>
                            <div className={classes.spacer}></div>
                            <Typography>
                                第{this.state.page}页，共{this.state.totalPage}页
                            </Typography>
                            <IconButton
                                disabled={this.state.page <= 1 || this.state.loading}
                                onClick={this.handlePrev}>
                                <KeyboardArrowLeftIcon />
                            </IconButton>
                            <IconButton
                                disabled={
                                    this.state.page >= this.state.totalPage || this.state.loading
                                }
                                onClick={this.handleNext}>
                                <KeyboardArrowRightIcon />
                            </IconButton>
                        </div>
                    </div>
                </Paper>
                <Dialog open={this.state.currentId != ''} onClose={this.handleClose}>
                    <DialogTitle>审核</DialogTitle>
                    <DialogContent>
                        {current != undefined && (
                            <DialogContentText>
                                <b>学号:</b>
                                {current.schoolId}
                                <br />
                                <b>姓名:</b>
                                {current.name}
                                <br />
                                <b>原因:</b>
                                {current.reason}
                            </DialogContentText>
                        )}
                        <TextField
                            label="拒绝原因(选填)"
                            value={this.state.reason}
                            onChange={this.handleReason}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button disabled={this.state.submitting} onClick={this.handleReject}>
                            拒绝
                        </Button>
                        <Button
                            disabled={this.state.submitting}
                            color="primary"
                            onClick={this.handlePermit}>
                            同意
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

export default withStyles(style)(RequestReview)
