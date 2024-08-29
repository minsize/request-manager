"use strict";var t=require("elum-state/solid"),e=require("solid-js");const r=t.atom({key:"%array%",default:{}}),s=t.atom({key:"%time%",default:{}}),a=(e,s=5e4)=>{if(!t.getter(r)[e])return;const a=setTimeout((()=>{t.setter(r,(t=>{const{[e]:r,...s}=t;return s}))}),s+1e4);t.setter(r,(t=>(t[e]?.clear&&clearTimeout(t[e]?.clear),{...t,[e]:{...t[e],clear:a}})))},n=(e,s,n)=>{t.setter(r,(t=>({...t,[e]:{status:s,error:n,requests:{count:0,time:new Date}}}))),a(e)};var o=(t=>(t.START="start",t.START_LOADER="start_loader",t.END="end",t.ERROR="error",t.UNKNOWN="unknown",t))(o||{});const u=(e,r)=>{(e=>{t.setter(s,(t=>(t[e]&&clearTimeout(t[e]),t)))})(e),n(e,r?o.ERROR:o.END,r)},c=(e,r=200)=>{n(e,o.START),((e,r=200)=>{const u=setTimeout((()=>n(e,o.START_LOADER)),r);t.setter(s,(t=>(t[e]&&clearTimeout(t[e]),{...t,[e]:u}))),a(e,r)})(e,r)},i=(e,s={autoStart:!0,time:200})=>(s.autoStart&&c(e,s.time),{start:t=>c(e,t),end:t=>u(e,t),get:()=>t.getter(r)[e]||{status:o.UNKNOWN}});exports.Status=o,exports.end=u,exports.fetchManager=async(e,s,u,{onResponse:c,maxRequests:R=5,resetDuration:l=1e3})=>{const m=i(e);t.setter(r,(t=>{let r=t[e]?.requests||{count:0,time:null};return r.time&&r.time.getTime()<Date.now()?(r.count=1,r.time=new Date(Date.now()+l)):(r.count+=1,r.time||(r.time=new Date(Date.now()+l))),{...t,[e]:{...t[e],...r}}})),a(e);if((t.getter(r)[e]?.requests?.count||0)>=R&&c){if(c("maxRequests"))return"maxRequests"}try{const t=await fetch(s,u);if(t.ok||m.end({network:!0}),c){const{status:r,error:s}=c(t.clone()),a={[o.START]:()=>m.start(),[o.END]:()=>m.end(),[o.ERROR]:()=>m.end(s)};a[r]?a[r]():n(e,r)}return t}catch(t){throw m.end({unknown:!0}),t}},exports.globalRequestManager=s=>{const[a]=t.globalSignal(r),[i,R]=e.createSignal(a()[s]||{status:o.UNKNOWN});e.createEffect((()=>{const t=a()[s]||{status:o.UNKNOWN};R(t)}));return[{status:i,isDisabled:t=>i().status===o.START||!!t,isLoader:t=>i().status===o.START_LOADER||!!t},(t,e)=>{const r={[o.START]:()=>c(s),[o.END]:()=>u(s),[o.ERROR]:()=>u(s,e)};r[t]?r[t]():n(s,t,e)}]},exports.requestManager=i,exports.start=c;