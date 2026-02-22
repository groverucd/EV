"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import * as THREE from "three";

/* ───── Camera Controller ───── */
function CameraRig({ progress }: { progress: number }) {
  const { camera } = useThree();
  const pathRef = useRef<THREE.CatmullRomCurve3 | null>(null);
  const lookPathRef = useRef<THREE.CatmullRomCurve3 | null>(null);

  useMemo(() => {
    // Camera path: start wide, fly along the bridge, travel northeast toward "Davis"
    pathRef.current = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 30, 120),     // Wide shot
      new THREE.Vector3(0, 25, 80),      // Approaching bridge
      new THREE.Vector3(0, 18, 40),      // On bridge
      new THREE.Vector3(5, 14, 0),       // Mid bridge
      new THREE.Vector3(15, 12, -40),    // Past bridge
      new THREE.Vector3(40, 10, -80),    // Highway northeast
      new THREE.Vector3(80, 8, -120),    // Arriving Davis
      new THREE.Vector3(100, 6, -150),   // Final pullback
    ]);
    lookPathRef.current = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 10, 0),
      new THREE.Vector3(0, 8, 0),
      new THREE.Vector3(0, 6, -20),
      new THREE.Vector3(10, 5, -40),
      new THREE.Vector3(20, 5, -60),
      new THREE.Vector3(50, 4, -100),
      new THREE.Vector3(90, 3, -140),
      new THREE.Vector3(100, 3, -160),
    ]);
  }, []);

  useFrame(() => {
    if (!pathRef.current || !lookPathRef.current) return;
    const t = Math.max(0, Math.min(progress, 0.999));
    const pos = pathRef.current.getPointAt(t);
    const look = lookPathRef.current.getPointAt(t);
    // Subtle camera drift
    const drift = Math.sin(Date.now() * 0.0003) * 0.15;
    camera.position.lerp(
      new THREE.Vector3(pos.x + drift, pos.y + drift * 0.5, pos.z),
      0.08
    );
    const target = new THREE.Vector3(look.x, look.y, look.z);
    camera.lookAt(target);
  });

  return null;
}

/* ───── Golden Gate Bridge (procedural) ───── */
function GoldenGateBridge() {
  const bridgeColor = "#c5401a";
  const towerHeight = 35;
  const span = 120;

  return (
    <group position={[0, 0, 0]}>
      {/* Deck */}
      <mesh position={[0, 4, 0]} castShadow>
        <boxGeometry args={[8, 0.6, span]} />
        <meshStandardMaterial color={bridgeColor} roughness={0.5} metalness={0.6} />
      </mesh>

      {/* Guard rails */}
      {[-3.5, 3.5].map((x, i) => (
        <mesh key={`rail-${i}`} position={[x, 5.2, 0]}>
          <boxGeometry args={[0.15, 1.8, span]} />
          <meshStandardMaterial color={bridgeColor} roughness={0.5} metalness={0.6} />
        </mesh>
      ))}

      {/* Towers */}
      {[-30, 30].map((z, i) => (
        <group key={`tower-${i}`} position={[0, 0, z]}>
          {[-3.2, 3.2].map((x, j) => (
            <group key={`leg-${j}`}>
              <mesh position={[x, towerHeight / 2 + 4, 0]} castShadow>
                <boxGeometry args={[1.6, towerHeight, 1.6]} />
                <meshStandardMaterial color={bridgeColor} roughness={0.4} metalness={0.7} />
              </mesh>
            </group>
          ))}
          {/* Cross beams */}
          {[12, 22, 32].map((y, k) => (
            <mesh key={`beam-${k}`} position={[0, y, 0]} castShadow>
              <boxGeometry args={[8, 0.8, 1.2]} />
              <meshStandardMaterial color={bridgeColor} roughness={0.4} metalness={0.7} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Main cables (catenary approximation) */}
      {[-3.2, 3.2].map((x, i) => (
        <CableGeometry key={`cable-${i}`} x={x} span={span} towerHeight={towerHeight} />
      ))}

      {/* Vertical suspender cables */}
      {[-3.2, 3.2].map((x, ci) =>
        Array.from({ length: 30 }, (_, i) => {
          const z = -span / 2 + 4 + i * (span / 30);
          const t = (z + span / 2) / span;
          const sag = 18 * (4 * t * (1 - t));
          const cableY = towerHeight + 4 - sag;
          const deckY = 5.5;
          const midY = (cableY + deckY) / 2;
          const h = cableY - deckY;
          if (h < 1) return null;
          return (
            <mesh key={`susp-${ci}-${i}`} position={[x, midY, z]}>
              <cylinderGeometry args={[0.04, 0.04, h, 4]} />
              <meshStandardMaterial color={bridgeColor} roughness={0.5} metalness={0.6} />
            </mesh>
          );
        })
      )}
    </group>
  );
}

function CableGeometry({
  x,
  span,
  towerHeight,
}: {
  x: number;
  span: number;
  towerHeight: number;
}) {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const segments = 80;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const z = -span / 2 + t * span;
      const sag = 18 * (4 * t * (1 - t));
      const y = towerHeight + 4 - sag;
      pts.push(new THREE.Vector3(x, y, z));
    }
    return pts;
  }, [x, span, towerHeight]);

  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points]);

  return (
    <mesh>
      <tubeGeometry args={[curve, 80, 0.12, 6, false]} />
      <meshStandardMaterial color="#c5401a" roughness={0.4} metalness={0.7} />
    </mesh>
  );
}

/* ───── Ocean Waves (vertex animation) ───── */
function AnimatedOcean() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const geo = meshRef.current.geometry as THREE.PlaneGeometry;
    const pos = geo.attributes.position;
    const t = clock.elapsedTime;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const wave =
        Math.sin(x * 0.03 + t * 0.5) * 0.8 +
        Math.sin(y * 0.04 + t * 0.3) * 0.5 +
        Math.sin((x + y) * 0.02 + t * 0.7) * 0.3;
      pos.setZ(i, wave);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
  });

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -1, 0]}
      receiveShadow
    >
      <planeGeometry args={[600, 600, 100, 100]} />
      <meshStandardMaterial
        color="#0b2a4a"
        roughness={0.25}
        metalness={0.15}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

/* ───── Road Path (from bridge to Davis) ───── */
function RoadPath() {
  const roadPoints = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 3.8, -60),
      new THREE.Vector3(15, 3.8, -80),
      new THREE.Vector3(40, 3.8, -100),
      new THREE.Vector3(80, 3.8, -130),
      new THREE.Vector3(100, 3.8, -155),
    ]);
  }, []);

  return (
    <mesh>
      <tubeGeometry args={[roadPoints, 60, 3, 8, false]} />
      <meshStandardMaterial color="#1a1a2e" roughness={0.9} metalness={0.05} />
    </mesh>
  );
}

/* ───── Data Particles flowing along the road ───── */
function DataParticles({ progress }: { progress: number }) {
  const count = 80;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const offsets = useMemo(
    () => Array.from({ length: count }, () => Math.random()),
    [count]
  );

  const roadPath = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 5, -60),
        new THREE.Vector3(15, 5, -80),
        new THREE.Vector3(40, 5, -100),
        new THREE.Vector3(80, 5, -130),
        new THREE.Vector3(100, 5, -155),
      ]),
    []
  );

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    for (let i = 0; i < count; i++) {
      const t =
        ((offsets[i] + clock.elapsedTime * 0.05 + progress * 0.3) % 1);
      const pos = roadPath.getPointAt(t);
      dummy.position.set(
        pos.x + (Math.random() - 0.5) * 2,
        pos.y + Math.sin(clock.elapsedTime + i) * 0.3,
        pos.z + (Math.random() - 0.5) * 2
      );
      dummy.scale.setScalar(0.08 + Math.sin(clock.elapsedTime * 2 + i) * 0.03);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#60a5fa" transparent opacity={0.7} />
    </instancedMesh>
  );
}

/* ───── Fog Clouds (lightweight mesh-based) ───── */
function FogClouds() {
  return (
    <group>
      {Array.from({ length: 12 }, (_, i) => (
        <Float
          key={i}
          speed={0.2 + i * 0.03}
          floatIntensity={0.4}
          rotationIntensity={0.05}
        >
          <mesh
            position={[
              (i - 6) * 25 + Math.sin(i * 1.7) * 15,
              6 + (i % 4) * 3,
              -10 + i * -12,
            ]}
            scale={[12 + i * 2, 2 + (i % 3), 8 + i]}
          >
            <sphereGeometry args={[1, 8, 6]} />
            <meshStandardMaterial
              color="#8cacc4"
              transparent
              opacity={0.06}
              depthWrite={false}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

/* ───── Ground plane for land areas ───── */
function Terrain() {
  return (
    <group>
      {/* Land on both sides of the bridge approach */}
      <mesh position={[0, -0.5, -90]} receiveShadow>
        <boxGeometry args={[300, 1, 200]} />
        <meshStandardMaterial color="#1a2a1a" roughness={0.95} />
      </mesh>
    </group>
  );
}

/* ───── Lights ───── */
function Lighting() {
  return (
    <>
      <ambientLight intensity={0.25} color="#8cb4d4" />
      <directionalLight
        position={[80, 60, 30]}
        intensity={1.5}
        color="#ffeedd"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[0, 30, 0]} intensity={0.4} color="#ffd4a0" />
      {/* Sun bloom effect */}
      <pointLight position={[200, 80, 100]} intensity={2} color="#ff9944" distance={400} />
    </>
  );
}

/* ───── Main Scene ───── */
function Scene({ progress }: { progress: number }) {
  return (
    <>
      <CameraRig progress={progress} />
      <Lighting />
      <fog attach="fog" args={["#0d1520", 20, 300]} />
      <Environment preset="sunset" />
      <GoldenGateBridge />
      <AnimatedOcean />
      <RoadPath />
      <DataParticles progress={progress} />
      <FogClouds />
      <Terrain />
    </>
  );
}

/* ───── Exported Canvas Wrapper ───── */
export function ExperienceScene({ progress }: { progress: number }) {
  return (
    <div className="fixed inset-0" style={{ zIndex: 1 }}>
      <Canvas
        camera={{ fov: 55, near: 0.1, far: 500, position: [0, 30, 120] }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
        shadows
      >
        <Scene progress={progress} />
      </Canvas>
    </div>
  );
}
