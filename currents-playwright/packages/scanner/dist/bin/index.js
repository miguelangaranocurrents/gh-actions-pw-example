#! /usr/bin/env node
"use strict";var I=Object.create;var f=Object.defineProperty;var R=Object.getOwnPropertyDescriptor;var F=Object.getOwnPropertyNames;var b=Object.getPrototypeOf,P=Object.prototype.hasOwnProperty;var k=(e,r,n,c)=>{if(r&&typeof r=="object"||typeof r=="function")for(let i of F(r))!P.call(e,i)&&i!==n&&f(e,i,{get:()=>r[i],enumerable:!(c=R(r,i))||c.enumerable});return e};var a=(e,r,n)=>(n=e!=null?I(b(e)):{},k(r||!e||!e.__esModule?f(n,"default",{value:e,enumerable:!0}):n,e));var re=require("source-map-support/register"),h=a(require("debug")),j=a(require("fs"));var m=e=>{let r=e.split(`
`),n={};for(let c of r){let i=c.match(/\[([^\]]+)\] › ([^:]+):(\d+:\d+) › (.+)/);if(i){let[l,s,g,C,T]=i;n[s]||(n[s]={}),n[s][g]||(n[s][g]=[]),n[s][g].push(T)}}return n};function d(e,r){return m(e)}var w=a(require("debug")),x=(0,w.default)("pwc-scanner"),S=async params=>{let{execa}=await eval('import("execa")'),cliParams=["test","--list",...Object.entries(params).filter(([e,r])=>r!==void 0).map(([e,r])=>`${A(e)}=${r}`),"--reporter=list","--shard=1/1"];x("running playwright with the following params: %o",cliParams);let execaResult=await execa("playwright",cliParams,{env:{PWTEST_WATCH:void 0}});return x("execa result: %o",execaResult),execaResult.failed?{execaResult,result:null}:{execaResult,result:d(execaResult.stdout)}},A=e=>{switch(e){case"project":return"--project";case"grep":return"--grep";case"grepInvert":return"--grep-invert";case"config":return"--config";default:throw new Error("Invalid param")}};var v=a(require("arg"));var t={config:"--config",grep:"--grep",grepInvert:"--grep-invert",project:"--project",inspect:"--inspect",outFile:"--out-file",c:"-c",g:"-g"};var o=(0,v.default)({[t.config]:String,[t.grep]:String,[t.grepInvert]:String,[t.project]:String,[t.outFile]:String,[t.c]:t.config,[t.g]:t.grep},{permissive:!0});function y(){let e=t.outFile in o?o[t.outFile]:"./pwc-scanner-output.json";if(!e){let c="--out-file is not set";throw new Error(c)}let r=t.grep in o?o[t.grep]:t.g in o?o[t.g]:void 0,n=t.config in o?o[t.config]:t.c in o?o[t.c]:void 0;return{project:o["--project"],grepInvert:o["--grep-invert"],grep:r,config:n,outFile:e}}var u=(0,h.default)("pwc-scanner:cli");(async function(){let{outFile:r,project:n,grep:c,grepInvert:i,config:l}=y();u("cli args: %o",o);let{result:s,execaResult:g}=await S({project:n,grep:c??null,grepInvert:i??null,config:l});process.stdout.write(g.stdout+`
`),u("result: %o",s),s&&(j.default.writeFileSync(r,JSON.stringify(s)),u("result was written to: %s",r)),process.exit(g.exitCode)})();
/*! For license information please see index.js.LEGAL.txt */
//# sourceMappingURL=index.js.map