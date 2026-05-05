import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const portalVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const portalFrag = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;

  // Hash-based noise
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    float a = hash(i); float b = hash(i+vec2(1,0));
    float c = hash(i+vec2(0,1)); float d = hash(i+vec2(1,1));
    vec2 u = f*f*(3.0-2.0*f);
    return mix(a,b,u.x)+(c-a)*u.y*(1.0-u.x)+(d-b)*u.x*u.y;
  }
  float fbm(vec2 p) {
    float v = 0.0; float a = 0.5;
    for(int i=0;i<5;i++){ v += a*noise(p); p*=2.0; a*=0.5; }
    return v;
  }

  void main() {
    vec2 uv = vUv - 0.5;
    float dist = length(uv);
    float angle = atan(uv.y, uv.x);

    // Swirling
    vec2 swirl = vec2(cos(angle + uTime*0.5 + dist*5.0), sin(angle + uTime*0.5 + dist*5.0)) * dist;
    float n = fbm(swirl * 4.0 + uTime * 0.3);

    // Clean ring-only portal: bright rim, transparent center
    float outer = 1.0 - smoothstep(0.43, 0.5, dist);
    float inner = smoothstep(0.31, 0.39, dist);
    float rim = outer * inner;
    float wisps = smoothstep(0.1, 0.45, dist) * (1.0 - smoothstep(0.45, 0.5, dist)) * n;

    vec3 colA = vec3(0.55, 0.2, 1.0);
    vec3 colB = vec3(0.12, 0.65, 1.0);
    vec3 col = mix(colA, colB, n);

    float alpha = rim * 0.55 + wisps * 0.14;
    gl_FragColor = vec4(col * (0.75 + n * 0.35), alpha);
  }
`;

export function Portal({ position = [0, 0, 0] as [number, number, number] }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group position={position} scale={0.82}>
      <mesh position={[0, 0, -0.35]}>
        <circleGeometry args={[3, 96]} />
        <shaderMaterial
          ref={matRef}
          vertexShader={portalVert}
          fragmentShader={portalFrag}
          uniforms={uniforms}
          transparent
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh ref={ringRef} position={[0, 0, -0.34]}>
        <torusGeometry args={[2.45, 0.025, 16, 120]} />
        <meshBasicMaterial color="#c084fc" transparent opacity={0.45} />
      </mesh>
      <pointLight color="#a855f7" intensity={1.4} distance={8} position={[0, 0, 1]} />
    </group>
  );
}
