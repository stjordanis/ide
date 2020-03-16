/// GLSL 300 does not allow for overloading primitive functions. This module defines an utility
/// which scans the GLSL code and mangles all names of primitive functions. This way we can define
/// overloaded functions the same way as we did in GLSL 100.

let builtins =
`float radians(float degrees)
vec2 radians(vec2 degrees)
vec3 radians(vec3 degrees)
vec4 radians(vec4 degrees)
float degrees(float radians)
vec2 degrees(vec2 radians)
vec3 degrees(vec3 radians)
vec4 degrees(vec4 radians)
float sin(float angle)
vec2 sin(vec2 angle)
vec3 sin(vec3 angle)
vec4 sin(vec4 angle)
float cos(float angle)
vec2 cos(vec2 angle)
vec3 cos(vec3 angle)
vec4 cos(vec4 angle)
float tan(float angle)
vec2 tan(vec2 angle)
vec3 tan(vec3 angle)
vec4 tan(vec4 angle)
float asin(float x)
vec2 asin(vec2 x)
vec3 asin(vec3 x)
vec4 asin(vec4 x)
float acos(float x)
vec2 acos(vec2 x)
vec3 acos(vec3 x)
vec4 acos(vec4 x)
float pow(float x, float y)
vec2 pow(vec2 x, vec2 y)
vec3 pow(vec3 x, vec3 y)
vec4 pow(vec4 x, vec4 y)
float exp(float x)
vec2 exp(vec2 x)
vec3 exp(vec3 x)
vec4 exp(vec4 x)
float log(float x)
vec2 log(vec2 x)
vec3 log(vec3 x)
vec4 log(vec4 x)
float exp2(float x)
vec2 exp2(vec2 x)
vec3 exp2(vec3 x)
vec4 exp2(vec4 x)
float log2(float x)
vec2 log2(vec2 x)
vec3 log2(vec3 x)
vec4 log2(vec4 x)
float sqrt(float x)
vec2 sqrt(vec2 x)
vec3 sqrt(vec3 x)
vec4 sqrt(vec4 x)
mat2 inverse(mat2 m)
mat3 inverse(mat3 m)
mat4 inverse(mat4 m)
float inversesqrt(float x)
vec2 inversesqrt(vec2 x)
vec3 inversesqrt(vec3 x)
vec4 inversesqrt(vec4 x)
float abs(float x)
vec2 abs(vec2 x)
vec3 abs(vec3 x)
vec4 abs(vec4 x)
float sign(float x)
vec2 sign(vec2 x)
vec3 sign(vec3 x)
vec4 sign(vec4 x)
float floor(float x)
vec2 floor(vec2 x)
vec3 floor(vec3 x)
vec4 floor(vec4 x)
float ceil(float x)
vec2 ceil(vec2 x)
vec3 ceil(vec3 x)
vec4 ceil(vec4 x)
float fract(float x)
vec2 fract(vec2 x)
vec3 fract(vec3 x)
vec4 fract(vec4 x)
float mod(float x, float y)
vec2 mod(vec2 x, vec2 y)
vec3 mod(vec3 x, vec3 y)
vec4 mod(vec4 x, vec4 y)
vec2 mod(vec2 x, float y)
vec3 mod(vec3 x, float y)
vec4 mod(vec4 x, float y)
float min(float x, float y)
vec2 min(vec2 x, vec2 y)
vec3 min(vec3 x, vec3 y)
vec4 min(vec4 x, vec4 y)
vec2 min(vec2 x, float y)
vec3 min(vec3 x, float y)
vec4 min(vec4 x, float y)
vec2 max(vec2 x, vec2 y)
vec3 max(vec3 x, vec3 y)
vec4 max(vec4 x, vec4 y)
float max(float x, float y)
vec2 max(vec2 x, float y)
vec3 max(vec3 x, float y)
vec4 max(vec4 x, float y)
vec2 clamp(vec2 x, vec2 minVal, vec2 maxVal)
vec3 clamp(vec3 x, vec3 minVal, vec3 maxVal)
vec4 clamp(vec4 x, vec4 minVal, vec4 maxVal)
float clamp(float x, float minVal, float maxVal)
vec2 clamp(vec2 x, float minVal, float maxVal)
vec3 clamp(vec3 x, float minVal, float maxVal)
vec4 clamp(vec4 x, float minVal, float maxVal)
vec2 mix(vec2 x, vec2 y, vec2 a)
vec3 mix(vec3 x, vec3 y, vec3 a)
vec4 mix(vec4 x, vec4 y, vec4 a)
float mix(float x, float y, float a)
vec2 mix(vec2 x, vec2 y, float a)
vec3 mix(vec3 x, vec3 y, float a)
vec4 mix(vec4 x, vec4 y, float a)
vec2 step(vec2 edge, vec2 x)
vec3 step(vec3 edge, vec3 x)
vec4 step(vec4 edge, vec4 x)
float step(float edge, float x)
vec2 step(float edge, vec2 x)
vec3 step(float edge, vec3 x)
vec4 step(float edge, vec4 x)
float smoothstep(float edge0, float edge1, float x)
vec2 smoothstep(vec2 edge0, vec2 edge1, vec2 x)
vec3 smoothstep(vec3 edge0, vec3 edge1, vec3 x)
vec4 smoothstep(vec4 edge0, vec4 edge1, vec4 x)
vec2 smoothstep(float edge0, float edge1, vec2 x)
vec3 smoothstep(float edge0, float edge1, vec3 x)
vec4 smoothstep(float edge0, float edge1, vec4 x)
float length(float x)
float length(vec2 x)
float length(vec3 x)
float length(vec4 x)
float distance(float p0, float p1)
float distance(vec2 p0, vec2 p1)
float distance(vec3 p0, vec3 p1)
float distance(vec4 p0, vec4 p1)
float dot(float x, float y)
float dot(vec2 x, vec2 y)
float dot(vec3 x, vec3 y)
float dot(vec4 x, vec4 y)
vec3 cross(vec3 x, vec3 y)
float normalize(float x)
vec2 normalize(vec2 x)
vec3 normalize(vec3 x)
vec4 normalize(vec4 x)
float faceforward(float N, float I, float Nref)
vec2 faceforward(vec2 N, vec2 I, vec2 Nref)
vec3 faceforward(vec3 N, vec3 I, vec3 Nref)
vec4 faceforward(vec4 N, vec4 I, vec4 Nref)
float reflect(float I, float N)
vec2 reflect(vec2 I, vec2 N)
vec3 reflect(vec3 I, vec3 N)
vec4 reflect(vec4 I, vec4 N)
float refract(float I, float N, float eta)
vec2 refract(vec2 I, vec2 N, float eta)
vec3 refract(vec3 I, vec3 N, float eta)
vec4 refract(vec4 I, vec4 N, float eta)
mat2 matrixCompMult(mat2 x, mat2 y)
mat3 matrixCompMult(mat3 x, mat3 y)
mat4 matrixCompMult(mat4 x, mat4 y)
bvec2 lessThan(vec2 x, vec2 y)
bvec3 lessThan(vec3 x, vec3 y)
bvec4 lessThan(vec4 x, vec4 y)
bvec2 lessThan(ivec2 x, ivec2 y)
bvec3 lessThan(ivec3 x, ivec3 y)
bvec4 lessThan(ivec4 x, ivec4 y)
bvec2 lessThanEqual(vec2 x, vec2 y)
bvec3 lessThanEqual(vec3 x, vec3 y)
bvec4 lessThanEqual(vec4 x, vec4 y)
bvec2 lessThanEqual(ivec2 x, ivec2 y)
bvec3 lessThanEqual(ivec3 x, ivec3 y)
bvec4 lessThanEqual(ivec4 x, ivec4 y)
bvec2 greaterThan(vec2 x, vec2 y)
bvec3 greaterThan(vec3 x, vec3 y)
bvec4 greaterThan(vec4 x, vec4 y)
bvec2 greaterThan(ivec2 x, ivec2 y)
bvec3 greaterThan(ivec3 x, ivec3 y)
bvec4 greaterThan(ivec4 x, ivec4 y)
bvec2 greaterThanEqual(vec2 x, vec2 y)
bvec3 greaterThanEqual(vec3 x, vec3 y)
bvec4 greaterThanEqual(vec4 x, vec4 y)
bvec2 greaterThanEqual(ivec2 x, ivec2 y)
bvec3 greaterThanEqual(ivec3 x, ivec3 y)
bvec4 greaterThanEqual(ivec4 x, ivec4 y)
bvec2 equal(vec2 x, vec2 y)
bvec3 equal(vec3 x, vec3 y)
bvec4 equal(vec4 x, vec4 y)
bvec2 equal(ivec2 x, ivec2 y)
bvec3 equal(ivec3 x, ivec3 y)
bvec4 equal(ivec4 x, ivec4 y)
bvec2 notEqual(vec2 x, vec2 y)
bvec3 notEqual(vec3 x, vec3 y)
bvec4 notEqual(vec4 x, vec4 y)
bvec2 notEqual(ivec2 x, ivec2 y)
bvec3 notEqual(ivec3 x, ivec3 y)
bvec4 notEqual(ivec4 x, ivec4 y)
bool any(bvec2 x)
bool any(bvec3 x)
bool any(bvec4 x)
bool all(bvec2 x)
bool all(bvec3 x)
bool all(bvec4 x)
bvec2 not(bvec2 x)
bvec3 not(bvec3 x)
bvec4 not(bvec4 x)`

let reserved_builtins = ['union','sample']
let builtin_pattern   = /([^ ]+) ([^(]+)\(([^)]*)\)/

function redirect_builtins() {
    let lines        = builtins.split(/\r?\n/)
    let names        = []
    let redirections = []
    for (let line of lines) {
        let match       = line.match(builtin_pattern)
        let outType     = match[1]
        let fname       = match[2]
        let argsStr     = match[3]
        let args        = argsStr.split(', ').map(v => v.split(' '))
        let argNames    = args.map(a => a[1])
        let redirection =
            `${outType} overloaded_${fname} (${argsStr}) {return ${fname}(${argNames.join(',')});}`
        names.push(fname)
        redirections.push(redirection)
    }
    let code = redirections.join('\n')
    return {code, names}
}

let redirections = redirect_builtins()
let builtins_map = new Set(redirections.names.concat(reserved_builtins))
let any_var      = /([a-zA-Z_])[a-zA-Z_0-9]* *\(/gm

export function builtin_redirections() {
    return redirections.code
}

export function allow_overloading(src) {
    let out = src.replace(any_var, v => {
        let vv = v.slice(0,-1).trim()
        if (builtins_map.has(vv)) {
            return `overloaded_${v}`
        } else {
            return v
        }
    })
    return out
}