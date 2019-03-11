import { ExtensionDesc, FormItem, ExtensionType } from './struct'

const constValue = {
    hostName: 'http://localhost', //'https://www.turing-cup.online/voteapp',
    rootPath: '/', //'/voteapp/admin'
    corsType: 'cors' as 'cors',
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
        group: '分组'
    },
    extensionDesc: {
        text: {
            caseEditable: true,
            rangeName: '长度'
        } as ExtensionDesc,
        group: {
            caseEditable: false,
            rangeName: ''
        }
    },
    defaultCase(type: ExtensionType): string[] {
        switch (type) {
            default:
                return []
        }
    },
    defaultValue(id: bigint, type: ExtensionType): FormItem {
        switch (type) {
            case 'text':
                return {
                    id: BigInt(id.toString()),
                    extension: 'text',
                    name: '',
                    type: '',
                    defaultValue: '',
                    unique: false,
                    description: '',
                    tip: '',
                    require: false,
                    caseEditable: false,
                    rangeName: '长度',
                    range: [],
                    useRange: false
                }
            case 'group':
                return {
                    id: BigInt(id.toString()),
                    extension: 'group',
                    name: '',
                    type: '',
                    defaultValue: '',
                    unique: false,
                    description: '',
                    tip: '',
                    require: false,
                    caseEditable: false,
                    rangeName: '',
                    range: [],
                    useRange: false
                }
        }
    }
}

export default constValue
