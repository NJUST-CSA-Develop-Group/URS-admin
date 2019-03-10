import constValue from './constValue'
import { BackFormItem, FormItem } from './struct'

export function Back2Front(back: BackFormItem): FormItem {
    let desc = constValue.extensionDesc[back.extension]
    return {
        id: BigInt(-1),
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
        subItem:
            back.subItem != undefined ? back.subItem.map((value) => Back2Front(value)) : undefined,
        caseEditable: desc.caseEditable,
        rangeName: desc.rangeName
    }
}

export function Front2Back(front: FormItem): BackFormItem {
    return {
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
    }
}
