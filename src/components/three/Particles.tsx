import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ParticleFieldProps {
  count?: number;
  radius?: number;
  color?: string;
  size?: number;
}

export function ParticleField({
  count = 2500,
  radius = 25,
  color = "#a855f7",
  size = 0.025,
}: ParticleFieldProps) {
  const ref = useRef<THREE.Points>(null);

  const [positions, scales] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sca = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Distribute in spherical shell with bias to volume
      const r = radius * Math.cbrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      sca[i] = Math.random();
    }
    return [pos, sca];
  }, [count, radius]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
      ref.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  const vert = /* glsl */ `
    attribute float aScale;
    uniform float uTime;
    uniform float uSize;
    varying float vAlpha;
    void main() {
      vec3 p = position;
      p.y += sin(uTime * 0.5 + position.x * 0.3) * 0.3;
      vec4 mv = modelViewMatrix * vec4(p, 1.0);
      gl_Position = projectionMatrix * mv;
      gl_PointSize = uSize * aScale * (300.0 / -mv.z);
      vAlpha = aScale;
    }
  `;
  const frag = /* glsl */ `
    uniform vec3 uColor;
    varying float vAlpha;
    void main() {
      vec2 c = gl_PointCoord - 0.5;
      float d = length(c);
      if (d > 0.5) discard;
      float alpha = smoothstep(0.5, 0.0, d) * vAlpha;
      gl_FragColor = vec4(uColor, alpha);
    }
  `;

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uSize: { value: size * 100 },
    }),
    [color, size]
  );

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
        />
        <bufferAttribute
          attach="attributes-aScale"
          args={[scales, 1]}
          count={scales.length}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
