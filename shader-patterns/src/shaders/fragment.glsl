precision mediump float;

varying vec2 v_uv;

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
  // float strength = v_uv.x;

  // float strength = 1.0 - v_uv.y;

  // float strength = v_uv.y * 10.0;

  // float strength = round(mod(v_uv.y * 10.0, 1.0));

  // float strength = step(0.8, mod(v_uv.y * 10.0, 1.0));

  // float strength = step(0.8, mod(v_uv.x * 10.0, 1.0));

  // float x_strength = step(0.8, mod(v_uv.x * 10.0, 1.0));
  // float y_strength = step(0.8, mod(v_uv.y * 10.0, 1.0));
  // float strength = x_strength + y_strength;

  // float x_strength = step(0.8, mod(v_uv.x * 10.0, 1.0));
  // float y_strength = step(0.8, mod(v_uv.y * 10.0, 1.0));
  // float strength = x_strength * y_strength;

  // float ax_strength = step(0.4, mod(v_uv.x * 10.0, 1.0));
  // float ay_strength = step(0.8, mod(v_uv.y * 10.0, 1.0));
  // float a_strength = ax_strength * ay_strength;
  // float bx_strength = step(0.8, mod(v_uv.x * 10.0, 1.0));
  // float by_strength = step(0.4, mod(v_uv.y * 10.0, 1.0));
  // float b_strength = bx_strength * by_strength;
  // float strength = a_strength + b_strength;

  // float ax_strength = step(0.4, mod(v_uv.x * 10.0, 1.0));
  // float ay_strength = step(0.8, mod(v_uv.y * 10.0 + 0.2, 1.0));
  // float a_strength = ax_strength * ay_strength;
  // float bx_strength = step(0.8, mod(v_uv.x * 10.0 + 0.2, 1.0));
  // float by_strength = step(0.4, mod(v_uv.y * 10.0, 1.0));
  // float b_strength = bx_strength * by_strength;
  // float strength = a_strength + b_strength;

  // float strength = abs(v_uv.x - 0.5);

  // float strength = min(abs(v_uv.x - 0.5), abs(v_uv.y - 0.5));
  
  // float strength = max(abs(v_uv.x - 0.5), abs(v_uv.y - 0.5));

  // float strength = step(0.4, max(abs(v_uv.x - 0.5), abs(v_uv.y - 0.5)));

  // float strength = (floor(v_uv.x * 9.0) / 9.0) * (floor(v_uv.y * 9.0) / 9.0);

  float strength = random(v_uv / 10000.0);

  gl_FragColor = vec4(vec3(strength), 1.0);
}