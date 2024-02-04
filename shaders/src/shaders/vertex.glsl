// The same for all vertices
uniform mat4 modelMatrix; // applies transformations relative to the mesh
uniform mat4 viewMatrix; // applies transformations relative to the camera
uniform mat4 projectionMatrix; // transforms coordinates into the clip space

// Sent by us in the ShaderMaterial
uniform vec2 frequency;
uniform float time;

// Different for each vertex
attribute vec3 position;
attribute float random;

// You have to pass attributes if you want to use them in the fragment shader
varying float vrandom;

void main() {
  vrandom = random;

  // The fourth value is used for perspective in the clip space
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // Make it wavy
  modelPosition.z += sin(modelPosition.x * frequency.x - time) * 0.1;
  modelPosition.z += sin(modelPosition.y * frequency.y - time) * 0.1;

  // Make it spiky
  modelPosition.z += random * 0.04;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  // Each matrix transforms the position until we get the final clip space coordinates
  // gl_Position contains the position for the vertex and is a vec4
  gl_Position = projectedPosition;
}