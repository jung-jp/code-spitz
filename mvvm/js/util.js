// selector 처리, 첫번째 el 리턴
const sel = (v, el = document) => el.querySelector(v);
// 속성추가 후 el 리턴
const attr = (el, ...attr) =>(attr.some((k, i)=>{
    if(i % 2) return;
    const v = attr[i + 1];
    if(typeof el[k] == 'function') el[k](...(Array.isArray(v)? v :[v]));
    else if(k[0] == '@') el.style[k.substr(1)] = v;
    else el[k] = v;
}), el);
// el에 속성을 추가한다.(string을 받으면 생성후 추가한다.)
const el = (tag, ...arg)=>attr(typeof tag == 'string' ? document.createElement(tag) : tag, ...arg);
// 부모노드에서 대상노드 앞에 el 추가
const prepend =(node, ...el)=>(el.reverse().forEach(v=>node.insertBefore(v, node.firstChild)), node);
// 부모노드의 마지막에 el 추가
const append =(node, ...el)=>(el.forEach(v=>node.appendChild(v)), node);

const err = (v = 'invalid') => { throw v; };
const override = _ => err('override');
const prop = (t, p) => Object.assign(t, p);
const is = (t, p) => t instanceof p;
