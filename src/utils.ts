import { Ioption } from "./types";

export function toUtf8String(value:string)
{
    let val='';
    value=value?value:'';
    for(let i=0; i<value.length; i++)
    {
        const ichar = value.charCodeAt(i);
        if(ichar<=127){
            val+=value.charAt(i);
        }
    }
    return val;
}

export function toStr(value:string|number|null|undefined,usingUtf8:boolean=true){
    if(value===null || value===undefined) return '';

    value=typeof value==="string" || typeof value==="number"?value.toString():"";
    value=usingUtf8?toUtf8String(value):value.toString();
    return value;
}

export function toSingleString(value:any):string
{
    if(typeof value==="string" || typeof value==="number")
    {
        return toStr(value).toString().trim();
    }
    if(Array.isArray(value) && value.length>0)
    {
        return toSingleString(value[0]);
    }
    return "";
}

export function toArrayString(options:any)
{
    const s:any[]=[];
    if(typeof options==="string" || typeof options==="number")
    {
        const value=toStr(options).toString().trim();
        if(value.length>0) s.push(value);
    }
    else if(Array.isArray(options) && options.length>0) {
        for(let i=0; i<options.length; i++)
        {
            let val = toSingleString(options[i]);
            if (val.length > 0) {
                s.push(val);
            }
        }
    }
    return s;
}

export function isEqual(value: any, other: any) 
{
    // Get the value type
    let type = Object.prototype.toString.call(value);

    // If the two objects are not the same type, return false
    if (type !== Object.prototype.toString.call(other)) return false;

    if (value === null && other === null) return true;
    if (value === undefined && other === undefined) return true;

    if (value === true && other === true) return true;
    if (value === false && other === false) return true;

    if (typeof value === "number" && typeof other === "number" && value === other) return true;
    if (typeof value === "string" && typeof other === "string" && value === other) return true;

    // If items are not an object or array, return false
    if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;

    // Compare the length of the length of the two items
    let valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
    let otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
    if (valueLen !== otherLen) return false;

    // Compare two items
    let compare = function (item1: any, item2: any) {

        // Get the object type
        let itemType = Object.prototype.toString.call(item1);

        // If an object or array, compare recursively
        if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
            if (!isEqual(item1, item2)) return false;
        }

        // Otherwise, do a simple comparison
        else {

            // If the two items are not the same type, return false
            if (itemType !== Object.prototype.toString.call(item2)) return false;

            // Else if it's a function, convert to a string and compare
            // Otherwise, just compare
            if (itemType === '[object Function]') {
                if (item1.toString() !== item2.toString()) return false;
            } else {
                if (item1 !== item2) return false;
            }

        }
    };

    // Compare properties
    if (type === '[object Array]') {
        for (let i = 0; i < valueLen; i++) {
            if (compare(value[i], other[i]) === false) return false;
        }
    } else {
        for (let key in value) {
            if (value.hasOwnProperty(key)) {
                if (compare(value[key], other[key]) === false) return false;
            }
        }
    }
    // If nothing failed, return true
    return true;
}

export function isObjectEmpty(obj:object)
{
    for(let key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

export function checkCompare(textContext:string | null | undefined, stringSearch:string | null | undefined) {
    let a = (textContext || "").toString().toLowerCase();
    let b = (stringSearch || "").toString().toLowerCase();
    return a.indexOf(b) > -1;
}

export function stripHtmlTags(str:string | number | null | undefined)
{
    if(str===null || str===undefined || str==='') return '';
    str=str.toString();
    return str.replace(/<[^>]*>/g,'');
}

export function getFocusElement()
{
    return document && document.activeElement;
}

export function random_string():string
{
    return ('sl'+Math.random().toString(32)+Date.now().toString(32)).replace(/\./g,'');
}

type IgeneratOptionsProps = {
    options?:any[]
    fieldid?:string
    fieldname:string
    onFieldName?:(e:any)=>string
}

type IgenerateOptionResult = {
    options:Ioption[]
    options_b:string[];
}

export function generateOptions(props:IgeneratOptionsProps):IgenerateOptionResult
{
    const ops:Ioption[]=[];
    const ops_b:any=[];

    if(Array.isArray(props.options) && props.options.length>0)
    {
        let fid=toStr(props.fieldid).toString().trim();
        let fname=toStr(props.fieldname).toString().trim();
        fid=fid.length<1?"id":fid;
        fname=fname.length<1?fid:fname;

        const keys:any[]=[];
        for(let i=0; i<props.options.length; i++)
        {
            if(isObjectEmpty(props.options[i])) continue;
            const o=props.options[i];

            let valueId=toStr(o[fid]).toString().trim();

            if(keys.indexOf(valueId)>=0) continue;

            let label=toStr(o[fname]);
            label=label.length<1?valueId:label;
            let __html=label;

            if(typeof props.onFieldName==='function')
            {
                try {
                    const test=toStr(props.onFieldName(o)).toString().trim();
                    if(test.length>0)
                    {
                        __html=test;
                    }
                }
                catch(errr:any)
                {

                }
            }

            ops_b.push(valueId);

            const ps:Ioption={
                ...o,
                __id:valueId,
                __label:stripHtmlTags(label),
                __html,
            }

            keys.push(valueId);

            ops.push(ps);
        }
    }

    return {
        options:ops,
        options_b:ops_b,
    };
}

export function getDropDownContainer()
{
    let tips=document.getElementById('select-outline-container');
    if(tips===null)
    {
        tips=document.createElement('div');
        tips.setAttribute('id','select-outline-container');
        document.body.appendChild(tips);
    }
    return tips;
}