/*!
 * @pixi/unsafe-eval - v6.3.0
 * Compiled Wed, 23 Mar 2022 18:58:56 UTC
 *
 * @pixi/unsafe-eval is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var GLSL_TO_SINGLE_SETTERS={float:function(i,n,o,u){o!==u&&(o.v=u,i.uniform1f(n,u))},vec2:function(i,n,o,u){o[0]===u[0]&&o[1]===u[1]||(o[0]=u[0],o[1]=u[1],i.uniform2f(n,u[0],u[1]))},vec3:function(i,n,o,u){o[0]===u[0]&&o[1]===u[1]&&o[2]===u[2]||(o[0]=u[0],o[1]=u[1],o[2]=u[2],i.uniform3f(n,u[0],u[1],u[2]))},int:function(i,n,o,u){i.uniform1i(n,u)},ivec2:function(i,n,o,u){i.uniform2i(n,u[0],u[1])},ivec3:function(i,n,o,u){i.uniform3i(n,u[0],u[1],u[2])},ivec4:function(i,n,o,u){i.uniform4i(n,u[0],u[1],u[2],u[3])},uint:function(i,n,o,u){i.uniform1ui(n,u)},uvec2:function(i,n,o,u){i.uniform2ui(n,u[0],u[1])},uvec3:function(i,n,o,u){i.uniform3ui(n,u[0],u[1],u[2])},uvec4:function(i,n,o,u){i.uniform4ui(n,u[0],u[1],u[2],u[3])},bool:function(i,n,o,u){o!==u&&(o.v=u,i.uniform1i(n,Number(u)))},bvec2:function(i,n,o,u){i.uniform2i(n,u[0],u[1])},bvec3:function(i,n,o,u){i.uniform3i(n,u[0],u[1],u[2])},bvec4:function(i,n,o,u){i.uniform4i(n,u[0],u[1],u[2],u[3])},mat2:function(i,n,o,u){i.uniformMatrix2fv(n,!1,u)},mat3:function(i,n,o,u){i.uniformMatrix3fv(n,!1,u)},mat4:function(i,n,o,u){i.uniformMatrix4fv(n,!1,u)},sampler2D:function(i,n,o,u){i.uniform1i(n,u)},samplerCube:function(i,n,o,u){i.uniform1i(n,u)},sampler2DArray:function(i,n,o,u){i.uniform1i(n,u)}},GLSL_TO_ARRAY_SETTERS={float:function(i,n,o,u){i.uniform1fv(n,u)},vec2:function(i,n,o,u){i.uniform2fv(n,u)},vec3:function(i,n,o,u){i.uniform3fv(n,u)},vec4:function(i,n,o,u){i.uniform4fv(n,u)},int:function(i,n,o,u){i.uniform1iv(n,u)},ivec2:function(i,n,o,u){i.uniform2iv(n,u)},ivec3:function(i,n,o,u){i.uniform3iv(n,u)},ivec4:function(i,n,o,u){i.uniform4iv(n,u)},uint:function(i,n,o,u){i.uniform1uiv(n,u)},uvec2:function(i,n,o,u){i.uniform2uiv(n,u)},uvec3:function(i,n,o,u){i.uniform3uiv(n,u)},uvec4:function(i,n,o,u){i.uniform4uiv(n,u)},bool:function(i,n,o,u){i.uniform1iv(n,u)},bvec2:function(i,n,o,u){i.uniform2iv(n,u)},bvec3:function(i,n,o,u){i.uniform3iv(n,u)},bvec4:function(i,n,o,u){i.uniform4iv(n,u)},sampler2D:function(i,n,o,u){i.uniform1iv(n,u)},samplerCube:function(i,n,o,u){i.uniform1iv(n,u)},sampler2DArray:function(i,n,o,u){i.uniform1iv(n,u)}};function syncUniforms(i,n,o,u,f){var r=0,t=null,e=null,c=f.gl;for(var m in i.uniforms){var v=n[m],a=u[m],l=o[m],s=i.uniforms[m];if(v)if("float"===v.type&&1===v.size)a!==l.value&&(l.value=a,c.uniform1f(l.location,a));else if("sampler2D"!==v.type&&"samplerCube"!==v.type&&"sampler2DArray"!==v.type||1!==v.size||v.isArray)if("mat3"===v.type&&1===v.size)void 0!==s.a?c.uniformMatrix3fv(l.location,!1,a.toArray(!0)):c.uniformMatrix3fv(l.location,!1,a);else if("vec2"===v.type&&1===v.size)void 0!==s.x?(t=a,(e=l.value)[0]===t.x&&e[1]===t.y||(e[0]=t.x,e[1]=t.y,c.uniform2f(l.location,t.x,t.y))):(t=a,(e=l.value)[0]===t[0]&&e[1]===t[1]||(e[0]=t[0],e[1]=t[1],c.uniform2f(l.location,t[0],t[1])));else if("vec4"===v.type&&1===v.size)void 0!==s.width?(t=a,(e=l.value)[0]===t.x&&e[1]===t.y&&e[2]===t.width&&e[3]===t.height||(e[0]=t.x,e[1]=t.y,e[2]=t.width,e[3]=t.height,c.uniform4f(l.location,t.x,t.y,t.width,t.height))):(t=a,(e=l.value)[0]===t[0]&&e[1]===t[1]&&e[2]===t[2]&&e[3]===t[3]||(e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],c.uniform4f(l.location,t[0],t[1],t[2],t[3])));else{(1===v.size?GLSL_TO_SINGLE_SETTERS:GLSL_TO_ARRAY_SETTERS)[v.type].call(null,c,l.location,l.value,a)}else f.texture.bind(a,r),l.value!==r&&(l.value=r,c.uniform1i(l.location,r)),r++;else s.group&&f.shader.syncUniformGroup(a)}}function install(i){var n=i.ShaderSystem;if(!n)throw new Error("Unable to patch ShaderSystem, class not found.");Object.assign(n.prototype,{systemCheck:function(){},syncUniforms:function(i,n){var o=this.shader,u=this.renderer;syncUniforms(i,o.program.uniformData,n.uniformData,i.uniforms,u)}})}exports.install=install;
//# sourceMappingURL=unsafe-eval.min.js.map