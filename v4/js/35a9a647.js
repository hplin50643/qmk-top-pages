import{s as x,e as C,r as f,g as a,j as c,aB as j,V as K}from"./index.b74aff06.js";const $=x.div`
    position: absolute;
    left: ${e=>`${e.x}px`};
    top: ${e=>`${e.y}px`};
    width: ${e=>e.width!==void 0?`${e.width}px`:"auto"};
    height: ${e=>e.height!==void 0?`${e.height}px`:"42px"};
`,_=x.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 10px;
    position: relative;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border-radius: 6px;
    user-select: none;
    
    /* 应用状态样式 - 严格按照 Figma 设计稿 - 优化版本 */
    background-color: #3E3E3E;
    border: none;
`,F=x.div`
    position: absolute;
    left: 3px;
    top: 3px;
    width: calc(100% - 6px);
    height: calc(${e=>e.overlayHeightPercent}% - 6px);
    background-color: ${e=>e.overlayColor||"#74EBD5"};
    opacity: ${e=>e.overlayBackgroundOpacity};
    border-radius: 4px;
    pointer-events: none;
    transition: opacity 0.1s ease-in-out;
`,S=x.span`
    font-family: 'Source Han Sans SC', sans-serif;
    font-weight: 400;
    font-size: 12px;
    line-height: 1.5em;
    color: #FFFFFF;
    text-align: center;
    white-space: nowrap;
    position: relative;
    z-index: 1;
`,B=({keyCode:e,keyText:v,x:b,y:g,width:l,height:y=42,className:d,calibrationValue:i})=>{C();const h=f.useMemo(()=>{const p=a.state_行程校准,o=a.calibratedKeyCodeSet.has(e),t=a.getCurrentDevice().deviceType.version?.rf??a.getCurrentDevice().deviceType.version?.usb,u=t&&t<768?1:300;let r=0,s=0;return p.磁轴按键校准事件==="none_调用结束"?(r=0,s=0):o?(r=.8,s=100):i?i>=u?(r=.8,s=100,o||a.calibratedKeyCodeSet.add(e)):i>0&&(r=.3,s=i/u*100):(r=0,s=0),{overlayBackgroundOpacity:r,overlayHeightPercent:s}},[a.state_行程校准.磁轴按键校准事件,i,a.calibratedKeyCodeSet.size]);return c.jsx($,{...d&&{className:d},x:b,y:g,...l!==void 0&&{width:l},...y!==void 0&&{height:y},children:c.jsxs(_,{children:[c.jsx(F,{overlayBackgroundOpacity:h.overlayBackgroundOpacity,overlayHeightPercent:h.overlayHeightPercent,overlayColor:"#74EBD5"}),c.jsx(S,{children:v})]})})},E=({layout:e,width:v,height:b})=>{C(!0);const l=a.state_行程校准,y=j(),d=f.useMemo(()=>{const p=l.磁轴按键校准数组,o=new Map;for(const n of p)o.set(n.code,n.行程值);const t={};for(const n of Object.keys(e))t[n]=o.get(n)||0;return t},[l.磁轴按键校准数组,e]),i=Object.keys(e),h=f.useMemo(()=>i.map(p=>{const o=p,t=e[o];if(!t)return null;const n=Number(t.x)||0,u=Number(t.y)||0,r=Number(t.width)||0,s=Number(t.height)||0,m=t.type,k=t.displayText?.[0]||o,w=d[o];return m!=="key"?null:c.jsx(B,{keyCode:o,keyText:k,x:n,y:u,width:r,height:s,calibrationValue:w},o)}).filter(Boolean),[e,i.length,d]);return c.jsx(K,{divRef:y,type:"左右___主轴居中",w:v,h:b,style:{position:"relative"},children:h})};var O=E;export{E as CalibrationKeyboard,O as default};
