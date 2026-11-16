'use strict';
// One bounded WebGL scene: procedural liquid, luminous geometry and an extruded code mark.
// No third-party runtime, remote textures or AI API calls.
window.createPortalScene = function(canvas) {
 const gl=canvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'low-power',preserveDrawingBuffer:true});
 if(!gl)return null;
 const vertex='attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';
 const fragment=`precision mediump float;
 uniform vec2 u_resolution,u_pointer,u_logo;
 uniform vec3 u_accent;
 uniform float u_time,u_scroll,u_speed,u_pulse,u_material,u_logoSize,u_light;
 mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
 float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
 float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
 float field(vec2 p){return noise(p)*.55+noise(p*2.1+3.)*.28+noise(p*4.2)*.17;}
 float capsule(vec3 p,vec3 a,vec3 b,float r){vec3 pa=p-a,ba=b-a;return length(pa-ba*clamp(dot(pa,ba)/dot(ba,ba),0.,1.))-r;}
 vec3 turn(vec3 p){p.xz=rot(sin(u_time*.19)*.35)*p.xz;p.xy=rot(sin(u_time*.13)*.045)*p.xy;return p;}
 float shape(vec3 p){p=turn(p);float a=capsule(p,vec3(-.65,0.,0.),vec3(-.22,.43,0.),.105);a=min(a,capsule(p,vec3(-.65,0.,0.),vec3(-.22,-.43,0.),.105));a=min(a,capsule(p,vec3(.22,.43,0.),vec3(.65,0.,0.),.105));a=min(a,capsule(p,vec3(.22,-.43,0.),vec3(.65,0.,0.),.105));return min(a,capsule(p,vec3(-.1,-.49,0.),vec3(.11,.49,0.),.085));}
 vec3 normalAt(vec3 p){vec2 e=vec2(.002,0.);return normalize(vec3(shape(p+e.xyy)-shape(p-e.xyy),shape(p+e.yxy)-shape(p-e.yxy),shape(p+e.yyx)-shape(p-e.yyx)));}
 void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution,asp=vec2(u_resolution.x/u_resolution.y,1.);vec2 p=(uv-.5)*asp;
  vec2 mouse=(u_pointer-.5)*asp;float dist=length(p-mouse);float force=exp(-dist*6.);
  p+=normalize(p-mouse+vec2(.001))*force*.045*sin(u_time*1.5+dist*12.);
  float wave=field(p*3.+vec2(u_time*.045,-u_scroll*.0015));float ridge=sin(p.y*8.+wave*8.+u_time*.22+u_scroll*.001+u_speed*.5);
  float fold=pow(max(0.,1.-abs(ridge)),6.);float haze=exp(-length(p-vec2(.28,.05))*2.);
  vec3 base=mix(vec3(.014,.025,.04),vec3(.72,.8,.82),u_light);
  vec3 colour=base+u_accent*(fold*.16+haze*.035+force*.035);
  float mode=mod(floor(u_material+.5),3.);
  if(mode<.5){colour+=vec3(.28,.34,.37)*pow(max(0.,sin(p.x*5.+wave*6.+u_time*.12)),24.)*.5;}
  else if(mode<1.5){float caustic=pow(max(0.,sin(p.x*10.+wave*9.)*sin(p.y*12.-wave*4.)),12.);colour+=u_accent*caustic*.3;}
  else{vec2 grid=abs(fract((p+wave*.025)*25.)-.5);float lines=1.-smoothstep(.015,.04,min(grid.x,grid.y));colour+=u_accent*lines*.065;}
  float rip=abs(length(p-mouse)-u_pulse*.9);colour+=u_accent*exp(-rip*70.)*(1.-min(1.,u_pulse))*.3;
  float scan=pow(max(0.,1.-abs(fract(uv.y+u_scroll*.00015-u_time*.012)-.5)*2.),70.);colour+=u_accent*scan*.06;
  vec2 q=(gl_FragCoord.xy-u_logo)/max(1.,u_logoSize);
  if(abs(q.x)<1.35&&abs(q.y)<1.1&&u_logoSize>8.){
   vec3 ro=vec3(0.,0.,3.8),rd=normalize(vec3(q*1.7,-3.));float travel=0.;bool hit=false;vec3 pos;
   for(int i=0;i<48;i++){pos=ro+rd*travel;float d=shape(pos);if(d<.003){hit=true;break;}travel+=d;if(travel>7.)break;}
   if(hit){vec3 n=normalAt(pos),light=normalize(vec3(mouse.x*2.+.5,mouse.y*2.+1.2,2.));float diffuse=max(0.,dot(n,light)),fres=pow(1.-max(0.,dot(n,-rd)),3.);float spec=pow(max(0.,dot(reflect(-light,n),-rd)),50.);float bands=.5+.5*sin(n.x*8.+n.y*5.+u_time*.35);
    vec3 metal=mix(vec3(.07,.12,.16),vec3(.8,.94,.96),diffuse*.5+bands*.3)+u_accent*fres*.9+vec3(spec);
    vec3 glass=mix(colour*1.8,u_accent*.2,diffuse*.25)+u_accent*fres+vec3(spec*.8)+vec3(diffuse*.1);
    vec3 digital=u_accent*(.12+diffuse*.4+fres*.7)+vec3(spec*.6);digital*=.65+.35*step(.5,fract(pos.y*30.));
    colour=mix(mix(metal,glass,smoothstep(0.,1.,u_material)),digital,smoothstep(1.,2.,u_material));
   }
  }
  float grain=(hash(gl_FragCoord.xy+mod(u_time,100.))-.5)*.008;
  colour+=grain;colour=mix(colour,vec3(.7,.78,.8),u_light*.12);gl_FragColor=vec4(clamp(colour,0.,1.),1.);
 }`;
 function compile(type,source){const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){const message=gl.getShaderInfoLog(shader);gl.deleteShader(shader);throw Error(message);}return shader;}
 let program;try{program=gl.createProgram();const vs=compile(gl.VERTEX_SHADER,vertex),fs=compile(gl.FRAGMENT_SHADER,fragment);gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));}catch(error){console.warn('WebGL scene fallback:',error.message);return null;}
 gl.useProgram(program);const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);const attribute=gl.getAttribLocation(program,'a');gl.enableVertexAttribArray(attribute);gl.vertexAttribPointer(attribute,2,gl.FLOAT,false,0,0);
 const uniforms={};['resolution','pointer','logo','accent','time','scroll','speed','pulse','material','logoSize','light'].forEach(name=>uniforms[name]=gl.getUniformLocation(program,'u_'+name));
 let disposed=false;
 return {
  draw(state){if(disposed||gl.isContextLost())return;const ratio=Math.min(state.ratio||1,1.35),width=Math.max(1,Math.round(state.width*ratio)),height=Math.max(1,Math.round(state.height*ratio));if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;gl.viewport(0,0,width,height);}gl.uniform2f(uniforms.resolution,width,height);gl.uniform2f(uniforms.pointer,state.pointer[0],state.pointer[1]);gl.uniform2f(uniforms.logo,state.logo[0]*ratio,(state.height-state.logo[1])*ratio);gl.uniform3fv(uniforms.accent,state.accent);gl.uniform1f(uniforms.logoSize,state.logoSize*ratio);['time','scroll','speed','pulse','material','light'].forEach(name=>gl.uniform1f(uniforms[name],state[name]||0));gl.drawArrays(gl.TRIANGLES,0,6);},
  dispose(){disposed=true;gl.deleteBuffer(buffer);gl.deleteProgram(program);}
 };
};
