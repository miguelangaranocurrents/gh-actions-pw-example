"use strict";var p=Object.defineProperty;var f=Object.getOwnPropertyDescriptor;var a=Object.getOwnPropertyNames;var g=Object.prototype.hasOwnProperty;var m=(e,t)=>{for(var s in t)p(e,s,{get:t[s],enumerable:!0})},l=(e,t,s,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of a(t))!g.call(e,r)&&r!==s&&p(e,r,{get:()=>t[r],enumerable:!(n=f(t,r))||n.enumerable});return e};var x=e=>l(p({},"__esModule",{value:!0}),e);var h={};m(h,{parseTestSuite:()=>T});module.exports=x(h);var c=e=>{let t=e.split(`
`),s={};for(let n of t){let r=n.match(/\[([^\]]+)\] › ([^:]+):(\d+:\d+) › (.+)/);if(r){let[d,i,o,y,u]=r;s[i]||(s[i]={}),s[i][o]||(s[i][o]=[]),s[i][o].push(u)}}return s};function T(e,t){return c(e)}0&&(module.exports={parseTestSuite});
/*! For license information please see index.js.LEGAL.txt */
//# sourceMappingURL=index.js.map