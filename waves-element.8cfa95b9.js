// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/@haribala/waves-element.js/src/shaders/vertex-shader.vert":[function(require,module,exports) {
module.exports="#version 300 es\n#define GLSLIFY 1\n\nin vec4 a_position;\n\nvoid main()\n{\n  gl_Position = a_position;\n}\n";
},{}],"node_modules/@haribala/waves-element.js/src/shaders/fragment-shader.frag":[function(require,module,exports) {
module.exports="#version 300 es\n\nprecision mediump float;\n#define GLSLIFY 1\n\nuniform sampler2D u_image;\n\nout vec4 fragColor;\n\nfloat sigmoid(float x)\n{\n    return 1. / (1. + exp(-x));\n}\n\nvec3 floatToRgb(float v, float scale) {\n    float r = v;\n    float g = mod(v*scale,1.0);\n    r-= g/scale;\n    float b = mod(v*scale*scale,1.0);\n    g-=b/scale;\n    return vec3(r,g,b);\n}\n\nvoid main()\n{\n    vec2 fragCoord = gl_FragCoord.xy;\n    vec2 iResolution = vec2(256., 256.);\n\n    // get current x and y.\n    fragCoord -= 0.5; // pixel coordinates are given as mid intergers, subtract 0.5 to make it interger.\n    ivec2 center = ivec2(fragCoord);\n    ivec2 res    = ivec2(iResolution) - 1;\n\n    float pos = texelFetch(u_image, center, 0).y;\n\n    // vec3 col = floatToRgb(pos, 256.);\n    vec3 col = vec3(sigmoid(pos), sin(pos), cos(pos));\n    // vec3 col = vec3(sigmoid(pos));\n\n    fragColor = vec4(col, 1.0);\n}\n";
},{}],"node_modules/@haribala/waves-element.js/src/shaders/update-shader.frag":[function(require,module,exports) {
module.exports="#version 300 es\n\nprecision mediump float;\n#define GLSLIFY 1\n\nuniform sampler2D i_image;\nuniform bool is_velocity_update;\nuniform float iTimeDelta;\nuniform ivec3 iMouse;\n\nout vec4 fragColor;\n\n#define SPRING_CONSTANT .04\n#define PROP_SPEED 1.\n#define MASS 10.\n#define FRICTION_COEFF 0.005\n#define PEAK_SIZE .2\n#define MAX_VELOCITY_MAGNITUDE 10.\n#define MAX_DISPLACEMENT 64.\n\nfloat sigmoid(float x)\n{\n    return 1. / (1. + exp(-x));\n}\n\nfloat peak(ivec2 center, ivec2 pos, float size)\n{\n    float d = length(vec2(center) - vec2(pos));\n    float e = exp(-size * d);\n    return e;\n}\n\nvoid main()\n{\n    vec2 fragCoord = gl_FragCoord.xy;\n    vec2 iResolution = vec2(256., 256.);\n\n    // get current x and y.\n    fragCoord -= 0.5; // pixel coordinates are given as mid intergers, subtract 0.5 to make it interger.\n    ivec2 center = ivec2(fragCoord);\n    ivec2 res    = ivec2(iResolution) - 1;\n\n    // if it is a boundary cell velocity is 0.\n    if(center.x == 0 || center.y == 0 || center.x == res.x || center.y == res.y)\n    {\n        fragColor = vec4(vec3(0.), 1.0);\n        return;\n    }\n\n    ivec2 left   = center + ivec2(-1,  0);\n    ivec2 top    = center + ivec2( 0,  1);\n    ivec2 right  = center + ivec2( 1,  0);\n    ivec2 bottom = center + ivec2( 0, -1);\n\n    // get previous z coordinate of current cell and neighbour cells.\n\tfloat pos_c = texelFetch(i_image, center, 0).y;\n\n\tfloat pos_l = texelFetch(i_image, left  , 0).y;\n\tfloat pos_t = texelFetch(i_image, top   , 0).y;\n\tfloat pos_r = texelFetch(i_image, right , 0).y;\n\tfloat pos_b = texelFetch(i_image, bottom, 0).y;\n\n    // get previous velocity of current cell.\n\tfloat vel   = texelFetch(i_image, center, 0).x;\n\n    // get 3d positions.\n    vec3 pos_cv = vec3(vec2(center), pos_c);\n\n    if(is_velocity_update)\n    {\n        // UPDATE VELOCITIES\n        // Channel 0 is previous velocities (x coordinate) and previous positions (y coordinate).\n\n        vec3 pos_lv = vec3(vec2(left  ), pos_l);\n        vec3 pos_tv = vec3(vec2(top   ), pos_t);\n        vec3 pos_rv = vec3(vec2(right ), pos_r);\n        vec3 pos_bv = vec3(vec2(bottom), pos_b);\n\n        // calculate total force using Hooke's law.\n        vec3 force_l = (pos_lv - pos_cv);\n        vec3 force_t = (pos_tv - pos_cv);\n        vec3 force_r = (pos_rv - pos_cv);\n        vec3 force_b = (pos_bv - pos_cv);\n\n        force_l = normalize(force_l) * (length(force_l) - 1.) * SPRING_CONSTANT;\n        force_t = normalize(force_t) * (length(force_t) - 1.) * SPRING_CONSTANT;\n        force_r = normalize(force_r) * (length(force_r) - 1.) * SPRING_CONSTANT;\n        force_b = normalize(force_b) * (length(force_b) - 1.) * SPRING_CONSTANT;\n\n        // gravity\n        vec3 force_g = vec3(0.); // ZERO GRAVITY\n        // vec3 force_g = vec3(0., 0., -0.001 * MASS); // VERY LOW GRAVITY\n        // vec3 force_g = vec3(0., 0., -1.62 * MASS); // MOON\n        // vec3 force_g = vec3(0., 0., -9.807 * MASS); // EARTH\n\n        vec3 total_force = force_l + force_t + force_r + force_b + force_g;\n\n        // calculate acceleration and velocity.\n        float acc = total_force.z / MASS;\n        vel = (1. - FRICTION_COEFF) * vel + acc * iTimeDelta * PROP_SPEED;\n        //vel = (1. - FRICTION_COEFF * screen_center_dist(center)) * vel + acc * iTimeDelta * PROP_SPEED;\n\n        // clamp velocity.\n        vel = clamp(vel, -MAX_VELOCITY_MAGNITUDE, MAX_VELOCITY_MAGNITUDE);\n\n        // output current velocity and previous position.\n        fragColor = vec4(vel, pos_c, 0., 1.0);\n    }\n    else\n    {\n        // UPDATE POSITIONS\n        // Channel 0 is previous velocities (x coordinate) and previous positions (y coordinate).\n\n        // calculate new position.\n        pos_c = pos_c + vel * iTimeDelta * PROP_SPEED;\n\n        // if LMB is down insert a peak at the click position.\n        ivec2 click = iMouse.xy;\n        if(iMouse.z == 1)pos_c += 10. * peak(center, click, PEAK_SIZE);\n        // pos_c = 0.;\n\n        // clamp the position.\n        pos_c = clamp(pos_c, -MAX_DISPLACEMENT, MAX_DISPLACEMENT);\n\n        // output current velocity and current position.\n        fragColor = vec4(vel, pos_c, 0., 1.0);\n    }\n}\n\n/*\n\n\nfloat screen_center_dist(ivec2 pos)\n{\n    ivec2 screen_center = ivec2(iResolution) / 2;\n    float d = length(vec2(pos) - vec2(screen_center));\n    return sigmoid(d);\n}\n\nvoid mainImage(out vec4 fragColor, in vec2 fragCoord)\n{\n\n}\n*/\n\n/*\n\n\nvoid mainImage(out vec4 fragColor, in vec2 fragCoord)\n{\n\n}\n*//*\n\n\nvoid mainImage(out vec4 fragColor, in vec2 fragCoord)\n{\n\n}\n*//*\n\n\nvoid mainImage(out vec4 fragColor, in vec2 fragCoord)\n{\n\n}\n*//*\n\n\nvoid mainImage(out vec4 fragColor, in vec2 fragCoord)\n{\n\n}\n*/";
},{}],"node_modules/@haribala/waves-element.js/src/waves-element.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WavesElement = void 0;

var _litElement = require("lit-element");

var _vertexShader = _interopRequireDefault(require("./shaders/vertex-shader.vert"));

var _fragmentShader = _interopRequireDefault(require("./shaders/fragment-shader.frag"));

var _updateShader = _interopRequireDefault(require("./shaders/update-shader.frag"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const cout = console.log.bind(console);

function peak(uv, pos, size) {
  const dx = uv.x - pos.x,
        dy = uv.y - pos.y;
  const d = Math.sqrt(dx * dx + dy * dy);
  return Math.exp(-size * d);
}

function calculate_initial_condition(R, C) {
  // The initial condition is a peak at the center of the screen.
  const arr = new Float32Array(R * C * 2);
  const peak_pos = {
    x: 0.5,
    y: 0.5
  };
  const peak_size = 10;

  for (let r = 1; r < R - 1; r++) {
    for (let c = 1; c < C - 1; c++) {
      const i = 2 * (r * C + c);
      const uv = {
        x: c / R,
        y: r / R
      };
      arr[i + 1] = peak(uv, peak_pos, peak_size); // position
    }
  }

  return arr;
}

function init(canvas) {
  const initial_condition = calculate_initial_condition(256, 256);
  const gl = canvas.getContext('webgl2');

  if (!gl) {
    alert('No webgl2 support on your device!!');
    return;
  }

  const ext = gl.getExtension('EXT_color_buffer_float');

  if (!ext) {
    alert('No support for rendering to floating point textures on your device!!');
    return;
  } // Compile all the shaders.


  const vertexShader = createShader(gl, gl.VERTEX_SHADER, _vertexShader.default);
  const updateShader = createShader(gl, gl.FRAGMENT_SHADER, _updateShader.default);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, _fragmentShader.default); // Create and link all shader programs.

  const updateProgram = createProgram(gl, vertexShader, updateShader);
  const program = createProgram(gl, vertexShader, fragmentShader); // Get locations of shader inputs.

  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
  const isVelocityUpdateLocation = gl.getUniformLocation(updateProgram, 'is_velocity_update');
  const updateImageLocation = gl.getUniformLocation(updateProgram, 'i_image');
  const iTimeDeltaLocation = gl.getUniformLocation(updateProgram, 'iTimeDelta');
  const iMouseLocation = gl.getUniformLocation(updateProgram, 'iMouse');
  const imageLocation = gl.getUniformLocation(program, 'u_image'); // Configure texture 1.

  const texture1 = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture1);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  const mipLevel = 0,
        internalFormat = gl.RG32F,
        texWidth = 256,
        texHeight = 256,
        texBorder = 0,
        srcFormat = gl.RG,
        srcType = gl.FLOAT;
  gl.texImage2D(gl.TEXTURE_2D, mipLevel, internalFormat, texWidth, texHeight, texBorder, srcFormat, srcType, initial_condition); // Configure texture 2.

  const texture2 = gl.createTexture();
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, texture2);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texImage2D(gl.TEXTURE_2D, mipLevel, internalFormat, texWidth, texHeight, texBorder, srcFormat, srcType, new Float32Array(256 * 256 * 2)); // Create a framebuffer for rendering to texture.

  const attachmentPoint = gl.COLOR_ATTACHMENT0;
  const frameBuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, texture2, 0); // Check framebuffer status and report errors.

  const frameBufferStatus = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  const statuses = {
    [gl.FRAMEBUFFER_COMPLETE]: 'complete',
    [gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT]: 'incomplete attachment',
    [gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT]: 'missing attachment',
    [gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS]: 'height and width of attachment are not the same',
    [gl.FRAMEBUFFER_UNSUPPORTED]: 'format of the attachedment is not supported or some other conditions',
    [gl.FRAMEBUFFER_INCOMPLETE_MULTISAMPLE]: 'the values of gl.RENDERBUFFER_SAMPLES are different among different attached renderbuffers or are non zero if attached images are a mix of render buffers and textures'
  }; // cout('framebuffer status:', frameBufferStatus, statuses[frameBufferStatus]);

  if (frameBufferStatus != gl.FRAMEBUFFER_COMPLETE) {
    alert('Failed to create a framebuffer!!');
    return;
  } // Upload rectangle coordinates.


  const positions = [-1, -1, -1, 1, 1, 1, 1, 1, 1, -1, -1, -1];
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW); // Create a VAO to read the position data.

  const size = 2,
        type = gl.FLOAT,
        normalize = false,
        stride = 0,
        offset = 0;
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset); // Data to handle mouse events.

  const mouseData = {
    mouse_x: 0,
    mouse_y: 0,
    mouse_updated: false,
    is_dragging: false
  };
  canvas.addEventListener('mousedown', e => {
    mouseData.is_dragging = true;
    const rect = e.target.getBoundingClientRect();
    mouseData.mouse_x = Math.floor(e.clientX - rect.left); //x position within the element.

    mouseData.mouse_y = Math.floor(rect.bottom - e.clientY); //y position within the element.

    mouseData.mouse_updated = true; // cout(mouseData.mouse_x, mouseData.mouse_y, mouseData.mouse_updated);    
  });
  canvas.addEventListener('mousemove', e => {
    if (mouseData.is_dragging) {
      const rect = e.target.getBoundingClientRect();
      mouseData.mouse_x = Math.floor(e.clientX - rect.left); //x position within the element.

      mouseData.mouse_y = Math.floor(rect.bottom - e.clientY); //y position within the element.

      mouseData.mouse_updated = true; // cout(mouseData.mouse_x, mouseData.mouse_y, mouseData.mouse_updated);    
    }
  });
  canvas.addEventListener('mouseup', () => {
    mouseData.is_dragging = false;
  });
  canvas.addEventListener('mouseleave', () => {
    mouseData.is_dragging = false;
  }); // Arguments passed to update step.

  const args = {
    gl,
    program,
    attachmentPoint,
    updateProgram,
    vao,
    iMouseLocation,
    iTimeDeltaLocation,
    isVelocityUpdateLocation,
    imageLocation,
    updateImageLocation,
    frameBuffer,
    texture1,
    texture2,
    prev: 0,
    mouseData
  };
  window.requestAnimationFrame(step.bind(null, args));
}

function step(args, timestamp) {
  // Update velocities and positions and render a single frame.
  const {
    gl,
    program,
    attachmentPoint,
    updateProgram,
    vao,
    iMouseLocation,
    iTimeDeltaLocation,
    isVelocityUpdateLocation,
    imageLocation,
    updateImageLocation,
    frameBuffer,
    texture1,
    texture2,
    prev,
    mouseData
  } = args;
  const deltaTime = timestamp - prev; // Run the update program for veloctiy update.

  gl.useProgram(updateProgram);
  gl.uniform1i(isVelocityUpdateLocation, 1);
  gl.uniform1f(iTimeDeltaLocation, deltaTime);
  gl.uniform3i(iMouseLocation, mouseData.mouse_x, mouseData.mouse_y, mouseData.mouse_updated ? 1 : 0);
  render(gl, updateProgram, vao, updateImageLocation, 0, frameBuffer); // Swap textures.

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture2);
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, texture1);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, texture1, 0); // Run the update program for position update.

  gl.useProgram(updateProgram);
  gl.uniform1i(isVelocityUpdateLocation, 0);
  render(gl, updateProgram, vao, updateImageLocation, 0, frameBuffer); // Swap textures again.

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture1);
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, texture2);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, texture2, 0); // Run the render program.

  render(gl, program, vao, imageLocation, 0, null);
  mouseData.mouse_updated = false;
  window.requestAnimationFrame(step.bind(null, { ...args,
    prev: timestamp
  }));
}

function render(gl, program, vao, imageLocation, texture, frameBuffer) {
  gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer); // clear viewport

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // render

  gl.useProgram(program);
  gl.bindVertexArray(vao);
  gl.uniform1i(imageLocation, texture);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) return shader;
  cout('Failed to compile the shader:', type);
  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) return program;
  cout('Failed to compile the shader program.');
  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

class WavesElement extends _litElement.LitElement {
  static get styles() {
    return _litElement.css`
            /* Selects the host element */
            :host { display: inline-block;}
            /* Selects the host element if it is hidden */
            :host([hidden]) { display: none; }
        `;
  }

  constructor() {
    super();
    this.setupCanvas();
  }

  async setupCanvas() {
    await this.updateComplete;
    const canvas = this.shadowRoot.getElementById('webgl-canvas');
    init(canvas);
  }

  render() {
    return _litElement.html`
            <canvas id="webgl-canvas" width="256" height="256"></canvas>
        `;
  }

}

exports.WavesElement = WavesElement;
customElements.define('waves-element', WavesElement);
},{"lit-element":"node_modules/lit-element/lit-element.js","./shaders/vertex-shader.vert":"node_modules/@haribala/waves-element.js/src/shaders/vertex-shader.vert","./shaders/fragment-shader.frag":"node_modules/@haribala/waves-element.js/src/shaders/fragment-shader.frag","./shaders/update-shader.frag":"node_modules/@haribala/waves-element.js/src/shaders/update-shader.frag"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "62083" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}],"node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"node_modules/parcel-bundler/src/builtins/bundle-loader.js":[function(require,module,exports) {
var getBundleURL = require('./bundle-url').getBundleURL;

function loadBundlesLazy(bundles) {
  if (!Array.isArray(bundles)) {
    bundles = [bundles];
  }

  var id = bundles[bundles.length - 1];

  try {
    return Promise.resolve(require(id));
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      return new LazyPromise(function (resolve, reject) {
        loadBundles(bundles.slice(0, -1)).then(function () {
          return require(id);
        }).then(resolve, reject);
      });
    }

    throw err;
  }
}

function loadBundles(bundles) {
  return Promise.all(bundles.map(loadBundle));
}

var bundleLoaders = {};

function registerBundleLoader(type, loader) {
  bundleLoaders[type] = loader;
}

module.exports = exports = loadBundlesLazy;
exports.load = loadBundles;
exports.register = registerBundleLoader;
var bundles = {};

function loadBundle(bundle) {
  var id;

  if (Array.isArray(bundle)) {
    id = bundle[1];
    bundle = bundle[0];
  }

  if (bundles[bundle]) {
    return bundles[bundle];
  }

  var type = (bundle.substring(bundle.lastIndexOf('.') + 1, bundle.length) || bundle).toLowerCase();
  var bundleLoader = bundleLoaders[type];

  if (bundleLoader) {
    return bundles[bundle] = bundleLoader(getBundleURL() + bundle).then(function (resolved) {
      if (resolved) {
        module.bundle.register(id, resolved);
      }

      return resolved;
    }).catch(function (e) {
      delete bundles[bundle];
      throw e;
    });
  }
}

function LazyPromise(executor) {
  this.executor = executor;
  this.promise = null;
}

LazyPromise.prototype.then = function (onSuccess, onError) {
  if (this.promise === null) this.promise = new Promise(this.executor);
  return this.promise.then(onSuccess, onError);
};

LazyPromise.prototype.catch = function (onError) {
  if (this.promise === null) this.promise = new Promise(this.executor);
  return this.promise.catch(onError);
};
},{"./bundle-url":"node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"node_modules/parcel-bundler/src/builtins/loaders/browser/js-loader.js":[function(require,module,exports) {
module.exports = function loadJSBundle(bundle) {
  return new Promise(function (resolve, reject) {
    var script = document.createElement('script');
    script.async = true;
    script.type = 'text/javascript';
    script.charset = 'utf-8';
    script.src = bundle;

    script.onerror = function (e) {
      script.onerror = script.onload = null;
      reject(e);
    };

    script.onload = function () {
      script.onerror = script.onload = null;
      resolve();
    };

    document.getElementsByTagName('head')[0].appendChild(script);
  });
};
},{}],0:[function(require,module,exports) {
var b=require("node_modules/parcel-bundler/src/builtins/bundle-loader.js");b.register("js",require("node_modules/parcel-bundler/src/builtins/loaders/browser/js-loader.js"));b.load([]).then(function(){require("node_modules/@haribala/waves-element.js/src/waves-element.js");});
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js",0], null)
//# sourceMappingURL=/waves-element.8cfa95b9.js.map