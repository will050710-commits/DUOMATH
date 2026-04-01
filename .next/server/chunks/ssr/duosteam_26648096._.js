module.exports=[80832,(a,b,c)=>{"use strict";b.exports=a.r(76449).vendored.contexts.AppRouterContext},48901,(a,b,c)=>{"use strict";b.exports=a.r(76449).vendored["react-ssr"].ReactServerDOMTurbopackClient},6172,(a,b,c)=>{"use strict";b.exports=a.r(76449).vendored["react-ssr"].ReactDOM},87061,(a,b,c)=>{"use strict";function d(a){if("function"!=typeof WeakMap)return null;var b=new WeakMap,c=new WeakMap;return(d=function(a){return a?c:b})(a)}c._=function(a,b){if(!b&&a&&a.__esModule)return a;if(null===a||"object"!=typeof a&&"function"!=typeof a)return{default:a};var c=d(b);if(c&&c.has(a))return c.get(a);var e={__proto__:null},f=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var g in a)if("default"!==g&&Object.prototype.hasOwnProperty.call(a,g)){var h=f?Object.getOwnPropertyDescriptor(a,g):null;h&&(h.get||h.set)?Object.defineProperty(e,g,h):e[g]=a[g]}return e.default=a,c&&c.set(a,e),e}},10365,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"useMergedRef",{enumerable:!0,get:function(){return e}});let d=a.r(66482);function e(a,b){let c=(0,d.useRef)(null),e=(0,d.useRef)(null);return(0,d.useCallback)(d=>{if(null===d){let a=c.current;a&&(c.current=null,a());let b=e.current;b&&(e.current=null,b())}else a&&(c.current=f(a,d)),b&&(e.current=f(b,d))},[a,b])}function f(a,b){if("function"!=typeof a)return a.current=b,()=>{a.current=null};{let c=a(b);return"function"==typeof c?c:()=>a(null)}}("function"==typeof c.default||"object"==typeof c.default&&null!==c.default)&&void 0===c.default.__esModule&&(Object.defineProperty(c.default,"__esModule",{value:!0}),Object.assign(c.default,c),b.exports=c.default)},62759,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"warnOnce",{enumerable:!0,get:function(){return d}});let d=a=>{}},18502,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0});var d={getDeploymentId:function(){return f},getDeploymentIdQueryOrEmptyString:function(){return g}};for(var e in d)Object.defineProperty(c,e,{enumerable:!0,get:d[e]});function f(){return!1}function g(){return""}},83529,a=>{"use strict";function b(){try{return"http://localhost:5000"}catch{return"http://localhost:5000"}}async function c(){try{let a=await fetch(`${b()}/api/session/new`,{method:"POST"});if(!a.ok)throw Error("bad response");return(await a.json()).session_id}catch{return null}}async function d(a,c){try{let d=await fetch(`${b()}/api/chat`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({session_id:a,message:c})});if(!d.ok)throw Error("bad response");return await d.json()}catch{return{error:!0,message:"server-offline"}}}async function e(a,b){let c=`You are a Vietnamese language assistant. Translate the following English text into Vietnamese and analyze it word by word.

TEXT TO TRANSLATE:
"${b}"

YOU MUST respond with ONLY a valid JSON object — no markdown, no code fences, no explanation text before or after. The JSON must use EXACTLY these keys:

{
  "translation": "<full Vietnamese translation of the text>",
  "summary": "<one sentence explaining the meaning in Vietnamese context>",
  "words": [
    {
      "word": "<English word>",
      "type": "<one of: noun, verb, adj, adv, prep, conj>",
      "pronunciation": "<IPA or phonetic, e.g. /wɜːrd/>",
      "vietnamese": "<Vietnamese translation of just this word>",
      "example": "<short example sentence using this word in English>"
    }
  ]
}

Only include content words in the words array (skip articles like 'a', 'the', 'an' and short prepositions unless important). Respond with the raw JSON only.`,e=await d(a,c);if(e.error)return{error:!0,raw:"Connection failed. Make sure server.py is running."};let f=e.reply||e.message||e.text||"";if(!f)return{error:!0,raw:"Server returned an empty reply. Check server.py logs."};let g=f.replace(/^```json\s*/i,"").replace(/^```\s*/i,"").replace(/```\s*$/i,"").trim().match(/\{[\s\S]*\}/);if(!g)return{error:!0,raw:`Could not find JSON in server reply.

Raw response was:
${f.slice(0,400)}`};try{let a=JSON.parse(g[0]);if(!a.translation)return{error:!0,raw:`JSON parsed but missing 'translation' key.

Got keys: ${Object.keys(a).join(", ")}

Full response:
${JSON.stringify(a,null,2).slice(0,400)}`};return a}catch(a){return{error:!0,raw:`JSON parse failed: ${a.message}

Raw content:
${g[0].slice(0,400)}`}}}a.s(["chat",()=>d,"createSession",()=>c,"translateText",()=>e])},95960,a=>{"use strict";function b(a,c=60){let d=`start-${a}`,e=`end-${a}`;if(!localStorage.getItem(e)){let a=Date.now();localStorage.setItem(d,a),localStorage.setItem(e,a+60*c*1e3)}}function c(a){let b=localStorage.getItem(`end-${a}`);return b?Math.max(0,Math.floor((b-Date.now())/1e3)):0}function d(a){let b=localStorage.getItem(`start-${a}`);return b?Math.floor((Date.now()-b)/1e3):0}function e(a){let b=String(Math.floor(a/3600)).padStart(2,"0"),c=String(Math.floor(a%3600/60)).padStart(2,"0"),d=String(a%60).padStart(2,"0");return`${b}:${c}:${d}`}function f(a){localStorage.removeItem(`start-${a}`),localStorage.removeItem(`end-${a}`)}function g(a){localStorage.removeItem(`start-${a}`),localStorage.removeItem(`end-${a}`),localStorage.removeItem(`${a}_section1`),localStorage.removeItem(`${a}_section2`),localStorage.removeItem(`${a}_section3`),localStorage.removeItem("readingTest_section1"),localStorage.removeItem("readingTest_section2"),localStorage.removeItem("readingTest_section3"),localStorage.removeItem("readingTest_result"),localStorage.removeItem("timeSpent"),localStorage.removeItem("lastTimeSpent")}a.s(["clearTestSession",()=>g,"formatTime",()=>e,"getRemainingTime",()=>c,"getTimeSpent",()=>d,"resetTimer",()=>f,"startTimer",()=>b])},38473,a=>{a.v(b=>Promise.all(["server/chunks/ssr/23848_@heroui_dom-animation_dist_index_mjs_26452358._.js"].map(b=>a.l(b))).then(()=>b(89075)))}];

//# sourceMappingURL=duosteam_26648096._.js.map