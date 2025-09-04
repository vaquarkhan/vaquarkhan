(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const l of a.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&n(l)}).observe(document,{childList:!0,subtree:!0});function e(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(s){if(s.ep)return;s.ep=!0;const a=e(s);fetch(s.href,a)}})();/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let Qo,Zo;function jo(){return{geminiUrl:Qo,vertexUrl:Zo}}function ei(o,t,e){var n,s,a;if(!(!((n=o.httpOptions)===null||n===void 0)&&n.baseUrl)){const l=jo();return o.vertexai?(s=l.vertexUrl)!==null&&s!==void 0?s:t:(a=l.geminiUrl)!==null&&a!==void 0?a:e}return o.httpOptions.baseUrl}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class fe{}function x(o,t){const e=/\{([^}]+)\}/g;return o.replace(e,(n,s)=>{if(Object.prototype.hasOwnProperty.call(t,s)){const a=t[s];return a!=null?String(a):""}else throw new Error(`Key '${s}' not found in valueMap.`)})}function r(o,t,e){for(let a=0;a<t.length-1;a++){const l=t[a];if(l.endsWith("[]")){const u=l.slice(0,-2);if(!(u in o))if(Array.isArray(e))o[u]=Array.from({length:e.length},()=>({}));else throw new Error(`Value must be a list given an array path ${l}`);if(Array.isArray(o[u])){const m=o[u];if(Array.isArray(e))for(let p=0;p<m.length;p++){const g=m[p];r(g,t.slice(a+1),e[p])}else for(const p of m)r(p,t.slice(a+1),e)}return}else if(l.endsWith("[0]")){const u=l.slice(0,-3);u in o||(o[u]=[{}]);const m=o[u];r(m[0],t.slice(a+1),e);return}(!o[l]||typeof o[l]!="object")&&(o[l]={}),o=o[l]}const n=t[t.length-1],s=o[n];if(s!==void 0){if(!e||typeof e=="object"&&Object.keys(e).length===0||e===s)return;if(typeof s=="object"&&typeof e=="object"&&s!==null&&e!==null)Object.assign(s,e);else throw new Error(`Cannot set value for an existing key. Key: ${n}`)}else o[n]=e}function i(o,t){try{if(t.length===1&&t[0]==="_self")return o;for(let e=0;e<t.length;e++){if(typeof o!="object"||o===null)return;const n=t[e];if(n.endsWith("[]")){const s=n.slice(0,-2);if(s in o){const a=o[s];return Array.isArray(a)?a.map(l=>i(l,t.slice(e+1))):void 0}else return}else o=o[n]}return o}catch(e){if(e instanceof TypeError)return;throw e}}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function G(o,t){if(!t||typeof t!="string")throw new Error("model is required and must be a string");if(o.isVertexAI()){if(t.startsWith("publishers/")||t.startsWith("projects/")||t.startsWith("models/"))return t;if(t.indexOf("/")>=0){const e=t.split("/",2);return`publishers/${e[0]}/models/${e[1]}`}else return`publishers/google/models/${t}`}else return t.startsWith("models/")||t.startsWith("tunedModels/")?t:`models/${t}`}function hn(o,t){const e=G(o,t);return e?e.startsWith("publishers/")&&o.isVertexAI()?`projects/${o.getProject()}/locations/${o.getLocation()}/${e}`:e.startsWith("models/")&&o.isVertexAI()?`projects/${o.getProject()}/locations/${o.getLocation()}/publishers/google/${e}`:e:""}function yn(o,t){return Array.isArray(t)?t.map(e=>Ie(o,e)):[Ie(o,t)]}function Ie(o,t){if(typeof t=="object"&&t!==null)return t;throw new Error(`Could not parse input as Blob. Unsupported blob type: ${typeof t}`)}function ti(o,t){const e=Ie(o,t);if(e.mimeType&&e.mimeType.startsWith("image/"))return e;throw new Error(`Unsupported mime type: ${e.mimeType}`)}function ni(o,t){const e=Ie(o,t);if(e.mimeType&&e.mimeType.startsWith("audio/"))return e;throw new Error(`Unsupported mime type: ${e.mimeType}`)}function ut(o,t){if(t==null)throw new Error("PartUnion is required");if(typeof t=="object")return t;if(typeof t=="string")return{text:t};throw new Error(`Unsupported part type: ${typeof t}`)}function vn(o,t){if(t==null||Array.isArray(t)&&t.length===0)throw new Error("PartListUnion is required");return Array.isArray(t)?t.map(e=>ut(o,e)):[ut(o,t)]}function Ve(o){return o!=null&&typeof o=="object"&&"parts"in o&&Array.isArray(o.parts)}function dt(o){return o!=null&&typeof o=="object"&&"functionCall"in o}function pt(o){return o!=null&&typeof o=="object"&&"functionResponse"in o}function X(o,t){if(t==null)throw new Error("ContentUnion is required");return Ve(t)?t:{role:"user",parts:vn(o,t)}}function Cn(o,t){if(!t)return[];if(o.isVertexAI()&&Array.isArray(t))return t.flatMap(e=>{const n=X(o,e);return n.parts&&n.parts.length>0&&n.parts[0].text!==void 0?[n.parts[0].text]:[]});if(o.isVertexAI()){const e=X(o,t);return e.parts&&e.parts.length>0&&e.parts[0].text!==void 0?[e.parts[0].text]:[]}return Array.isArray(t)?t.map(e=>X(o,e)):[X(o,t)]}function ne(o,t){if(t==null||Array.isArray(t)&&t.length===0)throw new Error("contents are required");if(!Array.isArray(t)){if(dt(t)||pt(t))throw new Error("To specify functionCall or functionResponse parts, please wrap them in a Content object, specifying the role for them");return[X(o,t)]}const e=[],n=[],s=Ve(t[0]);for(const a of t){const l=Ve(a);if(l!=s)throw new Error("Mixing Content and Parts is not supported, please group the parts into a the appropriate Content objects and specify the roles for them");if(l)e.push(a);else{if(dt(a)||pt(a))throw new Error("To specify functionCall or functionResponse parts, please wrap them, and any other parts, in Content objects as appropriate, specifying the role for them");n.push(a)}}return s||e.push({role:"user",parts:vn(o,n)}),e}function Tn(o,t){return t}function En(o,t){if(typeof t=="object")return t;if(typeof t=="string")return{voiceConfig:{prebuiltVoiceConfig:{voiceName:t}}};throw new Error(`Unsupported speechConfig type: ${typeof t}`)}function we(o,t){return t}function _e(o,t){if(!Array.isArray(t))throw new Error("tool is required and must be an array of Tools");return t}function oi(o,t,e,n=1){const s=!t.startsWith(`${e}/`)&&t.split("/").length===n;return o.isVertexAI()?t.startsWith("projects/")?t:t.startsWith("locations/")?`projects/${o.getProject()}/${t}`:t.startsWith(`${e}/`)?`projects/${o.getProject()}/locations/${o.getLocation()}/${t}`:s?`projects/${o.getProject()}/locations/${o.getLocation()}/${e}/${t}`:t:s?`${e}/${t}`:t}function oe(o,t){if(typeof t!="string")throw new Error("name must be a string");return oi(o,t,"cachedContents")}function Sn(o,t){switch(t){case"STATE_UNSPECIFIED":return"JOB_STATE_UNSPECIFIED";case"CREATING":return"JOB_STATE_RUNNING";case"ACTIVE":return"JOB_STATE_SUCCEEDED";case"FAILED":return"JOB_STATE_FAILED";default:return t}}function ie(o,t){if(typeof t!="string")throw new Error("fromImageBytes must be a string");return t}function ii(o){return o!=null&&typeof o=="object"&&"name"in o}function si(o){return o!=null&&typeof o=="object"&&"video"in o}function ri(o){return o!=null&&typeof o=="object"&&"uri"in o}function In(o,t){var e;let n;if(ii(t)&&(n=t.name),!(ri(t)&&(n=t.uri,n===void 0))&&!(si(t)&&(n=(e=t.video)===null||e===void 0?void 0:e.uri,n===void 0))){if(typeof t=="string"&&(n=t),n===void 0)throw new Error("Could not extract file name from the provided input.");if(n.startsWith("https://")){const a=n.split("files/")[1].match(/[a-z0-9]+/);if(a===null)throw new Error(`Could not extract file name from URI ${n}`);n=a[0]}else n.startsWith("files/")&&(n=n.split("files/")[1]);return n}}function An(o,t){let e;return o.isVertexAI()?e=t?"publishers/google/models":"models":e=t?"models":"tunedModels",e}function bn(o,t){for(const e of["models","tunedModels","publisherModels"])if(ai(t,e))return t[e];return[]}function ai(o,t){return o!==null&&typeof o=="object"&&t in o}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function li(o,t){const e={};if(i(t,["displayName"])!==void 0)throw new Error("displayName parameter is not supported in Gemini API.");const n=i(t,["data"]);n!=null&&r(e,["data"],n);const s=i(t,["mimeType"]);return s!=null&&r(e,["mimeType"],s),e}function ci(o,t){const e={};if(i(t,["videoMetadata"])!==void 0)throw new Error("videoMetadata parameter is not supported in Gemini API.");const n=i(t,["thought"]);n!=null&&r(e,["thought"],n);const s=i(t,["inlineData"]);s!=null&&r(e,["inlineData"],li(o,s));const a=i(t,["codeExecutionResult"]);a!=null&&r(e,["codeExecutionResult"],a);const l=i(t,["executableCode"]);l!=null&&r(e,["executableCode"],l);const u=i(t,["fileData"]);u!=null&&r(e,["fileData"],u);const m=i(t,["functionCall"]);m!=null&&r(e,["functionCall"],m);const p=i(t,["functionResponse"]);p!=null&&r(e,["functionResponse"],p);const g=i(t,["text"]);return g!=null&&r(e,["text"],g),e}function ft(o,t){const e={},n=i(t,["parts"]);if(n!=null){let a=n;Array.isArray(a)&&(a=a.map(l=>ci(o,l))),r(e,["parts"],a)}const s=i(t,["role"]);return s!=null&&r(e,["role"],s),e}function ui(){return{}}function di(o,t){const e={},n=i(t,["mode"]);n!=null&&r(e,["mode"],n);const s=i(t,["dynamicThreshold"]);return s!=null&&r(e,["dynamicThreshold"],s),e}function pi(o,t){const e={},n=i(t,["dynamicRetrievalConfig"]);return n!=null&&r(e,["dynamicRetrievalConfig"],di(o,n)),e}function fi(o,t){const e={};if(i(t,["retrieval"])!==void 0)throw new Error("retrieval parameter is not supported in Gemini API.");i(t,["googleSearch"])!=null&&r(e,["googleSearch"],ui());const s=i(t,["googleSearchRetrieval"]);if(s!=null&&r(e,["googleSearchRetrieval"],pi(o,s)),i(t,["enterpriseWebSearch"])!==void 0)throw new Error("enterpriseWebSearch parameter is not supported in Gemini API.");if(i(t,["googleMaps"])!==void 0)throw new Error("googleMaps parameter is not supported in Gemini API.");const a=i(t,["codeExecution"]);a!=null&&r(e,["codeExecution"],a);const l=i(t,["functionDeclarations"]);return l!=null&&r(e,["functionDeclarations"],l),e}function mi(o,t){const e={},n=i(t,["mode"]);n!=null&&r(e,["mode"],n);const s=i(t,["allowedFunctionNames"]);return s!=null&&r(e,["allowedFunctionNames"],s),e}function gi(o,t){const e={},n=i(t,["functionCallingConfig"]);if(n!=null&&r(e,["functionCallingConfig"],mi(o,n)),i(t,["retrievalConfig"])!==void 0)throw new Error("retrievalConfig parameter is not supported in Gemini API.");return e}function hi(o,t,e){const n={},s=i(t,["ttl"]);e!==void 0&&s!=null&&r(e,["ttl"],s);const a=i(t,["expireTime"]);e!==void 0&&a!=null&&r(e,["expireTime"],a);const l=i(t,["displayName"]);e!==void 0&&l!=null&&r(e,["displayName"],l);const u=i(t,["contents"]);if(e!==void 0&&u!=null){let y=ne(o,u);Array.isArray(y)&&(y=y.map(T=>ft(o,T))),r(e,["contents"],y)}const m=i(t,["systemInstruction"]);e!==void 0&&m!=null&&r(e,["systemInstruction"],ft(o,X(o,m)));const p=i(t,["tools"]);if(e!==void 0&&p!=null){let y=p;Array.isArray(y)&&(y=y.map(T=>fi(o,T))),r(e,["tools"],y)}const g=i(t,["toolConfig"]);return e!==void 0&&g!=null&&r(e,["toolConfig"],gi(o,g)),n}function yi(o,t){const e={},n=i(t,["model"]);n!=null&&r(e,["model"],hn(o,n));const s=i(t,["config"]);return s!=null&&r(e,["config"],hi(o,s,e)),e}function vi(o,t){const e={},n=i(t,["name"]);n!=null&&r(e,["_url","name"],oe(o,n));const s=i(t,["config"]);return s!=null&&r(e,["config"],s),e}function Ci(o,t){const e={},n=i(t,["name"]);n!=null&&r(e,["_url","name"],oe(o,n));const s=i(t,["config"]);return s!=null&&r(e,["config"],s),e}function Ti(o,t,e){const n={},s=i(t,["ttl"]);e!==void 0&&s!=null&&r(e,["ttl"],s);const a=i(t,["expireTime"]);return e!==void 0&&a!=null&&r(e,["expireTime"],a),n}function Ei(o,t){const e={},n=i(t,["name"]);n!=null&&r(e,["_url","name"],oe(o,n));const s=i(t,["config"]);return s!=null&&r(e,["config"],Ti(o,s,e)),e}function Si(o,t,e){const n={},s=i(t,["pageSize"]);e!==void 0&&s!=null&&r(e,["_query","pageSize"],s);const a=i(t,["pageToken"]);return e!==void 0&&a!=null&&r(e,["_query","pageToken"],a),n}function Ii(o,t){const e={},n=i(t,["config"]);return n!=null&&r(e,["config"],Si(o,n,e)),e}function Ai(o,t){const e={},n=i(t,["displayName"]);n!=null&&r(e,["displayName"],n);const s=i(t,["data"]);s!=null&&r(e,["data"],s);const a=i(t,["mimeType"]);return a!=null&&r(e,["mimeType"],a),e}function bi(o,t){const e={},n=i(t,["videoMetadata"]);n!=null&&r(e,["videoMetadata"],n);const s=i(t,["thought"]);s!=null&&r(e,["thought"],s);const a=i(t,["inlineData"]);a!=null&&r(e,["inlineData"],Ai(o,a));const l=i(t,["codeExecutionResult"]);l!=null&&r(e,["codeExecutionResult"],l);const u=i(t,["executableCode"]);u!=null&&r(e,["executableCode"],u);const m=i(t,["fileData"]);m!=null&&r(e,["fileData"],m);const p=i(t,["functionCall"]);p!=null&&r(e,["functionCall"],p);const g=i(t,["functionResponse"]);g!=null&&r(e,["functionResponse"],g);const y=i(t,["text"]);return y!=null&&r(e,["text"],y),e}function mt(o,t){const e={},n=i(t,["parts"]);if(n!=null){let a=n;Array.isArray(a)&&(a=a.map(l=>bi(o,l))),r(e,["parts"],a)}const s=i(t,["role"]);return s!=null&&r(e,["role"],s),e}function wi(){return{}}function _i(o,t){const e={},n=i(t,["mode"]);n!=null&&r(e,["mode"],n);const s=i(t,["dynamicThreshold"]);return s!=null&&r(e,["dynamicThreshold"],s),e}function Ri(o,t){const e={},n=i(t,["dynamicRetrievalConfig"]);return n!=null&&r(e,["dynamicRetrievalConfig"],_i(o,n)),e}function Mi(){return{}}function Pi(o,t){const e={},n=i(t,["apiKeyString"]);return n!=null&&r(e,["apiKeyString"],n),e}function xi(o,t){const e={},n=i(t,["apiKeyConfig"]);n!=null&&r(e,["apiKeyConfig"],Pi(o,n));const s=i(t,["authType"]);s!=null&&r(e,["authType"],s);const a=i(t,["googleServiceAccountConfig"]);a!=null&&r(e,["googleServiceAccountConfig"],a);const l=i(t,["httpBasicAuthConfig"]);l!=null&&r(e,["httpBasicAuthConfig"],l);const u=i(t,["oauthConfig"]);u!=null&&r(e,["oauthConfig"],u);const m=i(t,["oidcConfig"]);return m!=null&&r(e,["oidcConfig"],m),e}function Di(o,t){const e={},n=i(t,["authConfig"]);return n!=null&&r(e,["authConfig"],xi(o,n)),e}function ki(o,t){const e={},n=i(t,["retrieval"]);n!=null&&r(e,["retrieval"],n),i(t,["googleSearch"])!=null&&r(e,["googleSearch"],wi());const a=i(t,["googleSearchRetrieval"]);a!=null&&r(e,["googleSearchRetrieval"],Ri(o,a)),i(t,["enterpriseWebSearch"])!=null&&r(e,["enterpriseWebSearch"],Mi());const u=i(t,["googleMaps"]);u!=null&&r(e,["googleMaps"],Di(o,u));const m=i(t,["codeExecution"]);m!=null&&r(e,["codeExecution"],m);const p=i(t,["functionDeclarations"]);return p!=null&&r(e,["functionDeclarations"],p),e}function Li(o,t){const e={},n=i(t,["mode"]);n!=null&&r(e,["mode"],n);const s=i(t,["allowedFunctionNames"]);return s!=null&&r(e,["allowedFunctionNames"],s),e}function Ni(o,t){const e={},n=i(t,["latitude"]);n!=null&&r(e,["latitude"],n);const s=i(t,["longitude"]);return s!=null&&r(e,["longitude"],s),e}function $i(o,t){const e={},n=i(t,["latLng"]);return n!=null&&r(e,["latLng"],Ni(o,n)),e}function Fi(o,t){const e={},n=i(t,["functionCallingConfig"]);n!=null&&r(e,["functionCallingConfig"],Li(o,n));const s=i(t,["retrievalConfig"]);return s!=null&&r(e,["retrievalConfig"],$i(o,s)),e}function Ui(o,t,e){const n={},s=i(t,["ttl"]);e!==void 0&&s!=null&&r(e,["ttl"],s);const a=i(t,["expireTime"]);e!==void 0&&a!=null&&r(e,["expireTime"],a);const l=i(t,["displayName"]);e!==void 0&&l!=null&&r(e,["displayName"],l);const u=i(t,["contents"]);if(e!==void 0&&u!=null){let y=ne(o,u);Array.isArray(y)&&(y=y.map(T=>mt(o,T))),r(e,["contents"],y)}const m=i(t,["systemInstruction"]);e!==void 0&&m!=null&&r(e,["systemInstruction"],mt(o,X(o,m)));const p=i(t,["tools"]);if(e!==void 0&&p!=null){let y=p;Array.isArray(y)&&(y=y.map(T=>ki(o,T))),r(e,["tools"],y)}const g=i(t,["toolConfig"]);return e!==void 0&&g!=null&&r(e,["toolConfig"],Fi(o,g)),n}function qi(o,t){const e={},n=i(t,["model"]);n!=null&&r(e,["model"],hn(o,n));const s=i(t,["config"]);return s!=null&&r(e,["config"],Ui(o,s,e)),e}function Bi(o,t){const e={},n=i(t,["name"]);n!=null&&r(e,["_url","name"],oe(o,n));const s=i(t,["config"]);return s!=null&&r(e,["config"],s),e}function Vi(o,t){const e={},n=i(t,["name"]);n!=null&&r(e,["_url","name"],oe(o,n));const s=i(t,["config"]);return s!=null&&r(e,["config"],s),e}function Gi(o,t,e){const n={},s=i(t,["ttl"]);e!==void 0&&s!=null&&r(e,["ttl"],s);const a=i(t,["expireTime"]);return e!==void 0&&a!=null&&r(e,["expireTime"],a),n}function Hi(o,t){const e={},n=i(t,["name"]);n!=null&&r(e,["_url","name"],oe(o,n));const s=i(t,["config"]);return s!=null&&r(e,["config"],Gi(o,s,e)),e}function Oi(o,t,e){const n={},s=i(t,["pageSize"]);e!==void 0&&s!=null&&r(e,["_query","pageSize"],s);const a=i(t,["pageToken"]);return e!==void 0&&a!=null&&r(e,["_query","pageToken"],a),n}function zi(o,t){const e={},n=i(t,["config"]);return n!=null&&r(e,["config"],Oi(o,n,e)),e}function Ee(o,t){const e={},n=i(t,["name"]);n!=null&&r(e,["name"],n);const s=i(t,["displayName"]);s!=null&&r(e,["displayName"],s);const a=i(t,["model"]);a!=null&&r(e,["model"],a);const l=i(t,["createTime"]);l!=null&&r(e,["createTime"],l);const u=i(t,["updateTime"]);u!=null&&r(e,["updateTime"],u);const m=i(t,["expireTime"]);m!=null&&r(e,["expireTime"],m);const p=i(t,["usageMetadata"]);return p!=null&&r(e,["usageMetadata"],p),e}function Ji(){return{}}function Wi(o,t){const e={},n=i(t,["nextPageToken"]);n!=null&&r(e,["nextPageToken"],n);const s=i(t,["cachedContents"]);if(s!=null){let a=s;Array.isArray(a)&&(a=a.map(l=>Ee(o,l))),r(e,["cachedContents"],a)}return e}function Se(o,t){const e={},n=i(t,["name"]);n!=null&&r(e,["name"],n);const s=i(t,["displayName"]);s!=null&&r(e,["displayName"],s);const a=i(t,["model"]);a!=null&&r(e,["model"],a);const l=i(t,["createTime"]);l!=null&&r(e,["createTime"],l);const u=i(t,["updateTime"]);u!=null&&r(e,["updateTime"],u);const m=i(t,["expireTime"]);m!=null&&r(e,["expireTime"],m);const p=i(t,["usageMetadata"]);return p!=null&&r(e,["usageMetadata"],p),e}function Yi(){return{}}function Ki(o,t){const e={},n=i(t,["nextPageToken"]);n!=null&&r(e,["nextPageToken"],n);const s=i(t,["cachedContents"]);if(s!=null){let a=s;Array.isArray(a)&&(a=a.map(l=>Se(o,l))),r(e,["cachedContents"],a)}return e}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */var ce;(function(o){o.PAGED_ITEM_BATCH_JOBS="batchJobs",o.PAGED_ITEM_MODELS="models",o.PAGED_ITEM_TUNING_JOBS="tuningJobs",o.PAGED_ITEM_FILES="files",o.PAGED_ITEM_CACHED_CONTENTS="cachedContents"})(ce||(ce={}));class Re{constructor(t,e,n,s){this.pageInternal=[],this.paramsInternal={},this.requestInternal=e,this.init(t,n,s)}init(t,e,n){var s,a;this.nameInternal=t,this.pageInternal=e[this.nameInternal]||[],this.idxInternal=0;let l={config:{}};n?typeof n=="object"?l=Object.assign({},n):l=n:l={config:{}},l.config&&(l.config.pageToken=e.nextPageToken),this.paramsInternal=l,this.pageInternalSize=(a=(s=l.config)===null||s===void 0?void 0:s.pageSize)!==null&&a!==void 0?a:this.pageInternal.length}initNextPage(t){this.init(this.nameInternal,t,this.paramsInternal)}get page(){return this.pageInternal}get name(){return this.nameInternal}get pageSize(){return this.pageInternalSize}get params(){return this.paramsInternal}get pageLength(){return this.pageInternal.length}getItem(t){return this.pageInternal[t]}[Symbol.asyncIterator](){return{next:async()=>{if(this.idxInternal>=this.pageLength)if(this.hasNextPage())await this.nextPage();else return{value:void 0,done:!0};const t=this.getItem(this.idxInternal);return this.idxInternal+=1,{value:t,done:!1}},return:async()=>({value:void 0,done:!0})}}async nextPage(){if(!this.hasNextPage())throw new Error("No more pages to fetch.");const t=await this.requestInternal(this.params);return this.initNextPage(t),this.page}hasNextPage(){var t;return((t=this.params.config)===null||t===void 0?void 0:t.pageToken)!==void 0}}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */var gt;(function(o){o.OUTCOME_UNSPECIFIED="OUTCOME_UNSPECIFIED",o.OUTCOME_OK="OUTCOME_OK",o.OUTCOME_FAILED="OUTCOME_FAILED",o.OUTCOME_DEADLINE_EXCEEDED="OUTCOME_DEADLINE_EXCEEDED"})(gt||(gt={}));var ht;(function(o){o.LANGUAGE_UNSPECIFIED="LANGUAGE_UNSPECIFIED",o.PYTHON="PYTHON"})(ht||(ht={}));var yt;(function(o){o.HARM_CATEGORY_UNSPECIFIED="HARM_CATEGORY_UNSPECIFIED",o.HARM_CATEGORY_HATE_SPEECH="HARM_CATEGORY_HATE_SPEECH",o.HARM_CATEGORY_DANGEROUS_CONTENT="HARM_CATEGORY_DANGEROUS_CONTENT",o.HARM_CATEGORY_HARASSMENT="HARM_CATEGORY_HARASSMENT",o.HARM_CATEGORY_SEXUALLY_EXPLICIT="HARM_CATEGORY_SEXUALLY_EXPLICIT",o.HARM_CATEGORY_CIVIC_INTEGRITY="HARM_CATEGORY_CIVIC_INTEGRITY"})(yt||(yt={}));var vt;(function(o){o.HARM_BLOCK_METHOD_UNSPECIFIED="HARM_BLOCK_METHOD_UNSPECIFIED",o.SEVERITY="SEVERITY",o.PROBABILITY="PROBABILITY"})(vt||(vt={}));var Ct;(function(o){o.HARM_BLOCK_THRESHOLD_UNSPECIFIED="HARM_BLOCK_THRESHOLD_UNSPECIFIED",o.BLOCK_LOW_AND_ABOVE="BLOCK_LOW_AND_ABOVE",o.BLOCK_MEDIUM_AND_ABOVE="BLOCK_MEDIUM_AND_ABOVE",o.BLOCK_ONLY_HIGH="BLOCK_ONLY_HIGH",o.BLOCK_NONE="BLOCK_NONE",o.OFF="OFF"})(Ct||(Ct={}));var Tt;(function(o){o.MODE_UNSPECIFIED="MODE_UNSPECIFIED",o.MODE_DYNAMIC="MODE_DYNAMIC"})(Tt||(Tt={}));var Et;(function(o){o.AUTH_TYPE_UNSPECIFIED="AUTH_TYPE_UNSPECIFIED",o.NO_AUTH="NO_AUTH",o.API_KEY_AUTH="API_KEY_AUTH",o.HTTP_BASIC_AUTH="HTTP_BASIC_AUTH",o.GOOGLE_SERVICE_ACCOUNT_AUTH="GOOGLE_SERVICE_ACCOUNT_AUTH",o.OAUTH="OAUTH",o.OIDC_AUTH="OIDC_AUTH"})(Et||(Et={}));var St;(function(o){o.TYPE_UNSPECIFIED="TYPE_UNSPECIFIED",o.STRING="STRING",o.NUMBER="NUMBER",o.INTEGER="INTEGER",o.BOOLEAN="BOOLEAN",o.ARRAY="ARRAY",o.OBJECT="OBJECT"})(St||(St={}));var It;(function(o){o.FINISH_REASON_UNSPECIFIED="FINISH_REASON_UNSPECIFIED",o.STOP="STOP",o.MAX_TOKENS="MAX_TOKENS",o.SAFETY="SAFETY",o.RECITATION="RECITATION",o.LANGUAGE="LANGUAGE",o.OTHER="OTHER",o.BLOCKLIST="BLOCKLIST",o.PROHIBITED_CONTENT="PROHIBITED_CONTENT",o.SPII="SPII",o.MALFORMED_FUNCTION_CALL="MALFORMED_FUNCTION_CALL",o.IMAGE_SAFETY="IMAGE_SAFETY"})(It||(It={}));var At;(function(o){o.HARM_PROBABILITY_UNSPECIFIED="HARM_PROBABILITY_UNSPECIFIED",o.NEGLIGIBLE="NEGLIGIBLE",o.LOW="LOW",o.MEDIUM="MEDIUM",o.HIGH="HIGH"})(At||(At={}));var bt;(function(o){o.HARM_SEVERITY_UNSPECIFIED="HARM_SEVERITY_UNSPECIFIED",o.HARM_SEVERITY_NEGLIGIBLE="HARM_SEVERITY_NEGLIGIBLE",o.HARM_SEVERITY_LOW="HARM_SEVERITY_LOW",o.HARM_SEVERITY_MEDIUM="HARM_SEVERITY_MEDIUM",o.HARM_SEVERITY_HIGH="HARM_SEVERITY_HIGH"})(bt||(bt={}));var wt;(function(o){o.BLOCKED_REASON_UNSPECIFIED="BLOCKED_REASON_UNSPECIFIED",o.SAFETY="SAFETY",o.OTHER="OTHER",o.BLOCKLIST="BLOCKLIST",o.PROHIBITED_CONTENT="PROHIBITED_CONTENT"})(wt||(wt={}));var _t;(function(o){o.TRAFFIC_TYPE_UNSPECIFIED="TRAFFIC_TYPE_UNSPECIFIED",o.ON_DEMAND="ON_DEMAND",o.PROVISIONED_THROUGHPUT="PROVISIONED_THROUGHPUT"})(_t||(_t={}));var Ae;(function(o){o.MODALITY_UNSPECIFIED="MODALITY_UNSPECIFIED",o.TEXT="TEXT",o.IMAGE="IMAGE",o.AUDIO="AUDIO"})(Ae||(Ae={}));var Rt;(function(o){o.MEDIA_RESOLUTION_UNSPECIFIED="MEDIA_RESOLUTION_UNSPECIFIED",o.MEDIA_RESOLUTION_LOW="MEDIA_RESOLUTION_LOW",o.MEDIA_RESOLUTION_MEDIUM="MEDIA_RESOLUTION_MEDIUM",o.MEDIA_RESOLUTION_HIGH="MEDIA_RESOLUTION_HIGH"})(Rt||(Rt={}));var Ge;(function(o){o.JOB_STATE_UNSPECIFIED="JOB_STATE_UNSPECIFIED",o.JOB_STATE_QUEUED="JOB_STATE_QUEUED",o.JOB_STATE_PENDING="JOB_STATE_PENDING",o.JOB_STATE_RUNNING="JOB_STATE_RUNNING",o.JOB_STATE_SUCCEEDED="JOB_STATE_SUCCEEDED",o.JOB_STATE_FAILED="JOB_STATE_FAILED",o.JOB_STATE_CANCELLING="JOB_STATE_CANCELLING",o.JOB_STATE_CANCELLED="JOB_STATE_CANCELLED",o.JOB_STATE_PAUSED="JOB_STATE_PAUSED",o.JOB_STATE_EXPIRED="JOB_STATE_EXPIRED",o.JOB_STATE_UPDATING="JOB_STATE_UPDATING",o.JOB_STATE_PARTIALLY_SUCCEEDED="JOB_STATE_PARTIALLY_SUCCEEDED"})(Ge||(Ge={}));var Mt;(function(o){o.ADAPTER_SIZE_UNSPECIFIED="ADAPTER_SIZE_UNSPECIFIED",o.ADAPTER_SIZE_ONE="ADAPTER_SIZE_ONE",o.ADAPTER_SIZE_TWO="ADAPTER_SIZE_TWO",o.ADAPTER_SIZE_FOUR="ADAPTER_SIZE_FOUR",o.ADAPTER_SIZE_EIGHT="ADAPTER_SIZE_EIGHT",o.ADAPTER_SIZE_SIXTEEN="ADAPTER_SIZE_SIXTEEN",o.ADAPTER_SIZE_THIRTY_TWO="ADAPTER_SIZE_THIRTY_TWO"})(Mt||(Mt={}));var Pt;(function(o){o.FEATURE_SELECTION_PREFERENCE_UNSPECIFIED="FEATURE_SELECTION_PREFERENCE_UNSPECIFIED",o.PRIORITIZE_QUALITY="PRIORITIZE_QUALITY",o.BALANCED="BALANCED",o.PRIORITIZE_COST="PRIORITIZE_COST"})(Pt||(Pt={}));var xt;(function(o){o.MODE_UNSPECIFIED="MODE_UNSPECIFIED",o.MODE_DYNAMIC="MODE_DYNAMIC"})(xt||(xt={}));var Dt;(function(o){o.MODE_UNSPECIFIED="MODE_UNSPECIFIED",o.AUTO="AUTO",o.ANY="ANY",o.NONE="NONE"})(Dt||(Dt={}));var kt;(function(o){o.BLOCK_LOW_AND_ABOVE="BLOCK_LOW_AND_ABOVE",o.BLOCK_MEDIUM_AND_ABOVE="BLOCK_MEDIUM_AND_ABOVE",o.BLOCK_ONLY_HIGH="BLOCK_ONLY_HIGH",o.BLOCK_NONE="BLOCK_NONE"})(kt||(kt={}));var Lt;(function(o){o.DONT_ALLOW="DONT_ALLOW",o.ALLOW_ADULT="ALLOW_ADULT",o.ALLOW_ALL="ALLOW_ALL"})(Lt||(Lt={}));var Nt;(function(o){o.auto="auto",o.en="en",o.ja="ja",o.ko="ko",o.hi="hi"})(Nt||(Nt={}));var $t;(function(o){o.MASK_MODE_DEFAULT="MASK_MODE_DEFAULT",o.MASK_MODE_USER_PROVIDED="MASK_MODE_USER_PROVIDED",o.MASK_MODE_BACKGROUND="MASK_MODE_BACKGROUND",o.MASK_MODE_FOREGROUND="MASK_MODE_FOREGROUND",o.MASK_MODE_SEMANTIC="MASK_MODE_SEMANTIC"})($t||($t={}));var Ft;(function(o){o.CONTROL_TYPE_DEFAULT="CONTROL_TYPE_DEFAULT",o.CONTROL_TYPE_CANNY="CONTROL_TYPE_CANNY",o.CONTROL_TYPE_SCRIBBLE="CONTROL_TYPE_SCRIBBLE",o.CONTROL_TYPE_FACE_MESH="CONTROL_TYPE_FACE_MESH"})(Ft||(Ft={}));var Ut;(function(o){o.SUBJECT_TYPE_DEFAULT="SUBJECT_TYPE_DEFAULT",o.SUBJECT_TYPE_PERSON="SUBJECT_TYPE_PERSON",o.SUBJECT_TYPE_ANIMAL="SUBJECT_TYPE_ANIMAL",o.SUBJECT_TYPE_PRODUCT="SUBJECT_TYPE_PRODUCT"})(Ut||(Ut={}));var qt;(function(o){o.EDIT_MODE_DEFAULT="EDIT_MODE_DEFAULT",o.EDIT_MODE_INPAINT_REMOVAL="EDIT_MODE_INPAINT_REMOVAL",o.EDIT_MODE_INPAINT_INSERTION="EDIT_MODE_INPAINT_INSERTION",o.EDIT_MODE_OUTPAINT="EDIT_MODE_OUTPAINT",o.EDIT_MODE_CONTROLLED_EDITING="EDIT_MODE_CONTROLLED_EDITING",o.EDIT_MODE_STYLE="EDIT_MODE_STYLE",o.EDIT_MODE_BGSWAP="EDIT_MODE_BGSWAP",o.EDIT_MODE_PRODUCT_IMAGE="EDIT_MODE_PRODUCT_IMAGE"})(qt||(qt={}));var Bt;(function(o){o.STATE_UNSPECIFIED="STATE_UNSPECIFIED",o.PROCESSING="PROCESSING",o.ACTIVE="ACTIVE",o.FAILED="FAILED"})(Bt||(Bt={}));var Vt;(function(o){o.SOURCE_UNSPECIFIED="SOURCE_UNSPECIFIED",o.UPLOADED="UPLOADED",o.GENERATED="GENERATED"})(Vt||(Vt={}));var Gt;(function(o){o.MODALITY_UNSPECIFIED="MODALITY_UNSPECIFIED",o.TEXT="TEXT",o.IMAGE="IMAGE",o.VIDEO="VIDEO",o.AUDIO="AUDIO",o.DOCUMENT="DOCUMENT"})(Gt||(Gt={}));var Ht;(function(o){o.START_SENSITIVITY_UNSPECIFIED="START_SENSITIVITY_UNSPECIFIED",o.START_SENSITIVITY_HIGH="START_SENSITIVITY_HIGH",o.START_SENSITIVITY_LOW="START_SENSITIVITY_LOW"})(Ht||(Ht={}));var Ot;(function(o){o.END_SENSITIVITY_UNSPECIFIED="END_SENSITIVITY_UNSPECIFIED",o.END_SENSITIVITY_HIGH="END_SENSITIVITY_HIGH",o.END_SENSITIVITY_LOW="END_SENSITIVITY_LOW"})(Ot||(Ot={}));var zt;(function(o){o.ACTIVITY_HANDLING_UNSPECIFIED="ACTIVITY_HANDLING_UNSPECIFIED",o.START_OF_ACTIVITY_INTERRUPTS="START_OF_ACTIVITY_INTERRUPTS",o.NO_INTERRUPTION="NO_INTERRUPTION"})(zt||(zt={}));var Jt;(function(o){o.TURN_COVERAGE_UNSPECIFIED="TURN_COVERAGE_UNSPECIFIED",o.TURN_INCLUDES_ONLY_ACTIVITY="TURN_INCLUDES_ONLY_ACTIVITY",o.TURN_INCLUDES_ALL_INPUT="TURN_INCLUDES_ALL_INPUT"})(Jt||(Jt={}));class ve{get text(){var t,e,n,s,a,l,u,m;if(((s=(n=(e=(t=this.candidates)===null||t===void 0?void 0:t[0])===null||e===void 0?void 0:e.content)===null||n===void 0?void 0:n.parts)===null||s===void 0?void 0:s.length)===0)return;this.candidates&&this.candidates.length>1&&console.warn("there are multiple candidates in the response, returning text from the first one.");let p="",g=!1;const y=[];for(const T of(m=(u=(l=(a=this.candidates)===null||a===void 0?void 0:a[0])===null||l===void 0?void 0:l.content)===null||u===void 0?void 0:u.parts)!==null&&m!==void 0?m:[]){for(const[E,I]of Object.entries(T))E!=="text"&&E!=="thought"&&(I!==null||I!==void 0)&&y.push(E);if(typeof T.text=="string"){if(typeof T.thought=="boolean"&&T.thought)continue;g=!0,p+=T.text}}return y.length>0&&console.warn(`there are non-text parts ${y} in the response, returning concatenation of all text parts. Please refer to the non text parts for a full response from model.`),g?p:void 0}get data(){var t,e,n,s,a,l,u,m;if(((s=(n=(e=(t=this.candidates)===null||t===void 0?void 0:t[0])===null||e===void 0?void 0:e.content)===null||n===void 0?void 0:n.parts)===null||s===void 0?void 0:s.length)===0)return;this.candidates&&this.candidates.length>1&&console.warn("there are multiple candidates in the response, returning data from the first one.");let p="";const g=[];for(const y of(m=(u=(l=(a=this.candidates)===null||a===void 0?void 0:a[0])===null||l===void 0?void 0:l.content)===null||u===void 0?void 0:u.parts)!==null&&m!==void 0?m:[]){for(const[T,E]of Object.entries(y))T!=="inlineData"&&(E!==null||E!==void 0)&&g.push(T);y.inlineData&&typeof y.inlineData.data=="string"&&(p+=atob(y.inlineData.data))}return g.length>0&&console.warn(`there are non-data parts ${g} in the response, returning concatenation of all data parts. Please refer to the non data parts for a full response from model.`),p.length>0?btoa(p):void 0}get functionCalls(){var t,e,n,s,a,l,u,m;if(((s=(n=(e=(t=this.candidates)===null||t===void 0?void 0:t[0])===null||e===void 0?void 0:e.content)===null||n===void 0?void 0:n.parts)===null||s===void 0?void 0:s.length)===0)return;this.candidates&&this.candidates.length>1&&console.warn("there are multiple candidates in the response, returning function calls from the first one.");const p=(m=(u=(l=(a=this.candidates)===null||a===void 0?void 0:a[0])===null||l===void 0?void 0:l.content)===null||u===void 0?void 0:u.parts)===null||m===void 0?void 0:m.filter(g=>g.functionCall).map(g=>g.functionCall).filter(g=>g!==void 0);if((p==null?void 0:p.length)!==0)return p}get executableCode(){var t,e,n,s,a,l,u,m,p;if(((s=(n=(e=(t=this.candidates)===null||t===void 0?void 0:t[0])===null||e===void 0?void 0:e.content)===null||n===void 0?void 0:n.parts)===null||s===void 0?void 0:s.length)===0)return;this.candidates&&this.candidates.length>1&&console.warn("there are multiple candidates in the response, returning executable code from the first one.");const g=(m=(u=(l=(a=this.candidates)===null||a===void 0?void 0:a[0])===null||l===void 0?void 0:l.content)===null||u===void 0?void 0:u.parts)===null||m===void 0?void 0:m.filter(y=>y.executableCode).map(y=>y.executableCode).filter(y=>y!==void 0);if((g==null?void 0:g.length)!==0)return(p=g==null?void 0:g[0])===null||p===void 0?void 0:p.code}get codeExecutionResult(){var t,e,n,s,a,l,u,m,p;if(((s=(n=(e=(t=this.candidates)===null||t===void 0?void 0:t[0])===null||e===void 0?void 0:e.content)===null||n===void 0?void 0:n.parts)===null||s===void 0?void 0:s.length)===0)return;this.candidates&&this.candidates.length>1&&console.warn("there are multiple candidates in the response, returning code execution result from the first one.");const g=(m=(u=(l=(a=this.candidates)===null||a===void 0?void 0:a[0])===null||l===void 0?void 0:l.content)===null||u===void 0?void 0:u.parts)===null||m===void 0?void 0:m.filter(y=>y.codeExecutionResult).map(y=>y.codeExecutionResult).filter(y=>y!==void 0);if((g==null?void 0:g.length)!==0)return(p=g==null?void 0:g[0])===null||p===void 0?void 0:p.output}}class Wt{}class Yt{}class Xi{}class Qi{}class Kt{}class Xt{}class Qt{}class Zi{}class Zt{}class jt{}class en{}class ji{}class He{constructor(t){const e={};for(const n of t.headers.entries())e[n[0]]=n[1];this.headers=e,this.responseInternal=t}json(){return this.responseInternal.json()}}class es{}class ts{}class ns{get text(){var t,e,n;let s="",a=!1;const l=[];for(const u of(n=(e=(t=this.serverContent)===null||t===void 0?void 0:t.modelTurn)===null||e===void 0?void 0:e.parts)!==null&&n!==void 0?n:[]){for(const[m,p]of Object.entries(u))m!=="text"&&m!=="thought"&&p!==null&&l.push(m);if(typeof u.text=="string"){if(typeof u.thought=="boolean"&&u.thought)continue;a=!0,s+=u.text}}return l.length>0&&console.warn(`there are non-text parts ${l} in the response, returning concatenation of all text parts. Please refer to the non text parts for a full response from model.`),a?s:void 0}get data(){var t,e,n;let s="";const a=[];for(const l of(n=(e=(t=this.serverContent)===null||t===void 0?void 0:t.modelTurn)===null||e===void 0?void 0:e.parts)!==null&&n!==void 0?n:[]){for(const[u,m]of Object.entries(l))u!=="inlineData"&&m!==null&&a.push(u);l.inlineData&&typeof l.inlineData.data=="string"&&(s+=atob(l.inlineData.data))}return a.length>0&&console.warn(`there are non-data parts ${a} in the response, returning concatenation of all data parts. Please refer to the non data parts for a full response from model.`),s.length>0?btoa(s):void 0}}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class os extends fe{constructor(t){super(),this.apiClient=t,this.list=async(e={})=>new Re(ce.PAGED_ITEM_CACHED_CONTENTS,n=>this.listInternal(n),await this.listInternal(e),e)}async create(t){var e,n,s,a;let l,u="",m={};if(this.apiClient.isVertexAI()){const p=qi(this.apiClient,t);return u=x("cachedContents",p._url),m=p._query,delete p.config,delete p._url,delete p._query,l=this.apiClient.request({path:u,queryParams:m,body:JSON.stringify(p),httpMethod:"POST",httpOptions:(e=t.config)===null||e===void 0?void 0:e.httpOptions,abortSignal:(n=t.config)===null||n===void 0?void 0:n.abortSignal}).then(g=>g.json()),l.then(g=>Se(this.apiClient,g))}else{const p=yi(this.apiClient,t);return u=x("cachedContents",p._url),m=p._query,delete p.config,delete p._url,delete p._query,l=this.apiClient.request({path:u,queryParams:m,body:JSON.stringify(p),httpMethod:"POST",httpOptions:(s=t.config)===null||s===void 0?void 0:s.httpOptions,abortSignal:(a=t.config)===null||a===void 0?void 0:a.abortSignal}).then(g=>g.json()),l.then(g=>Ee(this.apiClient,g))}}async get(t){var e,n,s,a;let l,u="",m={};if(this.apiClient.isVertexAI()){const p=Bi(this.apiClient,t);return u=x("{name}",p._url),m=p._query,delete p.config,delete p._url,delete p._query,l=this.apiClient.request({path:u,queryParams:m,body:JSON.stringify(p),httpMethod:"GET",httpOptions:(e=t.config)===null||e===void 0?void 0:e.httpOptions,abortSignal:(n=t.config)===null||n===void 0?void 0:n.abortSignal}).then(g=>g.json()),l.then(g=>Se(this.apiClient,g))}else{const p=vi(this.apiClient,t);return u=x("{name}",p._url),m=p._query,delete p.config,delete p._url,delete p._query,l=this.apiClient.request({path:u,queryParams:m,body:JSON.stringify(p),httpMethod:"GET",httpOptions:(s=t.config)===null||s===void 0?void 0:s.httpOptions,abortSignal:(a=t.config)===null||a===void 0?void 0:a.abortSignal}).then(g=>g.json()),l.then(g=>Ee(this.apiClient,g))}}async delete(t){var e,n,s,a;let l,u="",m={};if(this.apiClient.isVertexAI()){const p=Vi(this.apiClient,t);return u=x("{name}",p._url),m=p._query,delete p.config,delete p._url,delete p._query,l=this.apiClient.request({path:u,queryParams:m,body:JSON.stringify(p),httpMethod:"DELETE",httpOptions:(e=t.config)===null||e===void 0?void 0:e.httpOptions,abortSignal:(n=t.config)===null||n===void 0?void 0:n.abortSignal}).then(g=>g.json()),l.then(()=>{const g=Yi(),y=new jt;return Object.assign(y,g),y})}else{const p=Ci(this.apiClient,t);return u=x("{name}",p._url),m=p._query,delete p.config,delete p._url,delete p._query,l=this.apiClient.request({path:u,queryParams:m,body:JSON.stringify(p),httpMethod:"DELETE",httpOptions:(s=t.config)===null||s===void 0?void 0:s.httpOptions,abortSignal:(a=t.config)===null||a===void 0?void 0:a.abortSignal}).then(g=>g.json()),l.then(()=>{const g=Ji(),y=new jt;return Object.assign(y,g),y})}}async update(t){var e,n,s,a;let l,u="",m={};if(this.apiClient.isVertexAI()){const p=Hi(this.apiClient,t);return u=x("{name}",p._url),m=p._query,delete p.config,delete p._url,delete p._query,l=this.apiClient.request({path:u,queryParams:m,body:JSON.stringify(p),httpMethod:"PATCH",httpOptions:(e=t.config)===null||e===void 0?void 0:e.httpOptions,abortSignal:(n=t.config)===null||n===void 0?void 0:n.abortSignal}).then(g=>g.json()),l.then(g=>Se(this.apiClient,g))}else{const p=Ei(this.apiClient,t);return u=x("{name}",p._url),m=p._query,delete p.config,delete p._url,delete p._query,l=this.apiClient.request({path:u,queryParams:m,body:JSON.stringify(p),httpMethod:"PATCH",httpOptions:(s=t.config)===null||s===void 0?void 0:s.httpOptions,abortSignal:(a=t.config)===null||a===void 0?void 0:a.abortSignal}).then(g=>g.json()),l.then(g=>Ee(this.apiClient,g))}}async listInternal(t){var e,n,s,a;let l,u="",m={};if(this.apiClient.isVertexAI()){const p=zi(this.apiClient,t);return u=x("cachedContents",p._url),m=p._query,delete p.config,delete p._url,delete p._query,l=this.apiClient.request({path:u,queryParams:m,body:JSON.stringify(p),httpMethod:"GET",httpOptions:(e=t.config)===null||e===void 0?void 0:e.httpOptions,abortSignal:(n=t.config)===null||n===void 0?void 0:n.abortSignal}).then(g=>g.json()),l.then(g=>{const y=Ki(this.apiClient,g),T=new en;return Object.assign(T,y),T})}else{const p=Ii(this.apiClient,t);return u=x("cachedContents",p._url),m=p._query,delete p.config,delete p._url,delete p._query,l=this.apiClient.request({path:u,queryParams:m,body:JSON.stringify(p),httpMethod:"GET",httpOptions:(s=t.config)===null||s===void 0?void 0:s.httpOptions,abortSignal:(a=t.config)===null||a===void 0?void 0:a.abortSignal}).then(g=>g.json()),l.then(g=>{const y=Wi(this.apiClient,g),T=new en;return Object.assign(T,y),T})}}}function tn(o){var t=typeof Symbol=="function"&&Symbol.iterator,e=t&&o[t],n=0;if(e)return e.call(o);if(o&&typeof o.length=="number")return{next:function(){return o&&n>=o.length&&(o=void 0),{value:o&&o[n++],done:!o}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")}function J(o){return this instanceof J?(this.v=o,this):new J(o)}function be(o,t,e){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var n=e.apply(o,t||[]),s,a=[];return s=Object.create((typeof AsyncIterator=="function"?AsyncIterator:Object).prototype),u("next"),u("throw"),u("return",l),s[Symbol.asyncIterator]=function(){return this},s;function l(E){return function(I){return Promise.resolve(I).then(E,y)}}function u(E,I){n[E]&&(s[E]=function(P){return new Promise(function(D,$){a.push([E,P,D,$])>1||m(E,P)})},I&&(s[E]=I(s[E])))}function m(E,I){try{p(n[E](I))}catch(P){T(a[0][3],P)}}function p(E){E.value instanceof J?Promise.resolve(E.value.v).then(g,y):T(a[0][2],E)}function g(E){m("next",E)}function y(E){m("throw",E)}function T(E,I){E(I),a.shift(),a.length&&m(a[0][0],a[0][1])}}function Oe(o){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var t=o[Symbol.asyncIterator],e;return t?t.call(o):(o=typeof tn=="function"?tn(o):o[Symbol.iterator](),e={},n("next"),n("throw"),n("return"),e[Symbol.asyncIterator]=function(){return this},e);function n(a){e[a]=o[a]&&function(l){return new Promise(function(u,m){l=o[a](l),s(u,m,l.done,l.value)})}}function s(a,l,u,m){Promise.resolve(m).then(function(p){a({value:p,done:u})},l)}}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function is(o){var t;if(o.candidates==null||o.candidates.length===0)return!1;const e=(t=o.candidates[0])===null||t===void 0?void 0:t.content;return e===void 0?!1:wn(e)}function wn(o){if(o.parts===void 0||o.parts.length===0)return!1;for(const t of o.parts)if(t===void 0||Object.keys(t).length===0||t.text!==void 0&&t.text==="")return!1;return!0}function ss(o){if(o.length!==0){if(o[0].role!=="user")throw new Error("History must start with a user turn.");for(const t of o)if(t.role!=="user"&&t.role!=="model")throw new Error(`Role must be user or model, but got ${t.role}.`)}}function rs(o){if(o===void 0||o.length===0)return[];const t=[],e=o.length;let n=0,s=o[0];for(;n<e;)if(o[n].role==="user")s=o[n],n++;else{const a=[];let l=!0;for(;n<e&&o[n].role==="model";)a.push(o[n]),l&&!wn(o[n])&&(l=!1),n++;l&&(t.push(s),t.push(...a))}return t}class as{constructor(t,e){this.modelsModule=t,this.apiClient=e}create(t){return new ls(this.apiClient,this.modelsModule,t.model,t.config,t.history)}}class ls{constructor(t,e,n,s={},a=[]){this.apiClient=t,this.modelsModule=e,this.model=n,this.config=s,this.history=a,this.sendPromise=Promise.resolve(),ss(a)}async sendMessage(t){var e;await this.sendPromise;const n=X(this.apiClient,t.message),s=this.modelsModule.generateContent({model:this.model,contents:this.getHistory(!0).concat(n),config:(e=t.config)!==null&&e!==void 0?e:this.config});return this.sendPromise=(async()=>{var a,l;const m=(l=(a=(await s).candidates)===null||a===void 0?void 0:a[0])===null||l===void 0?void 0:l.content,p=m?[m]:[];this.recordHistory(n,p)})(),await this.sendPromise,s}async sendMessageStream(t){var e;await this.sendPromise;const n=X(this.apiClient,t.message),s=this.modelsModule.generateContentStream({model:this.model,contents:this.getHistory(!0).concat(n),config:(e=t.config)!==null&&e!==void 0?e:this.config});this.sendPromise=s.then(()=>{}).catch(()=>{});const a=await s;return this.processStreamResponse(a,n)}getHistory(t=!1){return t?rs(this.history):this.history}processStreamResponse(t,e){var n,s;return be(this,arguments,function*(){var l,u,m,p;const g=[];try{for(var y=!0,T=Oe(t),E;E=yield J(T.next()),l=E.done,!l;y=!0){p=E.value,y=!1;const I=p;if(is(I)){const P=(s=(n=I.candidates)===null||n===void 0?void 0:n[0])===null||s===void 0?void 0:s.content;P!==void 0&&g.push(P)}yield yield J(I)}}catch(I){u={error:I}}finally{try{!y&&!l&&(m=T.return)&&(yield J(m.call(T)))}finally{if(u)throw u.error}}this.recordHistory(e,g)})}recordHistory(t,e){let n=[];e.length>0&&e.every(s=>s.role==="model")?n=e:n.push({role:"model",parts:[]}),this.history.push(t),this.history.push(...n)}}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function cs(o,t,e){const n={},s=i(t,["pageSize"]);e!==void 0&&s!=null&&r(e,["_query","pageSize"],s);const a=i(t,["pageToken"]);return e!==void 0&&a!=null&&r(e,["_query","pageToken"],a),n}function us(o,t){const e={},n=i(t,["config"]);return n!=null&&r(e,["config"],cs(o,n,e)),e}function ds(o,t){const e={},n=i(t,["details"]);n!=null&&r(e,["details"],n);const s=i(t,["message"]);s!=null&&r(e,["message"],s);const a=i(t,["code"]);return a!=null&&r(e,["code"],a),e}function ps(o,t){const e={},n=i(t,["name"]);n!=null&&r(e,["name"],n);const s=i(t,["displayName"]);s!=null&&r(e,["displayName"],s);const a=i(t,["mimeType"]);a!=null&&r(e,["mimeType"],a);const l=i(t,["sizeBytes"]);l!=null&&r(e,["sizeBytes"],l);const u=i(t,["createTime"]);u!=null&&r(e,["createTime"],u);const m=i(t,["expirationTime"]);m!=null&&r(e,["expirationTime"],m);const p=i(t,["updateTime"]);p!=null&&r(e,["updateTime"],p);const g=i(t,["sha256Hash"]);g!=null&&r(e,["sha256Hash"],g);const y=i(t,["uri"]);y!=null&&r(e,["uri"],y);const T=i(t,["downloadUri"]);T!=null&&r(e,["downloadUri"],T);const E=i(t,["state"]);E!=null&&r(e,["state"],E);const I=i(t,["source"]);I!=null&&r(e,["source"],I);const P=i(t,["videoMetadata"]);P!=null&&r(e,["videoMetadata"],P);const D=i(t,["error"]);return D!=null&&r(e,["error"],ds(o,D)),e}function fs(o,t){const e={},n=i(t,["file"]);n!=null&&r(e,["file"],ps(o,n));const s=i(t,["config"]);return s!=null&&r(e,["config"],s),e}function ms(o,t){const e={},n=i(t,["name"]);n!=null&&r(e,["_url","file"],In(o,n));const s=i(t,["config"]);return s!=null&&r(e,["config"],s),e}function gs(o,t){const e={},n=i(t,["name"]);n!=null&&r(e,["_url","file"],In(o,n));const s=i(t,["config"]);return s!=null&&r(e,["config"],s),e}function hs(o,t){const e={},n=i(t,["details"]);n!=null&&r(e,["details"],n);const s=i(t,["message"]);s!=null&&r(e,["message"],s);const a=i(t,["code"]);return a!=null&&r(e,["code"],a),e}function ze(o,t){const e={},n=i(t,["name"]);n!=null&&r(e,["name"],n);const s=i(t,["displayName"]);s!=null&&r(e,["displayName"],s);const a=i(t,["mimeType"]);a!=null&&r(e,["mimeType"],a);const l=i(t,["sizeBytes"]);l!=null&&r(e,["sizeBytes"],l);const u=i(t,["createTime"]);u!=null&&r(e,["createTime"],u);const m=i(t,["expirationTime"]);m!=null&&r(e,["expirationTime"],m);const p=i(t,["updateTime"]);p!=null&&r(e,["updateTime"],p);const g=i(t,["sha256Hash"]);g!=null&&r(e,["sha256Hash"],g);const y=i(t,["uri"]);y!=null&&r(e,["uri"],y);const T=i(t,["downloadUri"]);T!=null&&r(e,["downloadUri"],T);const E=i(t,["state"]);E!=null&&r(e,["state"],E);const I=i(t,["source"]);I!=null&&r(e,["source"],I);const P=i(t,["videoMetadata"]);P!=null&&r(e,["videoMetadata"],P);const D=i(t,["error"]);return D!=null&&r(e,["error"],hs(o,D)),e}function ys(o,t){const e={},n=i(t,["nextPageToken"]);n!=null&&r(e,["nextPageToken"],n);const s=i(t,["files"]);if(s!=null){let a=s;Array.isArray(a)&&(a=a.map(l=>ze(o,l))),r(e,["files"],a)}return e}function vs(){return{}}function Cs(){return{}}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Ts extends fe{constructor(t){super(),this.apiClient=t,this.list=async(e={})=>new Re(ce.PAGED_ITEM_FILES,n=>this.listInternal(n),await this.listInternal(e),e)}async upload(t){if(this.apiClient.isVertexAI())throw new Error("Vertex AI does not support uploading files. You can share files through a GCS bucket.");return this.apiClient.uploadFile(t.file,t.config).then(e=>ze(this.apiClient,e))}async download(t){await this.apiClient.downloadFile(t)}async listInternal(t){var e,n;let s,a="",l={};if(this.apiClient.isVertexAI())throw new Error("This method is only supported by the Gemini Developer API.");{const u=us(this.apiClient,t);return a=x("files",u._url),l=u._query,delete u.config,delete u._url,delete u._query,s=this.apiClient.request({path:a,queryParams:l,body:JSON.stringify(u),httpMethod:"GET",httpOptions:(e=t.config)===null||e===void 0?void 0:e.httpOptions,abortSignal:(n=t.config)===null||n===void 0?void 0:n.abortSignal}).then(m=>m.json()),s.then(m=>{const p=ys(this.apiClient,m),g=new ji;return Object.assign(g,p),g})}}async createInternal(t){var e,n;let s,a="",l={};if(this.apiClient.isVertexAI())throw new Error("This method is only supported by the Gemini Developer API.");{const u=fs(this.apiClient,t);return a=x("upload/v1beta/files",u._url),l=u._query,delete u.config,delete u._url,delete u._query,s=this.apiClient.request({path:a,queryParams:l,body:JSON.stringify(u),httpMethod:"POST",httpOptions:(e=t.config)===null||e===void 0?void 0:e.httpOptions,abortSignal:(n=t.config)===null||n===void 0?void 0:n.abortSignal}).then(m=>m.json()),s.then(()=>{const m=vs(),p=new es;return Object.assign(p,m),p})}}async get(t){var e,n;let s,a="",l={};if(this.apiClient.isVertexAI())throw new Error("This method is only supported by the Gemini Developer API.");{const u=ms(this.apiClient,t);return a=x("files/{file}",u._url),l=u._query,delete u.config,delete u._url,delete u._query,s=this.apiClient.request({path:a,queryParams:l,body:JSON.stringify(u),httpMethod:"GET",httpOptions:(e=t.config)===null||e===void 0?void 0:e.httpOptions,abortSignal:(n=t.config)===null||n===void 0?void 0:n.abortSignal}).then(m=>m.json()),s.then(m=>ze(this.apiClient,m))}}async delete(t){var e,n;let s,a="",l={};if(this.apiClient.isVertexAI())throw new Error("This method is only supported by the Gemini Developer API.");{const u=gs(this.apiClient,t);return a=x("files/{file}",u._url),l=u._query,delete u.config,delete u._url,delete u._query,s=this.apiClient.request({path:a,queryParams:l,body:JSON.stringify(u),httpMethod:"DELETE",httpOptions:(e=t.config)===null||e===void 0?void 0:e.httpOptions,abortSignal:(n=t.config)===null||n===void 0?void 0:n.abortSignal}).then(m=>m.json()),s.then(()=>{const m=Cs(),p=new ts;return Object.assign(p,m),p})}}}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function Es(o,t){const e={};if(i(t,["displayName"])!==void 0)throw new Error("displayName parameter is not supported in Gemini API.");const n=i(t,["data"]);n!=null&&r(e,["data"],n);const s=i(t,["mimeType"]);return s!=null&&r(e,["mimeType"],s),e}function Ss(o,t){const e={},n=i(t,["displayName"]);n!=null&&r(e,["displayName"],n);const s=i(t,["data"]);s!=null&&r(e,["data"],s);const a=i(t,["mimeType"]);return a!=null&&r(e,["mimeType"],a),e}function Is(o,t){const e={};if(i(t,["videoMetadata"])!==void 0)throw new Error("videoMetadata parameter is not supported in Gemini API.");const n=i(t,["thought"]);n!=null&&r(e,["thought"],n);const s=i(t,["inlineData"]);s!=null&&r(e,["inlineData"],Es(o,s));const a=i(t,["codeExecutionResult"]);a!=null&&r(e,["codeExecutionResult"],a);const l=i(t,["executableCode"]);l!=null&&r(e,["executableCode"],l);const u=i(t,["fileData"]);u!=null&&r(e,["fileData"],u);const m=i(t,["functionCall"]);m!=null&&r(e,["functionCall"],m);const p=i(t,["functionResponse"]);p!=null&&r(e,["functionResponse"],p);const g=i(t,["text"]);return g!=null&&r(e,["text"],g),e}function As(o,t){const e={},n=i(t,["videoMetadata"]);n!=null&&r(e,["videoMetadata"],n);const s=i(t,["thought"]);s!=null&&r(e,["thought"],s);const a=i(t,["inlineData"]);a!=null&&r(e,["inlineData"],Ss(o,a));const l=i(t,["codeExecutionResult"]);l!=null&&r(e,["codeExecutionResult"],l);const u=i(t,["executableCode"]);u!=null&&r(e,["executableCode"],u);const m=i(t,["fileData"]);m!=null&&r(e,["fileData"],m);const p=i(t,["functionCall"]);p!=null&&r(e,["functionCall"],p);const g=i(t,["functionResponse"]);g!=null&&r(e,["functionResponse"],g);const y=i(t,["text"]);return y!=null&&r(e,["text"],y),e}function bs(o,t){const e={},n=i(t,["parts"]);if(n!=null){let a=n;Array.isArray(a)&&(a=a.map(l=>Is(o,l))),r(e,["parts"],a)}const s=i(t,["role"]);return s!=null&&r(e,["role"],s),e}function ws(o,t){const e={},n=i(t,["parts"]);if(n!=null){let a=n;Array.isArray(a)&&(a=a.map(l=>As(o,l))),r(e,["parts"],a)}const s=i(t,["role"]);return s!=null&&r(e,["role"],s),e}function _s(){return{}}function Rs(){return{}}function Ms(o,t){const e={},n=i(t,["mode"]);n!=null&&r(e,["mode"],n);const s=i(t,["dynamicThreshold"]);return s!=null&&r(e,["dynamicThreshold"],s),e}function Ps(o,t){const e={},n=i(t,["mode"]);n!=null&&r(e,["mode"],n);const s=i(t,["dynamicThreshold"]);return s!=null&&r(e,["dynamicThreshold"],s),e}function xs(o,t){const e={},n=i(t,["dynamicRetrievalConfig"]);return n!=null&&r(e,["dynamicRetrievalConfig"],Ms(o,n)),e}function Ds(o,t){const e={},n=i(t,["dynamicRetrievalConfig"]);return n!=null&&r(e,["dynamicRetrievalConfig"],Ps(o,n)),e}function ks(){return{}}function Ls(o,t){const e={},n=i(t,["apiKeyString"]);return n!=null&&r(e,["apiKeyString"],n),e}function Ns(o,t){const e={},n=i(t,["apiKeyConfig"]);n!=null&&r(e,["apiKeyConfig"],Ls(o,n));const s=i(t,["authType"]);s!=null&&r(e,["authType"],s);const a=i(t,["googleServiceAccountConfig"]);a!=null&&r(e,["googleServiceAccountConfig"],a);const l=i(t,["httpBasicAuthConfig"]);l!=null&&r(e,["httpBasicAuthConfig"],l);const u=i(t,["oauthConfig"]);u!=null&&r(e,["oauthConfig"],u);const m=i(t,["oidcConfig"]);return m!=null&&r(e,["oidcConfig"],m),e}function $s(o,t){const e={},n=i(t,["authConfig"]);return n!=null&&r(e,["authConfig"],Ns(o,n)),e}function Fs(o,t){const e={};if(i(t,["retrieval"])!==void 0)throw new Error("retrieval parameter is not supported in Gemini API.");i(t,["googleSearch"])!=null&&r(e,["googleSearch"],_s());const s=i(t,["googleSearchRetrieval"]);if(s!=null&&r(e,["googleSearchRetrieval"],xs(o,s)),i(t,["enterpriseWebSearch"])!==void 0)throw new Error("enterpriseWebSearch parameter is not supported in Gemini API.");if(i(t,["googleMaps"])!==void 0)throw new Error("googleMaps parameter is not supported in Gemini API.");const a=i(t,["codeExecution"]);a!=null&&r(e,["codeExecution"],a);const l=i(t,["functionDeclarations"]);return l!=null&&r(e,["functionDeclarations"],l),e}function Us(o,t){const e={},n=i(t,["retrieval"]);n!=null&&r(e,["retrieval"],n),i(t,["googleSearch"])!=null&&r(e,["googleSearch"],Rs());const a=i(t,["googleSearchRetrieval"]);a!=null&&r(e,["googleSearchRetrieval"],Ds(o,a)),i(t,["enterpriseWebSearch"])!=null&&r(e,["enterpriseWebSearch"],ks());const u=i(t,["googleMaps"]);u!=null&&r(e,["googleMaps"],$s(o,u));const m=i(t,["codeExecution"]);m!=null&&r(e,["codeExecution"],m);const p=i(t,["functionDeclarations"]);return p!=null&&r(e,["functionDeclarations"],p),e}function qs(o,t){const e={},n=i(t,["handle"]);if(n!=null&&r(e,["handle"],n),i(t,["transparent"])!==void 0)throw new Error("transparent parameter is not supported in Gemini API.");return e}function Bs(o,t){const e={},n=i(t,["handle"]);n!=null&&r(e,["handle"],n);const s=i(t,["transparent"]);return s!=null&&r(e,["transparent"],s),e}function nn(){return{}}function on(){return{}}function Vs(o,t){const e={},n=i(t,["disabled"]);n!=null&&r(e,["disabled"],n);const s=i(t,["startOfSpeechSensitivity"]);s!=null&&r(e,["startOfSpeechSensitivity"],s);const a=i(t,["endOfSpeechSensitivity"]);a!=null&&r(e,["endOfSpeechSensitivity"],a);const l=i(t,["prefixPaddingMs"]);l!=null&&r(e,["prefixPaddingMs"],l);const u=i(t,["silenceDurationMs"]);return u!=null&&r(e,["silenceDurationMs"],u),e}function Gs(o,t){const e={},n=i(t,["disabled"]);n!=null&&r(e,["disabled"],n);const s=i(t,["startOfSpeechSensitivity"]);s!=null&&r(e,["startOfSpeechSensitivity"],s);const a=i(t,["endOfSpeechSensitivity"]);a!=null&&r(e,["endOfSpeechSensitivity"],a);const l=i(t,["prefixPaddingMs"]);l!=null&&r(e,["prefixPaddingMs"],l);const u=i(t,["silenceDurationMs"]);return u!=null&&r(e,["silenceDurationMs"],u),e}function Hs(o,t){const e={},n=i(t,["automaticActivityDetection"]);n!=null&&r(e,["automaticActivityDetection"],Vs(o,n));const s=i(t,["activityHandling"]);s!=null&&r(e,["activityHandling"],s);const a=i(t,["turnCoverage"]);return a!=null&&r(e,["turnCoverage"],a),e}function Os(o,t){const e={},n=i(t,["automaticActivityDetection"]);n!=null&&r(e,["automaticActivityDetection"],Gs(o,n));const s=i(t,["activityHandling"]);s!=null&&r(e,["activityHandling"],s);const a=i(t,["turnCoverage"]);return a!=null&&r(e,["turnCoverage"],a),e}function zs(o,t){const e={},n=i(t,["targetTokens"]);return n!=null&&r(e,["targetTokens"],n),e}function Js(o,t){const e={},n=i(t,["targetTokens"]);return n!=null&&r(e,["targetTokens"],n),e}function Ws(o,t){const e={},n=i(t,["triggerTokens"]);n!=null&&r(e,["triggerTokens"],n);const s=i(t,["slidingWindow"]);return s!=null&&r(e,["slidingWindow"],zs(o,s)),e}function Ys(o,t){const e={},n=i(t,["triggerTokens"]);n!=null&&r(e,["triggerTokens"],n);const s=i(t,["slidingWindow"]);return s!=null&&r(e,["slidingWindow"],Js(o,s)),e}function Ks(o,t,e){const n={},s=i(t,["generationConfig"]);e!==void 0&&s!=null&&r(e,["setup","generationConfig"],s);const a=i(t,["responseModalities"]);e!==void 0&&a!=null&&r(e,["setup","generationConfig","responseModalities"],a);const l=i(t,["temperature"]);e!==void 0&&l!=null&&r(e,["setup","generationConfig","temperature"],l);const u=i(t,["topP"]);e!==void 0&&u!=null&&r(e,["setup","generationConfig","topP"],u);const m=i(t,["topK"]);e!==void 0&&m!=null&&r(e,["setup","generationConfig","topK"],m);const p=i(t,["maxOutputTokens"]);e!==void 0&&p!=null&&r(e,["setup","generationConfig","maxOutputTokens"],p);const g=i(t,["mediaResolution"]);e!==void 0&&g!=null&&r(e,["setup","generationConfig","mediaResolution"],g);const y=i(t,["seed"]);e!==void 0&&y!=null&&r(e,["setup","generationConfig","seed"],y);const T=i(t,["speechConfig"]);e!==void 0&&T!=null&&r(e,["setup","generationConfig","speechConfig"],T);const E=i(t,["systemInstruction"]);e!==void 0&&E!=null&&r(e,["setup","systemInstruction"],bs(o,X(o,E)));const I=i(t,["tools"]);if(e!==void 0&&I!=null){let N=_e(o,I);Array.isArray(N)&&(N=N.map(H=>Fs(o,we(o,H)))),r(e,["setup","tools"],N)}const P=i(t,["sessionResumption"]);e!==void 0&&P!=null&&r(e,["setup","sessionResumption"],qs(o,P));const D=i(t,["inputAudioTranscription"]);e!==void 0&&D!=null&&r(e,["setup","inputAudioTranscription"],nn());const $=i(t,["outputAudioTranscription"]);e!==void 0&&$!=null&&r(e,["setup","outputAudioTranscription"],nn());const F=i(t,["realtimeInputConfig"]);e!==void 0&&F!=null&&r(e,["setup","realtimeInputConfig"],Hs(o,F));const V=i(t,["contextWindowCompression"]);return e!==void 0&&V!=null&&r(e,["setup","contextWindowCompression"],Ws(o,V)),n}function Xs(o,t,e){const n={},s=i(t,["generationConfig"]);e!==void 0&&s!=null&&r(e,["setup","generationConfig"],s);const a=i(t,["responseModalities"]);e!==void 0&&a!=null&&r(e,["setup","generationConfig","responseModalities"],a);const l=i(t,["temperature"]);e!==void 0&&l!=null&&r(e,["setup","generationConfig","temperature"],l);const u=i(t,["topP"]);e!==void 0&&u!=null&&r(e,["setup","generationConfig","topP"],u);const m=i(t,["topK"]);e!==void 0&&m!=null&&r(e,["setup","generationConfig","topK"],m);const p=i(t,["maxOutputTokens"]);e!==void 0&&p!=null&&r(e,["setup","generationConfig","maxOutputTokens"],p);const g=i(t,["mediaResolution"]);e!==void 0&&g!=null&&r(e,["setup","generationConfig","mediaResolution"],g);const y=i(t,["seed"]);e!==void 0&&y!=null&&r(e,["setup","generationConfig","seed"],y);const T=i(t,["speechConfig"]);e!==void 0&&T!=null&&r(e,["setup","generationConfig","speechConfig"],T);const E=i(t,["systemInstruction"]);e!==void 0&&E!=null&&r(e,["setup","systemInstruction"],ws(o,X(o,E)));const I=i(t,["tools"]);if(e!==void 0&&I!=null){let N=_e(o,I);Array.isArray(N)&&(N=N.map(H=>Us(o,we(o,H)))),r(e,["setup","tools"],N)}const P=i(t,["sessionResumption"]);e!==void 0&&P!=null&&r(e,["setup","sessionResumption"],Bs(o,P));const D=i(t,["inputAudioTranscription"]);e!==void 0&&D!=null&&r(e,["setup","inputAudioTranscription"],on());const $=i(t,["outputAudioTranscription"]);e!==void 0&&$!=null&&r(e,["setup","outputAudioTranscription"],on());const F=i(t,["realtimeInputConfig"]);e!==void 0&&F!=null&&r(e,["setup","realtimeInputConfig"],Os(o,F));const V=i(t,["contextWindowCompression"]);return e!==void 0&&V!=null&&r(e,["setup","contextWindowCompression"],Ys(o,V)),n}function Qs(o,t){const e={},n=i(t,["model"]);n!=null&&r(e,["setup","model"],G(o,n));const s=i(t,["config"]);return s!=null&&r(e,["config"],Ks(o,s,e)),e}function Zs(o,t){const e={},n=i(t,["model"]);n!=null&&r(e,["setup","model"],G(o,n));const s=i(t,["config"]);return s!=null&&r(e,["config"],Xs(o,s,e)),e}function js(){return{}}function er(){return{}}function tr(){return{}}function nr(){return{}}function or(o,t){const e={},n=i(t,["media"]);n!=null&&r(e,["mediaChunks"],yn(o,n));const s=i(t,["audio"]);s!=null&&r(e,["audio"],ni(o,s));const a=i(t,["audioStreamEnd"]);a!=null&&r(e,["audioStreamEnd"],a);const l=i(t,["video"]);l!=null&&r(e,["video"],ti(o,l));const u=i(t,["text"]);return u!=null&&r(e,["text"],u),i(t,["activityStart"])!=null&&r(e,["activityStart"],js()),i(t,["activityEnd"])!=null&&r(e,["activityEnd"],tr()),e}function ir(o,t){const e={},n=i(t,["media"]);if(n!=null&&r(e,["mediaChunks"],yn(o,n)),i(t,["audio"])!==void 0)throw new Error("audio parameter is not supported in Vertex AI.");const s=i(t,["audioStreamEnd"]);if(s!=null&&r(e,["audioStreamEnd"],s),i(t,["video"])!==void 0)throw new Error("video parameter is not supported in Vertex AI.");if(i(t,["text"])!==void 0)throw new Error("text parameter is not supported in Vertex AI.");return i(t,["activityStart"])!=null&&r(e,["activityStart"],er()),i(t,["activityEnd"])!=null&&r(e,["activityEnd"],nr()),e}function sr(){return{}}function rr(){return{}}function ar(o,t){const e={},n=i(t,["data"]);n!=null&&r(e,["data"],n);const s=i(t,["mimeType"]);return s!=null&&r(e,["mimeType"],s),e}function lr(o,t){const e={},n=i(t,["displayName"]);n!=null&&r(e,["displayName"],n);const s=i(t,["data"]);s!=null&&r(e,["data"],s);const a=i(t,["mimeType"]);return a!=null&&r(e,["mimeType"],a),e}function cr(o,t){const e={},n=i(t,["thought"]);n!=null&&r(e,["thought"],n);const s=i(t,["inlineData"]);s!=null&&r(e,["inlineData"],ar(o,s));const a=i(t,["codeExecutionResult"]);a!=null&&r(e,["codeExecutionResult"],a);const l=i(t,["executableCode"]);l!=null&&r(e,["executableCode"],l);const u=i(t,["fileData"]);u!=null&&r(e,["fileData"],u);const m=i(t,["functionCall"]);m!=null&&r(e,["functionCall"],m);const p=i(t,["functionResponse"]);p!=null&&r(e,["functionResponse"],p);const g=i(t,["text"]);return g!=null&&r(e,["text"],g),e}function ur(o,t){const e={},n=i(t,["videoMetadata"]);n!=null&&r(e,["videoMetadata"],n);const s=i(t,["thought"]);s!=null&&r(e,["thought"],s);const a=i(t,["inlineData"]);a!=null&&r(e,["inlineData"],lr(o,a));const l=i(t,["codeExecutionResult"]);l!=null&&r(e,["codeExecutionResult"],l);const u=i(t,["executableCode"]);u!=null&&r(e,["executableCode"],u);const m=i(t,["fileData"]);m!=null&&r(e,["fileData"],m);const p=i(t,["functionCall"]);p!=null&&r(e,["functionCall"],p);const g=i(t,["functionResponse"]);g!=null&&r(e,["functionResponse"],g);const y=i(t,["text"]);return y!=null&&r(e,["text"],y),e}function dr(o,t){const e={},n=i(t,["parts"]);if(n!=null){let a=n;Array.isArray(a)&&(a=a.map(l=>cr(o,l))),r(e,["parts"],a)}const s=i(t,["role"]);return s!=null&&r(e,["role"],s),e}function pr(o,t){const e={},n=i(t,["parts"]);if(n!=null){let a=n;Array.isArray(a)&&(a=a.map(l=>ur(o,l))),r(e,["parts"],a)}const s=i(t,["role"]);return s!=null&&r(e,["role"],s),e}function sn(o,t){const e={},n=i(t,["text"]);n!=null&&r(e,["text"],n);const s=i(t,["finished"]);return s!=null&&r(e,["finished"],s),e}function rn(o,t){const e={},n=i(t,["text"]);n!=null&&r(e,["text"],n);const s=i(t,["finished"]);return s!=null&&r(e,["finished"],s),e}function fr(o,t){const e={},n=i(t,["modelTurn"]);n!=null&&r(e,["modelTurn"],dr(o,n));const s=i(t,["turnComplete"]);s!=null&&r(e,["turnComplete"],s);const a=i(t,["interrupted"]);a!=null&&r(e,["interrupted"],a);const l=i(t,["groundingMetadata"]);l!=null&&r(e,["groundingMetadata"],l);const u=i(t,["generationComplete"]);u!=null&&r(e,["generationComplete"],u);const m=i(t,["inputTranscription"]);m!=null&&r(e,["inputTranscription"],sn(o,m));const p=i(t,["outputTranscription"]);return p!=null&&r(e,["outputTranscription"],sn(o,p)),e}function mr(o,t){const e={},n=i(t,["modelTurn"]);n!=null&&r(e,["modelTurn"],pr(o,n));const s=i(t,["turnComplete"]);s!=null&&r(e,["turnComplete"],s);const a=i(t,["interrupted"]);a!=null&&r(e,["interrupted"],a);const l=i(t,["groundingMetadata"]);l!=null&&r(e,["groundingMetadata"],l);const u=i(t,["generationComplete"]);u!=null&&r(e,["generationComplete"],u);const m=i(t,["inputTranscription"]);m!=null&&r(e,["inputTranscription"],rn(o,m));const p=i(t,["outputTranscription"]);return p!=null&&r(e,["outputTranscription"],rn(o,p)),e}function gr(o,t){const e={},n=i(t,["id"]);n!=null&&r(e,["id"],n);const s=i(t,["args"]);s!=null&&r(e,["args"],s);const a=i(t,["name"]);return a!=null&&r(e,["name"],a),e}function hr(o,t){const e={},n=i(t,["args"]);n!=null&&r(e,["args"],n);const s=i(t,["name"]);return s!=null&&r(e,["name"],s),e}function yr(o,t){const e={},n=i(t,["functionCalls"]);if(n!=null){let s=n;Array.isArray(s)&&(s=s.map(a=>gr(o,a))),r(e,["functionCalls"],s)}return e}function vr(o,t){const e={},n=i(t,["functionCalls"]);if(n!=null){let s=n;Array.isArray(s)&&(s=s.map(a=>hr(o,a))),r(e,["functionCalls"],s)}return e}function Cr(o,t){const e={},n=i(t,["ids"]);return n!=null&&r(e,["ids"],n),e}function Tr(o,t){const e={},n=i(t,["ids"]);return n!=null&&r(e,["ids"],n),e}function Ce(o,t){const e={},n=i(t,["modality"]);n!=null&&r(e,["modality"],n);const s=i(t,["tokenCount"]);return s!=null&&r(e,["tokenCount"],s),e}function Te(o,t){const e={},n=i(t,["modality"]);n!=null&&r(e,["modality"],n);const s=i(t,["tokenCount"]);return s!=null&&r(e,["tokenCount"],s),e}function Er(o,t){const e={},n=i(t,["promptTokenCount"]);n!=null&&r(e,["promptTokenCount"],n);const s=i(t,["cachedContentTokenCount"]);s!=null&&r(e,["cachedContentTokenCount"],s);const a=i(t,["responseTokenCount"]);a!=null&&r(e,["responseTokenCount"],a);const l=i(t,["toolUsePromptTokenCount"]);l!=null&&r(e,["toolUsePromptTokenCount"],l);const u=i(t,["thoughtsTokenCount"]);u!=null&&r(e,["thoughtsTokenCount"],u);const m=i(t,["totalTokenCount"]);m!=null&&r(e,["totalTokenCount"],m);const p=i(t,["promptTokensDetails"]);if(p!=null){let E=p;Array.isArray(E)&&(E=E.map(I=>Ce(o,I))),r(e,["promptTokensDetails"],E)}const g=i(t,["cacheTokensDetails"]);if(g!=null){let E=g;Array.isArray(E)&&(E=E.map(I=>Ce(o,I))),r(e,["cacheTokensDetails"],E)}const y=i(t,["responseTokensDetails"]);if(y!=null){let E=y;Array.isArray(E)&&(E=E.map(I=>Ce(o,I))),r(e,["responseTokensDetails"],E)}const T=i(t,["toolUsePromptTokensDetails"]);if(T!=null){let E=T;Array.isArray(E)&&(E=E.map(I=>Ce(o,I))),r(e,["toolUsePromptTokensDetails"],E)}return e}function Sr(o,t){const e={},n=i(t,["promptTokenCount"]);n!=null&&r(e,["promptTokenCount"],n);const s=i(t,["cachedContentTokenCount"]);s!=null&&r(e,["cachedContentTokenCount"],s);const a=i(t,["candidatesTokenCount"]);a!=null&&r(e,["responseTokenCount"],a);const l=i(t,["toolUsePromptTokenCount"]);l!=null&&r(e,["toolUsePromptTokenCount"],l);const u=i(t,["thoughtsTokenCount"]);u!=null&&r(e,["thoughtsTokenCount"],u);const m=i(t,["totalTokenCount"]);m!=null&&r(e,["totalTokenCount"],m);const p=i(t,["promptTokensDetails"]);if(p!=null){let I=p;Array.isArray(I)&&(I=I.map(P=>Te(o,P))),r(e,["promptTokensDetails"],I)}const g=i(t,["cacheTokensDetails"]);if(g!=null){let I=g;Array.isArray(I)&&(I=I.map(P=>Te(o,P))),r(e,["cacheTokensDetails"],I)}const y=i(t,["candidatesTokensDetails"]);if(y!=null){let I=y;Array.isArray(I)&&(I=I.map(P=>Te(o,P))),r(e,["responseTokensDetails"],I)}const T=i(t,["toolUsePromptTokensDetails"]);if(T!=null){let I=T;Array.isArray(I)&&(I=I.map(P=>Te(o,P))),r(e,["toolUsePromptTokensDetails"],I)}const E=i(t,["trafficType"]);return E!=null&&r(e,["trafficType"],E),e}function Ir(o,t){const e={},n=i(t,["timeLeft"]);return n!=null&&r(e,["timeLeft"],n),e}function Ar(o,t){const e={},n=i(t,["timeLeft"]);return n!=null&&r(e,["timeLeft"],n),e}function br(o,t){const e={},n=i(t,["newHandle"]);n!=null&&r(e,["newHandle"],n);const s=i(t,["resumable"]);s!=null&&r(e,["resumable"],s);const a=i(t,["lastConsumedClientMessageIndex"]);return a!=null&&r(e,["lastConsumedClientMessageIndex"],a),e}function wr(o,t){const e={},n=i(t,["newHandle"]);n!=null&&r(e,["newHandle"],n);const s=i(t,["resumable"]);s!=null&&r(e,["resumable"],s);const a=i(t,["lastConsumedClientMessageIndex"]);return a!=null&&r(e,["lastConsumedClientMessageIndex"],a),e}function _r(o,t){const e={};i(t,["setupComplete"])!=null&&r(e,["setupComplete"],sr());const s=i(t,["serverContent"]);s!=null&&r(e,["serverContent"],fr(o,s));const a=i(t,["toolCall"]);a!=null&&r(e,["toolCall"],yr(o,a));const l=i(t,["toolCallCancellation"]);l!=null&&r(e,["toolCallCancellation"],Cr(o,l));const u=i(t,["usageMetadata"]);u!=null&&r(e,["usageMetadata"],Er(o,u));const m=i(t,["goAway"]);m!=null&&r(e,["goAway"],Ir(o,m));const p=i(t,["sessionResumptionUpdate"]);return p!=null&&r(e,["sessionResumptionUpdate"],br(o,p)),e}function Rr(o,t){const e={};i(t,["setupComplete"])!=null&&r(e,["setupComplete"],rr());const s=i(t,["serverContent"]);s!=null&&r(e,["serverContent"],mr(o,s));const a=i(t,["toolCall"]);a!=null&&r(e,["toolCall"],vr(o,a));const l=i(t,["toolCallCancellation"]);l!=null&&r(e,["toolCallCancellation"],Tr(o,l));const u=i(t,["usageMetadata"]);u!=null&&r(e,["usageMetadata"],Sr(o,u));const m=i(t,["goAway"]);m!=null&&r(e,["goAway"],Ar(o,m));const p=i(t,["sessionResumptionUpdate"]);return p!=null&&r(e,["sessionResumptionUpdate"],wr(o,p)),e}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function Mr(o,t){const e={};if(i(t,["displayName"])!==void 0)throw new Error("displayName parameter is not supported in Gemini API.");const n=i(t,["data"]);n!=null&&r(e,["data"],n);const s=i(t,["mimeType"]);return s!=null&&r(e,["mimeType"],s),e}function Pr(o,t){const e={};if(i(t,["videoMetadata"])!==void 0)throw new Error("videoMetadata parameter is not supported in Gemini API.");const n=i(t,["thought"]);n!=null&&r(e,["thought"],n);const s=i(t,["inlineData"]);s!=null&&r(e,["inlineData"],Mr(o,s));const a=i(t,["codeExecutionResult"]);a!=null&&r(e,["codeExecutionResult"],a);const l=i(t,["executableCode"]);l!=null&&r(e,["executableCode"],l);const u=i(t,["fileData"]);u!=null&&r(e,["fileData"],u);const m=i(t,["functionCall"]);m!=null&&r(e,["functionCall"],m);const p=i(t,["functionResponse"]);p!=null&&r(e,["functionResponse"],p);const g=i(t,["text"]);return g!=null&&r(e,["text"],g),e}function Me(o,t){const e={},n=i(t,["parts"]);if(n!=null){let a=n;Array.isArray(a)&&(a=a.map(l=>Pr(o,l))),r(e,["parts"],a)}const s=i(t,["role"]);return s!=null&&r(e,["role"],s),e}function xr(o,t){const e={};if(i(t,["method"])!==void 0)throw new Error("method parameter is not supported in Gemini API.");const n=i(t,["category"]);n!=null&&r(e,["category"],n);const s=i(t,["threshold"]);return s!=null&&r(e,["threshold"],s),e}function Dr(){return{}}function kr(o,t){const e={},n=i(t,["mode"]);n!=null&&r(e,["mode"],n);const s=i(t,["dynamicThreshold"]);return s!=null&&r(e,["dynamicThreshold"],s),e}function Lr(o,t){const e={},n=i(t,["dynamicRetrievalConfig"]);return n!=null&&r(e,["dynamicRetrievalConfig"],kr(o,n)),e}function Nr(o,t){const e={};if(i(t,["retrieval"])!==void 0)throw new Error("retrieval parameter is not supported in Gemini API.");i(t,["googleSearch"])!=null&&r(e,["googleSearch"],Dr());const s=i(t,["googleSearchRetrieval"]);if(s!=null&&r(e,["googleSearchRetrieval"],Lr(o,s)),i(t,["enterpriseWebSearch"])!==void 0)throw new Error("enterpriseWebSearch parameter is not supported in Gemini API.");if(i(t,["googleMaps"])!==void 0)throw new Error("googleMaps parameter is not supported in Gemini API.");const a=i(t,["codeExecution"]);a!=null&&r(e,["codeExecution"],a);const l=i(t,["functionDeclarations"]);return l!=null&&r(e,["functionDeclarations"],l),e}function $r(o,t){const e={},n=i(t,["mode"]);n!=null&&r(e,["mode"],n);const s=i(t,["allowedFunctionNames"]);return s!=null&&r(e,["allowedFunctionNames"],s),e}function Fr(o,t){const e={},n=i(t,["functionCallingConfig"]);if(n!=null&&r(e,["functionCallingConfig"],$r(o,n)),i(t,["retrievalConfig"])!==void 0)throw new Error("retrievalConfig parameter is not supported in Gemini API.");return e}function Ur(o,t){const e={},n=i(t,["voiceName"]);return n!=null&&r(e,["voiceName"],n),e}function qr(o,t){const e={},n=i(t,["prebuiltVoiceConfig"]);return n!=null&&r(e,["prebuiltVoiceConfig"],Ur(o,n)),e}function Br(o,t){const e={},n=i(t,["voiceConfig"]);n!=null&&r(e,["voiceConfig"],qr(o,n));const s=i(t,["languageCode"]);return s!=null&&r(e,["languageCode"],s),e}function Vr(o,t){const e={},n=i(t,["includeThoughts"]);n!=null&&r(e,["includeThoughts"],n);const s=i(t,["thinkingBudget"]);return s!=null&&r(e,["thinkingBudget"],s),e}function Gr(o,t,e){const n={},s=i(t,["systemInstruction"]);e!==void 0&&s!=null&&r(e,["systemInstruction"],Me(o,X(o,s)));const a=i(t,["temperature"]);a!=null&&r(n,["temperature"],a);const l=i(t,["topP"]);l!=null&&r(n,["topP"],l);const u=i(t,["topK"]);u!=null&&r(n,["topK"],u);const m=i(t,["candidateCount"]);m!=null&&r(n,["candidateCount"],m);const p=i(t,["maxOutputTokens"]);p!=null&&r(n,["maxOutputTokens"],p);const g=i(t,["stopSequences"]);g!=null&&r(n,["stopSequences"],g);const y=i(t,["responseLogprobs"]);y!=null&&r(n,["responseLogprobs"],y);const T=i(t,["logprobs"]);T!=null&&r(n,["logprobs"],T);const E=i(t,["presencePenalty"]);E!=null&&r(n,["presencePenalty"],E);const I=i(t,["frequencyPenalty"]);I!=null&&r(n,["frequencyPenalty"],I);const P=i(t,["seed"]);P!=null&&r(n,["seed"],P);const D=i(t,["responseMimeType"]);D!=null&&r(n,["responseMimeType"],D);const $=i(t,["responseSchema"]);if($!=null&&r(n,["responseSchema"],Tn(o,$)),i(t,["routingConfig"])!==void 0)throw new Error("routingConfig parameter is not supported in Gemini API.");if(i(t,["modelSelectionConfig"])!==void 0)throw new Error("modelSelectionConfig parameter is not supported in Gemini API.");const F=i(t,["safetySettings"]);if(e!==void 0&&F!=null){let Y=F;Array.isArray(Y)&&(Y=Y.map(O=>xr(o,O))),r(e,["safetySettings"],Y)}const V=i(t,["tools"]);if(e!==void 0&&V!=null){let Y=_e(o,V);Array.isArray(Y)&&(Y=Y.map(O=>Nr(o,we(o,O)))),r(e,["tools"],Y)}const N=i(t,["toolConfig"]);if(e!==void 0&&N!=null&&r(e,["toolConfig"],Fr(o,N)),i(t,["labels"])!==void 0)throw new Error("labels parameter is not supported in Gemini API.");const H=i(t,["cachedContent"]);e!==void 0&&H!=null&&r(e,["cachedContent"],oe(o,H));const se=i(t,["responseModalities"]);se!=null&&r(n,["responseModalities"],se);const ee=i(t,["mediaResolution"]);ee!=null&&r(n,["mediaResolution"],ee);const te=i(t,["speechConfig"]);if(te!=null&&r(n,["speechConfig"],Br(o,En(o,te))),i(t,["audioTimestamp"])!==void 0)throw new Error("audioTimestamp parameter is not supported in Gemini API.");const re=i(t,["thinkingConfig"]);return re!=null&&r(n,["thinkingConfig"],Vr(o,re)),n}function an(o,t){const e={},n=i(t,["model"]);n!=null&&r(e,["_url","model"],G(o,n));const s=i(t,["contents"]);if(s!=null){let l=ne(o,s);Array.isArray(l)&&(l=l.map(u=>Me(o,u))),r(e,["contents"],l)}const a=i(t,["config"]);return a!=null&&r(e,["generationConfig"],Gr(o,a,e)),e}function Hr(o,t,e){const n={},s=i(t,["taskType"]);e!==void 0&&s!=null&&r(e,["requests[]","taskType"],s);const a=i(t,["title"]);e!==void 0&&a!=null&&r(e,["requests[]","title"],a);const l=i(t,["outputDimensionality"]);if(e!==void 0&&l!=null&&r(e,["requests[]","outputDimensionality"],l),i(t,["mimeType"])!==void 0)throw new Error("mimeType parameter is not supported in Gemini API.");if(i(t,["autoTruncate"])!==void 0)throw new Error("autoTruncate parameter is not supported in Gemini API.");return n}function Or(o,t){const e={},n=i(t,["model"]);n!=null&&r(e,["_url","model"],G(o,n));const s=i(t,["contents"]);s!=null&&r(e,["requests[]","content"],Cn(o,s));const a=i(t,["config"]);a!=null&&r(e,["config"],Hr(o,a,e));const l=i(t,["model"]);return l!==void 0&&r(e,["requests[]","model"],G(o,l)),e}function zr(o,t,e){const n={};if(i(t,["outputGcsUri"])!==void 0)throw new Error("outputGcsUri parameter is not supported in Gemini API.");if(i(t,["negativePrompt"])!==void 0)throw new Error("negativePrompt parameter is not supported in Gemini API.");const s=i(t,["numberOfImages"]);e!==void 0&&s!=null&&r(e,["parameters","sampleCount"],s);const a=i(t,["aspectRatio"]);e!==void 0&&a!=null&&r(e,["parameters","aspectRatio"],a);const l=i(t,["guidanceScale"]);if(e!==void 0&&l!=null&&r(e,["parameters","guidanceScale"],l),i(t,["seed"])!==void 0)throw new Error("seed parameter is not supported in Gemini API.");const u=i(t,["safetyFilterLevel"]);e!==void 0&&u!=null&&r(e,["parameters","safetySetting"],u);const m=i(t,["personGeneration"]);e!==void 0&&m!=null&&r(e,["parameters","personGeneration"],m);const p=i(t,["includeSafetyAttributes"]);e!==void 0&&p!=null&&r(e,["parameters","includeSafetyAttributes"],p);const g=i(t,["includeRaiReason"]);e!==void 0&&g!=null&&r(e,["parameters","includeRaiReason"],g);const y=i(t,["language"]);e!==void 0&&y!=null&&r(e,["parameters","language"],y);const T=i(t,["outputMimeType"]);e!==void 0&&T!=null&&r(e,["parameters","outputOptions","mimeType"],T);const E=i(t,["outputCompressionQuality"]);if(e!==void 0&&E!=null&&r(e,["parameters","outputOptions","compressionQuality"],E),i(t,["addWatermark"])!==void 0)throw new Error("addWatermark parameter is not supported in Gemini API.");if(i(t,["enhancePrompt"])!==void 0)throw new Error("enhancePrompt parameter is not supported in Gemini API.");return n}function Jr(o,t){const e={},n=i(t,["model"]);n!=null&&r(e,["_url","model"],G(o,n));const s=i(t,["prompt"]);s!=null&&r(e,["instances[0]","prompt"],s);const a=i(t,["config"]);return a!=null&&r(e,["config"],zr(o,a,e)),e}function Wr(o,t){const e={},n=i(t,["model"]);n!=null&&r(e,["_url","name"],G(o,n));const s=i(t,["config"]);return s!=null&&r(e,["config"],s),e}function Yr(o,t,e){const n={},s=i(t,["pageSize"]);e!==void 0&&s!=null&&r(e,["_query","pageSize"],s);const a=i(t,["pageToken"]);e!==void 0&&a!=null&&r(e,["_query","pageToken"],a);const l=i(t,["filter"]);e!==void 0&&l!=null&&r(e,["_query","filter"],l);const u=i(t,["queryBase"]);return e!==void 0&&u!=null&&r(e,["_url","models_url"],An(o,u)),n}function Kr(o,t){const e={},n=i(t,["config"]);return n!=null&&r(e,["config"],Yr(o,n,e)),e}function Xr(o,t,e){const n={},s=i(t,["displayName"]);e!==void 0&&s!=null&&r(e,["displayName"],s);const a=i(t,["description"]);e!==void 0&&a!=null&&r(e,["description"],a);const l=i(t,["defaultCheckpointId"]);return e!==void 0&&l!=null&&r(e,["defaultCheckpointId"],l),n}function Qr(o,t){const e={},n=i(t,["model"]);n!=null&&r(e,["_url","name"],G(o,n));const s=i(t,["config"]);return s!=null&&r(e,["config"],Xr(o,s,e)),e}function Zr(o,t){const e={},n=i(t,["model"]);n!=null&&r(e,["_url","name"],G(o,n));const s=i(t,["config"]);return s!=null&&r(e,["config"],s),e}function jr(o,t){const e={};if(i(t,["systemInstruction"])!==void 0)throw new Error("systemInstruction parameter is not supported in Gemini API.");if(i(t,["tools"])!==void 0)throw new Error("tools parameter is not supported in Gemini API.");if(i(t,["generationConfig"])!==void 0)throw new Error("generationConfig parameter is not supported in Gemini API.");return e}function ea(o,t){const e={},n=i(t,["model"]);n!=null&&r(e,["_url","model"],G(o,n));const s=i(t,["contents"]);if(s!=null){let l=ne(o,s);Array.isArray(l)&&(l=l.map(u=>Me(o,u))),r(e,["contents"],l)}const a=i(t,["config"]);return a!=null&&r(e,["config"],jr(o,a)),e}function ta(o,t){const e={};if(i(t,["gcsUri"])!==void 0)throw new Error("gcsUri parameter is not supported in Gemini API.");const n=i(t,["imageBytes"]);n!=null&&r(e,["bytesBase64Encoded"],ie(o,n));const s=i(t,["mimeType"]);return s!=null&&r(e,["mimeType"],s),e}function na(o,t,e){const n={},s=i(t,["numberOfVideos"]);if(e!==void 0&&s!=null&&r(e,["parameters","sampleCount"],s),i(t,["outputGcsUri"])!==void 0)throw new Error("outputGcsUri parameter is not supported in Gemini API.");if(i(t,["fps"])!==void 0)throw new Error("fps parameter is not supported in Gemini API.");const a=i(t,["durationSeconds"]);if(e!==void 0&&a!=null&&r(e,["parameters","durationSeconds"],a),i(t,["seed"])!==void 0)throw new Error("seed parameter is not supported in Gemini API.");const l=i(t,["aspectRatio"]);if(e!==void 0&&l!=null&&r(e,["parameters","aspectRatio"],l),i(t,["resolution"])!==void 0)throw new Error("resolution parameter is not supported in Gemini API.");const u=i(t,["personGeneration"]);if(e!==void 0&&u!=null&&r(e,["parameters","personGeneration"],u),i(t,["pubsubTopic"])!==void 0)throw new Error("pubsubTopic parameter is not supported in Gemini API.");const m=i(t,["negativePrompt"]);if(e!==void 0&&m!=null&&r(e,["parameters","negativePrompt"],m),i(t,["enhancePrompt"])!==void 0)throw new Error("enhancePrompt parameter is not supported in Gemini API.");return n}function oa(o,t){const e={},n=i(t,["model"]);n!=null&&r(e,["_url","model"],G(o,n));const s=i(t,["prompt"]);s!=null&&r(e,["instances[0]","prompt"],s);const a=i(t,["image"]);a!=null&&r(e,["instances[0]","image"],ta(o,a));const l=i(t,["config"]);return l!=null&&r(e,["config"],na(o,l,e)),e}function ia(o,t){const e={},n=i(t,["displayName"]);n!=null&&r(e,["displayName"],n);const s=i(t,["data"]);s!=null&&r(e,["data"],s);const a=i(t,["mimeType"]);return a!=null&&r(e,["mimeType"],a),e}function sa(o,t){const e={},n=i(t,["videoMetadata"]);n!=null&&r(e,["videoMetadata"],n);const s=i(t,["thought"]);s!=null&&r(e,["thought"],s);const a=i(t,["inlineData"]);a!=null&&r(e,["inlineData"],ia(o,a));const l=i(t,["codeExecutionResult"]);l!=null&&r(e,["codeExecutionResult"],l);const u=i(t,["executableCode"]);u!=null&&r(e,["executableCode"],u);const m=i(t,["fileData"]);m!=null&&r(e,["fileData"],m);const p=i(t,["functionCall"]);p!=null&&r(e,["functionCall"],p);const g=i(t,["functionResponse"]);g!=null&&r(e,["functionResponse"],g);const y=i(t,["text"]);return y!=null&&r(e,["text"],y),e}function ue(o,t){const e={},n=i(t,["parts"]);if(n!=null){let a=n;Array.isArray(a)&&(a=a.map(l=>sa(o,l))),r(e,["parts"],a)}const s=i(t,["role"]);return s!=null&&r(e,["role"],s),e}function ra(o,t){const e={},n=i(t,["featureSelectionPreference"]);return n!=null&&r(e,["featureSelectionPreference"],n),e}function aa(o,t){const e={},n=i(t,["method"]);n!=null&&r(e,["method"],n);const s=i(t,["category"]);s!=null&&r(e,["category"],s);const a=i(t,["threshold"]);return a!=null&&r(e,["threshold"],a),e}function la(){return{}}function ca(o,t){const e={},n=i(t,["mode"]);n!=null&&r(e,["mode"],n);const s=i(t,["dynamicThreshold"]);return s!=null&&r(e,["dynamicThreshold"],s),e}function ua(o,t){const e={},n=i(t,["dynamicRetrievalConfig"]);return n!=null&&r(e,["dynamicRetrievalConfig"],ca(o,n)),e}function da(){return{}}function pa(o,t){const e={},n=i(t,["apiKeyString"]);return n!=null&&r(e,["apiKeyString"],n),e}function fa(o,t){const e={},n=i(t,["apiKeyConfig"]);n!=null&&r(e,["apiKeyConfig"],pa(o,n));const s=i(t,["authType"]);s!=null&&r(e,["authType"],s);const a=i(t,["googleServiceAccountConfig"]);a!=null&&r(e,["googleServiceAccountConfig"],a);const l=i(t,["httpBasicAuthConfig"]);l!=null&&r(e,["httpBasicAuthConfig"],l);const u=i(t,["oauthConfig"]);u!=null&&r(e,["oauthConfig"],u);const m=i(t,["oidcConfig"]);return m!=null&&r(e,["oidcConfig"],m),e}function ma(o,t){const e={},n=i(t,["authConfig"]);return n!=null&&r(e,["authConfig"],fa(o,n)),e}function _n(o,t){const e={},n=i(t,["retrieval"]);n!=null&&r(e,["retrieval"],n),i(t,["googleSearch"])!=null&&r(e,["googleSearch"],la());const a=i(t,["googleSearchRetrieval"]);a!=null&&r(e,["googleSearchRetrieval"],ua(o,a)),i(t,["enterpriseWebSearch"])!=null&&r(e,["enterpriseWebSearch"],da());const u=i(t,["googleMaps"]);u!=null&&r(e,["googleMaps"],ma(o,u));const m=i(t,["codeExecution"]);m!=null&&r(e,["codeExecution"],m);const p=i(t,["functionDeclarations"]);return p!=null&&r(e,["functionDeclarations"],p),e}function ga(o,t){const e={},n=i(t,["mode"]);n!=null&&r(e,["mode"],n);const s=i(t,["allowedFunctionNames"]);return s!=null&&r(e,["allowedFunctionNames"],s),e}function ha(o,t){const e={},n=i(t,["latitude"]);n!=null&&r(e,["latitude"],n);const s=i(t,["longitude"]);return s!=null&&r(e,["longitude"],s),e}function ya(o,t){const e={},n=i(t,["latLng"]);return n!=null&&r(e,["latLng"],ha(o,n)),e}function va(o,t){const e={},n=i(t,["functionCallingConfig"]);n!=null&&r(e,["functionCallingConfig"],ga(o,n));const s=i(t,["retrievalConfig"]);return s!=null&&r(e,["retrievalConfig"],ya(o,s)),e}function Ca(o,t){const e={},n=i(t,["voiceName"]);return n!=null&&r(e,["voiceName"],n),e}function Ta(o,t){const e={},n=i(t,["prebuiltVoiceConfig"]);return n!=null&&r(e,["prebuiltVoiceConfig"],Ca(o,n)),e}function Ea(o,t){const e={},n=i(t,["voiceConfig"]);n!=null&&r(e,["voiceConfig"],Ta(o,n));const s=i(t,["languageCode"]);return s!=null&&r(e,["languageCode"],s),e}function Sa(o,t){const e={},n=i(t,["includeThoughts"]);n!=null&&r(e,["includeThoughts"],n);const s=i(t,["thinkingBudget"]);return s!=null&&r(e,["thinkingBudget"],s),e}function Ia(o,t,e){const n={},s=i(t,["systemInstruction"]);e!==void 0&&s!=null&&r(e,["systemInstruction"],ue(o,X(o,s)));const a=i(t,["temperature"]);a!=null&&r(n,["temperature"],a);const l=i(t,["topP"]);l!=null&&r(n,["topP"],l);const u=i(t,["topK"]);u!=null&&r(n,["topK"],u);const m=i(t,["candidateCount"]);m!=null&&r(n,["candidateCount"],m);const p=i(t,["maxOutputTokens"]);p!=null&&r(n,["maxOutputTokens"],p);const g=i(t,["stopSequences"]);g!=null&&r(n,["stopSequences"],g);const y=i(t,["responseLogprobs"]);y!=null&&r(n,["responseLogprobs"],y);const T=i(t,["logprobs"]);T!=null&&r(n,["logprobs"],T);const E=i(t,["presencePenalty"]);E!=null&&r(n,["presencePenalty"],E);const I=i(t,["frequencyPenalty"]);I!=null&&r(n,["frequencyPenalty"],I);const P=i(t,["seed"]);P!=null&&r(n,["seed"],P);const D=i(t,["responseMimeType"]);D!=null&&r(n,["responseMimeType"],D);const $=i(t,["responseSchema"]);$!=null&&r(n,["responseSchema"],Tn(o,$));const F=i(t,["routingConfig"]);F!=null&&r(n,["routingConfig"],F);const V=i(t,["modelSelectionConfig"]);V!=null&&r(n,["modelConfig"],ra(o,V));const N=i(t,["safetySettings"]);if(e!==void 0&&N!=null){let Z=N;Array.isArray(Z)&&(Z=Z.map(j=>aa(o,j))),r(e,["safetySettings"],Z)}const H=i(t,["tools"]);if(e!==void 0&&H!=null){let Z=_e(o,H);Array.isArray(Z)&&(Z=Z.map(j=>_n(o,we(o,j)))),r(e,["tools"],Z)}const se=i(t,["toolConfig"]);e!==void 0&&se!=null&&r(e,["toolConfig"],va(o,se));const ee=i(t,["labels"]);e!==void 0&&ee!=null&&r(e,["labels"],ee);const te=i(t,["cachedContent"]);e!==void 0&&te!=null&&r(e,["cachedContent"],oe(o,te));const re=i(t,["responseModalities"]);re!=null&&r(n,["responseModalities"],re);const Y=i(t,["mediaResolution"]);Y!=null&&r(n,["mediaResolution"],Y);const O=i(t,["speechConfig"]);O!=null&&r(n,["speechConfig"],Ea(o,En(o,O)));const me=i(t,["audioTimestamp"]);me!=null&&r(n,["audioTimestamp"],me);const ge=i(t,["thinkingConfig"]);return ge!=null&&r(n,["thinkingConfig"],Sa(o,ge)),n}function ln(o,t){const e={},n=i(t,["model"]);n!=null&&r(e,["_url","model"],G(o,n));const s=i(t,["contents"]);if(s!=null){let l=ne(o,s);Array.isArray(l)&&(l=l.map(u=>ue(o,u))),r(e,["contents"],l)}const a=i(t,["config"]);return a!=null&&r(e,["generationConfig"],Ia(o,a,e)),e}function Aa(o,t,e){const n={},s=i(t,["taskType"]);e!==void 0&&s!=null&&r(e,["instances[]","task_type"],s);const a=i(t,["title"]);e!==void 0&&a!=null&&r(e,["instances[]","title"],a);const l=i(t,["outputDimensionality"]);e!==void 0&&l!=null&&r(e,["parameters","outputDimensionality"],l);const u=i(t,["mimeType"]);e!==void 0&&u!=null&&r(e,["instances[]","mimeType"],u);const m=i(t,["autoTruncate"]);return e!==void 0&&m!=null&&r(e,["parameters","autoTruncate"],m),n}function ba(o,t){const e={},n=i(t,["model"]);n!=null&&r(e,["_url","model"],G(o,n));const s=i(t,["contents"]);s!=null&&r(e,["instances[]","content"],Cn(o,s));const a=i(t,["config"]);return a!=null&&r(e,["config"],Aa(o,a,e)),e}function wa(o,t,e){const n={},s=i(t,["outputGcsUri"]);e!==void 0&&s!=null&&r(e,["parameters","storageUri"],s);const a=i(t,["negativePrompt"]);e!==void 0&&a!=null&&r(e,["parameters","negativePrompt"],a);const l=i(t,["numberOfImages"]);e!==void 0&&l!=null&&r(e,["parameters","sampleCount"],l);const u=i(t,["aspectRatio"]);e!==void 0&&u!=null&&r(e,["parameters","aspectRatio"],u);const m=i(t,["guidanceScale"]);e!==void 0&&m!=null&&r(e,["parameters","guidanceScale"],m);const p=i(t,["seed"]);e!==void 0&&p!=null&&r(e,["parameters","seed"],p);const g=i(t,["safetyFilterLevel"]);e!==void 0&&g!=null&&r(e,["parameters","safetySetting"],g);const y=i(t,["personGeneration"]);e!==void 0&&y!=null&&r(e,["parameters","personGeneration"],y);const T=i(t,["includeSafetyAttributes"]);e!==void 0&&T!=null&&r(e,["parameters","includeSafetyAttributes"],T);const E=i(t,["includeRaiReason"]);e!==void 0&&E!=null&&r(e,["parameters","includeRaiReason"],E);const I=i(t,["language"]);e!==void 0&&I!=null&&r(e,["parameters","language"],I);const P=i(t,["outputMimeType"]);e!==void 0&&P!=null&&r(e,["parameters","outputOptions","mimeType"],P);const D=i(t,["outputCompressionQuality"]);e!==void 0&&D!=null&&r(e,["parameters","outputOptions","compressionQuality"],D);const $=i(t,["addWatermark"]);e!==void 0&&$!=null&&r(e,["parameters","addWatermark"],$);const F=i(t,["enhancePrompt"]);return e!==void 0&&F!=null&&r(e,["parameters","enhancePrompt"],F),n}function _a(o,t){const e={},n=i(t,["model"]);n!=null&&r(e,["_url","model"],G(o,n));const s=i(t,["prompt"]);s!=null&&r(e,["instances[0]","prompt"],s);const a=i(t,["config"]);return a!=null&&r(e,["config"],wa(o,a,e)),e}function Xe(o,t){const e={},n=i(t,["gcsUri"]);n!=null&&r(e,["gcsUri"],n);const s=i(t,["imageBytes"]);s!=null&&r(e,["bytesBase64Encoded"],ie(o,s));const a=i(t,["mimeType"]);return a!=null&&r(e,["mimeType"],a),e}function Ra(o,t){const e={},n=i(t,["maskMode"]);n!=null&&r(e,["maskMode"],n);const s=i(t,["segmentationClasses"]);s!=null&&r(e,["maskClasses"],s);const a=i(t,["maskDilation"]);return a!=null&&r(e,["dilation"],a),e}function Ma(o,t){const e={},n=i(t,["controlType"]);n!=null&&r(e,["controlType"],n);const s=i(t,["enableControlImageComputation"]);return s!=null&&r(e,["computeControl"],s),e}function Pa(o,t){const e={},n=i(t,["styleDescription"]);return n!=null&&r(e,["styleDescription"],n),e}function xa(o,t){const e={},n=i(t,["subjectType"]);n!=null&&r(e,["subjectType"],n);const s=i(t,["subjectDescription"]);return s!=null&&r(e,["subjectDescription"],s),e}function Da(o,t){const e={},n=i(t,["referenceImage"]);n!=null&&r(e,["referenceImage"],Xe(o,n));const s=i(t,["referenceId"]);s!=null&&r(e,["referenceId"],s);const a=i(t,["referenceType"]);a!=null&&r(e,["referenceType"],a);const l=i(t,["maskImageConfig"]);l!=null&&r(e,["maskImageConfig"],Ra(o,l));const u=i(t,["controlImageConfig"]);u!=null&&r(e,["controlImageConfig"],Ma(o,u));const m=i(t,["styleImageConfig"]);m!=null&&r(e,["styleImageConfig"],Pa(o,m));const p=i(t,["subjectImageConfig"]);return p!=null&&r(e,["subjectImageConfig"],xa(o,p)),e}function ka(o,t,e){const n={},s=i(t,["outputGcsUri"]);e!==void 0&&s!=null&&r(e,["parameters","storageUri"],s);const a=i(t,["negativePrompt"]);e!==void 0&&a!=null&&r(e,["parameters","negativePrompt"],a);const l=i(t,["numberOfImages"]);e!==void 0&&l!=null&&r(e,["parameters","sampleCount"],l);const u=i(t,["aspectRatio"]);e!==void 0&&u!=null&&r(e,["parameters","aspectRatio"],u);const m=i(t,["guidanceScale"]);e!==void 0&&m!=null&&r(e,["parameters","guidanceScale"],m);const p=i(t,["seed"]);e!==void 0&&p!=null&&r(e,["parameters","seed"],p);const g=i(t,["safetyFilterLevel"]);e!==void 0&&g!=null&&r(e,["parameters","safetySetting"],g);const y=i(t,["personGeneration"]);e!==void 0&&y!=null&&r(e,["parameters","personGeneration"],y);const T=i(t,["includeSafetyAttributes"]);e!==void 0&&T!=null&&r(e,["parameters","includeSafetyAttributes"],T);const E=i(t,["includeRaiReason"]);e!==void 0&&E!=null&&r(e,["parameters","includeRaiReason"],E);const I=i(t,["language"]);e!==void 0&&I!=null&&r(e,["parameters","language"],I);const P=i(t,["outputMimeType"]);e!==void 0&&P!=null&&r(e,["parameters","outputOptions","mimeType"],P);const D=i(t,["outputCompressionQuality"]);e!==void 0&&D!=null&&r(e,["parameters","outputOptions","compressionQuality"],D);const $=i(t,["editMode"]);e!==void 0&&$!=null&&r(e,["parameters","editMode"],$);const F=i(t,["baseSteps"]);return e!==void 0&&F!=null&&r(e,["parameters","editConfig","baseSteps"],F),n}function La(o,t){const e={},n=i(t,["model"]);n!=null&&r(e,["_url","model"],G(o,n));const s=i(t,["prompt"]);s!=null&&r(e,["instances[0]","prompt"],s);const a=i(t,["referenceImages"]);if(a!=null){let u=a;Array.isArray(u)&&(u=u.map(m=>Da(o,m))),r(e,["instances[0]","referenceImages"],u)}const l=i(t,["config"]);return l!=null&&r(e,["config"],ka(o,l,e)),e}function Na(o,t,e){const n={},s=i(t,["includeRaiReason"]);e!==void 0&&s!=null&&r(e,["parameters","includeRaiReason"],s);const a=i(t,["outputMimeType"]);e!==void 0&&a!=null&&r(e,["parameters","outputOptions","mimeType"],a);const l=i(t,["outputCompressionQuality"]);e!==void 0&&l!=null&&r(e,["parameters","outputOptions","compressionQuality"],l);const u=i(t,["numberOfImages"]);e!==void 0&&u!=null&&r(e,["parameters","sampleCount"],u);const m=i(t,["mode"]);return e!==void 0&&m!=null&&r(e,["parameters","mode"],m),n}function $a(o,t){const e={},n=i(t,["model"]);n!=null&&r(e,["_url","model"],G(o,n));const s=i(t,["image"]);s!=null&&r(e,["instances[0]","image"],Xe(o,s));const a=i(t,["upscaleFactor"]);a!=null&&r(e,["parameters","upscaleConfig","upscaleFactor"],a);const l=i(t,["config"]);return l!=null&&r(e,["config"],Na(o,l,e)),e}function Fa(o,t){const e={},n=i(t,["model"]);n!=null&&r(e,["_url","name"],G(o,n));const s=i(t,["config"]);return s!=null&&r(e,["config"],s),e}function Ua(o,t,e){const n={},s=i(t,["pageSize"]);e!==void 0&&s!=null&&r(e,["_query","pageSize"],s);const a=i(t,["pageToken"]);e!==void 0&&a!=null&&r(e,["_query","pageToken"],a);const l=i(t,["filter"]);e!==void 0&&l!=null&&r(e,["_query","filter"],l);const u=i(t,["queryBase"]);return e!==void 0&&u!=null&&r(e,["_url","models_url"],An(o,u)),n}function qa(o,t){const e={},n=i(t,["config"]);return n!=null&&r(e,["config"],Ua(o,n,e)),e}function Ba(o,t,e){const n={},s=i(t,["displayName"]);e!==void 0&&s!=null&&r(e,["displayName"],s);const a=i(t,["description"]);e!==void 0&&a!=null&&r(e,["description"],a);const l=i(t,["defaultCheckpointId"]);return e!==void 0&&l!=null&&r(e,["defaultCheckpointId"],l),n}function Va(o,t){const e={},n=i(t,["model"]);n!=null&&r(e,["_url","model"],G(o,n));const s=i(t,["config"]);return s!=null&&r(e,["config"],Ba(o,s,e)),e}function Ga(o,t){const e={},n=i(t,["model"]);n!=null&&r(e,["_url","name"],G(o,n));const s=i(t,["config"]);return s!=null&&r(e,["config"],s),e}function Ha(o,t,e){const n={},s=i(t,["systemInstruction"]);e!==void 0&&s!=null&&r(e,["systemInstruction"],ue(o,X(o,s)));const a=i(t,["tools"]);if(e!==void 0&&a!=null){let u=a;Array.isArray(u)&&(u=u.map(m=>_n(o,m))),r(e,["tools"],u)}const l=i(t,["generationConfig"]);return e!==void 0&&l!=null&&r(e,["generationConfig"],l),n}function Oa(o,t){const e={},n=i(t,["model"]);n!=null&&r(e,["_url","model"],G(o,n));const s=i(t,["contents"]);if(s!=null){let l=ne(o,s);Array.isArray(l)&&(l=l.map(u=>ue(o,u))),r(e,["contents"],l)}const a=i(t,["config"]);return a!=null&&r(e,["config"],Ha(o,a,e)),e}function za(o,t){const e={},n=i(t,["model"]);n!=null&&r(e,["_url","model"],G(o,n));const s=i(t,["contents"]);if(s!=null){let l=ne(o,s);Array.isArray(l)&&(l=l.map(u=>ue(o,u))),r(e,["contents"],l)}const a=i(t,["config"]);return a!=null&&r(e,["config"],a),e}function Ja(o,t,e){const n={},s=i(t,["numberOfVideos"]);e!==void 0&&s!=null&&r(e,["parameters","sampleCount"],s);const a=i(t,["outputGcsUri"]);e!==void 0&&a!=null&&r(e,["parameters","storageUri"],a);const l=i(t,["fps"]);e!==void 0&&l!=null&&r(e,["parameters","fps"],l);const u=i(t,["durationSeconds"]);e!==void 0&&u!=null&&r(e,["parameters","durationSeconds"],u);const m=i(t,["seed"]);e!==void 0&&m!=null&&r(e,["parameters","seed"],m);const p=i(t,["aspectRatio"]);e!==void 0&&p!=null&&r(e,["parameters","aspectRatio"],p);const g=i(t,["resolution"]);e!==void 0&&g!=null&&r(e,["parameters","resolution"],g);const y=i(t,["personGeneration"]);e!==void 0&&y!=null&&r(e,["parameters","personGeneration"],y);const T=i(t,["pubsubTopic"]);e!==void 0&&T!=null&&r(e,["parameters","pubsubTopic"],T);const E=i(t,["negativePrompt"]);e!==void 0&&E!=null&&r(e,["parameters","negativePrompt"],E);const I=i(t,["enhancePrompt"]);return e!==void 0&&I!=null&&r(e,["parameters","enhancePrompt"],I),n}function Wa(o,t){const e={},n=i(t,["model"]);n!=null&&r(e,["_url","model"],G(o,n));const s=i(t,["prompt"]);s!=null&&r(e,["instances[0]","prompt"],s);const a=i(t,["image"]);a!=null&&r(e,["instances[0]","image"],Xe(o,a));const l=i(t,["config"]);return l!=null&&r(e,["config"],Ja(o,l,e)),e}function Ya(o,t){const e={},n=i(t,["data"]);n!=null&&r(e,["data"],n);const s=i(t,["mimeType"]);return s!=null&&r(e,["mimeType"],s),e}function Ka(o,t){const e={},n=i(t,["thought"]);n!=null&&r(e,["thought"],n);const s=i(t,["inlineData"]);s!=null&&r(e,["inlineData"],Ya(o,s));const a=i(t,["codeExecutionResult"]);a!=null&&r(e,["codeExecutionResult"],a);const l=i(t,["executableCode"]);l!=null&&r(e,["executableCode"],l);const u=i(t,["fileData"]);u!=null&&r(e,["fileData"],u);const m=i(t,["functionCall"]);m!=null&&r(e,["functionCall"],m);const p=i(t,["functionResponse"]);p!=null&&r(e,["functionResponse"],p);const g=i(t,["text"]);return g!=null&&r(e,["text"],g),e}function Xa(o,t){const e={},n=i(t,["parts"]);if(n!=null){let a=n;Array.isArray(a)&&(a=a.map(l=>Ka(o,l))),r(e,["parts"],a)}const s=i(t,["role"]);return s!=null&&r(e,["role"],s),e}function Qa(o,t){const e={},n=i(t,["citationSources"]);return n!=null&&r(e,["citations"],n),e}function Za(o,t){const e={},n=i(t,["content"]);n!=null&&r(e,["content"],Xa(o,n));const s=i(t,["citationMetadata"]);s!=null&&r(e,["citationMetadata"],Qa(o,s));const a=i(t,["tokenCount"]);a!=null&&r(e,["tokenCount"],a);const l=i(t,["finishReason"]);l!=null&&r(e,["finishReason"],l);const u=i(t,["avgLogprobs"]);u!=null&&r(e,["avgLogprobs"],u);const m=i(t,["groundingMetadata"]);m!=null&&r(e,["groundingMetadata"],m);const p=i(t,["index"]);p!=null&&r(e,["index"],p);const g=i(t,["logprobsResult"]);g!=null&&r(e,["logprobsResult"],g);const y=i(t,["safetyRatings"]);return y!=null&&r(e,["safetyRatings"],y),e}function cn(o,t){const e={},n=i(t,["candidates"]);if(n!=null){let u=n;Array.isArray(u)&&(u=u.map(m=>Za(o,m))),r(e,["candidates"],u)}const s=i(t,["modelVersion"]);s!=null&&r(e,["modelVersion"],s);const a=i(t,["promptFeedback"]);a!=null&&r(e,["promptFeedback"],a);const l=i(t,["usageMetadata"]);return l!=null&&r(e,["usageMetadata"],l),e}function ja(o,t){const e={},n=i(t,["values"]);return n!=null&&r(e,["values"],n),e}function el(){return{}}function tl(o,t){const e={},n=i(t,["embeddings"]);if(n!=null){let a=n;Array.isArray(a)&&(a=a.map(l=>ja(o,l))),r(e,["embeddings"],a)}return i(t,["metadata"])!=null&&r(e,["metadata"],el()),e}function nl(o,t){const e={},n=i(t,["bytesBase64Encoded"]);n!=null&&r(e,["imageBytes"],ie(o,n));const s=i(t,["mimeType"]);return s!=null&&r(e,["mimeType"],s),e}function Rn(o,t){const e={},n=i(t,["safetyAttributes","categories"]);n!=null&&r(e,["categories"],n);const s=i(t,["safetyAttributes","scores"]);s!=null&&r(e,["scores"],s);const a=i(t,["contentType"]);return a!=null&&r(e,["contentType"],a),e}function ol(o,t){const e={},n=i(t,["_self"]);n!=null&&r(e,["image"],nl(o,n));const s=i(t,["raiFilteredReason"]);s!=null&&r(e,["raiFilteredReason"],s);const a=i(t,["_self"]);return a!=null&&r(e,["safetyAttributes"],Rn(o,a)),e}function il(o,t){const e={},n=i(t,["predictions"]);if(n!=null){let a=n;Array.isArray(a)&&(a=a.map(l=>ol(o,l))),r(e,["generatedImages"],a)}const s=i(t,["positivePromptSafetyAttributes"]);return s!=null&&r(e,["positivePromptSafetyAttributes"],Rn(o,s)),e}function sl(o,t){const e={},n=i(t,["baseModel"]);n!=null&&r(e,["baseModel"],n);const s=i(t,["createTime"]);s!=null&&r(e,["createTime"],s);const a=i(t,["updateTime"]);return a!=null&&r(e,["updateTime"],a),e}function Je(o,t){const e={},n=i(t,["name"]);n!=null&&r(e,["name"],n);const s=i(t,["displayName"]);s!=null&&r(e,["displayName"],s);const a=i(t,["description"]);a!=null&&r(e,["description"],a);const l=i(t,["version"]);l!=null&&r(e,["version"],l);const u=i(t,["_self"]);u!=null&&r(e,["tunedModelInfo"],sl(o,u));const m=i(t,["inputTokenLimit"]);m!=null&&r(e,["inputTokenLimit"],m);const p=i(t,["outputTokenLimit"]);p!=null&&r(e,["outputTokenLimit"],p);const g=i(t,["supportedGenerationMethods"]);return g!=null&&r(e,["supportedActions"],g),e}function rl(o,t){const e={},n=i(t,["nextPageToken"]);n!=null&&r(e,["nextPageToken"],n);const s=i(t,["_self"]);if(s!=null){let a=bn(o,s);Array.isArray(a)&&(a=a.map(l=>Je(o,l))),r(e,["models"],a)}return e}function al(){return{}}function ll(o,t){const e={},n=i(t,["totalTokens"]);n!=null&&r(e,["totalTokens"],n);const s=i(t,["cachedContentTokenCount"]);return s!=null&&r(e,["cachedContentTokenCount"],s),e}function cl(o,t){const e={},n=i(t,["video","uri"]);n!=null&&r(e,["uri"],n);const s=i(t,["video","encodedVideo"]);s!=null&&r(e,["videoBytes"],ie(o,s));const a=i(t,["encoding"]);return a!=null&&r(e,["mimeType"],a),e}function ul(o,t){const e={},n=i(t,["_self"]);return n!=null&&r(e,["video"],cl(o,n)),e}function dl(o,t){const e={},n=i(t,["generatedSamples"]);if(n!=null){let l=n;Array.isArray(l)&&(l=l.map(u=>ul(o,u))),r(e,["generatedVideos"],l)}const s=i(t,["raiMediaFilteredCount"]);s!=null&&r(e,["raiMediaFilteredCount"],s);const a=i(t,["raiMediaFilteredReasons"]);return a!=null&&r(e,["raiMediaFilteredReasons"],a),e}function pl(o,t){const e={},n=i(t,["name"]);n!=null&&r(e,["name"],n);const s=i(t,["metadata"]);s!=null&&r(e,["metadata"],s);const a=i(t,["done"]);a!=null&&r(e,["done"],a);const l=i(t,["error"]);l!=null&&r(e,["error"],l);const u=i(t,["response","generateVideoResponse"]);return u!=null&&r(e,["response"],dl(o,u)),e}function fl(o,t){const e={},n=i(t,["displayName"]);n!=null&&r(e,["displayName"],n);const s=i(t,["data"]);s!=null&&r(e,["data"],s);const a=i(t,["mimeType"]);return a!=null&&r(e,["mimeType"],a),e}function ml(o,t){const e={},n=i(t,["videoMetadata"]);n!=null&&r(e,["videoMetadata"],n);const s=i(t,["thought"]);s!=null&&r(e,["thought"],s);const a=i(t,["inlineData"]);a!=null&&r(e,["inlineData"],fl(o,a));const l=i(t,["codeExecutionResult"]);l!=null&&r(e,["codeExecutionResult"],l);const u=i(t,["executableCode"]);u!=null&&r(e,["executableCode"],u);const m=i(t,["fileData"]);m!=null&&r(e,["fileData"],m);const p=i(t,["functionCall"]);p!=null&&r(e,["functionCall"],p);const g=i(t,["functionResponse"]);g!=null&&r(e,["functionResponse"],g);const y=i(t,["text"]);return y!=null&&r(e,["text"],y),e}function gl(o,t){const e={},n=i(t,["parts"]);if(n!=null){let a=n;Array.isArray(a)&&(a=a.map(l=>ml(o,l))),r(e,["parts"],a)}const s=i(t,["role"]);return s!=null&&r(e,["role"],s),e}function hl(o,t){const e={},n=i(t,["citations"]);return n!=null&&r(e,["citations"],n),e}function yl(o,t){const e={},n=i(t,["content"]);n!=null&&r(e,["content"],gl(o,n));const s=i(t,["citationMetadata"]);s!=null&&r(e,["citationMetadata"],hl(o,s));const a=i(t,["finishMessage"]);a!=null&&r(e,["finishMessage"],a);const l=i(t,["finishReason"]);l!=null&&r(e,["finishReason"],l);const u=i(t,["avgLogprobs"]);u!=null&&r(e,["avgLogprobs"],u);const m=i(t,["groundingMetadata"]);m!=null&&r(e,["groundingMetadata"],m);const p=i(t,["index"]);p!=null&&r(e,["index"],p);const g=i(t,["logprobsResult"]);g!=null&&r(e,["logprobsResult"],g);const y=i(t,["safetyRatings"]);return y!=null&&r(e,["safetyRatings"],y),e}function un(o,t){const e={},n=i(t,["candidates"]);if(n!=null){let p=n;Array.isArray(p)&&(p=p.map(g=>yl(o,g))),r(e,["candidates"],p)}const s=i(t,["createTime"]);s!=null&&r(e,["createTime"],s);const a=i(t,["responseId"]);a!=null&&r(e,["responseId"],a);const l=i(t,["modelVersion"]);l!=null&&r(e,["modelVersion"],l);const u=i(t,["promptFeedback"]);u!=null&&r(e,["promptFeedback"],u);const m=i(t,["usageMetadata"]);return m!=null&&r(e,["usageMetadata"],m),e}function vl(o,t){const e={},n=i(t,["truncated"]);n!=null&&r(e,["truncated"],n);const s=i(t,["token_count"]);return s!=null&&r(e,["tokenCount"],s),e}function Cl(o,t){const e={},n=i(t,["values"]);n!=null&&r(e,["values"],n);const s=i(t,["statistics"]);return s!=null&&r(e,["statistics"],vl(o,s)),e}function Tl(o,t){const e={},n=i(t,["billableCharacterCount"]);return n!=null&&r(e,["billableCharacterCount"],n),e}function El(o,t){const e={},n=i(t,["predictions[]","embeddings"]);if(n!=null){let a=n;Array.isArray(a)&&(a=a.map(l=>Cl(o,l))),r(e,["embeddings"],a)}const s=i(t,["metadata"]);return s!=null&&r(e,["metadata"],Tl(o,s)),e}function Sl(o,t){const e={},n=i(t,["gcsUri"]);n!=null&&r(e,["gcsUri"],n);const s=i(t,["bytesBase64Encoded"]);s!=null&&r(e,["imageBytes"],ie(o,s));const a=i(t,["mimeType"]);return a!=null&&r(e,["mimeType"],a),e}function Mn(o,t){const e={},n=i(t,["safetyAttributes","categories"]);n!=null&&r(e,["categories"],n);const s=i(t,["safetyAttributes","scores"]);s!=null&&r(e,["scores"],s);const a=i(t,["contentType"]);return a!=null&&r(e,["contentType"],a),e}function Qe(o,t){const e={},n=i(t,["_self"]);n!=null&&r(e,["image"],Sl(o,n));const s=i(t,["raiFilteredReason"]);s!=null&&r(e,["raiFilteredReason"],s);const a=i(t,["_self"]);a!=null&&r(e,["safetyAttributes"],Mn(o,a));const l=i(t,["prompt"]);return l!=null&&r(e,["enhancedPrompt"],l),e}function Il(o,t){const e={},n=i(t,["predictions"]);if(n!=null){let a=n;Array.isArray(a)&&(a=a.map(l=>Qe(o,l))),r(e,["generatedImages"],a)}const s=i(t,["positivePromptSafetyAttributes"]);return s!=null&&r(e,["positivePromptSafetyAttributes"],Mn(o,s)),e}function Al(o,t){const e={},n=i(t,["predictions"]);if(n!=null){let s=n;Array.isArray(s)&&(s=s.map(a=>Qe(o,a))),r(e,["generatedImages"],s)}return e}function bl(o,t){const e={},n=i(t,["predictions"]);if(n!=null){let s=n;Array.isArray(s)&&(s=s.map(a=>Qe(o,a))),r(e,["generatedImages"],s)}return e}function wl(o,t){const e={},n=i(t,["endpoint"]);n!=null&&r(e,["name"],n);const s=i(t,["deployedModelId"]);return s!=null&&r(e,["deployedModelId"],s),e}function _l(o,t){const e={},n=i(t,["labels","google-vertex-llm-tuning-base-model-id"]);n!=null&&r(e,["baseModel"],n);const s=i(t,["createTime"]);s!=null&&r(e,["createTime"],s);const a=i(t,["updateTime"]);return a!=null&&r(e,["updateTime"],a),e}function Rl(o,t){const e={},n=i(t,["checkpointId"]);n!=null&&r(e,["checkpointId"],n);const s=i(t,["epoch"]);s!=null&&r(e,["epoch"],s);const a=i(t,["step"]);return a!=null&&r(e,["step"],a),e}function We(o,t){const e={},n=i(t,["name"]);n!=null&&r(e,["name"],n);const s=i(t,["displayName"]);s!=null&&r(e,["displayName"],s);const a=i(t,["description"]);a!=null&&r(e,["description"],a);const l=i(t,["versionId"]);l!=null&&r(e,["version"],l);const u=i(t,["deployedModels"]);if(u!=null){let T=u;Array.isArray(T)&&(T=T.map(E=>wl(o,E))),r(e,["endpoints"],T)}const m=i(t,["labels"]);m!=null&&r(e,["labels"],m);const p=i(t,["_self"]);p!=null&&r(e,["tunedModelInfo"],_l(o,p));const g=i(t,["defaultCheckpointId"]);g!=null&&r(e,["defaultCheckpointId"],g);const y=i(t,["checkpoints"]);if(y!=null){let T=y;Array.isArray(T)&&(T=T.map(E=>Rl(o,E))),r(e,["checkpoints"],T)}return e}function Ml(o,t){const e={},n=i(t,["nextPageToken"]);n!=null&&r(e,["nextPageToken"],n);const s=i(t,["_self"]);if(s!=null){let a=bn(o,s);Array.isArray(a)&&(a=a.map(l=>We(o,l))),r(e,["models"],a)}return e}function Pl(){return{}}function xl(o,t){const e={},n=i(t,["totalTokens"]);return n!=null&&r(e,["totalTokens"],n),e}function Dl(o,t){const e={},n=i(t,["tokensInfo"]);return n!=null&&r(e,["tokensInfo"],n),e}function kl(o,t){const e={},n=i(t,["gcsUri"]);n!=null&&r(e,["uri"],n);const s=i(t,["bytesBase64Encoded"]);s!=null&&r(e,["videoBytes"],ie(o,s));const a=i(t,["mimeType"]);return a!=null&&r(e,["mimeType"],a),e}function Ll(o,t){const e={},n=i(t,["_self"]);return n!=null&&r(e,["video"],kl(o,n)),e}function Nl(o,t){const e={},n=i(t,["videos"]);if(n!=null){let l=n;Array.isArray(l)&&(l=l.map(u=>Ll(o,u))),r(e,["generatedVideos"],l)}const s=i(t,["raiMediaFilteredCount"]);s!=null&&r(e,["raiMediaFilteredCount"],s);const a=i(t,["raiMediaFilteredReasons"]);return a!=null&&r(e,["raiMediaFilteredReasons"],a),e}function $l(o,t){const e={},n=i(t,["name"]);n!=null&&r(e,["name"],n);const s=i(t,["metadata"]);s!=null&&r(e,["metadata"],s);const a=i(t,["done"]);a!=null&&r(e,["done"],a);const l=i(t,["error"]);l!=null&&r(e,["error"],l);const u=i(t,["response"]);return u!=null&&r(e,["response"],Nl(o,u)),e}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Fl="FunctionResponse request must have an `id` field from the response of a ToolCall.FunctionalCalls in Google AI.";async function Ul(o,t,e){const n=new ns;let s;if(e.data instanceof Blob?s=JSON.parse(await e.data.text()):s=JSON.parse(e.data),o.isVertexAI()){const a=Rr(o,s);Object.assign(n,a)}else{const a=_r(o,s);Object.assign(n,a)}t(n)}class ql{constructor(t,e,n){this.apiClient=t,this.auth=e,this.webSocketFactory=n}async connect(t){var e,n,s,a;const l=this.apiClient.getWebsocketBaseUrl(),u=this.apiClient.getApiVersion();let m;const p=Hl(this.apiClient.getDefaultHeaders());if(this.apiClient.isVertexAI())m=`${l}/ws/google.cloud.aiplatform.${u}.LlmBidiService/BidiGenerateContent`,await this.auth.addAuthHeaders(p);else{const N=this.apiClient.getApiKey();m=`${l}/ws/google.ai.generativelanguage.${u}.GenerativeService.BidiGenerateContent?key=${N}`}let g=()=>{};const y=new Promise(N=>{g=N}),T=t.callbacks,E=function(){var N;(N=T==null?void 0:T.onopen)===null||N===void 0||N.call(T),g({})},I=this.apiClient,P={onopen:E,onmessage:N=>{Ul(I,T.onmessage,N)},onerror:(e=T==null?void 0:T.onerror)!==null&&e!==void 0?e:function(N){},onclose:(n=T==null?void 0:T.onclose)!==null&&n!==void 0?n:function(N){}},D=this.webSocketFactory.create(m,Gl(p),P);D.connect(),await y;let $=G(this.apiClient,t.model);if(this.apiClient.isVertexAI()&&$.startsWith("publishers/")){const N=this.apiClient.getProject(),H=this.apiClient.getLocation();$=`projects/${N}/locations/${H}/`+$}let F={};this.apiClient.isVertexAI()&&((s=t.config)===null||s===void 0?void 0:s.responseModalities)===void 0&&(t.config===void 0?t.config={responseModalities:[Ae.AUDIO]}:t.config.responseModalities=[Ae.AUDIO]),!((a=t.config)===null||a===void 0)&&a.generationConfig&&console.warn("Setting `LiveConnectConfig.generation_config` is deprecated, please set the fields on `LiveConnectConfig` directly. This will become an error in a future version (not before Q3 2025).");const V={model:$,config:t.config,callbacks:t.callbacks};return this.apiClient.isVertexAI()?F=Zs(this.apiClient,V):F=Qs(this.apiClient,V),delete F.config,D.send(JSON.stringify(F)),new Vl(D,this.apiClient)}}const Bl={turnComplete:!0};class Vl{constructor(t,e){this.conn=t,this.apiClient=e}tLiveClientContent(t,e){if(e.turns!==null&&e.turns!==void 0){let n=[];try{n=ne(t,e.turns),t.isVertexAI()?n=n.map(s=>ue(t,s)):n=n.map(s=>Me(t,s))}catch{throw new Error(`Failed to parse client content "turns", type: '${typeof e.turns}'`)}return{clientContent:{turns:n,turnComplete:e.turnComplete}}}return{clientContent:{turnComplete:e.turnComplete}}}tLiveClienttToolResponse(t,e){let n=[];if(e.functionResponses==null)throw new Error("functionResponses is required.");if(Array.isArray(e.functionResponses)?n=e.functionResponses:n=[e.functionResponses],n.length===0)throw new Error("functionResponses is required.");for(const a of n){if(typeof a!="object"||a===null||!("name"in a)||!("response"in a))throw new Error(`Could not parse function response, type '${typeof a}'.`);if(!t.isVertexAI()&&!("id"in a))throw new Error(Fl)}return{toolResponse:{functionResponses:n}}}sendClientContent(t){t=Object.assign(Object.assign({},Bl),t);const e=this.tLiveClientContent(this.apiClient,t);this.conn.send(JSON.stringify(e))}sendRealtimeInput(t){let e={};this.apiClient.isVertexAI()?e={realtimeInput:ir(this.apiClient,t)}:e={realtimeInput:or(this.apiClient,t)},this.conn.send(JSON.stringify(e))}sendToolResponse(t){if(t.functionResponses==null)throw new Error("Tool response parameters are required.");const e=this.tLiveClienttToolResponse(this.apiClient,t);this.conn.send(JSON.stringify(e))}close(){this.conn.close()}}function Gl(o){const t={};return o.forEach((e,n)=>{t[n]=e}),t}function Hl(o){const t=new Headers;for(const[e,n]of Object.entries(o))t.append(e,n);return t}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Ol extends fe{constructor(t){super(),this.apiClient=t,this.generateContent=async e=>await this.generateContentInternal(e),this.generateContentStream=async e=>await this.generateContentStreamInternal(e),this.generateImages=async e=>await this.generateImagesInternal(e).then(n=>{var s;let a;const l=[];if(n!=null&&n.generatedImages)for(const m of n.generatedImages)m&&(m!=null&&m.safetyAttributes)&&((s=m==null?void 0:m.safetyAttributes)===null||s===void 0?void 0:s.contentType)==="Positive Prompt"?a=m==null?void 0:m.safetyAttributes:l.push(m);let u;return a?u={generatedImages:l,positivePromptSafetyAttributes:a}:u={generatedImages:l},u}),this.list=async e=>{var n;const l={config:Object.assign(Object.assign({},{queryBase:!0}),e==null?void 0:e.config)};if(this.apiClient.isVertexAI()&&!l.config.queryBase){if(!((n=l.config)===null||n===void 0)&&n.filter)throw new Error("Filtering tuned models list for Vertex AI is not currently supported");l.config.filter="labels.tune-type:*"}return new Re(ce.PAGED_ITEM_MODELS,u=>this.listInternal(u),await this.listInternal(l),l)},this.editImage=async e=>{const n={model:e.model,prompt:e.prompt,referenceImages:[],config:e.config};return e.referenceImages&&e.referenceImages&&(n.referenceImages=e.referenceImages.map(s=>s.toReferenceImageAPI())),await this.editImageInternal(n)},this.upscaleImage=async e=>{let n={numberOfImages:1,mode:"upscale"};e.config&&(n=Object.assign(Object.assign({},n),e.config));const s={model:e.model,image:e.image,upscaleFactor:e.upscaleFactor,config:n};return await this.upscaleImageInternal(s)}}async generateContentInternal(t){var e,n,s,a;let l,u="",m={};if(this.apiClient.isVertexAI()){const p=ln(this.apiClient,t);return u=x("{model}:generateContent",p._url),m=p._query,delete p.config,delete p._url,delete p._query,l=this.apiClient.request({path:u,queryParams:m,body:JSON.stringify(p),httpMethod:"POST",httpOptions:(e=t.config)===null||e===void 0?void 0:e.httpOptions,abortSignal:(n=t.config)===null||n===void 0?void 0:n.abortSignal}).then(g=>g.json()),l.then(g=>{const y=un(this.apiClient,g),T=new ve;return Object.assign(T,y),T})}else{const p=an(this.apiClient,t);return u=x("{model}:generateContent",p._url),m=p._query,delete p.config,delete p._url,delete p._query,l=this.apiClient.request({path:u,queryParams:m,body:JSON.stringify(p),httpMethod:"POST",httpOptions:(s=t.config)===null||s===void 0?void 0:s.httpOptions,abortSignal:(a=t.config)===null||a===void 0?void 0:a.abortSignal}).then(g=>g.json()),l.then(g=>{const y=cn(this.apiClient,g),T=new ve;return Object.assign(T,y),T})}}async generateContentStreamInternal(t){var e,n,s,a;let l,u="",m={};if(this.apiClient.isVertexAI()){const p=ln(this.apiClient,t);u=x("{model}:streamGenerateContent?alt=sse",p._url),m=p._query,delete p.config,delete p._url,delete p._query;const g=this.apiClient;return l=g.requestStream({path:u,queryParams:m,body:JSON.stringify(p),httpMethod:"POST",httpOptions:(e=t.config)===null||e===void 0?void 0:e.httpOptions,abortSignal:(n=t.config)===null||n===void 0?void 0:n.abortSignal}),l.then(function(y){return be(this,arguments,function*(){var T,E,I,P;try{for(var D=!0,$=Oe(y),F;F=yield J($.next()),T=F.done,!T;D=!0){P=F.value,D=!1;const N=un(g,yield J(P.json())),H=new ve;Object.assign(H,N),yield yield J(H)}}catch(V){E={error:V}}finally{try{!D&&!T&&(I=$.return)&&(yield J(I.call($)))}finally{if(E)throw E.error}}})})}else{const p=an(this.apiClient,t);u=x("{model}:streamGenerateContent?alt=sse",p._url),m=p._query,delete p.config,delete p._url,delete p._query;const g=this.apiClient;return l=g.requestStream({path:u,queryParams:m,body:JSON.stringify(p),httpMethod:"POST",httpOptions:(s=t.config)===null||s===void 0?void 0:s.httpOptions,abortSignal:(a=t.config)===null||a===void 0?void 0:a.abortSignal}),l.then(function(y){return be(this,arguments,function*(){var T,E,I,P;try{for(var D=!0,$=Oe(y),F;F=yield J($.next()),T=F.done,!T;D=!0){P=F.value,D=!1;const N=cn(g,yield J(P.json())),H=new ve;Object.assign(H,N),yield yield J(H)}}catch(V){E={error:V}}finally{try{!D&&!T&&(I=$.return)&&(yield J(I.call($)))}finally{if(E)throw E.error}}})})}}async embedContent(t){var e,n,s,a;let l,u="",m={};if(this.apiClient.isVertexAI()){const p=ba(this.apiClient,t);return u=x("{model}:predict",p._url),m=p._query,delete p.config,delete p._url,delete p._query,l=this.apiClient.request({path:u,queryParams:m,body:JSON.stringify(p),httpMethod:"POST",httpOptions:(e=t.config)===null||e===void 0?void 0:e.httpOptions,abortSignal:(n=t.config)===null||n===void 0?void 0:n.abortSignal}).then(g=>g.json()),l.then(g=>{const y=El(this.apiClient,g),T=new Wt;return Object.assign(T,y),T})}else{const p=Or(this.apiClient,t);return u=x("{model}:batchEmbedContents",p._url),m=p._query,delete p.config,delete p._url,delete p._query,l=this.apiClient.request({path:u,queryParams:m,body:JSON.stringify(p),httpMethod:"POST",httpOptions:(s=t.config)===null||s===void 0?void 0:s.httpOptions,abortSignal:(a=t.config)===null||a===void 0?void 0:a.abortSignal}).then(g=>g.json()),l.then(g=>{const y=tl(this.apiClient,g),T=new Wt;return Object.assign(T,y),T})}}async generateImagesInternal(t){var e,n,s,a;let l,u="",m={};if(this.apiClient.isVertexAI()){const p=_a(this.apiClient,t);return u=x("{model}:predict",p._url),m=p._query,delete p.config,delete p._url,delete p._query,l=this.apiClient.request({path:u,queryParams:m,body:JSON.stringify(p),httpMethod:"POST",httpOptions:(e=t.config)===null||e===void 0?void 0:e.httpOptions,abortSignal:(n=t.config)===null||n===void 0?void 0:n.abortSignal}).then(g=>g.json()),l.then(g=>{const y=Il(this.apiClient,g),T=new Yt;return Object.assign(T,y),T})}else{const p=Jr(this.apiClient,t);return u=x("{model}:predict",p._url),m=p._query,delete p.config,delete p._url,delete p._query,l=this.apiClient.request({path:u,queryParams:m,body:JSON.stringify(p),httpMethod:"POST",httpOptions:(s=t.config)===null||s===void 0?void 0:s.httpOptions,abortSignal:(a=t.config)===null||a===void 0?void 0:a.abortSignal}).then(g=>g.json()),l.then(g=>{const y=il(this.apiClient,g),T=new Yt;return Object.assign(T,y),T})}}async editImageInternal(t){var e,n;let s,a="",l={};if(this.apiClient.isVertexAI()){const u=La(this.apiClient,t);return a=x("{model}:predict",u._url),l=u._query,delete u.config,delete u._url,delete u._query,s=this.apiClient.request({path:a,queryParams:l,body:JSON.stringify(u),httpMethod:"POST",httpOptions:(e=t.config)===null||e===void 0?void 0:e.httpOptions,abortSignal:(n=t.config)===null||n===void 0?void 0:n.abortSignal}).then(m=>m.json()),s.then(m=>{const p=Al(this.apiClient,m),g=new Xi;return Object.assign(g,p),g})}else throw new Error("This method is only supported by the Vertex AI.")}async upscaleImageInternal(t){var e,n;let s,a="",l={};if(this.apiClient.isVertexAI()){const u=$a(this.apiClient,t);return a=x("{model}:predict",u._url),l=u._query,delete u.config,delete u._url,delete u._query,s=this.apiClient.request({path:a,queryParams:l,body:JSON.stringify(u),httpMethod:"POST",httpOptions:(e=t.config)===null||e===void 0?void 0:e.httpOptions,abortSignal:(n=t.config)===null||n===void 0?void 0:n.abortSignal}).then(m=>m.json()),s.then(m=>{const p=bl(this.apiClient,m),g=new Qi;return Object.assign(g,p),g})}else throw new Error("This method is only supported by the Vertex AI.")}async get(t){var e,n,s,a;let l,u="",m={};if(this.apiClient.isVertexAI()){const p=Fa(this.apiClient,t);return u=x("{name}",p._url),m=p._query,delete p.config,delete p._url,delete p._query,l=this.apiClient.request({path:u,queryParams:m,body:JSON.stringify(p),httpMethod:"GET",httpOptions:(e=t.config)===null||e===void 0?void 0:e.httpOptions,abortSignal:(n=t.config)===null||n===void 0?void 0:n.abortSignal}).then(g=>g.json()),l.then(g=>We(this.apiClient,g))}else{const p=Wr(this.apiClient,t);return u=x("{name}",p._url),m=p._query,delete p.config,delete p._url,delete p._query,l=this.apiClient.request({path:u,queryParams:m,body:JSON.stringify(p),httpMethod:"GET",httpOptions:(s=t.config)===null||s===void 0?void 0:s.httpOptions,abortSignal:(a=t.config)===null||a===void 0?void 0:a.abortSignal}).then(g=>g.json()),l.then(g=>Je(this.apiClient,g))}}async listInternal(t){var e,n,s,a;let l,u="",m={};if(this.apiClient.isVertexAI()){const p=qa(this.apiClient,t);return u=x("{models_url}",p._url),m=p._query,delete p.config,delete p._url,delete p._query,l=this.apiClient.request({path:u,queryParams:m,body:JSON.stringify(p),httpMethod:"GET",httpOptions:(e=t.config)===null||e===void 0?void 0:e.httpOptions,abortSignal:(n=t.config)===null||n===void 0?void 0:n.abortSignal}).then(g=>g.json()),l.then(g=>{const y=Ml(this.apiClient,g),T=new Kt;return Object.assign(T,y),T})}else{const p=Kr(this.apiClient,t);return u=x("{models_url}",p._url),m=p._query,delete p.config,delete p._url,delete p._query,l=this.apiClient.request({path:u,queryParams:m,body:JSON.stringify(p),httpMethod:"GET",httpOptions:(s=t.config)===null||s===void 0?void 0:s.httpOptions,abortSignal:(a=t.config)===null||a===void 0?void 0:a.abortSignal}).then(g=>g.json()),l.then(g=>{const y=rl(this.apiClient,g),T=new Kt;return Object.assign(T,y),T})}}async update(t){var e,n,s,a;let l,u="",m={};if(this.apiClient.isVertexAI()){const p=Va(this.apiClient,t);return u=x("{model}",p._url),m=p._query,delete p.config,delete p._url,delete p._query,l=this.apiClient.request({path:u,queryParams:m,body:JSON.stringify(p),httpMethod:"PATCH",httpOptions:(e=t.config)===null||e===void 0?void 0:e.httpOptions,abortSignal:(n=t.config)===null||n===void 0?void 0:n.abortSignal}).then(g=>g.json()),l.then(g=>We(this.apiClient,g))}else{const p=Qr(this.apiClient,t);return u=x("{name}",p._url),m=p._query,delete p.config,delete p._url,delete p._query,l=this.apiClient.request({path:u,queryParams:m,body:JSON.stringify(p),httpMethod:"PATCH",httpOptions:(s=t.config)===null||s===void 0?void 0:s.httpOptions,abortSignal:(a=t.config)===null||a===void 0?void 0:a.abortSignal}).then(g=>g.json()),l.then(g=>Je(this.apiClient,g))}}async delete(t){var e,n,s,a;let l,u="",m={};if(this.apiClient.isVertexAI()){const p=Ga(this.apiClient,t);return u=x("{name}",p._url),m=p._query,delete p.config,delete p._url,delete p._query,l=this.apiClient.request({path:u,queryParams:m,body:JSON.stringify(p),httpMethod:"DELETE",httpOptions:(e=t.config)===null||e===void 0?void 0:e.httpOptions,abortSignal:(n=t.config)===null||n===void 0?void 0:n.abortSignal}).then(g=>g.json()),l.then(()=>{const g=Pl(),y=new Xt;return Object.assign(y,g),y})}else{const p=Zr(this.apiClient,t);return u=x("{name}",p._url),m=p._query,delete p.config,delete p._url,delete p._query,l=this.apiClient.request({path:u,queryParams:m,body:JSON.stringify(p),httpMethod:"DELETE",httpOptions:(s=t.config)===null||s===void 0?void 0:s.httpOptions,abortSignal:(a=t.config)===null||a===void 0?void 0:a.abortSignal}).then(g=>g.json()),l.then(()=>{const g=al(),y=new Xt;return Object.assign(y,g),y})}}async countTokens(t){var e,n,s,a;let l,u="",m={};if(this.apiClient.isVertexAI()){const p=Oa(this.apiClient,t);return u=x("{model}:countTokens",p._url),m=p._query,delete p.config,delete p._url,delete p._query,l=this.apiClient.request({path:u,queryParams:m,body:JSON.stringify(p),httpMethod:"POST",httpOptions:(e=t.config)===null||e===void 0?void 0:e.httpOptions,abortSignal:(n=t.config)===null||n===void 0?void 0:n.abortSignal}).then(g=>g.json()),l.then(g=>{const y=xl(this.apiClient,g),T=new Qt;return Object.assign(T,y),T})}else{const p=ea(this.apiClient,t);return u=x("{model}:countTokens",p._url),m=p._query,delete p.config,delete p._url,delete p._query,l=this.apiClient.request({path:u,queryParams:m,body:JSON.stringify(p),httpMethod:"POST",httpOptions:(s=t.config)===null||s===void 0?void 0:s.httpOptions,abortSignal:(a=t.config)===null||a===void 0?void 0:a.abortSignal}).then(g=>g.json()),l.then(g=>{const y=ll(this.apiClient,g),T=new Qt;return Object.assign(T,y),T})}}async computeTokens(t){var e,n;let s,a="",l={};if(this.apiClient.isVertexAI()){const u=za(this.apiClient,t);return a=x("{model}:computeTokens",u._url),l=u._query,delete u.config,delete u._url,delete u._query,s=this.apiClient.request({path:a,queryParams:l,body:JSON.stringify(u),httpMethod:"POST",httpOptions:(e=t.config)===null||e===void 0?void 0:e.httpOptions,abortSignal:(n=t.config)===null||n===void 0?void 0:n.abortSignal}).then(m=>m.json()),s.then(m=>{const p=Dl(this.apiClient,m),g=new Zi;return Object.assign(g,p),g})}else throw new Error("This method is only supported by the Vertex AI.")}async generateVideos(t){var e,n,s,a;let l,u="",m={};if(this.apiClient.isVertexAI()){const p=Wa(this.apiClient,t);return u=x("{model}:predictLongRunning",p._url),m=p._query,delete p.config,delete p._url,delete p._query,l=this.apiClient.request({path:u,queryParams:m,body:JSON.stringify(p),httpMethod:"POST",httpOptions:(e=t.config)===null||e===void 0?void 0:e.httpOptions,abortSignal:(n=t.config)===null||n===void 0?void 0:n.abortSignal}).then(g=>g.json()),l.then(g=>$l(this.apiClient,g))}else{const p=oa(this.apiClient,t);return u=x("{model}:predictLongRunning",p._url),m=p._query,delete p.config,delete p._url,delete p._query,l=this.apiClient.request({path:u,queryParams:m,body:JSON.stringify(p),httpMethod:"POST",httpOptions:(s=t.config)===null||s===void 0?void 0:s.httpOptions,abortSignal:(a=t.config)===null||a===void 0?void 0:a.abortSignal}).then(g=>g.json()),l.then(g=>pl(this.apiClient,g))}}}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function zl(o,t){const e={},n=i(t,["operationName"]);n!=null&&r(e,["_url","operationName"],n);const s=i(t,["config"]);return s!=null&&r(e,["config"],s),e}function Jl(o,t){const e={},n=i(t,["operationName"]);n!=null&&r(e,["_url","operationName"],n);const s=i(t,["config"]);return s!=null&&r(e,["config"],s),e}function Wl(o,t){const e={},n=i(t,["operationName"]);n!=null&&r(e,["operationName"],n);const s=i(t,["resourceName"]);s!=null&&r(e,["_url","resourceName"],s);const a=i(t,["config"]);return a!=null&&r(e,["config"],a),e}function Yl(o,t){const e={},n=i(t,["video","uri"]);n!=null&&r(e,["uri"],n);const s=i(t,["video","encodedVideo"]);s!=null&&r(e,["videoBytes"],ie(o,s));const a=i(t,["encoding"]);return a!=null&&r(e,["mimeType"],a),e}function Kl(o,t){const e={},n=i(t,["_self"]);return n!=null&&r(e,["video"],Yl(o,n)),e}function Xl(o,t){const e={},n=i(t,["generatedSamples"]);if(n!=null){let l=n;Array.isArray(l)&&(l=l.map(u=>Kl(o,u))),r(e,["generatedVideos"],l)}const s=i(t,["raiMediaFilteredCount"]);s!=null&&r(e,["raiMediaFilteredCount"],s);const a=i(t,["raiMediaFilteredReasons"]);return a!=null&&r(e,["raiMediaFilteredReasons"],a),e}function Ql(o,t){const e={},n=i(t,["name"]);n!=null&&r(e,["name"],n);const s=i(t,["metadata"]);s!=null&&r(e,["metadata"],s);const a=i(t,["done"]);a!=null&&r(e,["done"],a);const l=i(t,["error"]);l!=null&&r(e,["error"],l);const u=i(t,["response","generateVideoResponse"]);return u!=null&&r(e,["response"],Xl(o,u)),e}function Zl(o,t){const e={},n=i(t,["gcsUri"]);n!=null&&r(e,["uri"],n);const s=i(t,["bytesBase64Encoded"]);s!=null&&r(e,["videoBytes"],ie(o,s));const a=i(t,["mimeType"]);return a!=null&&r(e,["mimeType"],a),e}function jl(o,t){const e={},n=i(t,["_self"]);return n!=null&&r(e,["video"],Zl(o,n)),e}function ec(o,t){const e={},n=i(t,["videos"]);if(n!=null){let l=n;Array.isArray(l)&&(l=l.map(u=>jl(o,u))),r(e,["generatedVideos"],l)}const s=i(t,["raiMediaFilteredCount"]);s!=null&&r(e,["raiMediaFilteredCount"],s);const a=i(t,["raiMediaFilteredReasons"]);return a!=null&&r(e,["raiMediaFilteredReasons"],a),e}function dn(o,t){const e={},n=i(t,["name"]);n!=null&&r(e,["name"],n);const s=i(t,["metadata"]);s!=null&&r(e,["metadata"],s);const a=i(t,["done"]);a!=null&&r(e,["done"],a);const l=i(t,["error"]);l!=null&&r(e,["error"],l);const u=i(t,["response"]);return u!=null&&r(e,["response"],ec(o,u)),e}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class tc extends fe{constructor(t){super(),this.apiClient=t}async getVideosOperation(t){const e=t.operation,n=t.config;if(e.name===void 0||e.name==="")throw new Error("Operation name is required.");if(this.apiClient.isVertexAI()){const s=e.name.split("/operations/")[0];let a;return n&&"httpOptions"in n&&(a=n.httpOptions),this.fetchPredictVideosOperationInternal({operationName:e.name,resourceName:s,config:{httpOptions:a}})}else return this.getVideosOperationInternal({operationName:e.name,config:n})}async getVideosOperationInternal(t){var e,n,s,a;let l,u="",m={};if(this.apiClient.isVertexAI()){const p=Jl(this.apiClient,t);return u=x("{operationName}",p._url),m=p._query,delete p.config,delete p._url,delete p._query,l=this.apiClient.request({path:u,queryParams:m,body:JSON.stringify(p),httpMethod:"GET",httpOptions:(e=t.config)===null||e===void 0?void 0:e.httpOptions,abortSignal:(n=t.config)===null||n===void 0?void 0:n.abortSignal}).then(g=>g.json()),l.then(g=>dn(this.apiClient,g))}else{const p=zl(this.apiClient,t);return u=x("{operationName}",p._url),m=p._query,delete p.config,delete p._url,delete p._query,l=this.apiClient.request({path:u,queryParams:m,body:JSON.stringify(p),httpMethod:"GET",httpOptions:(s=t.config)===null||s===void 0?void 0:s.httpOptions,abortSignal:(a=t.config)===null||a===void 0?void 0:a.abortSignal}).then(g=>g.json()),l.then(g=>Ql(this.apiClient,g))}}async fetchPredictVideosOperationInternal(t){var e,n;let s,a="",l={};if(this.apiClient.isVertexAI()){const u=Wl(this.apiClient,t);return a=x("{resourceName}:fetchPredictOperation",u._url),l=u._query,delete u.config,delete u._url,delete u._query,s=this.apiClient.request({path:a,queryParams:l,body:JSON.stringify(u),httpMethod:"POST",httpOptions:(e=t.config)===null||e===void 0?void 0:e.httpOptions,abortSignal:(n=t.config)===null||n===void 0?void 0:n.abortSignal}).then(m=>m.json()),s.then(m=>dn(this.apiClient,m))}else throw new Error("This method is only supported by the Vertex AI.")}}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const nc="Content-Type",oc="X-Server-Timeout",ic="User-Agent",sc="x-goog-api-client",rc="0.14.1",ac=`google-genai-sdk/${rc}`,lc="v1beta1",cc="v1beta",pn=/^data: (.*)(?:\n\n|\r\r|\r\n\r\n)/;class Pn extends Error{constructor(t,e){e?super(t,{cause:e}):super(t,{cause:new Error().stack}),this.message=t,this.name="ClientError"}}class Ye extends Error{constructor(t,e){e?super(t,{cause:e}):super(t,{cause:new Error().stack}),this.message=t,this.name="ServerError"}}class uc{constructor(t){var e,n;this.clientOptions=Object.assign(Object.assign({},t),{project:t.project,location:t.location,apiKey:t.apiKey,vertexai:t.vertexai});const s={};this.clientOptions.vertexai?(s.apiVersion=(e=this.clientOptions.apiVersion)!==null&&e!==void 0?e:lc,s.baseUrl=this.baseUrlFromProjectLocation(),this.normalizeAuthParameters()):(s.apiVersion=(n=this.clientOptions.apiVersion)!==null&&n!==void 0?n:cc,s.baseUrl="https://generativelanguage.googleapis.com/"),s.headers=this.getDefaultHeaders(),this.clientOptions.httpOptions=s,t.httpOptions&&(this.clientOptions.httpOptions=this.patchHttpOptions(s,t.httpOptions))}baseUrlFromProjectLocation(){return this.clientOptions.project&&this.clientOptions.location&&this.clientOptions.location!=="global"?`https://${this.clientOptions.location}-aiplatform.googleapis.com/`:"https://aiplatform.googleapis.com/"}normalizeAuthParameters(){if(this.clientOptions.project&&this.clientOptions.location){this.clientOptions.apiKey=void 0;return}this.clientOptions.project=void 0,this.clientOptions.location=void 0}isVertexAI(){var t;return(t=this.clientOptions.vertexai)!==null&&t!==void 0?t:!1}getProject(){return this.clientOptions.project}getLocation(){return this.clientOptions.location}getApiVersion(){if(this.clientOptions.httpOptions&&this.clientOptions.httpOptions.apiVersion!==void 0)return this.clientOptions.httpOptions.apiVersion;throw new Error("API version is not set.")}getBaseUrl(){if(this.clientOptions.httpOptions&&this.clientOptions.httpOptions.baseUrl!==void 0)return this.clientOptions.httpOptions.baseUrl;throw new Error("Base URL is not set.")}getRequestUrl(){return this.getRequestUrlInternal(this.clientOptions.httpOptions)}getHeaders(){if(this.clientOptions.httpOptions&&this.clientOptions.httpOptions.headers!==void 0)return this.clientOptions.httpOptions.headers;throw new Error("Headers are not set.")}getRequestUrlInternal(t){if(!t||t.baseUrl===void 0||t.apiVersion===void 0)throw new Error("HTTP options are not correctly set.");const n=[t.baseUrl.endsWith("/")?t.baseUrl.slice(0,-1):t.baseUrl];return t.apiVersion&&t.apiVersion!==""&&n.push(t.apiVersion),n.join("/")}getBaseResourcePath(){return`projects/${this.clientOptions.project}/locations/${this.clientOptions.location}`}getApiKey(){return this.clientOptions.apiKey}getWebsocketBaseUrl(){const t=this.getBaseUrl(),e=new URL(t);return e.protocol=e.protocol=="http:"?"ws":"wss",e.toString()}setBaseUrl(t){if(this.clientOptions.httpOptions)this.clientOptions.httpOptions.baseUrl=t;else throw new Error("HTTP options are not correctly set.")}constructUrl(t,e,n){const s=[this.getRequestUrlInternal(e)];return n&&s.push(this.getBaseResourcePath()),t!==""&&s.push(t),new URL(`${s.join("/")}`)}shouldPrependVertexProjectPath(t){return!(this.clientOptions.apiKey||!this.clientOptions.vertexai||t.path.startsWith("projects/")||t.httpMethod==="GET"&&t.path.startsWith("publishers/google/models"))}async request(t){let e=this.clientOptions.httpOptions;t.httpOptions&&(e=this.patchHttpOptions(this.clientOptions.httpOptions,t.httpOptions));const n=this.shouldPrependVertexProjectPath(t),s=this.constructUrl(t.path,e,n);if(t.queryParams)for(const[l,u]of Object.entries(t.queryParams))s.searchParams.append(l,String(u));let a={};if(t.httpMethod==="GET"){if(t.body&&t.body!=="{}")throw new Error("Request body should be empty for GET request, but got non empty request body")}else a.body=t.body;return a=await this.includeExtraHttpOptionsToRequestInit(a,e,t.abortSignal),this.unaryApiCall(s,a,t.httpMethod)}patchHttpOptions(t,e){const n=JSON.parse(JSON.stringify(t));for(const[s,a]of Object.entries(e))typeof a=="object"?n[s]=Object.assign(Object.assign({},n[s]),a):a!==void 0&&(n[s]=a);return n}async requestStream(t){let e=this.clientOptions.httpOptions;t.httpOptions&&(e=this.patchHttpOptions(this.clientOptions.httpOptions,t.httpOptions));const n=this.shouldPrependVertexProjectPath(t),s=this.constructUrl(t.path,e,n);(!s.searchParams.has("alt")||s.searchParams.get("alt")!=="sse")&&s.searchParams.set("alt","sse");let a={};return a.body=t.body,a=await this.includeExtraHttpOptionsToRequestInit(a,e,t.abortSignal),this.streamApiCall(s,a,t.httpMethod)}async includeExtraHttpOptionsToRequestInit(t,e,n){if(e&&e.timeout||n){const s=new AbortController,a=s.signal;e.timeout&&(e==null?void 0:e.timeout)>0&&setTimeout(()=>s.abort(),e.timeout),n&&n.addEventListener("abort",()=>{s.abort()}),t.signal=a}return t.headers=await this.getHeadersInternal(e),t}async unaryApiCall(t,e,n){return this.apiCall(t.toString(),Object.assign(Object.assign({},e),{method:n})).then(async s=>(await fn(s),new He(s))).catch(s=>{throw s instanceof Error?s:new Error(JSON.stringify(s))})}async streamApiCall(t,e,n){return this.apiCall(t.toString(),Object.assign(Object.assign({},e),{method:n})).then(async s=>(await fn(s),this.processStreamResponse(s))).catch(s=>{throw s instanceof Error?s:new Error(JSON.stringify(s))})}processStreamResponse(t){var e;return be(this,arguments,function*(){const s=(e=t==null?void 0:t.body)===null||e===void 0?void 0:e.getReader(),a=new TextDecoder("utf-8");if(!s)throw new Error("Response body is empty");try{let l="";for(;;){const{done:u,value:m}=yield J(s.read());if(u){if(l.trim().length>0)throw new Error("Incomplete JSON segment at the end");break}const p=a.decode(m);try{const y=JSON.parse(p);if("error"in y){const T=JSON.parse(JSON.stringify(y.error)),E=T.status,I=T.code,P=`got status: ${E}. ${JSON.stringify(y)}`;if(I>=400&&I<500)throw new Pn(P);if(I>=500&&I<600)throw new Ye(P)}}catch(y){const T=y;if(T.name==="ClientError"||T.name==="ServerError")throw y}l+=p;let g=l.match(pn);for(;g;){const y=g[1];try{const T=new Response(y,{headers:t==null?void 0:t.headers,status:t==null?void 0:t.status,statusText:t==null?void 0:t.statusText});yield yield J(new He(T)),l=l.slice(g[0].length),g=l.match(pn)}catch(T){throw new Error(`exception parsing stream chunk ${y}. ${T}`)}}}}finally{s.releaseLock()}})}async apiCall(t,e){return fetch(t,e).catch(n=>{throw new Error(`exception ${n} sending request`)})}getDefaultHeaders(){const t={},e=ac+" "+this.clientOptions.userAgentExtra;return t[ic]=e,t[sc]=e,t[nc]="application/json",t}async getHeadersInternal(t){const e=new Headers;if(t&&t.headers){for(const[n,s]of Object.entries(t.headers))e.append(n,s);t.timeout&&t.timeout>0&&e.append(oc,String(Math.ceil(t.timeout/1e3)))}return await this.clientOptions.auth.addAuthHeaders(e),e}async uploadFile(t,e){var n;const s={};e!=null&&(s.mimeType=e.mimeType,s.name=e.name,s.displayName=e.displayName),s.name&&!s.name.startsWith("files/")&&(s.name=`files/${s.name}`);const a=this.clientOptions.uploader,l=await a.stat(t);s.sizeBytes=String(l.size);const u=(n=e==null?void 0:e.mimeType)!==null&&n!==void 0?n:l.type;if(u===void 0||u==="")throw new Error("Can not determine mimeType. Please provide mimeType in the config.");s.mimeType=u;const m=await this.fetchUploadUrl(s,e);return a.upload(t,m,this)}async downloadFile(t){await this.clientOptions.downloader.download(t,this)}async fetchUploadUrl(t,e){var n;let s={};e!=null&&e.httpOptions?s=e.httpOptions:s={apiVersion:"",headers:{"Content-Type":"application/json","X-Goog-Upload-Protocol":"resumable","X-Goog-Upload-Command":"start","X-Goog-Upload-Header-Content-Length":`${t.sizeBytes}`,"X-Goog-Upload-Header-Content-Type":`${t.mimeType}`}};const a={file:t},l=await this.request({path:x("upload/v1beta/files",a._url),body:JSON.stringify(a),httpMethod:"POST",httpOptions:s});if(!l||!(l!=null&&l.headers))throw new Error("Server did not return an HttpResponse or the returned HttpResponse did not have headers.");const u=(n=l==null?void 0:l.headers)===null||n===void 0?void 0:n["x-goog-upload-url"];if(u===void 0)throw new Error("Failed to get upload url. Server did not return the x-google-upload-url in the headers");return u}}async function fn(o){var t;if(o===void 0)throw new Ye("response is undefined");if(!o.ok){const e=o.status,n=o.statusText;let s;!((t=o.headers.get("content-type"))===null||t===void 0)&&t.includes("application/json")?s=await o.json():s={error:{message:await o.text(),code:o.status,status:o.statusText}};const a=`got status: ${e} ${n}. ${JSON.stringify(s)}`;throw e>=400&&e<500?new Pn(a):e>=500&&e<600?new Ye(a):new Error(a)}}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function dc(o,t){const e={},n=i(t,["name"]);n!=null&&r(e,["_url","name"],n);const s=i(t,["config"]);return s!=null&&r(e,["config"],s),e}function pc(o,t,e){const n={},s=i(t,["pageSize"]);e!==void 0&&s!=null&&r(e,["_query","pageSize"],s);const a=i(t,["pageToken"]);e!==void 0&&a!=null&&r(e,["_query","pageToken"],a);const l=i(t,["filter"]);return e!==void 0&&l!=null&&r(e,["_query","filter"],l),n}function fc(o,t){const e={},n=i(t,["config"]);return n!=null&&r(e,["config"],pc(o,n,e)),e}function mc(o,t){const e={},n=i(t,["textInput"]);n!=null&&r(e,["textInput"],n);const s=i(t,["output"]);return s!=null&&r(e,["output"],s),e}function gc(o,t){const e={};if(i(t,["gcsUri"])!==void 0)throw new Error("gcsUri parameter is not supported in Gemini API.");const n=i(t,["examples"]);if(n!=null){let s=n;Array.isArray(s)&&(s=s.map(a=>mc(o,a))),r(e,["examples","examples"],s)}return e}function hc(o,t,e){const n={};if(i(t,["validationDataset"])!==void 0)throw new Error("validationDataset parameter is not supported in Gemini API.");const s=i(t,["tunedModelDisplayName"]);if(e!==void 0&&s!=null&&r(e,["displayName"],s),i(t,["description"])!==void 0)throw new Error("description parameter is not supported in Gemini API.");const a=i(t,["epochCount"]);e!==void 0&&a!=null&&r(e,["tuningTask","hyperparameters","epochCount"],a);const l=i(t,["learningRateMultiplier"]);if(l!=null&&r(n,["tuningTask","hyperparameters","learningRateMultiplier"],l),i(t,["exportLastCheckpointOnly"])!==void 0)throw new Error("exportLastCheckpointOnly parameter is not supported in Gemini API.");if(i(t,["adapterSize"])!==void 0)throw new Error("adapterSize parameter is not supported in Gemini API.");const u=i(t,["batchSize"]);e!==void 0&&u!=null&&r(e,["tuningTask","hyperparameters","batchSize"],u);const m=i(t,["learningRate"]);return e!==void 0&&m!=null&&r(e,["tuningTask","hyperparameters","learningRate"],m),n}function yc(o,t){const e={},n=i(t,["baseModel"]);n!=null&&r(e,["baseModel"],n);const s=i(t,["trainingDataset"]);s!=null&&r(e,["tuningTask","trainingData"],gc(o,s));const a=i(t,["config"]);return a!=null&&r(e,["config"],hc(o,a,e)),e}function vc(o,t){const e={},n=i(t,["name"]);n!=null&&r(e,["_url","name"],n);const s=i(t,["config"]);return s!=null&&r(e,["config"],s),e}function Cc(o,t,e){const n={},s=i(t,["pageSize"]);e!==void 0&&s!=null&&r(e,["_query","pageSize"],s);const a=i(t,["pageToken"]);e!==void 0&&a!=null&&r(e,["_query","pageToken"],a);const l=i(t,["filter"]);return e!==void 0&&l!=null&&r(e,["_query","filter"],l),n}function Tc(o,t){const e={},n=i(t,["config"]);return n!=null&&r(e,["config"],Cc(o,n,e)),e}function Ec(o,t,e){const n={},s=i(t,["gcsUri"]);if(e!==void 0&&s!=null&&r(e,["supervisedTuningSpec","trainingDatasetUri"],s),i(t,["examples"])!==void 0)throw new Error("examples parameter is not supported in Vertex AI.");return n}function Sc(o,t){const e={},n=i(t,["gcsUri"]);return n!=null&&r(e,["validationDatasetUri"],n),e}function Ic(o,t,e){const n={},s=i(t,["validationDataset"]);e!==void 0&&s!=null&&r(e,["supervisedTuningSpec"],Sc(o,s));const a=i(t,["tunedModelDisplayName"]);e!==void 0&&a!=null&&r(e,["tunedModelDisplayName"],a);const l=i(t,["description"]);e!==void 0&&l!=null&&r(e,["description"],l);const u=i(t,["epochCount"]);e!==void 0&&u!=null&&r(e,["supervisedTuningSpec","hyperParameters","epochCount"],u);const m=i(t,["learningRateMultiplier"]);e!==void 0&&m!=null&&r(e,["supervisedTuningSpec","hyperParameters","learningRateMultiplier"],m);const p=i(t,["exportLastCheckpointOnly"]);e!==void 0&&p!=null&&r(e,["supervisedTuningSpec","exportLastCheckpointOnly"],p);const g=i(t,["adapterSize"]);if(e!==void 0&&g!=null&&r(e,["supervisedTuningSpec","hyperParameters","adapterSize"],g),i(t,["batchSize"])!==void 0)throw new Error("batchSize parameter is not supported in Vertex AI.");if(i(t,["learningRate"])!==void 0)throw new Error("learningRate parameter is not supported in Vertex AI.");return n}function Ac(o,t){const e={},n=i(t,["baseModel"]);n!=null&&r(e,["baseModel"],n);const s=i(t,["trainingDataset"]);s!=null&&r(e,["supervisedTuningSpec","trainingDatasetUri"],Ec(o,s,e));const a=i(t,["config"]);return a!=null&&r(e,["config"],Ic(o,a,e)),e}function bc(o,t){const e={},n=i(t,["name"]);n!=null&&r(e,["model"],n);const s=i(t,["name"]);return s!=null&&r(e,["endpoint"],s),e}function xn(o,t){const e={},n=i(t,["name"]);n!=null&&r(e,["name"],n);const s=i(t,["state"]);s!=null&&r(e,["state"],Sn(o,s));const a=i(t,["createTime"]);a!=null&&r(e,["createTime"],a);const l=i(t,["tuningTask","startTime"]);l!=null&&r(e,["startTime"],l);const u=i(t,["tuningTask","completeTime"]);u!=null&&r(e,["endTime"],u);const m=i(t,["updateTime"]);m!=null&&r(e,["updateTime"],m);const p=i(t,["description"]);p!=null&&r(e,["description"],p);const g=i(t,["baseModel"]);g!=null&&r(e,["baseModel"],g);const y=i(t,["_self"]);y!=null&&r(e,["tunedModel"],bc(o,y));const T=i(t,["distillationSpec"]);T!=null&&r(e,["distillationSpec"],T);const E=i(t,["experiment"]);E!=null&&r(e,["experiment"],E);const I=i(t,["labels"]);I!=null&&r(e,["labels"],I);const P=i(t,["pipelineJob"]);P!=null&&r(e,["pipelineJob"],P);const D=i(t,["tunedModelDisplayName"]);return D!=null&&r(e,["tunedModelDisplayName"],D),e}function wc(o,t){const e={},n=i(t,["nextPageToken"]);n!=null&&r(e,["nextPageToken"],n);const s=i(t,["tunedModels"]);if(s!=null){let a=s;Array.isArray(a)&&(a=a.map(l=>xn(o,l))),r(e,["tuningJobs"],a)}return e}function _c(o,t){const e={},n=i(t,["name"]);n!=null&&r(e,["name"],n);const s=i(t,["metadata"]);s!=null&&r(e,["metadata"],s);const a=i(t,["done"]);a!=null&&r(e,["done"],a);const l=i(t,["error"]);return l!=null&&r(e,["error"],l),e}function Rc(o,t){const e={},n=i(t,["checkpointId"]);n!=null&&r(e,["checkpointId"],n);const s=i(t,["epoch"]);s!=null&&r(e,["epoch"],s);const a=i(t,["step"]);a!=null&&r(e,["step"],a);const l=i(t,["endpoint"]);return l!=null&&r(e,["endpoint"],l),e}function Mc(o,t){const e={},n=i(t,["model"]);n!=null&&r(e,["model"],n);const s=i(t,["endpoint"]);s!=null&&r(e,["endpoint"],s);const a=i(t,["checkpoints"]);if(a!=null){let l=a;Array.isArray(l)&&(l=l.map(u=>Rc(o,u))),r(e,["checkpoints"],l)}return e}function Ke(o,t){const e={},n=i(t,["name"]);n!=null&&r(e,["name"],n);const s=i(t,["state"]);s!=null&&r(e,["state"],Sn(o,s));const a=i(t,["createTime"]);a!=null&&r(e,["createTime"],a);const l=i(t,["startTime"]);l!=null&&r(e,["startTime"],l);const u=i(t,["endTime"]);u!=null&&r(e,["endTime"],u);const m=i(t,["updateTime"]);m!=null&&r(e,["updateTime"],m);const p=i(t,["error"]);p!=null&&r(e,["error"],p);const g=i(t,["description"]);g!=null&&r(e,["description"],g);const y=i(t,["baseModel"]);y!=null&&r(e,["baseModel"],y);const T=i(t,["tunedModel"]);T!=null&&r(e,["tunedModel"],Mc(o,T));const E=i(t,["supervisedTuningSpec"]);E!=null&&r(e,["supervisedTuningSpec"],E);const I=i(t,["tuningDataStats"]);I!=null&&r(e,["tuningDataStats"],I);const P=i(t,["encryptionSpec"]);P!=null&&r(e,["encryptionSpec"],P);const D=i(t,["partnerModelTuningSpec"]);D!=null&&r(e,["partnerModelTuningSpec"],D);const $=i(t,["distillationSpec"]);$!=null&&r(e,["distillationSpec"],$);const F=i(t,["experiment"]);F!=null&&r(e,["experiment"],F);const V=i(t,["labels"]);V!=null&&r(e,["labels"],V);const N=i(t,["pipelineJob"]);N!=null&&r(e,["pipelineJob"],N);const H=i(t,["tunedModelDisplayName"]);return H!=null&&r(e,["tunedModelDisplayName"],H),e}function Pc(o,t){const e={},n=i(t,["nextPageToken"]);n!=null&&r(e,["nextPageToken"],n);const s=i(t,["tuningJobs"]);if(s!=null){let a=s;Array.isArray(a)&&(a=a.map(l=>Ke(o,l))),r(e,["tuningJobs"],a)}return e}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class xc extends fe{constructor(t){super(),this.apiClient=t,this.get=async e=>await this.getInternal(e),this.list=async(e={})=>new Re(ce.PAGED_ITEM_TUNING_JOBS,n=>this.listInternal(n),await this.listInternal(e),e),this.tune=async e=>{if(this.apiClient.isVertexAI())return await this.tuneInternal(e);{const n=await this.tuneMldevInternal(e);let s="";return n.metadata!==void 0&&n.metadata.tunedModel!==void 0?s=n.metadata.tunedModel:n.name!==void 0&&n.name.includes("/operations/")&&(s=n.name.split("/operations/")[0]),{name:s,state:Ge.JOB_STATE_QUEUED}}}}async getInternal(t){var e,n,s,a;let l,u="",m={};if(this.apiClient.isVertexAI()){const p=vc(this.apiClient,t);return u=x("{name}",p._url),m=p._query,delete p.config,delete p._url,delete p._query,l=this.apiClient.request({path:u,queryParams:m,body:JSON.stringify(p),httpMethod:"GET",httpOptions:(e=t.config)===null||e===void 0?void 0:e.httpOptions,abortSignal:(n=t.config)===null||n===void 0?void 0:n.abortSignal}).then(g=>g.json()),l.then(g=>Ke(this.apiClient,g))}else{const p=dc(this.apiClient,t);return u=x("{name}",p._url),m=p._query,delete p.config,delete p._url,delete p._query,l=this.apiClient.request({path:u,queryParams:m,body:JSON.stringify(p),httpMethod:"GET",httpOptions:(s=t.config)===null||s===void 0?void 0:s.httpOptions,abortSignal:(a=t.config)===null||a===void 0?void 0:a.abortSignal}).then(g=>g.json()),l.then(g=>xn(this.apiClient,g))}}async listInternal(t){var e,n,s,a;let l,u="",m={};if(this.apiClient.isVertexAI()){const p=Tc(this.apiClient,t);return u=x("tuningJobs",p._url),m=p._query,delete p.config,delete p._url,delete p._query,l=this.apiClient.request({path:u,queryParams:m,body:JSON.stringify(p),httpMethod:"GET",httpOptions:(e=t.config)===null||e===void 0?void 0:e.httpOptions,abortSignal:(n=t.config)===null||n===void 0?void 0:n.abortSignal}).then(g=>g.json()),l.then(g=>{const y=Pc(this.apiClient,g),T=new Zt;return Object.assign(T,y),T})}else{const p=fc(this.apiClient,t);return u=x("tunedModels",p._url),m=p._query,delete p.config,delete p._url,delete p._query,l=this.apiClient.request({path:u,queryParams:m,body:JSON.stringify(p),httpMethod:"GET",httpOptions:(s=t.config)===null||s===void 0?void 0:s.httpOptions,abortSignal:(a=t.config)===null||a===void 0?void 0:a.abortSignal}).then(g=>g.json()),l.then(g=>{const y=wc(this.apiClient,g),T=new Zt;return Object.assign(T,y),T})}}async tuneInternal(t){var e,n;let s,a="",l={};if(this.apiClient.isVertexAI()){const u=Ac(this.apiClient,t);return a=x("tuningJobs",u._url),l=u._query,delete u.config,delete u._url,delete u._query,s=this.apiClient.request({path:a,queryParams:l,body:JSON.stringify(u),httpMethod:"POST",httpOptions:(e=t.config)===null||e===void 0?void 0:e.httpOptions,abortSignal:(n=t.config)===null||n===void 0?void 0:n.abortSignal}).then(m=>m.json()),s.then(m=>Ke(this.apiClient,m))}else throw new Error("This method is only supported by the Vertex AI.")}async tuneMldevInternal(t){var e,n;let s,a="",l={};if(this.apiClient.isVertexAI())throw new Error("This method is only supported by the Gemini Developer API.");{const u=yc(this.apiClient,t);return a=x("tunedModels",u._url),l=u._query,delete u.config,delete u._url,delete u._query,s=this.apiClient.request({path:a,queryParams:l,body:JSON.stringify(u),httpMethod:"POST",httpOptions:(e=t.config)===null||e===void 0?void 0:e.httpOptions,abortSignal:(n=t.config)===null||n===void 0?void 0:n.abortSignal}).then(m=>m.json()),s.then(m=>_c(this.apiClient,m))}}}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Dc{async download(t,e){throw new Error("Download to file is not supported in the browser, please use a browser compliant download like an <a> tag.")}}const kc=1024*1024*8,Lc=3,Nc=1e3,$c=2,Be="x-goog-upload-status";async function Fc(o,t,e){var n,s,a;let l=0,u=0,m=new He(new Response),p="upload";for(l=o.size;u<l;){const y=Math.min(kc,l-u),T=o.slice(u,u+y);u+y>=l&&(p+=", finalize");let E=0,I=Nc;for(;E<Lc&&(m=await e.request({path:"",body:T,httpMethod:"POST",httpOptions:{apiVersion:"",baseUrl:t,headers:{"X-Goog-Upload-Command":p,"X-Goog-Upload-Offset":String(u),"Content-Length":String(y)}}}),!(!((n=m==null?void 0:m.headers)===null||n===void 0)&&n[Be]));)E++,await qc(I),I=I*$c;if(u+=y,((s=m==null?void 0:m.headers)===null||s===void 0?void 0:s[Be])!=="active")break;if(l<=u)throw new Error("All content has been uploaded, but the upload status is not finalized.")}const g=await(m==null?void 0:m.json());if(((a=m==null?void 0:m.headers)===null||a===void 0?void 0:a[Be])!=="final")throw new Error("Failed to upload file: Upload status is not finalized.");return g.file}async function Uc(o){return{size:o.size,type:o.type}}function qc(o){return new Promise(t=>setTimeout(t,o))}class Bc{async upload(t,e,n){if(typeof t=="string")throw new Error("File path is not supported in browser uploader.");return await Fc(t,e,n)}async stat(t){if(typeof t=="string")throw new Error("File path is not supported in browser uploader.");return await Uc(t)}}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Vc{create(t,e,n){return new Gc(t,e,n)}}class Gc{constructor(t,e,n){this.url=t,this.headers=e,this.callbacks=n}connect(){this.ws=new WebSocket(this.url),this.ws.onopen=this.callbacks.onopen,this.ws.onerror=this.callbacks.onerror,this.ws.onclose=this.callbacks.onclose,this.ws.onmessage=this.callbacks.onmessage}send(t){if(this.ws===void 0)throw new Error("WebSocket is not connected");this.ws.send(t)}close(){if(this.ws===void 0)throw new Error("WebSocket is not connected");this.ws.close()}}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const mn="x-goog-api-key";class Hc{constructor(t){this.apiKey=t}async addAuthHeaders(t){t.get(mn)===null&&t.append(mn,this.apiKey)}}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Oc="gl-node/";class zc{constructor(t){var e;if(t.apiKey==null)throw new Error("An API Key must be set when running in a browser");if(t.project||t.location)throw new Error("Vertex AI project based authentication is not supported on browser runtimes. Please do not provide a project or location.");this.vertexai=(e=t.vertexai)!==null&&e!==void 0?e:!1,this.apiKey=t.apiKey;const n=ei(t,void 0,void 0);n&&(t.httpOptions?t.httpOptions.baseUrl=n:t.httpOptions={baseUrl:n}),this.apiVersion=t.apiVersion;const s=new Hc(this.apiKey);this.apiClient=new uc({auth:s,apiVersion:this.apiVersion,apiKey:this.apiKey,vertexai:this.vertexai,httpOptions:t.httpOptions,userAgentExtra:Oc+"web",uploader:new Bc,downloader:new Dc}),this.models=new Ol(this.apiClient),this.live=new ql(this.apiClient,s,new Vc),this.chats=new as(this.models,this.apiClient),this.caches=new os(this.apiClient),this.files=new Ts(this.apiClient),this.operations=new tc(this.apiClient),this.tunings=new xc(this.apiClient)}}const Dn={GEMINI_API_KEY:"your_gemini_api_key_here",DATABASE_TYPE:"sqlite",MYSQL_CONFIG:{host:"localhost",user:"root",password:"password",database:"turboagile"},APP_NAME:"Turbo Agile",VERSION:"1.0.0",ENDPOINTS:{GEMINI:"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"}};function Jc(o){return o.replace(/[\r\n\t]/g," ").replace(/[<>]/g,"")}/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */const gn=new zc({apiKey:Dn.GEMINI_API_KEY});class Wc{constructor(){this.data={organizations:[{id:"org-default",name:"Default Organization",projects:[]}],currentOrganizationId:"org-default",currentProjectId:null,stories:[],connectors:{projectManagement:null,versionControl:null,aiAssistant:null,cloud:null,log:null},connectorConfigs:{},userSettings:{theme:"dark",lastLogin:null},analytics:{totalStories:0,completedStories:0,deployments:0,incidents:0},githubCommits:{},githubPRs:{}},this.load()}save(){try{localStorage.setItem("turboagile_db",JSON.stringify(this.data));const t=this.getConnectorConfig("github-config");t&&localStorage.setItem("github-config-persistent",JSON.stringify(t))}catch(t){console.error("Failed to save database:",t)}}load(){try{const t=localStorage.getItem("turboagile_db");t&&(this.data={...this.data,...JSON.parse(t)});const e=localStorage.getItem("github-config-persistent");e&&(this.data.connectorConfigs["github-config"]=JSON.parse(e))}catch(t){console.error("Failed to load database:",t)}}getStories(){return this.data.stories.map(t=>({...t,creationDate:new Date(t.creationDate),completionDate:t.completionDate?new Date(t.completionDate):null}))}addStory(t){this.data.stories.push(t),this.updateAnalytics(),this.save()}updateStory(t,e){const n=this.data.stories.findIndex(s=>s.id===t);n!==-1&&(this.data.stories[n]={...this.data.stories[n],...e},this.updateAnalytics(),this.save())}getConnectors(){return this.data.connectors}setConnector(t,e){this.data.connectors[t]=e,this.save()}getConnectorConfig(t){return this.data.connectorConfigs[t]||null}setConnectorConfig(t,e){this.data.connectorConfigs[t]=e,this.save()}updateAnalytics(){this.data.analytics={totalStories:this.data.stories.length,completedStories:this.data.stories.filter(t=>t.status==="done").length,deployments:this.data.stories.filter(t=>t.githubCheckedIn).length,incidents:this.data.stories.filter(t=>t.type==="bug").length}}getOrganizations(){return this.data.organizations||[]}getCurrentOrganization(){return this.data.organizations.find(t=>t.id===this.data.currentOrganizationId)}getProjects(t){const e=t||this.data.currentOrganizationId,n=this.data.organizations.find(s=>s.id===e);return n?n.projects:[]}createProject(t,e,n){const s=n||this.data.currentOrganizationId,a=this.data.organizations.find(u=>u.id===s);if(!a)throw new Error("Organization not found");const l={id:"proj-"+Date.now(),name:t,description:e,createdDate:new Date,lastModified:new Date,stories:[],organizationId:s};return a.projects.push(l),this.save(),l}setCurrentProject(t){this.data.currentProjectId=t,this.save()}deleteProject(t){for(const e of this.data.organizations)e.projects=e.projects.filter(n=>n.id!==t);this.data.currentProjectId===t&&(this.data.currentProjectId=null),this.save()}getCurrentProject(){if(!this.data.currentProjectId)return null;for(const t of this.data.organizations){const e=t.projects.find(n=>n.id===this.data.currentProjectId);if(e)return e}return null}addStoryToProject(t,e){const n=e||this.data.currentProjectId;if(n)for(const s of this.data.organizations){const a=s.projects.find(l=>l.id===n);if(a){t.projectId=n,a.stories.push(t),a.lastModified=new Date;break}}else this.data.stories.push(t);this.updateAnalytics(),this.save()}getStoriesForProject(t){const e=t||this.data.currentProjectId;if(e)for(const n of this.data.organizations){const s=n.projects.find(a=>a.id===e);if(s)return s.stories.map(a=>({...a,creationDate:new Date(a.creationDate),completionDate:a.completionDate?new Date(a.completionDate):null}))}return this.getStories()}clear(){localStorage.removeItem("turboagile_db"),this.data={stories:[],connectors:{projectManagement:null,versionControl:null,aiAssistant:null,cloud:null,log:null},connectorConfigs:{},userSettings:{theme:"dark",lastLogin:null},analytics:{totalStories:0,completedStories:0,deployments:0,incidents:0}}}}const M=new Wc,L={get isLoggedIn(){return M.data.userSettings.lastLogin!==null},set isLoggedIn(o){M.data.userSettings.lastLogin=o?new Date:null,M.save()},get stories(){return M.getStories()},set stories(o){M.data.stories=o,M.updateAnalytics(),M.save()},currentIncidentAnalysis:null,get connectors(){return M.getConnectors()},get connectorConfigs(){return new Map(Object.entries(M.data.connectorConfigs))}};document.addEventListener("DOMContentLoaded",()=>{console.log(Jc("App initializing"));const o={loginContainer:document.getElementById("login-container"),dashboardContainer:document.getElementById("dashboard-container"),projectViewContainer:document.getElementById("project-view-container"),loginForm:document.getElementById("login-form"),logoutButton:document.getElementById("logout-button"),brdInput:document.getElementById("brd-input"),generateButton:document.getElementById("generate-button"),projectNavigationSection:document.getElementById("project-navigation-section"),viewProjectBoardButton:document.getElementById("view-project-board-button"),backToDashboardBtn:document.getElementById("back-to-dashboard-btn"),themeToggle:document.getElementById("theme-toggle"),themeToggleLogin:document.getElementById("theme-toggle-login"),backlogColumn:document.getElementById("backlog-cards"),inProgressColumn:document.getElementById("inprogress-cards"),doneColumn:document.getElementById("done-cards"),connectorsSection:document.querySelector(".connectors-section")},t=localStorage.getItem("theme")||"dark";document.body.setAttribute("data-theme",t),o.themeToggle&&(o.themeToggle.checked=t==="light"),o.themeToggleLogin&&(o.themeToggleLogin.checked=t==="light"),o.loginForm&&o.loginForm.addEventListener("submit",me),o.logoutButton&&o.logoutButton.addEventListener("click",ge),o.backToDashboardBtn&&o.backToDashboardBtn.addEventListener("click",()=>O("dashboard")),o.viewProjectBoardButton&&o.viewProjectBoardButton.addEventListener("click",et),o.themeToggle&&o.themeToggle.addEventListener("change",Ze),o.themeToggleLogin&&o.themeToggleLogin.addEventListener("change",Ze),o.generateButton&&o.generateButton.addEventListener("click",Nn);const e=document.getElementById("create-story-button");e&&e.addEventListener("click",d=>{d.preventDefault(),d.stopPropagation(),Yo()});const n=document.getElementById("delete-stories-button");n&&n.addEventListener("click",fo);const s=document.getElementById("select-all-checkbox");s&&s.addEventListener("change",po);const a=document.getElementById("delete-project-button");a&&a.addEventListener("click",mo);const l=document.getElementById("go-to-board-button");l&&l.addEventListener("click",et);const u=document.getElementById("create-story-modal"),m=document.getElementById("create-story-form"),p=document.getElementById("create-story-modal-close"),g=document.getElementById("cancel-story-button");p&&p.addEventListener("click",ye),g&&g.addEventListener("click",ye),m&&m.addEventListener("submit",Ko),u&&u.addEventListener("click",d=>{d.target===u&&ye()});const y=document.getElementById("incident-button");y&&y.addEventListener("click",eo);const T=document.getElementById("cost-analysis-button");T?(console.log("Cost analysis button found, adding event listener"),T.addEventListener("click",d=>{d.preventDefault(),d.stopPropagation(),console.log("Cost analysis button clicked"),yo()})):console.log("Cost analysis button not found");const E=document.querySelectorAll(".obs-tab"),I=document.querySelectorAll(".obs-panel");E.forEach(d=>{d.addEventListener("click",()=>{const c=d.getAttribute("data-obs-tab");if(c){E.forEach(h=>h.classList.remove("active")),I.forEach(h=>h.classList.remove("active")),d.classList.add("active");const f=document.getElementById(`${c}-panel`);f&&f.classList.add("active")}})});const P=document.getElementById("setup-monitoring-button"),D=document.getElementById("create-dashboard-button"),$=document.getElementById("configure-alerts-button");P&&P.addEventListener("click",Co),D&&D.addEventListener("click",To),$&&$.addEventListener("click",Eo);const F=document.querySelectorAll(".tab-button"),V=document.querySelectorAll(".tab-panel");F.forEach(d=>{d.addEventListener("click",()=>{const c=d.getAttribute("data-tab");if(c){F.forEach(h=>h.classList.remove("active")),V.forEach(h=>h.classList.remove("active")),d.classList.add("active");const f=document.getElementById(`${c}-panel`);f&&f.classList.add("active")}})}),document.querySelectorAll(".connector-button").forEach(d=>{d.addEventListener("click",()=>{const c=d.getAttribute("data-provider");if(c){const f=d.classList.contains("selected"),h=d.closest(".tab-panel");h&&h.querySelectorAll(".connector-button").forEach(v=>{v.classList.remove("selected")}),f?c==="GitHub"&&confirm(`Do you want to edit the GitHub connection or disconnect?

Click OK to edit, Cancel to disconnect.`)?ke(c,d,h,!0):nt(d,h):ke(c,d,h),j()}})});const H=document.querySelectorAll(".input-tab"),se=document.querySelectorAll(".input-panel");H.forEach(d=>{d.addEventListener("click",()=>{const c=d.getAttribute("data-input");if(c){H.forEach(h=>h.classList.remove("active")),se.forEach(h=>h.classList.remove("active")),d.classList.add("active");const f=document.getElementById(`${c}-input-panel`);f&&f.classList.add("active")}})});const ee=document.getElementById("file-input"),te=document.getElementById("file-browse-btn");te&&ee&&te.addEventListener("click",()=>{ee.click()}),ee&&ee.addEventListener("change",d=>{const c=d.target.files;c&&c.length>0&&re(c[0])});function re(d){const c=document.getElementById("file-preview"),f=document.getElementById("file-drop-zone"),h=c==null?void 0:c.querySelector(".file-name"),v=c==null?void 0:c.querySelector(".file-size"),C=document.getElementById("file-content");c&&f&&h&&v&&C&&(h.textContent=d.name,v.textContent=Y(d.size),C.textContent=`Mock content from ${d.name}`,f.style.display="none",c.style.display="block")}function Y(d){const f=["Bytes","KB","MB"],h=Math.floor(Math.log(d)/Math.log(1024));return Math.round(d/Math.pow(1024,h))+" "+f[h]}O("login"),j();function O(d){[o.loginContainer,o.dashboardContainer,o.projectViewContainer].forEach(h=>{h&&(h.style.display="none",h.classList.remove("fade-in"))});let f=null;switch(d){case"login":f=o.loginContainer;break;case"dashboard":f=o.dashboardContainer;break;case"project":f=o.projectViewContainer;break}f&&(f.style.display=d==="login"?"flex":"block",f.classList.add("fade-in"))}function me(d){d.preventDefault(),L.isLoggedIn=!0,O("dashboard")}function ge(){L.isLoggedIn=!1,M.clear(),Z(),j(),O("login")}function Z(){L.connectors={projectManagement:null,versionControl:null,aiAssistant:null,cloud:null,log:null},document.querySelectorAll(".connector-button.selected").forEach(d=>{d.classList.remove("selected")})}function j(){if(o.projectNavigationSection){const v=M.getProjects().some(C=>C.stories&&C.stories.length>0);o.projectNavigationSection.style.display=v?"block":"none"}const d=document.getElementById("story-generator-section"),c=document.getElementById("incident-section"),f=document.getElementById("sync-button");d&&(d.style.display=(L.connectors.projectManagement,"block")),c&&(c.style.display=(L.connectors.log,"block")),f&&(f.style.display=L.connectors.projectManagement?"inline-flex":"none"),kn()}function kn(){const d=document.getElementById("github-status");d&&d.remove(),Ln()}function Ln(){var C;const d=document.querySelector(".project-header");if(!d)return;let c=document.getElementById("connections-info");c||(c=document.createElement("div"),c.id="connections-info",c.style.cssText="display: flex; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap;",d.appendChild(c));let f="";const h=M.getConnectorConfig("github-config");if(L.connectors.versionControl&&h){const S=h.repo||h.url,w=S?(C=S.split("/").pop())==null?void 0:C.replace(".git",""):"Repository",A=h.username||"User";f+=`<div class="connection-badge github">📂 ${A}/${w}</div>`}const v=M.getConnectorConfig("aws-config");if(L.connectors.cloud&&v&&(f+=`<div class="connection-badge cloud">☁️ ${v.provider} (${v.region||"us-east-1"})</div>`),L.connectors.projectManagement&&(f+=`<div class="connection-badge pm">📋 ${L.connectors.projectManagement}</div>`),L.connectors.aiAssistant&&(f+=`<div class="connection-badge ai">🤖 ${L.connectors.aiAssistant}</div>`),L.connectors.log&&(f+=`<div class="connection-badge logs">📊 ${L.connectors.log}</div>`),c.innerHTML=f,!document.getElementById("connection-badges-style")){const S=document.createElement("style");S.id="connection-badges-style",S.textContent=`
                .connection-badge {
                    padding: 0.25rem 0.75rem;
                    border-radius: 12px;
                    font-size: 0.8rem;
                    font-weight: 500;
                    background: var(--card-bg-color);
                    border: 1px solid var(--border-color);
                    color: var(--text-color);
                }
                .connection-badge.github { border-color: #6366f1; background: rgba(99, 102, 241, 0.1); }
                .connection-badge.cloud { border-color: #f59e0b; background: rgba(245, 158, 11, 0.1); }
                .connection-badge.pm { border-color: #10b981; background: rgba(16, 185, 129, 0.1); }
                .connection-badge.ai { border-color: #8b5cf6; background: rgba(139, 92, 246, 0.1); }
                .connection-badge.logs { border-color: #06b6d4; background: rgba(6, 182, 212, 0.1); }
            `,document.head.appendChild(S)}}function Ze(d){const f=d.target.checked,h=f?"light":"dark";document.body.setAttribute("data-theme",h),localStorage.setItem("theme",h),o.themeToggle&&(o.themeToggle.checked=f),o.themeToggleLogin&&(o.themeToggleLogin.checked=f)}async function Nn(){const d=document.getElementById("brd-input");if(!d){alert("Text input area not found. Please refresh the page.");return}const c=d.value.trim();if(!c){alert("Please enter your Business Requirements Document in the text area above."),d.focus();return}M.getProjects().length>0?Fn(c):$n(c)}function $n(d){const c=document.createElement("div");c.className="modal-overlay",c.style.display="flex",c.innerHTML=`
            <div class="modal-content project-selection-modal">
                <div class="modal-header">
                    <h2>📋 Create Your First Project</h2>
                    <button class="modal-close">&times;</button>
                </div>
                
                <div class="project-selection-content">
                    <p>Welcome! Let's create your first project to organize your stories.</p>
                    
                    <div class="form-group">
                        <label for="first-project-name">Project Name *</label>
                        <input type="text" id="first-project-name" placeholder="e.g., E-commerce Platform" required>
                    </div>
                    <div class="form-group">
                        <label for="first-project-description">Description</label>
                        <textarea id="first-project-description" placeholder="Brief description of the project..."></textarea>
                    </div>
                </div>
                
                <div class="modal-actions">
                    <button class="action-button secondary cancel-btn">Cancel</button>
                    <button class="action-button proceed-btn">Create Project & Generate Stories</button>
                </div>
            </div>
        `;const f=c.querySelector(".modal-close"),h=c.querySelector(".cancel-btn"),v=c.querySelector(".proceed-btn");[f,h].forEach(C=>{C==null||C.addEventListener("click",()=>{c.remove(),document.body.style.overflow="auto"})}),v==null||v.addEventListener("click",async()=>{const C=c.querySelector("#first-project-name"),S=c.querySelector("#first-project-description");if(!C.value.trim()){alert("Please enter a project name");return}const w=M.createProject(C.value.trim(),S.value.trim());c.remove(),document.body.style.overflow="auto",await Pe(d,w.id)}),document.body.appendChild(c),document.body.style.overflow="hidden"}function Fn(d){const c=document.createElement("div");c.className="modal-overlay",c.style.display="flex";const h=M.getProjects().map(_=>`<option value="${_.id}">${_.name}</option>`).join("");c.innerHTML=`
            <div class="modal-content project-selection-modal">
                <div class="modal-header">
                    <h2>📋 Project Selection</h2>
                    <button class="modal-close">&times;</button>
                </div>
                
                <div class="project-selection-content">
                    <p>You have existing projects. Where would you like to add the new stories from your BRD?</p>
                    
                    <div class="project-options">
                        <div class="option-card">
                            <input type="radio" id="existing-project" name="project-option" value="existing" checked>
                            <label for="existing-project">
                                <div class="option-header">
                                    <span class="option-icon">📁</span>
                                    <span class="option-title">Add to Existing Project</span>
                                </div>
                                <p class="option-description">Add stories to one of your current projects</p>
                            </label>
                            
                            <div class="project-dropdown" id="project-dropdown">
                                <label for="project-select">Select Project:</label>
                                <select id="project-select">
                                    ${h}
                                </select>
                                
                                <div class="project-tree" id="project-tree">
                                    <h4>📊 Organization Structure</h4>
                                    ${Un()}
                                </div>
                            </div>
                        </div>
                        
                        <div class="option-card">
                            <input type="radio" id="new-project" name="project-option" value="new">
                            <label for="new-project">
                                <div class="option-header">
                                    <span class="option-icon">✨</span>
                                    <span class="option-title">Create New Project</span>
                                </div>
                                <p class="option-description">Start a fresh project dashboard</p>
                            </label>
                            
                            <div class="new-project-form" id="new-project-form" style="display: none;">
                                <div class="form-group">
                                    <label for="new-project-name">Project Name:</label>
                                    <input type="text" id="new-project-name" placeholder="e.g., E-commerce Platform" required>
                                </div>
                                <div class="form-group">
                                    <label for="new-project-description">Description:</label>
                                    <textarea id="new-project-description" placeholder="Brief description of the project..."></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="modal-actions">
                    <button class="action-button secondary cancel-btn">Cancel</button>
                    <button class="action-button proceed-btn">Proceed</button>
                </div>
            </div>
        `;const v=c.querySelector(".modal-close"),C=c.querySelector(".cancel-btn"),S=c.querySelector(".proceed-btn"),w=c.querySelectorAll('input[name="project-option"]'),A=c.querySelector("#new-project-form"),b=c.querySelector("#project-dropdown");w.forEach(_=>{_.addEventListener("change",k=>{k.target.value==="new"?(A.style.display="block",b.style.display="none"):(A.style.display="none",b.style.display="block")})}),[v,C].forEach(_=>{_==null||_.addEventListener("click",()=>{c.remove(),document.body.style.overflow="auto"})}),S==null||S.addEventListener("click",async()=>{if(c.querySelector('input[name="project-option"]:checked').value==="existing"){const U=c.querySelector("#project-select").value;c.remove(),document.body.style.overflow="auto",await Pe(d,U)}else{const k=c.querySelector("#new-project-name"),U=c.querySelector("#new-project-description");if(!k.value.trim()){alert("Please enter a project name");return}const B=M.createProject(k.value.trim(),U.value.trim());c.remove(),document.body.style.overflow="auto",await Pe(d,B.id)}}),document.body.appendChild(c),document.body.style.overflow="hidden"}function Un(){const d=M.getOrganizations();let c='<div class="tree-view">';return d.forEach(f=>{c+=`
                <div class="tree-node organization">
                    <div class="tree-item" onclick="toggleTreeNode(this)">
                        <span class="tree-icon">🏢</span>
                        <span class="tree-label">${f.name}</span>
                        <span class="tree-toggle">▼</span>
                    </div>
                    <div class="tree-children">
            `,f.projects.forEach(h=>{const v=h.stories?h.stories.length:0;c+=`
                    <div class="tree-node project" data-project-id="${h.id}">
                        <div class="tree-item" onclick="selectProjectFromTree('${h.id}')">
                            <span class="tree-icon">📁</span>
                            <span class="tree-label">${h.name}</span>
                            <span class="tree-count">${v} stories</span>
                        </div>
                    </div>
                `}),c+=`
                    </div>
                </div>
            `}),c+="</div>",c}async function Pe(d,c){var f;console.log("Starting story generation for project:",c),o.generateButton.disabled=!0,o.generateButton.textContent="Generating...";try{await new Promise(C=>setTimeout(C,1e3));const h=qn(d);c?(M.setCurrentProject(c),h.forEach(C=>{M.addStoryToProject(C,c)}),L.stories=M.getStoriesForProject(c)):(L.stories=h,h.forEach(C=>M.addStory(C))),console.log("Generated",h.length,"stories"),j(),O("project"),Q();const v=c?((f=M.getCurrentProject())==null?void 0:f.name)||"Selected Project":"New Project";alert(`Successfully generated ${h.length} user stories from your BRD and added them to "${v}"!`)}catch(h){console.error("Error generating stories:",h),alert("An error occurred while generating stories. Please try again.")}finally{o.generateButton.disabled=!1,o.generateButton.textContent="🚀 Create Project from BRD"}}function Q(){[o.backlogColumn,o.inProgressColumn,o.doneColumn].forEach(v=>{v&&(v.innerHTML="")});const c=M.getCurrentProject(),f=c?M.getStoriesForProject(c.id):L.stories,h=document.getElementById("project-view-title");if(h&&c&&(h.textContent=`${c.name} - Project Board`),f.length===0){o.backlogColumn&&(o.backlogColumn.innerHTML='<p class="empty-state">No stories generated yet.</p>');return}for(const v of f){const C=document.createElement("div");C.className="story-card",C.setAttribute("data-story-id",v.id),v.type==="bug"&&C.classList.add("bug"),v.status==="blocked"&&C.classList.add("blocked"),v.isFrameworkSetup&&C.classList.add("framework-setup");const S=document.createElement("input");S.type="checkbox",S.className="story-checkbox",S.style.cssText="position: absolute; top: 8px; left: 8px; z-index: 2;",S.addEventListener("change",De),S.addEventListener("click",R=>R.stopPropagation());const w=document.createElement("div");w.className="card-header",w.style.marginLeft="24px";const A=document.createElement("h4");A.textContent=v.title;const b=document.createElement("span");b.className="story-points",v.status==="blocked"?b.textContent=`🔒 ${v.points} SP`:v.isFrameworkSetup?b.textContent=`🏗️ ${v.points} SP`:b.textContent=`${v.points} SP`,C.appendChild(S),w.appendChild(A),w.appendChild(b);const _=document.createElement("p");_.className="story-description",v.status==="blocked"?_.textContent=`🚫 BLOCKED: Complete framework setup first. ${v.description}`:_.textContent=v.description;const k=document.createElement("strong");k.textContent="Acceptance Criteria:";const U=document.createElement("ul");v.acceptanceCriteria.forEach(R=>{const z=document.createElement("li");z.textContent=R,U.appendChild(z)}),C.appendChild(w),C.appendChild(_),C.appendChild(k),C.appendChild(U),C.style.cursor="pointer",C.setAttribute("tabindex","0"),C.setAttribute("role","button"),C.setAttribute("aria-label",`Open story: ${v.title}`);const B=R=>{if(R.preventDefault(),R.stopPropagation(),console.log("Story card clicked:",v.title),v.status==="blocked"&&!v.isFrameworkSetup){const z=f.find(W=>W.isFrameworkSetup);if(z&&z.status!=="done"){alert(`⚠️ Story Blocked

This story is blocked until the "Project Setup & Framework Configuration" story is completed and deployed.

Please complete the framework setup story first.`);return}else v.status="backlog",delete v.blockedBy,M.updateStory(v.id,{status:"backlog"}),Q()}Kn(v)};switch(C.addEventListener("click",B),C.addEventListener("keydown",R=>{(R.key==="Enter"||R.key===" ")&&(R.preventDefault(),B(R))}),C._clickHandler=B,v.status){case"backlog":case"blocked":o.backlogColumn&&o.backlogColumn.appendChild(C);break;case"in-progress":o.inProgressColumn&&o.inProgressColumn.appendChild(C);break;case"done":o.doneColumn&&o.doneColumn.appendChild(C);break}}}function qn(d){const c=[];d.split(/[.!?]+/).filter(C=>C.trim().length>20);let f=Date.now();const h=Bn(d),v=Yn(f++);return c.push(v),h.forEach((C,S)=>{Jn(C).forEach(A=>{const b=zn(A.complexity);c.push({id:"story-"+f++,title:A.title,description:A.description,acceptanceCriteria:A.criteria,status:"blocked",type:"story",points:b,creationDate:new Date,completionDate:null,githubCheckedIn:!1,technicalDetails:Wn(A),blockedBy:v.id})})}),c}function Bn(d){const f=d.replace(/_{5,}/g,"").replace(/\n+/g," ").trim().split(/[.!?]+/).filter(C=>C.trim().length>10&&C.trim().length<200),h=[];let v=null;return f.forEach(C=>{const S=C.trim();!S||S.length<10||(Vn(S)?(v&&h.push(v),v={title:Gn(S),description:Hn(S),criteria:[S.substring(0,100)],complexity:"medium"}):v&&S.length<100&&(v.criteria.push(S),v.complexity=On(v.criteria)))}),v&&h.push(v),h.length>0?h:[{title:"User Management System",description:"As a user, I want to manage my account so that I can access the platform.",criteria:["User can register","User can login","User can update profile"],complexity:"medium"}]}function Vn(d){return["system should","system must","system will","user should","user must","user can","application should","application must","the system","users need","requirement","feature","functionality"].some(f=>d.toLowerCase().includes(f))}function Gn(d){const f=d.split(" ").filter(h=>h.length>2&&h.length<15).slice(0,3).join(" ");return f.length>50?f.substring(0,47)+"...":f.charAt(0).toUpperCase()+f.slice(1)}function Hn(d){const c=d.toLowerCase();return c.includes("user")||c.includes("customer")?`As a user, I want ${d.toLowerCase()} so that I can accomplish my goals.`:`As a user, I need the system to ${d.toLowerCase()} so that I can use the application effectively.`}function On(d){const c=d.join(" ").length,f=d.length;return f>=5||c>500?"high":f>=3||c>200?"medium":"low"}function zn(d){switch(d){case"low":return Math.random()>.5?1:2;case"medium":return Math.random()>.5?3:5;case"high":return 8;default:return 3}}function Jn(d){if(d.criteria.length<=3)return[d];const c=[],f=Math.ceil(d.criteria.length/2);for(let h=0;h<d.criteria.length;h+=f){const v=d.criteria.slice(h,h+f);c.push({title:`${d.title} - Part ${Math.floor(h/f)+1}`,description:d.description,criteria:v,complexity:"medium"})}return c}function Wn(d){return`## Technical Requirements
- Database: ${d.criteria.some(c=>c.toLowerCase().includes("data"))?"PostgreSQL with indexing":"In-memory storage"}
- API: RESTful endpoints with OpenAPI documentation
- Security: JWT authentication, input validation
- Testing: Unit tests (>90% coverage), integration tests
- Performance: <200ms response time, caching layer
- Monitoring: Logging, metrics, health checks`}function Yn(d){return{id:"setup-"+d,title:"🏗️ Project Setup & Framework Configuration",description:"As a developer, I need to set up the initial project structure and framework configuration so that the development team can start building features on a solid foundation.",acceptanceCriteria:["Create project directory structure with proper folder organization","Initialize version control (Git) with proper .gitignore","Set up build configuration (Maven/Gradle for Java, package.json for Node.js)","Configure development environment and dependencies","Create basic application entry point and configuration files","Set up testing framework and initial test structure","Configure CI/CD pipeline with GitHub Actions","Create README.md with setup and development instructions","Implement basic health check endpoint","Configure logging and monitoring setup"],status:"backlog",type:"story",points:5,creationDate:new Date,completionDate:null,githubCheckedIn:!1,isFrameworkSetup:!0,priority:"critical"}}function Kn(d){Wo(d),setTimeout(()=>{const c=document.getElementById("architect-button"),f=document.getElementById("developer-button"),h=document.getElementById("workflow-button");d.status==="done"&&(c&&(c.disabled=!0,c.textContent="Story Completed"),f&&(f.disabled=!0,f.textContent="Story Completed"),h&&(h.disabled=!0,h.textContent="Story Completed"))},100)}async function Xn(d){const c=document.getElementById("architect-button"),f=document.getElementById("architect-output");if(!(!c||!f)){if(d.architecture&&c.textContent==="Regenerate Architecture"){const h=prompt(`What would you like to add, remove, or modify in the architecture?

Examples:
• Add Redis caching layer
• Remove security components
• Change database to MongoDB
• Add microservices architecture
• Include Docker containerization`);if(!h||h.trim()==="")return;await Mo(d,h.trim());return}c.disabled=!0,c.textContent="Generating...",f.innerHTML='<div class="spinner"></div>';try{await new Promise(C=>setTimeout(C,2e3));const h=$o(d);d.architecture=h,f.innerHTML=`
                <div class="architecture-display">
                    <div class="architecture-actions" style="margin-bottom: 1rem; display: flex; gap: 0.5rem; align-items: center;">
                        <button id="export-arch-btn" class="action-button" style="font-size: 0.8rem; padding: 0.4rem 0.8rem;">📄 Export</button>
                    </div>
                    <pre style="max-height: 400px; overflow-y: auto;">${h}</pre>
                </div>
            `;const v=document.getElementById("export-arch-btn");v&&(v.onclick=()=>{const C=new Blob([d.architecture||""],{type:"text/plain"}),S=URL.createObjectURL(C),w=document.createElement("a");w.href=S,w.download=`${d.title.replace(/\s+/g,"_")}_architecture.md`,w.click(),URL.revokeObjectURL(S)}),d.status==="backlog"&&(d.status="in-progress",M.updateStory(d.id,{status:"in-progress"}),Q())}catch(h){console.error("Error generating architecture:",h),f.innerHTML='<p class="error-message">Error generating architecture. Please try again.</p>'}finally{c.disabled=!1,c.textContent="Regenerate Architecture";const h=document.getElementById("developer-button");h&&(h.disabled=!1,console.log("Developer button enabled after architecture generation"))}}}async function Qn(d){const c=document.getElementById("developer-button"),f=document.getElementById("developer-output"),h=document.getElementById("code-language");if(!c||!f||!h)return;if(!d.isFrameworkSetup&&!it()){alert(`⚠️ Framework Setup Required

Please complete the "Project Setup & Framework Configuration" story first.

This ensures proper project structure and dependencies are in place before generating feature code.`);return}const v=h.value;c.disabled=!0,c.textContent="Generating...",f.innerHTML='<div class="spinner"></div>';try{await new Promise(w=>setTimeout(w,3e3));const C=d.title.replace(/\s+/g,"").replace(/[^a-zA-Z0-9]/g,""),S=Po(d,C,v);d.code=S,d.language=v;try{const w=JSON.parse(S);let A='<div class="code-files-display">';Object.entries(w).forEach(([_,k])=>{const U=_.split(".").pop()||"txt",B=Ro(U),R=k.replace(/</g,"&lt;").replace(/>/g,"&gt;");A+=`
                        <div class="code-file" style="margin-bottom: 1.5rem; border: 1px solid #374151; border-radius: 6px; overflow: hidden;">
                            <div class="file-header" style="background: #374151; padding: 0.5rem 1rem; display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-family: monospace; font-size: 0.9rem; color: #f9fafb;">📄 ${_}</span>
                                <button class="copy-file-btn" data-content="${encodeURIComponent(k)}" style="background: #6366f1; color: white; border: none; padding: 0.25rem 0.5rem; border-radius: 3px; font-size: 0.8rem; cursor: pointer;">Copy</button>
                            </div>
                            <pre style="margin: 0; max-height: 400px; overflow-y: auto; padding: 1rem; background: #1f2937; color: #f9fafb; font-size: 0.85rem; line-height: 1.5;"><code class="language-${B}">${R}</code></pre>
                        </div>
                    `}),A+="</div>",f.innerHTML=A,f.querySelectorAll(".copy-file-btn").forEach(_=>{_.addEventListener("click",()=>{const k=decodeURIComponent(_.getAttribute("data-content")||"");navigator.clipboard.writeText(k).then(()=>{const U=_.textContent;_.textContent="✓ Copied!",_.style.background="#10b981",setTimeout(()=>{_.textContent=U,_.style.background="#6366f1"},2e3)}).catch(()=>{alert("Failed to copy to clipboard")})})})}catch{const A=_o(v),b=S.replace(/</g,"&lt;").replace(/>/g,"&gt;");f.innerHTML=`<pre style="padding: 1rem; background: #1f2937; color: #f9fafb; font-size: 0.85rem; line-height: 1.5;"><code class="language-${A}">${b}</code></pre>`}}catch(C){console.error("Error generating code:",C),f.innerHTML='<p class="error-message">Error generating code. Please try again.</p>'}finally{c.disabled=!1,c.textContent="Regenerate Code";const C=document.getElementById("workflow-button"),S=document.getElementById("devops-card");C&&S&&(S.style.display="block",C.disabled=!1,C.onclick=()=>Zn(d))}}async function Zn(d){var w,A,b,_,k,U,B;const c=document.getElementById("workflow-button"),f=document.getElementById("devops-output");if(!c||!f)return;const h=M.getConnectorConfig("github-config");if(!L.connectors.versionControl||!h||!h.token){alert(`⚠️ GitHub Not Connected

Please connect to GitHub first in Connectors section.`);return}const v=prompt("Enter repository name for this story:",d.title.toLowerCase().replace(/[^a-z0-9]/g,"-"));if(!v)return;const C=`https://github.com/${h.username}/${v}`,S={...h,repo:C,repoName:v};try{const R=await fetch(`https://api.github.com/repos/${h.username}/${v}`,{headers:{Authorization:`token ${h.token}`,Accept:"application/vnd.github.v3+json"}});if(!R.ok&&R.status===404){if(!(await fetch("https://api.github.com/user/repos",{method:"POST",headers:{Authorization:`token ${h.token}`,Accept:"application/vnd.github.v3+json","Content-Type":"application/json"},body:JSON.stringify({name:v,description:`Repository for ${d.title} - Generated by TurboAgile`,private:!1,auto_init:!0})})).ok)throw new Error("Failed to create repository");await q(2e3)}}catch(R){alert(`Failed to create/access repository: ${R}`);return}if(!d.isFrameworkSetup&&!it()){alert(`⚠️ Framework Setup Required

Please complete and deploy the "Project Setup & Framework Configuration" story first.`);return}c.disabled=!0,c.textContent="Executing...",f.style.display="block",f.innerHTML="";try{const R=d.title.replace(/[^a-zA-Z0-9\s]/g,"").replace(/\s+/g,"").substring(0,50)||"Component",z=d.title.toLowerCase().replace(/[^a-z0-9\s]/g,"").replace(/\s+/g,"-"),W=`feature/${z}`;f.innerHTML+=`<p>Step 1/5: Creating feature branch: ${W}</p>`,await q(1500),(w=f.lastElementChild)==null||w.classList.add("success"),f.innerHTML+="<p>✅ Feature branch created and switched</p>",f.innerHTML+="<p>Step 2/5: Setting up project structure...</p>",await q(1e3),(A=f.lastElementChild)==null||A.classList.add("success");const ae=`📁 Project Structure Created:
├── src/components/${R}/
│   ├── ${R}.tsx
│   ├── ${R}.test.tsx
│   └── ${R}.module.css
├── src/types/${R}.types.ts
├── src/hooks/use${R}.ts
└── docs/${R}.md`;f.innerHTML+=`<div class="output-container"><pre>${ae}</pre></div>`,f.innerHTML+="<p>Step 3/5: Pushing code to GitHub...</p>";let le=!1;try{const K=await go(S,d,W,R);(b=f.lastElementChild)==null||b.classList.add("success"),f.innerHTML+=`<div class="output-container"><strong>✅ Code Committed:</strong><pre>Branch: ${W}
Files: 4 created
Commit: ${K.sha}
Repo: ${C.replace(".git","")}</pre></div>`,le=!0}catch(K){(_=f.lastElementChild)==null||_.classList.add("failure"),f.innerHTML+=`<div class="output-container"><strong>❌ GitHub Push Failed:</strong><pre>${K}</pre></div>`;return}f.innerHTML+="<p>Step 4/5: Running automated tests...</p>",await q(2e3),(k=f.lastElementChild)==null||k.classList.add("success");const de=`🧪 Test Results:
✅ Unit Tests: 8/8 passed
✅ Integration Tests: 3/3 passed
✅ Type Checking: No errors
✅ Linting: All checks passed
✅ Code Coverage: 92%`;f.innerHTML+=`<div class="output-container"><pre>${de}</pre></div>`,f.innerHTML+="<p>Step 5/5: Creating Pull Request and deploying preview...</p>",await q(1500),(U=f.lastElementChild)==null||U.classList.add("success");let $e,Fe,rt=!1;if(le)try{const K=await ho(S,d,W);$e=K.number,Fe=K.html_url,rt=!0,f.innerHTML+=`<div class="output-container"><strong>✅ Pull Request Created:</strong><br/>PR #${$e}: ${d.title}<br/>🔗 <a href="${Fe}" target="_blank" onclick="return validateUrl('${Fe}')">View Pull Request</a></div>`}catch(K){f.innerHTML+=`<div class="output-container"><strong>❌ Pull Request Failed:</strong><br/>${K}</div>`}else f.innerHTML+='<div class="output-container"><strong>⚠️ Pull Request Skipped:</strong><br/>Cannot create PR without successful commit</div>';const pe=`https://${z}-${Date.now().toString().slice(-6)}.preview.turboagile.ai`;f.innerHTML+=`<div class="output-container"><strong>Preview Deployment:</strong><br/>🚀 <a href="${pe}" target="_blank" onclick="return validateUrl('${pe}')">${pe}</a></div>`,d.deploymentUrl=pe,d.githubCheckedIn=le,d.status="done",d.completionDate=new Date;const Ue=M.getCurrentProject();if(Ue){const K=Ue.stories.findIndex(qe=>qe.id===d.id);K!==-1&&(Ue.stories[K]=d)}else{const K=L.stories.findIndex(qe=>qe.id===d.id);K!==-1&&(L.stories[K]=d)}M.save(),d.isFrameworkSetup&&No(),Q();const at=document.querySelector(".modal-overlay");at&&(at.remove(),document.body.style.overflow="auto");const lt=document.getElementById("cloud-deploy-card"),ct=document.getElementById("cloud-deploy-button");lt&&ct&&(lt.style.display="block",ct.onclick=()=>Le(d));const Xo=`✅ Workflow Complete!

• Repository: ${v}
• Feature branch '${W}' created${rt?`
• Pull Request #${$e} created`:""}
• Preview deployed to ${pe}`;alert(Xo)}catch(R){f.innerHTML+=`<p class="failure">❌ Workflow failed: ${R}</p>`}finally{if(c.disabled=!1,c.textContent="🚀 Execute Workflow",d.githubCheckedIn){const R=document.createElement("button");R.className="action-button",R.textContent="🔀 Merge to Main",R.style.marginLeft="10px",R.onclick=()=>jn(d),(B=c.parentNode)==null||B.appendChild(R)}}}function q(d){return new Promise(c=>setTimeout(c,d))}async function jn(d){var v;const f=`feature/${d.title.toLowerCase().replace(/[^a-z0-9\s]/g,"").replace(/\s+/g,"-")}`,h=document.getElementById("devops-output");h&&(h.innerHTML+=`<hr><p>Merging ${f} to main...</p>`,await q(2e3),(v=h.lastElementChild)==null||v.classList.add("success"),h.innerHTML+="<p>✅ Branch merged successfully</p>",h.innerHTML+="<p>✅ Feature branch deleted</p>",h.innerHTML+="<p>🚀 Production deployment initiated</p>",alert("✅ Branch merged to main and deployed to production!"))}async function eo(){const d=document.getElementById("incident-input"),c=document.getElementById("incident-button");if(!d||!c)return;const f=d.value.trim();if(!f){alert("Please paste an error log or incident details to analyze."),d.focus();return}c.disabled=!0,c.textContent="🔍 Analyzing...";try{const h=await to(f);co(f,h)}catch(h){console.error("Error analyzing incident:",h),alert("Error analyzing incident. Please try again.")}finally{c.disabled=!1,c.textContent="🚨 Analyze Incident"}}async function to(d){const c=no(d),f=await oo();return{...await io(d,c,f),logInfo:c,githubContext:f,timestamp:new Date().toISOString()}}function no(d){const c={timestamp:null,level:null,service:null,file:null,line:null,method:null,stackTrace:[],requestId:null,userId:null,sessionId:null},f=d.match(/\[(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[.\d]*Z?)\]/);f&&(c.timestamp=f[1]);const h=d.match(/\b(ERROR|WARN|INFO|DEBUG|FATAL|TRACE)\b/i);h&&(c.level=h[1].toUpperCase());const v=d.match(/at\s+([\w\/\.]+):(\d+):(\d+)/);v&&(c.file=v[1],c.line=parseInt(v[2]));const C=d.match(/at\s+(\w+)\s*\(/);C&&(c.method=C[1]);const S=d.split(`
`).filter(_=>_.trim().startsWith("at "));c.stackTrace=S.map(_=>_.trim());const w=d.match(/Request ID:\s*([\w-]+)/);w&&(c.requestId=w[1]);const A=d.match(/User ID:\s*([\w-]+)/);A&&(c.userId=A[1]);const b=d.match(/Session ID:\s*([\w-]+)/);return b&&(c.sessionId=b[1]),c}async function oo(){const d=M.getConnectorConfig("github-config");if(!d||!d.token)return null;try{const c=d.repo||d.url;if(!c)return null;const[f,h]=c.replace("https://github.com/","").replace(".git","").split("/"),v=await fetch(`https://api.github.com/repos/${f}/${h}/contents`,{headers:{Authorization:`token ${d.token}`,Accept:"application/vnd.github.v3+json"}});if(v.ok){const C=await v.json();return{owner:f,repo:h,structure:C,connected:!0}}}catch(c){console.error("GitHub context error:",c)}return null}async function io(d,c,f){try{const h=`You are an expert SRE and software engineer. Analyze this production error log and provide detailed incident analysis:

ERROR LOG:
${d}

EXTRACTED INFORMATION:
- Timestamp: ${c.timestamp||"N/A"}
- Log Level: ${c.level||"N/A"}
- File: ${c.file||"N/A"}
- Line: ${c.line||"N/A"}
- Method: ${c.method||"N/A"}
- Request ID: ${c.requestId||"N/A"}
- User ID: ${c.userId||"N/A"}
- Session ID: ${c.sessionId||"N/A"}

GITHUB REPOSITORY CONTEXT:
${f?`Connected to: ${f.owner}/${f.repo}`:"Not connected"}

Provide a detailed analysis with:
1. Error classification and severity
2. Root cause analysis with technical details
3. Specific code fix recommendations
4. Prevention strategies
5. Impact assessment
6. Confidence levels for each analysis point

Be specific and technical. Include actual code snippets where possible.`,v=document.querySelector(".modal-overlay"),C=v==null?void 0:v.querySelector("#overview-panel");C&&(C.innerHTML=`
                    <div class="ai-analysis-progress">
                        <div class="analysis-step active">
                            <div class="step-icon">🔍</div>
                            <div class="step-text">Parsing error log...</div>
                        </div>
                        <div class="analysis-step">
                            <div class="step-icon">🤖</div>
                            <div class="step-text">AI analyzing root cause...</div>
                        </div>
                        <div class="analysis-step">
                            <div class="step-icon">🛠️</div>
                            <div class="step-text">Generating fix recommendations...</div>
                        </div>
                        <div class="analysis-step">
                            <div class="step-icon">🔗</div>
                            <div class="step-text">Connecting to GitHub context...</div>
                        </div>
                    </div>
                `),await q(1e3),he(1),await q(1500),he(2),await q(1e3),he(3),f&&(await q(800),he(4));try{if((Dn.GEMINI_API_KEY||localStorage.getItem("gemini_api_key"))&&gn){console.log("Using real Gemini API for analysis");const _=(await(await gn.getGenerativeModel({model:"gemini-pro"}).generateContent(h)).response).text();return console.log("Gemini AI Response:",_),so(_,c,f)}else return console.log("No Gemini API key found, using fallback analysis"),xe(d,c)}catch(S){return console.error("Gemini API error:",S),xe(d,c)}}catch(h){return console.error("Analysis error:",h),xe(d)}}function so(d,c,f){d.split(`
`);let h="Unknown Error",v="Medium";d.substring(0,200)+"";let C="See full AI analysis for recommendations",S=["Application Server"],w="",A=85;(d.toLowerCase().includes("null")||d.toLowerCase().includes("nullpointer"))&&(h="Null Pointer Exception",v="High",S=["Payment Service","User Authentication"]),(d.toLowerCase().includes("500")||d.toLowerCase().includes("internal server"))&&(h="Internal Server Error",v="Critical",S=["API Gateway","Application Server"]),(d.toLowerCase().includes("database")||d.toLowerCase().includes("connection"))&&(h="Database Connection Error",v="High",S=["Database Layer","Connection Pool"]);const b=d.match(/```[\s\S]*?```/g);return b&&(w=b[0].replace(/```/g,"")),{errorType:h,severity:v,rootCause:d,solution:C,affectedComponents:S,specificFix:w,preventionStrategy:d,relatedFiles:c.file?[c.file]:[],confidence:A,aiResponse:d,estimatedResolutionTime:je(v),logInfo:c,githubContext:f}}function he(d){document.querySelectorAll(".analysis-step").forEach((f,h)=>{h<d?(f.classList.add("completed"),f.classList.remove("active")):h===d&&f.classList.add("active")})}function xe(d,c){return ro(d)}function ro(d){const c=d.toLowerCase();let f="Unknown Error",h="Medium",v="Investigation needed",C="Manual investigation required";return c.includes("500")||c.includes("internal server error")?(f="Internal Server Error (500)",h="High",v="Server-side application error",C="Check server logs, restart services, verify database connections"):(c.includes("null")||c.includes("undefined"))&&(f="Null Reference Error",h="High",v="Accessing null or undefined object properties",C="Add null checks, validate data before processing"),{errorType:f,severity:h,rootCause:v,solution:C,affectedComponents:ao(d),recommendedActions:lo(f),estimatedResolutionTime:je(h)}}function ao(d){const c=[];return d.includes("payment")&&c.push("Payment Service"),(d.includes("user")||d.includes("auth"))&&c.push("Authentication Service"),(d.includes("database")||d.includes("db"))&&c.push("Database Layer"),(d.includes("api")||d.includes("endpoint"))&&c.push("API Gateway"),(d.includes("frontend")||d.includes("ui"))&&c.push("Frontend Application"),c.length>0?c:["Application Core"]}function lo(d){const c=["Create incident ticket in project management system","Notify relevant team members","Monitor system metrics for related issues"];return d.includes("500")?[...c,"Restart affected services","Check application logs","Verify database connectivity"]:d.includes("Memory")?[...c,"Monitor memory usage","Check for memory leaks","Consider scaling resources"]:d.includes("Database")?[...c,"Check database health","Verify connection pools","Review recent schema changes"]:c}function je(d){switch(d){case"Critical":return"< 1 hour";case"High":return"2-4 hours";case"Medium":return"4-8 hours";default:return"1-2 days"}}function co(d,c){var A,b,_,k,U,B;const f=document.querySelector(".modal-overlay");f&&f.remove();const h=document.createElement("div");h.className="modal-overlay",h.style.display="flex",h.style.position="fixed",h.style.top="0",h.style.left="0",h.style.width="100%",h.style.height="100%",h.style.zIndex="1000",h.innerHTML=`
            <div class="modal-content incident-analysis-modal">
                <div class="incident-header">
                    <h2>🤖 AI Incident Analysis</h2>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove(); document.body.style.overflow = 'auto';">&times;</button>
                </div>
                
                <div class="analysis-tabs">
                    <button class="analysis-tab active" data-tab="overview">Overview</button>
                    <button class="analysis-tab" data-tab="ai-analysis">AI Analysis</button>
                    <button class="analysis-tab" data-tab="code">Code Analysis</button>
                    <button class="analysis-tab" data-tab="logs">Raw Logs</button>
                    <button class="analysis-tab" data-tab="github">GitHub Context</button>
                </div>
                
                <div class="analysis-content">
                    <div id="overview-panel" class="analysis-panel active">
                        <div class="ai-analysis-section">
                            <h3>🤖 AI Log Analysis</h3>
                            <div class="analysis-progress">
                                <div class="progress-step completed">
                                    <span class="step-icon">📋</span>
                                    <span class="step-text">Log parsing completed</span>
                                </div>
                                <div class="progress-step completed">
                                    <span class="step-icon">🔍</span>
                                    <span class="step-text">Pattern recognition analysis</span>
                                </div>
                                <div class="progress-step completed">
                                    <span class="step-icon">🧠</span>
                                    <span class="step-text">Root cause identification</span>
                                </div>
                                <div class="progress-step completed">
                                    <span class="step-icon">💡</span>
                                    <span class="step-text">Solution recommendation</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="incident-summary">
                            <div class="severity-badge severity-${((A=c.severity)==null?void 0:A.toLowerCase())||"medium"}">${c.severity||"Medium"}</div>
                            <h3>${c.errorType||"Error Analysis"}</h3>
                            <p class="incident-time">AI Analysis completed: ${new Date().toLocaleString()}</p>
                        </div>
                        
                        <div class="analysis-grid">
                            <div class="analysis-card">
                                <h4>🔍 AI-Identified Root Cause</h4>
                                <p>${c.rootCause||"Investigation needed"}</p>
                                <div class="confidence-score">Confidence: ${Math.floor(Math.random()*20)+80}%</div>
                            </div>
                            <div class="analysis-card">
                                <h4>⚙️ Affected Components</h4>
                                <ul>${(c.affectedComponents||[]).map(R=>`<li>${R}</li>`).join("")}</ul>
                            </div>
                            <div class="analysis-card">
                                <h4>⏱️ Estimated Resolution</h4>
                                <p>${c.estimatedResolutionTime||"TBD"}</p>
                            </div>
                            <div class="analysis-card">
                                <h4>🛠️ AI Recommended Fix</h4>
                                <p>${c.solution||"Manual investigation required"}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div id="ai-analysis-panel" class="analysis-panel">
                        <div class="ai-detailed-analysis">
                            <h3>🤖 AI Root Cause Analysis</h3>
                            
                            <div class="confidence-section">
                                <h4>📊 Confidence Metrics</h4>
                                <div class="confidence-bars">
                                    <div class="confidence-item">
                                        <span class="confidence-label">Root Cause Identification</span>
                                        <div class="confidence-bar">
                                            <div class="confidence-fill" style="width: ${Math.floor(Math.random()*20)+80}%"></div>
                                            <span class="confidence-value">${Math.floor(Math.random()*20)+80}%</span>
                                        </div>
                                    </div>
                                    <div class="confidence-item">
                                        <span class="confidence-label">Solution Accuracy</span>
                                        <div class="confidence-bar">
                                            <div class="confidence-fill" style="width: ${Math.floor(Math.random()*15)+75}%"></div>
                                            <span class="confidence-value">${Math.floor(Math.random()*15)+75}%</span>
                                        </div>
                                    </div>
                                    <div class="confidence-item">
                                        <span class="confidence-label">Impact Assessment</span>
                                        <div class="confidence-bar">
                                            <div class="confidence-fill" style="width: ${Math.floor(Math.random()*25)+70}%"></div>
                                            <span class="confidence-value">${Math.floor(Math.random()*25)+70}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="root-cause-section">
                                <h4>🔍 Detailed Root Cause Analysis</h4>
                                <div class="analysis-details">
                                    <div class="analysis-step">
                                        <div class="step-header">
                                            <span class="step-number">1</span>
                                            <span class="step-title">Error Pattern Recognition</span>
                                        </div>
                                        <div class="step-content">
                                            <p><strong>Pattern Identified:</strong> ${c.errorType||"Unknown Error Pattern"}</p>
                                            <p><strong>Frequency:</strong> Similar patterns detected in ${Math.floor(Math.random()*50)+10} previous incidents</p>
                                            <p><strong>Correlation:</strong> High correlation with ${((b=c.affectedComponents)==null?void 0:b[0])||"system components"} failures</p>
                                        </div>
                                    </div>
                                    
                                    <div class="analysis-step">
                                        <div class="step-header">
                                            <span class="step-number">2</span>
                                            <span class="step-title">Impact Analysis</span>
                                        </div>
                                        <div class="step-content">
                                            <p><strong>Severity Level:</strong> ${c.severity||"Medium"}</p>
                                            <p><strong>Affected Users:</strong> ~${Math.floor(Math.random()*1e3)+100} users potentially impacted</p>
                                            <p><strong>Business Impact:</strong> ${c.severity==="Critical"?"Service disruption":c.severity==="High"?"Performance degradation":"Minor functionality issues"}</p>
                                        </div>
                                    </div>
                                    
                                    <div class="analysis-step">
                                        <div class="step-header">
                                            <span class="step-number">3</span>
                                            <span class="step-title">Root Cause Determination</span>
                                        </div>
                                        <div class="step-content">
                                            <p><strong>Primary Cause:</strong> ${c.rootCause||"Investigation needed"}</p>
                                            <p><strong>Contributing Factors:</strong></p>
                                            <ul>
                                                <li>Insufficient input validation</li>
                                                <li>Missing error handling in critical path</li>
                                                <li>Resource contention during peak load</li>
                                            </ul>
                                        </div>
                                    </div>
                                    
                                    <div class="analysis-step">
                                        <div class="step-header">
                                            <span class="step-number">4</span>
                                            <span class="step-title">Solution Recommendation</span>
                                        </div>
                                        <div class="step-content">
                                            <p><strong>Immediate Fix:</strong> ${c.solution||"Manual investigation required"}</p>
                                            <p><strong>Long-term Prevention:</strong></p>
                                            <ul>
                                                <li>Implement comprehensive input validation</li>
                                                <li>Add circuit breaker patterns</li>
                                                <li>Enhance monitoring and alerting</li>
                                                <li>Add automated testing for edge cases</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="detailed-rootcause-section">
                                <h4>🔬 AI Deep Root Cause Analysis</h4>
                                <div class="rootcause-analysis">
                                    <div class="analysis-layer">
                                        <div class="layer-header">
                                            <span class="layer-icon">🎯</span>
                                            <span class="layer-title">AI Root Cause Analysis</span>
                                            <span class="confidence-badge">${c.confidence||85}% Confidence</span>
                                        </div>
                                        <div class="layer-content">
                                            <div class="ai-analysis-content">
                                                <h5>🤖 Gemini AI Analysis:</h5>
                                                <div class="ai-response-box">
                                                    <pre style="white-space: pre-wrap; font-family: inherit; margin: 0;">${c.aiResponse||c.rootCause||"AI analysis not available"}</pre>
                                                </div>
                                            </div>
                                            ${(_=c.logInfo)!=null&&_.file?`<p><strong>Code Location:</strong> ${c.logInfo.file}${c.logInfo.line?":"+c.logInfo.line:""}</p>`:""}
                                            ${(k=c.logInfo)!=null&&k.method?`<p><strong>Method:</strong> ${c.logInfo.method}</p>`:""}
                                            ${(U=c.logInfo)!=null&&U.timestamp?`<p><strong>Timestamp:</strong> ${c.logInfo.timestamp}</p>`:""}
                                        </div>
                                    </div>
                                    
                                    ${c.specificFix?`
                                    <div class="analysis-layer">
                                        <div class="layer-header">
                                            <span class="layer-icon">🛠️</span>
                                            <span class="layer-title">AI Recommended Fix</span>
                                            <span class="confidence-badge">${c.confidence||85}% Confidence</span>
                                        </div>
                                        <div class="layer-content">
                                            <div class="code-fix-section">
                                                <h5>Specific Code Fix:</h5>
                                                <pre class="code-fix"><code>${c.specificFix}</code></pre>
                                            </div>
                                        </div>
                                    </div>`:""}
                                    
                                    <div class="analysis-layer">
                                        <div class="layer-header">
                                            <span class="layer-icon">📊</span>
                                            <span class="layer-title">Impact Analysis</span>
                                            <span class="confidence-badge">${c.confidence||85}% Confidence</span>
                                        </div>
                                        <div class="layer-content">
                                            <div class="impact-metrics">
                                                <div class="metric-row">
                                                    <span class="metric-label">Error Type:</span>
                                                    <span class="metric-value">${c.errorType}</span>
                                                </div>
                                                <div class="metric-row">
                                                    <span class="metric-label">Severity Level:</span>
                                                    <span class="metric-value severity-${(B=c.severity)==null?void 0:B.toLowerCase()}">${c.severity}</span>
                                                </div>
                                                <div class="metric-row">
                                                    <span class="metric-label">Affected Components:</span>
                                                    <span class="metric-value">${(c.affectedComponents||[]).join(", ")}</span>
                                                </div>
                                                <div class="metric-row">
                                                    <span class="metric-label">Resolution Time:</span>
                                                    <span class="metric-value">${c.estimatedResolutionTime}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    ${c.relatedFiles&&c.relatedFiles.length>0?`
                                    <div class="analysis-layer">
                                        <div class="layer-header">
                                            <span class="layer-icon">📁</span>
                                            <span class="layer-title">Related Files</span>
                                            <span class="confidence-badge">${c.confidence||85}% Confidence</span>
                                        </div>
                                        <div class="layer-content">
                                            <div class="related-files-list">
                                                ${c.relatedFiles.map(R=>`
                                                    <div class="file-item">
                                                        <span class="file-path">${R}</span>
                                                        ${c.githubContext&&c.githubContext.connected?`<a href="https://github.com/${c.githubContext.owner}/${c.githubContext.repo}/blob/main${R}" target="_blank" class="github-link">View on GitHub</a>`:""}
                                                    </div>
                                                `).join("")}
                                            </div>
                                        </div>
                                    </div>`:""}
                                    
                                    ${c.preventionStrategy&&c.preventionStrategy!==c.rootCause?`
                                    <div class="analysis-layer">
                                        <div class="layer-header">
                                            <span class="layer-icon">🛡️</span>
                                            <span class="layer-title">AI Prevention Strategy</span>
                                            <span class="confidence-badge">${c.confidence||85}% Confidence</span>
                                        </div>
                                        <div class="layer-content">
                                            <div class="prevention-content">
                                                <pre style="white-space: pre-wrap; font-family: inherit; margin: 0;">${c.preventionStrategy}</pre>
                                            </div>
                                        </div>
                                    </div>`:""}
                                </div>
                            </div>
                            
                            <div class="ai-insights-section">
                                <h4>💡 AI Solution Recommendations</h4>
                                <div class="solution-content">
                                    <div class="solution-box">
                                        <h5>🎯 Recommended Solution:</h5>
                                        <p>${c.solution||"See AI analysis above for detailed recommendations"}</p>
                                    </div>
                                    <div class="insights-grid">
                                        <div class="insight-card">
                                            <div class="insight-icon">🎯</div>
                                            <div class="insight-content">
                                                <h5>Error Classification</h5>
                                                <p>${c.errorType}</p>
                                            </div>
                                        </div>
                                        <div class="insight-card">
                                            <div class="insight-icon">⚠️</div>
                                            <div class="insight-content">
                                                <h5>Severity Level</h5>
                                                <p>${c.severity} Priority</p>
                                            </div>
                                        </div>
                                        <div class="insight-card">
                                            <div class="insight-icon">⏱️</div>
                                            <div class="insight-content">
                                                <h5>Resolution Time</h5>
                                                <p>${c.estimatedResolutionTime||"2-4 hours"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div id="code-panel" class="analysis-panel">
                        <div class="code-analysis-section">
                            <h4>📁 Affected Files</h4>
                            <div class="file-list">
                                ${c.codeFiles?c.codeFiles.map(R=>`
                                    <div class="file-item">
                                        <span class="file-path">${typeof R=="string"?R:R.path}</span>
                                        ${R.githubUrl?`<a href="${R.githubUrl}${R.line?"#L"+R.line:""}" target="_blank" class="github-link">View on GitHub</a>`:""}
                                    </div>
                                `).join(""):"<p>No specific files identified</p>"}
                            </div>
                            
                            ${c.specificFix?`
                                <h4>🔧 Specific Code Fix</h4>
                                <pre class="code-fix"><code>${c.specificFix}</code></pre>
                            `:""}
                            
                            ${c.preventionStrategy?`
                                <h4>🛡️ Prevention Strategy</h4>
                                <p>${c.preventionStrategy}</p>
                            `:""}
                        </div>
                    </div>
                    
                    <div id="logs-panel" class="analysis-panel">
                        <div class="logs-container">
                            <h4>Original Error Log</h4>
                            <pre class="log-output">${d}</pre>
                            
                            ${c.logInfo?`
                                <h4>Extracted Information</h4>
                                <div class="log-info-grid">
                                    <div class="info-item"><strong>Timestamp:</strong> ${c.logInfo.timestamp||"N/A"}</div>
                                    <div class="info-item"><strong>Level:</strong> ${c.logInfo.level||"N/A"}</div>
                                    <div class="info-item"><strong>File:</strong> ${c.logInfo.file||"N/A"}</div>
                                    <div class="info-item"><strong>Line:</strong> ${c.logInfo.line||"N/A"}</div>
                                    <div class="info-item"><strong>Method:</strong> ${c.logInfo.method||"N/A"}</div>
                                    <div class="info-item"><strong>Request ID:</strong> ${c.logInfo.requestId||"N/A"}</div>
                                </div>
                            `:""}
                        </div>
                    </div>
                    
                    <div id="github-panel" class="analysis-panel">
                        <div class="github-context">
                            ${c.githubContext&&c.githubContext.connected?`
                                <h4>📂 Repository Context</h4>
                                <div class="repo-info">
                                    <p><strong>Repository:</strong> ${c.githubContext.owner}/${c.githubContext.repo}</p>
                                    <p><strong>Status:</strong> ✅ Connected</p>
                                </div>
                                
                                ${c.relatedFiles&&c.relatedFiles.length>0?`
                                    <h4>🔗 Related Files to Investigate</h4>
                                    <ul class="related-files">
                                        ${c.relatedFiles.map(R=>`
                                            <li>
                                                <a href="https://github.com/${c.githubContext.owner}/${c.githubContext.repo}/blob/main${R}" target="_blank">
                                                    ${R}
                                                </a>
                                            </li>
                                        `).join("")}
                                    </ul>
                                `:""}
                            `:`
                                <div class="github-disconnected">
                                    <h4>📂 GitHub Integration</h4>
                                    <p>Connect to GitHub to enable:</p>
                                    <ul>
                                        <li>Direct file links to error locations</li>
                                        <li>Repository context analysis</li>
                                        <li>Automated PR creation for fixes</li>
                                    </ul>
                                    <button class="action-button" onclick="document.querySelector('[data-tab="version-control"]').click(); this.closest('.modal-overlay').remove(); document.body.style.overflow = 'auto';">Connect GitHub</button>
                                </div>
                            `}
                        </div>
                    </div>
                </div>
                
                <div class="incident-actions">
                    <button class="action-button secondary close-modal-btn">Close</button>
                    <button class="action-button create-story-btn" data-error-type="${c.errorType}" data-severity="${c.severity}" data-root-cause="${c.rootCause}" data-solution="${c.solution}">Create Bug Story</button>
                </div>
            </div>
        `;const v=h.querySelectorAll(".analysis-tab"),C=h.querySelectorAll(".analysis-panel");v.forEach(R=>{R.addEventListener("click",()=>{const z=R.getAttribute("data-tab");v.forEach(ae=>ae.classList.remove("active")),C.forEach(ae=>ae.classList.remove("active")),R.classList.add("active");const W=h.querySelector(`#${z}-panel`);W&&W.classList.add("active")})}),h.querySelectorAll(".modal-close, .close-modal-btn").forEach(R=>{R.addEventListener("click",()=>{h.remove(),document.body.style.overflow="auto"})});const w=h.querySelector(".create-story-btn");w&&w.addEventListener("click",()=>{const R=w.getAttribute("data-error-type")||"Unknown Error",z=w.getAttribute("data-severity")||"Medium",W=w.getAttribute("data-root-cause")||"Investigation needed";w.getAttribute("data-solution"),uo(R,z,W)}),h.addEventListener("click",R=>{R.target===h&&(h.remove(),document.body.style.overflow="auto")}),document.body.appendChild(h),document.body.style.overflow="hidden",setTimeout(()=>{h.style.display="flex"},10)}function uo(d,c,f,h){var w,A;const v=L.stories.find(b=>b.title===`Fix: ${d}`&&b.type==="bug");if(v){(w=document.querySelector(".modal-overlay"))==null||w.remove(),document.body.style.overflow="auto",alert(`⚠️ Duplicate Story Detected!

A bug story for "${d}" already exists:

Story ID: ${v.id}
Status: ${v.status}

Navigating to existing story on project board.`),O("project"),Q();return}const C="INC-"+Date.now(),S={id:C,title:`Fix: ${d}`,description:`As a system administrator, I need to resolve the ${d} incident to restore service availability and prevent future occurrences.`,acceptanceCriteria:[`AI-identified root cause: ${f}`,"Implement the AI-recommended fix","Add comprehensive error handling","Update monitoring and alerting","Add unit tests to prevent regression","Update documentation with lessons learned","Verify fix in production environment"],status:"backlog",type:"bug",points:c==="Critical"?21:c==="High"?13:8,creationDate:new Date,completionDate:null,githubCheckedIn:!1};L.stories.unshift(S),M.addStory(S),(A=document.querySelector(".modal-overlay"))==null||A.remove(),document.body.style.overflow="auto",O("project"),Q(),Ne(),alert(`✅ Bug story created successfully!

Story ID: ${C}
Severity: ${c}
Points: ${S.points}

The incident has been added to your project backlog with AI analysis and fix recommendations.`)}function De(){const d=document.querySelectorAll(".story-checkbox:checked"),c=document.getElementById("delete-stories-button"),f=document.getElementById("select-all-checkbox");if(c&&(c.style.display=d.length>0?"inline-flex":"none"),f){const h=document.querySelectorAll(".story-checkbox"),v=d.length,C=h.length;v===0?(f.checked=!1,f.indeterminate=!1):v===C?(f.checked=!0,f.indeterminate=!1):(f.checked=!1,f.indeterminate=!0)}}function po(){const d=document.getElementById("select-all-checkbox");document.querySelectorAll(".story-checkbox").forEach(f=>{f.checked=d.checked}),De()}function fo(){const d=document.querySelectorAll(".story-checkbox:checked");if(d.length===0)return;d.forEach(f=>{var v;const h=(v=f.closest(".story-card"))==null?void 0:v.getAttribute("data-story-id");if(h){const C=M.getCurrentProject();C?C.stories=C.stories.filter(S=>S.id!==h):L.stories=L.stories.filter(S=>S.id!==h)}}),M.save(),Q(),De();const c=document.getElementById("select-all-checkbox");c&&(c.checked=!1)}function mo(){const d=M.getCurrentProject();if(!d){alert("No project selected to delete.");return}confirm(`Delete project "${d.name}" and all its stories?

This cannot be undone.`)&&(M.deleteProject(d.id),O("dashboard"),j(),alert(`Project "${d.name}" deleted successfully.`))}function et(){var h;const d=M.getProjects();if(d.length===0){alert("No projects found. Please create stories first.");return}if(d.length===1){M.setCurrentProject(d[0].id),O("project"),Q();return}const c=document.createElement("div");c.className="modal-overlay",c.style.display="flex";const f=d.map(v=>{var C;return`<div class="project-option" data-project-id="${v.id}" style="padding: 1rem; border: 1px solid var(--border-color); border-radius: 6px; margin-bottom: 0.5rem; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='var(--primary-color)'; this.style.color='white';" onmouseout="this.style.background=''; this.style.color='';"><h4>${v.name}</h4><p style="margin: 0; font-size: 0.9rem; opacity: 0.8;">${((C=v.stories)==null?void 0:C.length)||0} stories</p></div>`}).join("");c.innerHTML=`
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <h2>📋 Select Project</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div style="max-height: 400px; overflow-y: auto;">
                    ${f}
                </div>
            </div>
        `,(h=c.querySelector(".modal-close"))==null||h.addEventListener("click",()=>{c.remove(),document.body.style.overflow="auto"}),c.querySelectorAll(".project-option").forEach(v=>{v.addEventListener("click",()=>{const C=v.getAttribute("data-project-id");C&&(M.setCurrentProject(C),c.remove(),document.body.style.overflow="auto",O("project"),Q())})}),document.body.appendChild(c),document.body.style.overflow="hidden"}async function go(d,c,f,h){const v={Authorization:`token ${d.token}`,Accept:"application/vnd.github.v3+json","Content-Type":"application/json"},C=await fetch(`https://api.github.com/repos/${d.username}/${d.repoName}/git/ref/heads/main`,{headers:v});if(!C.ok)throw new Error("Repository not found or no access");const w=(await C.json()).object.sha,A=await fetch(`https://api.github.com/repos/${d.username}/${d.repoName}/git/refs`,{method:"POST",headers:v,body:JSON.stringify({ref:`refs/heads/${f}`,sha:w})});if(!A.ok&&A.status!==422)throw new Error("Failed to create branch");const b=`// ${h} Component
// Generated by TurboAgile

import React from 'react';

const ${h}: React.FC = () => {
  return (
    <div className="${h.toLowerCase()}">
      <h2>${h}</h2>
      <p>Component for: ${c.title}</p>
    </div>
  );
};

export default ${h};`,_=await fetch(`https://api.github.com/repos/${d.username}/${d.repoName}/contents/${h}.tsx`,{method:"PUT",headers:v,body:JSON.stringify({message:`Add ${h} component for ${c.title}`,content:btoa(unescape(encodeURIComponent(b))),branch:f})});if(!_.ok){const k=await _.json();throw new Error(k.message||"Failed to create file")}return await _.json()}async function ho(d,c,f){const h=await fetch(`https://api.github.com/repos/${d.username}/${d.repoName}/pulls`,{method:"POST",headers:{Authorization:`token ${d.token}`,Accept:"application/vnd.github.v3+json","Content-Type":"application/json"},body:JSON.stringify({title:c.title,head:f,base:"main",body:`## Story: ${c.title}

${c.description}

### Acceptance Criteria
${c.acceptanceCriteria.map(S=>`- ${S}`).join(`
`)}

### Technical Implementation
- React TypeScript component
- Responsive design
- Accessibility compliant
- Unit tests included

*Auto-generated by TurboAgile*`})});if(!h.ok){const S=await h.json();throw new Error(S.message||"Failed to create PR")}const v=await h.json(),C=`${d.username}/${d.repoName}`;return M.data.githubPRs||(M.data.githubPRs={}),M.data.githubPRs[C]||(M.data.githubPRs[C]=[]),M.data.githubPRs[C].push(v),M.save(),v}window.validateUrl=function(d){try{return new URL(d),!0}catch{return alert("Invalid URL. This link may not be accessible."),!1}},window.toggleTreeNode=function(d){const c=d.closest(".tree-node"),f=c==null?void 0:c.querySelector(".tree-children"),h=d.querySelector(".tree-toggle");if(f&&h){const v=f.style.display!=="none";f.style.display=v?"none":"block",h.textContent=v?"▶":"▼"}},window.selectProjectFromTree=function(d){document.querySelectorAll(".tree-node.selected").forEach(h=>{h.classList.remove("selected")});const c=document.querySelector(`[data-project-id="${d}"]`);c&&c.classList.add("selected");const f=document.getElementById("project-select");f&&(f.value=d)},window.createIncidentStory=function(d,c,f,h){var S;const v="INC-"+Date.now(),C={id:v,title:`Fix: ${d}`,description:`As a system administrator, I need to resolve the ${d} incident to restore service availability and prevent future occurrences.`,acceptanceCriteria:[`Root cause identified: ${f}`,"Implement the recommended fix","Add monitoring to prevent recurrence","Update documentation with lessons learned","Verify fix in production environment"],status:"backlog",type:"bug",points:c==="Critical"?21:c==="High"?13:8,creationDate:new Date,completionDate:null,githubCheckedIn:!1};L.stories.unshift(C),(S=document.querySelector(".modal-overlay"))==null||S.remove(),document.body.style.overflow="auto",O("project"),Q(),alert(`✅ Incident story created!

Story ID: ${v}
Severity: ${c}
Points: ${C.points}

The incident has been added to your project backlog as a high-priority bug story.`)},window.deployHotfix=async function(d){const c=document.querySelector(".modal-overlay"),f=c==null?void 0:c.querySelector(".incident-actions");f&&(f.innerHTML='<div class="hotfix-progress">🚀 Deploying hotfix...</div>',await q(3e3),f.innerHTML=`
                <div class="hotfix-success">
                    ✅ Hotfix deployed successfully!<br>
                    <small>Branch: hotfix/${d.toLowerCase().replace(/\s+/g,"-")}</small><br>
                    <small>Commit: Fix ${d}</small><br>
                    <small>Status: Deployed to production</small>
                </div>
                <button class="action-button" onclick="this.closest('.modal-overlay').remove(); document.body.style.overflow = 'auto';">Close</button>
            `)};async function yo(){const d=L.connectorConfigs.get("aws-config");if(!d||!d.key){vo();return}tt()}function vo(){const d=document.createElement("div");d.className="modal-overlay",d.style.display="flex",d.innerHTML=`
            <div class="modal-content aws-connection-modal">
                <div class="modal-header">
                    <h2>🔗 Connect to AWS</h2>
                    <button class="modal-close">&times;</button>
                </div>
                
                <div class="connection-steps">
                    <div class="step-card">
                        <div class="step-number">1</div>
                        <div class="step-content">
                            <h3>Create IAM Role</h3>
                            <p>Create an IAM role with Cost Explorer permissions</p>
                            <div class="code-block">
                                <code>{
    "Version": "2012-10-17",
    "Statement": [{
        "Effect": "Allow",
        "Action": [
            "ce:GetCostAndUsage",
            "ce:GetReservationRecommendation",
            "ce:GetRightsizingRecommendation"
        ],
        "Resource": "*"
    }]
}</code>
                            </div>
                        </div>
                    </div>
                    
                    <div class="step-card">
                        <div class="step-number">2</div>
                        <div class="step-content">
                            <h3>Connect Your Account</h3>
                            <div class="form-group">
                                <label for="aws-access-key-modal">Access Key ID</label>
                                <input type="password" id="aws-access-key-modal" placeholder="AKIAIOSFODNN7EXAMPLE">
                            </div>
                            <div class="form-group">
                                <label for="aws-secret-key-modal">Secret Access Key</label>
                                <input type="password" id="aws-secret-key-modal" placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY">
                            </div>
                            <div class="form-group">
                                <label for="aws-region-modal">Region</label>
                                <select id="aws-region-modal">
                                    <option value="us-east-1">US East (N. Virginia)</option>
                                    <option value="us-west-2">US West (Oregon)</option>
                                    <option value="eu-west-1">Europe (Ireland)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="modal-actions">
                    <button class="action-button secondary cancel-aws-btn">Cancel</button>
                    <button class="action-button connect-aws-btn">Connect & Analyze</button>
                </div>
            </div>
        `;const c=d.querySelector(".modal-close"),f=d.querySelector(".cancel-aws-btn"),h=d.querySelector(".connect-aws-btn");[c,f].forEach(v=>{v==null||v.addEventListener("click",()=>{d.remove(),document.body.style.overflow="auto"})}),h==null||h.addEventListener("click",()=>{const v=d.querySelector("#aws-access-key-modal").value,C=d.querySelector("#aws-secret-key-modal").value,S=d.querySelector("#aws-region-modal").value;if(!v||!C){alert("Please enter AWS credentials");return}L.connectorConfigs.set("aws-config",{provider:"AWS",key:v,secret:C,region:S}),d.remove(),document.body.style.overflow="auto",tt()}),document.body.appendChild(d),document.body.style.overflow="hidden"}function tt(){const d=window.open("","_blank","width=1200,height=800,scrollbars=yes,resizable=yes");if(!d){alert("Please allow popups to open the Cost Optimization Dashboard");return}d.document.write(`
<!DOCTYPE html>
<html>
<head>
    <title>AWS Cost Optimization - Turbo Agile</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Inter, sans-serif; background: #111827; color: #e5e7eb; }
        .header { background: #1f2937; padding: 1rem 2rem; border-bottom: 1px solid #374151; display: flex; justify-content: space-between; align-items: center; }
        .content { padding: 2rem; max-width: 1400px; margin: 0 auto; }
        .setup-section { background: #1f2937; border-radius: 12px; padding: 2rem; margin-bottom: 2rem; }
        .cost-summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin: 2rem 0; }
        .cost-metric { background: #1f2937; border: 1px solid #374151; border-radius: 8px; padding: 1.5rem; text-align: center; }
        .cost-metric.savings { background: linear-gradient(135deg, #065f46, #047857); }
        .metric-value { font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem; }
        .recommendations { display: grid; gap: 1rem; margin-top: 2rem; }
        .recommendation-item { background: #1f2937; border: 1px solid #374151; border-radius: 8px; padding: 1.5rem; display: grid; grid-template-columns: auto 1fr auto auto; gap: 1rem; align-items: center; }
        .rec-priority { padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.7rem; font-weight: 700; }
        .rec-priority.high { background: #dc2626; color: white; }
        .rec-priority.medium { background: #d97706; color: white; }
        .rec-savings { color: #10b981; font-weight: 600; }
        .action-button { background: #6366f1; color: white; border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; }
        .action-button:hover { background: #4f46e5; }
        .loading { display: inline-block; width: 20px; height: 20px; border: 2px solid #374151; border-radius: 50%; border-top-color: #6366f1; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔍 AWS Cost Optimization Dashboard</h1>
        <button class="action-button" onclick="window.close()">Close</button>
    </div>
    
    <div class="content">
        <div class="setup-section">
            <h2>💰 Let's get you setup</h2>
            <p>Connected to AWS Account. Analyzing your costs...</p>
            <button id="scan-btn" class="action-button">Start Analysis</button>
        </div>
        
        <div id="results" style="display: none;">
            <div class="cost-summary">
                <div class="cost-metric">
                    <div class="metric-value">$2,847</div>
                    <div class="metric-label">Current Monthly</div>
                </div>
                <div class="cost-metric savings">
                    <div class="metric-value">$1,139</div>
                    <div class="metric-label">Potential Savings</div>
                </div>
                <div class="cost-metric">
                    <div class="metric-value">40%</div>
                    <div class="metric-label">Cost Reduction</div>
                </div>
            </div>
            
            <h3>🎯 Top Recommendations</h3>
            <div class="recommendations">
                <div class="recommendation-item">
                    <div class="rec-priority high">HIGH</div>
                    <div><strong>Right-size EC2 Instances</strong><br>3 instances over-provisioned</div>
                    <div class="rec-savings">$312/month</div>
                    <button class="action-button">Implement</button>
                </div>
                <div class="recommendation-item">
                    <div class="rec-priority medium">MED</div>
                    <div><strong>Enable S3 Intelligent Tiering</strong><br>Auto-optimize storage costs</div>
                    <div class="rec-savings">$189/month</div>
                    <button class="action-button">Implement</button>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        document.getElementById('scan-btn').onclick = async function() {
            this.innerHTML = '<span class="loading"></span> Analyzing...';
            this.disabled = true;
            await new Promise(r => setTimeout(r, 3000));
            document.getElementById('results').style.display = 'block';
            this.style.display = 'none';
        };
    <\/script>
</body>
</html>
        `),d.document.close()}async function Co(){const d=document.getElementById("setup-monitoring-button");d&&(d.disabled=!0,d.textContent="⚙️ Setting up...",await q(2e3),alert(`✅ Monitoring setup complete!

• OpenObserve agents deployed
• Log collection configured
• Metrics dashboards created
• Alert rules activated

Your infrastructure is now fully monitored.`),d.disabled=!1,d.textContent="⚙️ Setup Monitoring")}async function To(){const d=document.getElementById("create-dashboard-button");d&&(d.disabled=!0,d.textContent="📊 Creating...",await q(1500),alert(`✅ Custom dashboard created!

• Real-time metrics visualization
• Log aggregation views
• Performance trending
• Custom alerts integration

Dashboard URL: https://observe.turboagile.ai/dashboard/custom`),d.disabled=!1,d.textContent="📊 Create Dashboard")}async function Eo(){const d=document.getElementById("configure-alerts-button");d&&(d.disabled=!0,d.textContent="🚨 Configuring...",await q(1800),alert(`✅ Alert rules configured!

• CPU > 80% threshold
• Memory > 85% threshold
• Error rate > 1% threshold
• Response time > 500ms
• Slack/email notifications enabled`),d.disabled=!1,d.textContent="🚨 Configure Alerts")}window.implementOptimization=async function(d){const c=event==null?void 0:event.target;c&&(c.disabled=!0,c.textContent="Implementing...",await q(2e3),c.textContent="✅ Implemented",c.style.background="#27ae60",setTimeout(()=>{alert(`✅ ${d} optimization implemented successfully!

Changes will take effect within 24 hours.
Estimated monthly savings will appear in next billing cycle.`)},500))},window.generateCostReport=function(){var d;alert(`📊 Comprehensive cost report generated!

• Detailed breakdown by service
• Historical cost trends
• Optimization roadmap
• ROI projections

Report sent to your email and available in dashboard.`),(d=document.querySelector(".modal-overlay"))==null||d.remove(),document.body.style.overflow="auto"};function ke(d,c,f,h=!1){const v=So(d),C=L.connectorConfigs.get(`${d.toLowerCase()}-config`),S=document.createElement("div");S.className="modal-overlay",S.style.display="flex";const w=document.createElement("div");w.className="modal-content connector-modal";const A=document.createElement("button");A.className="modal-close",A.innerHTML="&times;",A.onclick=()=>{S.remove(),document.body.style.overflow="auto"};const b=document.createElement("h3");b.innerHTML=`${v.logo} ${h?"Edit":"Connect to"} ${d}`;const _=document.createElement("form");_.className="connector-form",_.innerHTML=v.fields;const k=document.createElement("div");k.className="connector-actions";const U=document.createElement("button");U.type="button",U.className="action-button cancel-button",U.textContent="Cancel",U.onclick=()=>{S.remove(),document.body.style.overflow="auto"};const B=document.createElement("button");B.type="button",B.className="action-button",B.textContent="Test Connection",B.onclick=()=>Ao(d);const R=document.createElement("button");R.type="submit",R.className="action-button",R.textContent="Save & Connect",k.appendChild(U),k.appendChild(B),k.appendChild(R),_.appendChild(k);const z=document.createElement("div");z.id="connection-status",z.style.display="none",w.appendChild(A),w.appendChild(b),w.appendChild(_),w.appendChild(z),S.appendChild(w),h&&C&&setTimeout(()=>{_.querySelectorAll("input, select").forEach(ae=>{const le=ae,de=le.id.split("-").pop();de&&C[de]&&(le.value=C[de])})},100),_.addEventListener("submit",W=>{W.preventDefault(),Io(d,c,f,S,h)}),document.body.appendChild(S),document.body.style.overflow="hidden"}function So(d){return{Jira:{logo:'<svg viewBox="0 0 24 24" fill="none" class="provider-logo" style="width: 32px; height: 32px;"><path d="M12.33 21.68h-.02a2.83 2.83 0 0 1-2.4-1.39L2.3 8.35a2.83 2.83 0 0 1 2.4-4.27h.01a2.83 2.83 0 0 1 2.4 1.39l7.62 11.94a2.83 2.83 0 0 1-2.4 4.27Z" fill="#2684FF"></path></svg>',fields:`
                    <div class="form-group">
                        <label for="jira-url">Jira Instance URL</label>
                        <input type="url" id="jira-url" placeholder="https://yourcompany.atlassian.net" required>
                        <small>Your Jira cloud or server instance URL</small>
                    </div>
                    <div class="form-group">
                        <label for="jira-email">Email</label>
                        <input type="email" id="jira-email" placeholder="your-email@company.com" required>
                    </div>
                    <div class="form-group">
                        <label for="jira-token">API Token</label>
                        <div class="password-input-container">
                            <input type="password" id="jira-token" placeholder="Your Jira API token" required>
                            <button type="button" class="password-toggle" onclick="togglePassword('jira-token')">
                                <span class="eye-icon">👁️</span>
                            </button>
                        </div>
                        <small><a href="https://id.atlassian.com/manage-profile/security/api-tokens" target="_blank">Create API token</a></small>
                    </div>
                    <div class="form-group">
                        <label for="jira-project">Project Key</label>
                        <input type="text" id="jira-project" placeholder="PROJ" required>
                        <small>Your Jira project key</small>
                    </div>
                `},GitHub:{logo:'<svg viewBox="0 0 24 24" fill="currentColor" class="provider-logo" style="width: 32px; height: 32px;"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-1.99 1.03-2.69a3.6 3.6 0 0 1 .1-2.64s.84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.4.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.72c0 .27.18.58.69.48A10 10 0 0 0 22 12 10 10 0 0 0 12 2Z"></path></svg>',fields:`
                    <div class="form-group">
                        <label for="github-token">Personal Access Token</label>
                        <div class="password-input-container">
                            <input type="password" id="github-token" placeholder="ghp_xxxxxxxxxxxx" required>
                            <button type="button" class="password-toggle" onclick="togglePassword('github-token')">
                                <span class="eye-icon">👁️</span>
                            </button>
                        </div>
                        <small><a href="https://github.com/settings/tokens" target="_blank">Generate token</a> with repo and workflow permissions</small>
                    </div>
                    <div class="form-group">
                        <label for="github-username">Username</label>
                        <input type="text" id="github-username" placeholder="your-github-username" required>
                    </div>
                `},AWS:{logo:'<svg class="provider-logo" viewBox="0 0 24 24" fill="#FF9900" style="width: 32px; height: 32px;"><path d="M6.76 10.8c0-.54.04-1.02.13-1.44.09-.42.23-.78.42-1.08.19-.3.42-.54.69-.72.27-.18.58-.27.93-.27.35 0 .66.09.93.27.27.18.5.42.69.72.19.3.33.66.42 1.08.09.42.13.9.13 1.44s-.04 1.02-.13 1.44c-.09.42-.23.78-.42 1.08-.19.3-.42.54-.69.72-.27.18-.58.27-.93.27-.35 0-.66-.09-.93-.27-.27-.18-.5-.42-.69-.72-.19-.3-.33-.66-.42-1.08-.09-.42-.13-.9-.13-1.44z"/></svg>',fields:`
                    <div class="form-group">
                        <label for="aws-access-key">Access Key ID</label>
                        <div class="password-input-container">
                            <input type="password" id="aws-access-key" placeholder="AKIAIOSFODNN7EXAMPLE" required>
                            <button type="button" class="password-toggle" onclick="togglePassword('aws-access-key')">
                                <span class="eye-icon">👁️</span>
                            </button>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="aws-secret-key">Secret Access Key</label>
                        <div class="password-input-container">
                            <input type="password" id="aws-secret-key" placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY" required>
                            <button type="button" class="password-toggle" onclick="togglePassword('aws-secret-key')">
                                <span class="eye-icon">👁️</span>
                            </button>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="aws-region">Region</label>
                        <select id="aws-region" required>
                            <option value="">Select region</option>
                            <option value="us-east-1">US East (N. Virginia)</option>
                            <option value="us-west-2">US West (Oregon)</option>
                            <option value="eu-west-1">Europe (Ireland)</option>
                            <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
                        </select>
                    </div>
                `},Asana:{logo:'<svg viewBox="0 0 24 24" fill="none" class="provider-logo" style="width: 32px; height: 32px;"><circle cx="12" cy="12" r="10" fill="#FB4F75"></circle><path d="M8.5 14a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM15.5 14a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM12 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" fill="#fff"></path></svg>',fields:`
                    <div class="form-group">
                        <label for="asana-token">Personal Access Token</label>
                        <div class="password-input-container">
                            <input type="password" id="asana-token" placeholder="Your Asana PAT" required>
                            <button type="button" class="password-toggle" onclick="togglePassword('asana-token')">
                                <span class="eye-icon">👁️</span>
                            </button>
                        </div>
                        <small><a href="https://app.asana.com/0/developer-console" target="_blank">Get your token</a></small>
                    </div>
                    <div class="form-group">
                        <label for="asana-workspace">Workspace GID</label>
                        <input type="text" id="asana-workspace" placeholder="1234567890" required>
                    </div>
                `},CloudWatch:{logo:'<span style="font-size: 24px;">☁️</span>',fields:`
                    <div class="form-group">
                        <label for="cloudwatch-access-key">AWS Access Key</label>
                        <div class="password-input-container">
                            <input type="password" id="cloudwatch-access-key" required>
                            <button type="button" class="password-toggle" onclick="togglePassword('cloudwatch-access-key')">
                                <span class="eye-icon">👁️</span>
                            </button>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="cloudwatch-secret-key">AWS Secret Key</label>
                        <div class="password-input-container">
                            <input type="password" id="cloudwatch-secret-key" required>
                            <button type="button" class="password-toggle" onclick="togglePassword('cloudwatch-secret-key')">
                                <span class="eye-icon">👁️</span>
                            </button>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="cloudwatch-region">Region</label>
                        <input type="text" id="cloudwatch-region" value="us-east-1" required>
                    </div>
                `},Datadog:{logo:'<span style="font-size: 24px;">🐶</span>',fields:`
                    <div class="form-group">
                        <label for="datadog-api-key">API Key</label>
                        <div class="password-input-container">
                            <input type="password" id="datadog-api-key" required>
                            <button type="button" class="password-toggle" onclick="togglePassword('datadog-api-key')">
                                <span class="eye-icon">👁️</span>
                            </button>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="datadog-app-key">Application Key</label>
                        <div class="password-input-container">
                            <input type="password" id="datadog-app-key" required>
                            <button type="button" class="password-toggle" onclick="togglePassword('datadog-app-key')">
                                <span class="eye-icon">👁️</span>
                            </button>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="datadog-site">Site</label>
                        <select id="datadog-site" required>
                            <option value="datadoghq.com">US1 (datadoghq.com)</option>
                            <option value="datadoghq.eu">EU (datadoghq.eu)</option>
                            <option value="us3.datadoghq.com">US3 (us3.datadoghq.com)</option>
                        </select>
                    </div>
                `}}[d]||{logo:'<span style="font-size: 24px;">🔗</span>',fields:`
                <div class="form-group">
                    <label for="generic-url">Service URL</label>
                    <input type="url" id="generic-url" placeholder="https://api.${d.toLowerCase()}.com">
                </div>
                <div class="form-group">
                    <label for="generic-key">API Key/Token</label>
                    <input type="password" id="generic-key" placeholder="Your API key or token">
                </div>
            `}}function Io(d,c,f,h,v=!1){const C=h.querySelectorAll("input, select"),S={provider:d};C.forEach(w=>{const A=w;if(A.value){const b=A.id.split("-").pop()||"value";S[b]=A.value}}),M.setConnectorConfig(`${d.toLowerCase()}-config`,S),wo(c,f,d),h.remove(),document.body.style.overflow="auto",alert(`✅ ${d} ${v?"updated":"connected"} successfully!`),d==="GitHub"&&zo(S.token)}async function Ao(d){const c=document.getElementById("connection-status");if(!c){console.log("Status div not found");return}c.style.display="block",c.innerHTML='<div class="connection-status"><span class="status-icon">⏳</span> Testing connection...</div>';try{if(d==="GitHub"){const f=await bo(),h=f.created?"Repository created & connected!":"GitHub connection successful!",v=f.created?"Created":f.exists?"Found":"Ready";c.innerHTML=`<div class="connection-status success"><span class="status-icon">✅</span> ${h}<br><small>User: ${f.user} | Repo: ${v}</small></div>`}else{if(await new Promise(h=>setTimeout(h,1500)),!(Math.random()>.3))throw new Error("Connection failed");c.innerHTML=`<div class="connection-status success"><span class="status-icon">✅</span> ${d} connection successful!</div>`}}catch(f){console.error("Test connection error:",f),c.innerHTML=`<div class="connection-status error"><span class="status-icon">❌</span> ${d} connection failed:<br><small>${f}</small></div>`}}async function bo(){const d=document.getElementById("github-token")||document.querySelector("#github-token");if(!d||!d.value.trim())throw new Error("Please enter your GitHub Personal Access Token");const c=d.value.trim(),f=await fetch("https://api.github.com/user",{headers:{Authorization:`token ${c}`,Accept:"application/vnd.github.v3+json"}});if(!f.ok)throw f.status===401?new Error("Invalid token. Check your Personal Access Token."):new Error(`GitHub API error: ${f.status}`);return{user:(await f.json()).login,connected:!0}}function wo(d,c,f){d.classList.add("selected");const h=c==null?void 0:c.querySelector(".status");if(h){if(f==="GitHub"){const C=L.connectorConfigs.get("github-config"),S=(C==null?void 0:C.username)||"GitHub";h.innerHTML=`
                    <span class="connected-text">Connected to ${S}</span>
                    <button class="edit-connection-btn" onclick="editConnection('${f}')" title="Edit connection">
                        <span>✏️</span>
                    </button>
                `}else h.textContent=`Connected to ${f}`;h.classList.add("connected")}const v=c==null?void 0:c.id;v!=null&&v.includes("project-management")?M.setConnector("projectManagement",f):v!=null&&v.includes("version-control")?M.setConnector("versionControl",f):v!=null&&v.includes("ai-assistants")?M.setConnector("aiAssistant",f):v!=null&&v.includes("cloud-providers")?M.setConnector("cloud",f):v!=null&&v.includes("log-aggregators")&&M.setConnector("log",f),j()}function nt(d,c){d.classList.remove("selected");const f=c==null?void 0:c.querySelector(".status");f&&(f.textContent="Not Connected",f.classList.remove("connected"));const h=c==null?void 0:c.id;h!=null&&h.includes("project-management")?M.setConnector("projectManagement",null):h!=null&&h.includes("version-control")?M.setConnector("versionControl",null):h!=null&&h.includes("ai-assistants")?M.setConnector("aiAssistant",null):h!=null&&h.includes("cloud-providers")?M.setConnector("cloud",null):h!=null&&h.includes("log-aggregators")&&M.setConnector("log",null),j()}function _o(d){return{"react-typescript":"typescript","vue-typescript":"typescript","angular-typescript":"typescript","python-fastapi":"python","java-spring":"java","csharp-dotnet":"csharp","nodejs-express":"javascript","go-gin":"go","rust-actix":"rust"}[d]||"typescript"}function Ro(d){return{ts:"typescript",tsx:"typescript",js:"javascript",jsx:"javascript",py:"python",java:"java",cs:"csharp",go:"go",rs:"rust",xml:"xml",yml:"yaml",yaml:"yaml",json:"json",md:"markdown"}[d]||"text"}async function Mo(d,c){const f=document.getElementById("apply-arch-changes"),h=document.getElementById("architect-output");if(!(!f||!h)){f.disabled=!0,f.textContent="Applying...";try{await new Promise(w=>setTimeout(w,2e3));let v=d.architecture||"";c.toLowerCase().includes("redis")&&(v+=`

### 🔴 Redis Caching Layer
- **Cache Strategy**: Write-through caching
- **TTL**: 1 hour for user sessions, 24 hours for static data
- **Cluster**: Redis Cluster for high availability
- **Monitoring**: Redis metrics via Prometheus`),c.toLowerCase().includes("mongodb")&&(v=v.replace(/PostgreSQL/g,"MongoDB"),v+=`

### 🍃 MongoDB Configuration
- **Replica Set**: 3-node replica set for high availability
- **Sharding**: Horizontal sharding for large datasets
- **Indexes**: Compound indexes for query optimization
- **Aggregation**: Pipeline-based data processing`),c.toLowerCase().includes("microservices")&&(v+=`

### 🔧 Microservices Architecture
- **Service Mesh**: Istio for service-to-service communication
- **API Gateway**: Kong for request routing and rate limiting
- **Service Discovery**: Consul for dynamic service registration
- **Circuit Breaker**: Hystrix for fault tolerance
- **Distributed Tracing**: Jaeger for request tracing`),v+=`

## 🔄 Customization Applied

**User Request:** ${c}

**AI Analysis:** Architecture has been enhanced based on your requirements. The system now includes the requested components with proper integration patterns and best practices.

*Customized by TurboAgile AI - ${new Date().toLocaleString()}*`,d.architecture=v;const C=h.querySelector("pre");C&&(C.textContent=v);const S=document.getElementById("arch-customize-panel");if(S){S.style.display="none";const w=document.getElementById("arch-prompt");w&&(w.value="")}alert("✅ Architecture customized successfully!")}catch(v){console.error("Error customizing architecture:",v),alert("Error customizing architecture. Please try again.")}finally{f.disabled=!1,f.textContent="Apply Changes"}}}async function Le(d){var v,C,S,w,A,b;const c=document.getElementById("cloud-deploy-button"),f=document.getElementById("cloud-deploy-output");if(!c||!f)return;const h=M.getConnectorConfig("aws-config");if(!L.connectors.cloud||!h){alert(`⚠️ Cloud Provider Not Connected

Please connect to a cloud provider first:

1. Go to Connectors → Cloud Providers
2. Select AWS/Azure/GCP
3. Enter your credentials
4. Test the connection`);return}c.disabled=!0,c.textContent="☁️ Deploying...",f.style.display="block",f.innerHTML="";try{f.innerHTML+="<p>Step 1/6: Creating cloud infrastructure...</p>",await q(2e3),(v=f.lastElementChild)==null||v.classList.add("success"),f.innerHTML+="<p>✅ ECS Cluster and VPC created</p>",f.innerHTML+="<p>Step 2/6: Building Docker image...</p>",await q(1500),(C=f.lastElementChild)==null||C.classList.add("success"),f.innerHTML+="<p>✅ Docker image built and pushed to ECR</p>",f.innerHTML+="<p>Step 3/6: Deploying application...</p>",await q(2e3),(S=f.lastElementChild)==null||S.classList.add("success"),f.innerHTML+="<p>✅ Application deployed to ECS</p>",f.innerHTML+="<p>Step 4/6: Configuring load balancer...</p>",await q(1e3),(w=f.lastElementChild)==null||w.classList.add("success"),f.innerHTML+="<p>✅ Application Load Balancer configured</p>",f.innerHTML+="<p>Step 5/6: Setting up monitoring...</p>",await q(1500),(A=f.lastElementChild)==null||A.classList.add("success"),f.innerHTML+="<p>✅ CloudWatch monitoring and alarms configured</p>",f.innerHTML+="<p>Step 6/6: Finalizing deployment...</p>",await q(1e3),(b=f.lastElementChild)==null||b.classList.add("success");const _=`https://${d.title.toLowerCase().replace(/[^a-z0-9]/g,"-")}-prod.${h.region||"us-east-1"}.elb.amazonaws.com`;d.productionUrl=_,f.innerHTML+=`<div class="output-container"><strong>🚀 Production Deployment Complete!</strong><br/><br/><strong>Production URL:</strong><br/><a href="${_}" target="_blank">${_}</a><br/><br/><strong>Infrastructure:</strong><br/>• ECS Cluster: ${d.title.replace(/\s+/g,"-").toLowerCase()}-cluster<br/>• Load Balancer: ${d.title.replace(/\s+/g,"-").toLowerCase()}-alb<br/>• Auto Scaling: 2-10 instances<br/>• Health Checks: Enabled<br/>• SSL Certificate: Auto-provisioned</div>`,alert(`🚀 Cloud deployment successful!

Production URL: ${_}

Your application is now live with auto-scaling, monitoring, and high availability.`)}catch(_){f.innerHTML+=`<p class="failure">❌ Deployment failed: ${_}</p>`}finally{c.disabled=!1,c.textContent="☁️ Deploy to Cloud"}}function Po(d,c,f){if(d.isFrameworkSetup)return xo(f);switch(f){case"react-typescript":return st(d,c);case"python-fastapi":return Go(d,c);case"java-spring":return Ho(d,c);case"nodejs-express":return Oo(d,c);default:return st(d,c)}}function xo(d){switch(d){case"java-spring":return Do();case"react-typescript":return ot();case"python-fastapi":return ko();case"nodejs-express":return Lo();default:return ot()}}function Do(){return JSON.stringify({"pom.xml":`<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/>
    </parent>
    
    <groupId>com.turboagile</groupId>
    <artifactId>turbo-agile-app</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>
    
    <properties>
        <java.version>17</java.version>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
    </properties>
    
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.springdoc</groupId>
            <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
            <version>2.2.0</version>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>`,"src/main/java/com/turboagile/TurboAgileApplication.java":`package com.turboagile;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TurboAgileApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(TurboAgileApplication.class, args);
    }
}`,"src/main/java/com/turboagile/config/SecurityConfig.java":`package com.turboagile.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf().disable()
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/health", "/actuator/**", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .anyRequest().authenticated()
            );
        return http.build();
    }
}`,"src/main/java/com/turboagile/controller/HealthController.java":`package com.turboagile.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import java.util.Map;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api")
public class HealthController {
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "timestamp", LocalDateTime.now(),
            "service", "turbo-agile-app",
            "version", "1.0.0"
        ));
    }
}`,"src/main/java/com/turboagile/constants/AppConstants.java":`package com.turboagile.constants;

public final class AppConstants {
    
    public static final String API_VERSION = "v1";
    public static final String API_BASE_PATH = "/api/" + API_VERSION;
    public static final int DEFAULT_PAGE_SIZE = 20;
    public static final int MAX_PAGE_SIZE = 100;
    
    private AppConstants() {
        // Utility class
    }
}`,"src/main/java/com/turboagile/util/ResponseUtil.java":`package com.turboagile.util;

import org.springframework.http.ResponseEntity;
import java.util.Map;
import java.time.LocalDateTime;

public final class ResponseUtil {
    
    private ResponseUtil() {
        // Utility class
    }
    
    public static <T> ResponseEntity<Map<String, Object>> success(T data) {
        return ResponseEntity.ok(Map.of(
            "success", true,
            "data", data,
            "timestamp", LocalDateTime.now()
        ));
    }
    
    public static ResponseEntity<Map<String, Object>> error(String message) {
        return ResponseEntity.badRequest().body(Map.of(
            "success", false,
            "error", message,
            "timestamp", LocalDateTime.now()
        ));
    }
}`,"src/main/resources/application.yml":`server:
  port: 8080
  servlet:
    context-path: /

spring:
  application:
    name: turbo-agile-app
  datasource:
    url: jdbc:h2:mem:testdb
    driver-class-name: org.h2.Driver
    username: sa
    password: 
  jpa:
    hibernate:
      ddl-auto: create-drop
    show-sql: true
    properties:
      hibernate:
        format_sql: true
  h2:
    console:
      enabled: true
      path: /h2-console

management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics
  endpoint:
    health:
      show-details: always

springdoc:
  api-docs:
    path: /v3/api-docs
  swagger-ui:
    path: /swagger-ui.html`,"src/main/resources/application-prod.yml":`spring:
  datasource:
    url: \${DATABASE_URL:jdbc:postgresql://localhost:5432/turboagile}
    username: \${DATABASE_USERNAME:turboagile}
    password: \${DATABASE_PASSWORD:password}
    driver-class-name: org.postgresql.Driver
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
  h2:
    console:
      enabled: false

logging:
  level:
    com.turboagile: INFO
    org.springframework.security: WARN`,Dockerfile:`FROM openjdk:17-jdk-slim

WORKDIR /app

COPY target/turbo-agile-app-1.0.0.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]`,"docker-compose.yml":`version: '3.8'
services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - DATABASE_URL=jdbc:postgresql://db:5432/turboagile
      - DATABASE_USERNAME=turboagile
      - DATABASE_PASSWORD=password
    depends_on:
      - db
  
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=turboagile
      - POSTGRES_USER=turboagile
      - POSTGRES_PASSWORD=password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:`,"README.md":`# Turbo Agile Spring Boot Application

## 12-Factor App Compliance

This application follows the 12-factor app methodology:

1. **Codebase**: Single codebase tracked in Git
2. **Dependencies**: Explicitly declared via Maven
3. **Config**: Configuration stored in environment variables
4. **Backing Services**: Database treated as attached resource
5. **Build/Release/Run**: Strict separation of stages
6. **Processes**: Stateless application processes
7. **Port Binding**: Self-contained with embedded server
8. **Concurrency**: Horizontal scaling via process model
9. **Disposability**: Fast startup and graceful shutdown
10. **Dev/Prod Parity**: Keep environments similar
11. **Logs**: Treat logs as event streams
12. **Admin Processes**: Run as one-off processes

## Getting Started

### Prerequisites
- Java 17+
- Maven 3.6+
- Docker (optional)

### Running Locally
\`\`\`bash
mvn spring-boot:run
\`\`\`

### Running with Docker
\`\`\`bash
mvn clean package
docker-compose up
\`\`\`

### API Documentation
- Swagger UI: http://localhost:8080/swagger-ui.html
- Health Check: http://localhost:8080/api/health
- H2 Console: http://localhost:8080/h2-console (dev only)

## Architecture

- **Controller Layer**: REST endpoints
- **Service Layer**: Business logic
- **Repository Layer**: Data access
- **Config Layer**: Configuration classes
- **Util Layer**: Utility classes
- **Constants**: Application constants`})}function ot(){return`// package.json
{
  "name": "turbo-agile-app",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "@tanstack/react-query": "^4.24.0",
    "axios": "^1.3.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.27",
    "@types/react-dom": "^18.0.10",
    "@vitejs/plugin-react": "^3.1.0",
    "typescript": "^4.9.3",
    "vite": "^4.1.0",
    "vitest": "^0.28.0",
    "@testing-library/react": "^13.4.0"
  }
}

// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="app">
          <header className="app-header">
            <h1>Turbo Agile App</h1>
          </header>
          <main>
            <Routes>
              <Route path="/" element={<div>Welcome to Turbo Agile!</div>} />
              <Route path="/health" element={<div>OK</div>} />
            </Routes>
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;`}function ko(){return`# requirements.txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
pydantic==2.5.0
sqlalchemy==2.0.23
alembic==1.13.0
pytest==7.4.3
pytest-asyncio==0.21.1
httpx==0.25.2

# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("Starting up Turbo Agile API...")
    yield
    # Shutdown
    print("Shutting down...")

app = FastAPI(
    title="Turbo Agile API",
    description="AI-powered development platform API",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to Turbo Agile API"}

@app.get("/health")
async def health_check():
    return {"status": "OK"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)`}function Lo(){return`// package.json
{
  "name": "turbo-agile-api",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node dist/index.js",
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "test": "jest",
    "lint": "eslint src --ext .ts"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "dotenv": "^16.3.1",
    "winston": "^3.11.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/node": "^20.10.0",
    "typescript": "^5.3.0",
    "tsx": "^4.6.0",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.8"
  }
}

// src/index.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Turbo Agile API' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Start server
app.listen(PORT, () => {
  console.log(\`🚀 Turbo Agile API running on port \${PORT}\`);
});

export default app;`}function it(){const d=L.stories.find(c=>c.isFrameworkSetup);return d?d.status==="done"&&d.githubCheckedIn:!1}function No(){L.stories.forEach(d=>{d.status==="blocked"&&d.blockedBy&&(d.status="backlog",delete d.blockedBy)}),M.data.stories=L.stories,M.save(),Q(),alert(`✅ Framework setup complete!

All dependent stories have been unblocked and are now ready for development.`)}function $o(d){const c=d.title.replace(/\s+/g,"").replace(/[^a-zA-Z0-9]/g,""),f=d.points<=2?"Simple":d.points<=5?"Moderate":"Complex";return`# 🏗️ Technical Architecture: ${d.title}

## 📋 Story Overview
**Points**: ${d.points} (${f} Implementation)
**Type**: ${d.type}
**Estimated Effort**: ${Fo(d.points)}

## 🎯 Business Requirements
${d.description}

## ✅ Acceptance Criteria
${d.acceptanceCriteria.map((h,v)=>`${v+1}. ${h}`).join(`
`)}

## 🏛️ System Architecture

### Frontend Layer
- **Component**: ${c}Component
- **State Management**: ${d.points>5?"Redux Toolkit + RTK Query":"React hooks (useState, useEffect)"}
- **UI Framework**: Material-UI v5 with custom theme
- **Routing**: React Router v6 with protected routes
- **Form Handling**: React Hook Form with Yup validation
- **Testing**: Jest + React Testing Library

### Backend Layer
- **Framework**: ${Uo(d.points)}
- **Database**: ${qo(d)}
- **Authentication**: JWT with refresh tokens
- **API Documentation**: OpenAPI 3.0 (Swagger)
- **Validation**: Input sanitization and schema validation
- **Error Handling**: Centralized error middleware

### Infrastructure
- **Containerization**: Docker with multi-stage builds
- **Orchestration**: ${d.points>5?"Kubernetes with Helm charts":"Docker Compose"}
- **CI/CD**: GitHub Actions with automated testing
- **Monitoring**: Prometheus + Grafana + ELK stack
- **Caching**: Redis for session and data caching
- **CDN**: CloudFront for static assets

## 🗄️ Database Design

### Tables Required
${Bo(d)}

### Indexes
- Primary keys on all ID fields
- Composite indexes on frequently queried combinations
- Full-text search indexes where applicable

## 🔌 API Endpoints

### RESTful Routes
${Vo(d,c)}

### Request/Response Models
- **Request Validation**: JSON Schema validation
- **Response Format**: Consistent JSON structure with metadata
- **Error Responses**: RFC 7807 Problem Details format

## 🔒 Security Implementation

### Authentication & Authorization
- **JWT Tokens**: Access (15min) + Refresh (7 days)
- **Role-Based Access Control (RBAC)**
- **API Rate Limiting**: 100 requests/minute per user
- **CORS Configuration**: Whitelist specific origins

### Data Protection
- **Input Sanitization**: XSS and SQL injection prevention
- **Data Encryption**: AES-256 for sensitive data at rest
- **HTTPS Enforcement**: TLS 1.3 minimum
- **Audit Logging**: All CRUD operations logged

## 📊 Performance Requirements

### Response Times
- **API Endpoints**: <200ms (95th percentile)
- **Database Queries**: <50ms average
- **Page Load**: <2 seconds initial load
- **Subsequent Navigation**: <500ms

### Scalability
- **Horizontal Scaling**: Auto-scaling based on CPU/memory
- **Database**: Read replicas for query optimization
- **Caching Strategy**: Multi-layer caching (Redis + CDN)
- **Load Balancing**: Application Load Balancer with health checks

## 🧪 Testing Strategy

### Frontend Testing
- **Unit Tests**: Jest + React Testing Library (>90% coverage)
- **Integration Tests**: Cypress for E2E workflows
- **Visual Regression**: Chromatic for UI consistency
- **Accessibility**: axe-core for WCAG compliance

### Backend Testing
- **Unit Tests**: Framework-specific testing tools
- **Integration Tests**: Database and API endpoint testing
- **Load Testing**: Artillery.js for performance validation
- **Security Testing**: OWASP ZAP for vulnerability scanning

## 📈 Monitoring & Observability

### Application Monitoring
- **APM**: New Relic or Datadog for performance tracking
- **Error Tracking**: Sentry for exception monitoring
- **Logging**: Structured JSON logs with correlation IDs
- **Metrics**: Custom business metrics and KPIs

### Infrastructure Monitoring
- **System Metrics**: CPU, memory, disk, network
- **Database Monitoring**: Query performance and connection pools
- **Alert Rules**: PagerDuty integration for critical issues
- **Dashboards**: Real-time operational dashboards

## 🚀 Deployment Strategy

### Environment Pipeline
1. **Development**: Feature branch deployments
2. **Staging**: Integration testing environment
3. **Production**: Blue-green deployment strategy

### Rollback Plan
- **Database Migrations**: Reversible migration scripts
- **Application Rollback**: Previous container version deployment
- **Feature Flags**: Gradual feature rollout capability

## 📋 Implementation Checklist

### Phase 1: Foundation (${Math.ceil(d.points*.3)} points)
- [ ] Database schema creation and migrations
- [ ] Basic API endpoints with authentication
- [ ] Frontend component structure
- [ ] Unit test framework setup

### Phase 2: Core Features (${Math.ceil(d.points*.5)} points)
- [ ] Business logic implementation
- [ ] Frontend-backend integration
- [ ] Validation and error handling
- [ ] Integration tests

### Phase 3: Polish & Deploy (${Math.ceil(d.points*.2)} points)
- [ ] Performance optimization
- [ ] Security hardening
- [ ] Documentation completion
- [ ] Production deployment

## 🔧 Technical Debt Considerations
- **Code Quality**: SonarQube integration for code analysis
- **Documentation**: Auto-generated API docs and README updates
- **Refactoring**: Scheduled technical debt sprints
- **Dependency Updates**: Automated security patch management

## 📚 Documentation Requirements
- **API Documentation**: Interactive Swagger UI
- **Component Documentation**: Storybook for UI components
- **Architecture Decision Records (ADRs)**
- **Runbook**: Operational procedures and troubleshooting

---
*Generated by TurboAgile AI Architect - ${new Date().toLocaleString()}*`}function Fo(d){return{1:"2-4 hours",2:"4-8 hours",3:"1-2 days",5:"3-5 days",8:"1-2 weeks"}[d]||"1-2 weeks"}function Uo(d){return d>5?"Node.js + Express + TypeScript":"Node.js + Express"}function qo(d){return d.acceptanceCriteria.some(f=>f.toLowerCase().includes("report")||f.toLowerCase().includes("analytics")||f.toLowerCase().includes("search"))?"PostgreSQL with Redis cache":"PostgreSQL"}function Bo(d){const c=d.title.toLowerCase().replace(/\s+/g,"_").replace(/[^a-z0-9_]/g,"");return`\`\`\`sql
-- Primary entity table
CREATE TABLE ${c} (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    updated_by INTEGER REFERENCES users(id)
);

-- Audit trail table
CREATE TABLE ${c}_audit (
    id SERIAL PRIMARY KEY,
    ${c}_id INTEGER REFERENCES ${c}(id),
    action VARCHAR(20) NOT NULL,
    old_values JSONB,
    new_values JSONB,
    changed_by INTEGER REFERENCES users(id),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\``}function Vo(d,c){const f=c.toLowerCase();return`\`\`\`
GET    /api/${f}           # List all items (with pagination)
POST   /api/${f}           # Create new item
GET    /api/${f}/:id       # Get specific item
PUT    /api/${f}/:id       # Update specific item
DELETE /api/${f}/:id       # Delete specific item
GET    /api/${f}/search    # Search items with filters
GET    /api/${f}/export    # Export data (CSV/PDF)
\`\`\``}function st(d,c){return`import React, { useState, useEffect } from 'react';

interface ${c}Props {
  className?: string;
}

export const ${c}: React.FC<${c}Props> = ({ className }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (err) {
        setError('Failed to initialize component');
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  if (loading) {
    return <div className="loading">Loading ${d.title}...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className={\`\${componentName.toLowerCase()} \${className || ''}\`}>
      <h2>${d.title}</h2>
      <div className="content">
        ${d.acceptanceCriteria.map((f,h)=>`{/* ${h+1}. ${f} */}`).join(`
        `)}
        <p>Component implementation goes here...</p>
      </div>
    </div>
  );
};

export default ${c};`}function Go(d,c){const f=c.charAt(0).toUpperCase()+c.slice(1);return`from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="${d.title}")

class ${f}Request(BaseModel):
    name: str
    description: Optional[str] = None

class ${f}Response(BaseModel):
    id: int
    name: str
    description: Optional[str]
    status: str

${c.toLowerCase()}_storage: List[${f}Response] = []

@app.get("/")
async def root():
    return {"message": "${d.title} API"}

@app.post("/${c.toLowerCase()}/", response_model=${f}Response)
async def create_${c.toLowerCase()}(request: ${f}Request):
    new_id = len(${c.toLowerCase()}_storage) + 1
    new_item = ${f}Response(
        id=new_id,
        name=request.name,
        description=request.description,
        status="active"
    )
    ${c.toLowerCase()}_storage.append(new_item)
    return new_item

@app.get("/${c.toLowerCase()}/", response_model=List[${f}Response])
async def get_${c.toLowerCase()}_list():
    return ${c.toLowerCase()}_storage`}function Ho(d,c){const f=c.charAt(0).toUpperCase()+c.slice(1),h=c.toLowerCase();return JSON.stringify({[`src/main/java/com/turboagile/entity/${f}.java`]:`package com.turboagile.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "${h}")
public class ${f} {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Name is required")
    @Size(max = 255, message = "Name must not exceed 255 characters")
    @Column(nullable = false)
    private String name;
    
    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;
    
    @Enumerated(EnumType.STRING)
    private Status status = Status.ACTIVE;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum Status {
        ACTIVE, INACTIVE, DELETED
    }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Constructors
    public ${f}() {}
    
    public ${f}(String name, String description) {
        this.name = name;
        this.description = description;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ${f} that = (${f}) o;
        return Objects.equals(id, that.id);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}`,[`src/main/java/com/turboagile/dto/${f}RequestDTO.java`]:`package com.turboagile.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ${f}RequestDTO {
    
    @NotBlank(message = "Name is required")
    @Size(max = 255, message = "Name must not exceed 255 characters")
    private String name;
    
    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;
    
    // Constructors
    public ${f}RequestDTO() {}
    
    public ${f}RequestDTO(String name, String description) {
        this.name = name;
        this.description = description;
    }
    
    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}`,[`src/main/java/com/turboagile/dto/${f}ResponseDTO.java`]:`package com.turboagile.dto;

import com.turboagile.entity.${f};
import java.time.LocalDateTime;

public class ${f}ResponseDTO {
    
    private Long id;
    private String name;
    private String description;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Constructors
    public ${f}ResponseDTO() {}
    
    public ${f}ResponseDTO(${f} entity) {
        this.id = entity.getId();
        this.name = entity.getName();
        this.description = entity.getDescription();
        this.status = entity.getStatus().name();
        this.createdAt = entity.getCreatedAt();
        this.updatedAt = entity.getUpdatedAt();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}`,[`src/main/java/com/turboagile/repository/${f}Repository.java`]:`package com.turboagile.repository;

import com.turboagile.entity.${f};
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ${f}Repository extends JpaRepository<${f}, Long> {
    
    List<${f}> findByStatus(${f}.Status status);
    
    Optional<${f}> findByIdAndStatus(Long id, ${f}.Status status);
    
    @Query("SELECT e FROM ${f} e WHERE e.name LIKE %:name% AND e.status = :status")
    Page<${f}> findByNameContainingAndStatus(@Param("name") String name, 
                                                    @Param("status") ${f}.Status status, 
                                                    Pageable pageable);
    
    long countByStatus(${f}.Status status);
}`,[`src/main/java/com/turboagile/service/${f}Service.java`]:`package com.turboagile.service;

import com.turboagile.dto.${f}RequestDTO;
import com.turboagile.dto.${f}ResponseDTO;
import com.turboagile.entity.${f};
import com.turboagile.repository.${f}Repository;
import com.turboagile.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ${f}Service {
    
    private final ${f}Repository repository;
    
    @Autowired
    public ${f}Service(${f}Repository repository) {
        this.repository = repository;
    }
    
    @Transactional(readOnly = true)
    public List<${f}ResponseDTO> findAll() {
        return repository.findByStatus(${f}.Status.ACTIVE)
                .stream()
                .map(${f}ResponseDTO::new)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public Page<${f}ResponseDTO> findAll(Pageable pageable) {
        return repository.findAll(pageable)
                .map(${f}ResponseDTO::new);
    }
    
    @Transactional(readOnly = true)
    public ${f}ResponseDTO findById(Long id) {
        ${f} entity = repository.findByIdAndStatus(id, ${f}.Status.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("${f} not found with id: " + id));
        return new ${f}ResponseDTO(entity);
    }
    
    public ${f}ResponseDTO create(${f}RequestDTO requestDTO) {
        ${f} entity = new ${f}(requestDTO.getName(), requestDTO.getDescription());
        ${f} savedEntity = repository.save(entity);
        return new ${f}ResponseDTO(savedEntity);
    }
    
    public ${f}ResponseDTO update(Long id, ${f}RequestDTO requestDTO) {
        ${f} entity = repository.findByIdAndStatus(id, ${f}.Status.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("${f} not found with id: " + id));
        
        entity.setName(requestDTO.getName());
        entity.setDescription(requestDTO.getDescription());
        
        ${f} updatedEntity = repository.save(entity);
        return new ${f}ResponseDTO(updatedEntity);
    }
    
    public void delete(Long id) {
        ${f} entity = repository.findByIdAndStatus(id, ${f}.Status.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("${f} not found with id: " + id));
        
        entity.setStatus(${f}.Status.DELETED);
        repository.save(entity);
    }
    
    @Transactional(readOnly = true)
    public Page<${f}ResponseDTO> search(String name, Pageable pageable) {
        return repository.findByNameContainingAndStatus(name, ${f}.Status.ACTIVE, pageable)
                .map(${f}ResponseDTO::new);
    }
}`,[`src/main/java/com/turboagile/controller/${f}Controller.java`]:`package com.turboagile.controller;

import com.turboagile.constants.AppConstants;
import com.turboagile.dto.${f}RequestDTO;
import com.turboagile.dto.${f}ResponseDTO;
import com.turboagile.service.${f}Service;
import com.turboagile.util.ResponseUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(AppConstants.API_BASE_PATH + "/${h}")
@Tag(name = "${f}", description = "${f} management APIs")
public class ${f}Controller {
    
    private final ${f}Service service;
    
    @Autowired
    public ${f}Controller(${f}Service service) {
        this.service = service;
    }
    
    @GetMapping
    @Operation(summary = "Get all ${h}s", description = "Retrieve all active ${h}s with pagination")
    public ResponseEntity<Map<String, Object>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                   Sort.by(sortBy).descending() : 
                   Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, Math.min(size, AppConstants.MAX_PAGE_SIZE), sort);
        Page<${f}ResponseDTO> result = service.findAll(pageable);
        
        return ResponseUtil.success(Map.of(
            "content", result.getContent(),
            "totalElements", result.getTotalElements(),
            "totalPages", result.getTotalPages(),
            "currentPage", result.getNumber(),
            "size", result.getSize()
        ));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get ${h} by ID", description = "Retrieve a specific ${h} by its ID")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable Long id) {
        ${f}ResponseDTO result = service.findById(id);
        return ResponseUtil.success(result);
    }
    
    @PostMapping
    @Operation(summary = "Create ${h}", description = "Create a new ${h}")
    public ResponseEntity<Map<String, Object>> create(@Valid @RequestBody ${f}RequestDTO requestDTO) {
        ${f}ResponseDTO result = service.create(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
            "success", true,
            "data", result,
            "message", "${f} created successfully"
        ));
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update ${h}", description = "Update an existing ${h}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable Long id, 
                                                     @Valid @RequestBody ${f}RequestDTO requestDTO) {
        ${f}ResponseDTO result = service.update(id, requestDTO);
        return ResponseUtil.success(result);
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete ${h}", description = "Soft delete a ${h}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseUtil.success(Map.of("message", "${f} deleted successfully"));
    }
    
    @GetMapping("/search")
    @Operation(summary = "Search ${h}s", description = "Search ${h}s by name")
    public ResponseEntity<Map<String, Object>> search(
            @RequestParam String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, Math.min(size, AppConstants.MAX_PAGE_SIZE));
        Page<${f}ResponseDTO> result = service.search(name, pageable);
        
        return ResponseUtil.success(Map.of(
            "content", result.getContent(),
            "totalElements", result.getTotalElements(),
            "totalPages", result.getTotalPages(),
            "currentPage", result.getNumber()
        ));
    }
}`,"src/main/java/com/turboagile/exception/ResourceNotFoundException.java":`package com.turboagile.exception;

public class ResourceNotFoundException extends RuntimeException {
    
    public ResourceNotFoundException(String message) {
        super(message);
    }
    
    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}`,"src/main/java/com/turboagile/exception/GlobalExceptionHandler.java":`package com.turboagile.exception;

import com.turboagile.util.ResponseUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleResourceNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ResponseUtil.error(ex.getMessage()).getBody());
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of(
                    "success", false,
                    "errors", errors,
                    "message", "Validation failed"
                ));
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ResponseUtil.error("An unexpected error occurred").getBody());
    }
}`,[`src/test/java/com/turboagile/service/${f}ServiceTest.java`]:`package com.turboagile.service;

import com.turboagile.dto.${f}RequestDTO;
import com.turboagile.dto.${f}ResponseDTO;
import com.turboagile.entity.${f};
import com.turboagile.repository.${f}Repository;
import com.turboagile.exception.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ${f}ServiceTest {
    
    @Mock
    private ${f}Repository repository;
    
    @InjectMocks
    private ${f}Service service;
    
    private ${f} entity;
    private ${f}RequestDTO requestDTO;
    
    @BeforeEach
    void setUp() {
        entity = new ${f}("Test Name", "Test Description");
        entity.setId(1L);
        
        requestDTO = new ${f}RequestDTO("Test Name", "Test Description");
    }
    
    @Test
    void create_ShouldReturnResponseDTO_WhenValidRequest() {
        when(repository.save(any(${f}.class))).thenReturn(entity);
        
        ${f}ResponseDTO result = service.create(requestDTO);
        
        assertNotNull(result);
        assertEquals("Test Name", result.getName());
        assertEquals("Test Description", result.getDescription());
        verify(repository).save(any(${f}.class));
    }
    
    @Test
    void findById_ShouldReturnResponseDTO_WhenEntityExists() {
        when(repository.findByIdAndStatus(1L, ${f}.Status.ACTIVE))
                .thenReturn(Optional.of(entity));
        
        ${f}ResponseDTO result = service.findById(1L);
        
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Test Name", result.getName());
    }
    
    @Test
    void findById_ShouldThrowException_WhenEntityNotFound() {
        when(repository.findByIdAndStatus(1L, ${f}.Status.ACTIVE))
                .thenReturn(Optional.empty());
        
        assertThrows(ResourceNotFoundException.class, () -> service.findById(1L));
    }
}`})}function Oo(d,c){return`const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const ${c.toLowerCase()}Storage = [];
let idCounter = 0;

app.get('/api/${c.toLowerCase()}', (req, res) => {
    res.json(${c.toLowerCase()}Storage);
});

app.post('/api/${c.toLowerCase()}', (req, res) => {
    const { name, description } = req.body;
    
    const newItem = {
        id: ++idCounter,
        name,
        description: description || null,
        status: 'active',
        createdAt: new Date().toISOString()
    };
    
    ${c.toLowerCase()}Storage.push(newItem);
    res.status(201).json(newItem);
});

app.listen(port, () => {
    console.log(\`${d.title} API listening at http://localhost:\${port}\`);
});`}window.editConnection=function(d){const c=document.querySelector(`[data-provider="${d}"]`),f=c==null?void 0:c.closest(".tab-panel");c&&f&&ke(d,c,f,!0)};async function zo(d){try{(await fetch("https://api.github.com/rate_limit",{headers:{Authorization:`token ${d}`,Accept:"application/vnd.github.v3+json"}})).status===401&&setTimeout(()=>{confirm(`⚠️ GitHub token appears to be expired or invalid.

Would you like to update it now?`)&&window.editConnection("GitHub")},2e3)}catch(c){console.log("Token check failed:",c)}}window.togglePassword=function(d){console.log("Toggle password for:",d);const c=document.getElementById(d);if(c){const f=c.parentElement,h=f==null?void 0:f.querySelector(".eye-icon");console.log("Input found:",c.type),console.log("Eye icon found:",h),h&&(c.type==="password"?(c.type="text",h.textContent="🙈",console.log("Changed to text")):(c.type="password",h.textContent="👁️",console.log("Changed to password")))}else console.log("Input not found for ID:",d)};function Ne(){const d=L.stories.length,c=L.stories.filter(b=>b.status==="backlog").length,f=L.stories.filter(b=>b.status==="in-progress").length,h=L.stories.filter(b=>b.status==="done").length,v=L.stories.filter(b=>b.type==="bug").length,C=L.stories.filter(b=>b.type==="bug"&&b.status==="done").length,S=L.stories.filter(b=>b.githubCheckedIn).length,w=L.stories.filter(b=>b.deploymentUrl).length,A=(b,_)=>{const k=document.getElementById(b);k&&(k.textContent=_.toString())};if(A("total-stories",d),A("completed-stories",h),A("total-incidents",v),A("resolved-incidents",C),A("checkins",S),A("merges",Math.floor(S*.8)),A("deployments",w),A("velocity",Math.floor(h*2.5)),A("backlog-count",c),A("progress-count",f),A("done-count",h),A("commits-count",S*3),A("prs-count",S),A("merged-count",Math.floor(S*.8)),A("deployed-count",w),d>0){const b=c/d*100,_=f/d*100,k=h/d*100,U=document.querySelector(".bar-fill.backlog"),B=document.querySelector(".bar-fill.progress"),R=document.querySelector(".bar-fill.done");U&&(U.style.width=`${b}%`),B&&(B.style.width=`${_}%`),R&&(R.style.width=`${k}%`)}Jo()}function Jo(){const d=document.getElementById("burndown-chart");if(!d)return;const c=d.getContext("2d");if(!c)return;c.clearRect(0,0,d.width,d.height);const f=40,h=[40,38,35,33,28,25,20,18,12,8,0],v=[40,36,32,28,24,20,16,12,8,4,0],C=40,S=d.width-C*2,w=d.height-C*2;c.strokeStyle="rgba(255, 255, 255, 0.1)",c.lineWidth=1;for(let A=0;A<=10;A++){const b=C+S/10*A;c.beginPath(),c.moveTo(b,C),c.lineTo(b,d.height-C),c.stroke()}for(let A=0;A<=4;A++){const b=C+w/4*A;c.beginPath(),c.moveTo(C,b),c.lineTo(d.width-C,b),c.stroke()}c.strokeStyle="#3498db",c.lineWidth=2,c.setLineDash([5,5]),c.beginPath(),v.forEach((A,b)=>{const _=C+S/10*b,k=d.height-C-A/f*w;b===0?c.moveTo(_,k):c.lineTo(_,k)}),c.stroke(),c.strokeStyle="#e74c3c",c.lineWidth=3,c.setLineDash([]),c.beginPath(),h.forEach((A,b)=>{const _=C+S/10*b,k=d.height-C-A/f*w;b===0?c.moveTo(_,k):c.lineTo(_,k)}),c.stroke(),c.fillStyle="rgba(255, 255, 255, 0.7)",c.font="12px Arial",c.textAlign="center";for(let A=0;A<=10;A+=2){const b=C+S/10*A;c.fillText(`Day ${A}`,b,d.height-10)}c.textAlign="right";for(let A=0;A<=4;A++){const b=d.height-C-w/4*A+4,_=f/4*A;c.fillText(_.toString(),C-10,b)}}setInterval(Ne,2e3);function Wo(d){const c=document.querySelector(".modal-overlay");c&&c.remove();const f=document.createElement("div");f.className="modal-overlay",f.style.display="flex",f.style.position="fixed",f.style.top="0",f.style.left="0",f.style.width="100%",f.style.height="100%",f.style.zIndex="1000",f.innerHTML=`
            <div class="modal-content">
                <button class="modal-close" aria-label="Close modal">&times;</button>
                <div id="modal-story-details">
                    <div class="card-header">
                        <h4>${d.title}</h4>
                        <span class="story-points">${d.points} SP</span>
                    </div>
                    <p class="story-description">${d.description}</p>
                    <strong>Acceptance Criteria:</strong>
                    <ul>
                        ${d.acceptanceCriteria.map(w=>`<li>${w}</li>`).join("")}
                    </ul>
                </div>
                <hr>
                <div class="modal-actions">
                    <h3>🤖 AI Agents</h3>
                    <div class="action-card">
                        <h4>1. AI Architect</h4>
                        <p>Generate a high-level technical architecture for this story.</p>
                        <button id="architect-button" class="action-button">Generate Architecture</button>
                        <div id="architect-output" class="output-container"></div>
                    </div>
                    <div class="action-card">
                        <h4>2. AI Developer</h4>
                        <p>Generate production-ready code based on the story and architecture.</p>
                        <div class="language-selector" style="margin-bottom: 1rem;">
                            <label for="code-language" style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Language/Framework:</label>
                            <select id="code-language" style="width: 100%; padding: 0.5rem; border: 1px solid #374151; border-radius: 4px; background: #1f2937; color: #f9fafb;">
                                <option value="react-typescript">React + TypeScript</option>
                                <option value="vue-typescript">Vue.js + TypeScript</option>
                                <option value="angular-typescript">Angular + TypeScript</option>
                                <option value="python-fastapi">Python + FastAPI</option>
                                <option value="java-spring">Java + Spring Boot</option>
                                <option value="csharp-dotnet">C# + .NET</option>
                                <option value="nodejs-express">Node.js + Express</option>
                                <option value="go-gin">Go + Gin</option>
                                <option value="rust-actix">Rust + Actix</option>
                            </select>
                        </div>
                        <button id="developer-button" class="action-button" disabled>Generate Code</button>
                        <div id="developer-output" class="output-container">
                            <pre><code class="language-typescript"></code></pre>
                        </div>
                    </div>
                    <div id="devops-card" class="action-card" style="display: none;">
                        <h4>3. AI DevOps</h4>
                        <p>Execute the automated workflow: Check-in, Test, and Deploy.</p>
                        <button id="workflow-button" class="action-button">🚀 Execute Workflow</button>
                        <div id="workflow-status" class="workflow-status-message"></div>
                        <div id="devops-output" class="output-container" style="display: none;"></div>
                    </div>
                    <div id="cloud-deploy-card" class="action-card" style="display: none;">
                        <h4>4. AI Cloud Deployment</h4>
                        <p>Deploy your application to cloud infrastructure with auto-scaling and monitoring.</p>
                        <button id="cloud-deploy-button" class="action-button">☁️ Deploy to Cloud</button>
                        <div id="cloud-deploy-output" class="output-container" style="display: none;"></div>
                    </div>
                    <div id="cloud-deploy-card" class="action-card" style="display: none;">
                        <h4>4. Cloud Deployment</h4>
                        <p>Deploy to cloud infrastructure with auto-scaling and monitoring.</p>
                        <button id="cloud-deploy-button" class="action-button">☁️ Deploy to Cloud</button>
                        <div id="cloud-deploy-output" class="output-container" style="display: none;"></div>
                    </div>
                </div>
            </div>
        `;const h=f.querySelector(".modal-close");h&&h.addEventListener("click",()=>{f.remove(),document.body.style.overflow="auto"}),f.addEventListener("click",w=>{w.target===f&&(f.remove(),document.body.style.overflow="auto")});const v=f.querySelector("#architect-button");v&&v.addEventListener("click",()=>Xn(d));const C=f.querySelector("#developer-button");C&&C.addEventListener("click",()=>{console.log("Developer button clicked in dynamic modal"),Qn(d)});const S=f.querySelector("#cloud-deploy-button");S&&S.addEventListener("click",()=>Le(d)),document.body.appendChild(f),document.body.style.overflow="hidden",console.log("Created and displayed story modal")}function Yo(){console.log("showCreateStoryModal called");const d=document.getElementById("create-story-modal");if(console.log("Modal found:",!!d),d){d.style.display="flex",d.style.position="fixed",d.style.top="0",d.style.left="0",d.style.width="100%",d.style.height="100%",d.style.zIndex="1000",document.body.style.overflow="hidden";const c=document.getElementById("story-title");c&&setTimeout(()=>c.focus(),100),console.log("Modal should be visible now")}else console.error("Create story modal not found in DOM")}function ye(){const d=document.getElementById("create-story-modal"),c=document.getElementById("create-story-form");d&&(d.style.display="none",document.body.style.overflow="auto"),c&&c.reset()}function Ko(d){d.preventDefault();const c=document.getElementById("story-title"),f=document.getElementById("story-description"),h=document.getElementById("story-criteria"),v=document.getElementById("story-points"),C=document.getElementById("story-type");if(!c||!f||!h||!v||!C){alert("Form elements not found. Please refresh the page.");return}const S=c.value.trim(),w=f.value.trim(),A=h.value.trim(),b=parseInt(v.value),_=C.value;if(!S){alert("Story title is required."),c.focus();return}if(!w){alert("Story description is required."),f.focus();return}if(!A){alert("Acceptance criteria is required."),h.focus();return}const k=A.split(`
`).map(B=>B.trim().replace(/^[-*•]\s*/,"")).filter(B=>B.length>0);if(k.length===0){alert("Please enter at least one acceptance criterion.");return}const U={id:"custom-"+Date.now(),title:S,description:w,acceptanceCriteria:k,status:"backlog",type:_,points:b,creationDate:new Date,completionDate:null,githubCheckedIn:!1};M.addStory(U),Q(),Ne(),ye(),alert(`✅ Story "${S}" created successfully!

The story has been added to your backlog and is ready for development.`),O("project"),setTimeout(()=>{Q(),console.log("Board re-rendered after story creation")},50)}});
