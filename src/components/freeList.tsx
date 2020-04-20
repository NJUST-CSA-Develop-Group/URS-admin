// framework
import * as React from 'react'
import * as XLSX from 'xlsx'
import * as dayjs from 'dayjs'
import { Dayjs } from 'dayjs'
import DayjsUtils from '@date-io/dayjs'
// theme & style
import { Theme, WithStyles, withStyles } from '@material-ui/core/styles'
import { OverflowXProperty } from 'csstype'
// style components
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import { MuiPickersUtilsProvider, DateTimePicker } from 'material-ui-pickers'
// myself utils code
import constValue from '@/utils/constValue'

const style = (theme: Theme) => ({
    root: {
        margin: theme.spacing.unit,
        padding: theme.spacing.unit
    },
    tableContent: {
        width: '100%',
        overflowX: 'auto' as OverflowXProperty
    },
    tablePre: {
        display: 'flex',
        alignItems: 'center',
        paddingRight: theme.spacing.unit * 2,
        height: 36
    },
    spacer: {
        flexGrow: 1
    }
})

interface DataItem {
    schoolId: string
    name: string
}

interface FreeListProps extends React.Props<FreeList>, WithStyles<typeof style> {
    setDownloader(downloader: () => Promise<void>): void
}

interface FreeListState {
    loading: boolean
    count: number
    data: DataItem[]
    startTime: string
    endTime: string
}

class FreeList extends React.Component<FreeListProps, FreeListState> {
    constructor(props: FreeListProps) {
        super(props)
        this.state = {
            loading: false,
            count: 0,
            data: [],
            startTime: dayjs(new Date()).subtract(7, 'day').format('YYYY-MM-DD HH:mm:ss'),
            endTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
        }
    }
    componentDidMount() {
        this.load()
    }
    load = async () => {
        try {
            let res = await fetch(
                `${constValue.hostName}/admin/csp/free?start=${this.state.startTime}&end=${this.state.endTime}`,
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
                count: data.count,
                data: data.data
            })
            this.props.setDownloader(this.download)
        } catch (error) {
            console.log(error)
            alert('加载失败\n请联系科协技术部')
        }
    }
    download = async () => {
        let sheet = XLSX.utils.json_to_sheet(
            this.state.data.map((val) => ({
                学号: val.schoolId,
                姓名: val.name
            }))
        )
        let book = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(book, sheet, '名单')
        XLSX.writeFile(
            book,
            `CSP免费名额名单${new Date().toLocaleString().replace(/\//g, '-')}.xlsx`
        )
    }
    setStartTime = async (e: Dayjs) => {
        this.setState({
            startTime: e.format('YYYY-MM-DD HH:mm:ss'),
            loading: true
        })
        await this.load()
        this.setState({
            loading: false
        })
    }
    setEndTime = async (e: Dayjs) => {
        this.setState({
            endTime: e.format('YYYY-MM-DD HH:mm:ss'),
            loading: true
        })
        await this.load()
        this.setState({
            loading: false
        })
    }
    render() {
        const classes = this.props.classes
        return (
            <div>
                <Paper className={classes.root}>
                    <Grid container>
                        <MuiPickersUtilsProvider utils={DayjsUtils}>
                            <Grid item sm={6}>
                                <Typography>开始时间</Typography>
                                <DateTimePicker
                                    disabled={this.state.loading}
                                    value={this.state.startTime}
                                    onChange={this.setStartTime}
                                    format="YYYY-MM-DD HH:mm:ss"
                                />
                            </Grid>
                            <Grid item sm={6}>
                                <Typography>结束时间</Typography>
                                <DateTimePicker
                                    disabled={this.state.loading}
                                    value={this.state.endTime}
                                    onChange={this.setEndTime}
                                    format="YYYY-MM-DD HH:mm:ss"
                                />
                            </Grid>
                        </MuiPickersUtilsProvider>
                    </Grid>
                    <div className={classes.tablePre}>
                        <div className={classes.spacer}></div>
                        <Typography variant="body1">共计: {this.state.count}人</Typography>
                    </div>
                    <div className={classes.tableContent}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">学号</TableCell>
                                    <TableCell align="center">姓名</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.data.map((row) => (
                                    <TableRow key={row.schoolId}>
                                        <TableCell>{row.schoolId}</TableCell>
                                        <TableCell>{row.name}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </Paper>
            </div>
        )
    }
}

export default withStyles(style)(FreeList)
