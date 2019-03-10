// framework
import * as React from 'react'
import { RouteComponentProps } from 'react-router'
// theme & style
import { Theme, WithStyles, withStyles } from '@material-ui/core/styles'
import { FlexDirectionProperty, PositionProperty } from 'csstype'
// style components
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import IconButton from '@material-ui/core/IconButton'
import Input from '@material-ui/core/Input'
import InputAdornment from '@material-ui/core/InputAdornment'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import Select from '@material-ui/core/Select'
//import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import HowToVoteIcon from '@material-ui/icons/HowToVote'
import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
// myself utils code
import constValue from '@/utils/constValue'

const style = (theme: Theme) => ({
    root: {
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    content: {
        position: 'relative' as PositionProperty,
        padding: theme.spacing.unit * 4,
        display: 'flex',
        flexDirection: 'column' as FlexDirectionProperty,
        alignItems: 'center'
    },
    avatar: {
        margin: theme.spacing.unit,
        backgroundColor: theme.palette.secondary.main
    },
    formControl: {
        margin: theme.spacing.unit,
        width: 240
    },
    overOuter: {
        position: 'absolute' as PositionProperty,
        top: 0,
        width: '100%',
        height: '100%',
        padding: 10
    },
    overInner: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column' as FlexDirectionProperty,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

interface User {
    id: string
    name: string
}

interface LoginProps extends React.Props<Login>, RouteComponentProps, WithStyles<typeof style> {}

interface LoginState {
    loading: boolean
    error: string
    users: User[]
    username: string
    password: string
    visibility: boolean
}

class Login extends React.Component<LoginProps, LoginState> {
    constructor(props: LoginProps) {
        super(props)
        this.state = {
            loading: true,
            error: '',
            users: [],
            username: '',
            password: '',
            visibility: false
        }
    }
    componentDidMount() {
        this.setState({
            loading: true,
            error: '',
            users: [],
            username: '',
            password: ''
        })
        fetch(constValue.hostName + '/users', {
            mode: constValue.corsType,
            cache: 'no-cache'
        })
            .then((res) => res.json())
            .then((users: User[]) => {
                this.setState({
                    loading: false,
                    users
                })
            })
            .catch((error) => {
                this.setState({
                    error: error.toString()
                })
            })
    }
    handleUsernameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        this.setState({
            username: e.target.value
        })
    }
    handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            password: e.target.value
        })
    }
    toggleVisibility = () => {
        this.setState({
            visibility: !this.state.visibility
        })
    }
    handlLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (this.state.username === '') {
            alert('请选择组织')
            return
        }
        fetch(constValue.hostName + '/login', {
            method: 'POST',
            mode: constValue.corsType,
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password
            })
        })
            .then((res) => {
                if (!res.ok) {
                    throw res.status
                }
                this.props.history.replace(constValue.rootPath + 'activity/_')
            })
            .catch((error: number) => {
                alert(constValue.loginErrMsg(error))
            })
    }
    render() {
        const classes = this.props.classes
        return (
            <div className={classes.root}>
                <Paper>
                    <form onSubmit={this.handlLogin} className={classes.content} autoComplete="off">
                        <Avatar className={classes.avatar}>
                            <HowToVoteIcon />
                        </Avatar>
                        <FormControl className={classes.formControl} required>
                            <InputLabel htmlFor="username">组织</InputLabel>
                            <Select
                                value={this.state.username}
                                onChange={this.handleUsernameChange}
                                inputProps={{
                                    name: 'username',
                                    id: 'username'
                                }}>
                                <MenuItem value="">
                                    <em>(缺省)</em>
                                </MenuItem>
                                {this.state.users.map((item) => {
                                    return (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.name}
                                        </MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>
                        <FormControl className={classes.formControl} required>
                            <InputLabel htmlFor="password">密码</InputLabel>
                            <Input
                                id="password"
                                type={this.state.visibility ? 'text' : 'password'}
                                value={this.state.password}
                                onChange={this.handlePasswordChange}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton onClick={this.toggleVisibility}>
                                            {this.state.visibility ? (
                                                <VisibilityIcon />
                                            ) : (
                                                <VisibilityOffIcon />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <Button variant="contained" color="primary" type="submit">
                                登录
                            </Button>
                        </FormControl>
                        {this.state.loading && (
                            <div className={classes.overOuter}>
                                <div className={classes.overInner}>
                                    {this.state.error === '' && (
                                        <div className="ball-scale-ripple-multiple">
                                            <div />
                                            <div />
                                            <div />
                                        </div>
                                    )}
                                    {this.state.error && <Typography variant="h4">:(</Typography>}
                                    {this.state.error && (
                                        <Typography variant="h6">
                                            登录信息加载失败
                                            <br />
                                            请联系科协技术部
                                        </Typography>
                                    )}
                                </div>
                            </div>
                        )}
                    </form>
                </Paper>
            </div>
        )
    }
}

export default withStyles(style)(Login)
