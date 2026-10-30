(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Ua="169",es={ROTATE:0,DOLLY:1,PAN:2},Ji={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},lu=0,gl=1,cu=2,Kc=1,$c=2,Gn=3,pi=0,Be=1,sn=2,Zn=0,ns=1,Is=2,vl=3,_l=4,hu=5,Ei=100,uu=101,fu=102,du=103,pu=104,mu=200,gu=201,vu=202,_u=203,Bo=204,ko=205,xu=206,Mu=207,yu=208,Su=209,bu=210,Eu=211,wu=212,Tu=213,Au=214,Ho=0,Vo=1,Go=2,rs=3,Wo=4,Xo=5,Yo=6,qo=7,Jc=0,Cu=1,Ru=2,Kn=0,Pu=1,Du=2,Lu=3,Iu=4,Uu=5,Nu=6,Fu=7,Qc=300,os=301,as=302,jo=303,Zo=304,Vr=306,Ko=1e3,Ti=1001,$o=1002,Ze=1003,Ou=1004,Ws=1005,Sn=1006,to=1007,ui=1008,$n=1009,th=1010,eh=1011,Us=1012,Na=1013,Ai=1014,wn=1015,pn=1016,Fa=1017,Oa=1018,ls=1020,nh=35902,ih=1021,sh=1022,Tn=1023,rh=1024,oh=1025,is=1026,cs=1027,za=1028,Ba=1029,ah=1030,ka=1031,Ha=1033,yr=33776,Sr=33777,br=33778,Er=33779,Jo=35840,Qo=35841,ta=35842,ea=35843,na=36196,ia=37492,sa=37496,ra=37808,oa=37809,aa=37810,la=37811,ca=37812,ha=37813,ua=37814,fa=37815,da=37816,pa=37817,ma=37818,ga=37819,va=37820,_a=37821,wr=36492,xa=36494,Ma=36495,lh=36283,ya=36284,Sa=36285,ba=36286,zu=3200,Bu=3201,ch=0,ku=1,hi="",yn="srgb",Qn="srgb-linear",Va="display-p3",Gr="display-p3-linear",Cr="linear",ue="srgb",Rr="rec709",Pr="p3",Ii=7680,xl=519,Hu=512,Vu=513,Gu=514,hh=515,Wu=516,Xu=517,Yu=518,qu=519,Ml=35044,yl="300 es",jn=2e3,Dr=2001;class Ri{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}}const Fe=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Sl=1234567;const As=Math.PI/180,Ns=180/Math.PI;function Pi(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Fe[i&255]+Fe[i>>8&255]+Fe[i>>16&255]+Fe[i>>24&255]+"-"+Fe[t&255]+Fe[t>>8&255]+"-"+Fe[t>>16&15|64]+Fe[t>>24&255]+"-"+Fe[e&63|128]+Fe[e>>8&255]+"-"+Fe[e>>16&255]+Fe[e>>24&255]+Fe[n&255]+Fe[n>>8&255]+Fe[n>>16&255]+Fe[n>>24&255]).toLowerCase()}function Se(i,t,e){return Math.max(t,Math.min(e,i))}function Ga(i,t){return(i%t+t)%t}function ju(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function Zu(i,t,e){return i!==t?(e-i)/(t-i):0}function Cs(i,t,e){return(1-e)*i+e*t}function Ku(i,t,e,n){return Cs(i,t,1-Math.exp(-e*n))}function $u(i,t=1){return t-Math.abs(Ga(i,t*2)-t)}function Ju(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function Qu(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function tf(i,t){return i+Math.floor(Math.random()*(t-i+1))}function ef(i,t){return i+Math.random()*(t-i)}function nf(i){return i*(.5-Math.random())}function sf(i){i!==void 0&&(Sl=i);let t=Sl+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function rf(i){return i*As}function of(i){return i*Ns}function af(i){return(i&i-1)===0&&i!==0}function lf(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function cf(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function hf(i,t,e,n,s){const r=Math.cos,o=Math.sin,a=r(e/2),l=o(e/2),c=r((t+n)/2),h=o((t+n)/2),u=r((t-n)/2),f=o((t-n)/2),d=r((n-t)/2),g=o((n-t)/2);switch(s){case"XYX":i.set(a*h,l*u,l*f,a*c);break;case"YZY":i.set(l*f,a*h,l*u,a*c);break;case"ZXZ":i.set(l*u,l*f,a*h,a*c);break;case"XZX":i.set(a*h,l*g,l*d,a*c);break;case"YXY":i.set(l*d,a*h,l*g,a*c);break;case"ZYZ":i.set(l*g,l*d,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function $i(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function He(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Rn={DEG2RAD:As,RAD2DEG:Ns,generateUUID:Pi,clamp:Se,euclideanModulo:Ga,mapLinear:ju,inverseLerp:Zu,lerp:Cs,damp:Ku,pingpong:$u,smoothstep:Ju,smootherstep:Qu,randInt:tf,randFloat:ef,randFloatSpread:nf,seededRandom:sf,degToRad:rf,radToDeg:of,isPowerOfTwo:af,ceilPowerOfTwo:lf,floorPowerOfTwo:cf,setQuaternionFromProperEuler:hf,normalize:He,denormalize:$i};class ut{constructor(t=0,e=0){ut.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Se(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Xt{constructor(t,e,n,s,r,o,a,l,c){Xt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c)}set(t,e,n,s,r,o,a,l,c){const h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],u=n[7],f=n[2],d=n[5],g=n[8],S=s[0],p=s[3],m=s[6],w=s[1],y=s[4],x=s[7],L=s[2],D=s[5],A=s[8];return r[0]=o*S+a*w+l*L,r[3]=o*p+a*y+l*D,r[6]=o*m+a*x+l*A,r[1]=c*S+h*w+u*L,r[4]=c*p+h*y+u*D,r[7]=c*m+h*x+u*A,r[2]=f*S+d*w+g*L,r[5]=f*p+d*y+g*D,r[8]=f*m+d*x+g*A,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-n*r*h+n*a*l+s*r*c-s*o*l}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],u=h*o-a*c,f=a*l-h*r,d=c*r-o*l,g=e*u+n*f+s*d;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const S=1/g;return t[0]=u*S,t[1]=(s*c-h*n)*S,t[2]=(a*n-s*o)*S,t[3]=f*S,t[4]=(h*e-s*l)*S,t[5]=(s*r-a*e)*S,t[6]=d*S,t[7]=(n*l-c*e)*S,t[8]=(o*e-n*r)*S,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-s*c,s*l,-s*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(eo.makeScale(t,e)),this}rotate(t){return this.premultiply(eo.makeRotation(-t)),this}translate(t,e){return this.premultiply(eo.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const eo=new Xt;function uh(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Lr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function uf(){const i=Lr("canvas");return i.style.display="block",i}const bl={};function Tr(i){i in bl||(bl[i]=!0,console.warn(i))}function ff(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}function df(i){const t=i.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function pf(i){const t=i.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const El=new Xt().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),wl=new Xt().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),ms={[Qn]:{transfer:Cr,primaries:Rr,luminanceCoefficients:[.2126,.7152,.0722],toReference:i=>i,fromReference:i=>i},[yn]:{transfer:ue,primaries:Rr,luminanceCoefficients:[.2126,.7152,.0722],toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[Gr]:{transfer:Cr,primaries:Pr,luminanceCoefficients:[.2289,.6917,.0793],toReference:i=>i.applyMatrix3(wl),fromReference:i=>i.applyMatrix3(El)},[Va]:{transfer:ue,primaries:Pr,luminanceCoefficients:[.2289,.6917,.0793],toReference:i=>i.convertSRGBToLinear().applyMatrix3(wl),fromReference:i=>i.applyMatrix3(El).convertLinearToSRGB()}},mf=new Set([Qn,Gr]),ne={enabled:!0,_workingColorSpace:Qn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!mf.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,t,e){if(this.enabled===!1||t===e||!t||!e)return i;const n=ms[t].toReference,s=ms[e].fromReference;return s(n(i))},fromWorkingColorSpace:function(i,t){return this.convert(i,this._workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this._workingColorSpace)},getPrimaries:function(i){return ms[i].primaries},getTransfer:function(i){return i===hi?Cr:ms[i].transfer},getLuminanceCoefficients:function(i,t=this._workingColorSpace){return i.fromArray(ms[t].luminanceCoefficients)}};function ss(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function no(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Ui;class gf{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Ui===void 0&&(Ui=Lr("canvas")),Ui.width=t.width,Ui.height=t.height;const n=Ui.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=Ui}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Lr("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=ss(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(ss(e[n]/255)*255):e[n]=ss(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let vf=0;class fh{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:vf++}),this.uuid=Pi(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(io(s[o].image)):r.push(io(s[o]))}else r=io(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function io(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?gf.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let _f=0;class ke extends Ri{constructor(t=ke.DEFAULT_IMAGE,e=ke.DEFAULT_MAPPING,n=Ti,s=Ti,r=Sn,o=ui,a=Tn,l=$n,c=ke.DEFAULT_ANISOTROPY,h=hi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:_f++}),this.uuid=Pi(),this.name="",this.source=new fh(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new ut(0,0),this.repeat=new ut(1,1),this.center=new ut(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Xt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Qc)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Ko:t.x=t.x-Math.floor(t.x);break;case Ti:t.x=t.x<0?0:1;break;case $o:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Ko:t.y=t.y-Math.floor(t.y);break;case Ti:t.y=t.y<0?0:1;break;case $o:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}ke.DEFAULT_IMAGE=null;ke.DEFAULT_MAPPING=Qc;ke.DEFAULT_ANISOTROPY=1;class oe{constructor(t=0,e=0,n=0,s=1){oe.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const l=t.elements,c=l[0],h=l[4],u=l[8],f=l[1],d=l[5],g=l[9],S=l[2],p=l[6],m=l[10];if(Math.abs(h-f)<.01&&Math.abs(u-S)<.01&&Math.abs(g-p)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+S)<.1&&Math.abs(g+p)<.1&&Math.abs(c+d+m-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const y=(c+1)/2,x=(d+1)/2,L=(m+1)/2,D=(h+f)/4,A=(u+S)/4,I=(g+p)/4;return y>x&&y>L?y<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(y),s=D/n,r=A/n):x>L?x<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(x),n=D/s,r=I/s):L<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(L),n=A/r,s=I/r),this.set(n,s,r,e),this}let w=Math.sqrt((p-g)*(p-g)+(u-S)*(u-S)+(f-h)*(f-h));return Math.abs(w)<.001&&(w=1),this.x=(p-g)/w,this.y=(u-S)/w,this.z=(f-h)/w,this.w=Math.acos((c+d+m-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class xf extends Ri{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new oe(0,0,t,e),this.scissorTest=!1,this.viewport=new oe(0,0,t,e);const s={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Sn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const r=new ke(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,s=t.textures.length;n<s;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new fh(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class on extends xf{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class dh extends ke{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Ze,this.minFilter=Ze,this.wrapR=Ti,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Mf extends ke{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Ze,this.minFilter=Ze,this.wrapR=Ti,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Pn{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let l=n[s+0],c=n[s+1],h=n[s+2],u=n[s+3];const f=r[o+0],d=r[o+1],g=r[o+2],S=r[o+3];if(a===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u;return}if(a===1){t[e+0]=f,t[e+1]=d,t[e+2]=g,t[e+3]=S;return}if(u!==S||l!==f||c!==d||h!==g){let p=1-a;const m=l*f+c*d+h*g+u*S,w=m>=0?1:-1,y=1-m*m;if(y>Number.EPSILON){const L=Math.sqrt(y),D=Math.atan2(L,m*w);p=Math.sin(p*D)/L,a=Math.sin(a*D)/L}const x=a*w;if(l=l*p+f*x,c=c*p+d*x,h=h*p+g*x,u=u*p+S*x,p===1-a){const L=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=L,c*=L,h*=L,u*=L}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,r,o){const a=n[s],l=n[s+1],c=n[s+2],h=n[s+3],u=r[o],f=r[o+1],d=r[o+2],g=r[o+3];return t[e]=a*g+h*u+l*d-c*f,t[e+1]=l*g+h*f+c*u-a*d,t[e+2]=c*g+h*d+a*f-l*u,t[e+3]=h*g-a*u-l*f-c*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(s/2),u=a(r/2),f=l(n/2),d=l(s/2),g=l(r/2);switch(o){case"XYZ":this._x=f*h*u+c*d*g,this._y=c*d*u-f*h*g,this._z=c*h*g+f*d*u,this._w=c*h*u-f*d*g;break;case"YXZ":this._x=f*h*u+c*d*g,this._y=c*d*u-f*h*g,this._z=c*h*g-f*d*u,this._w=c*h*u+f*d*g;break;case"ZXY":this._x=f*h*u-c*d*g,this._y=c*d*u+f*h*g,this._z=c*h*g+f*d*u,this._w=c*h*u-f*d*g;break;case"ZYX":this._x=f*h*u-c*d*g,this._y=c*d*u+f*h*g,this._z=c*h*g-f*d*u,this._w=c*h*u+f*d*g;break;case"YZX":this._x=f*h*u+c*d*g,this._y=c*d*u+f*h*g,this._z=c*h*g-f*d*u,this._w=c*h*u-f*d*g;break;case"XZY":this._x=f*h*u-c*d*g,this._y=c*d*u-f*h*g,this._z=c*h*g+f*d*u,this._w=c*h*u+f*d*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],u=e[10],f=n+a+u;if(f>0){const d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(h-l)*d,this._y=(r-c)*d,this._z=(o-s)*d}else if(n>a&&n>u){const d=2*Math.sqrt(1+n-a-u);this._w=(h-l)/d,this._x=.25*d,this._y=(s+o)/d,this._z=(r+c)/d}else if(a>u){const d=2*Math.sqrt(1+a-n-u);this._w=(r-c)/d,this._x=(s+o)/d,this._y=.25*d,this._z=(l+h)/d}else{const d=2*Math.sqrt(1+u-n-a);this._w=(o-s)/d,this._x=(r+c)/d,this._y=(l+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Se(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-s*a,this._w=o*h-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,o=this._w;let a=o*t._w+n*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;const l=1-a*a;if(l<=Number.EPSILON){const d=1-e;return this._w=d*o+e*this._w,this._x=d*n+e*this._x,this._y=d*s+e*this._y,this._z=d*r+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,a),u=Math.sin((1-e)*h)/c,f=Math.sin(e*h)/c;return this._w=o*u+this._w*f,this._x=n*u+this._x*f,this._y=s*u+this._y*f,this._z=r*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class P{constructor(t=0,e=0,n=0){P.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Tl.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Tl.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*s-a*n),h=2*(a*e-r*s),u=2*(r*n-o*e);return this.x=e+l*c+o*u-a*h,this.y=n+l*h+a*c-r*u,this.z=s+l*u+r*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return so.copy(this).projectOnVector(t),this.sub(so)}reflect(t){return this.sub(so.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Se(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const so=new P,Tl=new Pn;class Di{constructor(t=new P(1/0,1/0,1/0),e=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(vn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(vn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=vn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,vn):vn.fromBufferAttribute(r,o),vn.applyMatrix4(t.matrixWorld),this.expandByPoint(vn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Xs.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Xs.copy(n.boundingBox)),Xs.applyMatrix4(t.matrixWorld),this.union(Xs)}const s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,vn),vn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(gs),Ys.subVectors(this.max,gs),Ni.subVectors(t.a,gs),Fi.subVectors(t.b,gs),Oi.subVectors(t.c,gs),ei.subVectors(Fi,Ni),ni.subVectors(Oi,Fi),gi.subVectors(Ni,Oi);let e=[0,-ei.z,ei.y,0,-ni.z,ni.y,0,-gi.z,gi.y,ei.z,0,-ei.x,ni.z,0,-ni.x,gi.z,0,-gi.x,-ei.y,ei.x,0,-ni.y,ni.x,0,-gi.y,gi.x,0];return!ro(e,Ni,Fi,Oi,Ys)||(e=[1,0,0,0,1,0,0,0,1],!ro(e,Ni,Fi,Oi,Ys))?!1:(qs.crossVectors(ei,ni),e=[qs.x,qs.y,qs.z],ro(e,Ni,Fi,Oi,Ys))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,vn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(vn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(On[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),On[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),On[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),On[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),On[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),On[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),On[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),On[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(On),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const On=[new P,new P,new P,new P,new P,new P,new P,new P],vn=new P,Xs=new Di,Ni=new P,Fi=new P,Oi=new P,ei=new P,ni=new P,gi=new P,gs=new P,Ys=new P,qs=new P,vi=new P;function ro(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){vi.fromArray(i,r);const a=s.x*Math.abs(vi.x)+s.y*Math.abs(vi.y)+s.z*Math.abs(vi.z),l=t.dot(vi),c=e.dot(vi),h=n.dot(vi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}const yf=new Di,vs=new P,oo=new P;class fs{constructor(t=new P,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):yf.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;vs.subVectors(t,this.center);const e=vs.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(vs,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(oo.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(vs.copy(t.center).add(oo)),this.expandByPoint(vs.copy(t.center).sub(oo))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const zn=new P,ao=new P,js=new P,ii=new P,lo=new P,Zs=new P,co=new P;class Wa{constructor(t=new P,e=new P(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,zn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=zn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(zn.copy(this.origin).addScaledVector(this.direction,e),zn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){ao.copy(t).add(e).multiplyScalar(.5),js.copy(e).sub(t).normalize(),ii.copy(this.origin).sub(ao);const r=t.distanceTo(e)*.5,o=-this.direction.dot(js),a=ii.dot(this.direction),l=-ii.dot(js),c=ii.lengthSq(),h=Math.abs(1-o*o);let u,f,d,g;if(h>0)if(u=o*l-a,f=o*a-l,g=r*h,u>=0)if(f>=-g)if(f<=g){const S=1/h;u*=S,f*=S,d=u*(u+o*f+2*a)+f*(o*u+f+2*l)+c}else f=r,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*l)+c;else f=-r,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*l)+c;else f<=-g?(u=Math.max(0,-(-o*r+a)),f=u>0?-r:Math.min(Math.max(-r,-l),r),d=-u*u+f*(f+2*l)+c):f<=g?(u=0,f=Math.min(Math.max(-r,-l),r),d=f*(f+2*l)+c):(u=Math.max(0,-(o*r+a)),f=u>0?r:Math.min(Math.max(-r,-l),r),d=-u*u+f*(f+2*l)+c);else f=o>0?-r:r,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(ao).addScaledVector(js,f),d}intersectSphere(t,e){zn.subVectors(t.center,this.origin);const n=zn.dot(this.direction),s=zn.dot(zn)-n*n,r=t.radius*t.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return c>=0?(n=(t.min.x-f.x)*c,s=(t.max.x-f.x)*c):(n=(t.max.x-f.x)*c,s=(t.min.x-f.x)*c),h>=0?(r=(t.min.y-f.y)*h,o=(t.max.y-f.y)*h):(r=(t.max.y-f.y)*h,o=(t.min.y-f.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(t.min.z-f.z)*u,l=(t.max.z-f.z)*u):(a=(t.max.z-f.z)*u,l=(t.min.z-f.z)*u),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,zn)!==null}intersectTriangle(t,e,n,s,r){lo.subVectors(e,t),Zs.subVectors(n,t),co.crossVectors(lo,Zs);let o=this.direction.dot(co),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;ii.subVectors(this.origin,t);const l=a*this.direction.dot(Zs.crossVectors(ii,Zs));if(l<0)return null;const c=a*this.direction.dot(lo.cross(ii));if(c<0||l+c>o)return null;const h=-a*ii.dot(co);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class se{constructor(t,e,n,s,r,o,a,l,c,h,u,f,d,g,S,p){se.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c,h,u,f,d,g,S,p)}set(t,e,n,s,r,o,a,l,c,h,u,f,d,g,S,p){const m=this.elements;return m[0]=t,m[4]=e,m[8]=n,m[12]=s,m[1]=r,m[5]=o,m[9]=a,m[13]=l,m[2]=c,m[6]=h,m[10]=u,m[14]=f,m[3]=d,m[7]=g,m[11]=S,m[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new se().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/zi.setFromMatrixColumn(t,0).length(),r=1/zi.setFromMatrixColumn(t,1).length(),o=1/zi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const f=o*h,d=o*u,g=a*h,S=a*u;e[0]=l*h,e[4]=-l*u,e[8]=c,e[1]=d+g*c,e[5]=f-S*c,e[9]=-a*l,e[2]=S-f*c,e[6]=g+d*c,e[10]=o*l}else if(t.order==="YXZ"){const f=l*h,d=l*u,g=c*h,S=c*u;e[0]=f+S*a,e[4]=g*a-d,e[8]=o*c,e[1]=o*u,e[5]=o*h,e[9]=-a,e[2]=d*a-g,e[6]=S+f*a,e[10]=o*l}else if(t.order==="ZXY"){const f=l*h,d=l*u,g=c*h,S=c*u;e[0]=f-S*a,e[4]=-o*u,e[8]=g+d*a,e[1]=d+g*a,e[5]=o*h,e[9]=S-f*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){const f=o*h,d=o*u,g=a*h,S=a*u;e[0]=l*h,e[4]=g*c-d,e[8]=f*c+S,e[1]=l*u,e[5]=S*c+f,e[9]=d*c-g,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){const f=o*l,d=o*c,g=a*l,S=a*c;e[0]=l*h,e[4]=S-f*u,e[8]=g*u+d,e[1]=u,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=d*u+g,e[10]=f-S*u}else if(t.order==="XZY"){const f=o*l,d=o*c,g=a*l,S=a*c;e[0]=l*h,e[4]=-u,e[8]=c*h,e[1]=f*u+S,e[5]=o*h,e[9]=d*u-g,e[2]=g*u-d,e[6]=a*h,e[10]=S*u+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Sf,t,bf)}lookAt(t,e,n){const s=this.elements;return Qe.subVectors(t,e),Qe.lengthSq()===0&&(Qe.z=1),Qe.normalize(),si.crossVectors(n,Qe),si.lengthSq()===0&&(Math.abs(n.z)===1?Qe.x+=1e-4:Qe.z+=1e-4,Qe.normalize(),si.crossVectors(n,Qe)),si.normalize(),Ks.crossVectors(Qe,si),s[0]=si.x,s[4]=Ks.x,s[8]=Qe.x,s[1]=si.y,s[5]=Ks.y,s[9]=Qe.y,s[2]=si.z,s[6]=Ks.z,s[10]=Qe.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],u=n[5],f=n[9],d=n[13],g=n[2],S=n[6],p=n[10],m=n[14],w=n[3],y=n[7],x=n[11],L=n[15],D=s[0],A=s[4],I=s[8],z=s[12],_=s[1],E=s[5],k=s[9],q=s[13],K=s[2],tt=s[6],Z=s[10],lt=s[14],Q=s[3],xt=s[7],yt=s[11],pt=s[15];return r[0]=o*D+a*_+l*K+c*Q,r[4]=o*A+a*E+l*tt+c*xt,r[8]=o*I+a*k+l*Z+c*yt,r[12]=o*z+a*q+l*lt+c*pt,r[1]=h*D+u*_+f*K+d*Q,r[5]=h*A+u*E+f*tt+d*xt,r[9]=h*I+u*k+f*Z+d*yt,r[13]=h*z+u*q+f*lt+d*pt,r[2]=g*D+S*_+p*K+m*Q,r[6]=g*A+S*E+p*tt+m*xt,r[10]=g*I+S*k+p*Z+m*yt,r[14]=g*z+S*q+p*lt+m*pt,r[3]=w*D+y*_+x*K+L*Q,r[7]=w*A+y*E+x*tt+L*xt,r[11]=w*I+y*k+x*Z+L*yt,r[15]=w*z+y*q+x*lt+L*pt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],u=t[6],f=t[10],d=t[14],g=t[3],S=t[7],p=t[11],m=t[15];return g*(+r*l*u-s*c*u-r*a*f+n*c*f+s*a*d-n*l*d)+S*(+e*l*d-e*c*f+r*o*f-s*o*d+s*c*h-r*l*h)+p*(+e*c*u-e*a*d-r*o*u+n*o*d+r*a*h-n*c*h)+m*(-s*a*h-e*l*u+e*a*f+s*o*u-n*o*f+n*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],u=t[9],f=t[10],d=t[11],g=t[12],S=t[13],p=t[14],m=t[15],w=u*p*c-S*f*c+S*l*d-a*p*d-u*l*m+a*f*m,y=g*f*c-h*p*c-g*l*d+o*p*d+h*l*m-o*f*m,x=h*S*c-g*u*c+g*a*d-o*S*d-h*a*m+o*u*m,L=g*u*l-h*S*l-g*a*f+o*S*f+h*a*p-o*u*p,D=e*w+n*y+s*x+r*L;if(D===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/D;return t[0]=w*A,t[1]=(S*f*r-u*p*r-S*s*d+n*p*d+u*s*m-n*f*m)*A,t[2]=(a*p*r-S*l*r+S*s*c-n*p*c-a*s*m+n*l*m)*A,t[3]=(u*l*r-a*f*r-u*s*c+n*f*c+a*s*d-n*l*d)*A,t[4]=y*A,t[5]=(h*p*r-g*f*r+g*s*d-e*p*d-h*s*m+e*f*m)*A,t[6]=(g*l*r-o*p*r-g*s*c+e*p*c+o*s*m-e*l*m)*A,t[7]=(o*f*r-h*l*r+h*s*c-e*f*c-o*s*d+e*l*d)*A,t[8]=x*A,t[9]=(g*u*r-h*S*r-g*n*d+e*S*d+h*n*m-e*u*m)*A,t[10]=(o*S*r-g*a*r+g*n*c-e*S*c-o*n*m+e*a*m)*A,t[11]=(h*a*r-o*u*r-h*n*c+e*u*c+o*n*d-e*a*d)*A,t[12]=L*A,t[13]=(h*S*s-g*u*s+g*n*f-e*S*f-h*n*p+e*u*p)*A,t[14]=(g*a*s-o*S*s-g*n*l+e*S*l+o*n*p-e*a*p)*A,t[15]=(o*u*s-h*a*s+h*n*l-e*u*l-o*n*f+e*a*f)*A,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+n,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,h=o+o,u=a+a,f=r*c,d=r*h,g=r*u,S=o*h,p=o*u,m=a*u,w=l*c,y=l*h,x=l*u,L=n.x,D=n.y,A=n.z;return s[0]=(1-(S+m))*L,s[1]=(d+x)*L,s[2]=(g-y)*L,s[3]=0,s[4]=(d-x)*D,s[5]=(1-(f+m))*D,s[6]=(p+w)*D,s[7]=0,s[8]=(g+y)*A,s[9]=(p-w)*A,s[10]=(1-(f+S))*A,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=zi.set(s[0],s[1],s[2]).length();const o=zi.set(s[4],s[5],s[6]).length(),a=zi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],_n.copy(this);const c=1/r,h=1/o,u=1/a;return _n.elements[0]*=c,_n.elements[1]*=c,_n.elements[2]*=c,_n.elements[4]*=h,_n.elements[5]*=h,_n.elements[6]*=h,_n.elements[8]*=u,_n.elements[9]*=u,_n.elements[10]*=u,e.setFromRotationMatrix(_n),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,s,r,o,a=jn){const l=this.elements,c=2*r/(e-t),h=2*r/(n-s),u=(e+t)/(e-t),f=(n+s)/(n-s);let d,g;if(a===jn)d=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===Dr)d=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=d,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=jn){const l=this.elements,c=1/(e-t),h=1/(n-s),u=1/(o-r),f=(e+t)*c,d=(n+s)*h;let g,S;if(a===jn)g=(o+r)*u,S=-2*u;else if(a===Dr)g=r*u,S=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-f,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-d,l[2]=0,l[6]=0,l[10]=S,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const zi=new P,_n=new se,Sf=new P(0,0,0),bf=new P(1,1,1),si=new P,Ks=new P,Qe=new P,Al=new se,Cl=new Pn;class Dn{constructor(t=0,e=0,n=0,s=Dn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],u=s[2],f=s[6],d=s[10];switch(e){case"XYZ":this._y=Math.asin(Se(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Se(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Se(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Se(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Se(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-Se(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Al.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Al,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Cl.setFromEuler(this),this.setFromQuaternion(Cl,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Dn.DEFAULT_ORDER="XYZ";class ph{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Ef=0;const Rl=new P,Bi=new Pn,Bn=new se,$s=new P,_s=new P,wf=new P,Tf=new Pn,Pl=new P(1,0,0),Dl=new P(0,1,0),Ll=new P(0,0,1),Il={type:"added"},Af={type:"removed"},ki={type:"childadded",child:null},ho={type:"childremoved",child:null};class Ne extends Ri{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Ef++}),this.uuid=Pi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ne.DEFAULT_UP.clone();const t=new P,e=new Dn,n=new Pn,s=new P(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new se},normalMatrix:{value:new Xt}}),this.matrix=new se,this.matrixWorld=new se,this.matrixAutoUpdate=Ne.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ne.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ph,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Bi.setFromAxisAngle(t,e),this.quaternion.multiply(Bi),this}rotateOnWorldAxis(t,e){return Bi.setFromAxisAngle(t,e),this.quaternion.premultiply(Bi),this}rotateX(t){return this.rotateOnAxis(Pl,t)}rotateY(t){return this.rotateOnAxis(Dl,t)}rotateZ(t){return this.rotateOnAxis(Ll,t)}translateOnAxis(t,e){return Rl.copy(t).applyQuaternion(this.quaternion),this.position.add(Rl.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Pl,t)}translateY(t){return this.translateOnAxis(Dl,t)}translateZ(t){return this.translateOnAxis(Ll,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Bn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?$s.copy(t):$s.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),_s.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Bn.lookAt(_s,$s,this.up):Bn.lookAt($s,_s,this.up),this.quaternion.setFromRotationMatrix(Bn),s&&(Bn.extractRotation(s.matrixWorld),Bi.setFromRotationMatrix(Bn),this.quaternion.premultiply(Bi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Il),ki.child=t,this.dispatchEvent(ki),ki.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Af),ho.child=t,this.dispatchEvent(ho),ho.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Bn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Bn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Bn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Il),ki.child=t,this.dispatchEvent(ki),ki.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(_s,t,wf),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(_s,Tf,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];r(t.shapes,u)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];s.animations.push(r(t.animations,l))}}if(e){const a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),u=o(t.shapes),f=o(t.skeletons),d=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),d.length>0&&(n.animations=d),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){const l=[];for(const c in a){const h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}Ne.DEFAULT_UP=new P(0,1,0);Ne.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ne.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const xn=new P,kn=new P,uo=new P,Hn=new P,Hi=new P,Vi=new P,Ul=new P,fo=new P,po=new P,mo=new P,go=new oe,vo=new oe,_o=new oe;class bn{constructor(t=new P,e=new P,n=new P){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),xn.subVectors(t,e),s.cross(xn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){xn.subVectors(s,e),kn.subVectors(n,e),uo.subVectors(t,e);const o=xn.dot(xn),a=xn.dot(kn),l=xn.dot(uo),c=kn.dot(kn),h=kn.dot(uo),u=o*c-a*a;if(u===0)return r.set(0,0,0),null;const f=1/u,d=(c*l-a*h)*f,g=(o*h-a*l)*f;return r.set(1-d-g,g,d)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Hn)===null?!1:Hn.x>=0&&Hn.y>=0&&Hn.x+Hn.y<=1}static getInterpolation(t,e,n,s,r,o,a,l){return this.getBarycoord(t,e,n,s,Hn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Hn.x),l.addScaledVector(o,Hn.y),l.addScaledVector(a,Hn.z),l)}static getInterpolatedAttribute(t,e,n,s,r,o){return go.setScalar(0),vo.setScalar(0),_o.setScalar(0),go.fromBufferAttribute(t,e),vo.fromBufferAttribute(t,n),_o.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(go,r.x),o.addScaledVector(vo,r.y),o.addScaledVector(_o,r.z),o}static isFrontFacing(t,e,n,s){return xn.subVectors(n,e),kn.subVectors(t,e),xn.cross(kn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return xn.subVectors(this.c,this.b),kn.subVectors(this.a,this.b),xn.cross(kn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return bn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return bn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return bn.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return bn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return bn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let o,a;Hi.subVectors(s,n),Vi.subVectors(r,n),fo.subVectors(t,n);const l=Hi.dot(fo),c=Vi.dot(fo);if(l<=0&&c<=0)return e.copy(n);po.subVectors(t,s);const h=Hi.dot(po),u=Vi.dot(po);if(h>=0&&u<=h)return e.copy(s);const f=l*u-h*c;if(f<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(n).addScaledVector(Hi,o);mo.subVectors(t,r);const d=Hi.dot(mo),g=Vi.dot(mo);if(g>=0&&d<=g)return e.copy(r);const S=d*c-l*g;if(S<=0&&c>=0&&g<=0)return a=c/(c-g),e.copy(n).addScaledVector(Vi,a);const p=h*g-d*u;if(p<=0&&u-h>=0&&d-g>=0)return Ul.subVectors(r,s),a=(u-h)/(u-h+(d-g)),e.copy(s).addScaledVector(Ul,a);const m=1/(p+S+f);return o=S*m,a=f*m,e.copy(n).addScaledVector(Hi,o).addScaledVector(Vi,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const mh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ri={h:0,s:0,l:0},Js={h:0,s:0,l:0};function xo(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Wt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=yn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ne.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=ne.workingColorSpace){return this.r=t,this.g=e,this.b=n,ne.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=ne.workingColorSpace){if(t=Ga(t,1),e=Se(e,0,1),n=Se(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=xo(o,r,t+1/3),this.g=xo(o,r,t),this.b=xo(o,r,t-1/3)}return ne.toWorkingColorSpace(this,s),this}setStyle(t,e=yn){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=yn){const n=mh[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=ss(t.r),this.g=ss(t.g),this.b=ss(t.b),this}copyLinearToSRGB(t){return this.r=no(t.r),this.g=no(t.g),this.b=no(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=yn){return ne.fromWorkingColorSpace(Oe.copy(this),t),Math.round(Se(Oe.r*255,0,255))*65536+Math.round(Se(Oe.g*255,0,255))*256+Math.round(Se(Oe.b*255,0,255))}getHexString(t=yn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ne.workingColorSpace){ne.fromWorkingColorSpace(Oe.copy(this),e);const n=Oe.r,s=Oe.g,r=Oe.b,o=Math.max(n,s,r),a=Math.min(n,s,r);let l,c;const h=(a+o)/2;if(a===o)l=0,c=0;else{const u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case n:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-n)/u+2;break;case r:l=(n-s)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=ne.workingColorSpace){return ne.fromWorkingColorSpace(Oe.copy(this),e),t.r=Oe.r,t.g=Oe.g,t.b=Oe.b,t}getStyle(t=yn){ne.fromWorkingColorSpace(Oe.copy(this),t);const e=Oe.r,n=Oe.g,s=Oe.b;return t!==yn?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(ri),this.setHSL(ri.h+t,ri.s+e,ri.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(ri),t.getHSL(Js);const n=Cs(ri.h,Js.h,e),s=Cs(ri.s,Js.s,e),r=Cs(ri.l,Js.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Oe=new Wt;Wt.NAMES=mh;let Cf=0;class ds extends Ri{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Cf++}),this.uuid=Pi(),this.name="",this.type="Material",this.blending=ns,this.side=pi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Bo,this.blendDst=ko,this.blendEquation=Ei,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Wt(0,0,0),this.blendAlpha=0,this.depthFunc=rs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=xl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ii,this.stencilZFail=Ii,this.stencilZPass=Ii,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==ns&&(n.blending=this.blending),this.side!==pi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Bo&&(n.blendSrc=this.blendSrc),this.blendDst!==ko&&(n.blendDst=this.blendDst),this.blendEquation!==Ei&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==rs&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==xl&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ii&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Ii&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Ii&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const o=[];for(const a in r){const l=r[a];delete l.metadata,o.push(l)}return o}if(e){const r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Xa extends ds{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Wt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Dn,this.combine=Jc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const qn=Rf();function Rf(){const i=new ArrayBuffer(4),t=new Float32Array(i),e=new Uint32Array(i),n=new Uint32Array(512),s=new Uint32Array(512);for(let l=0;l<256;++l){const c=l-127;c<-27?(n[l]=0,n[l|256]=32768,s[l]=24,s[l|256]=24):c<-14?(n[l]=1024>>-c-14,n[l|256]=1024>>-c-14|32768,s[l]=-c-1,s[l|256]=-c-1):c<=15?(n[l]=c+15<<10,n[l|256]=c+15<<10|32768,s[l]=13,s[l|256]=13):c<128?(n[l]=31744,n[l|256]=64512,s[l]=24,s[l|256]=24):(n[l]=31744,n[l|256]=64512,s[l]=13,s[l|256]=13)}const r=new Uint32Array(2048),o=new Uint32Array(64),a=new Uint32Array(64);for(let l=1;l<1024;++l){let c=l<<13,h=0;for(;!(c&8388608);)c<<=1,h-=8388608;c&=-8388609,h+=947912704,r[l]=c|h}for(let l=1024;l<2048;++l)r[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)o[l]=l<<23;o[31]=1199570944,o[32]=2147483648;for(let l=33;l<63;++l)o[l]=2147483648+(l-32<<23);o[63]=3347054592;for(let l=1;l<64;++l)l!==32&&(a[l]=1024);return{floatView:t,uint32View:e,baseTable:n,shiftTable:s,mantissaTable:r,exponentTable:o,offsetTable:a}}function Pf(i){Math.abs(i)>65504&&console.warn("THREE.DataUtils.toHalfFloat(): Value out of range."),i=Se(i,-65504,65504),qn.floatView[0]=i;const t=qn.uint32View[0],e=t>>23&511;return qn.baseTable[e]+((t&8388607)>>qn.shiftTable[e])}function Df(i){const t=i>>10;return qn.uint32View[0]=qn.mantissaTable[qn.offsetTable[t]+(i&1023)]+qn.exponentTable[t],qn.floatView[0]}const Gi={toHalfFloat:Pf,fromHalfFloat:Df},ye=new P,Qs=new ut;class xe{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Ml,this.updateRanges=[],this.gpuType=wn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Qs.fromBufferAttribute(this,e),Qs.applyMatrix3(t),this.setXY(e,Qs.x,Qs.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)ye.fromBufferAttribute(this,e),ye.applyMatrix3(t),this.setXYZ(e,ye.x,ye.y,ye.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)ye.fromBufferAttribute(this,e),ye.applyMatrix4(t),this.setXYZ(e,ye.x,ye.y,ye.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)ye.fromBufferAttribute(this,e),ye.applyNormalMatrix(t),this.setXYZ(e,ye.x,ye.y,ye.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)ye.fromBufferAttribute(this,e),ye.transformDirection(t),this.setXYZ(e,ye.x,ye.y,ye.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=$i(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=He(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=$i(e,this.array)),e}setX(t,e){return this.normalized&&(e=He(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=$i(e,this.array)),e}setY(t,e){return this.normalized&&(e=He(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=$i(e,this.array)),e}setZ(t,e){return this.normalized&&(e=He(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=$i(e,this.array)),e}setW(t,e){return this.normalized&&(e=He(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=He(e,this.array),n=He(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=He(e,this.array),n=He(n,this.array),s=He(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=He(e,this.array),n=He(n,this.array),s=He(s,this.array),r=He(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Ml&&(t.usage=this.usage),t}}class gh extends xe{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class vh extends xe{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class Yt extends xe{constructor(t,e,n){super(new Float32Array(t),e,n)}}let Lf=0;const ln=new se,Mo=new Ne,Wi=new P,tn=new Di,xs=new Di,Le=new P;class ce extends Ri{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Lf++}),this.uuid=Pi(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(uh(t)?vh:gh)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Xt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return ln.makeRotationFromQuaternion(t),this.applyMatrix4(ln),this}rotateX(t){return ln.makeRotationX(t),this.applyMatrix4(ln),this}rotateY(t){return ln.makeRotationY(t),this.applyMatrix4(ln),this}rotateZ(t){return ln.makeRotationZ(t),this.applyMatrix4(ln),this}translate(t,e,n){return ln.makeTranslation(t,e,n),this.applyMatrix4(ln),this}scale(t,e,n){return ln.makeScale(t,e,n),this.applyMatrix4(ln),this}lookAt(t){return Mo.lookAt(t),Mo.updateMatrix(),this.applyMatrix4(Mo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Wi).negate(),this.translate(Wi.x,Wi.y,Wi.z),this}setFromPoints(t){const e=[];for(let n=0,s=t.length;n<s;n++){const r=t[n];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new Yt(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Di);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];tn.setFromBufferAttribute(r),this.morphTargetsRelative?(Le.addVectors(this.boundingBox.min,tn.min),this.boundingBox.expandByPoint(Le),Le.addVectors(this.boundingBox.max,tn.max),this.boundingBox.expandByPoint(Le)):(this.boundingBox.expandByPoint(tn.min),this.boundingBox.expandByPoint(tn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new fs);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new P,1/0);return}if(t){const n=this.boundingSphere.center;if(tn.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){const a=e[r];xs.setFromBufferAttribute(a),this.morphTargetsRelative?(Le.addVectors(tn.min,xs.min),tn.expandByPoint(Le),Le.addVectors(tn.max,xs.max),tn.expandByPoint(Le)):(tn.expandByPoint(xs.min),tn.expandByPoint(xs.max))}tn.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)Le.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Le));if(e)for(let r=0,o=e.length;r<o;r++){const a=e[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)Le.fromBufferAttribute(a,c),l&&(Wi.fromBufferAttribute(t,c),Le.add(Wi)),s=Math.max(s,n.distanceToSquared(Le))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new xe(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let I=0;I<n.count;I++)a[I]=new P,l[I]=new P;const c=new P,h=new P,u=new P,f=new ut,d=new ut,g=new ut,S=new P,p=new P;function m(I,z,_){c.fromBufferAttribute(n,I),h.fromBufferAttribute(n,z),u.fromBufferAttribute(n,_),f.fromBufferAttribute(r,I),d.fromBufferAttribute(r,z),g.fromBufferAttribute(r,_),h.sub(c),u.sub(c),d.sub(f),g.sub(f);const E=1/(d.x*g.y-g.x*d.y);isFinite(E)&&(S.copy(h).multiplyScalar(g.y).addScaledVector(u,-d.y).multiplyScalar(E),p.copy(u).multiplyScalar(d.x).addScaledVector(h,-g.x).multiplyScalar(E),a[I].add(S),a[z].add(S),a[_].add(S),l[I].add(p),l[z].add(p),l[_].add(p))}let w=this.groups;w.length===0&&(w=[{start:0,count:t.count}]);for(let I=0,z=w.length;I<z;++I){const _=w[I],E=_.start,k=_.count;for(let q=E,K=E+k;q<K;q+=3)m(t.getX(q+0),t.getX(q+1),t.getX(q+2))}const y=new P,x=new P,L=new P,D=new P;function A(I){L.fromBufferAttribute(s,I),D.copy(L);const z=a[I];y.copy(z),y.sub(L.multiplyScalar(L.dot(z))).normalize(),x.crossVectors(D,z);const E=x.dot(l[I])<0?-1:1;o.setXYZW(I,y.x,y.y,y.z,E)}for(let I=0,z=w.length;I<z;++I){const _=w[I],E=_.start,k=_.count;for(let q=E,K=E+k;q<K;q+=3)A(t.getX(q+0)),A(t.getX(q+1)),A(t.getX(q+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new xe(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let f=0,d=n.count;f<d;f++)n.setXYZ(f,0,0,0);const s=new P,r=new P,o=new P,a=new P,l=new P,c=new P,h=new P,u=new P;if(t)for(let f=0,d=t.count;f<d;f+=3){const g=t.getX(f+0),S=t.getX(f+1),p=t.getX(f+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,S),o.fromBufferAttribute(e,p),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,S),c.fromBufferAttribute(n,p),a.add(h),l.add(h),c.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(S,l.x,l.y,l.z),n.setXYZ(p,c.x,c.y,c.z)}else for(let f=0,d=e.count;f<d;f+=3)s.fromBufferAttribute(e,f+0),r.fromBufferAttribute(e,f+1),o.fromBufferAttribute(e,f+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Le.fromBufferAttribute(t,e),Le.normalize(),t.setXYZ(e,Le.x,Le.y,Le.z)}toNonIndexed(){function t(a,l){const c=a.array,h=a.itemSize,u=a.normalized,f=new c.constructor(l.length*h);let d=0,g=0;for(let S=0,p=l.length;S<p;S++){a.isInterleavedBufferAttribute?d=l[S]*a.data.stride+a.offset:d=l[S]*h;for(let m=0;m<h;m++)f[g++]=c[d++]}return new xe(f,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new ce,n=this.index.array,s=this.attributes;for(const a in s){const l=s[a],c=t(l,n);e.setAttribute(a,c)}const r=this.morphAttributes;for(const a in r){const l=[],c=r[a];for(let h=0,u=c.length;h<u;h++){const f=c[h],d=t(f,n);l.push(d)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,f=c.length;u<f;u++){const d=c[u];h.push(d.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const s=t.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(e))}const r=t.morphAttributes;for(const c in r){const h=[],u=r[c];for(let f=0,d=u.length;f<d;f++)h.push(u[f].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,h=o.length;c<h;c++){const u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Nl=new se,_i=new Wa,tr=new fs,Fl=new P,er=new P,nr=new P,ir=new P,yo=new P,sr=new P,Ol=new P,rr=new P;class be extends Ne{constructor(t=new ce,e=new Xa){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const a=this.morphTargetInfluences;if(r&&a){sr.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=a[l],u=r[l];h!==0&&(yo.fromBufferAttribute(u,t),o?sr.addScaledVector(yo,h):sr.addScaledVector(yo.sub(e),h))}e.add(sr)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),tr.copy(n.boundingSphere),tr.applyMatrix4(r),_i.copy(t.ray).recast(t.near),!(tr.containsPoint(_i.origin)===!1&&(_i.intersectSphere(tr,Fl)===null||_i.origin.distanceToSquared(Fl)>(t.far-t.near)**2))&&(Nl.copy(r).invert(),_i.copy(t.ray).applyMatrix4(Nl),!(n.boundingBox!==null&&_i.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,_i)))}_computeIntersections(t,e,n){let s;const r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,f=r.groups,d=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,S=f.length;g<S;g++){const p=f[g],m=o[p.materialIndex],w=Math.max(p.start,d.start),y=Math.min(a.count,Math.min(p.start+p.count,d.start+d.count));for(let x=w,L=y;x<L;x+=3){const D=a.getX(x),A=a.getX(x+1),I=a.getX(x+2);s=or(this,m,t,n,c,h,u,D,A,I),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{const g=Math.max(0,d.start),S=Math.min(a.count,d.start+d.count);for(let p=g,m=S;p<m;p+=3){const w=a.getX(p),y=a.getX(p+1),x=a.getX(p+2);s=or(this,o,t,n,c,h,u,w,y,x),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,S=f.length;g<S;g++){const p=f[g],m=o[p.materialIndex],w=Math.max(p.start,d.start),y=Math.min(l.count,Math.min(p.start+p.count,d.start+d.count));for(let x=w,L=y;x<L;x+=3){const D=x,A=x+1,I=x+2;s=or(this,m,t,n,c,h,u,D,A,I),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{const g=Math.max(0,d.start),S=Math.min(l.count,d.start+d.count);for(let p=g,m=S;p<m;p+=3){const w=p,y=p+1,x=p+2;s=or(this,o,t,n,c,h,u,w,y,x),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}}}function If(i,t,e,n,s,r,o,a){let l;if(t.side===Be?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,t.side===pi,a),l===null)return null;rr.copy(a),rr.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(rr);return c<e.near||c>e.far?null:{distance:c,point:rr.clone(),object:i}}function or(i,t,e,n,s,r,o,a,l,c){i.getVertexPosition(a,er),i.getVertexPosition(l,nr),i.getVertexPosition(c,ir);const h=If(i,t,e,n,er,nr,ir,Ol);if(h){const u=new P;bn.getBarycoord(Ol,er,nr,ir,u),s&&(h.uv=bn.getInterpolatedAttribute(s,a,l,c,u,new ut)),r&&(h.uv1=bn.getInterpolatedAttribute(r,a,l,c,u,new ut)),o&&(h.normal=bn.getInterpolatedAttribute(o,a,l,c,u,new P),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const f={a,b:l,c,normal:new P,materialIndex:0};bn.getNormal(er,nr,ir,f.normal),h.face=f,h.barycoord=u}return h}class fe extends ce{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const l=[],c=[],h=[],u=[];let f=0,d=0;g("z","y","x",-1,-1,n,e,t,o,r,0),g("z","y","x",1,-1,n,e,-t,o,r,1),g("x","z","y",1,1,t,n,e,s,o,2),g("x","z","y",1,-1,t,n,-e,s,o,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new Yt(c,3)),this.setAttribute("normal",new Yt(h,3)),this.setAttribute("uv",new Yt(u,2));function g(S,p,m,w,y,x,L,D,A,I,z){const _=x/A,E=L/I,k=x/2,q=L/2,K=D/2,tt=A+1,Z=I+1;let lt=0,Q=0;const xt=new P;for(let yt=0;yt<Z;yt++){const pt=yt*E-q;for(let Bt=0;Bt<tt;Bt++){const qt=Bt*_-k;xt[S]=qt*w,xt[p]=pt*y,xt[m]=K,c.push(xt.x,xt.y,xt.z),xt[S]=0,xt[p]=0,xt[m]=D>0?1:-1,h.push(xt.x,xt.y,xt.z),u.push(Bt/A),u.push(1-yt/I),lt+=1}}for(let yt=0;yt<I;yt++)for(let pt=0;pt<A;pt++){const Bt=f+pt+tt*yt,qt=f+pt+tt*(yt+1),rt=f+(pt+1)+tt*(yt+1),dt=f+(pt+1)+tt*yt;l.push(Bt,qt,dt),l.push(qt,rt,dt),Q+=6}a.addGroup(d,Q,z),d+=Q,f+=lt}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new fe(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function hs(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Ve(i){const t={};for(let e=0;e<i.length;e++){const n=hs(i[e]);for(const s in n)t[s]=n[s]}return t}function Uf(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function _h(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:ne.workingColorSpace}const Ir={clone:hs,merge:Ve};var Nf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Ff=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Ee extends ds{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Nf,this.fragmentShader=Ff,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=hs(t.uniforms),this.uniformsGroups=Uf(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Ya extends Ne{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new se,this.projectionMatrix=new se,this.projectionMatrixInverse=new se,this.coordinateSystem=jn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const oi=new P,zl=new ut,Bl=new ut;class nn extends Ya{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Ns*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(As*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Ns*2*Math.atan(Math.tan(As*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){oi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(oi.x,oi.y).multiplyScalar(-t/oi.z),oi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(oi.x,oi.y).multiplyScalar(-t/oi.z)}getViewSize(t,e){return this.getViewBounds(t,zl,Bl),e.subVectors(Bl,zl)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(As*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,e-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}const a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Xi=-90,Yi=1;class Ea extends Ne{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new nn(Xi,Yi,t,e);s.layers=this.layers,this.add(s);const r=new nn(Xi,Yi,t,e);r.layers=this.layers,this.add(r);const o=new nn(Xi,Yi,t,e);o.layers=this.layers,this.add(o);const a=new nn(Xi,Yi,t,e);a.layers=this.layers,this.add(a);const l=new nn(Xi,Yi,t,e);l.layers=this.layers,this.add(l);const c=new nn(Xi,Yi,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,l]=e;for(const c of e)this.remove(c);if(t===jn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Dr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,l,c,h]=this.children,u=t.getRenderTarget(),f=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const S=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,o),t.setRenderTarget(n,2,s),t.render(e,a),t.setRenderTarget(n,3,s),t.render(e,l),t.setRenderTarget(n,4,s),t.render(e,c),n.texture.generateMipmaps=S,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(u,f,d),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class xh extends ke{constructor(t,e,n,s,r,o,a,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:os,super(t,e,n,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class wa extends on{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new xh(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:Sn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new fe(5,5,5),r=new Ee({name:"CubemapFromEquirect",uniforms:hs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Be,blending:Zn});r.uniforms.tEquirect.value=e;const o=new be(s,r),a=e.minFilter;return e.minFilter===ui&&(e.minFilter=Sn),new Ea(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,s){const r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}}const So=new P,Of=new P,zf=new Xt;class ci{constructor(t=new P(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=So.subVectors(n,e).cross(Of.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(So),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||zf.getNormalMatrix(t),s=this.coplanarPoint(So).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const xi=new fs,ar=new P;class qa{constructor(t=new ci,e=new ci,n=new ci,s=new ci,r=new ci,o=new ci){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=jn){const n=this.planes,s=t.elements,r=s[0],o=s[1],a=s[2],l=s[3],c=s[4],h=s[5],u=s[6],f=s[7],d=s[8],g=s[9],S=s[10],p=s[11],m=s[12],w=s[13],y=s[14],x=s[15];if(n[0].setComponents(l-r,f-c,p-d,x-m).normalize(),n[1].setComponents(l+r,f+c,p+d,x+m).normalize(),n[2].setComponents(l+o,f+h,p+g,x+w).normalize(),n[3].setComponents(l-o,f-h,p-g,x-w).normalize(),n[4].setComponents(l-a,f-u,p-S,x-y).normalize(),e===jn)n[5].setComponents(l+a,f+u,p+S,x+y).normalize();else if(e===Dr)n[5].setComponents(a,u,S,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),xi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),xi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(xi)}intersectsSprite(t){return xi.center.set(0,0,0),xi.radius=.7071067811865476,xi.applyMatrix4(t.matrixWorld),this.intersectsSphere(xi)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(ar.x=s.normal.x>0?t.max.x:t.min.x,ar.y=s.normal.y>0?t.max.y:t.min.y,ar.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(ar)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Mh(){let i=null,t=!1,e=null,n=null;function s(r,o){e(r,o),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function Bf(i){const t=new WeakMap;function e(a,l){const c=a.array,h=a.usage,u=c.byteLength,f=i.createBuffer();i.bindBuffer(l,f),i.bufferData(l,c,h),a.onUploadCallback();let d;if(c instanceof Float32Array)d=i.FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?d=i.HALF_FLOAT:d=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=i.SHORT;else if(c instanceof Uint32Array)d=i.UNSIGNED_INT;else if(c instanceof Int32Array)d=i.INT;else if(c instanceof Int8Array)d=i.BYTE;else if(c instanceof Uint8Array)d=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,l,c){const h=l.array,u=l.updateRanges;if(i.bindBuffer(c,a),u.length===0)i.bufferSubData(c,0,h);else{u.sort((d,g)=>d.start-g.start);let f=0;for(let d=1;d<u.length;d++){const g=u[f],S=u[d];S.start<=g.start+g.count+1?g.count=Math.max(g.count,S.start+S.count-g.start):(++f,u[f]=S)}u.length=f+1;for(let d=0,g=u.length;d<g;d++){const S=u[d];i.bufferSubData(c,S.start*h.BYTES_PER_ELEMENT,h,S.start,S.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=t.get(a);l&&(i.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}class An extends ce{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(s),c=a+1,h=l+1,u=t/a,f=e/l,d=[],g=[],S=[],p=[];for(let m=0;m<h;m++){const w=m*f-o;for(let y=0;y<c;y++){const x=y*u-r;g.push(x,-w,0),S.push(0,0,1),p.push(y/a),p.push(1-m/l)}}for(let m=0;m<l;m++)for(let w=0;w<a;w++){const y=w+c*m,x=w+c*(m+1),L=w+1+c*(m+1),D=w+1+c*m;d.push(y,x,D),d.push(x,L,D)}this.setIndex(d),this.setAttribute("position",new Yt(g,3)),this.setAttribute("normal",new Yt(S,3)),this.setAttribute("uv",new Yt(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new An(t.width,t.height,t.widthSegments,t.heightSegments)}}var kf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Hf=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Vf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Gf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Wf=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Xf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Yf=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,qf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,jf=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Zf=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Kf=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,$f=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Jf=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Qf=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,td=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,ed=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,nd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,id=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,sd=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,rd=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,od=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,ad=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,ld=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,cd=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,hd=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,ud=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,fd=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,dd=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,pd=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,md=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,gd="gl_FragColor = linearToOutputTexel( gl_FragColor );",vd=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,_d=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,xd=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Md=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,yd=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Sd=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,bd=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Ed=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,wd=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Td=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Ad=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Cd=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Rd=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Pd=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Dd=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Ld=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Id=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Ud=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Nd=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Fd=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Od=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,zd=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Bd=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,kd=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Hd=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Vd=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Gd=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Wd=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Xd=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Yd=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,qd=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,jd=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Zd=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Kd=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,$d=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Jd=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Qd=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,tp=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ep=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,np=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ip=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,sp=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,rp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,op=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ap=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,lp=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,cp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,hp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,up=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,fp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,dp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,pp=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,mp=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,gp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,vp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,_p=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,xp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Mp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,yp=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Sp=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,bp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Ep=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,wp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Tp=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Ap=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Cp=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Rp=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Pp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Dp=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Lp=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Ip=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Up=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Np=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Fp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Op=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,zp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Bp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,kp=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Hp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Vp=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Gp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Wp=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Xp=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Yp=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,qp=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,jp=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Zp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Kp=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$p=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Jp=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Qp=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,tm=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,em=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,nm=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,im=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,sm=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,rm=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,om=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,am=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,lm=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,cm=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,hm=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,um=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,fm=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,dm=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,pm=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,mm=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,gm=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,vm=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,_m=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Gt={alphahash_fragment:kf,alphahash_pars_fragment:Hf,alphamap_fragment:Vf,alphamap_pars_fragment:Gf,alphatest_fragment:Wf,alphatest_pars_fragment:Xf,aomap_fragment:Yf,aomap_pars_fragment:qf,batching_pars_vertex:jf,batching_vertex:Zf,begin_vertex:Kf,beginnormal_vertex:$f,bsdfs:Jf,iridescence_fragment:Qf,bumpmap_pars_fragment:td,clipping_planes_fragment:ed,clipping_planes_pars_fragment:nd,clipping_planes_pars_vertex:id,clipping_planes_vertex:sd,color_fragment:rd,color_pars_fragment:od,color_pars_vertex:ad,color_vertex:ld,common:cd,cube_uv_reflection_fragment:hd,defaultnormal_vertex:ud,displacementmap_pars_vertex:fd,displacementmap_vertex:dd,emissivemap_fragment:pd,emissivemap_pars_fragment:md,colorspace_fragment:gd,colorspace_pars_fragment:vd,envmap_fragment:_d,envmap_common_pars_fragment:xd,envmap_pars_fragment:Md,envmap_pars_vertex:yd,envmap_physical_pars_fragment:Ld,envmap_vertex:Sd,fog_vertex:bd,fog_pars_vertex:Ed,fog_fragment:wd,fog_pars_fragment:Td,gradientmap_pars_fragment:Ad,lightmap_pars_fragment:Cd,lights_lambert_fragment:Rd,lights_lambert_pars_fragment:Pd,lights_pars_begin:Dd,lights_toon_fragment:Id,lights_toon_pars_fragment:Ud,lights_phong_fragment:Nd,lights_phong_pars_fragment:Fd,lights_physical_fragment:Od,lights_physical_pars_fragment:zd,lights_fragment_begin:Bd,lights_fragment_maps:kd,lights_fragment_end:Hd,logdepthbuf_fragment:Vd,logdepthbuf_pars_fragment:Gd,logdepthbuf_pars_vertex:Wd,logdepthbuf_vertex:Xd,map_fragment:Yd,map_pars_fragment:qd,map_particle_fragment:jd,map_particle_pars_fragment:Zd,metalnessmap_fragment:Kd,metalnessmap_pars_fragment:$d,morphinstance_vertex:Jd,morphcolor_vertex:Qd,morphnormal_vertex:tp,morphtarget_pars_vertex:ep,morphtarget_vertex:np,normal_fragment_begin:ip,normal_fragment_maps:sp,normal_pars_fragment:rp,normal_pars_vertex:op,normal_vertex:ap,normalmap_pars_fragment:lp,clearcoat_normal_fragment_begin:cp,clearcoat_normal_fragment_maps:hp,clearcoat_pars_fragment:up,iridescence_pars_fragment:fp,opaque_fragment:dp,packing:pp,premultiplied_alpha_fragment:mp,project_vertex:gp,dithering_fragment:vp,dithering_pars_fragment:_p,roughnessmap_fragment:xp,roughnessmap_pars_fragment:Mp,shadowmap_pars_fragment:yp,shadowmap_pars_vertex:Sp,shadowmap_vertex:bp,shadowmask_pars_fragment:Ep,skinbase_vertex:wp,skinning_pars_vertex:Tp,skinning_vertex:Ap,skinnormal_vertex:Cp,specularmap_fragment:Rp,specularmap_pars_fragment:Pp,tonemapping_fragment:Dp,tonemapping_pars_fragment:Lp,transmission_fragment:Ip,transmission_pars_fragment:Up,uv_pars_fragment:Np,uv_pars_vertex:Fp,uv_vertex:Op,worldpos_vertex:zp,background_vert:Bp,background_frag:kp,backgroundCube_vert:Hp,backgroundCube_frag:Vp,cube_vert:Gp,cube_frag:Wp,depth_vert:Xp,depth_frag:Yp,distanceRGBA_vert:qp,distanceRGBA_frag:jp,equirect_vert:Zp,equirect_frag:Kp,linedashed_vert:$p,linedashed_frag:Jp,meshbasic_vert:Qp,meshbasic_frag:tm,meshlambert_vert:em,meshlambert_frag:nm,meshmatcap_vert:im,meshmatcap_frag:sm,meshnormal_vert:rm,meshnormal_frag:om,meshphong_vert:am,meshphong_frag:lm,meshphysical_vert:cm,meshphysical_frag:hm,meshtoon_vert:um,meshtoon_frag:fm,points_vert:dm,points_frag:pm,shadow_vert:mm,shadow_frag:gm,sprite_vert:vm,sprite_frag:_m},Mt={common:{diffuse:{value:new Wt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Xt},alphaMap:{value:null},alphaMapTransform:{value:new Xt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Xt}},envmap:{envMap:{value:null},envMapRotation:{value:new Xt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Xt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Xt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Xt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Xt},normalScale:{value:new ut(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Xt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Xt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Xt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Xt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Wt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Wt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Xt},alphaTest:{value:0},uvTransform:{value:new Xt}},sprite:{diffuse:{value:new Wt(16777215)},opacity:{value:1},center:{value:new ut(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Xt},alphaMap:{value:null},alphaMapTransform:{value:new Xt},alphaTest:{value:0}}},Un={basic:{uniforms:Ve([Mt.common,Mt.specularmap,Mt.envmap,Mt.aomap,Mt.lightmap,Mt.fog]),vertexShader:Gt.meshbasic_vert,fragmentShader:Gt.meshbasic_frag},lambert:{uniforms:Ve([Mt.common,Mt.specularmap,Mt.envmap,Mt.aomap,Mt.lightmap,Mt.emissivemap,Mt.bumpmap,Mt.normalmap,Mt.displacementmap,Mt.fog,Mt.lights,{emissive:{value:new Wt(0)}}]),vertexShader:Gt.meshlambert_vert,fragmentShader:Gt.meshlambert_frag},phong:{uniforms:Ve([Mt.common,Mt.specularmap,Mt.envmap,Mt.aomap,Mt.lightmap,Mt.emissivemap,Mt.bumpmap,Mt.normalmap,Mt.displacementmap,Mt.fog,Mt.lights,{emissive:{value:new Wt(0)},specular:{value:new Wt(1118481)},shininess:{value:30}}]),vertexShader:Gt.meshphong_vert,fragmentShader:Gt.meshphong_frag},standard:{uniforms:Ve([Mt.common,Mt.envmap,Mt.aomap,Mt.lightmap,Mt.emissivemap,Mt.bumpmap,Mt.normalmap,Mt.displacementmap,Mt.roughnessmap,Mt.metalnessmap,Mt.fog,Mt.lights,{emissive:{value:new Wt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Gt.meshphysical_vert,fragmentShader:Gt.meshphysical_frag},toon:{uniforms:Ve([Mt.common,Mt.aomap,Mt.lightmap,Mt.emissivemap,Mt.bumpmap,Mt.normalmap,Mt.displacementmap,Mt.gradientmap,Mt.fog,Mt.lights,{emissive:{value:new Wt(0)}}]),vertexShader:Gt.meshtoon_vert,fragmentShader:Gt.meshtoon_frag},matcap:{uniforms:Ve([Mt.common,Mt.bumpmap,Mt.normalmap,Mt.displacementmap,Mt.fog,{matcap:{value:null}}]),vertexShader:Gt.meshmatcap_vert,fragmentShader:Gt.meshmatcap_frag},points:{uniforms:Ve([Mt.points,Mt.fog]),vertexShader:Gt.points_vert,fragmentShader:Gt.points_frag},dashed:{uniforms:Ve([Mt.common,Mt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Gt.linedashed_vert,fragmentShader:Gt.linedashed_frag},depth:{uniforms:Ve([Mt.common,Mt.displacementmap]),vertexShader:Gt.depth_vert,fragmentShader:Gt.depth_frag},normal:{uniforms:Ve([Mt.common,Mt.bumpmap,Mt.normalmap,Mt.displacementmap,{opacity:{value:1}}]),vertexShader:Gt.meshnormal_vert,fragmentShader:Gt.meshnormal_frag},sprite:{uniforms:Ve([Mt.sprite,Mt.fog]),vertexShader:Gt.sprite_vert,fragmentShader:Gt.sprite_frag},background:{uniforms:{uvTransform:{value:new Xt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Gt.background_vert,fragmentShader:Gt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Xt}},vertexShader:Gt.backgroundCube_vert,fragmentShader:Gt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Gt.cube_vert,fragmentShader:Gt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Gt.equirect_vert,fragmentShader:Gt.equirect_frag},distanceRGBA:{uniforms:Ve([Mt.common,Mt.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Gt.distanceRGBA_vert,fragmentShader:Gt.distanceRGBA_frag},shadow:{uniforms:Ve([Mt.lights,Mt.fog,{color:{value:new Wt(0)},opacity:{value:1}}]),vertexShader:Gt.shadow_vert,fragmentShader:Gt.shadow_frag}};Un.physical={uniforms:Ve([Un.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Xt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Xt},clearcoatNormalScale:{value:new ut(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Xt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Xt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Xt},sheen:{value:0},sheenColor:{value:new Wt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Xt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Xt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Xt},transmissionSamplerSize:{value:new ut},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Xt},attenuationDistance:{value:0},attenuationColor:{value:new Wt(0)},specularColor:{value:new Wt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Xt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Xt},anisotropyVector:{value:new ut},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Xt}}]),vertexShader:Gt.meshphysical_vert,fragmentShader:Gt.meshphysical_frag};const lr={r:0,b:0,g:0},Mi=new Dn,xm=new se;function Mm(i,t,e,n,s,r,o){const a=new Wt(0);let l=r===!0?0:1,c,h,u=null,f=0,d=null;function g(w){let y=w.isScene===!0?w.background:null;return y&&y.isTexture&&(y=(w.backgroundBlurriness>0?e:t).get(y)),y}function S(w){let y=!1;const x=g(w);x===null?m(a,l):x&&x.isColor&&(m(x,1),y=!0);const L=i.xr.getEnvironmentBlendMode();L==="additive"?n.buffers.color.setClear(0,0,0,1,o):L==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||y)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function p(w,y){const x=g(y);x&&(x.isCubeTexture||x.mapping===Vr)?(h===void 0&&(h=new be(new fe(1,1,1),new Ee({name:"BackgroundCubeMaterial",uniforms:hs(Un.backgroundCube.uniforms),vertexShader:Un.backgroundCube.vertexShader,fragmentShader:Un.backgroundCube.fragmentShader,side:Be,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(L,D,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),Mi.copy(y.backgroundRotation),Mi.x*=-1,Mi.y*=-1,Mi.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(Mi.y*=-1,Mi.z*=-1),h.material.uniforms.envMap.value=x,h.material.uniforms.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(xm.makeRotationFromEuler(Mi)),h.material.toneMapped=ne.getTransfer(x.colorSpace)!==ue,(u!==x||f!==x.version||d!==i.toneMapping)&&(h.material.needsUpdate=!0,u=x,f=x.version,d=i.toneMapping),h.layers.enableAll(),w.unshift(h,h.geometry,h.material,0,0,null)):x&&x.isTexture&&(c===void 0&&(c=new be(new An(2,2),new Ee({name:"BackgroundMaterial",uniforms:hs(Un.background.uniforms),vertexShader:Un.background.vertexShader,fragmentShader:Un.background.fragmentShader,side:pi,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=x,c.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,c.material.toneMapped=ne.getTransfer(x.colorSpace)!==ue,x.matrixAutoUpdate===!0&&x.updateMatrix(),c.material.uniforms.uvTransform.value.copy(x.matrix),(u!==x||f!==x.version||d!==i.toneMapping)&&(c.material.needsUpdate=!0,u=x,f=x.version,d=i.toneMapping),c.layers.enableAll(),w.unshift(c,c.geometry,c.material,0,0,null))}function m(w,y){w.getRGB(lr,_h(i)),n.buffers.color.setClear(lr.r,lr.g,lr.b,y,o)}return{getClearColor:function(){return a},setClearColor:function(w,y=1){a.set(w),l=y,m(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(w){l=w,m(a,l)},render:S,addToRenderList:p}}function ym(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=f(null);let r=s,o=!1;function a(_,E,k,q,K){let tt=!1;const Z=u(q,k,E);r!==Z&&(r=Z,c(r.object)),tt=d(_,q,k,K),tt&&g(_,q,k,K),K!==null&&t.update(K,i.ELEMENT_ARRAY_BUFFER),(tt||o)&&(o=!1,x(_,E,k,q),K!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(K).buffer))}function l(){return i.createVertexArray()}function c(_){return i.bindVertexArray(_)}function h(_){return i.deleteVertexArray(_)}function u(_,E,k){const q=k.wireframe===!0;let K=n[_.id];K===void 0&&(K={},n[_.id]=K);let tt=K[E.id];tt===void 0&&(tt={},K[E.id]=tt);let Z=tt[q];return Z===void 0&&(Z=f(l()),tt[q]=Z),Z}function f(_){const E=[],k=[],q=[];for(let K=0;K<e;K++)E[K]=0,k[K]=0,q[K]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:E,enabledAttributes:k,attributeDivisors:q,object:_,attributes:{},index:null}}function d(_,E,k,q){const K=r.attributes,tt=E.attributes;let Z=0;const lt=k.getAttributes();for(const Q in lt)if(lt[Q].location>=0){const yt=K[Q];let pt=tt[Q];if(pt===void 0&&(Q==="instanceMatrix"&&_.instanceMatrix&&(pt=_.instanceMatrix),Q==="instanceColor"&&_.instanceColor&&(pt=_.instanceColor)),yt===void 0||yt.attribute!==pt||pt&&yt.data!==pt.data)return!0;Z++}return r.attributesNum!==Z||r.index!==q}function g(_,E,k,q){const K={},tt=E.attributes;let Z=0;const lt=k.getAttributes();for(const Q in lt)if(lt[Q].location>=0){let yt=tt[Q];yt===void 0&&(Q==="instanceMatrix"&&_.instanceMatrix&&(yt=_.instanceMatrix),Q==="instanceColor"&&_.instanceColor&&(yt=_.instanceColor));const pt={};pt.attribute=yt,yt&&yt.data&&(pt.data=yt.data),K[Q]=pt,Z++}r.attributes=K,r.attributesNum=Z,r.index=q}function S(){const _=r.newAttributes;for(let E=0,k=_.length;E<k;E++)_[E]=0}function p(_){m(_,0)}function m(_,E){const k=r.newAttributes,q=r.enabledAttributes,K=r.attributeDivisors;k[_]=1,q[_]===0&&(i.enableVertexAttribArray(_),q[_]=1),K[_]!==E&&(i.vertexAttribDivisor(_,E),K[_]=E)}function w(){const _=r.newAttributes,E=r.enabledAttributes;for(let k=0,q=E.length;k<q;k++)E[k]!==_[k]&&(i.disableVertexAttribArray(k),E[k]=0)}function y(_,E,k,q,K,tt,Z){Z===!0?i.vertexAttribIPointer(_,E,k,K,tt):i.vertexAttribPointer(_,E,k,q,K,tt)}function x(_,E,k,q){S();const K=q.attributes,tt=k.getAttributes(),Z=E.defaultAttributeValues;for(const lt in tt){const Q=tt[lt];if(Q.location>=0){let xt=K[lt];if(xt===void 0&&(lt==="instanceMatrix"&&_.instanceMatrix&&(xt=_.instanceMatrix),lt==="instanceColor"&&_.instanceColor&&(xt=_.instanceColor)),xt!==void 0){const yt=xt.normalized,pt=xt.itemSize,Bt=t.get(xt);if(Bt===void 0)continue;const qt=Bt.buffer,rt=Bt.type,dt=Bt.bytesPerElement,wt=rt===i.INT||rt===i.UNSIGNED_INT||xt.gpuType===Na;if(xt.isInterleavedBufferAttribute){const _t=xt.data,zt=_t.stride,Ot=xt.offset;if(_t.isInstancedInterleavedBuffer){for(let C=0;C<Q.locationSize;C++)m(Q.location+C,_t.meshPerAttribute);_.isInstancedMesh!==!0&&q._maxInstanceCount===void 0&&(q._maxInstanceCount=_t.meshPerAttribute*_t.count)}else for(let C=0;C<Q.locationSize;C++)p(Q.location+C);i.bindBuffer(i.ARRAY_BUFFER,qt);for(let C=0;C<Q.locationSize;C++)y(Q.location+C,pt/Q.locationSize,rt,yt,zt*dt,(Ot+pt/Q.locationSize*C)*dt,wt)}else{if(xt.isInstancedBufferAttribute){for(let _t=0;_t<Q.locationSize;_t++)m(Q.location+_t,xt.meshPerAttribute);_.isInstancedMesh!==!0&&q._maxInstanceCount===void 0&&(q._maxInstanceCount=xt.meshPerAttribute*xt.count)}else for(let _t=0;_t<Q.locationSize;_t++)p(Q.location+_t);i.bindBuffer(i.ARRAY_BUFFER,qt);for(let _t=0;_t<Q.locationSize;_t++)y(Q.location+_t,pt/Q.locationSize,rt,yt,pt*dt,pt/Q.locationSize*_t*dt,wt)}}else if(Z!==void 0){const yt=Z[lt];if(yt!==void 0)switch(yt.length){case 2:i.vertexAttrib2fv(Q.location,yt);break;case 3:i.vertexAttrib3fv(Q.location,yt);break;case 4:i.vertexAttrib4fv(Q.location,yt);break;default:i.vertexAttrib1fv(Q.location,yt)}}}}w()}function L(){I();for(const _ in n){const E=n[_];for(const k in E){const q=E[k];for(const K in q)h(q[K].object),delete q[K];delete E[k]}delete n[_]}}function D(_){if(n[_.id]===void 0)return;const E=n[_.id];for(const k in E){const q=E[k];for(const K in q)h(q[K].object),delete q[K];delete E[k]}delete n[_.id]}function A(_){for(const E in n){const k=n[E];if(k[_.id]===void 0)continue;const q=k[_.id];for(const K in q)h(q[K].object),delete q[K];delete k[_.id]}}function I(){z(),o=!0,r!==s&&(r=s,c(r.object))}function z(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:I,resetDefaultState:z,dispose:L,releaseStatesOfGeometry:D,releaseStatesOfProgram:A,initAttributes:S,enableAttribute:p,disableUnusedAttributes:w}}function Sm(i,t,e){let n;function s(c){n=c}function r(c,h){i.drawArrays(n,c,h),e.update(h,n,1)}function o(c,h,u){u!==0&&(i.drawArraysInstanced(n,c,h,u),e.update(h,n,u))}function a(c,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,u);let d=0;for(let g=0;g<u;g++)d+=h[g];e.update(d,n,1)}function l(c,h,u,f){if(u===0)return;const d=t.get("WEBGL_multi_draw");if(d===null)for(let g=0;g<c.length;g++)o(c[g],h[g],f[g]);else{d.multiDrawArraysInstancedWEBGL(n,c,0,h,0,f,0,u);let g=0;for(let S=0;S<u;S++)g+=h[S];for(let S=0;S<f.length;S++)e.update(g,n,f[S])}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function bm(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const A=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(A){return!(A!==Tn&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(A){const I=A===pn&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(A!==$n&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==wn&&!I)}function l(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=e.logarithmicDepthBuffer===!0,f=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control");if(f===!0){const A=t.get("EXT_clip_control");A.clipControlEXT(A.LOWER_LEFT_EXT,A.ZERO_TO_ONE_EXT)}const d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),S=i.getParameter(i.MAX_TEXTURE_SIZE),p=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),m=i.getParameter(i.MAX_VERTEX_ATTRIBS),w=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),y=i.getParameter(i.MAX_VARYING_VECTORS),x=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),L=g>0,D=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:u,reverseDepthBuffer:f,maxTextures:d,maxVertexTextures:g,maxTextureSize:S,maxCubemapSize:p,maxAttributes:m,maxVertexUniforms:w,maxVaryings:y,maxFragmentUniforms:x,vertexTextures:L,maxSamples:D}}function Em(i){const t=this;let e=null,n=0,s=!1,r=!1;const o=new ci,a=new Xt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const d=u.length!==0||f||n!==0||s;return s=f,n=u.length,d},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){e=h(u,f,0)},this.setState=function(u,f,d){const g=u.clippingPlanes,S=u.clipIntersection,p=u.clipShadows,m=i.get(u);if(!s||g===null||g.length===0||r&&!p)r?h(null):c();else{const w=r?0:n,y=w*4;let x=m.clippingState||null;l.value=x,x=h(g,f,y,d);for(let L=0;L!==y;++L)x[L]=e[L];m.clippingState=x,this.numIntersection=S?this.numPlanes:0,this.numPlanes+=w}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,f,d,g){const S=u!==null?u.length:0;let p=null;if(S!==0){if(p=l.value,g!==!0||p===null){const m=d+S*4,w=f.matrixWorldInverse;a.getNormalMatrix(w),(p===null||p.length<m)&&(p=new Float32Array(m));for(let y=0,x=d;y!==S;++y,x+=4)o.copy(u[y]).applyMatrix4(w,a),o.normal.toArray(p,x),p[x+3]=o.constant}l.value=p,l.needsUpdate=!0}return t.numPlanes=S,t.numIntersection=0,p}}function wm(i){let t=new WeakMap;function e(o,a){return a===jo?o.mapping=os:a===Zo&&(o.mapping=as),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===jo||a===Zo)if(t.has(o)){const l=t.get(o).texture;return e(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new wa(l.height);return c.fromEquirectangularTexture(i,o),t.set(o,c),o.addEventListener("dispose",s),e(c.texture,o.mapping)}else return null}}return o}function s(o){const a=o.target;a.removeEventListener("dispose",s);const l=t.get(a);l!==void 0&&(t.delete(a),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}class ja extends Ya{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,o=n+t,a=s+e,l=s-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Qi=4,kl=[.125,.215,.35,.446,.526,.582],wi=20,bo=new ja,Hl=new Wt;let Eo=null,wo=0,To=0,Ao=!1;const bi=(1+Math.sqrt(5))/2,qi=1/bi,Vl=[new P(-bi,qi,0),new P(bi,qi,0),new P(-qi,0,bi),new P(qi,0,bi),new P(0,bi,-qi),new P(0,bi,qi),new P(-1,1,-1),new P(1,1,-1),new P(-1,1,1),new P(1,1,1)];class Ta{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){Eo=this._renderer.getRenderTarget(),wo=this._renderer.getActiveCubeFace(),To=this._renderer.getActiveMipmapLevel(),Ao=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Xl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Wl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Eo,wo,To),this._renderer.xr.enabled=Ao,t.scissorTest=!1,cr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===os||t.mapping===as?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Eo=this._renderer.getRenderTarget(),wo=this._renderer.getActiveCubeFace(),To=this._renderer.getActiveMipmapLevel(),Ao=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Sn,minFilter:Sn,generateMipmaps:!1,type:pn,format:Tn,colorSpace:Qn,depthBuffer:!1},s=Gl(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Gl(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Tm(r)),this._blurMaterial=Am(r,t,e)}return s}_compileMaterial(t){const e=new be(this._lodPlanes[0],t);this._renderer.compile(e,bo)}_sceneToCubeUV(t,e,n,s){const a=new nn(90,1,e,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,f=h.toneMapping;h.getClearColor(Hl),h.toneMapping=Kn,h.autoClear=!1;const d=new Xa({name:"PMREM.Background",side:Be,depthWrite:!1,depthTest:!1}),g=new be(new fe,d);let S=!1;const p=t.background;p?p.isColor&&(d.color.copy(p),t.background=null,S=!0):(d.color.copy(Hl),S=!0);for(let m=0;m<6;m++){const w=m%3;w===0?(a.up.set(0,l[m],0),a.lookAt(c[m],0,0)):w===1?(a.up.set(0,0,l[m]),a.lookAt(0,c[m],0)):(a.up.set(0,l[m],0),a.lookAt(0,0,c[m]));const y=this._cubeSize;cr(s,w*y,m>2?y:0,y,y),h.setRenderTarget(s),S&&h.render(g,a),h.render(t,a)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=f,h.autoClear=u,t.background=p}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===os||t.mapping===as;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Xl()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Wl());const r=s?this._cubemapMaterial:this._equirectMaterial,o=new be(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;const l=this._cubeSize;cr(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,bo)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Vl[(s-r-1)%Vl.length];this._blur(t,r-1,r,o,a)}e.autoClear=n}_blur(t,e,n,s,r){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,s,"latitudinal",r),this._halfBlur(o,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new be(this._lodPlanes[s],c),f=c.uniforms,d=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*d):2*Math.PI/(2*wi-1),S=r/g,p=isFinite(r)?1+Math.floor(h*S):wi;p>wi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${wi}`);const m=[];let w=0;for(let A=0;A<wi;++A){const I=A/S,z=Math.exp(-I*I/2);m.push(z),A===0?w+=z:A<p&&(w+=2*z)}for(let A=0;A<m.length;A++)m[A]=m[A]/w;f.envMap.value=t.texture,f.samples.value=p,f.weights.value=m,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);const{_lodMax:y}=this;f.dTheta.value=g,f.mipInt.value=y-n;const x=this._sizeLods[s],L=3*x*(s>y-Qi?s-y+Qi:0),D=4*(this._cubeSize-x);cr(e,L,D,3*x,2*x),l.setRenderTarget(e),l.render(u,bo)}}function Tm(i){const t=[],e=[],n=[];let s=i;const r=i-Qi+1+kl.length;for(let o=0;o<r;o++){const a=Math.pow(2,s);e.push(a);let l=1/a;o>i-Qi?l=kl[o-i+Qi-1]:o===0&&(l=0),n.push(l);const c=1/(a-2),h=-c,u=1+c,f=[h,h,u,h,u,u,h,h,u,u,h,u],d=6,g=6,S=3,p=2,m=1,w=new Float32Array(S*g*d),y=new Float32Array(p*g*d),x=new Float32Array(m*g*d);for(let D=0;D<d;D++){const A=D%3*2/3-1,I=D>2?0:-1,z=[A,I,0,A+2/3,I,0,A+2/3,I+1,0,A,I,0,A+2/3,I+1,0,A,I+1,0];w.set(z,S*g*D),y.set(f,p*g*D);const _=[D,D,D,D,D,D];x.set(_,m*g*D)}const L=new ce;L.setAttribute("position",new xe(w,S)),L.setAttribute("uv",new xe(y,p)),L.setAttribute("faceIndex",new xe(x,m)),t.push(L),s>Qi&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Gl(i,t,e){const n=new on(i,t,e);return n.texture.mapping=Vr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function cr(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function Am(i,t,e){const n=new Float32Array(wi),s=new P(0,1,0);return new Ee({name:"SphericalGaussianBlur",defines:{n:wi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Za(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Zn,depthTest:!1,depthWrite:!1})}function Wl(){return new Ee({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Za(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Zn,depthTest:!1,depthWrite:!1})}function Xl(){return new Ee({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Za(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Zn,depthTest:!1,depthWrite:!1})}function Za(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Cm(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const l=a.mapping,c=l===jo||l===Zo,h=l===os||l===as;if(c||h){let u=t.get(a);const f=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==f)return e===null&&(e=new Ta(i)),u=c?e.fromEquirectangular(a,u):e.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),u.texture;if(u!==void 0)return u.texture;{const d=a.image;return c&&d&&d.height>0||h&&d&&s(d)?(e===null&&(e=new Ta(i)),u=c?e.fromEquirectangular(a):e.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function s(a){let l=0;const c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){const l=a.target;l.removeEventListener("dispose",r);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function Rm(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&Tr("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Pm(i,t,e,n){const s={},r=new WeakMap;function o(u){const f=u.target;f.index!==null&&t.remove(f.index);for(const g in f.attributes)t.remove(f.attributes[g]);for(const g in f.morphAttributes){const S=f.morphAttributes[g];for(let p=0,m=S.length;p<m;p++)t.remove(S[p])}f.removeEventListener("dispose",o),delete s[f.id];const d=r.get(f);d&&(t.remove(d),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function a(u,f){return s[f.id]===!0||(f.addEventListener("dispose",o),s[f.id]=!0,e.memory.geometries++),f}function l(u){const f=u.attributes;for(const g in f)t.update(f[g],i.ARRAY_BUFFER);const d=u.morphAttributes;for(const g in d){const S=d[g];for(let p=0,m=S.length;p<m;p++)t.update(S[p],i.ARRAY_BUFFER)}}function c(u){const f=[],d=u.index,g=u.attributes.position;let S=0;if(d!==null){const w=d.array;S=d.version;for(let y=0,x=w.length;y<x;y+=3){const L=w[y+0],D=w[y+1],A=w[y+2];f.push(L,D,D,A,A,L)}}else if(g!==void 0){const w=g.array;S=g.version;for(let y=0,x=w.length/3-1;y<x;y+=3){const L=y+0,D=y+1,A=y+2;f.push(L,D,D,A,A,L)}}else return;const p=new(uh(f)?vh:gh)(f,1);p.version=S;const m=r.get(u);m&&t.remove(m),r.set(u,p)}function h(u){const f=r.get(u);if(f){const d=u.index;d!==null&&f.version<d.version&&c(u)}else c(u);return r.get(u)}return{get:a,update:l,getWireframeAttribute:h}}function Dm(i,t,e){let n;function s(f){n=f}let r,o;function a(f){r=f.type,o=f.bytesPerElement}function l(f,d){i.drawElements(n,d,r,f*o),e.update(d,n,1)}function c(f,d,g){g!==0&&(i.drawElementsInstanced(n,d,r,f*o,g),e.update(d,n,g))}function h(f,d,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,r,f,0,g);let p=0;for(let m=0;m<g;m++)p+=d[m];e.update(p,n,1)}function u(f,d,g,S){if(g===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let m=0;m<f.length;m++)c(f[m]/o,d[m],S[m]);else{p.multiDrawElementsInstancedWEBGL(n,d,0,r,f,0,S,0,g);let m=0;for(let w=0;w<g;w++)m+=d[w];for(let w=0;w<S.length;w++)e.update(m,n,S[w])}}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function Lm(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function Im(i,t,e){const n=new WeakMap,s=new oe;function r(o,a,l){const c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0;let f=n.get(a);if(f===void 0||f.count!==u){let _=function(){I.dispose(),n.delete(a),a.removeEventListener("dispose",_)};var d=_;f!==void 0&&f.texture.dispose();const g=a.morphAttributes.position!==void 0,S=a.morphAttributes.normal!==void 0,p=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],w=a.morphAttributes.normal||[],y=a.morphAttributes.color||[];let x=0;g===!0&&(x=1),S===!0&&(x=2),p===!0&&(x=3);let L=a.attributes.position.count*x,D=1;L>t.maxTextureSize&&(D=Math.ceil(L/t.maxTextureSize),L=t.maxTextureSize);const A=new Float32Array(L*D*4*u),I=new dh(A,L,D,u);I.type=wn,I.needsUpdate=!0;const z=x*4;for(let E=0;E<u;E++){const k=m[E],q=w[E],K=y[E],tt=L*D*4*E;for(let Z=0;Z<k.count;Z++){const lt=Z*z;g===!0&&(s.fromBufferAttribute(k,Z),A[tt+lt+0]=s.x,A[tt+lt+1]=s.y,A[tt+lt+2]=s.z,A[tt+lt+3]=0),S===!0&&(s.fromBufferAttribute(q,Z),A[tt+lt+4]=s.x,A[tt+lt+5]=s.y,A[tt+lt+6]=s.z,A[tt+lt+7]=0),p===!0&&(s.fromBufferAttribute(K,Z),A[tt+lt+8]=s.x,A[tt+lt+9]=s.y,A[tt+lt+10]=s.z,A[tt+lt+11]=K.itemSize===4?s.w:1)}}f={count:u,texture:I,size:new ut(L,D)},n.set(a,f),a.addEventListener("dispose",_)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,e);else{let g=0;for(let p=0;p<c.length;p++)g+=c[p];const S=a.morphTargetsRelative?1:1-g;l.getUniforms().setValue(i,"morphTargetBaseInfluence",S),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",f.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",f.size)}return{update:r}}function Um(i,t,e,n){let s=new WeakMap;function r(l){const c=n.render.frame,h=l.geometry,u=t.get(l,h);if(s.get(u)!==c&&(t.update(u),s.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const f=l.skeleton;s.get(f)!==c&&(f.update(),s.set(f,c))}return u}function o(){s=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:o}}class yh extends ke{constructor(t,e,n,s,r,o,a,l,c,h=is){if(h!==is&&h!==cs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===is&&(n=Ai),n===void 0&&h===cs&&(n=ls),super(null,s,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:Ze,this.minFilter=l!==void 0?l:Ze,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Sh=new ke,Yl=new yh(1,1),bh=new dh,Eh=new Mf,wh=new xh,ql=[],jl=[],Zl=new Float32Array(16),Kl=new Float32Array(9),$l=new Float32Array(4);function ps(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=ql[s];if(r===void 0&&(r=new Float32Array(s),ql[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function Pe(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function De(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Wr(i,t){let e=jl[t];e===void 0&&(e=new Int32Array(t),jl[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Nm(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function Fm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Pe(e,t))return;i.uniform2fv(this.addr,t),De(e,t)}}function Om(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Pe(e,t))return;i.uniform3fv(this.addr,t),De(e,t)}}function zm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Pe(e,t))return;i.uniform4fv(this.addr,t),De(e,t)}}function Bm(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Pe(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),De(e,t)}else{if(Pe(e,n))return;$l.set(n),i.uniformMatrix2fv(this.addr,!1,$l),De(e,n)}}function km(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Pe(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),De(e,t)}else{if(Pe(e,n))return;Kl.set(n),i.uniformMatrix3fv(this.addr,!1,Kl),De(e,n)}}function Hm(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Pe(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),De(e,t)}else{if(Pe(e,n))return;Zl.set(n),i.uniformMatrix4fv(this.addr,!1,Zl),De(e,n)}}function Vm(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function Gm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Pe(e,t))return;i.uniform2iv(this.addr,t),De(e,t)}}function Wm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Pe(e,t))return;i.uniform3iv(this.addr,t),De(e,t)}}function Xm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Pe(e,t))return;i.uniform4iv(this.addr,t),De(e,t)}}function Ym(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function qm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Pe(e,t))return;i.uniform2uiv(this.addr,t),De(e,t)}}function jm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Pe(e,t))return;i.uniform3uiv(this.addr,t),De(e,t)}}function Zm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Pe(e,t))return;i.uniform4uiv(this.addr,t),De(e,t)}}function Km(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Yl.compareFunction=hh,r=Yl):r=Sh,e.setTexture2D(t||r,s)}function $m(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Eh,s)}function Jm(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||wh,s)}function Qm(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||bh,s)}function t0(i){switch(i){case 5126:return Nm;case 35664:return Fm;case 35665:return Om;case 35666:return zm;case 35674:return Bm;case 35675:return km;case 35676:return Hm;case 5124:case 35670:return Vm;case 35667:case 35671:return Gm;case 35668:case 35672:return Wm;case 35669:case 35673:return Xm;case 5125:return Ym;case 36294:return qm;case 36295:return jm;case 36296:return Zm;case 35678:case 36198:case 36298:case 36306:case 35682:return Km;case 35679:case 36299:case 36307:return $m;case 35680:case 36300:case 36308:case 36293:return Jm;case 36289:case 36303:case 36311:case 36292:return Qm}}function e0(i,t){i.uniform1fv(this.addr,t)}function n0(i,t){const e=ps(t,this.size,2);i.uniform2fv(this.addr,e)}function i0(i,t){const e=ps(t,this.size,3);i.uniform3fv(this.addr,e)}function s0(i,t){const e=ps(t,this.size,4);i.uniform4fv(this.addr,e)}function r0(i,t){const e=ps(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function o0(i,t){const e=ps(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function a0(i,t){const e=ps(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function l0(i,t){i.uniform1iv(this.addr,t)}function c0(i,t){i.uniform2iv(this.addr,t)}function h0(i,t){i.uniform3iv(this.addr,t)}function u0(i,t){i.uniform4iv(this.addr,t)}function f0(i,t){i.uniform1uiv(this.addr,t)}function d0(i,t){i.uniform2uiv(this.addr,t)}function p0(i,t){i.uniform3uiv(this.addr,t)}function m0(i,t){i.uniform4uiv(this.addr,t)}function g0(i,t,e){const n=this.cache,s=t.length,r=Wr(e,s);Pe(n,r)||(i.uniform1iv(this.addr,r),De(n,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||Sh,r[o])}function v0(i,t,e){const n=this.cache,s=t.length,r=Wr(e,s);Pe(n,r)||(i.uniform1iv(this.addr,r),De(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||Eh,r[o])}function _0(i,t,e){const n=this.cache,s=t.length,r=Wr(e,s);Pe(n,r)||(i.uniform1iv(this.addr,r),De(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||wh,r[o])}function x0(i,t,e){const n=this.cache,s=t.length,r=Wr(e,s);Pe(n,r)||(i.uniform1iv(this.addr,r),De(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||bh,r[o])}function M0(i){switch(i){case 5126:return e0;case 35664:return n0;case 35665:return i0;case 35666:return s0;case 35674:return r0;case 35675:return o0;case 35676:return a0;case 5124:case 35670:return l0;case 35667:case 35671:return c0;case 35668:case 35672:return h0;case 35669:case 35673:return u0;case 5125:return f0;case 36294:return d0;case 36295:return p0;case 36296:return m0;case 35678:case 36198:case 36298:case 36306:case 35682:return g0;case 35679:case 36299:case 36307:return v0;case 35680:case 36300:case 36308:case 36293:return _0;case 36289:case 36303:case 36311:case 36292:return x0}}class y0{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=t0(e.type)}}class S0{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=M0(e.type)}}class b0{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(t,e[a.id],n)}}}const Co=/(\w+)(\])?(\[|\.)?/g;function Jl(i,t){i.seq.push(t),i.map[t.id]=t}function E0(i,t,e){const n=i.name,s=n.length;for(Co.lastIndex=0;;){const r=Co.exec(n),o=Co.lastIndex;let a=r[1];const l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){Jl(e,c===void 0?new y0(a,i,t):new S0(a,i,t));break}else{let u=e.map[a];u===void 0&&(u=new b0(a),Jl(e,u)),e=u}}}class Ar{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);E0(r,o,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){const a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const o=t[s];o.id in e&&n.push(o)}return n}}function Ql(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const w0=37297;let T0=0;function A0(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}function C0(i){const t=ne.getPrimaries(ne.workingColorSpace),e=ne.getPrimaries(i);let n;switch(t===e?n="":t===Pr&&e===Rr?n="LinearDisplayP3ToLinearSRGB":t===Rr&&e===Pr&&(n="LinearSRGBToLinearDisplayP3"),i){case Qn:case Gr:return[n,"LinearTransferOETF"];case yn:case Va:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function tc(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const o=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+A0(i.getShaderSource(t),o)}else return s}function R0(i,t){const e=C0(t);return`vec4 ${i}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function P0(i,t){let e;switch(t){case Pu:e="Linear";break;case Du:e="Reinhard";break;case Lu:e="Cineon";break;case Iu:e="ACESFilmic";break;case Nu:e="AgX";break;case Fu:e="Neutral";break;case Uu:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const hr=new P;function D0(){ne.getLuminanceCoefficients(hr);const i=hr.x.toFixed(4),t=hr.y.toFixed(4),e=hr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function L0(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ws).join(`
`)}function I0(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function U0(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),o=r.name;let a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function ws(i){return i!==""}function ec(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function nc(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const N0=/^[ \t]*#include +<([\w\d./]+)>/gm;function Aa(i){return i.replace(N0,O0)}const F0=new Map;function O0(i,t){let e=Gt[t];if(e===void 0){const n=F0.get(t);if(n!==void 0)e=Gt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Aa(e)}const z0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ic(i){return i.replace(z0,B0)}function B0(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function sc(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function k0(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Kc?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===$c?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Gn&&(t="SHADOWMAP_TYPE_VSM"),t}function H0(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case os:case as:t="ENVMAP_TYPE_CUBE";break;case Vr:t="ENVMAP_TYPE_CUBE_UV";break}return t}function V0(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case as:t="ENVMAP_MODE_REFRACTION";break}return t}function G0(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Jc:t="ENVMAP_BLENDING_MULTIPLY";break;case Cu:t="ENVMAP_BLENDING_MIX";break;case Ru:t="ENVMAP_BLENDING_ADD";break}return t}function W0(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function X0(i,t,e,n){const s=i.getContext(),r=e.defines;let o=e.vertexShader,a=e.fragmentShader;const l=k0(e),c=H0(e),h=V0(e),u=G0(e),f=W0(e),d=L0(e),g=I0(r),S=s.createProgram();let p,m,w=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(ws).join(`
`),p.length>0&&(p+=`
`),m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(ws).join(`
`),m.length>0&&(m+=`
`)):(p=[sc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ws).join(`
`),m=[sc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Kn?"#define TONE_MAPPING":"",e.toneMapping!==Kn?Gt.tonemapping_pars_fragment:"",e.toneMapping!==Kn?P0("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Gt.colorspace_pars_fragment,R0("linearToOutputTexel",e.outputColorSpace),D0(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(ws).join(`
`)),o=Aa(o),o=ec(o,e),o=nc(o,e),a=Aa(a),a=ec(a,e),a=nc(a,e),o=ic(o),a=ic(a),e.isRawShaderMaterial!==!0&&(w=`#version 300 es
`,p=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,m=["#define varying in",e.glslVersion===yl?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===yl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const y=w+p+o,x=w+m+a,L=Ql(s,s.VERTEX_SHADER,y),D=Ql(s,s.FRAGMENT_SHADER,x);s.attachShader(S,L),s.attachShader(S,D),e.index0AttributeName!==void 0?s.bindAttribLocation(S,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(S,0,"position"),s.linkProgram(S);function A(E){if(i.debug.checkShaderErrors){const k=s.getProgramInfoLog(S).trim(),q=s.getShaderInfoLog(L).trim(),K=s.getShaderInfoLog(D).trim();let tt=!0,Z=!0;if(s.getProgramParameter(S,s.LINK_STATUS)===!1)if(tt=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,S,L,D);else{const lt=tc(s,L,"vertex"),Q=tc(s,D,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(S,s.VALIDATE_STATUS)+`

Material Name: `+E.name+`
Material Type: `+E.type+`

Program Info Log: `+k+`
`+lt+`
`+Q)}else k!==""?console.warn("THREE.WebGLProgram: Program Info Log:",k):(q===""||K==="")&&(Z=!1);Z&&(E.diagnostics={runnable:tt,programLog:k,vertexShader:{log:q,prefix:p},fragmentShader:{log:K,prefix:m}})}s.deleteShader(L),s.deleteShader(D),I=new Ar(s,S),z=U0(s,S)}let I;this.getUniforms=function(){return I===void 0&&A(this),I};let z;this.getAttributes=function(){return z===void 0&&A(this),z};let _=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return _===!1&&(_=s.getProgramParameter(S,w0)),_},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(S),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=T0++,this.cacheKey=t,this.usedTimes=1,this.program=S,this.vertexShader=L,this.fragmentShader=D,this}let Y0=0;class q0{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new j0(t),e.set(t,n)),n}}class j0{constructor(t){this.id=Y0++,this.code=t,this.usedTimes=0}}function Z0(i,t,e,n,s,r,o){const a=new ph,l=new q0,c=new Set,h=[],u=s.logarithmicDepthBuffer,f=s.reverseDepthBuffer,d=s.vertexTextures;let g=s.precision;const S={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(_){return c.add(_),_===0?"uv":`uv${_}`}function m(_,E,k,q,K){const tt=q.fog,Z=K.geometry,lt=_.isMeshStandardMaterial?q.environment:null,Q=(_.isMeshStandardMaterial?e:t).get(_.envMap||lt),xt=Q&&Q.mapping===Vr?Q.image.height:null,yt=S[_.type];_.precision!==null&&(g=s.getMaxPrecision(_.precision),g!==_.precision&&console.warn("THREE.WebGLProgram.getParameters:",_.precision,"not supported, using",g,"instead."));const pt=Z.morphAttributes.position||Z.morphAttributes.normal||Z.morphAttributes.color,Bt=pt!==void 0?pt.length:0;let qt=0;Z.morphAttributes.position!==void 0&&(qt=1),Z.morphAttributes.normal!==void 0&&(qt=2),Z.morphAttributes.color!==void 0&&(qt=3);let rt,dt,wt,_t;if(yt){const Xe=Un[yt];rt=Xe.vertexShader,dt=Xe.fragmentShader}else rt=_.vertexShader,dt=_.fragmentShader,l.update(_),wt=l.getVertexShaderID(_),_t=l.getFragmentShaderID(_);const zt=i.getRenderTarget(),Ot=K.isInstancedMesh===!0,C=K.isBatchedMesh===!0,F=!!_.map,R=!!_.matcap,M=!!Q,H=!!_.aoMap,N=!!_.lightMap,O=!!_.bumpMap,Y=!!_.normalMap,it=!!_.displacementMap,et=!!_.emissiveMap,b=!!_.metalnessMap,v=!!_.roughnessMap,U=_.anisotropy>0,B=_.clearcoat>0,j=_.dispersion>0,W=_.iridescence>0,ht=_.sheen>0,ct=_.transmission>0,ot=U&&!!_.anisotropyMap,Ct=B&&!!_.clearcoatMap,st=B&&!!_.clearcoatNormalMap,gt=B&&!!_.clearcoatRoughnessMap,Rt=W&&!!_.iridescenceMap,Dt=W&&!!_.iridescenceThicknessMap,vt=ht&&!!_.sheenColorMap,kt=ht&&!!_.sheenRoughnessMap,Ft=!!_.specularMap,Kt=!!_.specularColorMap,V=!!_.specularIntensityMap,Et=ct&&!!_.transmissionMap,nt=ct&&!!_.thicknessMap,ft=!!_.gradientMap,bt=!!_.alphaMap,Tt=_.alphaTest>0,jt=!!_.alphaHash,Me=!!_.extensions;let We=Kn;_.toneMapped&&(zt===null||zt.isXRRenderTarget===!0)&&(We=i.toneMapping);const Jt={shaderID:yt,shaderType:_.type,shaderName:_.name,vertexShader:rt,fragmentShader:dt,defines:_.defines,customVertexShaderID:wt,customFragmentShaderID:_t,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:g,batching:C,batchingColor:C&&K._colorsTexture!==null,instancing:Ot,instancingColor:Ot&&K.instanceColor!==null,instancingMorph:Ot&&K.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:zt===null?i.outputColorSpace:zt.isXRRenderTarget===!0?zt.texture.colorSpace:Qn,alphaToCoverage:!!_.alphaToCoverage,map:F,matcap:R,envMap:M,envMapMode:M&&Q.mapping,envMapCubeUVHeight:xt,aoMap:H,lightMap:N,bumpMap:O,normalMap:Y,displacementMap:d&&it,emissiveMap:et,normalMapObjectSpace:Y&&_.normalMapType===ku,normalMapTangentSpace:Y&&_.normalMapType===ch,metalnessMap:b,roughnessMap:v,anisotropy:U,anisotropyMap:ot,clearcoat:B,clearcoatMap:Ct,clearcoatNormalMap:st,clearcoatRoughnessMap:gt,dispersion:j,iridescence:W,iridescenceMap:Rt,iridescenceThicknessMap:Dt,sheen:ht,sheenColorMap:vt,sheenRoughnessMap:kt,specularMap:Ft,specularColorMap:Kt,specularIntensityMap:V,transmission:ct,transmissionMap:Et,thicknessMap:nt,gradientMap:ft,opaque:_.transparent===!1&&_.blending===ns&&_.alphaToCoverage===!1,alphaMap:bt,alphaTest:Tt,alphaHash:jt,combine:_.combine,mapUv:F&&p(_.map.channel),aoMapUv:H&&p(_.aoMap.channel),lightMapUv:N&&p(_.lightMap.channel),bumpMapUv:O&&p(_.bumpMap.channel),normalMapUv:Y&&p(_.normalMap.channel),displacementMapUv:it&&p(_.displacementMap.channel),emissiveMapUv:et&&p(_.emissiveMap.channel),metalnessMapUv:b&&p(_.metalnessMap.channel),roughnessMapUv:v&&p(_.roughnessMap.channel),anisotropyMapUv:ot&&p(_.anisotropyMap.channel),clearcoatMapUv:Ct&&p(_.clearcoatMap.channel),clearcoatNormalMapUv:st&&p(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:gt&&p(_.clearcoatRoughnessMap.channel),iridescenceMapUv:Rt&&p(_.iridescenceMap.channel),iridescenceThicknessMapUv:Dt&&p(_.iridescenceThicknessMap.channel),sheenColorMapUv:vt&&p(_.sheenColorMap.channel),sheenRoughnessMapUv:kt&&p(_.sheenRoughnessMap.channel),specularMapUv:Ft&&p(_.specularMap.channel),specularColorMapUv:Kt&&p(_.specularColorMap.channel),specularIntensityMapUv:V&&p(_.specularIntensityMap.channel),transmissionMapUv:Et&&p(_.transmissionMap.channel),thicknessMapUv:nt&&p(_.thicknessMap.channel),alphaMapUv:bt&&p(_.alphaMap.channel),vertexTangents:!!Z.attributes.tangent&&(Y||U),vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!Z.attributes.color&&Z.attributes.color.itemSize===4,pointsUvs:K.isPoints===!0&&!!Z.attributes.uv&&(F||bt),fog:!!tt,useFog:_.fog===!0,fogExp2:!!tt&&tt.isFogExp2,flatShading:_.flatShading===!0,sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:f,skinning:K.isSkinnedMesh===!0,morphTargets:Z.morphAttributes.position!==void 0,morphNormals:Z.morphAttributes.normal!==void 0,morphColors:Z.morphAttributes.color!==void 0,morphTargetsCount:Bt,morphTextureStride:qt,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:_.dithering,shadowMapEnabled:i.shadowMap.enabled&&k.length>0,shadowMapType:i.shadowMap.type,toneMapping:We,decodeVideoTexture:F&&_.map.isVideoTexture===!0&&ne.getTransfer(_.map.colorSpace)===ue,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===sn,flipSided:_.side===Be,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:Me&&_.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Me&&_.extensions.multiDraw===!0||C)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return Jt.vertexUv1s=c.has(1),Jt.vertexUv2s=c.has(2),Jt.vertexUv3s=c.has(3),c.clear(),Jt}function w(_){const E=[];if(_.shaderID?E.push(_.shaderID):(E.push(_.customVertexShaderID),E.push(_.customFragmentShaderID)),_.defines!==void 0)for(const k in _.defines)E.push(k),E.push(_.defines[k]);return _.isRawShaderMaterial===!1&&(y(E,_),x(E,_),E.push(i.outputColorSpace)),E.push(_.customProgramCacheKey),E.join()}function y(_,E){_.push(E.precision),_.push(E.outputColorSpace),_.push(E.envMapMode),_.push(E.envMapCubeUVHeight),_.push(E.mapUv),_.push(E.alphaMapUv),_.push(E.lightMapUv),_.push(E.aoMapUv),_.push(E.bumpMapUv),_.push(E.normalMapUv),_.push(E.displacementMapUv),_.push(E.emissiveMapUv),_.push(E.metalnessMapUv),_.push(E.roughnessMapUv),_.push(E.anisotropyMapUv),_.push(E.clearcoatMapUv),_.push(E.clearcoatNormalMapUv),_.push(E.clearcoatRoughnessMapUv),_.push(E.iridescenceMapUv),_.push(E.iridescenceThicknessMapUv),_.push(E.sheenColorMapUv),_.push(E.sheenRoughnessMapUv),_.push(E.specularMapUv),_.push(E.specularColorMapUv),_.push(E.specularIntensityMapUv),_.push(E.transmissionMapUv),_.push(E.thicknessMapUv),_.push(E.combine),_.push(E.fogExp2),_.push(E.sizeAttenuation),_.push(E.morphTargetsCount),_.push(E.morphAttributeCount),_.push(E.numDirLights),_.push(E.numPointLights),_.push(E.numSpotLights),_.push(E.numSpotLightMaps),_.push(E.numHemiLights),_.push(E.numRectAreaLights),_.push(E.numDirLightShadows),_.push(E.numPointLightShadows),_.push(E.numSpotLightShadows),_.push(E.numSpotLightShadowsWithMaps),_.push(E.numLightProbes),_.push(E.shadowMapType),_.push(E.toneMapping),_.push(E.numClippingPlanes),_.push(E.numClipIntersection),_.push(E.depthPacking)}function x(_,E){a.disableAll(),E.supportsVertexTextures&&a.enable(0),E.instancing&&a.enable(1),E.instancingColor&&a.enable(2),E.instancingMorph&&a.enable(3),E.matcap&&a.enable(4),E.envMap&&a.enable(5),E.normalMapObjectSpace&&a.enable(6),E.normalMapTangentSpace&&a.enable(7),E.clearcoat&&a.enable(8),E.iridescence&&a.enable(9),E.alphaTest&&a.enable(10),E.vertexColors&&a.enable(11),E.vertexAlphas&&a.enable(12),E.vertexUv1s&&a.enable(13),E.vertexUv2s&&a.enable(14),E.vertexUv3s&&a.enable(15),E.vertexTangents&&a.enable(16),E.anisotropy&&a.enable(17),E.alphaHash&&a.enable(18),E.batching&&a.enable(19),E.dispersion&&a.enable(20),E.batchingColor&&a.enable(21),_.push(a.mask),a.disableAll(),E.fog&&a.enable(0),E.useFog&&a.enable(1),E.flatShading&&a.enable(2),E.logarithmicDepthBuffer&&a.enable(3),E.reverseDepthBuffer&&a.enable(4),E.skinning&&a.enable(5),E.morphTargets&&a.enable(6),E.morphNormals&&a.enable(7),E.morphColors&&a.enable(8),E.premultipliedAlpha&&a.enable(9),E.shadowMapEnabled&&a.enable(10),E.doubleSided&&a.enable(11),E.flipSided&&a.enable(12),E.useDepthPacking&&a.enable(13),E.dithering&&a.enable(14),E.transmission&&a.enable(15),E.sheen&&a.enable(16),E.opaque&&a.enable(17),E.pointsUvs&&a.enable(18),E.decodeVideoTexture&&a.enable(19),E.alphaToCoverage&&a.enable(20),_.push(a.mask)}function L(_){const E=S[_.type];let k;if(E){const q=Un[E];k=Ir.clone(q.uniforms)}else k=_.uniforms;return k}function D(_,E){let k;for(let q=0,K=h.length;q<K;q++){const tt=h[q];if(tt.cacheKey===E){k=tt,++k.usedTimes;break}}return k===void 0&&(k=new X0(i,E,_,r),h.push(k)),k}function A(_){if(--_.usedTimes===0){const E=h.indexOf(_);h[E]=h[h.length-1],h.pop(),_.destroy()}}function I(_){l.remove(_)}function z(){l.dispose()}return{getParameters:m,getProgramCacheKey:w,getUniforms:L,acquireProgram:D,releaseProgram:A,releaseShaderCache:I,programs:h,dispose:z}}function K0(){let i=new WeakMap;function t(o){return i.has(o)}function e(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function $0(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function rc(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function oc(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(u,f,d,g,S,p){let m=i[t];return m===void 0?(m={id:u.id,object:u,geometry:f,material:d,groupOrder:g,renderOrder:u.renderOrder,z:S,group:p},i[t]=m):(m.id=u.id,m.object=u,m.geometry=f,m.material=d,m.groupOrder=g,m.renderOrder=u.renderOrder,m.z=S,m.group=p),t++,m}function a(u,f,d,g,S,p){const m=o(u,f,d,g,S,p);d.transmission>0?n.push(m):d.transparent===!0?s.push(m):e.push(m)}function l(u,f,d,g,S,p){const m=o(u,f,d,g,S,p);d.transmission>0?n.unshift(m):d.transparent===!0?s.unshift(m):e.unshift(m)}function c(u,f){e.length>1&&e.sort(u||$0),n.length>1&&n.sort(f||rc),s.length>1&&s.sort(f||rc)}function h(){for(let u=t,f=i.length;u<f;u++){const d=i[u];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:a,unshift:l,finish:h,sort:c}}function J0(){let i=new WeakMap;function t(n,s){const r=i.get(n);let o;return r===void 0?(o=new oc,i.set(n,[o])):s>=r.length?(o=new oc,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function Q0(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new P,color:new Wt};break;case"SpotLight":e={position:new P,direction:new P,color:new Wt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new P,color:new Wt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new P,skyColor:new Wt,groundColor:new Wt};break;case"RectAreaLight":e={color:new Wt,position:new P,halfWidth:new P,halfHeight:new P};break}return i[t.id]=e,e}}}function tg(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ut};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ut};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ut,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let eg=0;function ng(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function ig(i){const t=new Q0,e=tg(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new P);const s=new P,r=new se,o=new se;function a(c){let h=0,u=0,f=0;for(let z=0;z<9;z++)n.probe[z].set(0,0,0);let d=0,g=0,S=0,p=0,m=0,w=0,y=0,x=0,L=0,D=0,A=0;c.sort(ng);for(let z=0,_=c.length;z<_;z++){const E=c[z],k=E.color,q=E.intensity,K=E.distance,tt=E.shadow&&E.shadow.map?E.shadow.map.texture:null;if(E.isAmbientLight)h+=k.r*q,u+=k.g*q,f+=k.b*q;else if(E.isLightProbe){for(let Z=0;Z<9;Z++)n.probe[Z].addScaledVector(E.sh.coefficients[Z],q);A++}else if(E.isDirectionalLight){const Z=t.get(E);if(Z.color.copy(E.color).multiplyScalar(E.intensity),E.castShadow){const lt=E.shadow,Q=e.get(E);Q.shadowIntensity=lt.intensity,Q.shadowBias=lt.bias,Q.shadowNormalBias=lt.normalBias,Q.shadowRadius=lt.radius,Q.shadowMapSize=lt.mapSize,n.directionalShadow[d]=Q,n.directionalShadowMap[d]=tt,n.directionalShadowMatrix[d]=E.shadow.matrix,w++}n.directional[d]=Z,d++}else if(E.isSpotLight){const Z=t.get(E);Z.position.setFromMatrixPosition(E.matrixWorld),Z.color.copy(k).multiplyScalar(q),Z.distance=K,Z.coneCos=Math.cos(E.angle),Z.penumbraCos=Math.cos(E.angle*(1-E.penumbra)),Z.decay=E.decay,n.spot[S]=Z;const lt=E.shadow;if(E.map&&(n.spotLightMap[L]=E.map,L++,lt.updateMatrices(E),E.castShadow&&D++),n.spotLightMatrix[S]=lt.matrix,E.castShadow){const Q=e.get(E);Q.shadowIntensity=lt.intensity,Q.shadowBias=lt.bias,Q.shadowNormalBias=lt.normalBias,Q.shadowRadius=lt.radius,Q.shadowMapSize=lt.mapSize,n.spotShadow[S]=Q,n.spotShadowMap[S]=tt,x++}S++}else if(E.isRectAreaLight){const Z=t.get(E);Z.color.copy(k).multiplyScalar(q),Z.halfWidth.set(E.width*.5,0,0),Z.halfHeight.set(0,E.height*.5,0),n.rectArea[p]=Z,p++}else if(E.isPointLight){const Z=t.get(E);if(Z.color.copy(E.color).multiplyScalar(E.intensity),Z.distance=E.distance,Z.decay=E.decay,E.castShadow){const lt=E.shadow,Q=e.get(E);Q.shadowIntensity=lt.intensity,Q.shadowBias=lt.bias,Q.shadowNormalBias=lt.normalBias,Q.shadowRadius=lt.radius,Q.shadowMapSize=lt.mapSize,Q.shadowCameraNear=lt.camera.near,Q.shadowCameraFar=lt.camera.far,n.pointShadow[g]=Q,n.pointShadowMap[g]=tt,n.pointShadowMatrix[g]=E.shadow.matrix,y++}n.point[g]=Z,g++}else if(E.isHemisphereLight){const Z=t.get(E);Z.skyColor.copy(E.color).multiplyScalar(q),Z.groundColor.copy(E.groundColor).multiplyScalar(q),n.hemi[m]=Z,m++}}p>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Mt.LTC_FLOAT_1,n.rectAreaLTC2=Mt.LTC_FLOAT_2):(n.rectAreaLTC1=Mt.LTC_HALF_1,n.rectAreaLTC2=Mt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=f;const I=n.hash;(I.directionalLength!==d||I.pointLength!==g||I.spotLength!==S||I.rectAreaLength!==p||I.hemiLength!==m||I.numDirectionalShadows!==w||I.numPointShadows!==y||I.numSpotShadows!==x||I.numSpotMaps!==L||I.numLightProbes!==A)&&(n.directional.length=d,n.spot.length=S,n.rectArea.length=p,n.point.length=g,n.hemi.length=m,n.directionalShadow.length=w,n.directionalShadowMap.length=w,n.pointShadow.length=y,n.pointShadowMap.length=y,n.spotShadow.length=x,n.spotShadowMap.length=x,n.directionalShadowMatrix.length=w,n.pointShadowMatrix.length=y,n.spotLightMatrix.length=x+L-D,n.spotLightMap.length=L,n.numSpotLightShadowsWithMaps=D,n.numLightProbes=A,I.directionalLength=d,I.pointLength=g,I.spotLength=S,I.rectAreaLength=p,I.hemiLength=m,I.numDirectionalShadows=w,I.numPointShadows=y,I.numSpotShadows=x,I.numSpotMaps=L,I.numLightProbes=A,n.version=eg++)}function l(c,h){let u=0,f=0,d=0,g=0,S=0;const p=h.matrixWorldInverse;for(let m=0,w=c.length;m<w;m++){const y=c[m];if(y.isDirectionalLight){const x=n.directional[u];x.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(p),u++}else if(y.isSpotLight){const x=n.spot[d];x.position.setFromMatrixPosition(y.matrixWorld),x.position.applyMatrix4(p),x.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(p),d++}else if(y.isRectAreaLight){const x=n.rectArea[g];x.position.setFromMatrixPosition(y.matrixWorld),x.position.applyMatrix4(p),o.identity(),r.copy(y.matrixWorld),r.premultiply(p),o.extractRotation(r),x.halfWidth.set(y.width*.5,0,0),x.halfHeight.set(0,y.height*.5,0),x.halfWidth.applyMatrix4(o),x.halfHeight.applyMatrix4(o),g++}else if(y.isPointLight){const x=n.point[f];x.position.setFromMatrixPosition(y.matrixWorld),x.position.applyMatrix4(p),f++}else if(y.isHemisphereLight){const x=n.hemi[S];x.direction.setFromMatrixPosition(y.matrixWorld),x.direction.transformDirection(p),S++}}}return{setup:a,setupView:l,state:n}}function ac(i){const t=new ig(i),e=[],n=[];function s(h){c.camera=h,e.length=0,n.length=0}function r(h){e.push(h)}function o(h){n.push(h)}function a(){t.setup(e)}function l(h){t.setupView(e,h)}const c={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function sg(i){let t=new WeakMap;function e(s,r=0){const o=t.get(s);let a;return o===void 0?(a=new ac(i),t.set(s,[a])):r>=o.length?(a=new ac(i),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}class rg extends ds{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=zu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class og extends ds{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const ag=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,lg=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function cg(i,t,e){let n=new qa;const s=new ut,r=new ut,o=new oe,a=new rg({depthPacking:Bu}),l=new og,c={},h=e.maxTextureSize,u={[pi]:Be,[Be]:pi,[sn]:sn},f=new Ee({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ut},radius:{value:4}},vertexShader:ag,fragmentShader:lg}),d=f.clone();d.defines.HORIZONTAL_PASS=1;const g=new ce;g.setAttribute("position",new xe(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const S=new be(g,f),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Kc;let m=this.type;this.render=function(D,A,I){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||D.length===0)return;const z=i.getRenderTarget(),_=i.getActiveCubeFace(),E=i.getActiveMipmapLevel(),k=i.state;k.setBlending(Zn),k.buffers.color.setClear(1,1,1,1),k.buffers.depth.setTest(!0),k.setScissorTest(!1);const q=m!==Gn&&this.type===Gn,K=m===Gn&&this.type!==Gn;for(let tt=0,Z=D.length;tt<Z;tt++){const lt=D[tt],Q=lt.shadow;if(Q===void 0){console.warn("THREE.WebGLShadowMap:",lt,"has no shadow.");continue}if(Q.autoUpdate===!1&&Q.needsUpdate===!1)continue;s.copy(Q.mapSize);const xt=Q.getFrameExtents();if(s.multiply(xt),r.copy(Q.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/xt.x),s.x=r.x*xt.x,Q.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/xt.y),s.y=r.y*xt.y,Q.mapSize.y=r.y)),Q.map===null||q===!0||K===!0){const pt=this.type!==Gn?{minFilter:Ze,magFilter:Ze}:{};Q.map!==null&&Q.map.dispose(),Q.map=new on(s.x,s.y,pt),Q.map.texture.name=lt.name+".shadowMap",Q.camera.updateProjectionMatrix()}i.setRenderTarget(Q.map),i.clear();const yt=Q.getViewportCount();for(let pt=0;pt<yt;pt++){const Bt=Q.getViewport(pt);o.set(r.x*Bt.x,r.y*Bt.y,r.x*Bt.z,r.y*Bt.w),k.viewport(o),Q.updateMatrices(lt,pt),n=Q.getFrustum(),x(A,I,Q.camera,lt,this.type)}Q.isPointLightShadow!==!0&&this.type===Gn&&w(Q,I),Q.needsUpdate=!1}m=this.type,p.needsUpdate=!1,i.setRenderTarget(z,_,E)};function w(D,A){const I=t.update(S);f.defines.VSM_SAMPLES!==D.blurSamples&&(f.defines.VSM_SAMPLES=D.blurSamples,d.defines.VSM_SAMPLES=D.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),D.mapPass===null&&(D.mapPass=new on(s.x,s.y)),f.uniforms.shadow_pass.value=D.map.texture,f.uniforms.resolution.value=D.mapSize,f.uniforms.radius.value=D.radius,i.setRenderTarget(D.mapPass),i.clear(),i.renderBufferDirect(A,null,I,f,S,null),d.uniforms.shadow_pass.value=D.mapPass.texture,d.uniforms.resolution.value=D.mapSize,d.uniforms.radius.value=D.radius,i.setRenderTarget(D.map),i.clear(),i.renderBufferDirect(A,null,I,d,S,null)}function y(D,A,I,z){let _=null;const E=I.isPointLight===!0?D.customDistanceMaterial:D.customDepthMaterial;if(E!==void 0)_=E;else if(_=I.isPointLight===!0?l:a,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const k=_.uuid,q=A.uuid;let K=c[k];K===void 0&&(K={},c[k]=K);let tt=K[q];tt===void 0&&(tt=_.clone(),K[q]=tt,A.addEventListener("dispose",L)),_=tt}if(_.visible=A.visible,_.wireframe=A.wireframe,z===Gn?_.side=A.shadowSide!==null?A.shadowSide:A.side:_.side=A.shadowSide!==null?A.shadowSide:u[A.side],_.alphaMap=A.alphaMap,_.alphaTest=A.alphaTest,_.map=A.map,_.clipShadows=A.clipShadows,_.clippingPlanes=A.clippingPlanes,_.clipIntersection=A.clipIntersection,_.displacementMap=A.displacementMap,_.displacementScale=A.displacementScale,_.displacementBias=A.displacementBias,_.wireframeLinewidth=A.wireframeLinewidth,_.linewidth=A.linewidth,I.isPointLight===!0&&_.isMeshDistanceMaterial===!0){const k=i.properties.get(_);k.light=I}return _}function x(D,A,I,z,_){if(D.visible===!1)return;if(D.layers.test(A.layers)&&(D.isMesh||D.isLine||D.isPoints)&&(D.castShadow||D.receiveShadow&&_===Gn)&&(!D.frustumCulled||n.intersectsObject(D))){D.modelViewMatrix.multiplyMatrices(I.matrixWorldInverse,D.matrixWorld);const q=t.update(D),K=D.material;if(Array.isArray(K)){const tt=q.groups;for(let Z=0,lt=tt.length;Z<lt;Z++){const Q=tt[Z],xt=K[Q.materialIndex];if(xt&&xt.visible){const yt=y(D,xt,z,_);D.onBeforeShadow(i,D,A,I,q,yt,Q),i.renderBufferDirect(I,null,q,yt,D,Q),D.onAfterShadow(i,D,A,I,q,yt,Q)}}}else if(K.visible){const tt=y(D,K,z,_);D.onBeforeShadow(i,D,A,I,q,tt,null),i.renderBufferDirect(I,null,q,tt,D,null),D.onAfterShadow(i,D,A,I,q,tt,null)}}const k=D.children;for(let q=0,K=k.length;q<K;q++)x(k[q],A,I,z,_)}function L(D){D.target.removeEventListener("dispose",L);for(const I in c){const z=c[I],_=D.target.uuid;_ in z&&(z[_].dispose(),delete z[_])}}}const hg={[Ho]:Vo,[Go]:Yo,[Wo]:qo,[rs]:Xo,[Vo]:Ho,[Yo]:Go,[qo]:Wo,[Xo]:rs};function ug(i){function t(){let V=!1;const Et=new oe;let nt=null;const ft=new oe(0,0,0,0);return{setMask:function(bt){nt!==bt&&!V&&(i.colorMask(bt,bt,bt,bt),nt=bt)},setLocked:function(bt){V=bt},setClear:function(bt,Tt,jt,Me,We){We===!0&&(bt*=Me,Tt*=Me,jt*=Me),Et.set(bt,Tt,jt,Me),ft.equals(Et)===!1&&(i.clearColor(bt,Tt,jt,Me),ft.copy(Et))},reset:function(){V=!1,nt=null,ft.set(-1,0,0,0)}}}function e(){let V=!1,Et=!1,nt=null,ft=null,bt=null;return{setReversed:function(Tt){Et=Tt},setTest:function(Tt){Tt?wt(i.DEPTH_TEST):_t(i.DEPTH_TEST)},setMask:function(Tt){nt!==Tt&&!V&&(i.depthMask(Tt),nt=Tt)},setFunc:function(Tt){if(Et&&(Tt=hg[Tt]),ft!==Tt){switch(Tt){case Ho:i.depthFunc(i.NEVER);break;case Vo:i.depthFunc(i.ALWAYS);break;case Go:i.depthFunc(i.LESS);break;case rs:i.depthFunc(i.LEQUAL);break;case Wo:i.depthFunc(i.EQUAL);break;case Xo:i.depthFunc(i.GEQUAL);break;case Yo:i.depthFunc(i.GREATER);break;case qo:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ft=Tt}},setLocked:function(Tt){V=Tt},setClear:function(Tt){bt!==Tt&&(i.clearDepth(Tt),bt=Tt)},reset:function(){V=!1,nt=null,ft=null,bt=null}}}function n(){let V=!1,Et=null,nt=null,ft=null,bt=null,Tt=null,jt=null,Me=null,We=null;return{setTest:function(Jt){V||(Jt?wt(i.STENCIL_TEST):_t(i.STENCIL_TEST))},setMask:function(Jt){Et!==Jt&&!V&&(i.stencilMask(Jt),Et=Jt)},setFunc:function(Jt,Xe,Fn){(nt!==Jt||ft!==Xe||bt!==Fn)&&(i.stencilFunc(Jt,Xe,Fn),nt=Jt,ft=Xe,bt=Fn)},setOp:function(Jt,Xe,Fn){(Tt!==Jt||jt!==Xe||Me!==Fn)&&(i.stencilOp(Jt,Xe,Fn),Tt=Jt,jt=Xe,Me=Fn)},setLocked:function(Jt){V=Jt},setClear:function(Jt){We!==Jt&&(i.clearStencil(Jt),We=Jt)},reset:function(){V=!1,Et=null,nt=null,ft=null,bt=null,Tt=null,jt=null,Me=null,We=null}}}const s=new t,r=new e,o=new n,a=new WeakMap,l=new WeakMap;let c={},h={},u=new WeakMap,f=[],d=null,g=!1,S=null,p=null,m=null,w=null,y=null,x=null,L=null,D=new Wt(0,0,0),A=0,I=!1,z=null,_=null,E=null,k=null,q=null;const K=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let tt=!1,Z=0;const lt=i.getParameter(i.VERSION);lt.indexOf("WebGL")!==-1?(Z=parseFloat(/^WebGL (\d)/.exec(lt)[1]),tt=Z>=1):lt.indexOf("OpenGL ES")!==-1&&(Z=parseFloat(/^OpenGL ES (\d)/.exec(lt)[1]),tt=Z>=2);let Q=null,xt={};const yt=i.getParameter(i.SCISSOR_BOX),pt=i.getParameter(i.VIEWPORT),Bt=new oe().fromArray(yt),qt=new oe().fromArray(pt);function rt(V,Et,nt,ft){const bt=new Uint8Array(4),Tt=i.createTexture();i.bindTexture(V,Tt),i.texParameteri(V,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(V,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let jt=0;jt<nt;jt++)V===i.TEXTURE_3D||V===i.TEXTURE_2D_ARRAY?i.texImage3D(Et,0,i.RGBA,1,1,ft,0,i.RGBA,i.UNSIGNED_BYTE,bt):i.texImage2D(Et+jt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,bt);return Tt}const dt={};dt[i.TEXTURE_2D]=rt(i.TEXTURE_2D,i.TEXTURE_2D,1),dt[i.TEXTURE_CUBE_MAP]=rt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),dt[i.TEXTURE_2D_ARRAY]=rt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),dt[i.TEXTURE_3D]=rt(i.TEXTURE_3D,i.TEXTURE_3D,1,1),s.setClear(0,0,0,1),r.setClear(1),o.setClear(0),wt(i.DEPTH_TEST),r.setFunc(rs),N(!1),O(gl),wt(i.CULL_FACE),M(Zn);function wt(V){c[V]!==!0&&(i.enable(V),c[V]=!0)}function _t(V){c[V]!==!1&&(i.disable(V),c[V]=!1)}function zt(V,Et){return h[V]!==Et?(i.bindFramebuffer(V,Et),h[V]=Et,V===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=Et),V===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=Et),!0):!1}function Ot(V,Et){let nt=f,ft=!1;if(V){nt=u.get(Et),nt===void 0&&(nt=[],u.set(Et,nt));const bt=V.textures;if(nt.length!==bt.length||nt[0]!==i.COLOR_ATTACHMENT0){for(let Tt=0,jt=bt.length;Tt<jt;Tt++)nt[Tt]=i.COLOR_ATTACHMENT0+Tt;nt.length=bt.length,ft=!0}}else nt[0]!==i.BACK&&(nt[0]=i.BACK,ft=!0);ft&&i.drawBuffers(nt)}function C(V){return d!==V?(i.useProgram(V),d=V,!0):!1}const F={[Ei]:i.FUNC_ADD,[uu]:i.FUNC_SUBTRACT,[fu]:i.FUNC_REVERSE_SUBTRACT};F[du]=i.MIN,F[pu]=i.MAX;const R={[mu]:i.ZERO,[gu]:i.ONE,[vu]:i.SRC_COLOR,[Bo]:i.SRC_ALPHA,[bu]:i.SRC_ALPHA_SATURATE,[yu]:i.DST_COLOR,[xu]:i.DST_ALPHA,[_u]:i.ONE_MINUS_SRC_COLOR,[ko]:i.ONE_MINUS_SRC_ALPHA,[Su]:i.ONE_MINUS_DST_COLOR,[Mu]:i.ONE_MINUS_DST_ALPHA,[Eu]:i.CONSTANT_COLOR,[wu]:i.ONE_MINUS_CONSTANT_COLOR,[Tu]:i.CONSTANT_ALPHA,[Au]:i.ONE_MINUS_CONSTANT_ALPHA};function M(V,Et,nt,ft,bt,Tt,jt,Me,We,Jt){if(V===Zn){g===!0&&(_t(i.BLEND),g=!1);return}if(g===!1&&(wt(i.BLEND),g=!0),V!==hu){if(V!==S||Jt!==I){if((p!==Ei||y!==Ei)&&(i.blendEquation(i.FUNC_ADD),p=Ei,y=Ei),Jt)switch(V){case ns:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Is:i.blendFunc(i.ONE,i.ONE);break;case vl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case _l:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",V);break}else switch(V){case ns:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Is:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case vl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case _l:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",V);break}m=null,w=null,x=null,L=null,D.set(0,0,0),A=0,S=V,I=Jt}return}bt=bt||Et,Tt=Tt||nt,jt=jt||ft,(Et!==p||bt!==y)&&(i.blendEquationSeparate(F[Et],F[bt]),p=Et,y=bt),(nt!==m||ft!==w||Tt!==x||jt!==L)&&(i.blendFuncSeparate(R[nt],R[ft],R[Tt],R[jt]),m=nt,w=ft,x=Tt,L=jt),(Me.equals(D)===!1||We!==A)&&(i.blendColor(Me.r,Me.g,Me.b,We),D.copy(Me),A=We),S=V,I=!1}function H(V,Et){V.side===sn?_t(i.CULL_FACE):wt(i.CULL_FACE);let nt=V.side===Be;Et&&(nt=!nt),N(nt),V.blending===ns&&V.transparent===!1?M(Zn):M(V.blending,V.blendEquation,V.blendSrc,V.blendDst,V.blendEquationAlpha,V.blendSrcAlpha,V.blendDstAlpha,V.blendColor,V.blendAlpha,V.premultipliedAlpha),r.setFunc(V.depthFunc),r.setTest(V.depthTest),r.setMask(V.depthWrite),s.setMask(V.colorWrite);const ft=V.stencilWrite;o.setTest(ft),ft&&(o.setMask(V.stencilWriteMask),o.setFunc(V.stencilFunc,V.stencilRef,V.stencilFuncMask),o.setOp(V.stencilFail,V.stencilZFail,V.stencilZPass)),it(V.polygonOffset,V.polygonOffsetFactor,V.polygonOffsetUnits),V.alphaToCoverage===!0?wt(i.SAMPLE_ALPHA_TO_COVERAGE):_t(i.SAMPLE_ALPHA_TO_COVERAGE)}function N(V){z!==V&&(V?i.frontFace(i.CW):i.frontFace(i.CCW),z=V)}function O(V){V!==lu?(wt(i.CULL_FACE),V!==_&&(V===gl?i.cullFace(i.BACK):V===cu?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):_t(i.CULL_FACE),_=V}function Y(V){V!==E&&(tt&&i.lineWidth(V),E=V)}function it(V,Et,nt){V?(wt(i.POLYGON_OFFSET_FILL),(k!==Et||q!==nt)&&(i.polygonOffset(Et,nt),k=Et,q=nt)):_t(i.POLYGON_OFFSET_FILL)}function et(V){V?wt(i.SCISSOR_TEST):_t(i.SCISSOR_TEST)}function b(V){V===void 0&&(V=i.TEXTURE0+K-1),Q!==V&&(i.activeTexture(V),Q=V)}function v(V,Et,nt){nt===void 0&&(Q===null?nt=i.TEXTURE0+K-1:nt=Q);let ft=xt[nt];ft===void 0&&(ft={type:void 0,texture:void 0},xt[nt]=ft),(ft.type!==V||ft.texture!==Et)&&(Q!==nt&&(i.activeTexture(nt),Q=nt),i.bindTexture(V,Et||dt[V]),ft.type=V,ft.texture=Et)}function U(){const V=xt[Q];V!==void 0&&V.type!==void 0&&(i.bindTexture(V.type,null),V.type=void 0,V.texture=void 0)}function B(){try{i.compressedTexImage2D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function j(){try{i.compressedTexImage3D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function W(){try{i.texSubImage2D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function ht(){try{i.texSubImage3D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function ct(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function ot(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function Ct(){try{i.texStorage2D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function st(){try{i.texStorage3D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function gt(){try{i.texImage2D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function Rt(){try{i.texImage3D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function Dt(V){Bt.equals(V)===!1&&(i.scissor(V.x,V.y,V.z,V.w),Bt.copy(V))}function vt(V){qt.equals(V)===!1&&(i.viewport(V.x,V.y,V.z,V.w),qt.copy(V))}function kt(V,Et){let nt=l.get(Et);nt===void 0&&(nt=new WeakMap,l.set(Et,nt));let ft=nt.get(V);ft===void 0&&(ft=i.getUniformBlockIndex(Et,V.name),nt.set(V,ft))}function Ft(V,Et){const ft=l.get(Et).get(V);a.get(Et)!==ft&&(i.uniformBlockBinding(Et,ft,V.__bindingPointIndex),a.set(Et,ft))}function Kt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),c={},Q=null,xt={},h={},u=new WeakMap,f=[],d=null,g=!1,S=null,p=null,m=null,w=null,y=null,x=null,L=null,D=new Wt(0,0,0),A=0,I=!1,z=null,_=null,E=null,k=null,q=null,Bt.set(0,0,i.canvas.width,i.canvas.height),qt.set(0,0,i.canvas.width,i.canvas.height),s.reset(),r.reset(),o.reset()}return{buffers:{color:s,depth:r,stencil:o},enable:wt,disable:_t,bindFramebuffer:zt,drawBuffers:Ot,useProgram:C,setBlending:M,setMaterial:H,setFlipSided:N,setCullFace:O,setLineWidth:Y,setPolygonOffset:it,setScissorTest:et,activeTexture:b,bindTexture:v,unbindTexture:U,compressedTexImage2D:B,compressedTexImage3D:j,texImage2D:gt,texImage3D:Rt,updateUBOMapping:kt,uniformBlockBinding:Ft,texStorage2D:Ct,texStorage3D:st,texSubImage2D:W,texSubImage3D:ht,compressedTexSubImage2D:ct,compressedTexSubImage3D:ot,scissor:Dt,viewport:vt,reset:Kt}}function lc(i,t,e,n){const s=fg(n);switch(e){case ih:return i*t;case rh:return i*t;case oh:return i*t*2;case za:return i*t/s.components*s.byteLength;case Ba:return i*t/s.components*s.byteLength;case ah:return i*t*2/s.components*s.byteLength;case ka:return i*t*2/s.components*s.byteLength;case sh:return i*t*3/s.components*s.byteLength;case Tn:return i*t*4/s.components*s.byteLength;case Ha:return i*t*4/s.components*s.byteLength;case yr:case Sr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case br:case Er:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Qo:case ea:return Math.max(i,16)*Math.max(t,8)/4;case Jo:case ta:return Math.max(i,8)*Math.max(t,8)/2;case na:case ia:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case sa:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case ra:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case oa:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case aa:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case la:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case ca:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case ha:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case ua:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case fa:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case da:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case pa:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case ma:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case ga:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case va:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case _a:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case wr:case xa:case Ma:return Math.ceil(i/4)*Math.ceil(t/4)*16;case lh:case ya:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Sa:case ba:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function fg(i){switch(i){case $n:case th:return{byteLength:1,components:1};case Us:case eh:case pn:return{byteLength:2,components:1};case Fa:case Oa:return{byteLength:2,components:4};case Ai:case Na:case wn:return{byteLength:4,components:1};case nh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function dg(i,t,e,n,s,r,o){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ut,h=new WeakMap;let u;const f=new WeakMap;let d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(b,v){return d?new OffscreenCanvas(b,v):Lr("canvas")}function S(b,v,U){let B=1;const j=et(b);if((j.width>U||j.height>U)&&(B=U/Math.max(j.width,j.height)),B<1)if(typeof HTMLImageElement<"u"&&b instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&b instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&b instanceof ImageBitmap||typeof VideoFrame<"u"&&b instanceof VideoFrame){const W=Math.floor(B*j.width),ht=Math.floor(B*j.height);u===void 0&&(u=g(W,ht));const ct=v?g(W,ht):u;return ct.width=W,ct.height=ht,ct.getContext("2d").drawImage(b,0,0,W,ht),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+j.width+"x"+j.height+") to ("+W+"x"+ht+")."),ct}else return"data"in b&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+j.width+"x"+j.height+")."),b;return b}function p(b){return b.generateMipmaps&&b.minFilter!==Ze&&b.minFilter!==Sn}function m(b){i.generateMipmap(b)}function w(b,v,U,B,j=!1){if(b!==null){if(i[b]!==void 0)return i[b];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+b+"'")}let W=v;if(v===i.RED&&(U===i.FLOAT&&(W=i.R32F),U===i.HALF_FLOAT&&(W=i.R16F),U===i.UNSIGNED_BYTE&&(W=i.R8)),v===i.RED_INTEGER&&(U===i.UNSIGNED_BYTE&&(W=i.R8UI),U===i.UNSIGNED_SHORT&&(W=i.R16UI),U===i.UNSIGNED_INT&&(W=i.R32UI),U===i.BYTE&&(W=i.R8I),U===i.SHORT&&(W=i.R16I),U===i.INT&&(W=i.R32I)),v===i.RG&&(U===i.FLOAT&&(W=i.RG32F),U===i.HALF_FLOAT&&(W=i.RG16F),U===i.UNSIGNED_BYTE&&(W=i.RG8)),v===i.RG_INTEGER&&(U===i.UNSIGNED_BYTE&&(W=i.RG8UI),U===i.UNSIGNED_SHORT&&(W=i.RG16UI),U===i.UNSIGNED_INT&&(W=i.RG32UI),U===i.BYTE&&(W=i.RG8I),U===i.SHORT&&(W=i.RG16I),U===i.INT&&(W=i.RG32I)),v===i.RGB_INTEGER&&(U===i.UNSIGNED_BYTE&&(W=i.RGB8UI),U===i.UNSIGNED_SHORT&&(W=i.RGB16UI),U===i.UNSIGNED_INT&&(W=i.RGB32UI),U===i.BYTE&&(W=i.RGB8I),U===i.SHORT&&(W=i.RGB16I),U===i.INT&&(W=i.RGB32I)),v===i.RGBA_INTEGER&&(U===i.UNSIGNED_BYTE&&(W=i.RGBA8UI),U===i.UNSIGNED_SHORT&&(W=i.RGBA16UI),U===i.UNSIGNED_INT&&(W=i.RGBA32UI),U===i.BYTE&&(W=i.RGBA8I),U===i.SHORT&&(W=i.RGBA16I),U===i.INT&&(W=i.RGBA32I)),v===i.RGB&&U===i.UNSIGNED_INT_5_9_9_9_REV&&(W=i.RGB9_E5),v===i.RGBA){const ht=j?Cr:ne.getTransfer(B);U===i.FLOAT&&(W=i.RGBA32F),U===i.HALF_FLOAT&&(W=i.RGBA16F),U===i.UNSIGNED_BYTE&&(W=ht===ue?i.SRGB8_ALPHA8:i.RGBA8),U===i.UNSIGNED_SHORT_4_4_4_4&&(W=i.RGBA4),U===i.UNSIGNED_SHORT_5_5_5_1&&(W=i.RGB5_A1)}return(W===i.R16F||W===i.R32F||W===i.RG16F||W===i.RG32F||W===i.RGBA16F||W===i.RGBA32F)&&t.get("EXT_color_buffer_float"),W}function y(b,v){let U;return b?v===null||v===Ai||v===ls?U=i.DEPTH24_STENCIL8:v===wn?U=i.DEPTH32F_STENCIL8:v===Us&&(U=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===Ai||v===ls?U=i.DEPTH_COMPONENT24:v===wn?U=i.DEPTH_COMPONENT32F:v===Us&&(U=i.DEPTH_COMPONENT16),U}function x(b,v){return p(b)===!0||b.isFramebufferTexture&&b.minFilter!==Ze&&b.minFilter!==Sn?Math.log2(Math.max(v.width,v.height))+1:b.mipmaps!==void 0&&b.mipmaps.length>0?b.mipmaps.length:b.isCompressedTexture&&Array.isArray(b.image)?v.mipmaps.length:1}function L(b){const v=b.target;v.removeEventListener("dispose",L),A(v),v.isVideoTexture&&h.delete(v)}function D(b){const v=b.target;v.removeEventListener("dispose",D),z(v)}function A(b){const v=n.get(b);if(v.__webglInit===void 0)return;const U=b.source,B=f.get(U);if(B){const j=B[v.__cacheKey];j.usedTimes--,j.usedTimes===0&&I(b),Object.keys(B).length===0&&f.delete(U)}n.remove(b)}function I(b){const v=n.get(b);i.deleteTexture(v.__webglTexture);const U=b.source,B=f.get(U);delete B[v.__cacheKey],o.memory.textures--}function z(b){const v=n.get(b);if(b.depthTexture&&b.depthTexture.dispose(),b.isWebGLCubeRenderTarget)for(let B=0;B<6;B++){if(Array.isArray(v.__webglFramebuffer[B]))for(let j=0;j<v.__webglFramebuffer[B].length;j++)i.deleteFramebuffer(v.__webglFramebuffer[B][j]);else i.deleteFramebuffer(v.__webglFramebuffer[B]);v.__webglDepthbuffer&&i.deleteRenderbuffer(v.__webglDepthbuffer[B])}else{if(Array.isArray(v.__webglFramebuffer))for(let B=0;B<v.__webglFramebuffer.length;B++)i.deleteFramebuffer(v.__webglFramebuffer[B]);else i.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&i.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&i.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let B=0;B<v.__webglColorRenderbuffer.length;B++)v.__webglColorRenderbuffer[B]&&i.deleteRenderbuffer(v.__webglColorRenderbuffer[B]);v.__webglDepthRenderbuffer&&i.deleteRenderbuffer(v.__webglDepthRenderbuffer)}const U=b.textures;for(let B=0,j=U.length;B<j;B++){const W=n.get(U[B]);W.__webglTexture&&(i.deleteTexture(W.__webglTexture),o.memory.textures--),n.remove(U[B])}n.remove(b)}let _=0;function E(){_=0}function k(){const b=_;return b>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+b+" texture units while this GPU supports only "+s.maxTextures),_+=1,b}function q(b){const v=[];return v.push(b.wrapS),v.push(b.wrapT),v.push(b.wrapR||0),v.push(b.magFilter),v.push(b.minFilter),v.push(b.anisotropy),v.push(b.internalFormat),v.push(b.format),v.push(b.type),v.push(b.generateMipmaps),v.push(b.premultiplyAlpha),v.push(b.flipY),v.push(b.unpackAlignment),v.push(b.colorSpace),v.join()}function K(b,v){const U=n.get(b);if(b.isVideoTexture&&Y(b),b.isRenderTargetTexture===!1&&b.version>0&&U.__version!==b.version){const B=b.image;if(B===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(B.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{qt(U,b,v);return}}e.bindTexture(i.TEXTURE_2D,U.__webglTexture,i.TEXTURE0+v)}function tt(b,v){const U=n.get(b);if(b.version>0&&U.__version!==b.version){qt(U,b,v);return}e.bindTexture(i.TEXTURE_2D_ARRAY,U.__webglTexture,i.TEXTURE0+v)}function Z(b,v){const U=n.get(b);if(b.version>0&&U.__version!==b.version){qt(U,b,v);return}e.bindTexture(i.TEXTURE_3D,U.__webglTexture,i.TEXTURE0+v)}function lt(b,v){const U=n.get(b);if(b.version>0&&U.__version!==b.version){rt(U,b,v);return}e.bindTexture(i.TEXTURE_CUBE_MAP,U.__webglTexture,i.TEXTURE0+v)}const Q={[Ko]:i.REPEAT,[Ti]:i.CLAMP_TO_EDGE,[$o]:i.MIRRORED_REPEAT},xt={[Ze]:i.NEAREST,[Ou]:i.NEAREST_MIPMAP_NEAREST,[Ws]:i.NEAREST_MIPMAP_LINEAR,[Sn]:i.LINEAR,[to]:i.LINEAR_MIPMAP_NEAREST,[ui]:i.LINEAR_MIPMAP_LINEAR},yt={[Hu]:i.NEVER,[qu]:i.ALWAYS,[Vu]:i.LESS,[hh]:i.LEQUAL,[Gu]:i.EQUAL,[Yu]:i.GEQUAL,[Wu]:i.GREATER,[Xu]:i.NOTEQUAL};function pt(b,v){if(v.type===wn&&t.has("OES_texture_float_linear")===!1&&(v.magFilter===Sn||v.magFilter===to||v.magFilter===Ws||v.magFilter===ui||v.minFilter===Sn||v.minFilter===to||v.minFilter===Ws||v.minFilter===ui)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(b,i.TEXTURE_WRAP_S,Q[v.wrapS]),i.texParameteri(b,i.TEXTURE_WRAP_T,Q[v.wrapT]),(b===i.TEXTURE_3D||b===i.TEXTURE_2D_ARRAY)&&i.texParameteri(b,i.TEXTURE_WRAP_R,Q[v.wrapR]),i.texParameteri(b,i.TEXTURE_MAG_FILTER,xt[v.magFilter]),i.texParameteri(b,i.TEXTURE_MIN_FILTER,xt[v.minFilter]),v.compareFunction&&(i.texParameteri(b,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(b,i.TEXTURE_COMPARE_FUNC,yt[v.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===Ze||v.minFilter!==Ws&&v.minFilter!==ui||v.type===wn&&t.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||n.get(v).__currentAnisotropy){const U=t.get("EXT_texture_filter_anisotropic");i.texParameterf(b,U.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,s.getMaxAnisotropy())),n.get(v).__currentAnisotropy=v.anisotropy}}}function Bt(b,v){let U=!1;b.__webglInit===void 0&&(b.__webglInit=!0,v.addEventListener("dispose",L));const B=v.source;let j=f.get(B);j===void 0&&(j={},f.set(B,j));const W=q(v);if(W!==b.__cacheKey){j[W]===void 0&&(j[W]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,U=!0),j[W].usedTimes++;const ht=j[b.__cacheKey];ht!==void 0&&(j[b.__cacheKey].usedTimes--,ht.usedTimes===0&&I(v)),b.__cacheKey=W,b.__webglTexture=j[W].texture}return U}function qt(b,v,U){let B=i.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(B=i.TEXTURE_2D_ARRAY),v.isData3DTexture&&(B=i.TEXTURE_3D);const j=Bt(b,v),W=v.source;e.bindTexture(B,b.__webglTexture,i.TEXTURE0+U);const ht=n.get(W);if(W.version!==ht.__version||j===!0){e.activeTexture(i.TEXTURE0+U);const ct=ne.getPrimaries(ne.workingColorSpace),ot=v.colorSpace===hi?null:ne.getPrimaries(v.colorSpace),Ct=v.colorSpace===hi||ct===ot?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,v.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,v.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ct);let st=S(v.image,!1,s.maxTextureSize);st=it(v,st);const gt=r.convert(v.format,v.colorSpace),Rt=r.convert(v.type);let Dt=w(v.internalFormat,gt,Rt,v.colorSpace,v.isVideoTexture);pt(B,v);let vt;const kt=v.mipmaps,Ft=v.isVideoTexture!==!0,Kt=ht.__version===void 0||j===!0,V=W.dataReady,Et=x(v,st);if(v.isDepthTexture)Dt=y(v.format===cs,v.type),Kt&&(Ft?e.texStorage2D(i.TEXTURE_2D,1,Dt,st.width,st.height):e.texImage2D(i.TEXTURE_2D,0,Dt,st.width,st.height,0,gt,Rt,null));else if(v.isDataTexture)if(kt.length>0){Ft&&Kt&&e.texStorage2D(i.TEXTURE_2D,Et,Dt,kt[0].width,kt[0].height);for(let nt=0,ft=kt.length;nt<ft;nt++)vt=kt[nt],Ft?V&&e.texSubImage2D(i.TEXTURE_2D,nt,0,0,vt.width,vt.height,gt,Rt,vt.data):e.texImage2D(i.TEXTURE_2D,nt,Dt,vt.width,vt.height,0,gt,Rt,vt.data);v.generateMipmaps=!1}else Ft?(Kt&&e.texStorage2D(i.TEXTURE_2D,Et,Dt,st.width,st.height),V&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,st.width,st.height,gt,Rt,st.data)):e.texImage2D(i.TEXTURE_2D,0,Dt,st.width,st.height,0,gt,Rt,st.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){Ft&&Kt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Et,Dt,kt[0].width,kt[0].height,st.depth);for(let nt=0,ft=kt.length;nt<ft;nt++)if(vt=kt[nt],v.format!==Tn)if(gt!==null)if(Ft){if(V)if(v.layerUpdates.size>0){const bt=lc(vt.width,vt.height,v.format,v.type);for(const Tt of v.layerUpdates){const jt=vt.data.subarray(Tt*bt/vt.data.BYTES_PER_ELEMENT,(Tt+1)*bt/vt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,nt,0,0,Tt,vt.width,vt.height,1,gt,jt,0,0)}v.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,nt,0,0,0,vt.width,vt.height,st.depth,gt,vt.data,0,0)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,nt,Dt,vt.width,vt.height,st.depth,0,vt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ft?V&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,nt,0,0,0,vt.width,vt.height,st.depth,gt,Rt,vt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,nt,Dt,vt.width,vt.height,st.depth,0,gt,Rt,vt.data)}else{Ft&&Kt&&e.texStorage2D(i.TEXTURE_2D,Et,Dt,kt[0].width,kt[0].height);for(let nt=0,ft=kt.length;nt<ft;nt++)vt=kt[nt],v.format!==Tn?gt!==null?Ft?V&&e.compressedTexSubImage2D(i.TEXTURE_2D,nt,0,0,vt.width,vt.height,gt,vt.data):e.compressedTexImage2D(i.TEXTURE_2D,nt,Dt,vt.width,vt.height,0,vt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ft?V&&e.texSubImage2D(i.TEXTURE_2D,nt,0,0,vt.width,vt.height,gt,Rt,vt.data):e.texImage2D(i.TEXTURE_2D,nt,Dt,vt.width,vt.height,0,gt,Rt,vt.data)}else if(v.isDataArrayTexture)if(Ft){if(Kt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Et,Dt,st.width,st.height,st.depth),V)if(v.layerUpdates.size>0){const nt=lc(st.width,st.height,v.format,v.type);for(const ft of v.layerUpdates){const bt=st.data.subarray(ft*nt/st.data.BYTES_PER_ELEMENT,(ft+1)*nt/st.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,ft,st.width,st.height,1,gt,Rt,bt)}v.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,st.width,st.height,st.depth,gt,Rt,st.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Dt,st.width,st.height,st.depth,0,gt,Rt,st.data);else if(v.isData3DTexture)Ft?(Kt&&e.texStorage3D(i.TEXTURE_3D,Et,Dt,st.width,st.height,st.depth),V&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,st.width,st.height,st.depth,gt,Rt,st.data)):e.texImage3D(i.TEXTURE_3D,0,Dt,st.width,st.height,st.depth,0,gt,Rt,st.data);else if(v.isFramebufferTexture){if(Kt)if(Ft)e.texStorage2D(i.TEXTURE_2D,Et,Dt,st.width,st.height);else{let nt=st.width,ft=st.height;for(let bt=0;bt<Et;bt++)e.texImage2D(i.TEXTURE_2D,bt,Dt,nt,ft,0,gt,Rt,null),nt>>=1,ft>>=1}}else if(kt.length>0){if(Ft&&Kt){const nt=et(kt[0]);e.texStorage2D(i.TEXTURE_2D,Et,Dt,nt.width,nt.height)}for(let nt=0,ft=kt.length;nt<ft;nt++)vt=kt[nt],Ft?V&&e.texSubImage2D(i.TEXTURE_2D,nt,0,0,gt,Rt,vt):e.texImage2D(i.TEXTURE_2D,nt,Dt,gt,Rt,vt);v.generateMipmaps=!1}else if(Ft){if(Kt){const nt=et(st);e.texStorage2D(i.TEXTURE_2D,Et,Dt,nt.width,nt.height)}V&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,gt,Rt,st)}else e.texImage2D(i.TEXTURE_2D,0,Dt,gt,Rt,st);p(v)&&m(B),ht.__version=W.version,v.onUpdate&&v.onUpdate(v)}b.__version=v.version}function rt(b,v,U){if(v.image.length!==6)return;const B=Bt(b,v),j=v.source;e.bindTexture(i.TEXTURE_CUBE_MAP,b.__webglTexture,i.TEXTURE0+U);const W=n.get(j);if(j.version!==W.__version||B===!0){e.activeTexture(i.TEXTURE0+U);const ht=ne.getPrimaries(ne.workingColorSpace),ct=v.colorSpace===hi?null:ne.getPrimaries(v.colorSpace),ot=v.colorSpace===hi||ht===ct?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,v.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,v.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ot);const Ct=v.isCompressedTexture||v.image[0].isCompressedTexture,st=v.image[0]&&v.image[0].isDataTexture,gt=[];for(let ft=0;ft<6;ft++)!Ct&&!st?gt[ft]=S(v.image[ft],!0,s.maxCubemapSize):gt[ft]=st?v.image[ft].image:v.image[ft],gt[ft]=it(v,gt[ft]);const Rt=gt[0],Dt=r.convert(v.format,v.colorSpace),vt=r.convert(v.type),kt=w(v.internalFormat,Dt,vt,v.colorSpace),Ft=v.isVideoTexture!==!0,Kt=W.__version===void 0||B===!0,V=j.dataReady;let Et=x(v,Rt);pt(i.TEXTURE_CUBE_MAP,v);let nt;if(Ct){Ft&&Kt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,Et,kt,Rt.width,Rt.height);for(let ft=0;ft<6;ft++){nt=gt[ft].mipmaps;for(let bt=0;bt<nt.length;bt++){const Tt=nt[bt];v.format!==Tn?Dt!==null?Ft?V&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,bt,0,0,Tt.width,Tt.height,Dt,Tt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,bt,kt,Tt.width,Tt.height,0,Tt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ft?V&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,bt,0,0,Tt.width,Tt.height,Dt,vt,Tt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,bt,kt,Tt.width,Tt.height,0,Dt,vt,Tt.data)}}}else{if(nt=v.mipmaps,Ft&&Kt){nt.length>0&&Et++;const ft=et(gt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,Et,kt,ft.width,ft.height)}for(let ft=0;ft<6;ft++)if(st){Ft?V&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,0,0,0,gt[ft].width,gt[ft].height,Dt,vt,gt[ft].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,0,kt,gt[ft].width,gt[ft].height,0,Dt,vt,gt[ft].data);for(let bt=0;bt<nt.length;bt++){const jt=nt[bt].image[ft].image;Ft?V&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,bt+1,0,0,jt.width,jt.height,Dt,vt,jt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,bt+1,kt,jt.width,jt.height,0,Dt,vt,jt.data)}}else{Ft?V&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,0,0,0,Dt,vt,gt[ft]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,0,kt,Dt,vt,gt[ft]);for(let bt=0;bt<nt.length;bt++){const Tt=nt[bt];Ft?V&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,bt+1,0,0,Dt,vt,Tt.image[ft]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,bt+1,kt,Dt,vt,Tt.image[ft])}}}p(v)&&m(i.TEXTURE_CUBE_MAP),W.__version=j.version,v.onUpdate&&v.onUpdate(v)}b.__version=v.version}function dt(b,v,U,B,j,W){const ht=r.convert(U.format,U.colorSpace),ct=r.convert(U.type),ot=w(U.internalFormat,ht,ct,U.colorSpace);if(!n.get(v).__hasExternalTextures){const st=Math.max(1,v.width>>W),gt=Math.max(1,v.height>>W);j===i.TEXTURE_3D||j===i.TEXTURE_2D_ARRAY?e.texImage3D(j,W,ot,st,gt,v.depth,0,ht,ct,null):e.texImage2D(j,W,ot,st,gt,0,ht,ct,null)}e.bindFramebuffer(i.FRAMEBUFFER,b),O(v)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,B,j,n.get(U).__webglTexture,0,N(v)):(j===i.TEXTURE_2D||j>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&j<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,B,j,n.get(U).__webglTexture,W),e.bindFramebuffer(i.FRAMEBUFFER,null)}function wt(b,v,U){if(i.bindRenderbuffer(i.RENDERBUFFER,b),v.depthBuffer){const B=v.depthTexture,j=B&&B.isDepthTexture?B.type:null,W=y(v.stencilBuffer,j),ht=v.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ct=N(v);O(v)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ct,W,v.width,v.height):U?i.renderbufferStorageMultisample(i.RENDERBUFFER,ct,W,v.width,v.height):i.renderbufferStorage(i.RENDERBUFFER,W,v.width,v.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,ht,i.RENDERBUFFER,b)}else{const B=v.textures;for(let j=0;j<B.length;j++){const W=B[j],ht=r.convert(W.format,W.colorSpace),ct=r.convert(W.type),ot=w(W.internalFormat,ht,ct,W.colorSpace),Ct=N(v);U&&O(v)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Ct,ot,v.width,v.height):O(v)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Ct,ot,v.width,v.height):i.renderbufferStorage(i.RENDERBUFFER,ot,v.width,v.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function _t(b,v){if(v&&v.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,b),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(v.depthTexture).__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),K(v.depthTexture,0);const B=n.get(v.depthTexture).__webglTexture,j=N(v);if(v.depthTexture.format===is)O(v)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,B,0,j):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,B,0);else if(v.depthTexture.format===cs)O(v)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,B,0,j):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,B,0);else throw new Error("Unknown depthTexture format")}function zt(b){const v=n.get(b),U=b.isWebGLCubeRenderTarget===!0;if(v.__boundDepthTexture!==b.depthTexture){const B=b.depthTexture;if(v.__depthDisposeCallback&&v.__depthDisposeCallback(),B){const j=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,B.removeEventListener("dispose",j)};B.addEventListener("dispose",j),v.__depthDisposeCallback=j}v.__boundDepthTexture=B}if(b.depthTexture&&!v.__autoAllocateDepthBuffer){if(U)throw new Error("target.depthTexture not supported in Cube render targets");_t(v.__webglFramebuffer,b)}else if(U){v.__webglDepthbuffer=[];for(let B=0;B<6;B++)if(e.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer[B]),v.__webglDepthbuffer[B]===void 0)v.__webglDepthbuffer[B]=i.createRenderbuffer(),wt(v.__webglDepthbuffer[B],b,!1);else{const j=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,W=v.__webglDepthbuffer[B];i.bindRenderbuffer(i.RENDERBUFFER,W),i.framebufferRenderbuffer(i.FRAMEBUFFER,j,i.RENDERBUFFER,W)}}else if(e.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=i.createRenderbuffer(),wt(v.__webglDepthbuffer,b,!1);else{const B=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,j=v.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,j),i.framebufferRenderbuffer(i.FRAMEBUFFER,B,i.RENDERBUFFER,j)}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Ot(b,v,U){const B=n.get(b);v!==void 0&&dt(B.__webglFramebuffer,b,b.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),U!==void 0&&zt(b)}function C(b){const v=b.texture,U=n.get(b),B=n.get(v);b.addEventListener("dispose",D);const j=b.textures,W=b.isWebGLCubeRenderTarget===!0,ht=j.length>1;if(ht||(B.__webglTexture===void 0&&(B.__webglTexture=i.createTexture()),B.__version=v.version,o.memory.textures++),W){U.__webglFramebuffer=[];for(let ct=0;ct<6;ct++)if(v.mipmaps&&v.mipmaps.length>0){U.__webglFramebuffer[ct]=[];for(let ot=0;ot<v.mipmaps.length;ot++)U.__webglFramebuffer[ct][ot]=i.createFramebuffer()}else U.__webglFramebuffer[ct]=i.createFramebuffer()}else{if(v.mipmaps&&v.mipmaps.length>0){U.__webglFramebuffer=[];for(let ct=0;ct<v.mipmaps.length;ct++)U.__webglFramebuffer[ct]=i.createFramebuffer()}else U.__webglFramebuffer=i.createFramebuffer();if(ht)for(let ct=0,ot=j.length;ct<ot;ct++){const Ct=n.get(j[ct]);Ct.__webglTexture===void 0&&(Ct.__webglTexture=i.createTexture(),o.memory.textures++)}if(b.samples>0&&O(b)===!1){U.__webglMultisampledFramebuffer=i.createFramebuffer(),U.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,U.__webglMultisampledFramebuffer);for(let ct=0;ct<j.length;ct++){const ot=j[ct];U.__webglColorRenderbuffer[ct]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,U.__webglColorRenderbuffer[ct]);const Ct=r.convert(ot.format,ot.colorSpace),st=r.convert(ot.type),gt=w(ot.internalFormat,Ct,st,ot.colorSpace,b.isXRRenderTarget===!0),Rt=N(b);i.renderbufferStorageMultisample(i.RENDERBUFFER,Rt,gt,b.width,b.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ct,i.RENDERBUFFER,U.__webglColorRenderbuffer[ct])}i.bindRenderbuffer(i.RENDERBUFFER,null),b.depthBuffer&&(U.__webglDepthRenderbuffer=i.createRenderbuffer(),wt(U.__webglDepthRenderbuffer,b,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(W){e.bindTexture(i.TEXTURE_CUBE_MAP,B.__webglTexture),pt(i.TEXTURE_CUBE_MAP,v);for(let ct=0;ct<6;ct++)if(v.mipmaps&&v.mipmaps.length>0)for(let ot=0;ot<v.mipmaps.length;ot++)dt(U.__webglFramebuffer[ct][ot],b,v,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,ot);else dt(U.__webglFramebuffer[ct],b,v,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0);p(v)&&m(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(ht){for(let ct=0,ot=j.length;ct<ot;ct++){const Ct=j[ct],st=n.get(Ct);e.bindTexture(i.TEXTURE_2D,st.__webglTexture),pt(i.TEXTURE_2D,Ct),dt(U.__webglFramebuffer,b,Ct,i.COLOR_ATTACHMENT0+ct,i.TEXTURE_2D,0),p(Ct)&&m(i.TEXTURE_2D)}e.unbindTexture()}else{let ct=i.TEXTURE_2D;if((b.isWebGL3DRenderTarget||b.isWebGLArrayRenderTarget)&&(ct=b.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(ct,B.__webglTexture),pt(ct,v),v.mipmaps&&v.mipmaps.length>0)for(let ot=0;ot<v.mipmaps.length;ot++)dt(U.__webglFramebuffer[ot],b,v,i.COLOR_ATTACHMENT0,ct,ot);else dt(U.__webglFramebuffer,b,v,i.COLOR_ATTACHMENT0,ct,0);p(v)&&m(ct),e.unbindTexture()}b.depthBuffer&&zt(b)}function F(b){const v=b.textures;for(let U=0,B=v.length;U<B;U++){const j=v[U];if(p(j)){const W=b.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,ht=n.get(j).__webglTexture;e.bindTexture(W,ht),m(W),e.unbindTexture()}}}const R=[],M=[];function H(b){if(b.samples>0){if(O(b)===!1){const v=b.textures,U=b.width,B=b.height;let j=i.COLOR_BUFFER_BIT;const W=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ht=n.get(b),ct=v.length>1;if(ct)for(let ot=0;ot<v.length;ot++)e.bindFramebuffer(i.FRAMEBUFFER,ht.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ot,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,ht.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ot,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,ht.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,ht.__webglFramebuffer);for(let ot=0;ot<v.length;ot++){if(b.resolveDepthBuffer&&(b.depthBuffer&&(j|=i.DEPTH_BUFFER_BIT),b.stencilBuffer&&b.resolveStencilBuffer&&(j|=i.STENCIL_BUFFER_BIT)),ct){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,ht.__webglColorRenderbuffer[ot]);const Ct=n.get(v[ot]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Ct,0)}i.blitFramebuffer(0,0,U,B,0,0,U,B,j,i.NEAREST),l===!0&&(R.length=0,M.length=0,R.push(i.COLOR_ATTACHMENT0+ot),b.depthBuffer&&b.resolveDepthBuffer===!1&&(R.push(W),M.push(W),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,M)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,R))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ct)for(let ot=0;ot<v.length;ot++){e.bindFramebuffer(i.FRAMEBUFFER,ht.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ot,i.RENDERBUFFER,ht.__webglColorRenderbuffer[ot]);const Ct=n.get(v[ot]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,ht.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ot,i.TEXTURE_2D,Ct,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,ht.__webglMultisampledFramebuffer)}else if(b.depthBuffer&&b.resolveDepthBuffer===!1&&l){const v=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[v])}}}function N(b){return Math.min(s.maxSamples,b.samples)}function O(b){const v=n.get(b);return b.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function Y(b){const v=o.render.frame;h.get(b)!==v&&(h.set(b,v),b.update())}function it(b,v){const U=b.colorSpace,B=b.format,j=b.type;return b.isCompressedTexture===!0||b.isVideoTexture===!0||U!==Qn&&U!==hi&&(ne.getTransfer(U)===ue?(B!==Tn||j!==$n)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",U)),v}function et(b){return typeof HTMLImageElement<"u"&&b instanceof HTMLImageElement?(c.width=b.naturalWidth||b.width,c.height=b.naturalHeight||b.height):typeof VideoFrame<"u"&&b instanceof VideoFrame?(c.width=b.displayWidth,c.height=b.displayHeight):(c.width=b.width,c.height=b.height),c}this.allocateTextureUnit=k,this.resetTextureUnits=E,this.setTexture2D=K,this.setTexture2DArray=tt,this.setTexture3D=Z,this.setTextureCube=lt,this.rebindTextures=Ot,this.setupRenderTarget=C,this.updateRenderTargetMipmap=F,this.updateMultisampleRenderTarget=H,this.setupDepthRenderbuffer=zt,this.setupFrameBufferTexture=dt,this.useMultisampledRTT=O}function pg(i,t){function e(n,s=hi){let r;const o=ne.getTransfer(s);if(n===$n)return i.UNSIGNED_BYTE;if(n===Fa)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Oa)return i.UNSIGNED_SHORT_5_5_5_1;if(n===nh)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===th)return i.BYTE;if(n===eh)return i.SHORT;if(n===Us)return i.UNSIGNED_SHORT;if(n===Na)return i.INT;if(n===Ai)return i.UNSIGNED_INT;if(n===wn)return i.FLOAT;if(n===pn)return i.HALF_FLOAT;if(n===ih)return i.ALPHA;if(n===sh)return i.RGB;if(n===Tn)return i.RGBA;if(n===rh)return i.LUMINANCE;if(n===oh)return i.LUMINANCE_ALPHA;if(n===is)return i.DEPTH_COMPONENT;if(n===cs)return i.DEPTH_STENCIL;if(n===za)return i.RED;if(n===Ba)return i.RED_INTEGER;if(n===ah)return i.RG;if(n===ka)return i.RG_INTEGER;if(n===Ha)return i.RGBA_INTEGER;if(n===yr||n===Sr||n===br||n===Er)if(o===ue)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===yr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Sr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===br)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Er)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===yr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Sr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===br)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Er)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Jo||n===Qo||n===ta||n===ea)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Jo)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Qo)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===ta)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===ea)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===na||n===ia||n===sa)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===na||n===ia)return o===ue?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===sa)return o===ue?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===ra||n===oa||n===aa||n===la||n===ca||n===ha||n===ua||n===fa||n===da||n===pa||n===ma||n===ga||n===va||n===_a)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===ra)return o===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===oa)return o===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===aa)return o===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===la)return o===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===ca)return o===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===ha)return o===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===ua)return o===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===fa)return o===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===da)return o===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===pa)return o===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===ma)return o===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===ga)return o===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===va)return o===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===_a)return o===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===wr||n===xa||n===Ma)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===wr)return o===ue?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===xa)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Ma)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===lh||n===ya||n===Sa||n===ba)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===wr)return r.COMPRESSED_RED_RGTC1_EXT;if(n===ya)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Sa)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===ba)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===ls?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}class mg extends nn{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Cn extends Ne{constructor(){super(),this.isGroup=!0,this.type="Group"}}const gg={type:"move"};class Ro{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Cn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Cn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Cn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const S of t.hand.values()){const p=e.getJointPose(S,n),m=this._getHandJoint(c,S);p!==null&&(m.matrix.fromArray(p.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=p.radius),m.visible=p!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],f=h.position.distanceTo(u.position),d=.02,g=.005;c.inputState.pinching&&f>d+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&f<=d-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(gg)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Cn;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const vg=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,_g=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class xg{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){const s=new ke,r=t.properties.get(s);r.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Ee({vertexShader:vg,fragmentShader:_g,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new be(new An(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Mg extends Ri{constructor(t,e){super();const n=this;let s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,f=null,d=null,g=null;const S=new xg,p=e.getContextAttributes();let m=null,w=null;const y=[],x=[],L=new ut;let D=null;const A=new nn;A.layers.enable(1),A.viewport=new oe;const I=new nn;I.layers.enable(2),I.viewport=new oe;const z=[A,I],_=new mg;_.layers.enable(1),_.layers.enable(2);let E=null,k=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(rt){let dt=y[rt];return dt===void 0&&(dt=new Ro,y[rt]=dt),dt.getTargetRaySpace()},this.getControllerGrip=function(rt){let dt=y[rt];return dt===void 0&&(dt=new Ro,y[rt]=dt),dt.getGripSpace()},this.getHand=function(rt){let dt=y[rt];return dt===void 0&&(dt=new Ro,y[rt]=dt),dt.getHandSpace()};function q(rt){const dt=x.indexOf(rt.inputSource);if(dt===-1)return;const wt=y[dt];wt!==void 0&&(wt.update(rt.inputSource,rt.frame,c||o),wt.dispatchEvent({type:rt.type,data:rt.inputSource}))}function K(){s.removeEventListener("select",q),s.removeEventListener("selectstart",q),s.removeEventListener("selectend",q),s.removeEventListener("squeeze",q),s.removeEventListener("squeezestart",q),s.removeEventListener("squeezeend",q),s.removeEventListener("end",K),s.removeEventListener("inputsourceschange",tt);for(let rt=0;rt<y.length;rt++){const dt=x[rt];dt!==null&&(x[rt]=null,y[rt].disconnect(dt))}E=null,k=null,S.reset(),t.setRenderTarget(m),d=null,f=null,u=null,s=null,w=null,qt.stop(),n.isPresenting=!1,t.setPixelRatio(D),t.setSize(L.width,L.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(rt){r=rt,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(rt){a=rt,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(rt){c=rt},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(rt){if(s=rt,s!==null){if(m=t.getRenderTarget(),s.addEventListener("select",q),s.addEventListener("selectstart",q),s.addEventListener("selectend",q),s.addEventListener("squeeze",q),s.addEventListener("squeezestart",q),s.addEventListener("squeezeend",q),s.addEventListener("end",K),s.addEventListener("inputsourceschange",tt),p.xrCompatible!==!0&&await e.makeXRCompatible(),D=t.getPixelRatio(),t.getSize(L),s.renderState.layers===void 0){const dt={antialias:p.antialias,alpha:!0,depth:p.depth,stencil:p.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(s,e,dt),s.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),w=new on(d.framebufferWidth,d.framebufferHeight,{format:Tn,type:$n,colorSpace:t.outputColorSpace,stencilBuffer:p.stencil})}else{let dt=null,wt=null,_t=null;p.depth&&(_t=p.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,dt=p.stencil?cs:is,wt=p.stencil?ls:Ai);const zt={colorFormat:e.RGBA8,depthFormat:_t,scaleFactor:r};u=new XRWebGLBinding(s,e),f=u.createProjectionLayer(zt),s.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),w=new on(f.textureWidth,f.textureHeight,{format:Tn,type:$n,depthTexture:new yh(f.textureWidth,f.textureHeight,wt,void 0,void 0,void 0,void 0,void 0,void 0,dt),stencilBuffer:p.stencil,colorSpace:t.outputColorSpace,samples:p.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1})}w.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),qt.setContext(s),qt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return S.getDepthTexture()};function tt(rt){for(let dt=0;dt<rt.removed.length;dt++){const wt=rt.removed[dt],_t=x.indexOf(wt);_t>=0&&(x[_t]=null,y[_t].disconnect(wt))}for(let dt=0;dt<rt.added.length;dt++){const wt=rt.added[dt];let _t=x.indexOf(wt);if(_t===-1){for(let Ot=0;Ot<y.length;Ot++)if(Ot>=x.length){x.push(wt),_t=Ot;break}else if(x[Ot]===null){x[Ot]=wt,_t=Ot;break}if(_t===-1)break}const zt=y[_t];zt&&zt.connect(wt)}}const Z=new P,lt=new P;function Q(rt,dt,wt){Z.setFromMatrixPosition(dt.matrixWorld),lt.setFromMatrixPosition(wt.matrixWorld);const _t=Z.distanceTo(lt),zt=dt.projectionMatrix.elements,Ot=wt.projectionMatrix.elements,C=zt[14]/(zt[10]-1),F=zt[14]/(zt[10]+1),R=(zt[9]+1)/zt[5],M=(zt[9]-1)/zt[5],H=(zt[8]-1)/zt[0],N=(Ot[8]+1)/Ot[0],O=C*H,Y=C*N,it=_t/(-H+N),et=it*-H;if(dt.matrixWorld.decompose(rt.position,rt.quaternion,rt.scale),rt.translateX(et),rt.translateZ(it),rt.matrixWorld.compose(rt.position,rt.quaternion,rt.scale),rt.matrixWorldInverse.copy(rt.matrixWorld).invert(),zt[10]===-1)rt.projectionMatrix.copy(dt.projectionMatrix),rt.projectionMatrixInverse.copy(dt.projectionMatrixInverse);else{const b=C+it,v=F+it,U=O-et,B=Y+(_t-et),j=R*F/v*b,W=M*F/v*b;rt.projectionMatrix.makePerspective(U,B,j,W,b,v),rt.projectionMatrixInverse.copy(rt.projectionMatrix).invert()}}function xt(rt,dt){dt===null?rt.matrixWorld.copy(rt.matrix):rt.matrixWorld.multiplyMatrices(dt.matrixWorld,rt.matrix),rt.matrixWorldInverse.copy(rt.matrixWorld).invert()}this.updateCamera=function(rt){if(s===null)return;let dt=rt.near,wt=rt.far;S.texture!==null&&(S.depthNear>0&&(dt=S.depthNear),S.depthFar>0&&(wt=S.depthFar)),_.near=I.near=A.near=dt,_.far=I.far=A.far=wt,(E!==_.near||k!==_.far)&&(s.updateRenderState({depthNear:_.near,depthFar:_.far}),E=_.near,k=_.far);const _t=rt.parent,zt=_.cameras;xt(_,_t);for(let Ot=0;Ot<zt.length;Ot++)xt(zt[Ot],_t);zt.length===2?Q(_,A,I):_.projectionMatrix.copy(A.projectionMatrix),yt(rt,_,_t)};function yt(rt,dt,wt){wt===null?rt.matrix.copy(dt.matrixWorld):(rt.matrix.copy(wt.matrixWorld),rt.matrix.invert(),rt.matrix.multiply(dt.matrixWorld)),rt.matrix.decompose(rt.position,rt.quaternion,rt.scale),rt.updateMatrixWorld(!0),rt.projectionMatrix.copy(dt.projectionMatrix),rt.projectionMatrixInverse.copy(dt.projectionMatrixInverse),rt.isPerspectiveCamera&&(rt.fov=Ns*2*Math.atan(1/rt.projectionMatrix.elements[5]),rt.zoom=1)}this.getCamera=function(){return _},this.getFoveation=function(){if(!(f===null&&d===null))return l},this.setFoveation=function(rt){l=rt,f!==null&&(f.fixedFoveation=rt),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=rt)},this.hasDepthSensing=function(){return S.texture!==null},this.getDepthSensingMesh=function(){return S.getMesh(_)};let pt=null;function Bt(rt,dt){if(h=dt.getViewerPose(c||o),g=dt,h!==null){const wt=h.views;d!==null&&(t.setRenderTargetFramebuffer(w,d.framebuffer),t.setRenderTarget(w));let _t=!1;wt.length!==_.cameras.length&&(_.cameras.length=0,_t=!0);for(let Ot=0;Ot<wt.length;Ot++){const C=wt[Ot];let F=null;if(d!==null)F=d.getViewport(C);else{const M=u.getViewSubImage(f,C);F=M.viewport,Ot===0&&(t.setRenderTargetTextures(w,M.colorTexture,f.ignoreDepthValues?void 0:M.depthStencilTexture),t.setRenderTarget(w))}let R=z[Ot];R===void 0&&(R=new nn,R.layers.enable(Ot),R.viewport=new oe,z[Ot]=R),R.matrix.fromArray(C.transform.matrix),R.matrix.decompose(R.position,R.quaternion,R.scale),R.projectionMatrix.fromArray(C.projectionMatrix),R.projectionMatrixInverse.copy(R.projectionMatrix).invert(),R.viewport.set(F.x,F.y,F.width,F.height),Ot===0&&(_.matrix.copy(R.matrix),_.matrix.decompose(_.position,_.quaternion,_.scale)),_t===!0&&_.cameras.push(R)}const zt=s.enabledFeatures;if(zt&&zt.includes("depth-sensing")){const Ot=u.getDepthInformation(wt[0]);Ot&&Ot.isValid&&Ot.texture&&S.init(t,Ot,s.renderState)}}for(let wt=0;wt<y.length;wt++){const _t=x[wt],zt=y[wt];_t!==null&&zt!==void 0&&zt.update(_t,dt,c||o)}pt&&pt(rt,dt),dt.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:dt}),g=null}const qt=new Mh;qt.setAnimationLoop(Bt),this.setAnimationLoop=function(rt){pt=rt},this.dispose=function(){}}}const yi=new Dn,yg=new se;function Sg(i,t){function e(p,m){p.matrixAutoUpdate===!0&&p.updateMatrix(),m.value.copy(p.matrix)}function n(p,m){m.color.getRGB(p.fogColor.value,_h(i)),m.isFog?(p.fogNear.value=m.near,p.fogFar.value=m.far):m.isFogExp2&&(p.fogDensity.value=m.density)}function s(p,m,w,y,x){m.isMeshBasicMaterial||m.isMeshLambertMaterial?r(p,m):m.isMeshToonMaterial?(r(p,m),u(p,m)):m.isMeshPhongMaterial?(r(p,m),h(p,m)):m.isMeshStandardMaterial?(r(p,m),f(p,m),m.isMeshPhysicalMaterial&&d(p,m,x)):m.isMeshMatcapMaterial?(r(p,m),g(p,m)):m.isMeshDepthMaterial?r(p,m):m.isMeshDistanceMaterial?(r(p,m),S(p,m)):m.isMeshNormalMaterial?r(p,m):m.isLineBasicMaterial?(o(p,m),m.isLineDashedMaterial&&a(p,m)):m.isPointsMaterial?l(p,m,w,y):m.isSpriteMaterial?c(p,m):m.isShadowMaterial?(p.color.value.copy(m.color),p.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(p,m){p.opacity.value=m.opacity,m.color&&p.diffuse.value.copy(m.color),m.emissive&&p.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(p.map.value=m.map,e(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.bumpMap&&(p.bumpMap.value=m.bumpMap,e(m.bumpMap,p.bumpMapTransform),p.bumpScale.value=m.bumpScale,m.side===Be&&(p.bumpScale.value*=-1)),m.normalMap&&(p.normalMap.value=m.normalMap,e(m.normalMap,p.normalMapTransform),p.normalScale.value.copy(m.normalScale),m.side===Be&&p.normalScale.value.negate()),m.displacementMap&&(p.displacementMap.value=m.displacementMap,e(m.displacementMap,p.displacementMapTransform),p.displacementScale.value=m.displacementScale,p.displacementBias.value=m.displacementBias),m.emissiveMap&&(p.emissiveMap.value=m.emissiveMap,e(m.emissiveMap,p.emissiveMapTransform)),m.specularMap&&(p.specularMap.value=m.specularMap,e(m.specularMap,p.specularMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest);const w=t.get(m),y=w.envMap,x=w.envMapRotation;y&&(p.envMap.value=y,yi.copy(x),yi.x*=-1,yi.y*=-1,yi.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(yi.y*=-1,yi.z*=-1),p.envMapRotation.value.setFromMatrix4(yg.makeRotationFromEuler(yi)),p.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=m.reflectivity,p.ior.value=m.ior,p.refractionRatio.value=m.refractionRatio),m.lightMap&&(p.lightMap.value=m.lightMap,p.lightMapIntensity.value=m.lightMapIntensity,e(m.lightMap,p.lightMapTransform)),m.aoMap&&(p.aoMap.value=m.aoMap,p.aoMapIntensity.value=m.aoMapIntensity,e(m.aoMap,p.aoMapTransform))}function o(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,m.map&&(p.map.value=m.map,e(m.map,p.mapTransform))}function a(p,m){p.dashSize.value=m.dashSize,p.totalSize.value=m.dashSize+m.gapSize,p.scale.value=m.scale}function l(p,m,w,y){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.size.value=m.size*w,p.scale.value=y*.5,m.map&&(p.map.value=m.map,e(m.map,p.uvTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function c(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.rotation.value=m.rotation,m.map&&(p.map.value=m.map,e(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function h(p,m){p.specular.value.copy(m.specular),p.shininess.value=Math.max(m.shininess,1e-4)}function u(p,m){m.gradientMap&&(p.gradientMap.value=m.gradientMap)}function f(p,m){p.metalness.value=m.metalness,m.metalnessMap&&(p.metalnessMap.value=m.metalnessMap,e(m.metalnessMap,p.metalnessMapTransform)),p.roughness.value=m.roughness,m.roughnessMap&&(p.roughnessMap.value=m.roughnessMap,e(m.roughnessMap,p.roughnessMapTransform)),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)}function d(p,m,w){p.ior.value=m.ior,m.sheen>0&&(p.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),p.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(p.sheenColorMap.value=m.sheenColorMap,e(m.sheenColorMap,p.sheenColorMapTransform)),m.sheenRoughnessMap&&(p.sheenRoughnessMap.value=m.sheenRoughnessMap,e(m.sheenRoughnessMap,p.sheenRoughnessMapTransform))),m.clearcoat>0&&(p.clearcoat.value=m.clearcoat,p.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(p.clearcoatMap.value=m.clearcoatMap,e(m.clearcoatMap,p.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,e(m.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(p.clearcoatNormalMap.value=m.clearcoatNormalMap,e(m.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===Be&&p.clearcoatNormalScale.value.negate())),m.dispersion>0&&(p.dispersion.value=m.dispersion),m.iridescence>0&&(p.iridescence.value=m.iridescence,p.iridescenceIOR.value=m.iridescenceIOR,p.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(p.iridescenceMap.value=m.iridescenceMap,e(m.iridescenceMap,p.iridescenceMapTransform)),m.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=m.iridescenceThicknessMap,e(m.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),m.transmission>0&&(p.transmission.value=m.transmission,p.transmissionSamplerMap.value=w.texture,p.transmissionSamplerSize.value.set(w.width,w.height),m.transmissionMap&&(p.transmissionMap.value=m.transmissionMap,e(m.transmissionMap,p.transmissionMapTransform)),p.thickness.value=m.thickness,m.thicknessMap&&(p.thicknessMap.value=m.thicknessMap,e(m.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=m.attenuationDistance,p.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(p.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(p.anisotropyMap.value=m.anisotropyMap,e(m.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=m.specularIntensity,p.specularColor.value.copy(m.specularColor),m.specularColorMap&&(p.specularColorMap.value=m.specularColorMap,e(m.specularColorMap,p.specularColorMapTransform)),m.specularIntensityMap&&(p.specularIntensityMap.value=m.specularIntensityMap,e(m.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,m){m.matcap&&(p.matcap.value=m.matcap)}function S(p,m){const w=t.get(m).light;p.referencePosition.value.setFromMatrixPosition(w.matrixWorld),p.nearDistance.value=w.shadow.camera.near,p.farDistance.value=w.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function bg(i,t,e,n){let s={},r={},o=[];const a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(w,y){const x=y.program;n.uniformBlockBinding(w,x)}function c(w,y){let x=s[w.id];x===void 0&&(g(w),x=h(w),s[w.id]=x,w.addEventListener("dispose",p));const L=y.program;n.updateUBOMapping(w,L);const D=t.render.frame;r[w.id]!==D&&(f(w),r[w.id]=D)}function h(w){const y=u();w.__bindingPointIndex=y;const x=i.createBuffer(),L=w.__size,D=w.usage;return i.bindBuffer(i.UNIFORM_BUFFER,x),i.bufferData(i.UNIFORM_BUFFER,L,D),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,y,x),x}function u(){for(let w=0;w<a;w++)if(o.indexOf(w)===-1)return o.push(w),w;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(w){const y=s[w.id],x=w.uniforms,L=w.__cache;i.bindBuffer(i.UNIFORM_BUFFER,y);for(let D=0,A=x.length;D<A;D++){const I=Array.isArray(x[D])?x[D]:[x[D]];for(let z=0,_=I.length;z<_;z++){const E=I[z];if(d(E,D,z,L)===!0){const k=E.__offset,q=Array.isArray(E.value)?E.value:[E.value];let K=0;for(let tt=0;tt<q.length;tt++){const Z=q[tt],lt=S(Z);typeof Z=="number"||typeof Z=="boolean"?(E.__data[0]=Z,i.bufferSubData(i.UNIFORM_BUFFER,k+K,E.__data)):Z.isMatrix3?(E.__data[0]=Z.elements[0],E.__data[1]=Z.elements[1],E.__data[2]=Z.elements[2],E.__data[3]=0,E.__data[4]=Z.elements[3],E.__data[5]=Z.elements[4],E.__data[6]=Z.elements[5],E.__data[7]=0,E.__data[8]=Z.elements[6],E.__data[9]=Z.elements[7],E.__data[10]=Z.elements[8],E.__data[11]=0):(Z.toArray(E.__data,K),K+=lt.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,k,E.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function d(w,y,x,L){const D=w.value,A=y+"_"+x;if(L[A]===void 0)return typeof D=="number"||typeof D=="boolean"?L[A]=D:L[A]=D.clone(),!0;{const I=L[A];if(typeof D=="number"||typeof D=="boolean"){if(I!==D)return L[A]=D,!0}else if(I.equals(D)===!1)return I.copy(D),!0}return!1}function g(w){const y=w.uniforms;let x=0;const L=16;for(let A=0,I=y.length;A<I;A++){const z=Array.isArray(y[A])?y[A]:[y[A]];for(let _=0,E=z.length;_<E;_++){const k=z[_],q=Array.isArray(k.value)?k.value:[k.value];for(let K=0,tt=q.length;K<tt;K++){const Z=q[K],lt=S(Z),Q=x%L,xt=Q%lt.boundary,yt=Q+xt;x+=xt,yt!==0&&L-yt<lt.storage&&(x+=L-yt),k.__data=new Float32Array(lt.storage/Float32Array.BYTES_PER_ELEMENT),k.__offset=x,x+=lt.storage}}}const D=x%L;return D>0&&(x+=L-D),w.__size=x,w.__cache={},this}function S(w){const y={boundary:0,storage:0};return typeof w=="number"||typeof w=="boolean"?(y.boundary=4,y.storage=4):w.isVector2?(y.boundary=8,y.storage=8):w.isVector3||w.isColor?(y.boundary=16,y.storage=12):w.isVector4?(y.boundary=16,y.storage=16):w.isMatrix3?(y.boundary=48,y.storage=48):w.isMatrix4?(y.boundary=64,y.storage=64):w.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",w),y}function p(w){const y=w.target;y.removeEventListener("dispose",p);const x=o.indexOf(y.__bindingPointIndex);o.splice(x,1),i.deleteBuffer(s[y.id]),delete s[y.id],delete r[y.id]}function m(){for(const w in s)i.deleteBuffer(s[w]);o=[],s={},r={}}return{bind:l,update:c,dispose:m}}class Eg{constructor(t={}){const{canvas:e=uf(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=t;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=o;const d=new Uint32Array(4),g=new Int32Array(4);let S=null,p=null;const m=[],w=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=yn,this.toneMapping=Kn,this.toneMappingExposure=1;const y=this;let x=!1,L=0,D=0,A=null,I=-1,z=null;const _=new oe,E=new oe;let k=null;const q=new Wt(0);let K=0,tt=e.width,Z=e.height,lt=1,Q=null,xt=null;const yt=new oe(0,0,tt,Z),pt=new oe(0,0,tt,Z);let Bt=!1;const qt=new qa;let rt=!1,dt=!1;const wt=new se,_t=new se,zt=new P,Ot=new oe,C={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let F=!1;function R(){return A===null?lt:1}let M=n;function H(T,G){return e.getContext(T,G)}try{const T={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Ua}`),e.addEventListener("webglcontextlost",ft,!1),e.addEventListener("webglcontextrestored",bt,!1),e.addEventListener("webglcontextcreationerror",Tt,!1),M===null){const G="webgl2";if(M=H(G,T),M===null)throw H(G)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(T){throw console.error("THREE.WebGLRenderer: "+T.message),T}let N,O,Y,it,et,b,v,U,B,j,W,ht,ct,ot,Ct,st,gt,Rt,Dt,vt,kt,Ft,Kt,V;function Et(){N=new Rm(M),N.init(),Ft=new pg(M,N),O=new bm(M,N,t,Ft),Y=new ug(M),O.reverseDepthBuffer&&Y.buffers.depth.setReversed(!0),it=new Lm(M),et=new K0,b=new dg(M,N,Y,et,O,Ft,it),v=new wm(y),U=new Cm(y),B=new Bf(M),Kt=new ym(M,B),j=new Pm(M,B,it,Kt),W=new Um(M,j,B,it),Dt=new Im(M,O,b),st=new Em(et),ht=new Z0(y,v,U,N,O,Kt,st),ct=new Sg(y,et),ot=new J0,Ct=new sg(N),Rt=new Mm(y,v,U,Y,W,f,l),gt=new cg(y,W,O),V=new bg(M,it,O,Y),vt=new Sm(M,N,it),kt=new Dm(M,N,it),it.programs=ht.programs,y.capabilities=O,y.extensions=N,y.properties=et,y.renderLists=ot,y.shadowMap=gt,y.state=Y,y.info=it}Et();const nt=new Mg(y,M);this.xr=nt,this.getContext=function(){return M},this.getContextAttributes=function(){return M.getContextAttributes()},this.forceContextLoss=function(){const T=N.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=N.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return lt},this.setPixelRatio=function(T){T!==void 0&&(lt=T,this.setSize(tt,Z,!1))},this.getSize=function(T){return T.set(tt,Z)},this.setSize=function(T,G,$=!0){if(nt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}tt=T,Z=G,e.width=Math.floor(T*lt),e.height=Math.floor(G*lt),$===!0&&(e.style.width=T+"px",e.style.height=G+"px"),this.setViewport(0,0,T,G)},this.getDrawingBufferSize=function(T){return T.set(tt*lt,Z*lt).floor()},this.setDrawingBufferSize=function(T,G,$){tt=T,Z=G,lt=$,e.width=Math.floor(T*$),e.height=Math.floor(G*$),this.setViewport(0,0,T,G)},this.getCurrentViewport=function(T){return T.copy(_)},this.getViewport=function(T){return T.copy(yt)},this.setViewport=function(T,G,$,J){T.isVector4?yt.set(T.x,T.y,T.z,T.w):yt.set(T,G,$,J),Y.viewport(_.copy(yt).multiplyScalar(lt).round())},this.getScissor=function(T){return T.copy(pt)},this.setScissor=function(T,G,$,J){T.isVector4?pt.set(T.x,T.y,T.z,T.w):pt.set(T,G,$,J),Y.scissor(E.copy(pt).multiplyScalar(lt).round())},this.getScissorTest=function(){return Bt},this.setScissorTest=function(T){Y.setScissorTest(Bt=T)},this.setOpaqueSort=function(T){Q=T},this.setTransparentSort=function(T){xt=T},this.getClearColor=function(T){return T.copy(Rt.getClearColor())},this.setClearColor=function(){Rt.setClearColor.apply(Rt,arguments)},this.getClearAlpha=function(){return Rt.getClearAlpha()},this.setClearAlpha=function(){Rt.setClearAlpha.apply(Rt,arguments)},this.clear=function(T=!0,G=!0,$=!0){let J=0;if(T){let X=!1;if(A!==null){const mt=A.texture.format;X=mt===Ha||mt===ka||mt===Ba}if(X){const mt=A.texture.type,At=mt===$n||mt===Ai||mt===Us||mt===ls||mt===Fa||mt===Oa,Lt=Rt.getClearColor(),It=Rt.getClearAlpha(),Ht=Lt.r,Vt=Lt.g,Ut=Lt.b;At?(d[0]=Ht,d[1]=Vt,d[2]=Ut,d[3]=It,M.clearBufferuiv(M.COLOR,0,d)):(g[0]=Ht,g[1]=Vt,g[2]=Ut,g[3]=It,M.clearBufferiv(M.COLOR,0,g))}else J|=M.COLOR_BUFFER_BIT}G&&(J|=M.DEPTH_BUFFER_BIT,M.clearDepth(this.capabilities.reverseDepthBuffer?0:1)),$&&(J|=M.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),M.clear(J)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",ft,!1),e.removeEventListener("webglcontextrestored",bt,!1),e.removeEventListener("webglcontextcreationerror",Tt,!1),ot.dispose(),Ct.dispose(),et.dispose(),v.dispose(),U.dispose(),W.dispose(),Kt.dispose(),V.dispose(),ht.dispose(),nt.dispose(),nt.removeEventListener("sessionstart",ll),nt.removeEventListener("sessionend",cl),mi.stop()};function ft(T){T.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),x=!0}function bt(){console.log("THREE.WebGLRenderer: Context Restored."),x=!1;const T=it.autoReset,G=gt.enabled,$=gt.autoUpdate,J=gt.needsUpdate,X=gt.type;Et(),it.autoReset=T,gt.enabled=G,gt.autoUpdate=$,gt.needsUpdate=J,gt.type=X}function Tt(T){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function jt(T){const G=T.target;G.removeEventListener("dispose",jt),Me(G)}function Me(T){We(T),et.remove(T)}function We(T){const G=et.get(T).programs;G!==void 0&&(G.forEach(function($){ht.releaseProgram($)}),T.isShaderMaterial&&ht.releaseShaderCache(T))}this.renderBufferDirect=function(T,G,$,J,X,mt){G===null&&(G=C);const At=X.isMesh&&X.matrixWorld.determinant()<0,Lt=su(T,G,$,J,X);Y.setMaterial(J,At);let It=$.index,Ht=1;if(J.wireframe===!0){if(It=j.getWireframeAttribute($),It===void 0)return;Ht=2}const Vt=$.drawRange,Ut=$.attributes.position;let ie=Vt.start*Ht,he=(Vt.start+Vt.count)*Ht;mt!==null&&(ie=Math.max(ie,mt.start*Ht),he=Math.min(he,(mt.start+mt.count)*Ht)),It!==null?(ie=Math.max(ie,0),he=Math.min(he,It.count)):Ut!=null&&(ie=Math.max(ie,0),he=Math.min(he,Ut.count));const me=he-ie;if(me<0||me===1/0)return;Kt.setup(X,J,Lt,$,It);let $e,te=vt;if(It!==null&&($e=B.get(It),te=kt,te.setIndex($e)),X.isMesh)J.wireframe===!0?(Y.setLineWidth(J.wireframeLinewidth*R()),te.setMode(M.LINES)):te.setMode(M.TRIANGLES);else if(X.isLine){let Nt=J.linewidth;Nt===void 0&&(Nt=1),Y.setLineWidth(Nt*R()),X.isLineSegments?te.setMode(M.LINES):X.isLineLoop?te.setMode(M.LINE_LOOP):te.setMode(M.LINE_STRIP)}else X.isPoints?te.setMode(M.POINTS):X.isSprite&&te.setMode(M.TRIANGLES);if(X.isBatchedMesh)if(X._multiDrawInstances!==null)te.renderMultiDrawInstances(X._multiDrawStarts,X._multiDrawCounts,X._multiDrawCount,X._multiDrawInstances);else if(N.get("WEBGL_multi_draw"))te.renderMultiDraw(X._multiDrawStarts,X._multiDrawCounts,X._multiDrawCount);else{const Nt=X._multiDrawStarts,Ie=X._multiDrawCounts,ee=X._multiDrawCount,gn=It?B.get(It).bytesPerElement:1,Li=et.get(J).currentProgram.getUniforms();for(let Je=0;Je<ee;Je++)Li.setValue(M,"_gl_DrawID",Je),te.render(Nt[Je]/gn,Ie[Je])}else if(X.isInstancedMesh)te.renderInstances(ie,me,X.count);else if($.isInstancedBufferGeometry){const Nt=$._maxInstanceCount!==void 0?$._maxInstanceCount:1/0,Ie=Math.min($.instanceCount,Nt);te.renderInstances(ie,me,Ie)}else te.render(ie,me)};function Jt(T,G,$){T.transparent===!0&&T.side===sn&&T.forceSinglePass===!1?(T.side=Be,T.needsUpdate=!0,Gs(T,G,$),T.side=pi,T.needsUpdate=!0,Gs(T,G,$),T.side=sn):Gs(T,G,$)}this.compile=function(T,G,$=null){$===null&&($=T),p=Ct.get($),p.init(G),w.push(p),$.traverseVisible(function(X){X.isLight&&X.layers.test(G.layers)&&(p.pushLight(X),X.castShadow&&p.pushShadow(X))}),T!==$&&T.traverseVisible(function(X){X.isLight&&X.layers.test(G.layers)&&(p.pushLight(X),X.castShadow&&p.pushShadow(X))}),p.setupLights();const J=new Set;return T.traverse(function(X){if(!(X.isMesh||X.isPoints||X.isLine||X.isSprite))return;const mt=X.material;if(mt)if(Array.isArray(mt))for(let At=0;At<mt.length;At++){const Lt=mt[At];Jt(Lt,$,X),J.add(Lt)}else Jt(mt,$,X),J.add(mt)}),w.pop(),p=null,J},this.compileAsync=function(T,G,$=null){const J=this.compile(T,G,$);return new Promise(X=>{function mt(){if(J.forEach(function(At){et.get(At).currentProgram.isReady()&&J.delete(At)}),J.size===0){X(T);return}setTimeout(mt,10)}N.get("KHR_parallel_shader_compile")!==null?mt():setTimeout(mt,10)})};let Xe=null;function Fn(T){Xe&&Xe(T)}function ll(){mi.stop()}function cl(){mi.start()}const mi=new Mh;mi.setAnimationLoop(Fn),typeof self<"u"&&mi.setContext(self),this.setAnimationLoop=function(T){Xe=T,nt.setAnimationLoop(T),T===null?mi.stop():mi.start()},nt.addEventListener("sessionstart",ll),nt.addEventListener("sessionend",cl),this.render=function(T,G){if(G!==void 0&&G.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(x===!0)return;if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),G.parent===null&&G.matrixWorldAutoUpdate===!0&&G.updateMatrixWorld(),nt.enabled===!0&&nt.isPresenting===!0&&(nt.cameraAutoUpdate===!0&&nt.updateCamera(G),G=nt.getCamera()),T.isScene===!0&&T.onBeforeRender(y,T,G,A),p=Ct.get(T,w.length),p.init(G),w.push(p),_t.multiplyMatrices(G.projectionMatrix,G.matrixWorldInverse),qt.setFromProjectionMatrix(_t),dt=this.localClippingEnabled,rt=st.init(this.clippingPlanes,dt),S=ot.get(T,m.length),S.init(),m.push(S),nt.enabled===!0&&nt.isPresenting===!0){const mt=y.xr.getDepthSensingMesh();mt!==null&&Kr(mt,G,-1/0,y.sortObjects)}Kr(T,G,0,y.sortObjects),S.finish(),y.sortObjects===!0&&S.sort(Q,xt),F=nt.enabled===!1||nt.isPresenting===!1||nt.hasDepthSensing()===!1,F&&Rt.addToRenderList(S,T),this.info.render.frame++,rt===!0&&st.beginShadows();const $=p.state.shadowsArray;gt.render($,T,G),rt===!0&&st.endShadows(),this.info.autoReset===!0&&this.info.reset();const J=S.opaque,X=S.transmissive;if(p.setupLights(),G.isArrayCamera){const mt=G.cameras;if(X.length>0)for(let At=0,Lt=mt.length;At<Lt;At++){const It=mt[At];ul(J,X,T,It)}F&&Rt.render(T);for(let At=0,Lt=mt.length;At<Lt;At++){const It=mt[At];hl(S,T,It,It.viewport)}}else X.length>0&&ul(J,X,T,G),F&&Rt.render(T),hl(S,T,G);A!==null&&(b.updateMultisampleRenderTarget(A),b.updateRenderTargetMipmap(A)),T.isScene===!0&&T.onAfterRender(y,T,G),Kt.resetDefaultState(),I=-1,z=null,w.pop(),w.length>0?(p=w[w.length-1],rt===!0&&st.setGlobalState(y.clippingPlanes,p.state.camera)):p=null,m.pop(),m.length>0?S=m[m.length-1]:S=null};function Kr(T,G,$,J){if(T.visible===!1)return;if(T.layers.test(G.layers)){if(T.isGroup)$=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(G);else if(T.isLight)p.pushLight(T),T.castShadow&&p.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||qt.intersectsSprite(T)){J&&Ot.setFromMatrixPosition(T.matrixWorld).applyMatrix4(_t);const At=W.update(T),Lt=T.material;Lt.visible&&S.push(T,At,Lt,$,Ot.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||qt.intersectsObject(T))){const At=W.update(T),Lt=T.material;if(J&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),Ot.copy(T.boundingSphere.center)):(At.boundingSphere===null&&At.computeBoundingSphere(),Ot.copy(At.boundingSphere.center)),Ot.applyMatrix4(T.matrixWorld).applyMatrix4(_t)),Array.isArray(Lt)){const It=At.groups;for(let Ht=0,Vt=It.length;Ht<Vt;Ht++){const Ut=It[Ht],ie=Lt[Ut.materialIndex];ie&&ie.visible&&S.push(T,At,ie,$,Ot.z,Ut)}}else Lt.visible&&S.push(T,At,Lt,$,Ot.z,null)}}const mt=T.children;for(let At=0,Lt=mt.length;At<Lt;At++)Kr(mt[At],G,$,J)}function hl(T,G,$,J){const X=T.opaque,mt=T.transmissive,At=T.transparent;p.setupLightsView($),rt===!0&&st.setGlobalState(y.clippingPlanes,$),J&&Y.viewport(_.copy(J)),X.length>0&&Vs(X,G,$),mt.length>0&&Vs(mt,G,$),At.length>0&&Vs(At,G,$),Y.buffers.depth.setTest(!0),Y.buffers.depth.setMask(!0),Y.buffers.color.setMask(!0),Y.setPolygonOffset(!1)}function ul(T,G,$,J){if(($.isScene===!0?$.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[J.id]===void 0&&(p.state.transmissionRenderTarget[J.id]=new on(1,1,{generateMipmaps:!0,type:N.has("EXT_color_buffer_half_float")||N.has("EXT_color_buffer_float")?pn:$n,minFilter:ui,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ne.workingColorSpace}));const mt=p.state.transmissionRenderTarget[J.id],At=J.viewport||_;mt.setSize(At.z,At.w);const Lt=y.getRenderTarget();y.setRenderTarget(mt),y.getClearColor(q),K=y.getClearAlpha(),K<1&&y.setClearColor(16777215,.5),y.clear(),F&&Rt.render($);const It=y.toneMapping;y.toneMapping=Kn;const Ht=J.viewport;if(J.viewport!==void 0&&(J.viewport=void 0),p.setupLightsView(J),rt===!0&&st.setGlobalState(y.clippingPlanes,J),Vs(T,$,J),b.updateMultisampleRenderTarget(mt),b.updateRenderTargetMipmap(mt),N.has("WEBGL_multisampled_render_to_texture")===!1){let Vt=!1;for(let Ut=0,ie=G.length;Ut<ie;Ut++){const he=G[Ut],me=he.object,$e=he.geometry,te=he.material,Nt=he.group;if(te.side===sn&&me.layers.test(J.layers)){const Ie=te.side;te.side=Be,te.needsUpdate=!0,fl(me,$,J,$e,te,Nt),te.side=Ie,te.needsUpdate=!0,Vt=!0}}Vt===!0&&(b.updateMultisampleRenderTarget(mt),b.updateRenderTargetMipmap(mt))}y.setRenderTarget(Lt),y.setClearColor(q,K),Ht!==void 0&&(J.viewport=Ht),y.toneMapping=It}function Vs(T,G,$){const J=G.isScene===!0?G.overrideMaterial:null;for(let X=0,mt=T.length;X<mt;X++){const At=T[X],Lt=At.object,It=At.geometry,Ht=J===null?At.material:J,Vt=At.group;Lt.layers.test($.layers)&&fl(Lt,G,$,It,Ht,Vt)}}function fl(T,G,$,J,X,mt){T.onBeforeRender(y,G,$,J,X,mt),T.modelViewMatrix.multiplyMatrices($.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),X.onBeforeRender(y,G,$,J,T,mt),X.transparent===!0&&X.side===sn&&X.forceSinglePass===!1?(X.side=Be,X.needsUpdate=!0,y.renderBufferDirect($,G,J,X,T,mt),X.side=pi,X.needsUpdate=!0,y.renderBufferDirect($,G,J,X,T,mt),X.side=sn):y.renderBufferDirect($,G,J,X,T,mt),T.onAfterRender(y,G,$,J,X,mt)}function Gs(T,G,$){G.isScene!==!0&&(G=C);const J=et.get(T),X=p.state.lights,mt=p.state.shadowsArray,At=X.state.version,Lt=ht.getParameters(T,X.state,mt,G,$),It=ht.getProgramCacheKey(Lt);let Ht=J.programs;J.environment=T.isMeshStandardMaterial?G.environment:null,J.fog=G.fog,J.envMap=(T.isMeshStandardMaterial?U:v).get(T.envMap||J.environment),J.envMapRotation=J.environment!==null&&T.envMap===null?G.environmentRotation:T.envMapRotation,Ht===void 0&&(T.addEventListener("dispose",jt),Ht=new Map,J.programs=Ht);let Vt=Ht.get(It);if(Vt!==void 0){if(J.currentProgram===Vt&&J.lightsStateVersion===At)return pl(T,Lt),Vt}else Lt.uniforms=ht.getUniforms(T),T.onBeforeCompile(Lt,y),Vt=ht.acquireProgram(Lt,It),Ht.set(It,Vt),J.uniforms=Lt.uniforms;const Ut=J.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(Ut.clippingPlanes=st.uniform),pl(T,Lt),J.needsLights=ou(T),J.lightsStateVersion=At,J.needsLights&&(Ut.ambientLightColor.value=X.state.ambient,Ut.lightProbe.value=X.state.probe,Ut.directionalLights.value=X.state.directional,Ut.directionalLightShadows.value=X.state.directionalShadow,Ut.spotLights.value=X.state.spot,Ut.spotLightShadows.value=X.state.spotShadow,Ut.rectAreaLights.value=X.state.rectArea,Ut.ltc_1.value=X.state.rectAreaLTC1,Ut.ltc_2.value=X.state.rectAreaLTC2,Ut.pointLights.value=X.state.point,Ut.pointLightShadows.value=X.state.pointShadow,Ut.hemisphereLights.value=X.state.hemi,Ut.directionalShadowMap.value=X.state.directionalShadowMap,Ut.directionalShadowMatrix.value=X.state.directionalShadowMatrix,Ut.spotShadowMap.value=X.state.spotShadowMap,Ut.spotLightMatrix.value=X.state.spotLightMatrix,Ut.spotLightMap.value=X.state.spotLightMap,Ut.pointShadowMap.value=X.state.pointShadowMap,Ut.pointShadowMatrix.value=X.state.pointShadowMatrix),J.currentProgram=Vt,J.uniformsList=null,Vt}function dl(T){if(T.uniformsList===null){const G=T.currentProgram.getUniforms();T.uniformsList=Ar.seqWithValue(G.seq,T.uniforms)}return T.uniformsList}function pl(T,G){const $=et.get(T);$.outputColorSpace=G.outputColorSpace,$.batching=G.batching,$.batchingColor=G.batchingColor,$.instancing=G.instancing,$.instancingColor=G.instancingColor,$.instancingMorph=G.instancingMorph,$.skinning=G.skinning,$.morphTargets=G.morphTargets,$.morphNormals=G.morphNormals,$.morphColors=G.morphColors,$.morphTargetsCount=G.morphTargetsCount,$.numClippingPlanes=G.numClippingPlanes,$.numIntersection=G.numClipIntersection,$.vertexAlphas=G.vertexAlphas,$.vertexTangents=G.vertexTangents,$.toneMapping=G.toneMapping}function su(T,G,$,J,X){G.isScene!==!0&&(G=C),b.resetTextureUnits();const mt=G.fog,At=J.isMeshStandardMaterial?G.environment:null,Lt=A===null?y.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:Qn,It=(J.isMeshStandardMaterial?U:v).get(J.envMap||At),Ht=J.vertexColors===!0&&!!$.attributes.color&&$.attributes.color.itemSize===4,Vt=!!$.attributes.tangent&&(!!J.normalMap||J.anisotropy>0),Ut=!!$.morphAttributes.position,ie=!!$.morphAttributes.normal,he=!!$.morphAttributes.color;let me=Kn;J.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(me=y.toneMapping);const $e=$.morphAttributes.position||$.morphAttributes.normal||$.morphAttributes.color,te=$e!==void 0?$e.length:0,Nt=et.get(J),Ie=p.state.lights;if(rt===!0&&(dt===!0||T!==z)){const an=T===z&&J.id===I;st.setState(J,T,an)}let ee=!1;J.version===Nt.__version?(Nt.needsLights&&Nt.lightsStateVersion!==Ie.state.version||Nt.outputColorSpace!==Lt||X.isBatchedMesh&&Nt.batching===!1||!X.isBatchedMesh&&Nt.batching===!0||X.isBatchedMesh&&Nt.batchingColor===!0&&X.colorTexture===null||X.isBatchedMesh&&Nt.batchingColor===!1&&X.colorTexture!==null||X.isInstancedMesh&&Nt.instancing===!1||!X.isInstancedMesh&&Nt.instancing===!0||X.isSkinnedMesh&&Nt.skinning===!1||!X.isSkinnedMesh&&Nt.skinning===!0||X.isInstancedMesh&&Nt.instancingColor===!0&&X.instanceColor===null||X.isInstancedMesh&&Nt.instancingColor===!1&&X.instanceColor!==null||X.isInstancedMesh&&Nt.instancingMorph===!0&&X.morphTexture===null||X.isInstancedMesh&&Nt.instancingMorph===!1&&X.morphTexture!==null||Nt.envMap!==It||J.fog===!0&&Nt.fog!==mt||Nt.numClippingPlanes!==void 0&&(Nt.numClippingPlanes!==st.numPlanes||Nt.numIntersection!==st.numIntersection)||Nt.vertexAlphas!==Ht||Nt.vertexTangents!==Vt||Nt.morphTargets!==Ut||Nt.morphNormals!==ie||Nt.morphColors!==he||Nt.toneMapping!==me||Nt.morphTargetsCount!==te)&&(ee=!0):(ee=!0,Nt.__version=J.version);let gn=Nt.currentProgram;ee===!0&&(gn=Gs(J,G,X));let Li=!1,Je=!1,$r=!1;const _e=gn.getUniforms(),ti=Nt.uniforms;if(Y.useProgram(gn.program)&&(Li=!0,Je=!0,$r=!0),J.id!==I&&(I=J.id,Je=!0),Li||z!==T){O.reverseDepthBuffer?(wt.copy(T.projectionMatrix),df(wt),pf(wt),_e.setValue(M,"projectionMatrix",wt)):_e.setValue(M,"projectionMatrix",T.projectionMatrix),_e.setValue(M,"viewMatrix",T.matrixWorldInverse);const an=_e.map.cameraPosition;an!==void 0&&an.setValue(M,zt.setFromMatrixPosition(T.matrixWorld)),O.logarithmicDepthBuffer&&_e.setValue(M,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(J.isMeshPhongMaterial||J.isMeshToonMaterial||J.isMeshLambertMaterial||J.isMeshBasicMaterial||J.isMeshStandardMaterial||J.isShaderMaterial)&&_e.setValue(M,"isOrthographic",T.isOrthographicCamera===!0),z!==T&&(z=T,Je=!0,$r=!0)}if(X.isSkinnedMesh){_e.setOptional(M,X,"bindMatrix"),_e.setOptional(M,X,"bindMatrixInverse");const an=X.skeleton;an&&(an.boneTexture===null&&an.computeBoneTexture(),_e.setValue(M,"boneTexture",an.boneTexture,b))}X.isBatchedMesh&&(_e.setOptional(M,X,"batchingTexture"),_e.setValue(M,"batchingTexture",X._matricesTexture,b),_e.setOptional(M,X,"batchingIdTexture"),_e.setValue(M,"batchingIdTexture",X._indirectTexture,b),_e.setOptional(M,X,"batchingColorTexture"),X._colorsTexture!==null&&_e.setValue(M,"batchingColorTexture",X._colorsTexture,b));const Jr=$.morphAttributes;if((Jr.position!==void 0||Jr.normal!==void 0||Jr.color!==void 0)&&Dt.update(X,$,gn),(Je||Nt.receiveShadow!==X.receiveShadow)&&(Nt.receiveShadow=X.receiveShadow,_e.setValue(M,"receiveShadow",X.receiveShadow)),J.isMeshGouraudMaterial&&J.envMap!==null&&(ti.envMap.value=It,ti.flipEnvMap.value=It.isCubeTexture&&It.isRenderTargetTexture===!1?-1:1),J.isMeshStandardMaterial&&J.envMap===null&&G.environment!==null&&(ti.envMapIntensity.value=G.environmentIntensity),Je&&(_e.setValue(M,"toneMappingExposure",y.toneMappingExposure),Nt.needsLights&&ru(ti,$r),mt&&J.fog===!0&&ct.refreshFogUniforms(ti,mt),ct.refreshMaterialUniforms(ti,J,lt,Z,p.state.transmissionRenderTarget[T.id]),Ar.upload(M,dl(Nt),ti,b)),J.isShaderMaterial&&J.uniformsNeedUpdate===!0&&(Ar.upload(M,dl(Nt),ti,b),J.uniformsNeedUpdate=!1),J.isSpriteMaterial&&_e.setValue(M,"center",X.center),_e.setValue(M,"modelViewMatrix",X.modelViewMatrix),_e.setValue(M,"normalMatrix",X.normalMatrix),_e.setValue(M,"modelMatrix",X.matrixWorld),J.isShaderMaterial||J.isRawShaderMaterial){const an=J.uniformsGroups;for(let Qr=0,au=an.length;Qr<au;Qr++){const ml=an[Qr];V.update(ml,gn),V.bind(ml,gn)}}return gn}function ru(T,G){T.ambientLightColor.needsUpdate=G,T.lightProbe.needsUpdate=G,T.directionalLights.needsUpdate=G,T.directionalLightShadows.needsUpdate=G,T.pointLights.needsUpdate=G,T.pointLightShadows.needsUpdate=G,T.spotLights.needsUpdate=G,T.spotLightShadows.needsUpdate=G,T.rectAreaLights.needsUpdate=G,T.hemisphereLights.needsUpdate=G}function ou(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return L},this.getActiveMipmapLevel=function(){return D},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(T,G,$){et.get(T.texture).__webglTexture=G,et.get(T.depthTexture).__webglTexture=$;const J=et.get(T);J.__hasExternalTextures=!0,J.__autoAllocateDepthBuffer=$===void 0,J.__autoAllocateDepthBuffer||N.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),J.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(T,G){const $=et.get(T);$.__webglFramebuffer=G,$.__useDefaultFramebuffer=G===void 0},this.setRenderTarget=function(T,G=0,$=0){A=T,L=G,D=$;let J=!0,X=null,mt=!1,At=!1;if(T){const It=et.get(T);if(It.__useDefaultFramebuffer!==void 0)Y.bindFramebuffer(M.FRAMEBUFFER,null),J=!1;else if(It.__webglFramebuffer===void 0)b.setupRenderTarget(T);else if(It.__hasExternalTextures)b.rebindTextures(T,et.get(T.texture).__webglTexture,et.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){const Ut=T.depthTexture;if(It.__boundDepthTexture!==Ut){if(Ut!==null&&et.has(Ut)&&(T.width!==Ut.image.width||T.height!==Ut.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");b.setupDepthRenderbuffer(T)}}const Ht=T.texture;(Ht.isData3DTexture||Ht.isDataArrayTexture||Ht.isCompressedArrayTexture)&&(At=!0);const Vt=et.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(Vt[G])?X=Vt[G][$]:X=Vt[G],mt=!0):T.samples>0&&b.useMultisampledRTT(T)===!1?X=et.get(T).__webglMultisampledFramebuffer:Array.isArray(Vt)?X=Vt[$]:X=Vt,_.copy(T.viewport),E.copy(T.scissor),k=T.scissorTest}else _.copy(yt).multiplyScalar(lt).floor(),E.copy(pt).multiplyScalar(lt).floor(),k=Bt;if(Y.bindFramebuffer(M.FRAMEBUFFER,X)&&J&&Y.drawBuffers(T,X),Y.viewport(_),Y.scissor(E),Y.setScissorTest(k),mt){const It=et.get(T.texture);M.framebufferTexture2D(M.FRAMEBUFFER,M.COLOR_ATTACHMENT0,M.TEXTURE_CUBE_MAP_POSITIVE_X+G,It.__webglTexture,$)}else if(At){const It=et.get(T.texture),Ht=G||0;M.framebufferTextureLayer(M.FRAMEBUFFER,M.COLOR_ATTACHMENT0,It.__webglTexture,$||0,Ht)}I=-1},this.readRenderTargetPixels=function(T,G,$,J,X,mt,At){if(!(T&&T.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Lt=et.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&At!==void 0&&(Lt=Lt[At]),Lt){Y.bindFramebuffer(M.FRAMEBUFFER,Lt);try{const It=T.texture,Ht=It.format,Vt=It.type;if(!O.textureFormatReadable(Ht)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!O.textureTypeReadable(Vt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}G>=0&&G<=T.width-J&&$>=0&&$<=T.height-X&&M.readPixels(G,$,J,X,Ft.convert(Ht),Ft.convert(Vt),mt)}finally{const It=A!==null?et.get(A).__webglFramebuffer:null;Y.bindFramebuffer(M.FRAMEBUFFER,It)}}},this.readRenderTargetPixelsAsync=async function(T,G,$,J,X,mt,At){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Lt=et.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&At!==void 0&&(Lt=Lt[At]),Lt){const It=T.texture,Ht=It.format,Vt=It.type;if(!O.textureFormatReadable(Ht))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!O.textureTypeReadable(Vt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(G>=0&&G<=T.width-J&&$>=0&&$<=T.height-X){Y.bindFramebuffer(M.FRAMEBUFFER,Lt);const Ut=M.createBuffer();M.bindBuffer(M.PIXEL_PACK_BUFFER,Ut),M.bufferData(M.PIXEL_PACK_BUFFER,mt.byteLength,M.STREAM_READ),M.readPixels(G,$,J,X,Ft.convert(Ht),Ft.convert(Vt),0);const ie=A!==null?et.get(A).__webglFramebuffer:null;Y.bindFramebuffer(M.FRAMEBUFFER,ie);const he=M.fenceSync(M.SYNC_GPU_COMMANDS_COMPLETE,0);return M.flush(),await ff(M,he,4),M.bindBuffer(M.PIXEL_PACK_BUFFER,Ut),M.getBufferSubData(M.PIXEL_PACK_BUFFER,0,mt),M.deleteBuffer(Ut),M.deleteSync(he),mt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(T,G=null,$=0){T.isTexture!==!0&&(Tr("WebGLRenderer: copyFramebufferToTexture function signature has changed."),G=arguments[0]||null,T=arguments[1]);const J=Math.pow(2,-$),X=Math.floor(T.image.width*J),mt=Math.floor(T.image.height*J),At=G!==null?G.x:0,Lt=G!==null?G.y:0;b.setTexture2D(T,0),M.copyTexSubImage2D(M.TEXTURE_2D,$,0,0,At,Lt,X,mt),Y.unbindTexture()},this.copyTextureToTexture=function(T,G,$=null,J=null,X=0){T.isTexture!==!0&&(Tr("WebGLRenderer: copyTextureToTexture function signature has changed."),J=arguments[0]||null,T=arguments[1],G=arguments[2],X=arguments[3]||0,$=null);let mt,At,Lt,It,Ht,Vt;$!==null?(mt=$.max.x-$.min.x,At=$.max.y-$.min.y,Lt=$.min.x,It=$.min.y):(mt=T.image.width,At=T.image.height,Lt=0,It=0),J!==null?(Ht=J.x,Vt=J.y):(Ht=0,Vt=0);const Ut=Ft.convert(G.format),ie=Ft.convert(G.type);b.setTexture2D(G,0),M.pixelStorei(M.UNPACK_FLIP_Y_WEBGL,G.flipY),M.pixelStorei(M.UNPACK_PREMULTIPLY_ALPHA_WEBGL,G.premultiplyAlpha),M.pixelStorei(M.UNPACK_ALIGNMENT,G.unpackAlignment);const he=M.getParameter(M.UNPACK_ROW_LENGTH),me=M.getParameter(M.UNPACK_IMAGE_HEIGHT),$e=M.getParameter(M.UNPACK_SKIP_PIXELS),te=M.getParameter(M.UNPACK_SKIP_ROWS),Nt=M.getParameter(M.UNPACK_SKIP_IMAGES),Ie=T.isCompressedTexture?T.mipmaps[X]:T.image;M.pixelStorei(M.UNPACK_ROW_LENGTH,Ie.width),M.pixelStorei(M.UNPACK_IMAGE_HEIGHT,Ie.height),M.pixelStorei(M.UNPACK_SKIP_PIXELS,Lt),M.pixelStorei(M.UNPACK_SKIP_ROWS,It),T.isDataTexture?M.texSubImage2D(M.TEXTURE_2D,X,Ht,Vt,mt,At,Ut,ie,Ie.data):T.isCompressedTexture?M.compressedTexSubImage2D(M.TEXTURE_2D,X,Ht,Vt,Ie.width,Ie.height,Ut,Ie.data):M.texSubImage2D(M.TEXTURE_2D,X,Ht,Vt,mt,At,Ut,ie,Ie),M.pixelStorei(M.UNPACK_ROW_LENGTH,he),M.pixelStorei(M.UNPACK_IMAGE_HEIGHT,me),M.pixelStorei(M.UNPACK_SKIP_PIXELS,$e),M.pixelStorei(M.UNPACK_SKIP_ROWS,te),M.pixelStorei(M.UNPACK_SKIP_IMAGES,Nt),X===0&&G.generateMipmaps&&M.generateMipmap(M.TEXTURE_2D),Y.unbindTexture()},this.copyTextureToTexture3D=function(T,G,$=null,J=null,X=0){T.isTexture!==!0&&(Tr("WebGLRenderer: copyTextureToTexture3D function signature has changed."),$=arguments[0]||null,J=arguments[1]||null,T=arguments[2],G=arguments[3],X=arguments[4]||0);let mt,At,Lt,It,Ht,Vt,Ut,ie,he;const me=T.isCompressedTexture?T.mipmaps[X]:T.image;$!==null?(mt=$.max.x-$.min.x,At=$.max.y-$.min.y,Lt=$.max.z-$.min.z,It=$.min.x,Ht=$.min.y,Vt=$.min.z):(mt=me.width,At=me.height,Lt=me.depth,It=0,Ht=0,Vt=0),J!==null?(Ut=J.x,ie=J.y,he=J.z):(Ut=0,ie=0,he=0);const $e=Ft.convert(G.format),te=Ft.convert(G.type);let Nt;if(G.isData3DTexture)b.setTexture3D(G,0),Nt=M.TEXTURE_3D;else if(G.isDataArrayTexture||G.isCompressedArrayTexture)b.setTexture2DArray(G,0),Nt=M.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}M.pixelStorei(M.UNPACK_FLIP_Y_WEBGL,G.flipY),M.pixelStorei(M.UNPACK_PREMULTIPLY_ALPHA_WEBGL,G.premultiplyAlpha),M.pixelStorei(M.UNPACK_ALIGNMENT,G.unpackAlignment);const Ie=M.getParameter(M.UNPACK_ROW_LENGTH),ee=M.getParameter(M.UNPACK_IMAGE_HEIGHT),gn=M.getParameter(M.UNPACK_SKIP_PIXELS),Li=M.getParameter(M.UNPACK_SKIP_ROWS),Je=M.getParameter(M.UNPACK_SKIP_IMAGES);M.pixelStorei(M.UNPACK_ROW_LENGTH,me.width),M.pixelStorei(M.UNPACK_IMAGE_HEIGHT,me.height),M.pixelStorei(M.UNPACK_SKIP_PIXELS,It),M.pixelStorei(M.UNPACK_SKIP_ROWS,Ht),M.pixelStorei(M.UNPACK_SKIP_IMAGES,Vt),T.isDataTexture||T.isData3DTexture?M.texSubImage3D(Nt,X,Ut,ie,he,mt,At,Lt,$e,te,me.data):G.isCompressedArrayTexture?M.compressedTexSubImage3D(Nt,X,Ut,ie,he,mt,At,Lt,$e,me.data):M.texSubImage3D(Nt,X,Ut,ie,he,mt,At,Lt,$e,te,me),M.pixelStorei(M.UNPACK_ROW_LENGTH,Ie),M.pixelStorei(M.UNPACK_IMAGE_HEIGHT,ee),M.pixelStorei(M.UNPACK_SKIP_PIXELS,gn),M.pixelStorei(M.UNPACK_SKIP_ROWS,Li),M.pixelStorei(M.UNPACK_SKIP_IMAGES,Je),X===0&&G.generateMipmaps&&M.generateMipmap(Nt),Y.unbindTexture()},this.initRenderTarget=function(T){et.get(T).__webglFramebuffer===void 0&&b.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?b.setTextureCube(T,0):T.isData3DTexture?b.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?b.setTexture2DArray(T,0):b.setTexture2D(T,0),Y.unbindTexture()},this.resetState=function(){L=0,D=0,A=null,Y.reset(),Kt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return jn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===Va?"display-p3":"srgb",e.unpackColorSpace=ne.workingColorSpace===Gr?"display-p3":"srgb"}}class Ka extends Ne{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Dn,this.environmentIntensity=1,this.environmentRotation=new Dn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class wg extends ke{constructor(t=null,e=1,n=1,s,r,o,a,l,c=Ze,h=Ze,u,f){super(null,o,a,l,c,h,s,r,u,f),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class cc extends xe{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const ji=new se,hc=new se,ur=[],uc=new Di,Tg=new se,Ms=new be,ys=new fs;class fc extends be{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new cc(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,Tg)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Di),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,ji),uc.copy(t.boundingBox).applyMatrix4(ji),this.boundingBox.union(uc)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new fs),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,ji),ys.copy(t.boundingSphere).applyMatrix4(ji),this.boundingSphere.union(ys)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const n=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,o=t*r+1;for(let a=0;a<n.length;a++)n[a]=s[o+a]}raycast(t,e){const n=this.matrixWorld,s=this.count;if(Ms.geometry=this.geometry,Ms.material=this.material,Ms.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ys.copy(this.boundingSphere),ys.applyMatrix4(n),t.ray.intersectsSphere(ys)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,ji),hc.multiplyMatrices(n,ji),Ms.matrixWorld=hc,Ms.raycast(t,ur);for(let o=0,a=ur.length;o<a;o++){const l=ur[o];l.instanceId=r,l.object=this,e.push(l)}ur.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new cc(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){const n=e.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new wg(new Float32Array(s*this.count),s,this.count,za,wn));const r=this.morphTexture.source.data.data;let o=0;for(let c=0;c<n.length;c++)o+=n[c];const a=this.geometry.morphTargetsRelative?1:1-o,l=s*t;r[l]=a,r.set(n,l+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}class Ag extends ds{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Wt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const dc=new se,Ca=new Wa,fr=new fs,dr=new P;class Th extends Ne{constructor(t=new ce,e=new Ag){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),fr.copy(n.boundingSphere),fr.applyMatrix4(s),fr.radius+=r,t.ray.intersectsSphere(fr)===!1)return;dc.copy(s).invert(),Ca.copy(t.ray).applyMatrix4(dc);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,u=n.attributes.position;if(c!==null){const f=Math.max(0,o.start),d=Math.min(c.count,o.start+o.count);for(let g=f,S=d;g<S;g++){const p=c.getX(g);dr.fromBufferAttribute(u,p),pc(dr,p,l,s,t,e,this)}}else{const f=Math.max(0,o.start),d=Math.min(u.count,o.start+o.count);for(let g=f,S=d;g<S;g++)dr.fromBufferAttribute(u,g),pc(dr,g,l,s,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function pc(i,t,e,n,s,r,o){const a=Ca.distanceSqToPoint(i);if(a<e){const l=new P;Ca.closestPointToPoint(i,l),l.applyMatrix4(n);const c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}class Cg extends ke{constructor(t,e,n,s,r,o,a,l,c){super(t,e,n,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Nn{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const n=this.getLengths();let s=0;const r=n.length;let o;e?o=e:o=t*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(s=Math.floor(a+(l-a)/2),c=n[s]-o,c<0)a=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===o)return s/(r-1);const h=n[s],f=n[s+1]-h,d=(o-h)/f;return(s+d)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const o=this.getPoint(s),a=this.getPoint(r),l=e||(o.isVector2?new ut:new P);return l.copy(a).sub(o).normalize(),l}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){const n=new P,s=[],r=[],o=[],a=new P,l=new se;for(let d=0;d<=t;d++){const g=d/t;s[d]=this.getTangentAt(g,new P)}r[0]=new P,o[0]=new P;let c=Number.MAX_VALUE;const h=Math.abs(s[0].x),u=Math.abs(s[0].y),f=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),f<=c&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let d=1;d<=t;d++){if(r[d]=r[d-1].clone(),o[d]=o[d-1].clone(),a.crossVectors(s[d-1],s[d]),a.length()>Number.EPSILON){a.normalize();const g=Math.acos(Se(s[d-1].dot(s[d]),-1,1));r[d].applyMatrix4(l.makeRotationAxis(a,g))}o[d].crossVectors(s[d],r[d])}if(e===!0){let d=Math.acos(Se(r[0].dot(r[t]),-1,1));d/=t,s[0].dot(a.crossVectors(r[0],r[t]))>0&&(d=-d);for(let g=1;g<=t;g++)r[g].applyMatrix4(l.makeRotationAxis(s[g],d*g)),o[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class $a extends Nn{constructor(t=0,e=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(t,e=new ut){const n=e,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);const a=this.aStartAngle+t*r;let l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),f=l-this.aX,d=c-this.aY;l=f*h-d*u+this.aX,c=f*u+d*h+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class Rg extends $a{constructor(t,e,n,s,r,o){super(t,e,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}}function Ja(){let i=0,t=0,e=0,n=0;function s(r,o,a,l){i=r,t=a,e=-3*r+3*o-2*a-l,n=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){s(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,h,u){let f=(o-r)/c-(a-r)/(c+h)+(a-o)/h,d=(a-o)/h-(l-o)/(h+u)+(l-a)/u;f*=h,d*=h,s(o,a,f,d)},calc:function(r){const o=r*r,a=o*r;return i+t*r+e*o+n*a}}}const pr=new P,Po=new Ja,Do=new Ja,Lo=new Ja;class un extends Nn{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new P){const n=e,s=this.points,r=s.length,o=(r-(this.closed?0:1))*t;let a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,h;this.closed||a>0?c=s[(a-1)%r]:(pr.subVectors(s[0],s[1]).add(s[0]),c=pr);const u=s[a%r],f=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(pr.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=pr),this.curveType==="centripetal"||this.curveType==="chordal"){const d=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(u),d),S=Math.pow(u.distanceToSquared(f),d),p=Math.pow(f.distanceToSquared(h),d);S<1e-4&&(S=1),g<1e-4&&(g=S),p<1e-4&&(p=S),Po.initNonuniformCatmullRom(c.x,u.x,f.x,h.x,g,S,p),Do.initNonuniformCatmullRom(c.y,u.y,f.y,h.y,g,S,p),Lo.initNonuniformCatmullRom(c.z,u.z,f.z,h.z,g,S,p)}else this.curveType==="catmullrom"&&(Po.initCatmullRom(c.x,u.x,f.x,h.x,this.tension),Do.initCatmullRom(c.y,u.y,f.y,h.y,this.tension),Lo.initCatmullRom(c.z,u.z,f.z,h.z,this.tension));return n.set(Po.calc(l),Do.calc(l),Lo.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new P().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function mc(i,t,e,n,s){const r=(n-t)*.5,o=(s-e)*.5,a=i*i,l=i*a;return(2*e-2*n+r+o)*l+(-3*e+3*n-2*r-o)*a+r*i+e}function Pg(i,t){const e=1-i;return e*e*t}function Dg(i,t){return 2*(1-i)*i*t}function Lg(i,t){return i*i*t}function Rs(i,t,e,n){return Pg(i,t)+Dg(i,e)+Lg(i,n)}function Ig(i,t){const e=1-i;return e*e*e*t}function Ug(i,t){const e=1-i;return 3*e*e*i*t}function Ng(i,t){return 3*(1-i)*i*i*t}function Fg(i,t){return i*i*i*t}function Ps(i,t,e,n,s){return Ig(i,t)+Ug(i,e)+Ng(i,n)+Fg(i,s)}class Ah extends Nn{constructor(t=new ut,e=new ut,n=new ut,s=new ut){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new ut){const n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Ps(t,s.x,r.x,o.x,a.x),Ps(t,s.y,r.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Og extends Nn{constructor(t=new P,e=new P,n=new P,s=new P){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new P){const n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Ps(t,s.x,r.x,o.x,a.x),Ps(t,s.y,r.y,o.y,a.y),Ps(t,s.z,r.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Ch extends Nn{constructor(t=new ut,e=new ut){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new ut){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new ut){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class zg extends Nn{constructor(t=new P,e=new P){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new P){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new P){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Rh extends Nn{constructor(t=new ut,e=new ut,n=new ut){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new ut){const n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(Rs(t,s.x,r.x,o.x),Rs(t,s.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Ph extends Nn{constructor(t=new P,e=new P,n=new P){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new P){const n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(Rs(t,s.x,r.x,o.x),Rs(t,s.y,r.y,o.y),Rs(t,s.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Dh extends Nn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new ut){const n=e,s=this.points,r=(s.length-1)*t,o=Math.floor(r),a=r-o,l=s[o===0?o:o-1],c=s[o],h=s[o>s.length-2?s.length-1:o+1],u=s[o>s.length-3?s.length-1:o+2];return n.set(mc(a,l.x,c.x,h.x,u.x),mc(a,l.y,c.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new ut().fromArray(s))}return this}}var Ur=Object.freeze({__proto__:null,ArcCurve:Rg,CatmullRomCurve3:un,CubicBezierCurve:Ah,CubicBezierCurve3:Og,EllipseCurve:$a,LineCurve:Ch,LineCurve3:zg,QuadraticBezierCurve:Rh,QuadraticBezierCurve3:Ph,SplineCurve:Dh});class Bg extends Nn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Ur[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const o=s[r]-n,a=this.curves[r],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const o=r[s],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,l=o.getPoints(a);for(let c=0;c<l.length;c++){const h=l[c];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new Ur[s.type]().fromJSON(s))}return this}}class gc extends Bg{constructor(t){super(),this.type="Path",this.currentPoint=new ut,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new Ch(this.currentPoint.clone(),new ut(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){const r=new Rh(this.currentPoint.clone(),new ut(t,e),new ut(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,o){const a=new Ah(this.currentPoint.clone(),new ut(t,e),new ut(n,s),new ut(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new Dh(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,o){const a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+a,e+l,n,s,r,o),this}absarc(t,e,n,s,r,o){return this.absellipse(t,e,n,n,s,r,o),this}ellipse(t,e,n,s,r,o,a,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,n,s,r,o,a,l),this}absellipse(t,e,n,s,r,o,a,l){const c=new $a(t,e,n,s,r,o,a,l);if(this.curves.length>0){const u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Nr extends ce{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);const r=[],o=[],a=[],l=[],c=new P,h=new ut;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let u=0,f=3;u<=e;u++,f+=3){const d=n+u/e*s;c.x=t*Math.cos(d),c.y=t*Math.sin(d),o.push(c.x,c.y,c.z),a.push(0,0,1),h.x=(o[f]/t+1)/2,h.y=(o[f+1]/t+1)/2,l.push(h.x,h.y)}for(let u=1;u<=e;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new Yt(o,3)),this.setAttribute("normal",new Yt(a,3)),this.setAttribute("uv",new Yt(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Nr(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class ze extends ce{constructor(t=1,e=1,n=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const h=[],u=[],f=[],d=[];let g=0;const S=[],p=n/2;let m=0;w(),o===!1&&(t>0&&y(!0),e>0&&y(!1)),this.setIndex(h),this.setAttribute("position",new Yt(u,3)),this.setAttribute("normal",new Yt(f,3)),this.setAttribute("uv",new Yt(d,2));function w(){const x=new P,L=new P;let D=0;const A=(e-t)/n;for(let I=0;I<=r;I++){const z=[],_=I/r,E=_*(e-t)+t;for(let k=0;k<=s;k++){const q=k/s,K=q*l+a,tt=Math.sin(K),Z=Math.cos(K);L.x=E*tt,L.y=-_*n+p,L.z=E*Z,u.push(L.x,L.y,L.z),x.set(tt,A,Z).normalize(),f.push(x.x,x.y,x.z),d.push(q,1-_),z.push(g++)}S.push(z)}for(let I=0;I<s;I++)for(let z=0;z<r;z++){const _=S[z][I],E=S[z+1][I],k=S[z+1][I+1],q=S[z][I+1];t>0&&(h.push(_,E,q),D+=3),e>0&&(h.push(E,k,q),D+=3)}c.addGroup(m,D,0),m+=D}function y(x){const L=g,D=new ut,A=new P;let I=0;const z=x===!0?t:e,_=x===!0?1:-1;for(let k=1;k<=s;k++)u.push(0,p*_,0),f.push(0,_,0),d.push(.5,.5),g++;const E=g;for(let k=0;k<=s;k++){const K=k/s*l+a,tt=Math.cos(K),Z=Math.sin(K);A.x=z*Z,A.y=p*_,A.z=z*tt,u.push(A.x,A.y,A.z),f.push(0,_,0),D.x=tt*.5+.5,D.y=Z*.5*_+.5,d.push(D.x,D.y),g++}for(let k=0;k<s;k++){const q=L+k,K=E+k;x===!0?h.push(K,K+1,q):h.push(K+1,K,q),I+=3}c.addGroup(m,I,x===!0?1:2),m+=I}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ze(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Qa extends ce{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const r=[],o=[];a(s),c(n),h(),this.setAttribute("position",new Yt(r,3)),this.setAttribute("normal",new Yt(r.slice(),3)),this.setAttribute("uv",new Yt(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(w){const y=new P,x=new P,L=new P;for(let D=0;D<e.length;D+=3)d(e[D+0],y),d(e[D+1],x),d(e[D+2],L),l(y,x,L,w)}function l(w,y,x,L){const D=L+1,A=[];for(let I=0;I<=D;I++){A[I]=[];const z=w.clone().lerp(x,I/D),_=y.clone().lerp(x,I/D),E=D-I;for(let k=0;k<=E;k++)k===0&&I===D?A[I][k]=z:A[I][k]=z.clone().lerp(_,k/E)}for(let I=0;I<D;I++)for(let z=0;z<2*(D-I)-1;z++){const _=Math.floor(z/2);z%2===0?(f(A[I][_+1]),f(A[I+1][_]),f(A[I][_])):(f(A[I][_+1]),f(A[I+1][_+1]),f(A[I+1][_]))}}function c(w){const y=new P;for(let x=0;x<r.length;x+=3)y.x=r[x+0],y.y=r[x+1],y.z=r[x+2],y.normalize().multiplyScalar(w),r[x+0]=y.x,r[x+1]=y.y,r[x+2]=y.z}function h(){const w=new P;for(let y=0;y<r.length;y+=3){w.x=r[y+0],w.y=r[y+1],w.z=r[y+2];const x=p(w)/2/Math.PI+.5,L=m(w)/Math.PI+.5;o.push(x,1-L)}g(),u()}function u(){for(let w=0;w<o.length;w+=6){const y=o[w+0],x=o[w+2],L=o[w+4],D=Math.max(y,x,L),A=Math.min(y,x,L);D>.9&&A<.1&&(y<.2&&(o[w+0]+=1),x<.2&&(o[w+2]+=1),L<.2&&(o[w+4]+=1))}}function f(w){r.push(w.x,w.y,w.z)}function d(w,y){const x=w*3;y.x=t[x+0],y.y=t[x+1],y.z=t[x+2]}function g(){const w=new P,y=new P,x=new P,L=new P,D=new ut,A=new ut,I=new ut;for(let z=0,_=0;z<r.length;z+=9,_+=6){w.set(r[z+0],r[z+1],r[z+2]),y.set(r[z+3],r[z+4],r[z+5]),x.set(r[z+6],r[z+7],r[z+8]),D.set(o[_+0],o[_+1]),A.set(o[_+2],o[_+3]),I.set(o[_+4],o[_+5]),L.copy(w).add(y).add(x).divideScalar(3);const E=p(L);S(D,_+0,w,E),S(A,_+2,y,E),S(I,_+4,x,E)}}function S(w,y,x,L){L<0&&w.x===1&&(o[y]=w.x-1),x.x===0&&x.z===0&&(o[y]=L/2/Math.PI+.5)}function p(w){return Math.atan2(w.z,-w.x)}function m(w){return Math.atan2(-w.y,Math.sqrt(w.x*w.x+w.z*w.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Qa(t.vertices,t.indices,t.radius,t.details)}}class Lh extends gc{constructor(t){super(t),this.uuid=Pi(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(new gc().fromJSON(s))}return this}}const kg={triangulate:function(i,t,e=2){const n=t&&t.length,s=n?t[0]*e:i.length;let r=Ih(i,0,s,e,!0);const o=[];if(!r||r.next===r.prev)return o;let a,l,c,h,u,f,d;if(n&&(r=Xg(i,t,r,e)),i.length>80*e){a=c=i[0],l=h=i[1];for(let g=e;g<s;g+=e)u=i[g],f=i[g+1],u<a&&(a=u),f<l&&(l=f),u>c&&(c=u),f>h&&(h=f);d=Math.max(c-a,h-l),d=d!==0?32767/d:0}return Fs(r,o,e,a,l,d,0),o}};function Ih(i,t,e,n,s){let r,o;if(s===nv(i,t,e,n)>0)for(r=t;r<e;r+=n)o=vc(r,i[r],i[r+1],o);else for(r=e-n;r>=t;r-=n)o=vc(r,i[r],i[r+1],o);return o&&Xr(o,o.next)&&(zs(o),o=o.next),o}function Ci(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(Xr(e,e.next)||pe(e.prev,e,e.next)===0)){if(zs(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Fs(i,t,e,n,s,r,o){if(!i)return;!o&&r&&Kg(i,n,s,r);let a=i,l,c;for(;i.prev!==i.next;){if(l=i.prev,c=i.next,r?Vg(i,n,s,r):Hg(i)){t.push(l.i/e|0),t.push(i.i/e|0),t.push(c.i/e|0),zs(i),i=c.next,a=c.next;continue}if(i=c,i===a){o?o===1?(i=Gg(Ci(i),t,e),Fs(i,t,e,n,s,r,2)):o===2&&Wg(i,t,e,n,s,r):Fs(Ci(i),t,e,n,s,r,1);break}}}function Hg(i){const t=i.prev,e=i,n=i.next;if(pe(t,e,n)>=0)return!1;const s=t.x,r=e.x,o=n.x,a=t.y,l=e.y,c=n.y,h=s<r?s<o?s:o:r<o?r:o,u=a<l?a<c?a:c:l<c?l:c,f=s>r?s>o?s:o:r>o?r:o,d=a>l?a>c?a:c:l>c?l:c;let g=n.next;for(;g!==t;){if(g.x>=h&&g.x<=f&&g.y>=u&&g.y<=d&&ts(s,a,r,l,o,c,g.x,g.y)&&pe(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function Vg(i,t,e,n){const s=i.prev,r=i,o=i.next;if(pe(s,r,o)>=0)return!1;const a=s.x,l=r.x,c=o.x,h=s.y,u=r.y,f=o.y,d=a<l?a<c?a:c:l<c?l:c,g=h<u?h<f?h:f:u<f?u:f,S=a>l?a>c?a:c:l>c?l:c,p=h>u?h>f?h:f:u>f?u:f,m=Ra(d,g,t,e,n),w=Ra(S,p,t,e,n);let y=i.prevZ,x=i.nextZ;for(;y&&y.z>=m&&x&&x.z<=w;){if(y.x>=d&&y.x<=S&&y.y>=g&&y.y<=p&&y!==s&&y!==o&&ts(a,h,l,u,c,f,y.x,y.y)&&pe(y.prev,y,y.next)>=0||(y=y.prevZ,x.x>=d&&x.x<=S&&x.y>=g&&x.y<=p&&x!==s&&x!==o&&ts(a,h,l,u,c,f,x.x,x.y)&&pe(x.prev,x,x.next)>=0))return!1;x=x.nextZ}for(;y&&y.z>=m;){if(y.x>=d&&y.x<=S&&y.y>=g&&y.y<=p&&y!==s&&y!==o&&ts(a,h,l,u,c,f,y.x,y.y)&&pe(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;x&&x.z<=w;){if(x.x>=d&&x.x<=S&&x.y>=g&&x.y<=p&&x!==s&&x!==o&&ts(a,h,l,u,c,f,x.x,x.y)&&pe(x.prev,x,x.next)>=0)return!1;x=x.nextZ}return!0}function Gg(i,t,e){let n=i;do{const s=n.prev,r=n.next.next;!Xr(s,r)&&Uh(s,n,n.next,r)&&Os(s,r)&&Os(r,s)&&(t.push(s.i/e|0),t.push(n.i/e|0),t.push(r.i/e|0),zs(n),zs(n.next),n=i=r),n=n.next}while(n!==i);return Ci(n)}function Wg(i,t,e,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&Qg(o,a)){let l=Nh(o,a);o=Ci(o,o.next),l=Ci(l,l.next),Fs(o,t,e,n,s,r,0),Fs(l,t,e,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function Xg(i,t,e,n){const s=[];let r,o,a,l,c;for(r=0,o=t.length;r<o;r++)a=t[r]*n,l=r<o-1?t[r+1]*n:i.length,c=Ih(i,a,l,n,!1),c===c.next&&(c.steiner=!0),s.push(Jg(c));for(s.sort(Yg),r=0;r<s.length;r++)e=qg(s[r],e);return e}function Yg(i,t){return i.x-t.x}function qg(i,t){const e=jg(i,t);if(!e)return t;const n=Nh(e,i);return Ci(n,n.next),Ci(e,e.next)}function jg(i,t){let e=t,n=-1/0,s;const r=i.x,o=i.y;do{if(o<=e.y&&o>=e.next.y&&e.next.y!==e.y){const f=e.x+(o-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(f<=r&&f>n&&(n=f,s=e.x<e.next.x?e:e.next,f===r))return s}e=e.next}while(e!==t);if(!s)return null;const a=s,l=s.x,c=s.y;let h=1/0,u;e=s;do r>=e.x&&e.x>=l&&r!==e.x&&ts(o<c?r:n,o,l,c,o<c?n:r,o,e.x,e.y)&&(u=Math.abs(o-e.y)/(r-e.x),Os(e,i)&&(u<h||u===h&&(e.x>s.x||e.x===s.x&&Zg(s,e)))&&(s=e,h=u)),e=e.next;while(e!==a);return s}function Zg(i,t){return pe(i.prev,i,t.prev)<0&&pe(t.next,i,i.next)<0}function Kg(i,t,e,n){let s=i;do s.z===0&&(s.z=Ra(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,$g(s)}function $g(i){let t,e,n,s,r,o,a,l,c=1;do{for(e=i,i=null,r=null,o=0;e;){for(o++,n=e,a=0,t=0;t<c&&(a++,n=n.nextZ,!!n);t++);for(l=c;a>0||l>0&&n;)a!==0&&(l===0||!n||e.z<=n.z)?(s=e,e=e.nextZ,a--):(s=n,n=n.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;e=n}r.nextZ=null,c*=2}while(o>1);return i}function Ra(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function Jg(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function ts(i,t,e,n,s,r,o,a){return(s-o)*(t-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(e-o)*(t-a)&&(e-o)*(r-a)>=(s-o)*(n-a)}function Qg(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!tv(i,t)&&(Os(i,t)&&Os(t,i)&&ev(i,t)&&(pe(i.prev,i,t.prev)||pe(i,t.prev,t))||Xr(i,t)&&pe(i.prev,i,i.next)>0&&pe(t.prev,t,t.next)>0)}function pe(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function Xr(i,t){return i.x===t.x&&i.y===t.y}function Uh(i,t,e,n){const s=gr(pe(i,t,e)),r=gr(pe(i,t,n)),o=gr(pe(e,n,i)),a=gr(pe(e,n,t));return!!(s!==r&&o!==a||s===0&&mr(i,e,t)||r===0&&mr(i,n,t)||o===0&&mr(e,i,n)||a===0&&mr(e,t,n))}function mr(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function gr(i){return i>0?1:i<0?-1:0}function tv(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&Uh(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function Os(i,t){return pe(i.prev,i,i.next)<0?pe(i,t,i.next)>=0&&pe(i,i.prev,t)>=0:pe(i,t,i.prev)<0||pe(i,i.next,t)<0}function ev(i,t){let e=i,n=!1;const s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function Nh(i,t){const e=new Pa(i.i,i.x,i.y),n=new Pa(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function vc(i,t,e,n){const s=new Pa(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function zs(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function Pa(i,t,e){this.i=i,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function nv(i,t,e,n){let s=0;for(let r=t,o=e-n;r<e;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}class Ds{static area(t){const e=t.length;let n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return Ds.area(t)<0}static triangulateShape(t,e){const n=[],s=[],r=[];_c(t),xc(n,t);let o=t.length;e.forEach(_c);for(let l=0;l<e.length;l++)s.push(o),o+=e[l].length,xc(n,e[l]);const a=kg.triangulate(n,s);for(let l=0;l<a.length;l+=3)r.push(a.slice(l,l+3));return r}}function _c(i){const t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function xc(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}class tl extends ce{constructor(t=new Lh([new ut(.5,.5),new ut(-.5,.5),new ut(-.5,-.5),new ut(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const n=this,s=[],r=[];for(let a=0,l=t.length;a<l;a++){const c=t[a];o(c)}this.setAttribute("position",new Yt(s,3)),this.setAttribute("uv",new Yt(r,2)),this.computeVertexNormals();function o(a){const l=[],c=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,u=e.depth!==void 0?e.depth:1;let f=e.bevelEnabled!==void 0?e.bevelEnabled:!0,d=e.bevelThickness!==void 0?e.bevelThickness:.2,g=e.bevelSize!==void 0?e.bevelSize:d-.1,S=e.bevelOffset!==void 0?e.bevelOffset:0,p=e.bevelSegments!==void 0?e.bevelSegments:3;const m=e.extrudePath,w=e.UVGenerator!==void 0?e.UVGenerator:iv;let y,x=!1,L,D,A,I;m&&(y=m.getSpacedPoints(h),x=!0,f=!1,L=m.computeFrenetFrames(h,!1),D=new P,A=new P,I=new P),f||(p=0,d=0,g=0,S=0);const z=a.extractPoints(c);let _=z.shape;const E=z.holes;if(!Ds.isClockWise(_)){_=_.reverse();for(let R=0,M=E.length;R<M;R++){const H=E[R];Ds.isClockWise(H)&&(E[R]=H.reverse())}}const q=Ds.triangulateShape(_,E),K=_;for(let R=0,M=E.length;R<M;R++){const H=E[R];_=_.concat(H)}function tt(R,M,H){return M||console.error("THREE.ExtrudeGeometry: vec does not exist"),R.clone().addScaledVector(M,H)}const Z=_.length,lt=q.length;function Q(R,M,H){let N,O,Y;const it=R.x-M.x,et=R.y-M.y,b=H.x-R.x,v=H.y-R.y,U=it*it+et*et,B=it*v-et*b;if(Math.abs(B)>Number.EPSILON){const j=Math.sqrt(U),W=Math.sqrt(b*b+v*v),ht=M.x-et/j,ct=M.y+it/j,ot=H.x-v/W,Ct=H.y+b/W,st=((ot-ht)*v-(Ct-ct)*b)/(it*v-et*b);N=ht+it*st-R.x,O=ct+et*st-R.y;const gt=N*N+O*O;if(gt<=2)return new ut(N,O);Y=Math.sqrt(gt/2)}else{let j=!1;it>Number.EPSILON?b>Number.EPSILON&&(j=!0):it<-Number.EPSILON?b<-Number.EPSILON&&(j=!0):Math.sign(et)===Math.sign(v)&&(j=!0),j?(N=-et,O=it,Y=Math.sqrt(U)):(N=it,O=et,Y=Math.sqrt(U/2))}return new ut(N/Y,O/Y)}const xt=[];for(let R=0,M=K.length,H=M-1,N=R+1;R<M;R++,H++,N++)H===M&&(H=0),N===M&&(N=0),xt[R]=Q(K[R],K[H],K[N]);const yt=[];let pt,Bt=xt.concat();for(let R=0,M=E.length;R<M;R++){const H=E[R];pt=[];for(let N=0,O=H.length,Y=O-1,it=N+1;N<O;N++,Y++,it++)Y===O&&(Y=0),it===O&&(it=0),pt[N]=Q(H[N],H[Y],H[it]);yt.push(pt),Bt=Bt.concat(pt)}for(let R=0;R<p;R++){const M=R/p,H=d*Math.cos(M*Math.PI/2),N=g*Math.sin(M*Math.PI/2)+S;for(let O=0,Y=K.length;O<Y;O++){const it=tt(K[O],xt[O],N);_t(it.x,it.y,-H)}for(let O=0,Y=E.length;O<Y;O++){const it=E[O];pt=yt[O];for(let et=0,b=it.length;et<b;et++){const v=tt(it[et],pt[et],N);_t(v.x,v.y,-H)}}}const qt=g+S;for(let R=0;R<Z;R++){const M=f?tt(_[R],Bt[R],qt):_[R];x?(A.copy(L.normals[0]).multiplyScalar(M.x),D.copy(L.binormals[0]).multiplyScalar(M.y),I.copy(y[0]).add(A).add(D),_t(I.x,I.y,I.z)):_t(M.x,M.y,0)}for(let R=1;R<=h;R++)for(let M=0;M<Z;M++){const H=f?tt(_[M],Bt[M],qt):_[M];x?(A.copy(L.normals[R]).multiplyScalar(H.x),D.copy(L.binormals[R]).multiplyScalar(H.y),I.copy(y[R]).add(A).add(D),_t(I.x,I.y,I.z)):_t(H.x,H.y,u/h*R)}for(let R=p-1;R>=0;R--){const M=R/p,H=d*Math.cos(M*Math.PI/2),N=g*Math.sin(M*Math.PI/2)+S;for(let O=0,Y=K.length;O<Y;O++){const it=tt(K[O],xt[O],N);_t(it.x,it.y,u+H)}for(let O=0,Y=E.length;O<Y;O++){const it=E[O];pt=yt[O];for(let et=0,b=it.length;et<b;et++){const v=tt(it[et],pt[et],N);x?_t(v.x,v.y+y[h-1].y,y[h-1].x+H):_t(v.x,v.y,u+H)}}}rt(),dt();function rt(){const R=s.length/3;if(f){let M=0,H=Z*M;for(let N=0;N<lt;N++){const O=q[N];zt(O[2]+H,O[1]+H,O[0]+H)}M=h+p*2,H=Z*M;for(let N=0;N<lt;N++){const O=q[N];zt(O[0]+H,O[1]+H,O[2]+H)}}else{for(let M=0;M<lt;M++){const H=q[M];zt(H[2],H[1],H[0])}for(let M=0;M<lt;M++){const H=q[M];zt(H[0]+Z*h,H[1]+Z*h,H[2]+Z*h)}}n.addGroup(R,s.length/3-R,0)}function dt(){const R=s.length/3;let M=0;wt(K,M),M+=K.length;for(let H=0,N=E.length;H<N;H++){const O=E[H];wt(O,M),M+=O.length}n.addGroup(R,s.length/3-R,1)}function wt(R,M){let H=R.length;for(;--H>=0;){const N=H;let O=H-1;O<0&&(O=R.length-1);for(let Y=0,it=h+p*2;Y<it;Y++){const et=Z*Y,b=Z*(Y+1),v=M+N+et,U=M+O+et,B=M+O+b,j=M+N+b;Ot(v,U,B,j)}}}function _t(R,M,H){l.push(R),l.push(M),l.push(H)}function zt(R,M,H){C(R),C(M),C(H);const N=s.length/3,O=w.generateTopUV(n,s,N-3,N-2,N-1);F(O[0]),F(O[1]),F(O[2])}function Ot(R,M,H,N){C(R),C(M),C(N),C(M),C(H),C(N);const O=s.length/3,Y=w.generateSideWallUV(n,s,O-6,O-3,O-2,O-1);F(Y[0]),F(Y[1]),F(Y[3]),F(Y[1]),F(Y[2]),F(Y[3])}function C(R){s.push(l[R*3+0]),s.push(l[R*3+1]),s.push(l[R*3+2])}function F(R){r.push(R.x),r.push(R.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return sv(e,n,t)}static fromJSON(t,e){const n=[];for(let r=0,o=t.shapes.length;r<o;r++){const a=e[t.shapes[r]];n.push(a)}const s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new Ur[s.type]().fromJSON(s)),new tl(n,t.options)}}const iv={generateTopUV:function(i,t,e,n,s){const r=t[e*3],o=t[e*3+1],a=t[n*3],l=t[n*3+1],c=t[s*3],h=t[s*3+1];return[new ut(r,o),new ut(a,l),new ut(c,h)]},generateSideWallUV:function(i,t,e,n,s,r){const o=t[e*3],a=t[e*3+1],l=t[e*3+2],c=t[n*3],h=t[n*3+1],u=t[n*3+2],f=t[s*3],d=t[s*3+1],g=t[s*3+2],S=t[r*3],p=t[r*3+1],m=t[r*3+2];return Math.abs(a-h)<Math.abs(o-c)?[new ut(o,1-l),new ut(c,1-u),new ut(f,1-g),new ut(S,1-m)]:[new ut(a,1-l),new ut(h,1-u),new ut(d,1-g),new ut(p,1-m)]}};function sv(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){const r=i[n];e.shapes.push(r.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class el extends Qa{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new el(t.radius,t.detail)}}class nl extends ce{constructor(t=.5,e=1,n=32,s=1,r=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:o},n=Math.max(3,n),s=Math.max(1,s);const a=[],l=[],c=[],h=[];let u=t;const f=(e-t)/s,d=new P,g=new ut;for(let S=0;S<=s;S++){for(let p=0;p<=n;p++){const m=r+p/n*o;d.x=u*Math.cos(m),d.y=u*Math.sin(m),l.push(d.x,d.y,d.z),c.push(0,0,1),g.x=(d.x/e+1)/2,g.y=(d.y/e+1)/2,h.push(g.x,g.y)}u+=f}for(let S=0;S<s;S++){const p=S*(n+1);for(let m=0;m<n;m++){const w=m+p,y=w,x=w+n+1,L=w+n+2,D=w+1;a.push(y,x,D),a.push(x,L,D)}}this.setIndex(a),this.setAttribute("position",new Yt(l,3)),this.setAttribute("normal",new Yt(c,3)),this.setAttribute("uv",new Yt(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new nl(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class Bs extends ce{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(o+a,Math.PI);let c=0;const h=[],u=new P,f=new P,d=[],g=[],S=[],p=[];for(let m=0;m<=n;m++){const w=[],y=m/n;let x=0;m===0&&o===0?x=.5/e:m===n&&l===Math.PI&&(x=-.5/e);for(let L=0;L<=e;L++){const D=L/e;u.x=-t*Math.cos(s+D*r)*Math.sin(o+y*a),u.y=t*Math.cos(o+y*a),u.z=t*Math.sin(s+D*r)*Math.sin(o+y*a),g.push(u.x,u.y,u.z),f.copy(u).normalize(),S.push(f.x,f.y,f.z),p.push(D+x,1-y),w.push(c++)}h.push(w)}for(let m=0;m<n;m++)for(let w=0;w<e;w++){const y=h[m][w+1],x=h[m][w],L=h[m+1][w],D=h[m+1][w+1];(m!==0||o>0)&&d.push(y,x,D),(m!==n-1||l<Math.PI)&&d.push(x,L,D)}this.setIndex(d),this.setAttribute("position",new Yt(g,3)),this.setAttribute("normal",new Yt(S,3)),this.setAttribute("uv",new Yt(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Bs(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Wn extends ce{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const o=[],a=[],l=[],c=[],h=new P,u=new P,f=new P;for(let d=0;d<=n;d++)for(let g=0;g<=s;g++){const S=g/s*r,p=d/n*Math.PI*2;u.x=(t+e*Math.cos(p))*Math.cos(S),u.y=(t+e*Math.cos(p))*Math.sin(S),u.z=e*Math.sin(p),a.push(u.x,u.y,u.z),h.x=t*Math.cos(S),h.y=t*Math.sin(S),f.subVectors(u,h).normalize(),l.push(f.x,f.y,f.z),c.push(g/s),c.push(d/n)}for(let d=1;d<=n;d++)for(let g=1;g<=s;g++){const S=(s+1)*d+g-1,p=(s+1)*(d-1)+g-1,m=(s+1)*(d-1)+g,w=(s+1)*d+g;o.push(S,p,w),o.push(p,m,w)}this.setIndex(o),this.setAttribute("position",new Yt(a,3)),this.setAttribute("normal",new Yt(l,3)),this.setAttribute("uv",new Yt(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Wn(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class je extends ce{constructor(t=new Ph(new P(-1,-1,0),new P(-1,1,0),new P(1,1,0)),e=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:s,closed:r};const o=t.computeFrenetFrames(e,r);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;const a=new P,l=new P,c=new ut;let h=new P;const u=[],f=[],d=[],g=[];S(),this.setIndex(g),this.setAttribute("position",new Yt(u,3)),this.setAttribute("normal",new Yt(f,3)),this.setAttribute("uv",new Yt(d,2));function S(){for(let y=0;y<e;y++)p(y);p(r===!1?e:0),w(),m()}function p(y){h=t.getPointAt(y/e,h);const x=o.normals[y],L=o.binormals[y];for(let D=0;D<=s;D++){const A=D/s*Math.PI*2,I=Math.sin(A),z=-Math.cos(A);l.x=z*x.x+I*L.x,l.y=z*x.y+I*L.y,l.z=z*x.z+I*L.z,l.normalize(),f.push(l.x,l.y,l.z),a.x=h.x+n*l.x,a.y=h.y+n*l.y,a.z=h.z+n*l.z,u.push(a.x,a.y,a.z)}}function m(){for(let y=1;y<=e;y++)for(let x=1;x<=s;x++){const L=(s+1)*(y-1)+(x-1),D=(s+1)*y+(x-1),A=(s+1)*y+x,I=(s+1)*(y-1)+x;g.push(L,D,I),g.push(D,A,I)}}function w(){for(let y=0;y<=e;y++)for(let x=0;x<=s;x++)c.x=y/e,c.y=x/s,d.push(c.x,c.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new je(new Ur[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}}class ge extends ds{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Wt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Wt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ch,this.normalScale=new ut(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Dn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class rv extends ge{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new ut(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Se(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Wt(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Wt(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Wt(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}}class Fh extends Ne{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Wt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}const Io=new se,Mc=new P,yc=new P;class Oh{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ut(512,512),this.map=null,this.mapPass=null,this.matrix=new se,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new qa,this._frameExtents=new ut(1,1),this._viewportCount=1,this._viewports=[new oe(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Mc.setFromMatrixPosition(t.matrixWorld),e.position.copy(Mc),yc.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(yc),e.updateMatrixWorld(),Io.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Io),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Io)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const Sc=new se,Ss=new P,Uo=new P;class ov extends Oh{constructor(){super(new nn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new ut(4,2),this._viewportCount=6,this._viewports=[new oe(2,1,1,1),new oe(0,1,1,1),new oe(3,1,1,1),new oe(1,1,1,1),new oe(3,0,1,1),new oe(1,0,1,1)],this._cubeDirections=[new P(1,0,0),new P(-1,0,0),new P(0,0,1),new P(0,0,-1),new P(0,1,0),new P(0,-1,0)],this._cubeUps=[new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,0,1),new P(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,s=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Ss.setFromMatrixPosition(t.matrixWorld),n.position.copy(Ss),Uo.copy(n.position),Uo.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(Uo),n.updateMatrixWorld(),s.makeTranslation(-Ss.x,-Ss.y,-Ss.z),Sc.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Sc)}}class av extends Fh{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new ov}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class lv extends Oh{constructor(){super(new ja(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class bc extends Fh{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ne.DEFAULT_UP),this.updateMatrix(),this.target=new Ne,this.shadow=new lv}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class zh{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Ec(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=Ec();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}function Ec(){return performance.now()}class wc{constructor(t=1,e=0,n=0){return this.radius=t,this.phi=e,this.theta=n,this}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(Se(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class cv extends Ri{constructor(t,e=null){super(),this.object=t,this.domElement=e,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(){}disconnect(){}dispose(){}update(){}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ua}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ua);const Tc={type:"change"},il={type:"start"},Bh={type:"end"},vr=new Wa,Ac=new ci,hv=Math.cos(70*Rn.DEG2RAD),we=new P,Ye=2*Math.PI,re={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},No=1e-6;class uv extends cv{constructor(t,e=null){super(t,e),this.state=re.NONE,this.enabled=!0,this.target=new P,this.cursor=new P,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:es.ROTATE,MIDDLE:es.DOLLY,RIGHT:es.PAN},this.touches={ONE:Ji.ROTATE,TWO:Ji.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new P,this._lastQuaternion=new Pn,this._lastTargetPosition=new P,this._quat=new Pn().setFromUnitVectors(t.up,new P(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new wc,this._sphericalDelta=new wc,this._scale=1,this._panOffset=new P,this._rotateStart=new ut,this._rotateEnd=new ut,this._rotateDelta=new ut,this._panStart=new ut,this._panEnd=new ut,this._panDelta=new ut,this._dollyStart=new ut,this._dollyEnd=new ut,this._dollyDelta=new ut,this._dollyDirection=new P,this._mouse=new ut,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=dv.bind(this),this._onPointerDown=fv.bind(this),this._onPointerUp=pv.bind(this),this._onContextMenu=yv.bind(this),this._onMouseWheel=vv.bind(this),this._onKeyDown=_v.bind(this),this._onTouchStart=xv.bind(this),this._onTouchMove=Mv.bind(this),this._onMouseDown=mv.bind(this),this._onMouseMove=gv.bind(this),this._interceptControlDown=Sv.bind(this),this._interceptControlUp=bv.bind(this),this.domElement!==null&&this.connect(),this.update()}connect(){this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Tc),this.update(),this.state=re.NONE}update(t=null){const e=this.object.position;we.copy(e).sub(this.target),we.applyQuaternion(this._quat),this._spherical.setFromVector3(we),this.autoRotate&&this.state===re.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(n)&&isFinite(s)&&(n<-Math.PI?n+=Ye:n>Math.PI&&(n-=Ye),s<-Math.PI?s+=Ye:s>Math.PI&&(s-=Ye),n<=s?this._spherical.theta=Math.max(n,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+s)/2?Math.max(n,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=o!=this._spherical.radius}if(we.setFromSpherical(this._spherical),we.applyQuaternion(this._quatInverse),e.copy(this.target).add(we),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){const a=we.length();o=this._clampDistance(a*this._scale);const l=a-o;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){const a=new P(this._mouse.x,this._mouse.y,0);a.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;const c=new P(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(a),this.object.updateMatrixWorld(),o=we.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(vr.origin.copy(this.object.position),vr.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(vr.direction))<hv?this.object.lookAt(this.target):(Ac.setFromNormalAndCoplanarPoint(this.object.up,this.target),vr.intersectPlane(Ac,this.target))))}else if(this.object.isOrthographicCamera){const o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>No||8*(1-this._lastQuaternion.dot(this.object.quaternion))>No||this._lastTargetPosition.distanceToSquared(this.target)>No?(this.dispatchEvent(Tc),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?Ye/60*this.autoRotateSpeed*t:Ye/60/60*this.autoRotateSpeed}_getZoomScale(t){const e=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*e)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,e){we.setFromMatrixColumn(e,0),we.multiplyScalar(-t),this._panOffset.add(we)}_panUp(t,e){this.screenSpacePanning===!0?we.setFromMatrixColumn(e,1):(we.setFromMatrixColumn(e,0),we.crossVectors(this.object.up,we)),we.multiplyScalar(t),this._panOffset.add(we)}_pan(t,e){const n=this.domElement;if(this.object.isPerspectiveCamera){const s=this.object.position;we.copy(s).sub(this.target);let r=we.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*r/n.clientHeight,this.object.matrix),this._panUp(2*e*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(e*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,e){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const n=this.domElement.getBoundingClientRect(),s=t-n.left,r=e-n.top,o=n.width,a=n.height;this._mouse.x=s/o*2-1,this._mouse.y=-(r/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientX),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(Ye*this._rotateDelta.x/e.clientHeight),this._rotateUp(Ye*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let e=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this._rotateUp(Ye*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,this.keyPanSpeed),e=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this._rotateUp(-Ye*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,-this.keyPanSpeed),e=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this._rotateLeft(Ye*this.rotateSpeed/this.domElement.clientHeight):this._pan(this.keyPanSpeed,0),e=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this._rotateLeft(-Ye*this.rotateSpeed/this.domElement.clientHeight):this._pan(-this.keyPanSpeed,0),e=!0;break}e&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._rotateStart.set(n,s)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panStart.set(n,s)}}_handleTouchStartDolly(t){const e=this._getSecondPointerPosition(t),n=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(n*n+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{const n=this._getSecondPointerPosition(t),s=.5*(t.pageX+n.x),r=.5*(t.pageY+n.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(Ye*this._rotateDelta.x/e.clientHeight),this._rotateUp(Ye*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panEnd.set(n,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){const e=this._getSecondPointerPosition(t),n=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(n*n+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const o=(t.pageX+e.x)*.5,a=(t.pageY+e.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId){this._pointers.splice(e,1);return}}_isTrackingPointer(t){for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId)return!0;return!1}_trackPointer(t){let e=this._pointerPositions[t.pointerId];e===void 0&&(e=new ut,this._pointerPositions[t.pointerId]=e),e.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){const e=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[e]}_customWheelEvent(t){const e=t.deltaMode,n={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(e){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}}function fv(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i)))}function dv(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function pv(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Bh),this.state=re.NONE;break;case 1:const t=this._pointers[0],e=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:e.x,pageY:e.y});break}}function mv(i){let t;switch(i.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case es.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=re.DOLLY;break;case es.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=re.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=re.ROTATE}break;case es.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=re.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=re.PAN}break;default:this.state=re.NONE}this.state!==re.NONE&&this.dispatchEvent(il)}function gv(i){switch(this.state){case re.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case re.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case re.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function vv(i){this.enabled===!1||this.enableZoom===!1||this.state!==re.NONE||(i.preventDefault(),this.dispatchEvent(il),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(Bh))}function _v(i){this.enabled===!1||this.enablePan===!1||this._handleKeyDown(i)}function xv(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case Ji.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=re.TOUCH_ROTATE;break;case Ji.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=re.TOUCH_PAN;break;default:this.state=re.NONE}break;case 2:switch(this.touches.TWO){case Ji.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=re.TOUCH_DOLLY_PAN;break;case Ji.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=re.TOUCH_DOLLY_ROTATE;break;default:this.state=re.NONE}break;default:this.state=re.NONE}this.state!==re.NONE&&this.dispatchEvent(il)}function Mv(i){switch(this._trackPointer(i),this.state){case re.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case re.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case re.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case re.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=re.NONE}}function yv(i){this.enabled!==!1&&i.preventDefault()}function Sv(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function bv(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const Ev=`
varying vec3 vDir;
void main() {
  vDir = normalize((modelMatrix * vec4(position, 0.0)).xyz);
  vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_Position = p.xyww;
}`,kh=`
#define PI 3.14159265
const float Re = 6360e3;
const float Ra = 6460e3;
const vec3 betaR = vec3(5.802e-6, 13.558e-6, 33.1e-6);
const vec3 betaOz = vec3(0.650e-6, 1.881e-6, 0.085e-6);
const float HR = 8000.0;
const float HM = 1200.0;

vec2 raySphere(vec3 ro, vec3 rd, float r) {
  float b = dot(ro, rd);
  float c = dot(ro, ro) - r * r;
  float d = b * b - c;
  if (d < 0.0) return vec2(1e9, -1e9);
  d = sqrt(d);
  return vec2(-b - d, -b + d);
}

float ozone(float h) { return max(0.0, 1.0 - abs(h - 25000.0) / 15000.0); }

vec3 extinction(float h) {
  float r = exp(-h / HR);
  float m = exp(-h / HM);
  return betaR * r + vec3(uMieBeta * 1.11) * m + betaOz * ozone(h) * 1.0;
}

vec3 transmittanceToSun(vec3 p, vec3 sunDir) {
  // Planet shadow with a soft edge: the sun is a 0.53 deg disc and grazing light is
  // refracted, so the terminator is a gradient a few km deep, not a step (a hard test drew a
  // staircase line across the twilight sky).
  float tca = -dot(p, sunDir);
  float closest = tca > 0.0 ? sqrt(max(dot(p, p) - tca * tca, 0.0)) : length(p);
  float shadow = smoothstep(Re - 1500.0, Re + 4000.0, closest);
  if (shadow <= 0.0) return vec3(0.0);
  vec2 a = raySphere(p, sunDir, Ra);
  float len = a.y;
  const int N = 10;
  float ds = len / float(N);
  vec3 od = vec3(0.0);
  for (int i = 0; i < N; i++) {
    vec3 q = p + sunDir * (float(i) + 0.5) * ds;
    float h = length(q) - Re;
    od += extinction(max(h, 0.0)) * ds;
  }
  return exp(-od) * shadow;
}

`,Hh=`
// Twilight: below ~-2 deg the sky is lit mostly by multiply-scattered light that single
// scattering misses by orders of magnitude. Empirical fit to measured ground illuminance:
// ~400 lux at sunset, ~3 lux at -6 deg (civil), ~0.008 lux at -12 deg (nautical).
vec3 twilight(vec3 rd) {
  float dep = -asin(clamp(uSunDir.y, -1.0, 1.0)) * 57.2958; // solar depression, deg
  float w = smoothstep(-1.0, 3.0, dep);
  if (w <= 0.0) return vec3(0.0);
  float Erel = pow(10.0, -2.4 - 0.37 * max(dep, 0.0));
  vec3 sunH = normalize(vec3(uSunDir.x, 0.0, uSunDir.z) + 1e-5);
  float toward = max(dot(normalize(vec3(rd.x, 0.0, rd.z) + 1e-5), sunH), 0.0);
  float away = max(-dot(normalize(vec3(rd.x, 0.0, rd.z) + 1e-5), sunH), 0.0);
  float elev = max(rd.y, 0.0);
  // bright segment over the sunken sun, ozone-blue zenith, pink Belt of Venus above the
  // grey-blue Earth's shadow on the opposite horizon
  vec3 glow = vec3(0.22, 0.38, 0.95) * (0.5 + 0.5 * elev)
            + vec3(1.0, 0.5, 0.22) * pow(toward, 3.0) * exp(-elev * 8.0) * 2.4 * smoothstep(10.0, 1.0, dep)
            + vec3(0.9, 0.55, 0.65) * pow(away, 2.0) * exp(-abs(elev - 0.08) * 22.0) * 0.6 * smoothstep(7.0, 1.0, dep);
  return glow * uSunIntensity * Erel / 3.14159 * w;
}

`,Fr=`
float h21(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float vn2(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h21(i), h21(i + vec2(1, 0)), f.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), f.x), f.y);
}
float fbm2(vec2 p) {
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 6; i++) { s += a * vn2(p); p = mat2(1.6, 1.2, -1.2, 1.6) * p; a *= 0.5; }
  return s;
}
// Low cloud deck at ~2.2 km: cellular stratocumulus (Worley cells broken up by fbm),
// lightly aligned with the wind, like the rolls in Hurley's Paget plates.
float worley(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p);
  float d = 1.0;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
    vec2 g = vec2(float(x), float(y));
    vec2 o = vec2(h21(i + g), h21(i + g + 17.3));
    d = min(d, length(g + o - f));
  }
  return d;
}
float cloudDensity(vec2 p) {
  vec2 q = vec2(p.x * 0.00058, p.y * 0.00082);
  float base = fbm2(q * 0.6 + fbm2(q * 0.35 + 5.1) * 0.9);
  float cells = 1.0 - worley(q * 2.2 + base * 0.8);
  float d = base * 0.65 + cells * 0.45 + fbm2(q * 5.0) * 0.12;
  float cov = mix(0.82, 0.38, uCloudCover);
  float a = smoothstep(cov, cov + 0.28, d);
  // above ~85% cover the cells merge into a continuous stratus deck
  return max(a, smoothstep(0.85, 1.0, uCloudCover) * (0.9 + 0.1 * base));
}
// Returns (alpha, sun-side shadowing 0..1, thickness)
vec3 cloudAt(vec3 rd) {
  if (rd.y <= 0.0) return vec3(0.0);
  float t = 2200.0 / rd.y;
  vec2 p = rd.xz * t + uCloudOffset;
  float a = cloudDensity(p);
  if (a <= 0.0) return vec3(0.0);
  // two taps toward the sun (in the layer plane) approximate self-shadowing
  vec2 sdir = normalize(uSunDir.xz + 1e-4);
  float s1 = cloudDensity(p + sdir * 260.0);
  float s2 = cloudDensity(p + sdir * 700.0);
  float shadow = exp(-(s1 * 1.6 + s2 * 0.9));
  a *= smoothstep(0.0, 0.05, rd.y);
  return vec3(a, shadow, a);
}
// Thin cirrus at ~8 km: fibrous, mostly translucent
float cirrusAt(vec3 rd) {
  if (rd.y <= 0.0) return 0.0;
  vec2 p = rd.xz * (8000.0 / rd.y) * 0.00011 + vec2(3.7, 1.1);
  float f = fbm2(vec2(p.x * 2.2, p.y * 0.55) + fbm2(p * 0.9) * 0.45);
  return smoothstep(0.5, 0.95, f) * 0.3 * smoothstep(0.0, 0.1, rd.y) * smoothstep(0.15, 0.6, uCloudCover + 0.3);
}

`,wv=`
precision highp float;
varying vec3 vDir;
uniform vec3 uSunDir;
uniform vec3 uMoonDir;
uniform float uMoonPhase;      // 0 new, .5 full
uniform float uMoonIllum;
uniform float uSunIntensity;
uniform float uMieBeta;
uniform float uStars;
uniform float uAurora;
uniform float uTime;
uniform vec3 uGroundAlbedo;
uniform float uIncludeDiscs;   // 0 for the environment map pass (discs handled by lights)
uniform float uCloudCover;     // 0 clear .. 1 overcast
uniform float uCloudsInSky;    // 1 for the IBL cube; the visible clouds are a per-pixel dome (clouds.js)
uniform vec2 uCloudOffset;

${kh}
vec3 scatter(vec3 rd, vec3 sunDir, float sunI, out vec3 transView) {
  vec3 ro = vec3(0.0, Re + 20.0, 0.0);
  vec2 a = raySphere(ro, rd, Ra);
  vec2 g = raySphere(ro, rd, Re);
  float tMax = a.y;
  bool hitGround = g.x > 0.0;
  if (hitGround) tMax = g.x;
  const int N = 40;
  // Non-uniform steps: denser near the observer
  vec3 sumR = vec3(0.0), sumM = vec3(0.0);
  vec3 od = vec3(0.0);
  float mu = dot(rd, sunDir);
  float g0 = 0.8;
  float phaseR = 3.0 / (16.0 * PI) * (1.0 + mu * mu);
  float phaseM = 3.0 / (8.0 * PI) * ((1.0 - g0 * g0) * (1.0 + mu * mu)) / ((2.0 + g0 * g0) * pow(1.0 + g0 * g0 - 2.0 * g0 * mu, 1.5));
  float tPrev = 0.0;
  for (int i = 0; i < N; i++) {
    float f = (float(i) + 1.0) / float(N);
    float t = tMax * f * f;
    float ds = t - tPrev;
    float tm = (t + tPrev) * 0.5;
    tPrev = t;
    vec3 p = ro + rd * tm;
    float h = max(length(p) - Re, 0.0);
    float dR = exp(-h / HR) * ds;
    float dM = exp(-h / HM) * ds;
    od += extinction(h) * ds;
    vec3 tSun = transmittanceToSun(p, sunDir);
    vec3 tr = exp(-od) * tSun;
    sumR += tr * dR;
    sumM += tr * dM;
  }
  transView = exp(-od);
  vec3 col = sunI * (sumR * betaR * phaseR + sumM * uMieBeta * phaseM);
  if (hitGround) {
    // Lambertian snow/ice ground lit by attenuated sun + crude skylight term
    vec3 pG = ro + rd * tMax;
    vec3 n = normalize(pG);
    vec3 tS = transmittanceToSun(pG + n * 2.0, sunDir);
    float ndl = max(dot(n, sunDir), 0.0);
    vec3 sky = sunI * 0.06 * vec3(0.4, 0.6, 1.0) * smoothstep(-0.12, 0.1, sunDir.y);
    col += transView * uGroundAlbedo * (tS * sunI * ndl / PI + sky);
  }
  return col;
}

${Fr}
${Hh}
float hash13(vec3 p) {
  p = fract(p * 0.1031);
  p += dot(p, p.zyx + 31.32);
  return fract((p.x + p.y) * p.z);
}

vec3 starField(vec3 rd) {
  vec3 col = vec3(0.0);
  for (int layer = 0; layer < 2; layer++) {
    float scale = layer == 0 ? 220.0 : 480.0;
    vec3 p = rd * scale;
    vec3 c = floor(p);
    float h = hash13(c);
    float thresh = layer == 0 ? 0.985 : 0.992;
    if (h > thresh) {
      vec3 jitter = vec3(hash13(c + 1.7), hash13(c + 9.1), hash13(c + 4.3)) - 0.5;
      vec3 center = normalize((c + 0.5 + jitter * 0.7));
      float d = length(normalize(rd) * 1.0 - center) * scale;
      float mag = pow((h - thresh) / (1.0 - thresh), 3.0);
      float tw = 0.75 + 0.25 * sin(uTime * (2.0 + h * 9.0) + h * 70.0);
      float temp = hash13(c + 3.3);
      vec3 tint = mix(vec3(0.75, 0.85, 1.0), vec3(1.0, 0.85, 0.7), temp);
      col += tint * mag * tw * exp(-d * d * 18.0) * (layer == 0 ? 6.0 : 2.0);
    }
  }
  // Faint Milky Way band (southern sky, through Crux/Carina — tilted band)
  vec3 gN = normalize(vec3(-0.45, 0.35, 0.82));
  float band = exp(-pow(dot(rd, gN) * 5.0, 2.0));
  float mottled = 0.6 + 0.4 * sin(rd.x * 23.0 + sin(rd.z * 17.0) * 2.0) * sin(rd.y * 31.0 + rd.z * 11.0);
  col += vec3(0.55, 0.6, 0.75) * band * mottled * 0.012;
  return col;
}

vec3 aurora(vec3 rd) {
  if (rd.y < 0.02) return vec3(0.0);
  vec3 col = vec3(0.0);
  // Curtains toward the south magnetic pole direction (roughly south/east of the Weddell Sea)
  for (int i = 0; i < 18; i++) {
    float fi = float(i);
    float h = 0.08 + fi * 0.022;
    float t = h / rd.y; // project onto a "sheet" at increasing height
    vec2 q = rd.xz * t;
    float curtain = sin(q.x * 3.1 + sin(q.y * 1.7 + uTime * 0.05) * 1.6 + uTime * 0.03) * 0.5 + 0.5;
    curtain *= smoothstep(0.4, 1.0, sin(q.y * 1.3 - q.x * 0.6 + 1.0) * 0.5 + 0.5);
    float fade = exp(-fi * 0.16);
    vec3 c = mix(vec3(0.15, 1.0, 0.45), vec3(0.6, 0.25, 0.9), smoothstep(8.0, 17.0, fi));
    col += c * curtain * fade * 0.02 * smoothstep(0.02, 0.2, rd.y) * smoothstep(1.4, 0.4, length(q));
  }
  return col;
}

void main() {
  vec3 rd0 = normalize(vDir);
  // Below the horizon the view is of the ice itself; the background there is only seen
  // through gaps, so use the horizon sky (aerial-perspective limit) rather than a ground model.
  // Single scattering over-reddens the grazing horizon (it lacks the multiple scattering that
  // whitens real horizons), so the last ~0.6 deg is held at the 0.6 deg colour.
  vec3 rd = rd0.y < 0.01 ? normalize(vec3(rd0.x, 0.01, rd0.z)) : rd0;
  vec3 tv;
  vec3 col = scatter(rd, uSunDir, uSunIntensity, tv);
  vec3 skyCol = col;
  // cheap multiple-scattering term: higher orders whiten and lift the single-scattered sky.
  // Purely proportional, so it vanishes with the single-scattered light in the Earth's shadow.
  float ms = smoothstep(-0.2, 0.15, uSunDir.y);
  col += (vec3(dot(col, vec3(0.3333))) * 0.25 + col * vec3(0.04, 0.07, 0.12)) * ms;
  col += twilight(rd);

  // Moonlit sky: same scattering, much weaker source, weighted by illumination
  if (uMoonIllum > 0.01 && uMoonDir.y > -0.1) {
    vec3 tvm;
    col += scatter(rd, uMoonDir, uSunIntensity * 2.5e-6 * uMoonIllum, tvm);
  }

  // Airglow + integrated starlight (~0.001 lux, ~1/200 of a high full moon) and a faint
  // Milky Way band; individual stars are point sprites (celestial.js).
  col += vec3(0.55, 0.65, 0.9) * 1.0e-7 * uSunIntensity * (0.6 + 0.4 * smoothstep(0.0, 0.5, rd.y));
  {
    vec3 gN = normalize(vec3(-0.45, 0.35, 0.82));
    float band = exp(-pow(dot(rd, gN) * 4.0, 2.0));
    float mottle = 0.55 + 0.45 * sin(rd.x * 23.0 + sin(rd.z * 17.0) * 2.0) * sin(rd.y * 31.0 + rd.z * 11.0);
    col += vec3(0.62, 0.64, 0.75) * band * mottle * 4.0e-8 * uSunIntensity * uStars * tv;
  }
  if (rd.y > -0.002) col += aurora(rd) * uAurora * tv * 2.0e-6 * uSunIntensity;

  // Cloud layers, lit by the (atmosphere-attenuated) sun and moon plus sky and twilight.
  if (uCloudCover > 0.001 && uCloudsInSky > 0.5) {
    vec3 cloudPos = vec3(0.0, Re + 2200.0, 0.0);
    vec3 sunT = transmittanceToSun(cloudPos, uSunDir);
    vec3 moonT = transmittanceToSun(cloudPos, uMoonDir);
    float mu = dot(rd, uSunDir);
    vec3 zen = scatter(vec3(0.0, 1.0, 0.0), uSunDir, uSunIntensity, tv);
    float sunUp = smoothstep(-0.12, 0.02, uSunDir.y);
    float far = exp(-(2200.0 / max(rd.y, 0.02)) / 60000.0);

    float ci = cirrusAt(rd);
    if (ci > 0.0) {
      vec3 cirrus = uSunIntensity * sunT * (0.05 + 0.5 * pow(max(mu, 0.0), 6.0)) * sunUp + zen * 0.8 + twilight(rd) * 1.2;
      col = mix(col, mix(skyCol, cirrus, far), ci);
    }

    vec3 c = cloudAt(rd);
    if (c.x > 0.0) {
      float shadow = c.y;
      // forward-scattering silver lining at thin edges, powder darkening in thick cores
      float edge = 1.0 - smoothstep(0.2, 0.9, c.z);
      float phase = 0.3 + 0.25 * (1.0 + mu * mu) + 2.2 * pow(max(mu, 0.0), 10.0) * edge;
      vec3 lit = uSunIntensity * sunT * phase * shadow * 0.16 * sunUp;
      lit += uSunIntensity * 2.5e-6 * uMoonIllum * moonT * 0.16 * shadow * step(0.0, uMoonDir.y);
      vec3 amb = zen * (1.0 - 0.45 * c.z) + twilight(vec3(0.0, 1.0, 0.0)) * (1.0 - 0.4 * c.z) * 1.4 + twilight(rd) * 0.35;
      vec3 cloud = lit + amb + vec3(0.6, 0.7, 1.0) * 1.0e-7 * uSunIntensity;
      cloud = mix(skyCol, cloud, far);
      col = mix(col, cloud, c.x);
    }
  }

  if (uIncludeDiscs > 0.5 && false) {
    // Sun disc with limb darkening (angular radius 0.267 deg)
    float cosR = cos(0.00466);
    float c = dot(rd, uSunDir);
    if (c > cosR) {
      float r = sqrt(max(0.0, 1.0 - (1.0 - c) / (1.0 - cosR)));
      vec3 limb = vec3(0.4, 0.5, 0.6);
      vec3 ld = pow(vec3(r), limb);
      vec3 tSun = transmittanceToSun(vec3(0.0, Re + 20.0, 0.0), uSunDir);
      col += uSunIntensity * 18000.0 * tSun * ld;
    }
    // Moon disc with phase terminator
    float cm = dot(rd, uMoonDir);
    float mr = 0.0045;
    if (cm > cos(mr) && uMoonDir.y > -0.02) {
      vec3 up = abs(uMoonDir.y) > 0.99 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
      vec3 ax = normalize(cross(up, uMoonDir));
      vec3 ay = cross(uMoonDir, ax);
      vec2 uv = vec2(dot(rd, ax), dot(rd, ay)) / mr;
      float z = sqrt(max(0.0, 1.0 - dot(uv, uv)));
      vec3 n = normalize(uv.x * ax + uv.y * ay + z * uMoonDir);
      // Light comes from the sun direction projected on the moon
      vec3 l = normalize(uSunDir - uMoonDir * 0.0);
      float lit = max(0.0, dot(n, l));
      float maria = 0.8 + 0.2 * sin(uv.x * 7.0 + 1.0) * sin(uv.y * 5.0 - 0.4);
      vec3 tM = transmittanceToSun(vec3(0.0, Re + 20.0, 0.0), uMoonDir);
      col += uSunIntensity * 0.045 * vec3(1.0, 0.97, 0.92) * lit * maria * tM * smoothstep(1.0, 0.96, length(uv));
    }
  }
  if (uIncludeDiscs < -0.5 && rd0.y < 0.0) col = vec3(0.0);
  gl_FragColor = vec4(col, 1.0);
}`,Cc=[(i,t)=>[1,-t,-i],(i,t)=>[-1,-t,i],(i,t)=>[i,1,t],(i,t)=>[i,-1,-t],(i,t)=>[i,-t,1],(i,t)=>[-i,-t,-1]];class Tv{constructor(t){this.renderer=t,this.uniforms={uSunDir:{value:new P(0,.1,-1).normalize()},uMoonDir:{value:new P(0,.3,1).normalize()},uMoonPhase:{value:.5},uMoonIllum:{value:1},uSunIntensity:{value:20},uMieBeta:{value:5e-6},uStars:{value:1},uAurora:{value:0},uTime:{value:0},uGroundAlbedo:{value:new Wt(.85,.88,.92)},uIncludeDiscs:{value:1},uCloudCover:{value:.4},uCloudsInSky:{value:1},uCloudOffset:{value:new ut(0,0)}},this.material=new Ee({vertexShader:Ev,fragmentShader:wv,uniforms:this.uniforms,side:Be,depthWrite:!1}),this.cubeRT=new wa(768,{type:pn,generateMipmaps:!0,minFilter:ui}),this.cubeCamera=new Ea(.1,10,this.cubeRT),this.skyScene=new Ka,this.skyMesh=new be(new fe(2,2,2),this.material),this.skyScene.add(this.skyMesh),this.envRT=new wa(64,{type:pn}),this.envCamera=new Ea(.1,10,this.envRT),this.pmrem=new Ta(t),this.envMap=null}measureIrradiance(t=!1){const e=this.envRT.width,n=new Uint16Array(e*e*4);let s=0;for(let r=0;r<6;r++)if(r!==3){this.renderer.readRenderTargetPixels(this.envRT,0,0,e,e,n,r);for(let o=0;o<e;o+=2)for(let a=0;a<e;a+=2){const l=(a+.5)/e*2-1,c=(o+.5)/e*2-1,h=Cc[r](l,t?c:-c),u=Math.hypot(h[0],h[1],h[2]),f=h[1]/u;if(f<=0)continue;const d=(o*e+a)*4,g=.2126*Gi.fromHalfFloat(n[d])+.7152*Gi.fromHalfFloat(n[d+1])+.0722*Gi.fromHalfFloat(n[d+2]),S=4/(e*e)*4/(u*u*u);s+=g*f*S}}return s}async measureIrradianceAsync(){if(!this.measuring){this.measuring=!0;try{const t=this.envRT.width,e=[];for(let r=0;r<6;r++){if(r===3)continue;const o=new Uint16Array(t*t*4);e.push(this.renderer.readRenderTargetPixelsAsync(this.envRT,0,0,t,t,o,r).then(()=>[r,o]))}const n=await Promise.all(e);let s=0;for(const[r,o]of n)s+=this.integrateFace(r,o,t);this.skyIrradiance=s}finally{this.measuring=!1}}}integrateFace(t,e,n){let s=0;for(let r=0;r<n;r+=2)for(let o=0;o<n;o+=2){const a=(o+.5)/n*2-1,l=(r+.5)/n*2-1,c=Cc[t](a,l),h=Math.hypot(c[0],c[1],c[2]),u=c[1]/h;if(u<=0)continue;const f=(r*n+o)*4,d=.2126*Gi.fromHalfFloat(e[f])+.7152*Gi.fromHalfFloat(e[f+1])+.0722*Gi.fromHalfFloat(e[f+2]);s+=d*u*(4/(n*n)*4)/(h*h*h)}return s}update(){return this.uniforms.uIncludeDiscs.value=1,this.uniforms.uCloudsInSky.value=0,this.cubeCamera.update(this.renderer,this.skyScene),this.uniforms.uCloudsInSky.value=1,this.uniforms.uIncludeDiscs.value=0,this.envCamera.update(this.renderer,this.skyScene),this.pmremRT=this.pmrem.fromCubemap(this.envRT.texture,this.pmremRT),this.envMap=this.pmremRT.texture,this.measureIrradianceAsync(),globalThis.__debugIrr&&(this.uniforms.uIncludeDiscs.value=-1,this.envCamera.update(this.renderer,this.skyScene),console.log("zeroed-below irr",this.measureIrradiance(!0).toExponential(3)),this.uniforms.uIncludeDiscs.value=0,this.envCamera.update(this.renderer,this.skyScene)),globalThis.__debugIrr&&console.log("irr",this.skyIrradiance.toExponential(3),"sunY",this.uniforms.uSunDir.value.y.toFixed(3)),{background:this.cubeRT.texture,environment:this.envMap}}}const Pt=Math.PI/180,dn=180/Math.PI;function sl(i){return i.getTime()/864e5+24405875e-1}function Vh(i,t,e){const s=(sl(i)-2451545)/36525,r=Xn(280.46646+s*(36000.76983+s*3032e-7)),o=357.52911+s*(35999.05029-1537e-7*s),a=.016708634-s*(42037e-9+1267e-10*s),l=Math.sin(o*Pt)*(1.914602-s*(.004817+14e-6*s))+Math.sin(2*o*Pt)*(.019993-101e-6*s)+Math.sin(3*o*Pt)*289e-6,c=r+l,h=125.04-1934.136*s,u=c-.00569-.00478*Math.sin(h*Pt),d=23+(26+(21.448-s*(46.815+s*(59e-5-s*.001813)))/60)/60+.00256*Math.cos(h*Pt),g=Math.asin(Math.sin(d*Pt)*Math.sin(u*Pt))*dn,S=Math.tan(d/2*Pt)**2,p=4*dn*(S*Math.sin(2*r*Pt)-2*a*Math.sin(o*Pt)+4*a*S*Math.sin(o*Pt)*Math.cos(2*r*Pt)-.5*S*S*Math.sin(4*r*Pt)-1.25*a*a*Math.sin(2*o*Pt)),m=i.getUTCHours()*60+i.getUTCMinutes()+i.getUTCSeconds()/60;let y=rl(m+p+4*e,1440)/4-180;y<-180&&(y+=360);const x=Gh(g,y,t);return x.altitude+=Wh(x.altitude),{...x,declination:g,eqTime:p}}function Av(i,t,e){const n=sl(i)-24515435e-1,s=Xn(125.1228-.0529538083*n),r=5.1454,o=Xn(318.0634+.1643573223*n),a=60.2666,l=.0549,c=Xn(115.3654+13.0649929509*n);let h=c+dn*l*Math.sin(c*Pt)*(1+l*Math.cos(c*Pt));for(let wt=0;wt<5;wt++)h=h-(h-dn*l*Math.sin(h*Pt)-c)/(1-l*Math.cos(h*Pt));const u=a*(Math.cos(h*Pt)-l),f=a*Math.sqrt(1-l*l)*Math.sin(h*Pt),d=Math.atan2(f,u)*dn,g=Math.hypot(u,f),S=g*(Math.cos(s*Pt)*Math.cos((d+o)*Pt)-Math.sin(s*Pt)*Math.sin((d+o)*Pt)*Math.cos(r*Pt)),p=g*(Math.sin(s*Pt)*Math.cos((d+o)*Pt)+Math.cos(s*Pt)*Math.sin((d+o)*Pt)*Math.cos(r*Pt)),m=g*Math.sin((d+o)*Pt)*Math.sin(r*Pt);let w=Math.atan2(p,S)*dn,y=Math.atan2(m,Math.hypot(S,p))*dn;const x=Xn(356.047+.9856002585*n),L=282.9404+470935e-10*n,D=x+L,A=c+o+s,I=A-D,z=A-s;w+=-1.274*Math.sin((c-2*I)*Pt)+.658*Math.sin(2*I*Pt)-.186*Math.sin(x*Pt)-.059*Math.sin((2*c-2*I)*Pt)-.057*Math.sin((c-2*I+x)*Pt)+.053*Math.sin((c+2*I)*Pt)+.046*Math.sin((2*I-x)*Pt)+.041*Math.sin((c-x)*Pt)-.035*Math.sin(I*Pt)-.031*Math.sin((c+x)*Pt),y+=-.173*Math.sin((z-2*I)*Pt)-.055*Math.sin((c-z-2*I)*Pt)-.046*Math.sin((c+z-2*I)*Pt)+.033*Math.sin((z+2*I)*Pt)+.017*Math.sin((2*c+z)*Pt);const _=23.4393-3563e-10*n,E=Math.cos(w*Pt)*Math.cos(y*Pt),k=Math.sin(w*Pt)*Math.cos(y*Pt),q=Math.sin(y*Pt),K=k*Math.cos(_*Pt)-q*Math.sin(_*Pt),tt=k*Math.sin(_*Pt)+q*Math.cos(_*Pt),Z=Math.atan2(K,E)*dn,lt=Math.atan2(tt,Math.hypot(E,K))*dn,Q=Xn(D+180),xt=i.getUTCHours()+i.getUTCMinutes()/60+i.getUTCSeconds()/3600,yt=Q+xt*15.04107+e,pt=rl(yt-Z+180,360)-180,Bt=Gh(lt,pt,t);Bt.altitude-=Math.asin(1/g)*dn*Math.cos(Bt.altitude*Pt),Bt.altitude+=Wh(Bt.altitude);const qt=Xn(w-D),rt=qt/360,dt=(1-Math.cos(qt*Pt))/2;return{...Bt,phase:rt,illumination:dt}}function Gh(i,t,e){const n=e*Pt,s=i*Pt,r=t*Pt,o=Math.sin(n)*Math.sin(s)+Math.cos(n)*Math.cos(s)*Math.cos(r),a=Math.asin(Rv(o,-1,1)),l=Math.atan2(Math.sin(r),Math.cos(r)*Math.sin(n)-Math.tan(s)*Math.cos(n));return{altitude:a*dn,azimuth:Xn(l*dn+180)}}function Wh(i){if(i>85)return 0;const t=Math.tan(i*Pt);return i>5?(58.1/t-.07/t**3+86e-6/t**5)/3600:i>-.575?(1735+i*(-518.2+i*(103.4+i*(-12.79+i*.711))))/3600:-20.774/t/3600}function Cv(i,t){const e=sl(i)-2451545;return Xn(280.46061837+360.98564736629*e+t)}function Rc(i,t,e){const n=i*Pt,s=t*Pt;return e.set(Math.cos(n)*Math.sin(s),Math.sin(n),-Math.cos(n)*Math.cos(s)),e}function rl(i,t){return(i%t+t)%t}function Xn(i){return rl(i,360)}function Rv(i,t,e){return Math.min(e,Math.max(t,i))}const Da=636e4,Pv=646e4,Dv=[5802e-9,13558e-9,331e-7],Lv=[65e-8,1881e-9,85e-9],Iv=8e3,Uv=1200;function Xh(i,t,e){const n=i[0]*t[0]+i[1]*t[1]+i[2]*t[2],s=i[0]*i[0]+i[1]*i[1]+i[2]*i[2]-e*e,r=n*n-s;if(r<0)return[1e9,-1e9];const o=Math.sqrt(r);return[-n-o,-n+o]}const Fo=.004;function Pc(i,t){const e=[0,Da+20,0];if(Xh(e,i,Da)[0]>0){const s=Math.max(0,1+i[1]/.01);if(s<=0)return[0,0,0];const r=Math.hypot(i[0],i[2])||1,o=Math.sqrt(1-Fo*Fo)/r;return Dc(e,[i[0]*o,Fo,i[2]*o],t).map(a=>a*s)}return Dc(e,i,t)}function Dc(i,t,e){const n=Xh(i,t,Pv),s=64,r=n[1]/s,o=[0,0,0];for(let a=0;a<s;a++){const l=(a+.5)*r,c=[i[0]+t[0]*l,i[1]+t[1]*l,i[2]+t[2]*l],h=Math.max(0,Math.hypot(c[0],c[1],c[2])-Da),u=Math.exp(-h/Iv),f=Math.exp(-h/Uv),d=Math.max(0,1-Math.abs(h-25e3)/15e3);for(let g=0;g<3;g++)o[g]+=(Dv[g]*u+e*1.11*f+Lv[g]*d)*r}return o.map(a=>Math.exp(-a))}class Nv{constructor(t,e,{lat:n,lon:s}){this.scene=t,this.sky=e,this.lat=n,this.lon=s,this.sunIntensity=20,this.mieBeta=4e-6,this.sun=new bc(16777215,1),this.sun.castShadow=!0;const r=this.sun.shadow.camera;r.left=-110,r.right=110,r.top=110,r.bottom=-110,r.near=1,r.far=1200,this.sun.shadow.mapSize.set(4096,4096),this.sun.shadow.bias=-4e-4,this.sun.shadow.normalBias=.06,t.add(this.sun,this.sun.target),this.moon=new bc(16777215,0),this.moon.castShadow=!0,Object.assign(this.moon.shadow.camera,{left:-90,right:90,top:90,bottom:-90,near:1,far:1200}),this.moon.shadow.mapSize.set(2048,2048),this.moon.shadow.bias=-5e-4,this.moon.shadow.normalBias=.08,t.add(this.moon,this.moon.target),this.sunDir=new P,this.moonDir=new P,this.state={}}setTime(t,e=new P){const n=Vh(t,this.lat,this.lon),s=Av(t,this.lat,this.lon);Rc(n.altitude,n.azimuth,this.sunDir),Rc(s.altitude,s.azimuth,this.moonDir);const r=Pc([this.sunDir.x,this.sunDir.y,this.sunDir.z],this.mieBeta),o=Pc([this.moonDir.x,this.moonDir.y,this.moonDir.z],this.mieBeta);this.sun.color.setRGB(r[0],r[1],r[2]),this.sun.intensity=this.sunIntensity*1,this.sun.position.copy(e).addScaledVector(this.sunDir,600),this.sun.target.position.copy(e),this.sun.visible=n.altitude>-1.2;const a=this.sunIntensity*25e-7*Math.pow(s.illumination,1.6);this.moon.color.setRGB(o[0],o[1]*.98,o[2]*.95),this.moon.intensity=a,this.moon.position.copy(e).addScaledVector(this.moonDir,600),this.moon.target.position.copy(e),this.moon.visible=s.altitude>-.5&&n.altitude<2;const l=this.sky.uniforms;return l.uSunDir.value.copy(this.sunDir),l.uMoonDir.value.copy(this.moonDir),l.uMoonIllum.value=s.illumination,l.uMoonPhase.value=s.phase,l.uSunIntensity.value=this.sunIntensity,l.uMieBeta.value=this.mieBeta,l.uStars.value=Rn.smoothstep(-n.altitude,4,14),this.state={sun:n,moon:s,tSun:r,tMoon:o},this.state}exposure(){const{sun:t,moon:e,tSun:n}=this.state,s=Math.PI/180,r=.2126*n[0]+.7152*n[1]+.0722*n[2],o=Math.max(0,Math.sin(t.altitude*s))*r,a=(this.sky.skyIrradiance??0)/this.sunIntensity,l=e.altitude>0?25e-7*Math.pow(e.illumination,1.6)*(Math.sin(e.altitude*s)+.15):0,c=o+a+l+1e-8;return this.state.e=c,Math.PI/this.sunIntensity*Math.pow(.25,.12)/Math.pow(c,.88)}}function Qt(i,t,e=0){let n=i*374761393+t*668265263+e*2147483647|0;return n=Math.imul(n^n>>>13,1274126177),n^=n>>>16,(n>>>0)/4294967296}function Lc(i){return i*i*i*(i*(i*6-15)+10)}function Ts(i,t,e=0){const n=Math.floor(i),s=Math.floor(t),r=i-n,o=t-s,a=Lc(r),l=Lc(o),c=Qt(n,s,e),h=Qt(n+1,s,e),u=Qt(n,s+1,e),f=Qt(n+1,s+1,e);return c+(h-c)*a+(u-c)*l+(c-h-u+f)*a*l}function Yn(i,t,e,n=0){let s=0,r=.5,o=1;for(let a=0;a<e;a++)s+=r*(Ts(i*o,t*o,n+a*17)*2-1),o*=2.03,r*=.5;return s}function Ic(i,t,e,n=0,s={}){const r=Math.floor(i/e),o=Math.floor(t/e);let a=1e9,l=1e9,c=0,h=0,u=0,f=0,d=0,g=0,S=0,p=0;for(let D=-1;D<=1;D++)for(let A=-1;A<=1;A++){const I=r+A,z=o+D,_=(I+.1+.8*Qt(I,z,n))*e,E=(z+.1+.8*Qt(I,z,n+1))*e,k=Math.hypot(i-_,t-E);k<a?(l=a,u=c,f=h,S=d,p=g,a=k,c=I,h=z,d=_,g=E):k<l&&(l=k,u=I,f=z,S=_,p=E)}const m=(d+S)/2,w=(g+p)/2,y=S-d,x=p-g,L=Math.hypot(y,x)||1;return s.edge=((m-i)*y+(w-t)*x)/L,s.d1=a,s.id1x=c,s.id1z=h,s.id2x=u,s.id2z=f,s.tx=-x/L,s.tz=y/L,s}function cn(i,t=!1){const e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},o={},a=i[0].morphTargetsRelative,l=new ce;let c=0;for(let h=0;h<i.length;++h){const u=i[h];let f=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const d in u.attributes){if(!n.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+d+'" attribute exists among all geometries, or in none of them.'),null;r[d]===void 0&&(r[d]=[]),r[d].push(u.attributes[d]),f++}if(f!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const d in u.morphAttributes){if(!s.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;o[d]===void 0&&(o[d]=[]),o[d].push(u.morphAttributes[d])}if(t){let d;if(e)d=u.index.count;else if(u.attributes.position!==void 0)d=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,d,h),c+=d}}if(e){let h=0;const u=[];for(let f=0;f<i.length;++f){const d=i[f].index;for(let g=0;g<d.count;++g)u.push(d.getX(g)+h);h+=i[f].attributes.position.count}l.setIndex(u)}for(const h in r){const u=Uc(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,u)}for(const h in o){const u=o[h][0].length;if(u===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let f=0;f<u;++f){const d=[];for(let S=0;S<o[h].length;++S)d.push(o[h][S][f]);const g=Uc(d);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(g)}}return l}function Uc(i){let t,e,n,s=-1,r=0;for(let c=0;c<i.length;++c){const h=i[c];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*e}const o=new t(r),a=new xe(o,e,n);let l=0;for(let c=0;c<i.length;++c){const h=i[c];if(h.isInterleavedBufferAttribute){const u=l/e;for(let f=0,d=h.count;f<d;f++)for(let g=0;g<e;g++){const S=h.getComponent(f,g);a.setComponent(f+u,g,S)}}else o.set(h.array,l);l+=h.count*e}return s!==void 0&&(a.gpuType=s),a}function Yh(i,t=1e-4){t=Math.max(t,Number.EPSILON);const e={},n=i.getIndex(),s=i.getAttribute("position"),r=n?n.count:s.count;let o=0;const a=Object.keys(i.attributes),l={},c={},h=[],u=["getX","getY","getZ","getW"],f=["setX","setY","setZ","setW"];for(let w=0,y=a.length;w<y;w++){const x=a[w],L=i.attributes[x];l[x]=new L.constructor(new L.array.constructor(L.count*L.itemSize),L.itemSize,L.normalized);const D=i.morphAttributes[x];D&&(c[x]||(c[x]=[]),D.forEach((A,I)=>{const z=new A.array.constructor(A.count*A.itemSize);c[x][I]=new A.constructor(z,A.itemSize,A.normalized)}))}const d=t*.5,g=Math.log10(1/t),S=Math.pow(10,g),p=d*S;for(let w=0;w<r;w++){const y=n?n.getX(w):w;let x="";for(let L=0,D=a.length;L<D;L++){const A=a[L],I=i.getAttribute(A),z=I.itemSize;for(let _=0;_<z;_++)x+=`${~~(I[u[_]](y)*S+p)},`}if(x in e)h.push(e[x]);else{for(let L=0,D=a.length;L<D;L++){const A=a[L],I=i.getAttribute(A),z=i.morphAttributes[A],_=I.itemSize,E=l[A],k=c[A];for(let q=0;q<_;q++){const K=u[q],tt=f[q];if(E[tt](o,I[K](y)),z)for(let Z=0,lt=z.length;Z<lt;Z++)k[Z][tt](o,z[Z][K](y))}}e[x]=o,h.push(o),o++}}const m=i.clone();for(const w in i.attributes){const y=l[w];if(m.setAttribute(w,new y.constructor(y.array.slice(0,o*y.itemSize),y.itemSize,y.normalized)),w in c)for(let x=0;x<c[w].length;x++){const L=c[w][x];m.morphAttributes[w][x]=new L.constructor(L.array.slice(0,o*L.itemSize),L.itemSize,L.normalized)}}return m.setIndex(h),m}const Fv=150,Ov=38;class zv{constructor({ship:t}){this.ship=t,this.v1={},this.v2={}}hullSDF(t,e){const n=this.ship,s=Math.cos(n.heading),r=Math.sin(n.heading),o=t-n.x,a=e-n.z,l=o*r-a*s,c=o*s+a*r,h=n.halfLength,u=Math.min(1,Math.abs(l)/h),f=n.halfBeam*Math.sqrt(Math.max(0,1-Math.pow(u,l>0?2.2:3))),d=Math.abs(l)-h;return d>0?Math.hypot(d,Math.max(0,Math.abs(c)-.3)):Math.abs(c)-f}sample(t,e,n={}){const s=t+Yn(t*.006,e*.006,3,11)*45,r=e+Yn(t*.006,e*.006,3,23)*45,o=Ic(s,r,Fv,7,this.v1),l=Qt(o.id1x,o.id1z,3)<.07;let c=l?.04:.28+.35*Qt(o.id1x,o.id1z,5);l||(c+=.12*Yn(t*.03,e*.03,3,31)+.05*Yn(t*.22,e*.09,2,41));let h=0;const u=Nc(o.id1x,o.id1z,o.id2x,o.id2z);if(Qt(u,0,19)<.62){const p=o.tx*t+o.tz*e,m=.7+3.2*Math.pow(Qt(u,1,19),1.6),w=.45+.55*(.5+.5*Yn(p*.03,u*.7,3,29)),y=m*w,x=2.2+y*1.4,L=Math.abs(o.edge)+Yn(t*.2,e*.2,2,37)*.9;if(L<x){const D=1-L/x,A=Math.pow(D,.9),I=Ts(t*.45,e*.45,43),z=Ts(t*1.1+3.1,e*1.1,47),_=.45+.6*I+.2*z;h=y*(.55*A*A*(3-2*A)+.45*A*_)}}const f=Ic(s+500,r-300,Ov,13,this.v2),d=Nc(f.id1x,f.id1z,f.id2x,f.id2z);if(!l&&Qt(d,2,23)<.3){const p=.25+.9*Qt(d,3,23),m=1.2+p,w=Math.abs(f.edge);w<m&&(h=Math.max(h,p*(1-w/m)*(.6+.6*Ts(t*1.1,e*1.1,53))))}const g=this.hullSDF(t,e);let S=0;if(g<14){const p=Math.max(0,1-Math.max(g,0)/14),m=Ts(t*.9,e*.9,59);S=(.4+1.1*p*p)*(.5+.7*m)*p}return c+=Math.max(h,S),g<.1&&(c=Math.min(c,.15)),n.h=c,n.ridge=Math.max(h,S),n.lead=l?1:0,n.hullDist=g,n}buildMesh(t){const r=S=>3200*(.08*S+.92*S*S*S),o=new Float32Array(2435403),a=new Float32Array(901*901*3),l={};let c=0;const h=this.ship.x,u=this.ship.z;for(let S=0;S<=900;S++){const p=u+r(S/900*2-1);for(let m=0;m<=900;m++){const w=h+r(m/900*2-1);this.sample(w,p,l),o[c]=w,o[c+1]=l.h,o[c+2]=p,a[c]=Math.min(1,l.ridge/2.5),a[c+1]=l.lead,a[c+2]=0,c+=3}}const f=new Uint32Array(900*900*6);c=0;for(let S=0;S<900;S++)for(let p=0;p<900;p++){const m=S*901+p;f[c++]=m,f[c++]=m+900+1,f[c++]=m+1,f[c++]=m+1,f[c++]=m+900+1,f[c++]=m+900+2}const d=new ce;d.setAttribute("position",new xe(o,3)),d.setAttribute("color",new xe(a,3)),d.setIndex(new xe(f,1)),d.computeVertexNormals(),d.computeBoundingSphere();const g=new be(d,t);return g.receiveShadow=!0,g.castShadow=!0,g}buildFar(t){const e=new nl(3100,6e4,256,8);e.rotateX(-Math.PI/2);const n=e.attributes.position.count,s=new Float32Array(n*3),r=e.attributes.position;for(let a=0;a<n;a++)r.setY(a,.35),r.setX(a,r.getX(a)+this.ship.x),r.setZ(a,r.getZ(a)+this.ship.z);e.setAttribute("color",new xe(s,3)),e.computeVertexNormals();const o=new be(e,t);return o.receiveShadow=!1,o}buildBlocks(t,{radius:e=380,step:n=1.2,max:s=16e3,clearings:r=[],pillowMaterial:o=t}={}){const a={};let l=[];const c=this.ship.x,h=this.ship.z;for(let z=-e;z<=e;z+=n){for(let _=-e;_<=e;_+=n){const E=c+_+(Qt(_*10,z*10,71)-.5)*n,k=h+z+(Qt(_*10,z*10,73)-.5)*n,q=Math.hypot(E-c,k-h);if(q>e||(this.sample(E,k,a),a.hullDist<1.2)||r.some(([tt,Z,lt])=>Math.hypot(E-tt,k-Z)<lt))continue;const K=Math.min(1,a.ridge/1.6)*.85*(q<150?1:.6);if(!(a.ridge<.4||Qt(E*7,k*7,79)>K)&&(l.push({x:E,z:k,h:a.h,ridge:a.ridge,seed:Qt(E*3,k*3,83)}),l.length>=s))break}if(l.length>=s)break}const u=6,f=[];for(let z=0;z<u;z++)f.push(kv(z));const d=l.filter(z=>Qt(z.x*5.1,z.z*5.1,131)>.42),g=new Set(d);l=l.filter(z=>!g.has(z));const S=f.map(()=>[]);l.forEach(z=>S[Math.floor(z.seed*u)%u].push(z));const p=new Cn,m=new se,w=new Pn,y=new Dn,x=new P,L=new P;S.forEach((z,_)=>{if(!z.length)return;const E=new fc(f[_],t,z.length);z.forEach((k,q)=>{const K=Qt(k.x*13,k.z*13,89),tt=Qt(k.x*17,k.z*17,97),Z=Math.min(3.4,1+Math.min(3,k.ridge)*(.4+.5*K));x.set(Z*(.8+.6*tt),.4+.9*k.seed*k.seed,Z*(.55+.45*K));const lt=(.25+.7*K)*(tt>.5?1:-1),Q=lt*(tt>.3?1:.3);y.set(Q,tt*Math.PI*2,lt*.4*(k.seed-.5)),w.setFromEuler(y);const xt=.5*x.z*Math.abs(Math.sin(Q))+.5*x.x*Math.abs(Math.sin(lt*.4*(k.seed-.5)));L.set(k.x,k.h-.3*x.y-.6*xt,k.z),m.compose(L,w,x),E.setMatrixAt(q,m)}),E.castShadow=!0,E.receiveShadow=!0,E.instanceMatrix.needsUpdate=!0,p.add(E)});const D=4,A=[];for(let z=0;z<D;z++)A.push(Bv(z,2));const I=A.map(()=>[]);for(const z of d){const _=2+Math.floor(Qt(z.x*3.7,z.z*3.7,137)*3);for(let E=0;E<_;E++){const k=(Qt(z.x*7+E,z.z,139)-.5)*2.4,q=(Qt(z.x,z.z*7+E,149)-.5)*2.4,K=z.x+k,tt=z.z+q;if(r.some(([Q,xt,yt])=>Math.hypot(K-Q,tt-xt)<yt))continue;const Z=Math.exp((Qt(K*9,tt*9,151)-.55)*2.6),lt=Math.min(2.8,.3+.65*Z*Math.min(1.5,.5+z.ridge*.45));I[(E+Math.floor(z.seed*D))%D].push({x:K,z:tt,h:z.h,size:lt,seed:Qt(K*13,tt*13,157)})}}return I.forEach((z,_)=>{if(!z.length)return;const E=new fc(A[_],o,z.length);z.forEach((k,q)=>{const K=k.seed;x.set(k.size*(1+.6*K),k.size*(.22+.26*Qt(k.x,k.z,163)),k.size*(.9+.5*(1-K))),y.set((K-.5)*.3,K*6.28,(Qt(k.z,k.x,167)-.5)*.3),w.setFromEuler(y),L.set(k.x,k.h-.42*x.y,k.z),m.compose(L,w,x),E.setMatrixAt(q,m)}),E.castShadow=!0,E.receiveShadow=!0,E.instanceMatrix.needsUpdate=!0,p.add(E)}),console.log("rubble: slabs",l.length,"pillows",I.reduce((z,_)=>z+_.length,0)),p}}function Bv(i,t=2){const e=new el(1,t),n=e.attributes.position,s=new P;for(let o=0;o<n.count;o++){s.fromBufferAttribute(n,o);const a=Yn(s.x*1.7+i*3.3,s.z*1.7+s.y*1.3,3,211+i),l=Yn(s.x*4.1-i,s.z*4.1+s.y*3.7,2,223+i);s.multiplyScalar(1+.32*a+.08*l),s.y<0&&(s.y*=.35),s.y+=Math.max(0,Math.abs(s.x)-.6)*-.15,n.setXYZ(o,s.x,s.y,s.z)}e.deleteAttribute("normal"),e.deleteAttribute("uv");const r=Yh(e,1e-4);return r.computeVertexNormals(),r}function kv(i){const t=new fe(1,1,1,8,5,8),e=t.attributes.position,n=new P,s=.07;for(let r=0;r<e.count;r++){n.fromBufferAttribute(e,r);const o=new P(Rn.clamp(n.x,-.5+s,.5-s),Rn.clamp(n.y,-.5+s*.8,.5-s*.8),Rn.clamp(n.z,-.5+s,.5-s)),a=n.clone().sub(o);a.lengthSq()>0&&a.normalize().multiplyScalar(s),n.copy(o).add(a);const l=Yn(n.x*2.3+i*7.1,n.z*2.3+n.y*1.7,3,101+i),c=a.lengthSq()>0?a.clone().normalize():new P(0,1,0);n.addScaledVector(c,l*.05),n.y>.25&&(n.y+=.12*(1-Math.min(1,Math.hypot(n.x,n.z)*1.7))*(.7+l)),n.x*=1+.15*Math.sin(i*3+n.z*3),e.setXYZ(r,n.x,n.y,n.z)}return t.computeVertexNormals(),Hv(t)}function Hv(i){i.deleteAttribute("uv"),i.deleteAttribute("normal");const t=Yh(i,1e-4);return t.computeVertexNormals(),t}function Nc(i,t,e,n){const s=i*73856093^t*19349663,r=e*73856093^n*19349663;return(Math.min(s,r)*31+Math.max(s,r))%1000003}const qh=`
float h12(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float h13(vec3 p3) { p3 = fract(p3 * 0.1031); p3 += dot(p3, p3.zyx + 31.32); return fract((p3.x + p3.y) * p3.z); }
vec3 h33(vec3 p3) { p3 = fract(p3 * vec3(0.1031, 0.1030, 0.0973)); p3 += dot(p3, p3.yxz + 33.33); return fract((p3.xxy + p3.yxx) * p3.zyx); }
// value noise with analytic derivative: returns (value, d/dx, d/dy)
vec3 vnoised(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  vec2 du = 30.0 * f * f * (f * (f - 2.0) + 1.0);
  float a = h12(i), b = h12(i + vec2(1, 0)), c = h12(i + vec2(0, 1)), d = h12(i + vec2(1, 1));
  float k1 = b - a, k2 = c - a, k4 = a - b - c + d;
  return vec3(a + k1 * u.x + k2 * u.y + k4 * u.x * u.y, du * vec2(k1 + k4 * u.y, k2 + k4 * u.x));
}
`,Vv=`
vec4 cwp = modelMatrix * mvPosition;
vWorldPos = cwp.xyz;
vec2 cd = cwp.xz - cameraPosition.xz;
cwp.y -= dot(cd, cd) / (2.0 * 7.31e6);
mvPosition = viewMatrix * cwp;
`,jh={uSkyCube:{value:null},uFogDist:{value:9e4},uHazeDist:{value:28e3}},Gv=`
{
  vec3 fv = vWorldPos - cameraPosition;
  float fd = length(fv);
  vec3 fdir = fv / max(fd, 1e-3);
  vec3 sd = normalize(vec3(fdir.x, max(fdir.y, 0.0) * 0.5 + 0.004, fdir.z));
  vec3 skyC = textureCube(uSkyCube, sd).rgb;
  float tr = exp(-fd / uFogDist) * mix(exp(-fd / uHazeDist), 1.0, smoothstep(0.0, 60.0, vWorldPos.y));
  gl_FragColor.rgb = gl_FragColor.rgb * tr + skyC * (1.0 - tr);
}`;function ol(i){Object.assign(i.uniforms,jh),i.vertexShader=i.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vWorldPos;`).replace("#include <project_vertex>",Gt.project_vertex.replace("mvPosition = modelViewMatrix * mvPosition;",Vv)),i.fragmentShader=i.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vWorldPos;
uniform samplerCube uSkyCube;
uniform float uFogDist;
uniform float uHazeDist;`).replace("#include <fog_fragment>",`#include <fog_fragment>
`+Gv)}const Fc="RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );",al={uWindDir:{value:new ut(.8,.6).normalize()},uGlint:{value:1},uTime:{value:0},uDebug:{value:0}};function Wv(){const i=new ge({color:16777215,roughness:.82,metalness:0,vertexColors:!0});return i.onBeforeCompile=t=>{Object.assign(t.uniforms,al),ol(t),t.fragmentShader=t.fragmentShader.replace("#include <common>",`#include <common>
uniform vec2 uWindDir;
uniform float uGlint;
uniform float uDebug;
${qh}
vec3 gWorldN;
float gLead;
float gRidge;
float gDist;
float gFoot;
vec3 geometryNormalOut;
`).replace("#include <lights_physical_pars_fragment>",`#include <lights_physical_pars_fragment>
vec3 snowGlint(IncidentLight dl, vec3 viewDir) {
  if (gLead > 0.5 || uGlint <= 0.0) return vec3(0.0);
  // Choose a grain cell size near the pixel footprint (power-of-two levels) to avoid shimmer
  float fp = gFoot;
  float lvl = max(0.0, ceil(log2(max(fp * 0.9, 1e-4) / 0.012)));
  float cell = 0.012 * exp2(lvl);
  vec3 p = vWorldPos / cell;
  vec3 c = floor(p);
  float h = h13(c + 17.0);
  if (h > 0.22) return vec3(0.0);
  vec3 r = h33(c) - 0.5;
  vec3 fw = normalize(gWorldN + r * 1.3);
  vec3 fv = normalize((viewMatrix * vec4(fw, 0.0)).xyz);
  vec3 H = normalize(dl.direction + viewDir);
  float d = dot(fv, H);
  float g = smoothstep(0.99935, 0.99995, d);
  // grain must be inside its cell footprint (a sphere) to read as a point
  vec3 f = fract(p) - 0.5 - r * 0.4;
  float spot = smoothstep(0.5, 0.15, length(f));
  return dl.color * g * spot * 70.0 * uGlint * max(dot(geometryNormalOut, dl.direction), 0.0);
}
`).replace("#include <color_fragment>",`#include <color_fragment>
gRidge = vColor.r; gLead = vColor.g;
gDist = length(vWorldPos - cameraPosition);
gFoot = length(fwidth(vWorldPos));
{
  vec3 wn = normalize(inverseTransformDirection(normalize(vNormal), viewMatrix));
  float steep = 1.0 - smoothstep(0.55, 0.9, wn.y);
  vec3 snow = vec3(0.94, 0.955, 0.975);
  vec3 iceBlue = vec3(0.50, 0.70, 0.78);
  vec3 young = vec3(0.30, 0.355, 0.40);
  float n = vnoised(vWorldPos.xz * 0.15).x;
  vec3 alb = mix(snow, iceBlue, steep * smoothstep(0.1, 0.6, gRidge) * (0.55 + 0.45 * n));
  alb = mix(alb, young + 0.08 * n, gLead);
  // faint dirty/wind-crust variation
  alb *= 0.97 + 0.03 * vnoised(vWorldPos.xz * 0.9).x;
  diffuseColor.rgb = alb;
}`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
roughnessFactor = mix(0.82, 0.32, gLead);`).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
{
  // Sastrugi (wind-aligned ridges, ~1–3 m) and surface grain, as a bump on the world normal.
  vec2 w = uWindDir;
  vec2 q = vec2(dot(vWorldPos.xz, w), dot(vWorldPos.xz, vec2(-w.y, w.x)));
  float fade = 1.0 - smoothstep(60.0, 260.0, gDist);
  float fade2 = 1.0 - smoothstep(6.0, 40.0, gDist);
  vec3 s1 = vnoised(vec2(q.x * 0.35, q.y * 1.6));
  vec3 s2 = vnoised(vec2(q.x * 1.3, q.y * 4.0) + 7.0);
  vec3 s3 = vnoised(vWorldPos.xz * 9.0);
  vec2 gq = (s1.yz * vec2(0.35, 1.6) * 0.075 + s2.yz * vec2(1.3, 4.0) * 0.018) * fade + s3.yz * 9.0 * 0.004 * fade2;
  gq *= (1.0 - gLead * 0.85);
  // patchy: wind-scoured smooth crust alternates with fields of sastrugi
  float scour = smoothstep(0.25, 0.75, vnoised(vWorldPos.xz * 0.018 + 3.0).x);
  gq *= 0.25 + 0.95 * scour;
  // rotate gradient back to world xz
  vec2 gw = w * gq.x + vec2(-w.y, w.x) * gq.y;
  vec3 wn = normalize(inverseTransformDirection(normal, viewMatrix));
  wn = normalize(wn - vec3(gw.x, 0.0, gw.y));
  gWorldN = wn;
  normal = normalize((viewMatrix * vec4(wn, 0.0)).xyz);
  geometryNormalOut = normal;
}`).replace("#include <dithering_fragment>",`#include <dithering_fragment>
if (uDebug > 0.5) gl_FragColor = vec4(gWorldN * 0.5 + 0.5, 1.0);`).replace("#include <lights_fragment_begin>",Gt.lights_fragment_begin.replaceAll(Fc,Fc+`
		reflectedLight.directSpecular += snowGlint(directLight, geometryViewDir);`))},i}function Xv(){const i=new ge({color:16777215,roughness:.4,metalness:0});return i.onBeforeCompile=t=>{ol(t),t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vObjPos;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vObjPos = position;`),t.fragmentShader=t.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vObjPos;
${qh}
float gCap;`).replace("#include <color_fragment>",`#include <color_fragment>
{
  vec3 wn = normalize(inverseTransformDirection(normalize(vNormal), viewMatrix));
  float n = vnoised(vWorldPos.xz * 3.0 + vWorldPos.y * 2.0).x;
  gCap = smoothstep(0.35, 0.7, wn.y + (n - 0.5) * 0.5);
  vec3 ice = mix(vec3(0.70, 0.80, 0.82), vec3(0.88, 0.92, 0.93), n);
  // layered floe: lighter top, banded, darker bottom (sea-water stained)
  float band = smoothstep(-0.5, 0.5, vObjPos.y);
  ice *= 0.78 + 0.22 * band;
  diffuseColor.rgb = mix(ice, vec3(0.94, 0.955, 0.975), gCap);
}`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
roughnessFactor = mix(0.55, 0.85, gCap);`).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
{
  vec3 wn = normalize(inverseTransformDirection(normal, viewMatrix));
  vec3 a = vnoised(vWorldPos.xz * 2.2 + vWorldPos.y * 1.3);
  vec3 b = vnoised(vWorldPos.zy * 2.6 + 11.0);
  vec3 c = vnoised(vWorldPos.xz * 11.0);
  vec3 bump = vec3(a.y * 0.05 + c.y * 0.02, b.y * 0.04, a.z * 0.05 + c.z * 0.02);
  wn = normalize(wn - bump * (1.0 - smoothstep(20.0, 120.0, length(vWorldPos - cameraPosition))));
  normal = normalize((viewMatrix * vec4(wn, 0.0)).xyz);
}`).replace("#include <lights_fragment_end>",`#include <lights_fragment_end>
// translucency: light passing through thin ice edges picks up blue-green
reflectedLight.indirectDiffuse += (1.0 - gCap) * diffuseColor.rgb * vec3(0.15, 0.4, 0.45) * reflectedLight.indirectDiffuse * 0.35;`)},i}function Yv(i){const t=i.onBeforeCompile;return i.onBeforeCompile=(e,n)=>{t&&t(e,n),ol(e)},i}const Zh={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class Hs{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const qv=new ja(-1,1,1,-1,0,1);class jv extends ce{constructor(){super(),this.setAttribute("position",new Yt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Yt([0,2,0,0,2,0],2))}}const Zv=new jv;class Kh{constructor(t){this._mesh=new be(Zv,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,qv)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}}class $h extends Hs{constructor(t,e){super(),this.textureID=e!==void 0?e:"tDiffuse",t instanceof Ee?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=Ir.clone(t.uniforms),this.material=new Ee({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this.fsQuad=new Kh(this.material)}render(t,e,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this.fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class Oc extends Hs{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,n){const s=t.getContext(),r=t.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let o,a;this.inverse?(o=0,a=1):(o=1,a=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,o,4294967295),r.buffers.stencil.setClear(a),r.buffers.stencil.setLocked(!0),t.setRenderTarget(n),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}}class Kv extends Hs{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}}class $v{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){const n=t.getSize(new ut);this._width=n.width,this._height=n.height,e=new on(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:pn}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new $h(Zh),this.copyPass.material.blending=Zn,this.clock=new zh}swapBuffers(){const t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){const e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){t===void 0&&(t=this.clock.getDelta());const e=this.renderer.getRenderTarget();let n=!1;for(let s=0,r=this.passes.length;s<r;s++){const o=this.passes[s];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),o.render(this.renderer,this.writeBuffer,this.readBuffer,t,n),o.needsSwap){if(n){const a=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),l.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}Oc!==void 0&&(o instanceof Oc?n=!0:o instanceof Kv&&(n=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){const e=this.renderer.getSize(new ut);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;const n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class Jv extends Hs{constructor(t,e,n=null,s=null,r=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new Wt}render(t,e,n){const s=t.autoClear;t.autoClear=!1;let r,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(r=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),t.autoClear=s}}const Qv={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Wt(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class us extends Hs{constructor(t,e,n,s){super(),this.strength=e!==void 0?e:1,this.radius=n,this.threshold=s,this.resolution=t!==void 0?new ut(t.x,t.y):new ut(256,256),this.clearColor=new Wt(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new on(r,o,{type:pn}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let u=0;u<this.nMips;u++){const f=new on(r,o,{type:pn});f.texture.name="UnrealBloomPass.h"+u,f.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(f);const d=new on(r,o,{type:pn});d.texture.name="UnrealBloomPass.v"+u,d.texture.generateMipmaps=!1,this.renderTargetsVertical.push(d),r=Math.round(r/2),o=Math.round(o/2)}const a=Qv;this.highPassUniforms=Ir.clone(a.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Ee({uniforms:this.highPassUniforms,vertexShader:a.vertexShader,fragmentShader:a.fragmentShader}),this.separableBlurMaterials=[];const l=[3,5,7,9,11];r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let u=0;u<this.nMips;u++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(l[u])),this.separableBlurMaterials[u].uniforms.invSize.value=new ut(1/r,1/o),r=Math.round(r/2),o=Math.round(o/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=e,this.compositeMaterial.uniforms.bloomRadius.value=.1;const c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const h=Zh;this.copyUniforms=Ir.clone(h.uniforms),this.blendMaterial=new Ee({uniforms:this.copyUniforms,vertexShader:h.vertexShader,fragmentShader:h.fragmentShader,blending:Is,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new Wt,this.oldClearAlpha=1,this.basic=new Xa,this.fsQuad=new Kh(null)}dispose(){for(let t=0;t<this.renderTargetsHorizontal.length;t++)this.renderTargetsHorizontal[t].dispose();for(let t=0;t<this.renderTargetsVertical.length;t++)this.renderTargetsVertical[t].dispose();this.renderTargetBright.dispose();for(let t=0;t<this.separableBlurMaterials.length;t++)this.separableBlurMaterials[t].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(t,e){let n=Math.round(t/2),s=Math.round(e/2);this.renderTargetBright.setSize(n,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,s),this.renderTargetsVertical[r].setSize(n,s),this.separableBlurMaterials[r].uniforms.invSize.value=new ut(1/n,1/s),n=Math.round(n/2),s=Math.round(s/2)}render(t,e,n,s,r){t.getClearColor(this._oldClearColor),this.oldClearAlpha=t.getClearAlpha();const o=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),r&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=n.texture,t.setRenderTarget(null),t.clear(),this.fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this.fsQuad.render(t);let a=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this.fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=a.texture,this.separableBlurMaterials[l].uniforms.direction.value=us.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[l]),t.clear(),this.fsQuad.render(t),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=us.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[l]),t.clear(),this.fsQuad.render(t),a=this.renderTargetsVertical[l];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this.fsQuad.render(t),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(n),this.fsQuad.render(t)),t.setClearColor(this._oldClearColor,this.oldClearAlpha),t.autoClear=o}getSeperableBlurMaterial(t){const e=[];for(let n=0;n<t;n++)e.push(.39894*Math.exp(-.5*n*n/(t*t))/t);return new Ee({defines:{KERNEL_RADIUS:t},uniforms:{colorTexture:{value:null},invSize:{value:new ut(.5,.5)},direction:{value:new ut(.5,.5)},gaussianCoefficients:{value:e}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}getCompositeMaterial(t){return new Ee({defines:{NUM_MIPS:t},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}}us.BlurDirectionX=new ut(1,0);us.BlurDirectionY=new ut(0,1);const t_={uniforms:{tDiffuse:{value:null},uExposure:{value:1},uWhite:{value:new P(1,1,1)},uContrast:{value:1},uSaturation:{value:1},uNight:{value:0},uLook:{value:0},uVignette:{value:.35},uGrain:{value:.35},uTime:{value:0},uResolution:{value:new ut(1,1)}},vertexShader:`
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,fragmentShader:`
uniform sampler2D tDiffuse;
uniform float uExposure, uContrast, uSaturation, uLook, uVignette, uGrain, uTime, uNight;
uniform vec3 uWhite;
uniform vec2 uResolution;
varying vec2 vUv;

// AgX (Troy Sobotka), minimal fit — graceful highlight roll-off for snow + sun.
vec3 agxContrast(vec3 x) {
  vec3 x2 = x * x; vec3 x4 = x2 * x2;
  return 15.5 * x4 * x2 - 40.14 * x4 * x + 31.96 * x4 - 6.868 * x2 * x + 0.4298 * x2 + 0.1191 * x - 0.00232;
}
vec3 agx(vec3 c) {
  const mat3 m = mat3(0.842479062253094, 0.0423282422610123, 0.0423756549057051,
                      0.0784335999999992, 0.878468636469772, 0.0784336,
                      0.0792237451477643, 0.0791661274605434, 0.879142973793104);
  const mat3 mi = mat3(1.19687900512017, -0.0528968517574562, -0.0529716355144438,
                       -0.0980208811401368, 1.15190312990417, -0.0980434501171241,
                       -0.0990297440797205, -0.0989611768448433, 1.15107367264116);
  c = m * c;
  c = clamp(log2(max(c, 1e-10)), -12.47393, 4.026069);
  c = (c + 12.47393) / 16.5;
  c = agxContrast(c);
  // AgX 'Punchy' look (power 1.35): the base curve spreads 16.5 stops over the display, which
  // lifts a black hull 7 stops under sunlit snow to mid-grey. Film has a toe; so does this.
  c = pow(max(c, 0.0), vec3(1.35));
  float luma = dot(c, vec3(0.2126, 0.7152, 0.0722));
  c = luma + 1.12 * (c - luma);
  c = mi * c;
  return pow(max(c, 0.0), vec3(2.2)); // back to linear
}
float hash(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
vec3 toSRGB(vec3 c) { return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c)); }

void main() {
  vec3 c = texture2D(tDiffuse, vUv).rgb;
  c *= uExposure * uWhite;
  // Scotopic vision: rods peak near 507 nm and are colour-blind, so night scenes read
  // blue-grey. Blend toward a rod-weighted luminance tinted blue.
  float rod = dot(c, vec3(0.05, 0.6, 0.6));
  c = mix(c, rod * vec3(0.56, 0.72, 1.0), uNight * 0.8);
  c = agx(c);
  float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
  c = mix(vec3(l), c, uSaturation);
  // contrast around mid grey in a perceptual space
  c = pow(max(c, 0.0), vec3(1.0 / 2.2));
  c = (c - 0.45) * uContrast + 0.45;
  if (uLook > 0.5 && uLook < 1.5) {
    // Hurley silver gelatin: panchromatic-ish mono, lifted blacks, warm paper tone
    float m = dot(c, vec3(0.3, 0.55, 0.15));
    m = smoothstep(-0.05, 1.05, m);
    c = mix(vec3(0.08, 0.075, 0.07), vec3(0.98, 0.95, 0.88), m);
  } else if (uLook > 1.5) {
    // Paget plate: muted, slightly green-cyan shadows, warm highlights, soft
    float m = dot(c, vec3(0.3, 0.55, 0.15));
    c = mix(vec3(m), c, 0.65);
    c *= mix(vec3(0.9, 1.0, 1.02), vec3(1.05, 1.0, 0.9), m);
  }
  c = clamp(c, 0.0, 1.0);
  // vignette
  vec2 d = vUv - 0.5;
  d.x *= uResolution.x / uResolution.y;
  c *= 1.0 - uVignette * smoothstep(0.25, 1.05, length(d));
  // film grain (luminance-weighted, stronger in mids)
  float g = hash(vUv * uResolution + fract(uTime * 13.17) * 917.0) - 0.5;
  float lum = dot(c, vec3(0.333));
  c += g * uGrain * 0.12 * (1.0 - abs(lum - 0.5) * 1.2);
  gl_FragColor = vec4(clamp(c, 0.0, 1.0), 1.0);
}`};class e_{constructor(t,e,n){const s=t.getSize(new ut),r=t.getPixelRatio(),o=new on(s.x*r,s.y*r,{type:pn,samples:4});this.composer=new $v(t,o),this.composer.addPass(new Jv(e,n)),this.bloom=new us(new ut(s.x,s.y),.28,.42,3),this.composer.addPass(this.bloom),this.grade=new $h(t_),this.composer.addPass(this.grade),this.u=this.grade.uniforms,this.u.uResolution.value.set(s.x*r,s.y*r)}setSize(t,e,n){this.composer.setPixelRatio(n),this.composer.setSize(t,e),this.u.uResolution.value.set(t*n,e*n)}render(t){this.u.uTime.value=t,this.composer.render(),this.frame=(this.frame||0)+1}meter(){if(this.meterRT||(this.meterRT=new on(32,18,{type:wn}),this.meterScene=new Ka,this.meterMat=new Ee({uniforms:{tSrc:{value:null}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:`uniform sampler2D tSrc; varying vec2 vUv;
          void main(){
            // 4x4 taps per texel, log-luminance averaged
            float s = 0.0;
            for (int j = 0; j < 4; j++) for (int i = 0; i < 4; i++) {
              vec2 o = (vec2(float(i), float(j)) - 1.5) / vec2(128.0, 72.0);
              vec3 c = texture2D(tSrc, vUv + o).rgb;
              s += log(max(dot(c, vec3(0.2126, 0.7152, 0.0722)), 1e-12));
            }
            gl_FragColor = vec4(s / 16.0, 0.0, 0.0, 1.0);
          }`}),this.meterScene.add(new be(new An(2,2),this.meterMat)),this.meterCam=new Ya,this.meterBuf=new Float32Array(32*18*4),this.lastMeter=0),this.frame%6!==1)return this.lastMeter;const t=this.composer.renderer;this.meterMat.uniforms.tSrc.value=this.composer.writeBuffer.texture;const e=t.getRenderTarget();return t.setRenderTarget(this.meterRT),t.render(this.meterScene,this.meterCam),t.setRenderTarget(e),this.metering||(this.metering=!0,t.readRenderTargetPixelsAsync(this.meterRT,0,0,32,18,this.meterBuf).then(()=>{let n=0;for(let s=0;s<32*18;s++)n+=this.meterBuf[s*4];this.lastMeter=Math.exp(n/(32*18)),this.metering=!1})),this.lastMeter}}const Si=6e4;class n_{constructor(t){this.group=new Cn,t.add(this.group);const e=4200,n=new Float32Array(e*3),s=new Float32Array(e),r=new Float32Array(e*3);for(let c=0;c<e;c++){const h=Qt(c,1,501)*2-1,u=Qt(c,2,503)*Math.PI*2,f=Math.sqrt(1-h*h);n.set([f*Math.cos(u)*Si,h*Si,f*Math.sin(u)*Si],c*3);const d=6.2-Math.log10(1+Qt(c,3,509)*999)*2.2;s[c]=d;const g=Qt(c,4,521),S=g<.15?[1,.78,.6]:g<.4?[1,.93,.85]:g<.85?[.92,.95,1]:[.75,.85,1];r.set(S,c*3)}const o=new ce;o.setAttribute("position",new xe(n,3)),o.setAttribute("aMag",new xe(s,1)),o.setAttribute("aTint",new xe(r,3)),this.starUniforms={uScale:{value:1},uTime:{value:0},uPixelRatio:{value:1},uExtinction:{value:1},uCloudCover:{value:0},uCloudOffset:{value:new ut},uSunDir:{value:new P(0,1,0)}},this.stars=new Th(o,new Ee({uniforms:this.starUniforms,transparent:!0,depthWrite:!1,blending:Is,vertexShader:`
          attribute float aMag; attribute vec3 aTint;
          uniform float uScale, uTime, uPixelRatio, uCloudCover;
          uniform vec2 uCloudOffset;
          uniform vec3 uSunDir;
          varying vec3 vCol;
          ${Fr}
          void main() {
            // stars are fixed in the equatorial frame; modelMatrix carries latitude tilt + sidereal spin
            vec3 dir = normalize(mat3(modelMatrix) * position);
            gl_Position = projectionMatrix * viewMatrix * vec4(dir * ${Si.toFixed(1)} + cameraPosition, 1.0);
            float flux = pow(10.0, -0.4 * aMag);
            // atmospheric extinction + scintillation, strongest near the horizon
            float airmass = 1.0 / max(dir.y + 0.025, 0.02);
            float ext = exp(-0.25 * (airmass - 1.0));
            float tw = 1.0 + 0.45 * smoothstep(0.5, 0.0, dir.y) * sin(uTime * (8.0 + fract(aMag * 13.1) * 9.0) + aMag * 77.0);
            float cloud = dir.y > 0.0 && uCloudCover > 0.001 ? cloudDensity(dir.xz * (2200.0 / dir.y) + uCloudOffset) * smoothstep(0.0, 0.05, dir.y) : 0.0;
            vCol = aTint * flux * ext * tw * uScale * 5.0e-5 * step(0.0, dir.y) * (1.0 - cloud);
            gl_PointSize = 2.2 * uPixelRatio;
          }`,fragmentShader:`
          varying vec3 vCol;
          void main() {
            vec2 c = gl_PointCoord - 0.5;
            float a = max(0.0, exp(-dot(c, c) * 18.0) - exp(-4.5));
            gl_FragColor = vec4(vCol * a, 1.0);
          }`})),this.stars.frustumCulled=!1,this.stars.renderOrder=-1,this.group.add(this.stars),this.discUniforms={uSunDir:{value:new P},uMoonDir:{value:new P},uSunColor:{value:new Wt},uMoonColor:{value:new Wt},uCloudCover:this.starUniforms.uCloudCover,uCloudOffset:this.starUniforms.uCloudOffset};const a=c=>new Ee({uniforms:this.discUniforms,transparent:!0,depthWrite:!1,blending:Is,defines:c?{MOON:""}:{},vertexShader:`
          varying vec2 vUv;
          void main() { vUv = uv * 2.0 - 1.0; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,fragmentShader:`
          uniform vec3 uSunDir, uMoonDir, uSunColor, uMoonColor;
          uniform float uCloudCover;
          uniform vec2 uCloudOffset;
          varying vec2 vUv;
          ${Fr}
          void main() {
            float r = length(vUv);
            if (r > 1.0) discard;
            float edge = smoothstep(1.0, 0.9, r);
          #ifdef MOON
            // reconstruct the sphere normal on the disc in a frame facing the viewer
            vec3 fwd = -uMoonDir;
            vec3 up = abs(fwd.y) > 0.99 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
            vec3 ax = normalize(cross(up, fwd));
            vec3 ay = cross(fwd, ax);
            vec3 n = normalize(vUv.x * ax + vUv.y * ay + sqrt(max(0.0, 1.0 - r * r)) * fwd); // fwd = -moonDir points at the viewer
            float lit = smoothstep(-0.02, 0.06, dot(n, uSunDir));
            float maria = 0.78 + 0.22 * sin(vUv.x * 6.0 + 1.3) * sin(vUv.y * 4.0 - 0.7) + 0.08 * sin(vUv.x * 17.0) * sin(vUv.y * 13.0);
            vec3 c = uMoonColor * lit * maria + uMoonColor * 0.004; // earthshine
            float cl = uMoonDir.y > 0.0 && uCloudCover > 0.001 ? cloudDensity(uMoonDir.xz * (2200.0 / uMoonDir.y) + uCloudOffset) : 0.0;
            gl_FragColor = vec4(c * edge * (1.0 - 0.97 * cl), 1.0);
          #else
            vec3 limb = pow(vec3(sqrt(max(0.0, 1.0 - r * r))), vec3(0.4, 0.5, 0.6));
            float cl = uSunDir.y > 0.0 && uCloudCover > 0.001 ? cloudDensity(uSunDir.xz * (2200.0 / uSunDir.y) + uCloudOffset) : 0.0;
            gl_FragColor = vec4(uSunColor * limb * edge * (1.0 - 0.995 * cl), 1.0);
          #endif
          }`}),l=2*Si*Math.tan(.266*Math.PI/180);this.sun=new be(new An(l,l),a(!1)),this.moon=new be(new An(l*.98,l*.98),a(!0));for(const c of[this.sun,this.moon])c.frustumCulled=!1,c.renderOrder=-1,this.group.add(c)}setSky(t,e){const n=(90-Math.abs(t))*Math.PI/180;this.stars.rotation.set(n,-e*Math.PI/180,0,"XYZ")}update(t,e,n,s,r,o,a,l,c=1){this.starUniforms.uScale.value=o,this.starUniforms.uTime.value=a,this.starUniforms.uPixelRatio.value=l,this.discUniforms.uSunDir.value.copy(e),this.discUniforms.uMoonDir.value.copy(n);const h=o/68e-6,u=120/c,f=9/c,d=Math.min(1,u/(h*Math.max(s[0],1e-6)));this.discUniforms.uSunColor.value.setRGB(s[0]*h*d,s[1]*h*d,s[2]*h*d);const g=h*25e-7,S=Math.min(g,f);this.discUniforms.uMoonColor.value.setRGB(r[0]*S,r[1]*S*.98,r[2]*S*.94),this.sun.position.copy(t.position).addScaledVector(e,Si*.98),this.moon.position.copy(t.position).addScaledVector(n,Si*.98),this.sun.lookAt(t.position),this.moon.lookAt(t.position),this.sun.visible=e.y>-.01,this.moon.visible=n.y>-.01}}const i_=`
varying vec3 vDir;
void main() {
  vDir = normalize(position);
  vec4 p = projectionMatrix * modelViewMatrix * vec4(position + cameraPosition, 1.0);
  // just inside the far plane: exactly z = w gets clipped by precision and tears holes
  gl_Position = vec4(p.xy, p.w * 0.99999, p.w);
}`,s_=`
precision highp float;
varying vec3 vDir;
uniform vec3 uSunDir;
uniform vec3 uMoonDir;
uniform float uMoonIllum;
uniform float uSunIntensity;
uniform float uMieBeta;
uniform float uCloudCover;
uniform vec2 uCloudOffset;
uniform samplerCube uClearSky;
uniform float uDebug;
${kh}
${Fr}
${Hh}
void main() {
  vec3 rd = normalize(vDir);
  if (rd.y <= 0.0 || uCloudCover < 0.001) discard;
  vec3 skyCol = textureCube(uClearSky, rd).rgb;
  vec3 zen = textureCube(uClearSky, vec3(0.0, 1.0, 0.0)).rgb;
  vec3 cloudPos = vec3(0.0, Re + 2200.0, 0.0);
  vec3 sunT = transmittanceToSun(cloudPos, uSunDir);
  vec3 moonT = transmittanceToSun(cloudPos, uMoonDir);
  float mu = dot(rd, uSunDir);
  float sunUp = smoothstep(-0.12, 0.02, uSunDir.y);
  float far = exp(-(2200.0 / max(rd.y, 0.02)) / 60000.0);

  vec3 col = vec3(0.0);
  float alpha = 0.0;

  float ci = cirrusAt(rd);
  if (ci > 0.0) {
    vec3 cirrus = uSunIntensity * sunT * (0.05 + 0.5 * pow(max(mu, 0.0), 6.0)) * sunUp + zen * 0.8 + twilight(rd) * 1.2;
    // premultiplied accumulation (cirrus first, low cloud composited over it)
    col = mix(skyCol, cirrus, far) * ci;
    alpha = ci;
  }

  vec3 c = cloudAt(rd);
  if (c.x > 0.0) {
    float shadow = c.y;
    float edge = 1.0 - smoothstep(0.2, 0.9, c.z);
    float phase = 0.3 + 0.25 * (1.0 + mu * mu) + 2.2 * pow(max(mu, 0.0), 10.0) * edge;
    vec3 lit = uSunIntensity * sunT * phase * shadow * 0.16 * sunUp;
    lit += uSunIntensity * 2.5e-6 * uMoonIllum * moonT * 0.16 * shadow * step(0.0, uMoonDir.y);
    vec3 amb = zen * (1.0 - 0.45 * c.z) + twilight(vec3(0.0, 1.0, 0.0)) * (1.0 - 0.4 * c.z) * 1.4 + twilight(rd) * 0.35;
    vec3 cloud = lit + amb + vec3(0.6, 0.7, 1.0) * 1.0e-7 * uSunIntensity;
    cloud = mix(skyCol, cloud, far);
    col = cloud * c.x + col * (1.0 - c.x);
    alpha = c.x + alpha * (1.0 - c.x);
  }
  if (uDebug > 3.5) { gl_FragColor = vec4(col * 0.05, 1.0); return; }
  if (uDebug > 0.5) { gl_FragColor = vec4(uDebug > 2.5 ? vec3(c.y) : uDebug > 1.5 ? vec3(ci) : vec3(c.x), 1.0); return; }
  if (alpha <= 0.0) discard;
  gl_FragColor = vec4(col / alpha, alpha);
}`;class r_{constructor(t,e){const n=e.uniforms;this.uniforms={uSunDir:n.uSunDir,uMoonDir:n.uMoonDir,uMoonIllum:n.uMoonIllum,uSunIntensity:n.uSunIntensity,uMieBeta:n.uMieBeta,uCloudCover:n.uCloudCover,uCloudOffset:n.uCloudOffset,uClearSky:{value:null},uDebug:{value:0}},this.mesh=new be(new Bs(5e4,64,32),new Ee({uniforms:this.uniforms,vertexShader:i_,fragmentShader:s_,side:Be,transparent:!0,depthWrite:!1})),this.mesh.frustumCulled=!1,this.mesh.renderOrder=-2,t.add(this.mesh)}}const o_=`
attribute float aSeed;
uniform float uTime, uPixelRatio, uScaleH, uDensity;
uniform vec3 uOrigin, uWind;
varying float vAlpha;
varying float vSeed;
void main() {
  float life = 14.0;
  float age = mod(uTime + aSeed * life, life);
  float t = age / life;
  vec3 p = uOrigin;
  p.y += age * 0.55 - age * age * 0.006;            // buoyant rise, slowing
  p += uWind * age * (0.6 + t);                       // carried off downwind
  p.x += sin(age * 0.9 + aSeed * 40.0) * 0.25 * t;    // turbulence
  p.z += cos(age * 0.7 + aSeed * 23.0) * 0.25 * t;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float size = 0.35 + t * 3.2;
  gl_PointSize = size * uScaleH / -mv.z * uPixelRatio;
  vAlpha = smoothstep(0.0, 0.06, t) * (1.0 - t) * 0.35 * uDensity;
  vSeed = aSeed;
}`,a_=`
uniform vec3 uColor;
varying float vAlpha;
varying float vSeed;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float r = length(c);
  float a = smoothstep(0.5, 0.1, r);
  a *= 0.75 + 0.25 * sin((c.x + vSeed) * 17.0) * sin((c.y - vSeed) * 13.0);
  gl_FragColor = vec4(uColor, a * vAlpha);
}`;class l_{constructor(t,e,n=!1){const s=n?160:70;this.heavy=n;const r=new ce;r.setAttribute("position",new xe(new Float32Array(s*3),3));const o=new Float32Array(s);for(let a=0;a<s;a++)o[a]=a/s+Qt(a,1,1201)*.01;r.setAttribute("aSeed",new xe(o,1)),this.uniforms={uTime:{value:0},uPixelRatio:{value:1},uScaleH:{value:800},uOrigin:{value:e.clone()},uWind:{value:new P(.5,0,.3)},uColor:{value:new Wt(.5,.5,.5)},uDensity:{value:n?2.2:1}},this.points=new Th(r,new Ee({uniforms:this.uniforms,vertexShader:o_,fragmentShader:a_,transparent:!0,depthWrite:!1})),this.points.frustumCulled=!1,t.add(this.points)}update(t,e,n,s){this.uniforms.uTime.value=t,this.uniforms.uPixelRatio.value=n.getPixelRatio(),this.uniforms.uScaleH.value=n.domElement.clientHeight/(2*Math.tan(e.fov*Math.PI/360));const r=this.heavy?.16:.42;this.uniforms.uColor.value.setRGB(s*r,s*r*.97,s*r*.93)}}const rn=43.9,St=i=>i-rn/2,Ls=i=>i+rn/2,zc=-3.76,En=-3.33,Ge=1.2,Ce=23.4,ve=7.9,Te=1.6,c_=[11.5,19.5],Bc=new WeakMap;function h_(i){let t=Bc.get(i);if(t)return t;const e=i.length,n=[];for(let s=0;s<e-1;s++)n.push((i[s+1][1]-i[s][1])/(i[s+1][0]-i[s][0]));t=new Array(e),t[0]=n[0],t[e-1]=n[e-2];for(let s=1;s<e-1;s++)t[s]=n[s-1]*n[s]<=0?0:(n[s-1]+n[s])/2;for(let s=0;s<e-1;s++){if(n[s]===0){t[s]=t[s+1]=0;continue}const r=t[s]/n[s],o=t[s+1]/n[s],a=r*r+o*o;if(a>9){const l=3/Math.sqrt(a);t[s]=l*r*n[s],t[s+1]=l*o*n[s]}}return Bc.set(i,t),t}function Yr(i,t){const e=i.length;if(t<=i[0][0])return i[0][1];if(t>=i[e-1][0])return i[e-1][1];const n=h_(i);let s=1;for(;t>i[s][0];)s++;const[r,o]=i[s-1],[a,l]=i[s],c=a-r,h=(t-r)/c,u=h*h,f=u*h;return(2*f-3*u+1)*o+(f-2*u+h)*c*n[s-1]+(-2*f+3*u)*l+(f-u)*c*n[s]}const u_=[[2.3,2.2],[3.5,2.6],[5.6,2.9],[7.7,3.2],[9.8,3.4],[13.9,3.7],[18.1,3.8],[21.5,3.8],[26.5,3.76],[30.7,3.67],[34.9,3.55],[39,3.38],[41.1,3.25],[42.4,2.9],[43.2,2.2],[43.6,1.5]];function f_(i){return i<=Ge?0:i<2.3?2.2*Math.sqrt((i-Ge)/(2.3-Ge)):i>=rn?0:i>43.6?1.5*Math.sqrt((rn-i)/(rn-43.6)):Yr(u_,i)}const d_=[[En,.06],[-3.16,.12],[-3,.25],[-2.85,.42],[-2.68,.6],[-2.4,.75],[-2,.86],[-1.56,.94],[-.9,.985],[-.26,1],[1.34,1],[2.2,.985],[3.1,.955],[3.6,.92],[4.8,.9]];function kc(i){return Yr(d_,i)}const p_=[[En,6.1],[-3.28,5.8],[-2.28,4.8],[-.88,3.6],[.32,3],[1.32,2.4],[2.24,1.6],[2.64,1.25],[3.1,Ge],[5,Ge-.15]];function fi(i){return Yr(p_,i)}const m_=[[En,40.6],[0,40.8],[.2,40.85],[.3,41],[.9,41.8],[1.9,43.35],[2.6,43.75],[3.1,rn],[5,rn]];function di(i){return Yr(m_,i)}function le(i){return i>=22?3.05+.2*((i-22)/22)**2:3.05+.55*((22-i)/21)**2.5}function en(i){return 1.15+.35*Math.min(1,Math.max(0,(Ce-i)/(Ce-ve)))}function Ae(i){return le(i)-.06}function Zi(i){const t=Math.min(1,Math.max(0,(ve-i)/(ve-Ge)));return 4.3+.4*t*t}function fn(i,t){const e=Math.min(t,le(i)),n=fi(e),s=di(e);if(i<=n||i>=s)return 0;const r=Ge+(i-n)/(s-n)*(rn-Ge),o=f_(r)/3.8,a=Math.min(1,Math.max(0,(3.1-e)/(3.1-En)));return 3.8*Math.pow(o,1+1.3*a)*kc(e)/kc(3.1)*(e>=3.1,1)}function In(i){return fn(i,le(i)-.001)}function g_(i,t=3){return i>=Ce||i<=ve||Math.abs(t)<=Te?Ae(i):en(i)}const v_=3.8,Vn=i=>le(Ls(i)),bs=(i,t)=>fn(Ls(i),t),Ki=i=>St(fi(i)),__=i=>St(di(i));function x_(i){const t=i.index.array;for(let e=0;e<t.length;e+=3){const n=t[e+1];t[e+1]=t[e+2],t[e+2]=n}return i.computeVertexNormals(),i}function qr(i){const t=i.clone();t.scale(-1,1,1);const e=t.index.array;for(let n=0;n<e.length;n+=3){const s=e[n+1];e[n+1]=e[n+2],e[n+2]=s}return t.computeVertexNormals(),cn([i,t])}function Or(i,t,e){const n=[],s=[],r=[];for(let a=0;a<=t;a++)for(let l=0;l<=i;l++){const[c,h,u,f,d]=e(l/i,a/t);n.push(c,h,u),s.push(f??0,d??0)}for(let a=0;a<t;a++)for(let l=0;l<i;l++){const c=a*(i+1)+l,h=c+i+1;r.push(c,c+1,h,c+1,h+1,h)}const o=new ce;return o.setAttribute("position",new Yt(n,3)),o.setAttribute("uv",new Yt(s,2)),o.setIndex(r),o.computeVertexNormals(),o}function M_(){const t=Or(260,72,(e,n)=>{let s=En+n*(3.75-En);const o=.55*(.5-.5*Math.cos(Math.PI*e))+.45*e;let a=fi(s)+o*(di(s)-fi(s));for(let c=0;c<2;c++){const h=le(a);s>h&&(s=h,a=fi(s)+o*(di(s)-fi(s)))}return[fn(a,s),s,St(a),a,s]});return qr(x_(t))}function qe(i,t,e,n,s,r,o=120){const a=[],l=[];for(let u=0;u<=o;u++){const f=u/o,d=i+(t-i)*(.5-.5*Math.cos(Math.PI*f)),g=St(d),S=Math.max(0,e(d)),p=Math.max(0,S-r),m=n(d),w=s(d);a.push(S,m,g,S,w,g,p,w,g,p,m,g)}for(let u=0;u<o;u++)for(let f=0;f<4;f++){const d=u*4+f,g=u*4+(f+1)%4;l.push(d,g,d+4,g,g+4,d+4)}const c=(u,f)=>{const d=[u,u+1,u+2,u+3];f?l.push(d[0],d[1],d[2],d[0],d[2],d[3]):l.push(d[0],d[2],d[1],d[0],d[3],d[2])};c(0,!1),c(o*4,!0);const h=new ce;return h.setAttribute("position",new Yt(a,3)),h.setIndex(l),h.computeVertexNormals(),qr(h)}function _r(i,t,e,n,s=0,r=90,o=10){const a=Or(r,o,(l,c)=>{const h=i+(t-i)*l,u=Math.max(s+.01,n(h)),f=s>0?s+(u-s)*c:-u+2*u*c;return[f,e(h),St(h),f,St(h)]});return s>0?qr(a):a}function ae(i,t,e,n,s=8){const r=new P().subVectors(n,e),o=r.length(),a=new ze(t,i,o,s,1,!1);a.translate(0,o/2,0);const l=new Pn().setFromUnitVectors(new P(0,1,0),r.normalize());return a.applyQuaternion(l),a.translate(e.x,e.y,e.z),a}function $t(i,t,e,n=0,s=1){if(n===0||s===1)return ae(e,e,i,t,5);const r=[];for(let a=0;a<=s;a++){const l=a/s,c=new P().lerpVectors(i,t,l);c.y-=n*4*l*(1-l),r.push(c)}const o=new un(r);return new je(o,s*2,e,5,!1)}const at=(i,t,e)=>new P(i,t,e);function xr(i,t,e){const n=new un(i),s=n.getLength(),r=Math.max(24,Math.round(s*6)),o=new je(n,r,t,10),a=o.attributes.position,l=o.attributes.normal,c=11;for(let h=0;h<=r;h++){const u=h/r,f=u*s,d=Math.abs(Math.sin(f/(.9+.35*Math.sin(f*.7+t*40))*Math.PI)),g=Math.sin(Math.min(1,u*1)*Math.PI)**.35,S=(d**.6*e*.45+.05*Math.sin(f*3.7))*g-t*(1-g)*.7;for(let p=0;p<c;p++){const m=h*c+p,w=l.getY(m),y=S+(w<0?-w*.08:0);a.setXYZ(m,a.getX(m)+l.getX(m)*y,a.getY(m)+l.getY(m)*y,a.getZ(m)+l.getZ(m)*y)}}return o.computeVertexNormals(),o}const Jh=new P(0,0,1);function y_(i){const t=i.rime,e=i.snowOnShip??(t?1:.25),n=(A,I=e)=>{const z=A.onBeforeCompile;return A.onBeforeCompile=(_,E)=>{z&&z(_,E),_.uniforms.uSnow={value:I},_.uniforms.uFrost={value:t?A.userData.lowFrost?.12:.35:0},_.vertexShader=_.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vWN;
varying vec3 vWP;`).replace("#include <worldpos_vertex>",`#include <worldpos_vertex>
vWN = normalize(mat3(modelMatrix) * objectNormal);
vWP = (modelMatrix * vec4(transformed, 1.0)).xyz;`),_.fragmentShader=_.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vWN;
varying vec3 vWP;
uniform float uSnow;
uniform float uFrost;
float gSnowMask;
float sh(vec3 p){p=fract(p*0.1031);p+=dot(p,p.zyx+31.32);return fract((p.x+p.y)*p.z);}
float vn3(vec3 p){vec3 i=floor(p);vec3 f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(mix(sh(i),sh(i+vec3(1,0,0)),f.x),mix(sh(i+vec3(0,1,0)),sh(i+vec3(1,1,0)),f.x),f.y),mix(mix(sh(i+vec3(0,0,1)),sh(i+vec3(1,0,1)),f.x),mix(sh(i+vec3(0,1,1)),sh(i+vec3(1,1,1)),f.x),f.y),f.z);}`).replace("#include <color_fragment>",`#include <color_fragment>
{
  // two octaves of smooth value noise: drift patches (~1.5 m) with fine crust variation
  float n = vn3(vWP * 0.65) * 0.65 + vn3(vWP * 3.1 + 7.0) * 0.35;
  float up = normalize(vWN).y;
  gSnowMask = uSnow * smoothstep(0.55, 0.85, up + (n - 0.5) * 0.35);
  float frost = uFrost * (0.6 + 0.4 * n);
  diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.93, 0.95, 0.97), max(gSnowMask, frost * 0.5));
}`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
roughnessFactor = mix(roughnessFactor, 0.85, gSnowMask);`).replace("#include <metalnessmap_fragment>",`#include <metalnessmap_fragment>
metalnessFactor *= 1.0 - gSnowMask;`)},A},s=new rv({color:1184275,roughness:.62,metalness:0,specularIntensity:.45});s.onBeforeCompile=A=>{A.vertexShader=A.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vHP;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vHP = position;`),A.fragmentShader=A.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vHP;
float gSeam;`).replace("#include <color_fragment>",`#include <color_fragment>
{
  float strake = fract(vHP.y / 0.19);
  gSeam = smoothstep(0.0, 0.06, strake) * smoothstep(1.0, 0.94, strake);
  float butt = fract(vHP.z / 7.3 + floor(vHP.y / 0.19) * 0.37);
  gSeam *= smoothstep(0.0, 0.004, butt) * smoothstep(1.0, 0.996, butt);
  diffuseColor.rgb *= 0.8 + 0.2 * gSeam;
}`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
roughnessFactor = mix(0.75, roughnessFactor, gSeam);`)},s.userData.lowFrost=!0,n(s,e*.35);const r=n(new ge({color:13145662,roughness:.3,metalness:1}),e*.5),o=n(new ge({color:14209732,roughness:.55})),a=new ge({color:9208178,roughness:.85});a.onBeforeCompile=A=>{A.fragmentShader=A.fragmentShader.replace("#include <color_fragment>",`#include <color_fragment>
{
  // 0.14 m pine planks running fore and aft, pitch-paid seams, staggered butts every ~6 m
  float row = floor(vUv.x / 0.14);
  float plank = fract(vUv.x / 0.14);
  float seam = smoothstep(0.0, 0.07, plank) * smoothstep(1.0, 0.93, plank);
  float butt = fract(vUv.y / 6.1 + fract(sin(row * 12.9898) * 43758.5) );
  seam *= smoothstep(0.0, 0.004, butt) * smoothstep(1.0, 0.996, butt);
  float var = fract(sin(row * 91.7) * 4375.85);
  diffuseColor.rgb *= (0.62 + 0.38 * seam) * (0.9 + 0.16 * var);
}`)},a.defines={USE_UV:""},n(a,Math.min(1,e*1.4));const l=new ge({color:6048053,roughness:.7});l.userData.lowFrost=!0,n(l,e*.5);const c=new ge({color:9406330,roughness:.65});c.userData.lowFrost=!0,n(c,e*.5);const h=n(new ge({color:1052689,roughness:.5}),e*.6);h.userData.lowFrost=!0;const u=n(new ge({color:2763308,roughness:.55,metalness:.7})),f=new ge({color:11569738,roughness:.28,metalness:1}),d=n(new ge({color:11049598,roughness:.92,side:sn})),g=new ge({color:2235672,roughness:.95});t&&(g.onBeforeCompile=A=>{A.vertexShader=A.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vRP;
varying vec3 vRN;`).replace("#include <worldpos_vertex>",`#include <worldpos_vertex>
vRP = (modelMatrix * vec4(transformed, 1.0)).xyz;
vRN = normalize(mat3(modelMatrix) * objectNormal);`),A.fragmentShader=A.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vRP;
varying vec3 vRN;
float gRime;
float rh(vec3 p){p=fract(p*0.1031);p+=dot(p,p.zyx+31.32);return fract((p.x+p.y)*p.z);}
float rn(vec3 p){vec3 i=floor(p);vec3 f=smoothstep(0.0,1.0,fract(p));return mix(mix(mix(rh(i),rh(i+vec3(1,0,0)),f.x),mix(rh(i+vec3(0,1,0)),rh(i+vec3(1,1,0)),f.x),f.y),mix(mix(rh(i+vec3(0,0,1)),rh(i+vec3(1,0,1)),f.x),mix(rh(i+vec3(0,1,1)),rh(i+vec3(1,1,1)),f.x),f.y),f.z);}`).replace("#include <color_fragment>",`#include <color_fragment>
{
  // long continuous runs of rime with occasional bare stretches (not a dashed pattern)
  float n = rn(vRP * 0.7) * 0.7 + rn(vRP * 4.0) * 0.3;
  float windward = 0.5 + 0.5 * dot(normalize(vRN), uRimeWind);
  gRime = smoothstep(0.52, 0.78, n * 0.7 + windward * 0.5);
  diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.86, 0.89, 0.92), gRime);
}`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
roughnessFactor = mix(0.75, 1.0, gRime);`),A.uniforms.uRimeWind={value:Jh},A.fragmentShader=A.fragmentShader.replace("varying vec3 vRN;",`varying vec3 vRN;
uniform vec3 uRimeWind;`)});const S=n(new ge({color:14867922,roughness:.6})),p=n(new ge({color:7230006,roughness:.6})),m=n(new ge({color:5914407,roughness:.55}),e*.3),w=n(new ge({color:10126438,roughness:.85})),y=n(new ge({color:986896,roughness:.6}),e*.4),x=new ge({color:14274747,roughness:.95,side:sn});x.defines={USE_UV:""},x.onBeforeCompile=A=>{A.fragmentShader=A.fragmentShader.replace("#include <common>",`#include <common>
float gSeam;`).replace("#include <color_fragment>",`#include <color_fragment>
{
  float cloth = fract(vUv.x * vUv.y * 0.0 + vUv.x / 0.62);
  gSeam = smoothstep(0.0, 0.05, cloth) * smoothstep(1.0, 0.95, cloth);
  float reef = smoothstep(0.012, 0.0, abs(fract(vUv.y / 1.6) - 0.5) - 0.48);
  float edge = smoothstep(0.0, 0.06, min(vUv.x - 0.0, 1.0)) ;
  float soil = 0.93 + 0.07 * sin(vUv.x * 3.1 + vUv.y * 1.7) * sin(vUv.y * 2.3);
  diffuseColor.rgb *= (0.84 + 0.16 * gSeam) * (1.0 - 0.12 * reef) * soil;
}`).replace("#include <lights_fragment_begin>",Gt.lights_fragment_begin.replaceAll("RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );",`RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
		reflectedLight.directDiffuse += directLight.color * max(dot(-geometryNormal, directLight.direction), 0.0) * diffuseColor.rgb * (0.12 + 0.18 * gSeam) * RECIPROCAL_PI;`))};const L=new ge({color:526086,roughness:.08,metalness:0,emissive:16757611,emissiveIntensity:.0042}),D=new ge({color:658446,roughness:.05,metalness:0});return{railWood:p,doorWood:m,crate:w,funnel:y,glassDark:D,sailCloth:x,lamp:L,hull:s,gilt:r,paintWhite:o,deck:a,spar:l,yardPaint:c,blackPaint:h,iron:u,brass:f,canvas:d,rigging:g,boat:S}}function S_(){const i=document.createElement("canvas");i.width=2048,i.height=512;const t=i.getContext("2d");t.clearRect(0,0,i.width,i.height),t.fillStyle="#fff",t.textAlign="center",t.textBaseline="middle",t.font='bold 190px "Clarendon", "Rockwell", "Georgia", serif';const e="ENDURANCE",n=t.measureText(e).width*1.08;let s=i.width/2-n/2;for(const o of e){const a=t.measureText(o).width*1.08,l=(s+a/2-i.width/2)/(n/2);t.save(),t.translate(s+a/2,170+28*l*l),t.rotate(l*.06),t.fillText(o,0,0),t.restore(),s+=a}t.save(),t.translate(i.width/2,390),t.beginPath();for(let o=0;o<10;o++){const a=-Math.PI/2+o*Math.PI/5,l=o%2===0?95:32,c=Math.abs(Math.cos(a))>.8?1.7:1.15;t.lineTo(Math.cos(a)*l*c,Math.sin(a)*l)}t.closePath(),t.fill(),t.restore();const r=new Cg(i);return r.colorSpace=yn,r.anisotropy=8,r}function b_(i){Jh.set(0,.25,1).normalize();const t=y_(i),e=new Cn;e.name="Endurance";const n=new Cn;e.add(n);const s=C=>g_(Ls(C),3);let r=at(0,8,0);const o=(C,F,R=!0,M=!0,H=n)=>{const N=new be(C,F);return N.castShadow=R,N.receiveShadow=M,H.add(N),N},a=(C,F,R,M,H,N,O=t.paintWhite,Y=n)=>{const it=new fe(C,F,R);return it.translate(M,H+F/2,St(N)),o(it,O,!0,!0,Y)},l=(C,F,R,M,H=.03,N=t.iron)=>o(ae(H,H,at(C,F,St(M)),at(C,R,St(M)),6),N);o(M_(),t.hull);{const C=new fe(.42,En-zc+.1,di(En)-7);C.translate(0,(En+zc)/2+.05,St((di(En)+7)/2)),o(C,t.hull)}{const C=new fe(.3,3.75,1.5);C.translate(0,-1.6,St(di(-1.6)+.72)),o(C,t.hull)}const c=(C,F)=>R=>fn(R,le(R)+C)+F;o(qe(Ge+.3,rn-.02,c(-.04,.03),C=>le(C)-.1,C=>le(C)+.02,.06,200),t.paintWhite),o(qe(Ge+1.2,rn-.25,c(-.45,.025),C=>le(C)-.5,C=>le(C)-.42,.05,200),t.paintWhite);const h=C=>F=>In(F)-C,u=C=>le(C)+.9;o(qe(Ce,rn,h(0),C=>le(C)-.02,u,.12,160),t.paintWhite),o(qe(Ce-.05,rn,h(-.04),u,C=>u(C)+.08,.26,160),t.railWood),o(qe(Ge+.05,ve,h(0),C=>le(C)-.02,Zi,.14,80),t.hull),o(qe(Ge+.05,ve+.05,h(-.04),Zi,C=>Zi(C)+.08,.28,80),t.railWood),o(qe(Ge+.6,ve-.02,h(.14),C=>Ae(C),C=>Zi(C)-.01,.02,60),t.paintWhite),o(qe(ve,Ce,h(0),C=>le(C)-.03,C=>le(C)+.05,.42,40),t.railWood),o(qe(ve,Ce,h(.42),C=>en(C)-.02,C=>le(C)+.01,.02,40),t.paintWhite);{const C=F=>le(F)+.95;o(qe(ve,Ce,h(.06),C,F=>C(F)+.07,.14,40),t.railWood),o(qe(ve,Ce,h(.1),F=>le(F)+.48,F=>le(F)+.52,.04,40),t.iron);for(let F=ve+.6;F<Ce;F+=1.1){const R=In(F)-.13;for(const M of[-1,1])l(M*R,le(F),le(F)+.95,F,.03)}}o(_r(Ce,rn-.15,Ae,C=>In(C)-.12,0,80,12),t.deck),o(_r(Ge+.5,ve,Ae,C=>In(C)-.14,0,30,10),t.deck),o(_r(ve,Ce,en,C=>fn(C,en(C))-.42,Te-.05,40,4),t.deck),o(_r(ve,Ce,Ae,()=>Te+.05,0,40,4),t.deck);for(const[C,F]of[[Ce,1],[ve,-1]]){const R=en(C),M=Ae(C),H=fn(C,R)-.4;for(const N of[-1,1]){const O=H-Te;a(O,M-R,.1,N*(Te+O/2),R,C+F*.05,t.paintWhite),a(.7,1.75,.04,N*(Te+O*.55),R,C-F*0,t.doorWood),o(ae(.035,.035,at(N*Te,M+.95,St(C)),at(N*H,M+.95,St(C)),6),t.railWood),o(ae(.02,.02,at(N*Te,M+.5,St(C)),at(N*H,M+.5,St(C)),6),t.iron);for(let v=Te+.1;v<H;v+=.9)l(N*v,M,M+.95,C,.025);const Y=N*(H-.55),it=at(Y,R,St(C-F*1.2)),et=at(Y,M,St(C)),b=[];for(const v of[-.25,.25])b.push(ae(.035,.035,it.clone().add(at(v,0,0)),et.clone().add(at(v,0,0)),5));for(let v=1;v<7;v++){const U=new P().lerpVectors(it,et,v/7);b.push(ae(.02,.02,U.clone().add(at(-.25,0,0)),U.clone().add(at(.25,0,0)),5))}o(cn(b),t.railWood)}}{const[C,F]=c_;o(qe(C,F,()=>Te,R=>en(R)-.01,R=>Ae(R)-.02,.1,8),t.paintWhite);for(const R of[-1,1])for(let M=C+.9;M<F-.5;M+=1.6)Math.abs(M-(C+4.1))<.5?a(.04,1.8,.75,R*(Te+.02),en(M),M,t.doorWood):a(.04,.5,.6,R*(Te+.02),en(M)+1.05,M,t.glassDark);for(const R of[C,F])a(Te*2,Ae(R)-en(R),.1,0,en(R),R,t.paintWhite),a(.75,1.8,.04,.6,en(R),R+(R===C?-.06:.06),t.doorWood);for(const[R,M]of[[ve,C],[F,Ce]])for(let H=R+.4;H<=M-.3;H+=Math.max(1.2,(M-R-.7)/2))for(const N of[-1,1])l(N*(Te-.12),en(H),Ae(H),H,.07,t.paintWhite);o(qe(ve,Ce,()=>Te+.05,R=>Ae(R)-.18,R=>Ae(R)+.03,.08,20),t.railWood),o(qe(ve+.1,Ce-.1,()=>Te+.03,R=>Ae(R)+.9,R=>Ae(R)+.96,.08,20),t.railWood);for(let R=ve+.3;R<Ce;R+=1)for(const M of[-1,1])l(M*(Te-.01),Ae(R),Ae(R)+.93,R,.022)}const f=Ae,d=(C,F,R,M=!0)=>{const H=(C+F)/2,N=F-C,O=f(H),Y=St(H);a(R,.45,N,0,O,H,t.railWood);const it=O+.45,et=.34*R,b=R/2+.03,v=Math.atan2(et,b),U=Math.hypot(et,b),B=Math.max(3,Math.round(N/.5));for(const j of[-1,1]){const W=new Cn;W.position.set(j*b,it,Y),W.rotation.z=-j*v,n.add(W);const ht=(ot,Ct,st=!1)=>o(ot,Ct,st,!0,W);ht(new fe(U,.02,N-.06).translate(-j*U/2,.01,0),t.glassDark);for(const ot of[-1,1])ht(new fe(U,.07,.07).translate(-j*U/2,.035,ot*(N/2-.035)),t.railWood,!0);ht(new fe(.07,.07,N).translate(-j*.035,.035,0),t.railWood,!0);for(let ot=1;ot<B;ot++)ht(new fe(U,.05,.035).translate(-j*U/2,.03,-N/2+ot*N/B),t.railWood);for(let ot=0;ot<B;ot++)ht(new ze(.01,.01,U*.92,4).rotateZ(Math.PI/2).translate(-j*U/2,.08,-N/2+(ot+.5)*N/B),t.brass);const ct=new ce;for(const ot of[-1,1]){const Ct=Y+ot*(N/2-.02);ct.setAttribute("position",new Yt([0,it,Ct,j*b,it,Ct,0,it+et,Ct,0,it,Ct,0,it+et,Ct,j*b,it,Ct],3)),ct.computeVertexNormals(),o(ct.clone(),t.railWood,!1,!0)}}if(o(new fe(.1,.06,N+.04).translate(0,it+et+.02,Y),t.railWood),M)for(const j of[-1,1]){const W=new An(N*.85,.2);W.rotateY(j*Math.PI/2),W.translate(j*(R/2+.005),O+.25,Y),o(W,t.lamp,!1,!1)}},g=(C,F,R,M,H)=>{const N=f(H);a(C,R,F,M,N,H,t.railWood);const O=new fe(C+.06,.03,F+.06);O.translate(M,N+R+.012,St(H)),o(O,t.canvas);for(const Y of[-1,1])a(.03,R*.7,F+.08,M+Y*(C/2+.035),N+R*.15,H,t.iron),a(C+.08,R*.7,.03,M,N+R*.15,H+Y*(F/2+.035),t.iron);o(new fe(C+.1,.035,.06).translate(M,N+R+.045,St(H)),t.iron)};a(.8,.55,4,0,f(41.4),41.4,t.railWood);for(const C of[-1,1])a(.42,.42,3.6,C*.72,f(41.4),41.4,t.railWood);{const C=f(39)+1.15,F=St(39),R=[new Wn(.72,.04,6,28)];R[0].translate(0,C,F);for(let M=0;M<10;M++){const H=M/10*Math.PI*2;R.push(ae(.028,.02,at(0,C,F),at(Math.cos(H)*.9,C+Math.sin(H)*.9,F),5))}R.push(ae(.06,.06,at(0,C,F),at(0,C,St(39.7)),8)),o(cn(R.map(M=>M.index?M.toNonIndexed():M)),t.railWood),a(.3,C-f(39)-.1,.3,0,f(39.6),39.6,t.railWood)}o(new ze(.2,.26,1.15,14).translate(0,f(37)+.58,St(37)),t.brass),a(.9,.9,1.3,.6,f(38.5),38.5,t.railWood),g(.95,1.2,.35,-1.2,40),d(31.4,34,.95);for(const C of[-1,1])a(.38,.45,2.6,C*.78,f(32.7),32.7,t.railWood);g(.65,1.4,.4,0,28);for(const C of[-1,1]){const F=C*2.4,R=f(24.1);o(new ze(.17,.17,1.3,12).translate(F,R+.65,St(24.1)),t.paintWhite);const M=new Bs(.34,14,10,0,Math.PI*2,0,Math.PI*.62);M.rotateX(-Math.PI/2.2),M.translate(F,R+1.38,St(24.1)-.05),t.paintWhite.side=sn,o(M,t.paintWhite)}d(21,22.7,1.4),d(16.4,18,1.1),d(8.9,10.3,1.1,!1),o(new ze(.18,.24,1.2,14).translate(0,f(14.2)+.6,St(14.2)),t.brass),o(new ze(.08,.12,1,10).translate(1.2,f(14.1)+.5,St(14.1)),t.brass),o(new ze(.2,.2,.12,16).rotateX(Math.PI/2).translate(1.2,f(14.1)+1.05,St(14.1)),t.brass);{const C=f(5.9);o(new ze(.42,.48,.25,18).translate(0,C+.12,St(5.9)),t.iron),o(new ze(.3,.36,.55,18).translate(0,C+.5,St(5.9)),t.iron),o(new ze(.4,.3,.12,18).translate(0,C+.82,St(5.9)),t.iron);for(const F of[-1,1]){const R=at(0,f(3.4),St(3.4)),M=at(F*1.7,f(5),St(5)),H=R.distanceTo(M),N=new fe(.08,.45,H);N.translate(0,.22,H/2),N.lookAt(new P().subVectors(M,R)),N.translate(R.x,R.y,R.z),o(N,t.railWood);for(const it of[-.25,.25])l(F*1.25,f(6.9),f(6.9)+.7,6.9+it,.12,t.iron);const O=2.6,Y=In(O);o(ae(.12,.1,at(F*(Y-.6),Zi(O)-.1,St(O)),at(F*(Y+.75),Zi(O)+.05,St(O-.5)),8),t.railWood)}}if(i.rime||i.heel){const C=(F,R)=>{const M=Math.sin(F*127.1+R*311.7)*43758.5453;return M-Math.floor(M)};for(let F=0;F<22;F++){const R=ve+1+C(F,1)*(Ce-ve-2);if(R>16.4&&R<23.6&&C(F,9)<.6)continue;const M=en(R),H=C(F,2)>.5?1:-1,N=fn(R,M)-.5,O=H*(Te+.35+C(F,3)*Math.max(.1,N-Te-.8)),Y=C(F,4);Y<.55?a(.5+C(F,5)*.4,.35+C(F,6)*.3,.45+C(F,7)*.4,O,M,R,t.crate).rotation.y=(C(F,8)-.5)*.2:Y<.8?o(new ze(.28,.25,.85,12).translate(O,M+.42,St(R)),t.railWood):a(.08,.5,3.4,H*(N+.05),M,R,t.railWood)}}o(ae(.12,.12,at(1,f(13),St(13)),at(1,f(13)+1.7,St(13))),t.blackPaint),r=at(1,f(13)+1.75,St(13));const S=30.3;{const C=St(S),F=f(S)-.1;a(1.9,.5,1.9,0,F,S,t.blackPaint);const R=new ze(.75,.77,10-F,28,1,!0);R.translate(0,F+(10-F)/2,C),o(R,t.funnel),o(new ze(.81,.81,.24,28,1,!0).translate(0,9.88,C),t.funnel),o(ae(.06,.06,at(.88,F,C+.3),at(.88,9.7,C+.3)),t.brass);for(const[M,H]of[[1,1],[-1,1],[1,-1],[-1,-1]]){const N=at(.65*M,8.9,C+.5*H),O=at((In(S)-.3)*M,le(S)+.9,C+2.2*H);o($t(N,O,.012),t.rigging,!1)}}{const C=(b,v,U,B)=>{const W=st=>B&&st>.5?2*st-1:Math.abs(2*st-1),ht=st=>B&&st>.5,ct=st=>{const gt=W(st);return ht(st)?v/2*(1-.43999999999999995*gt**2.2):v/2*Math.max(0,1-gt**2.3)**.62},ot=st=>(ht(st)?.16:.3)*W(st)**2;return{hb:ct,sheer:ot,keel:st=>ht(st)?-U*(1-.3*W(st)**3):-U*Math.max(0,1-W(st)**3.2)**.55+ot(st)*W(st)**8,L:b,B:v,D:U,transom:B}},R=(b,v,U)=>{const B=U*Math.PI/2,j=b.hb(v),W=b.keel(v);return[j*Math.sin(B)**.75,W+(b.sheer(v)-W)*(1-Math.cos(B))]},M=b=>{const v=[];for(let j=0;j<9;j++)for(const W of[0,.5,.94])v.push((j+W)/9);v.push(1);const U=Or(48,v.length-1,(j,W)=>{const ht=.5-.5*Math.cos(Math.PI*j),ct=v[Math.round(W*(v.length-1))],[ot,Ct]=R(b,ht,ct),[st,gt]=R(b,ht,Math.min(1,ct+.01));let Rt=gt-Ct,Dt=-(st-ot);const vt=Math.hypot(Rt,Dt)||1,kt=ct*9%1,Ft=ct<1?.014*(1-kt)*Math.min(1,b.hb(ht)/.25):0;return[ot+Rt/vt*Ft,Ct+Dt/vt*Ft,(ht-.5)*b.L,ht,ct]}),B=[qr(U)];if(b.transom){const j=[0,b.sheer(1),b.L/2],W=16;for(let ot=0;ot<=W;ot++){const[Ct,st]=R(b,1,ot/W);j.push(Ct,st,b.L/2)}for(let ot=W;ot>=0;ot--){const[Ct,st]=R(b,1,ot/W);j.push(-Ct,st,b.L/2)}const ht=[];for(let ot=1;ot<j.length/3-1;ot++)ht.push(0,ot,ot+1);const ct=new ce;ct.setAttribute("position",new Yt(j,3)),ct.setAttribute("uv",new Yt(new Array(j.length/3*2).fill(0),2)),ct.setIndex(ht),ct.computeVertexNormals(),B.push(ct)}return cn(B)},H=(b,v,U=0,B=1,j=40)=>{const W=[];for(let ht=0;ht<=j;ht++)W.push(v(U+(B-U)*ht/j));return new un(W)},N=(b,v)=>.36*(b.hb(v)/(b.B/2))**.6*(b.transom?1-Rn.smoothstep(v,.86,1)*.85:1),O=(b,v,U)=>{const B=b.hb(v)+.03,j=Math.abs(U);if(j>1)return[Math.sign(U)*B,b.sheer(v)-.12*(j-1)/.15,(v-.5)*b.L];const W=b.sheer(v)+.02+N(b,v)*(1-j)-.04*Math.sin(j*Math.PI)*(b.hb(v)/(b.B/2));return[U*B,W,(v-.5)*b.L]},Y=b=>Or(48,24,(v,U)=>{const B=.012+.976*(.5-.5*Math.cos(Math.PI*v)),j=-1.15+2.3*U,[W,ht,ct]=O(b,B,j);return[W,ht,ct,v,U]});t.boat.side=sn;const it=(b,v,U,B,j)=>{const W=St(b),ht=U+B.D,ct=ht+1.15,ot=new Cn;ot.position.set(v,ct,W),ot.rotation.z=-(i.heel??0),n.add(ot);const Ct=Rt=>Rt.translate(0,ht-ct,0);o(Ct(M(B)),t.boat,!0,!0,ot),o(Ct(Y(B)),t.canvas,!0,!0,ot);for(const Rt of[-1,1])for(const[Dt,vt]of[[0,.04],[.86,.026]]){const kt=H(B,Ft=>{const[Kt,V]=R(B,Ft,Dt||1);return at(Rt*(Kt+.02),V-(Dt?0:.02),(Ft-.5)*B.L)},.02,B.transom?1:.98);o(Ct(new je(kt,48,vt,5)),Dt?t.boat:t.railWood,!1,!0,ot)}o(Ct(new je(H(B,Rt=>at(0,B.keel(Rt)-.035,(Rt-.5)*B.L),0,(B.transom,1),60),80,.045,5)),t.railWood,!0,!0,ot);for(const Rt of[-1,1]){const Dt=H(B,vt=>{const[kt,Ft,Kt]=O(B,vt,Rt*1.15);return at(kt+Rt*.006,Ft,Kt)},.04,.96);o(Ct(new je(Dt,40,.011,4)),t.rigging,!1,!1,ot)}const st=B.transom?.88:.94;o(Ct($t(at(0,B.sheer(.06)+N(B,.06)+.02,(.06-.5)*B.L),at(0,B.sheer(st)+N(B,st)+.02,(st-.5)*B.L),.025)),t.railWood,!1,!0,ot);const gt=Math.sign(v);for(const Rt of[.12,.88]){const Dt=(Rt-.5)*B.L,vt=b+Dt,kt=In(vt)-.15,Ft=j?le(vt)-.6:le(vt),Kt=[at(gt*kt,Ft,St(vt)),at(gt*kt,ct-.5,St(vt)),at(gt*(kt+(v*gt-kt)*.6),ct+.15,St(vt)),at(v,ct,St(vt))];o(new je(new un(Kt),16,.07,6),t.iron),o(new ze(.11,.14,.12,8).translate(gt*kt,Ft+.06,St(vt)),t.iron);const V=ht+B.sheer(Rt)+N(B,Rt)+.32;o(Ct(new fe(.12,.3,.17).translate(0,ct-ht-.22,Dt)),t.railWood,!1,!0,ot),o(Ct(new fe(.12,.26,.15).translate(0,V-ht+.13,Dt)),t.railWood,!1,!0,ot);for(const nt of[-.035,.035])o(Ct($t(at(nt,ct-ht-.36,Dt),at(nt,V-ht+.26,Dt),.012)),t.rigging,!1,!1,ot);o(Ct($t(at(0,V-ht,Dt),at(0,B.sheer(Rt)+N(B,Rt),Dt),.014)),t.rigging,!1,!1,ot),o($t(at(v,ct-.3,St(vt)+.06),at(gt*kt,Ft+.9,St(vt)+.06),.012,.05,6),t.rigging,!1,!1);const Et=[];for(let nt=0;nt<=14;nt++){const[ft,bt,Tt]=O(B,Rt+(Rt<.5?.05:-.05),-1.15+2.3*nt/14);Et.push(at(ft*1.01,bt+.015,Tt))}o(Ct(new je(new un(Et),28,.02,4)),t.rigging,!1,!1,ot)}},et=C(6.4,1.83,.82,!0);it(20,2.45,3.9,et,!1),it(20,-2.45,3.9,et,!1),it(32,In(32)+1.05,4.1,C(6.86,1.93,.95,!1),!0),it(32,-(In(32)+.95),4.1,C(5.5,1.7,.78,!0),!0)}{const C=[],F=[],R=[],M=[24.9,27.2,29.2,31.5,33.8,35.2,36.5,38].map(N=>[N,le(N)-.23,.15]);M.push([7.8,2.1,.12],[3.1,2.3,.12]);let H=0;for(const[N,O,Y]of M){const it=fn(N,O);for(const et of[-1,1]){C.push(new Wn(Y+.02,.028,6,16).rotateY(Math.PI/2).translate(et*(it+.012),O,St(N)));const b=new Nr(Y,16).rotateY(et*Math.PI/2).translate(et*(it+.006),O,St(N)),v=Math.sin(H++*91.7+3.1)*43758.5;(N>20&&v-Math.floor(v)<.4?F:R).push(b)}}o(cn(C),t.brass,!1),F.length&&o(cn(F),t.lamp,!1,!1),o(cn(R),t.glassDark,!1,!1);for(const N of[-1,1])o(new Nr(.2,16).rotateY(N*Math.PI/2).translate(N*(fn(2.7,2.75)+.01),2.75,St(2.7)),t.blackPaint,!1),o(new Wn(.22,.05,6,16).rotateY(Math.PI/2).translate(N*(fn(2.7,2.75)+.02),2.75,St(2.7)),t.iron,!1)}for(const C of[-1,1]){const R=In(41.2)+.06,M=le(41.2)+.45;o(new Wn(.3,.07,8,20).rotateY(Math.PI/2).translate(C*R,M,St(41.2)),t.paintWhite,!1)}{const C=S_(),F=new ge({color:14067280,metalness:1,roughness:.32,alphaMap:C,transparent:!0,alphaTest:.4}),R=new An(3.2,.8,32,1),M=R.attributes.position;for(let O=0;O<M.count;O++){const Y=M.getX(O);M.setZ(O,-.16*Y*Y)}R.computeVertexNormals();const H=2.62,N=o(R,F,!1,!0);N.position.set(0,H,St(di(H))+.04),N.rotation.x=.42}{const C=new Lh,F=[];for(let O=1.6;O<=3.45;O+=.15)F.push([fi(O),O]);C.moveTo(F[0][0]+.2,F[0][1]),C.lineTo(F[0][0]-.05,F[0][1]+.1),C.bezierCurveTo(1.2,2.4,.2,2.9,0,3.35),C.lineTo(.1,3.55),C.lineTo(Ge+.3,3.55);for(let O=F.length-1;O>=0;O--)C.lineTo(F[O][0]+.25,F[O][1]);const R=new tl(C,{depth:.28,bevelEnabled:!0,bevelThickness:.04,bevelSize:.04,bevelSegments:2,curveSegments:16}),M=R.attributes.position;for(let O=0;O<M.count;O++){const Y=M.getX(O),it=M.getY(O),et=M.getZ(O)-.14;M.setXYZ(O,et,it,St(Y))}R.computeVertexNormals(),o(R,t.hull);const H=[];for(const O of[-1,1]){const Y=[];for(let it=0;it<=24;it++){const et=it/24,b=3.3-.75*et+.1*Math.sin(et*Math.PI*3),v=.15+et*2.4,U=Math.max(.17,fn(v,b))+.03;Y.push(at(O*U,b,St(v)))}H.push(new je(new un(Y),64,.03,5));for(const[it,et,b]of[[.12,1,.2],[.4,-1,.17],[.66,1,.15],[.92,-1,.18]]){const v=Y[Math.round(it*24)],U=Ls(v.z),B=[];for(let j=0;j<=14;j++){const W=j/14*Math.PI*1.7,ht=b*(1-j/20),ct=U+Math.sin(W)*ht*1.2,ot=v.y+et*(1-Math.cos(W))*ht*.8,Ct=Math.max(.17,fn(ct,ot))+.03;B.push(at(O*Ct,ot,St(ct)))}H.push(new je(new un(B),24,.022,5))}}o(cn(H),t.gilt,!1);const N=[];for(let O=3.2;O>=En;O-=.2)N.push(at(0,O,St(fi(O))-.03));o(new je(new un(N),80,.07,6),t.iron)}const p=[],m=[],w=C=>m.push(C),y=.035,x=(C,F)=>at(0,F,C+y*F),L={fore:{z:St(11.7),truck:26.9,top:14.1,cap:20.5},main:{z:St(24.4),truck:26.9,top:15},mizzen:{z:St(36.2),truck:23.9,top:15}};for(const[C,F]of Object.entries(L)){const R=s(F.z)-.5;o(ae(.26,.22,x(F.z,R),x(F.z,F.top+1.6)),t.spar);const M=C==="fore"?F.cap+1.2:F.truck;o(ae(.14,.09,x(F.z,F.top-.6),x(F.z,M)),t.yardPaint),C==="fore"&&o(ae(.11,.06,x(F.z,F.cap-.8),x(F.z,F.truck)),t.yardPaint);for(let it=R+2.5;it<F.top-.5;it+=2.2){const et=new Wn(.245,.03,4,16);et.rotateX(Math.PI/2);const b=x(F.z,it);et.translate(b.x,b.y,b.z),o(et,t.iron,!1)}const H=new Bs(.13,8,6),N=x(F.z,F.truck+.05);H.translate(N.x,N.y,N.z),o(H,t.yardPaint);const O=new fe(C==="fore"?2.6:2.2,.14,C==="fore"?1.8:.5),Y=x(F.z,F.top);if(O.translate(Y.x,Y.y,Y.z),o(O,t.spar),C==="fore"){const it=new fe(1.8,.1,.4),et=x(F.z,F.cap);it.translate(et.x,et.y,et.z),o(it,t.yardPaint);const b=new fe(1.1,.07,.25),v=x(F.z,F.truck-1.4);b.translate(v.x,v.y,v.z),o(b,t.yardPaint)}}{const C=x(L.main.z,21.2),F=new fe(.85,2.3,.85);F.translate(C.x,C.y,C.z-.55),o(F,t.paintWhite)}const D=[{len:14.5,y:12.7,sail:"course",depth:7},{len:12.1,y:19.9,sail:"topsail",depth:6.2},{len:8.4,y:24.6,sail:"topgallant",depth:4}],A=i.sails==="set",I=i.yardBrace??0,z=L.fore.z,_=[];i.sails==="unbent"&&D.pop();for(const C of D){const F=x(z,C.y);F.z-=.35;const R=C.len/2,M=at(Math.cos(I),0,Math.sin(I)),H=F.clone().addScaledVector(M,-R),N=F.clone().addScaledVector(M,R);if(o(ae(.08,.2,H,F),t.yardPaint),o(ae(.2,.08,F,N),t.yardPaint),_.push({a:H,b:N,c:F,yd:C}),w($t(H.clone().add(at(0,-.1,0)),F.clone().add(at(0,-.9,.25)),.02,.25,6)),w($t(F.clone().add(at(0,-.9,.25)),N.clone().add(at(0,-.1,0)),.02,.25,6)),i.sails==="furled"){const O=[];for(let Y=0;Y<=20;Y++){const it=Y/20,et=new P().lerpVectors(H,N,.06+.88*it);et.y+=.22,et.z+=.12,O.push(et)}o(xr(O,.17,.08),t.canvas)}}if(A)for(let C=0;C<D.length;C++){const F=_[C],R=C===0,M=R?6.6:D[C-1].y+.4,H=R?F.yd.len/2+.4:D[C-1].len/2,N=new An(1,1,28,20),O=N.attributes.position,Y=N.attributes.uv,it=F.yd.len-.6;for(let b=0;b<O.count;b++){const v=O.getX(b)+.5,U=O.getY(b)+.5,B=Rn.lerp(H,F.yd.len/2-.3,U),j=(v-.5)*2*B;let W=Rn.lerp(M,F.c.y-.15,U)+(1-U)*.6*Math.sin(v*Math.PI);const ht=it*(R?.13:.11),ct=.06*Math.sin((v*7+U*5)*Math.PI)*Math.sin(v*Math.PI)*(1-U)+.05*Math.sin((v*11-U*3)*Math.PI)*(1-U)*(1-U),Ct=-.15-ht*(Math.pow(Math.sin(v*Math.PI),.8)*Math.sin(Math.pow(1-U,.8)*Math.PI)+ct),st=Math.sin(I),gt=Math.cos(I);O.setXYZ(b,F.c.x+gt*j-st*Ct,W,F.c.z+st*j+gt*Ct),Y.setXY(b,j+it/2,W)}N.computeVertexNormals(),o(N,t.sailCloth);const et=b=>{const v=[];for(let U=0;U<=10;U++){const B=Math.round(U*2)*29+b*28;v.push(new P(O.getX(B),O.getY(B),O.getZ(B)))}return v};w(new je(new un(et(0)),20,.025,4)),w(new je(new un(et(1)),20,.025,4))}const E=at(0,3.55,St(.35)),k=14*Math.PI/180,q=at(0,Math.sin(k),-Math.cos(k)),K=E.clone().addScaledVector(q,-3.2),tt=E.clone().addScaledVector(q,3.9),Z=E.clone().addScaledVector(q,7.8);o(ae(.24,.16,K,tt),t.spar),o(ae(.14,.08,tt.clone().addScaledVector(q,-1.2).add(at(0,.28,0)),Z.clone().add(at(0,.28,0))),t.yardPaint);const lt=tt.clone().add(at(0,-1.6,.1));o(ae(.05,.05,tt,lt),t.iron),w($t(lt,Z.clone().add(at(0,.28,0)),.02)),w($t(lt,at(0,1.2,Ki(1.2)),.025)),p.push([tt.clone(),at(0,.5,Ki(.5)+.05)]);for(const C of[-1,1])p.push([tt.clone().add(at(0,-.05,.2)),at(C*(bs(Ki(2.2)+1.2,2.2)+.05),2.2,Ki(2.2)+1.2)]);const Q=(C,F,R)=>{const M=x(C.z,C.top-1),H=M.clone().add(at(0,F*.55,F*.83));if(o(ae(.11,.07,M,H),t.yardPaint),R){const N=x(C.z,s(C.z)+1.2),O=N.clone().add(at(0,.35,R));if(o(ae(.13,.09,N,O),t.yardPaint),i.sails==="furled"){const Y=[];for(let it=0;it<=12;it++)Y.push(new P().lerpVectors(N,O,.05+.85*it/12).add(at(0,.25,0)));o(xr(Y,.22,.1),t.canvas)}w($t(H,O,.025))}if(i.sails==="furled"){const N=x(C.z,C.top-1.4),O=x(C.z,s(C.z)+2.6);o(xr([N.clone().add(at(0,0,.32)),new P().lerpVectors(N,O,.5).add(at(.04,0,.42)),O.clone().add(at(0,0,.36))],.2,.1),t.canvas)}if(A){const N=x(C.z,s(C.z)+1.6),O=R?x(C.z,s(C.z)+1.6).add(at(0,.4,R-.4)):N.clone().add(at(.4,.6,4.6)),Y=new An(1,1,12,14),it=Y.attributes.position,et=Y.attributes.uv;for(let b=0;b<it.count;b++){const v=it.getX(b)+.5,U=it.getY(b)+.5,B=new P().lerpVectors(M,H,v),j=new P().lerpVectors(N,O,v),W=new P().lerpVectors(j,B,U);W.x+=.9*Math.sin(v*Math.PI)*Math.sin(U*Math.PI)*(.9+.1*Math.sin(U*8)),it.setXYZ(b,W.x,W.y,W.z),et.setXY(b,v*R+v*5,W.y)}Y.computeVertexNormals(),o(Y,t.sailCloth)}return w($t(H,x(C.z,C.truck-3),.02)),{throat:M,peak:H}};Q(L.main,5.3,0);const xt=Q(L.mizzen,7,9.4),yt=i.rime?1.5:1,pt=C=>C*yt*.55,Bt=(C,F)=>bs(C,F-.02),qt=(C,F,R,M,H)=>{for(const N of[-1,1]){for(let et=0;et<F;et++){const b=C.z-M/2+et*H,v=Vn(b)-.2,U=Bt(b,v)+.25,B=at(N*U,v,b),j=x(C.z,R);j.x+=N*.25,w($t(B,j,pt(.035)))}const O=at(N*(Bt(C.z-M/2,Vn(C.z)-.2)+.25),Vn(C.z-M/2)-.2,C.z-M/2),Y=at(N*(Bt(C.z+M/2,Vn(C.z)-.2)+.25),Vn(C.z+M/2)-.2,C.z-M/2+(F-1)*H),it=x(C.z,R);it.x+=N*.25;for(let et=.6;et<R-O.y-1.5;et+=.38){const b=et/(R-O.y),v=new P().lerpVectors(O,it,b),U=new P().lerpVectors(Y,it,b);w($t(v,U,pt(.012)))}}};qt(L.fore,5,L.fore.top,3.2,.8),qt(L.main,4,L.main.top,2.4,.8),qt(L.mizzen,4,L.mizzen.top,2.4,.8);for(const[C,F]of Object.entries(L)){const R=C==="fore"?1.3:1.1,M=C==="fore"?F.cap:F.truck-1.2;for(const H of[-1,1]){for(let N=0;N<3;N++){const O=x(F.z,F.top).add(at(H*R,.05,-.5+N*.5)),Y=x(F.z,M).add(at(H*.15,0,0));w($t(O,Y,pt(.025)))}w($t(x(F.z,F.top).add(at(H*R,0,0)),x(F.z,F.top-2).add(at(H*.3,0,0)),pt(.02)));for(const N of[0,1]){const O=F.z+2.2+N*.9,Y=Vn(O)-.2;w($t(at(H*(Bt(O,Y)+.25),Y,O),x(F.z,M-.3+N*(C==="fore"?4:0)),pt(.03)))}}}const rt=x(L.fore.z,L.fore.top),dt=x(L.fore.z,L.fore.cap),wt=x(L.fore.z,L.fore.truck-1.4);w($t(rt,E.clone().add(at(0,.2,-.3)),pt(.045))),w($t(rt.clone().add(at(0,-.3,0)),E.clone().addScaledVector(q,1),pt(.04))),w($t(dt,tt.clone().add(at(0,.15,0)),pt(.035))),w($t(dt.clone().add(at(0,.6,0)),Z.clone().addScaledVector(q,-1.6).add(at(0,.28,0)),pt(.03))),w($t(wt,Z.clone().add(at(0,.28,0)),pt(.03)));const _t=x(L.main.z,L.main.top),zt=x(L.mizzen.z,L.mizzen.top);w($t(rt.clone().add(at(0,.4,0)),_t.clone().add(at(0,.1,0)),pt(.03),.3,8)),w($t(_t,zt.clone(),pt(.03),.25,8)),w($t(x(L.fore.z,L.fore.truck-.4),x(L.main.z,L.main.truck-.4),pt(.022),.4,8)),w($t(x(L.main.z,L.main.truck-.4),x(L.mizzen.z,L.mizzen.truck-.4),pt(.022),.4,8)),w($t(_t,at(0,Ae(Ls(L.fore.z+4.5))+.4,L.fore.z+4.5),pt(.035))),w($t(zt,at(0,s(L.main.z+2.5)+.4,L.main.z+2.6),pt(.035)));for(const{a:C,b:F,c:R,yd:M}of _){const H=x(z,M.y+(M.sail==="course"?.6:2));w($t(C,H,pt(.02))),w($t(F,H,pt(.02)));const N=M.sail==="course"?null:x(L.main.z,M.y-3.5);for(const[O,Y]of[[C,-1],[F,1]]){const it=N?N.clone().add(at(Y*.3,0,0)):at(Y*(Bt(z+6.5,3.3)+.1),Vn(z+6.5)+.1,z+6.5);w($t(O,it,pt(.018),.15,6))}}for(const C of[-1,1])w($t(xt.peak,at(C*2.6,Vn(St(41))+.2,St(41.5)),pt(.018),.1,6));const Ot=cn(m.map(C=>C.index?C.toNonIndexed():C));if(i.rime){const C=Ot.attributes.position,F=Ot.attributes.normal,R=new P(0,0,1);for(let M=0;M<C.count;M++){const H=C.getX(M),N=C.getY(M),O=C.getZ(M),Y=.5+.5*Math.sin(H*23.1+N*17.3+O*11.7)*Math.sin(H*7.3-O*13.1+N*5.1),it=.55+.45*Math.sin(N*1.7+H*.9+O*.6),et=Math.max(0,F.getX(M)*-.6+F.getZ(M)*R.z*.5+F.getY(M)*.4),b=(.006+.02*Y*it)*(.5+et);C.setXYZ(M,H+F.getX(M)*b,N+F.getY(M)*b,O+F.getZ(M)*b)}}o(Ot,t.rigging,!0,!0);{const C=(R,M=.16)=>{const H=new un(R),N=Math.floor(H.getLength()/M),O=[];for(let Y=0;Y<N;Y++){const it=(Y+.5)/N,et=H.getPointAt(it),b=H.getTangentAt(it),v=new Wn(.06,.018,4,8);v.scale(1.4,1,1);const U=new Pn().setFromUnitVectors(new P(1,0,0),b),B=new Pn().setFromAxisAngle(b,Y%2*Math.PI/2);v.applyQuaternion(U.premultiply(B)),v.translate(et.x,et.y,et.z),O.push(v)}return cn(O)};for(const[R,M]of p){const H=new P().lerpVectors(R,M,.5).add(at(0,-.18,0));o(C([R,H,M],.13),t.iron,!1)}const F=[[dt.clone(),tt.clone().add(at(0,.15,0))],[dt.clone().add(at(0,.6,0)),Z.clone().addScaledVector(q,-1.6).add(at(0,.28,0))],[wt.clone(),Z.clone().add(at(0,.28,0))]];if(A)for(const[R,M]of F){const H=new P().lerpVectors(M,R,.72),N=new P().lerpVectors(M,at(0,s(z)+2.5,z-1.5),.62),O=new ce,Y=10,it=[],et=[],b=[];for(let B=0;B<=Y;B++)for(let j=0;j<=Y-B;j++){const W=B/Y,ht=j/Y,ct=M.clone().multiplyScalar(1-W-ht).addScaledVector(H,W).addScaledVector(N,ht),ot=Math.sin(Math.PI*Math.min(1,W+ht))*4*W*ht*1.1;ct.x+=ot*.9,it.push(ct.x,ct.y,ct.z),et.push(W*8,ht*8)}let v=0;const U=[];for(let B=0;B<=Y;B++)U.push(v),v+=Y-B+1;for(let B=0;B<Y;B++)for(let j=0;j<Y-B;j++){const W=U[B]+j,ht=U[B+1]+j;b.push(W,ht,W+1),j<Y-B-1&&b.push(W+1,ht,ht+1)}O.setAttribute("position",new Yt(it,3)),O.setAttribute("uv",new Yt(et,2)),O.setIndex(b),O.computeVertexNormals(),o(O,t.sailCloth)}else for(const[R,[,M]]of F.slice(0,2).entries()){const H=M.clone().add(at(.05*(R?1:-1),.16,0)),N=E.clone().addScaledVector(q,.6).add(at(.05*(R?1:-1),.3,0));o(xr([H,new P().lerpVectors(H,N,.5).add(at(0,.04,0)),N],.12,.06),t.canvas)}for(const R of[-1,1]){const H=Ae(4.6)+.08,N=R*1.25,O=ae(.07,.07,at(N,H,St(4.6-1)),at(N,H,St(4.6+1))),Y=new Wn(.55,.06,5,12,Math.PI);Y.rotateX(-Math.PI/2),Y.translate(N,H,St(4.6+.45));const it=ae(.05,.05,at(N-R*.1,H+.05,St(4.6-1)),at(N-R*.1,H+.05,St(4.6+.7)));o(cn([O,(Y.toNonIndexed().index,Y),it].map(U=>U.index?U.toNonIndexed():U)),t.iron);const et=Ki(3)+.9,b=bs(et,3)+.02,v=R*(b+3);o(C([at(R*b,3,et),at(R*(b+.4),1.6,et-.5),at(R*(b+1.6),.55,et-1.6),at(v,.45,et-3.4)]),t.iron,!1)}for(const[R,M,H]of[[-1,9,-14],[1,11,-10]]){const N=St(3),O=at(R*1.6,s(N)+.6,N),Y=at(R*M,.45,N+H);o($t(O,Y,i.rime?.05:.035,1.2,12),t.rigging,!1),o(ae(.06,.05,Y.clone().add(at(0,-.4,0)),Y.clone().add(at(0,.5,0))),t.iron)}{const R=St(13.2),M=Vn(R),H=bs(R,M-.05),N=at(-(H+.05),M,R),O=at(-(H+2.2),.3,R),Y=[];for(const it of[-.3,.3])Y.push(ae(.04,.04,N.clone().add(at(0,0,it)),O.clone().add(at(0,0,it))));for(let it=1;it<10;it++){const et=new P().lerpVectors(O,N,it/10);Y.push(ae(.025,.025,et.clone().add(at(0,0,-.3)),et.clone().add(at(0,0,.3))))}o(cn(Y),t.spar)}}return n.rotation.z=i.heel??0,n.rotation.x=i.trim??0,n.position.y=i.lift??0,e.traverse(C=>{C.isMesh&&!C.material.__curv&&(Yv(C.material),C.material.__curv=!0)}),{group:e,hullGroup:n,waterlineHalfLength:(__(0)-Ki(0))/2,waterlineHalfBeam:v_+.15,stovePipeTop:r,funnelTop:at(0,10.1,St(30.3)),portSideAt:C=>({z:St(C),halfBeam:bs(St(C),.5)}),update(){}}}const ks=[{id:"longnight",title:"The Long Night",caption:"Beset in the Weddell Sea, rigging furred with rime",year:1915,month:8,day:27,lat:-70.13,lon:-50.83,heading:270,rime:!0,snowOnShip:1,sails:"unbent",dayMinutes:12*60,nightMinutes:3*60+30,defaultMinutes:11*60+20,camera:"quarter",clearings:[[-8,-42,15]],tempC:-27,clouds:.45},{id:"fullsail",title:"Under Full Sail",caption:"All sail set to break out of the pack, February 1915",year:1915,month:2,day:14,lat:-76.9,lon:-35,heading:300,rime:!1,snowOnShip:.15,sails:"set",yardBrace:.62,steam:!0,dayMinutes:15*60+30,nightMinutes:0*60+30,defaultMinutes:15*60+30,camera:"paget",tempC:-8,clouds:.2},{id:"pressure",title:"Thirty Degrees to Port",caption:"Pressure lifts and heels the ship, 18 October 1915",year:1915,month:10,day:18,lat:-69.32,lon:-50.67,heading:255,rime:!1,snowOnShip:.55,sails:"unbent",heel:30*Math.PI/180,lift:.9,trim:-.02,dayMinutes:15*60,nightMinutes:0*60+15,defaultMinutes:15*60,camera:"heeled",tempC:-20,clouds:1}];for(const i of ks)i.ship={heading:i.heading*Math.PI/180};const Mn=(i,t,e,n,s,r=.6)=>({id:i,label:t,vfov:s,pos:e,apply(o,a,l,c,h){const u=Math.sin(l*.07)*r,f=new P(e[0]+u,e[1]+Math.sin(l*.05)*.1,e[2]+Math.cos(l*.06)*r),d=new P(...n);return c.group.localToWorld(f),c.group.localToWorld(d),o.position.copy(f),a.target.copy(d),h&&o.lookAt(d),s}}),jr=[Mn("quarter","Port quarter, into the sun",[-36,3,40],[0,9,-2],34),Mn("starboard","Starboard bow",[38,2.6,-46],[0,9,2],34),Mn("flash","Hurley · flash photograph",[-8,2.3,-42],[1,11,-14],53,.1),Mn("paget","Bow-on, behind the rubble",[8,1.6,-69],[0,13,-8],38,.2),Mn("broadside","Broadside, 95 m abeam",[95,1.9,1],[0,9,8],30,.4),Mn("heeled","Port quarter",[-45,1.9,91],[0,7,6],27,.3),Mn("prow","Under the prow",[2.5,1.3,-22.5],[-3,3.2,-34],56,.08),Mn("bowclose","Bow, close",[16,3.5,-40],[0,5.5,-16],40,.1),Mn("stern","Stern counter",[-9,3,34],[0,2.6,21],34,.05),Mn("deck","Deck from the fore top",[.5,14.6,-9],[.2,4,12],62,.05),Mn("far","Across the pack, 350 m",[-260,3.2,-235],[0,8,0],14,.5)],Hc=i=>{const t=(Math.round(i)%1440+1440)%1440;return`${String(Math.floor(t/60)).padStart(2,"0")}:${String(t%60).padStart(2,"0")}`},Vc=(i,t,e)=>{const n=Math.abs(i),s=Math.floor(n),r=Math.round((n-s)*60);return`${s}°${String(r).padStart(2,"0")}′${i<0?e:t}`},Gc=["January","February","March","April","May","June","July","August","September","October","November","December"],E_=["Natural","Silver print","Paget plate"];function w_(i,t,{onChange:e,moments:n,shots:s}){i.innerHTML=`
  <div class="caption">
    <div class="eyebrow">ENDURANCE · ${t.moment.day} ${Gc[t.moment.month-1].toUpperCase()} ${t.moment.year}</div>
    <div class="title">${t.moment.title}</div>
    <div class="sub">${t.moment.caption}</div>
    <div class="meta"><span>${Vc(t.moment.lat,"N","S")} ${Vc(t.moment.lon,"E","W")}</span><span data-k="clock"></span><span data-k="sun"></span><span data-k="moon"></span></div>
  </div>
  <div class="hint" data-k="hint">DRAG TO LOOK · SCROLL TO ZOOM</div>
  <div class="bar">
    <label class="grp">Moment
      <select data-k="moment">${n.map(h=>`<option value="${h.id}" ${h.id===t.moment.id?"selected":""}>${h.day} ${Gc[h.month-1].slice(0,3)} · ${h.title}</option>`).join("")}</select>
    </label>
    <div class="grp time">
      <button data-k="daynight" class="pill"></button>
      <input type="range" data-k="time" min="0" max="1439" step="1" value="${t.minutes}">
      <span data-k="timeLabel" class="val"></span>
      <button data-k="play" class="pill ghost" title="Time-lapse">▶</button>
    </div>
    <button data-k="flash" class="pill ghost" title="Magnesium flash, as Hurley lit the ship on 27 August 1915">Flash</button>
    <label class="grp">Shot
      <select data-k="shot"><option value="free">Free look</option>${s.map(h=>`<option value="${h.id}">${h.label}</option>`).join("")}</select>
    </label>
    <label class="grp">Look
      <select data-k="look">${E_.map((h,u)=>`<option value="${u}" ${u===t.look?"selected":""}>${h}</option>`).join("")}</select>
    </label>
    <label class="grp">FOV <input type="range" data-k="fov" min="12" max="70" step="1" value="${t.fov}"></label>
    <label class="grp">Grain <input type="range" data-k="grain" min="0" max="1" step="0.01" value="${t.grain}"></label>
    <span class="key">H hides</span>
  </div>`;const r=h=>i.querySelector(`[data-k="${h}"]`),o=r("time");let a=!1;r("moment").onchange=h=>{const u=new URL(location.href);u.searchParams.set("moment",h.target.value),u.searchParams.delete("t"),u.searchParams.delete("cam"),location.href=u.toString()},o.oninput=()=>{t.minutes=Math.floor(t.minutes/1440)*1440+ +o.value,e()};let l=Math.abs(t.minutes%1440-t.moment.nightMinutes)<Math.abs(t.minutes%1440-t.moment.dayMinutes);r("daynight").onclick=()=>{l=!l;const h=Math.floor(t.minutes/1440);t.minutes=h*1440+(l?t.moment.nightMinutes:t.moment.dayMinutes),o.value=t.minutes%1440,e()},r("play").onclick=()=>{a=!a,r("play").textContent=a?"❚❚":"▶"},r("flash").onclick=()=>{t.flash=!t.flash,r("flash").classList.toggle("on",t.flash)},r("flash").classList.toggle("on",t.flash),r("shot").onchange=h=>{t.shot=h.target.value,e()},r("look").onchange=h=>t.look=+h.target.value,r("fov").oninput=h=>t.fov=+h.target.value,r("grain").oninput=h=>t.grain=+h.target.value,addEventListener("keydown",h=>{(h.key==="h"||h.key==="H")&&i.classList.toggle("hidden")}),new URLSearchParams(location.search).has("clean")&&i.classList.add("hidden");let c=performance.now();return{get playing(){return a},update(h,u){const f=performance.now(),d=(f-c)/1e3;c=f,a&&(t.minutes+=d*6,o.value=Math.floor(t.minutes)%1440),t.__sunAlt=u.sun.altitude,r("timeLabel").textContent=Hc(t.minutes);const g=Math.floor(t.minutes/1440);r("clock").textContent=`${Hc(t.minutes)} ship's time${g?` (+${g}d)`:""}`,r("sun").textContent=`Sun ${u.sun.altitude>=0?"+":"−"}${Math.abs(u.sun.altitude).toFixed(1)}° az ${Math.round(u.sun.azimuth)}°`,r("moon").textContent=u.moon.altitude>0?`Moon ${Math.round(u.moon.illumination*100)}% at ${u.moon.altitude.toFixed(0)}°`:"Moon below horizon",r("daynight").textContent=u.sun.altitude>-.8?l?"☀ Midnight sun":"☀ Day":"☾ Night",r("fov").value=t.fov}}}const de=new URLSearchParams(location.search),Qh=document.getElementById("c"),Ke=new Eg({canvas:Qh,antialias:!1,powerPreference:"high-performance",preserveDrawingBuffer:de.has("capture")});let ai=Math.min(devicePixelRatio,1.5);Ke.setPixelRatio(ai);Ke.setSize(innerWidth,innerHeight);Ke.toneMapping=Kn;Ke.outputColorSpace=Qn;Ke.shadowMap.enabled=!0;Ke.shadowMap.type=$c;const mn=new Ka,Ue=new nn(38,innerWidth/innerHeight,.1,8e4),Zt={moment:ks[0],minutes:ks[0].defaultMinutes,shot:de.get("cam")||null,look:0,grain:.35,fov:38,flash:!1};de.has("moment")&&(Zt.moment=ks.find(i=>i.id===de.get("moment"))||Zt.moment);Zt.minutes=de.has("t")?N_(de.get("t")):Zt.moment.defaultMinutes;de.has("look")&&(Zt.look=+de.get("look"));de.has("flash")&&(Zt.flash=de.get("flash")==="1");globalThis.__debugIrr=de.has("irr");const Jn=new Tv(Ke),li=new Nv(mn,Jn,Zt.moment),Zr=new n_(mn);Jn.uniforms.uCloudCover.value=de.has("clouds")?+de.get("clouds"):Zt.moment.clouds??.4;Zr.starUniforms.uCloudCover.value=Jn.uniforms.uCloudCover.value;Zr.starUniforms.uCloudOffset.value=Jn.uniforms.uCloudOffset.value;const tu=new r_(mn,Jn);de.has("cdebug")&&(tu.uniforms.uDebug.value=+de.get("cdebug"));const eu=Zt.moment.ship,Re=b_(Zt.moment);Re.group.position.set(0,0,0);Re.group.rotation.y=-eu.heading;mn.add(Re.group);Re.group.updateMatrixWorld(!0);Re.group.updateMatrixWorld(!0);const nu=!de.has("noice"),zr=new zv({ship:{x:0,z:0,heading:eu.heading,halfLength:Re.waterlineHalfLength,halfBeam:Re.waterlineHalfBeam}}),La=Wv();de.has("debug")&&(al.uDebug.value=+de.get("debug")||1);const T_=performance.now();nu&&(mn.add(zr.buildMesh(La)),mn.add(zr.buildFar(La)));const A_=jr.map(i=>[i.pos[0],i.pos[2],i.id==="far"?75:i.id==="heeled"?14:6]),C_=[...Zt.moment.clearings||[],...A_].map(([i,t,e])=>{const n=Re.group.localToWorld(new P(i,0,t));return[n.x,n.z,e]});nu&&mn.add(zr.buildBlocks(Xv(),{clearings:C_,pillowMaterial:La}));console.log("ice built in",Math.round(performance.now()-T_),"ms");const Wc=new l_(Re.hullGroup,Zt.moment.steam?Re.funnelTop:Re.stovePipeTop,Zt.moment.steam),Xc={},Ln=new uv(Ue,Qh);Ln.enableDamping=!0;Ln.dampingFactor=.06;Ln.target.set(0,8,0);Ln.maxPolarAngle=Math.PI*.92;Ln.minDistance=6;Ln.maxDistance=900;Ue.position.set(-70,6,40);const hn=new e_(Ke,mn,Ue);mn.traverse(i=>{const t=i.material?Array.isArray(i.material)?i.material:[i.material]:[];for(const e of t)e.onBeforeCompile&&!e.__keyed&&(e.__keyed=!0,e.customProgramCacheKey=()=>e.uuid)});const Br=new Cn,R_=[[-22,1.6,-36,1,!0],[12,1.2,-34,.45,!0],[-18,2,4,.7,!1],[17,1.8,10,.6,!1],[-6,1.5,30,.5,!1]];for(const[i,t,e,n,s]of R_){const r=new av(16774116,0,160,2);r.position.copy(Re.group.localToWorld(new P(i,t,e))),r.userData.k=n,s&&(r.castShadow=!0,r.shadow.mapSize.set(1024,1024),r.shadow.bias=-.002),Br.add(r)}mn.add(Br);const P_=new P;let kr=!0,Yc="";function D_(){const i=F_(Zt.moment,Zt.minutes),t=li.setTime(i,P_);Zr.setSky(Zt.moment.lat,Cv(i,Zt.moment.lon));const e=`${t.sun.altitude.toFixed(2)}|${t.sun.azimuth.toFixed(1)}|${t.moon.altitude.toFixed(1)}|${t.moon.azimuth.toFixed(0)}|${t.moon.illumination.toFixed(2)}`;return e!==Yc&&(Yc=e,kr=!0),{date:i,st:t}}let qc=0;function L_(){if(!kr)return;const i=performance.now();if(i-qc<160)return;qc=i,kr=!1;const{background:t,environment:e}=Jn.update();mn.background=t,mn.environment=e,jh.uSkyCube.value=Jn.envRT.texture,tu.uniforms.uClearSky.value=t}const jc=new zh;let Ia=0,Es=0,Hr=0;function iu(){requestAnimationFrame(iu);try{I_()}catch(i){console.error("frame error",i)}}function I_(){var c;const i=Math.min(jc.getDelta(),.1),t=jc.elapsedTime,{date:e,st:n}=D_();L_(),al.uTime.value=t,Jn.uniforms.uCloudOffset.value.x+=i*6*(Oo.playing?360:1),Jn.uniforms.uCloudOffset.value.y+=i*4.5*(Oo.playing?360:1);const s=Zt.flash;if(Br.visible=s,Br.children.forEach(h=>h.intensity=2600*h.userData.k),Zt.shot&&Zt.shot!=="free"){Ia+=i;const h=jr.find(u=>u.id===Zt.shot);h&&h.apply(Ue,Ln,Ia,Re)}Ue.fov=Zt.fov,Ue.updateProjectionMatrix(),Ln.update(),zr.sample(Ue.position.x,Ue.position.z,Xc);const r=Math.max(.9,Xc.h+1.1);Ue.position.y<r&&(Ue.position.y=r),Zr.update(Ue,li.sunDir,li.moonDir,n.tSun,n.tMoon,li.sunIntensity,t,Ke.getPixelRatio(),hn.u.uExposure.value||1);let o=li.exposure();const a=Hr>0?(Hr--,0):hn.meter();if(a>0){const h=.36/a;Es=Es?Es*Math.pow(h/Es,Math.min(1,i*2.5)):h;const u=Rn.clamp(Es,o/8,o*3);o=Math.exp(Rn.lerp(Math.log(o),Math.log(u),.8))}s&&(o=Math.min(o,.85)),hn.u.uExposure.value=o,hn.u.uLook.value=Zt.look;const l=Math.log10(li.state.e||1);hn.u.uNight.value=s?0:Rn.smoothstep(-l,4.8,6.6),hn.u.uGrain.value=Zt.grain,hn.bloom.threshold=2.2/o,hn.u.uSaturation.value=Zt.look===0?.92:1,hn.u.uContrast.value=1.04,(c=Re.update)==null||c.call(Re,t,n),Wc.points.visible=!s,Wc.update(t,Ue,Ke,.5*(li.state.e||0)*li.sunIntensity/Math.PI+(s?.6:0)),hn.render(t),Oo.update(e,n),U_(i)}const Oo=w_(document.getElementById("ui"),Zt,{onChange(){kr=!0,Ia=0},moments:ks,shots:jr});let Mr=0,zo=0;function U_(i){if(de.has("capture")||(Mr+=i,zo++,Mr<2))return;const t=zo/Mr;Mr=0,zo=0;const e=t<40?Math.max(.75,ai-.25):t>58?Math.min(devicePixelRatio,1.5,ai+.25):ai;e!==ai&&(ai=e,Ke.setPixelRatio(ai),Ke.setSize(innerWidth,innerHeight),hn.setSize(innerWidth,innerHeight,ai),Hr=8)}addEventListener("resize",()=>{Ue.aspect=innerWidth/innerHeight,Ue.updateProjectionMatrix(),Ke.setSize(innerWidth,innerHeight),hn.setSize(innerWidth,innerHeight,Ke.getPixelRatio()),Hr=8});const Zc=jr.find(i=>i.id===(Zt.shot||Zt.moment.camera));Zc&&(Zt.fov=Zc.apply(Ue,Ln,0,Re,!0));Zt.shot||(Zt.shot="free");de.has("fov")&&(Zt.fov=+de.get("fov"));if(de.has("campos")){Ln.maxDistance=6e3,Ue.near=5;const[i,t,e]=de.get("campos").split(",").map(Number),[n,s,r]=(de.get("camtgt")||"0,4,0").split(",").map(Number);Ue.position.copy(Re.group.localToWorld(new P(i,t,e))),Ln.target.copy(Re.group.localToWorld(new P(n,s,r))),Zt.shot="free"}requestAnimationFrame(iu);window.__ready=!0;function N_(i){const[t,e]=i.split(":").map(Number);return t*60+(e||0)}function F_(i,t){const e=Date.UTC(i.year,i.month-1,i.day),n=new Date(e+(t-i.lon/15*60)*6e4),s=Vh(n,i.lat,i.lon).eqTime;return new Date(n.getTime()-s*6e4)}
