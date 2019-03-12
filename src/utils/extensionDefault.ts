import { FormItem } from './struct'

const ExtensionDefault = {
    text: (id: number): FormItem => ({
        id: id,
        extension: 'text',
        name: '',
        type: '',
        defaultValue: '',
        unique: false,
        description: '',
        tip: '',
        require: false,
        caseEditable: true,
        case: [],
        rangeName: '长度',
        range: [],
        useRange: false
    }),
    group: (id: number): FormItem => ({
        id: id,
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
    })
}

export default ExtensionDefault
