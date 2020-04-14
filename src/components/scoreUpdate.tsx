// framework
import * as React from 'react'
import * as XLSX from 'xlsx'
// theme & style
import { Theme, WithStyles, withStyles } from '@material-ui/core/styles'
import { OverflowXProperty } from 'csstype'
// style components
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
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
    file: {
        display: 'none'
    }
})

const tableHead = ['学号', '姓名', '总分', '第一题', '第二题', '第三题', '第四题', '第五题']

interface ScoreItem {
    schoolId: string
    name: string
    totalScore: number
    score: number[]
}

function parser(sheet: XLSX.WorkSheet) {
    return XLSX.utils.sheet_to_json(sheet).map((row: any) => ({
        schoolId: row['学号'].toString(),
        name: row['姓名'].toString(),
        totalScore: parseInt(row['总分']),
        score: tableHead.slice(3).map((id) => parseInt(row[id]))
    }))
}

interface ScoreUpdateProps extends React.Props<ScoreUpdate>, WithStyles<typeof style> {
    setUploader(handle: () => Promise<void>): void
}

interface ScoreUpdateState {
    passScore: string
    data?: ScoreItem[]
    parsing: boolean
    upload: boolean
    error: boolean
}

class ScoreUpdate extends React.Component<ScoreUpdateProps, ScoreUpdateState> {
    constructor(props: ScoreUpdateProps) {
        super(props)
        this.state = {
            passScore: '0',
            data: undefined,
            parsing: false,
            upload: false,
            error: false
        }
        this.props.setUploader(this.upload)
    }
    handlePassScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = parseInt(e.target.value)
        if (value >= 0 && value <= 500) {
            this.setState({
                passScore: value.toString(),
                error: false
            })
        } else {
            this.setState({
                passScore: e.target.value,
                error: true
            })
        }
    }
    handleFileButton = () => {
        ;(this.refs.fileInput as HTMLInputElement).click()
    }
    handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files != null && e.target.files.length != 0) {
            let file = e.target.files!.item(0)
            ;(this.refs.fileInput as HTMLInputElement).value = ''
            this.setState({
                parsing: true
            })
            new Promise<XLSX.WorkBook>((resolve) => {
                let reader = new FileReader()
                reader.onload = (e) => {
                    let data = new Uint8Array((e.target as FileReader).result as ArrayBuffer)
                    resolve(XLSX.read(data, { type: 'array' }))
                }
                reader.readAsArrayBuffer(file as File)
            }).then((doc) => {
                this.setState({
                    data: parser(doc.Sheets[doc.SheetNames[0]]),
                    parsing: false
                })
            })
        }
    }
    public upload = async () => {
        if (this.state.error) {
            alert('下线分数格式错误')
            return
        }
        this.setState({
            upload: true
        })
        try {
            let res = await fetch(`${constValue.hostName}/admin/csp/score`, {
                method: 'POST',
                mode: constValue.corsType,
                cache: 'no-cache',
                headers: { 'Content-type': 'application/json; charset=UTF-8' },
                body: JSON.stringify({
                    passScore: this.state.passScore,
                    data: this.state.data
                })
            })
            if (!res.ok) {
                throw res.status
            }
            alert('上传成功')
            this.setState({
                passScore: '0',
                data: undefined,
                error: false
            })
        } catch (error) {
            console.log(error)
            alert('上传失败\n请联系科协技术部')
        }
        this.setState({
            upload: false
        })
    }
    render() {
        const classes = this.props.classes
        return (
            <div>
                <Paper className={classes.root}>
                    <div className={classes.titleContent}>
                        <Typography variant="h6" className={classes.title}>
                            上传CSP成绩单，用于提供自动免费名额
                        </Typography>
                    </div>
                    <TextField
                        label="下限分数"
                        required
                        type="number"
                        disabled={this.state.upload}
                        value={this.state.passScore}
                        error={this.state.error}
                        onChange={this.handlePassScoreChange}
                    />
                </Paper>
                <Paper className={classes.root}>
                    <div className={classes.titleContent}>
                        <b className={classes.title}>成绩列表</b>
                        <Button
                            variant="contained"
                            color="secondary"
                            disabled={this.state.parsing || this.state.upload}
                            onClick={this.handleFileButton}>
                            {this.state.data == undefined ? '载入文件' : '重新载入'}
                        </Button>
                        <input
                            type="file"
                            accept=".xlsx"
                            className={classes.file}
                            ref="fileInput"
                            onChange={this.handleFileInput}
                        />
                    </div>
                    {this.state.data != undefined && (
                        <div className={classes.tableContent}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {tableHead.map((val) => (
                                            <TableCell key={val} align="center">
                                                {val}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.data.map((row) => (
                                        <TableRow key={row.schoolId}>
                                            <TableCell>{row.schoolId}</TableCell>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell>{row.totalScore}</TableCell>
                                            {row.score.map((val, index) => (
                                                <TableCell key={index}>{val}</TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </Paper>
            </div>
        )
    }
}

export default withStyles(style)(ScoreUpdate)
