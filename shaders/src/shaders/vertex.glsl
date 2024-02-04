// The same for all vertices
uniform mat4 modelMatrix; // applies transformations relative to the mesh
uniform mat4 viewMatrix; // applies transformations relative to the camera
uniform mat4 projectionMatrix; // transforms coordinates into the clip space

// Different for each vertex
attribute vec3 position;

void main() {
  // The fourth value is used for perspective in the clip space
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  modelPosition.z += sin(modelPosition.x * 10.0) * 0.1;
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  // Each matrix transforms the position until we get the final clip space coordinates
  // gl_Position contains the position for the vertex and is a vec4
  gl_Position = projectedPosition;
}