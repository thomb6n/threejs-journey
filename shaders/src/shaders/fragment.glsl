precision mediump float;

varying float vrandom;

void main() {
  gl_FragColor = vec4(0.1, vrandom - 0.1, 0.75, 1.0);
}