import constValue from './constValue'
import { BackFormItem, FormItem } from './struct'

export function Back2Front(back: BackFormItem): FormItem[] {
    let desc = constValue.extensionDesc[back.extension]
    let result = [
        {
            id: -1,
            extension: back.extension,
            name: back.name,
            type: back.type,
            unique: back.unique,
            defaultValue: back.defaultValue || '',
            description: back.description,
            tip: back.tip,
            require: back.require,
            case: back.case,
            useRange: back.range != undefined,
            range: back.range || [0, 0],
            groupTo: undefined,
            /*subItem:
            back.subItem != undefined ? back.subItem.map((value) => Back2Front(value)) : undefined,*/
            caseEditable: desc.caseEditable,
            rangeName: desc.rangeName
        }
    ] as FormItem[]
    if (back.extension === 'group') {
        result[0].type = 'begin'
        for (let it of back.subItem!) {
            result = result.concat(Back2Front(it))
        }
        let end = {
            id: -1,
            extension: back.extension,
            name: back.name,
            type: 'end',
            unique: back.unique,
            defaultValue: back.defaultValue || '',
            description: back.description,
            tip: back.tip,
            require: back.require,
            case: back.case,
            useRange: back.range != undefined,
            range: back.range || [0, 0],
            groupTo: undefined,
            caseEditable: desc.caseEditable,
            rangeName: desc.rangeName
        }
        result[0].groupTo = end
        result.push(end)
    }
    return result
}

export function Front2Back(front: FormItem[], index: number): BackFormItem[] {
    let result = [] as BackFormItem[]
    for (let i = index; i < front.length; i++) {
        let it = front[i]
        let res = {
            extension: it.extension,
            name: it.name,
            type: it.type,
            unique: it.unique,
            defaultValue: it.defaultValue || undefined,
            description: it.description,
            tip: it.tip,
            require: it.require,
            case: it.caseEditable ? it.case : undefined,
            range: it.useRange ? it.range : undefined,
            subItem: undefined
            //front.subItem != undefined ? front.subItem.map((value) => Front2Back(value)) : undefined
        } as BackFormItem
        if (it.extension == 'group') {
            if (it.type === 'end') {
                break
            } else if (it.type === 'begin') {
                res.subItem = Front2Back(front, i + 1)
                i += res.subItem.length + 1
            }
        }
        result.push(res)
    }
    return result
    /*return {
        extension: front.extension,
        name: front.name,
        type: front.type,
        unique: front.unique,
        defaultValue: front.defaultValue || undefined,
        description: front.description,
        tip: front.tip,
        require: front.require,
        case: front.caseEditable ? front.case : undefined,
        range: front.useRange ? front.range : undefined,
        subItem:
            front.subItem != undefined ? front.subItem.map((value) => Front2Back(value)) : undefined
    }*/
}
