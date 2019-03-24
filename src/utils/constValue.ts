import { ExtensionDesc, FormItem, ExtensionType } from './struct'
import ExtensionDefault from './extensionDefault'

const constValue = {
    hostName: '/voteapp',
    rootPath: '/voteapp/page/',
    corsType: 'no-cors' as 'no-cors',
    loginErrMsg: (errCode: number) => {
        switch (errCode) {
            case 401:
                return '密码错误'
            case 403:
                return '禁止访问'
            default:
                return `登录失败，请联系科协技术部\n错误信息:/login[${errCode}]`
        }
    },
    DragDropConst: Symbol(),
    extensionName: {
        text: '单行文本',
        number: '数字',
        radio: '单选框',
        checkbox: '复选框',
        date: '日期',
        textarea: '多行文本',
        group: '分组',
        //
        personName: '姓名',
        teamName: '队伍名称',
        sex: '性别',
        nation: '民族',
        political: '政治面貌',
        studentNumber: '学号',
        phone: '手机号',
        qq: 'QQ号',
        email: '电子邮箱',
        idcard: '身份证号',
        GPA: 'GPA',
        rank: '排名'
    },
    extensionDesc: {
        text: {
            caseEditable: false,
            rangeName: '字数'
        } as ExtensionDesc,
        number: {
            caseEditable: false,
            rangeName: '值'
        } as ExtensionDesc,
        radio: {
            caseEditable: true,
            rangeName: ''
        } as ExtensionDesc,
        checkbox: {
            caseEditable: true,
            rangeName: '选择项数'
        } as ExtensionDesc,
        date: {
            caseEditable: false,
            rangeName: '日期'
        } as ExtensionDesc,
        textarea: {
            caseEditable: false,
            rangeName: '字数'
        } as ExtensionDesc,
        group: {
            caseEditable: false,
            rangeName: ''
        } as ExtensionDesc,
        //
        personName: {
            caseEditable: false,
            rangeName: '姓名长度'
        } as ExtensionDesc,
        teamName: {
            caseEditable: false,
            rangeName: '队名长度'
        } as ExtensionDesc,
        sex: {
            caseEditable: false,
            rangeName: ''
        } as ExtensionDesc,
        nation: {
            caseEditable: false,
            rangeName: ''
        } as ExtensionDesc,
        political: {
            caseEditable: true,
            rangeName: ''
        } as ExtensionDesc,
        studentNumber: {
            caseEditable: false,
            rangeName: ''
        } as ExtensionDesc,
        phone: {
            caseEditable: false,
            rangeName: ''
        } as ExtensionDesc,
        qq: {
            caseEditable: false,
            rangeName: ''
        } as ExtensionDesc,
        email: {
            caseEditable: false,
            rangeName: ''
        } as ExtensionDesc,
        idcard: {
            caseEditable: false,
            rangeName: ''
        } as ExtensionDesc,
        GPA: {
            caseEditable: false,
            rangeName: 'GPA'
        } as ExtensionDesc,
        rank: {
            caseEditable: false,
            rangeName: '排名'
        } as ExtensionDesc
    },
    defaultCase(type: ExtensionType): string[] {
        switch (type) {
            case 'political':
                return ['群众', '团员', '预备党员', '党员']
            default:
                return []
        }
    },
    defaultValue(id: number, type: ExtensionType): FormItem {
        return ExtensionDefault[type](id)
    }
}

export default constValue
