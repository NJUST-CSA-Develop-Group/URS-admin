import { ExtensionDesc, FormItem, ExtensionType } from './struct'
import ExtensionDefault from './extensionDefault'

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
    defaultValue(id: number, type: ExtensionType): FormItem {
        return ExtensionDefault[type](id)
    }
}

export default constValue
