"use client"

import { useRef, useMemo, useCallback } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Sky, Float, Text } from "@react-three/drei"
import * as THREE from "three"

/* ═══════════════════════════════════════════
   Camera Controller – driven by scroll progress
   ═══════════════════════════════════════════ */

interface CameraControllerProps {
  progress: number
  curve: THREE.CatmullRomCurve3
}

function CameraController({ progress, curve }: CameraControllerProps) {
  const { camera } = useThree()
  const smoothProgress = useRef(0)

  useFrame((_state, delta) => {
    smoothProgress.current = THREE.MathUtils.lerp(
      smoothProgress.current,
      progress,
      delta * 2
    )
    const t = Math.min(Math.max(smoothProgress.current, 0), 0.999)
    const point = curve.getPointAt(t)
    const lookT = Math.min(t + 0.02, 0.999)
    const lookAt = curve.getPointAt(lookT)

    camera.position.lerp(point, delta * 4)
    const target = new THREE.Vector3()
    target.lerp(lookAt, delta * 4)
    camera.lookAt(lookAt.x, lookAt.y + 0.5, lookAt.z)

    // Subtle drift
    const drift = Math.sin(Date.now() * 0.0005) * 0.02
    camera.position.x += drift
    camera.position.y += Math.sin(Date.now() * 0.0007) * 0.01
  })

  return null
}

/* ═══════════════════════════════════════════
   Golden Gate Bridge (procedural)
   ═══════════════════════════════════════════ */

function GoldenGateBridge() {
  const bridgeGroup = useRef<THREE.Group>(null)

  // International Orange
  const bridgeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#c0362c"),
        metalness: 0.6,
        roughness: 0.3,
      }),
    []
  )

  const darkMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#1a1a2e"),
        metalness: 0.4,
        roughness: 0.6,
      }),
    []
  )

  // Bridge deck spans from z = -60 to z = 60
  const deckLength = 120
  const deckY = 8
  const towerHeight = 22
  const towerBase = deckY - 2
  const cableSegments = 40

  const cables = useMemo(() => {
    const points: THREE.Vector3[][] = [[], []]
    for (let side = 0; side < 2; side++) {
      const x = side === 0 ? -3.5 : 3.5
      for (let i = 0; i <= cableSegments; i++) {
        const t = i / cableSegments
        const z = -deckLength / 2 + t * deckLength
        // Catenary shape: dips between towers
        const towerZ1 = -30
        const towerZ2 = 30
        let y: number
        if (z < towerZ1) {
          const f = (z - -deckLength / 2) / (towerZ1 - -deckLength / 2)
          y = THREE.MathUtils.lerp(deckY + 2, towerBase + towerHeight, f)
        } else if (z > towerZ2) {
          const f = (z - towerZ2) / (deckLength / 2 - towerZ2)
          y = THREE.MathUtils.lerp(towerBase + towerHeight, deckY + 2, f)
        } else {
          const f = (z - towerZ1) / (towerZ2 - towerZ1)
          const parabola = 4 * f * (1 - f)
          y = towerBase + towerHeight - parabola * 10
        }
        points[side].push(new THREE.Vector3(x, y, z))
      }
    }
    return points
  }, [deckLength, cableSegments, towerBase, towerHeight, deckY])

  return (
    <group ref={bridgeGroup}>
      {/* Road deck */}
      <mesh position={[0, deckY, 0]} material={darkMat}>
        <boxGeometry args={[8, 0.4, deckLength]} />
      </mesh>

      {/* Sidewalk rails */}
      {[-4.2, 4.2].map((x, i) => (
        <mesh key={`rail-${i}`} position={[x, deckY + 0.5, 0]} material={bridgeMat}>
          <boxGeometry args={[0.15, 1, deckLength]} />
        </mesh>
      ))}

      {/* Towers */}
      {[-30, 30].map((z, ti) => (
        <group key={`tower-${ti}`} position={[0, towerBase, z]}>
          {[-3.5, 3.5].map((x, li) => (
            <mesh key={`leg-${li}`} position={[x, towerHeight / 2, 0]} material={bridgeMat}>
              <boxGeometry args={[1.2, towerHeight, 1.2]} />
            </mesh>
          ))}
          {/* Cross beams */}
          {[0.3, 0.6, 0.85].map((f, bi) => (
            <mesh
              key={`beam-${bi}`}
              position={[0, towerHeight * f, 0]}
              material={bridgeMat}
            >
              <boxGeometry args={[8.2, 0.6, 0.6]} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Main cables */}
      {cables.map((pts, idx) => {
        const curve = new THREE.CatmullRomCurve3(pts)
        return (
          <mesh key={`cable-${idx}`}>
            <tubeGeometry args={[curve, 64, 0.12, 8, false]} />
            <meshStandardMaterial color="#c0362c" metalness={0.7} roughness={0.3} />
          </mesh>
        )
      })}

      {/* Suspender cables (vertical) */}
      {cables[0].map((pt, i) => {
        if (i % 3 !== 0) return null
        const bottomY = deckY + 0.4
        const height = pt.y - bottomY
        if (height < 0.5) return null
        return (
          <group key={`susp-${i}`}>
            <mesh position={[pt.x, bottomY + height / 2, pt.z]}>
              <cylinderGeometry args={[0.03, 0.03, height, 4]} />
              <meshStandardMaterial color="#c0362c" metalness={0.5} roughness={0.4} />
            </mesh>
            <mesh position={[-pt.x, bottomY + height / 2, pt.z]}>
              <cylinderGeometry args={[0.03, 0.03, height, 4]} />
              <meshStandardMaterial color="#c0362c" metalness={0.5} roughness={0.4} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

/* ═══════════════════════════════════════════
   Ocean with animated waves
   ═══════════════════════════════════════════ */

function Ocean() {
  const meshRef = useRef<THREE.Mesh>(null)
  const geo = useMemo(() => new THREE.PlaneGeometry(400, 400, 128, 128), [])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const positions = geo.attributes.position
    const t = clock.elapsedTime
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i)
      const y = positions.getY(i)
      const z =
        Math.sin(x * 0.05 + t * 0.5) * 0.3 +
        Math.cos(y * 0.08 + t * 0.3) * 0.2 +
        Math.sin((x + y) * 0.03 + t * 0.2) * 0.15
      positions.setZ(i, z)
    }
    positions.needsUpdate = true
    geo.computeVertexNormals()
  })

  return (
    <mesh ref={meshRef} geometry={geo} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <meshStandardMaterial
        color="#0a3d62"
        metalness={0.2}
        roughness={0.6}
        transparent
        opacity={0.85}
      />
    </mesh>
  )
}

/* ═══════════════════════════════════════════
   Data Particles flowing along the road
   ═══════════════════════════════════════════ */

function DataParticles({ count = 200 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      z: Math.random() * 120 - 60,
      x: (Math.random() - 0.5) * 6,
      speed: 0.15 + Math.random() * 0.3,
      y: 8.5 + Math.random() * 0.5,
    }))
  }, [count])

  useFrame(() => {
    if (!meshRef.current) return
    particles.forEach((p, i) => {
      p.z += p.speed
      if (p.z > 60) p.z = -60
      dummy.position.set(p.x, p.y, p.z)
      dummy.scale.setScalar(0.08)
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#0ea5e9" transparent opacity={0.7} />
    </instancedMesh>
  )
}

/* ═══════════════════════════════════════════
   Road extending from bridge (the journey path)
   ═══════════════════════════════════════════ */

function Road() {
  return (
    <group>
      {/* Road surface extending from bridge */}
      <mesh position={[0, 7.85, 90]} rotation={[0, 0, 0]}>
        <boxGeometry args={[8, 0.15, 60]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.3} roughness={0.7} />
      </mesh>
      {/* Road markings */}
      {Array.from({ length: 15 }, (_, i) => (
        <mesh key={`mark-${i}`} position={[0, 7.95, 62 + i * 4]}>
          <boxGeometry args={[0.2, 0.05, 2]} />
          <meshBasicMaterial color="#fbbf24" transparent opacity={0.6} />
        </mesh>
      ))}
      {/* Road continuing further */}
      <mesh position={[0, 7.85, 150]} rotation={[0, 0, 0]}>
        <boxGeometry args={[8, 0.15, 60]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.3} roughness={0.7} />
      </mesh>
    </group>
  )
}

/* ═══════════════════════════════════════════
   Hills / Terrain around Davis
   ═══════════════════════════════════════════ */

function Terrain() {
  return (
    <group>
      {/* Headlands behind bridge */}
      <mesh position={[-40, 3, -70]} rotation={[0, 0.3, 0]}>
        <coneGeometry args={[30, 12, 6]} />
        <meshStandardMaterial color="#1a2a1a" roughness={0.9} />
      </mesh>
      <mesh position={[35, 2, -80]}>
        <coneGeometry args={[25, 10, 5]} />
        <meshStandardMaterial color="#1a2a1a" roughness={0.9} />
      </mesh>
      {/* Davis area terrain (flat plains with gentle hills) */}
      <mesh position={[0, 6, 170]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[200, 100]} />
        <meshStandardMaterial color="#1a2618" roughness={0.95} />
      </mesh>
    </group>
  )
}

/* ═══════════════════════════════════════════
   Floating chapter labels in 3D space
   ═══════════════════════════════════════════ */

function ChapterMarker({
  position,
  title,
  subtitle,
}: {
  position: [number, number, number]
  title: string
  subtitle: string
}) {
  return (
    <Float speed={1} rotationIntensity={0} floatIntensity={0.3}>
      <group position={position}>
        <Text
          font="/fonts/Geist-Bold.ttf"
          fontSize={1.2}
          color="#0ea5e9"
          anchorX="center"
          anchorY="middle"
          maxWidth={12}
        >
          {title}
        </Text>
        <Text
          font="/fonts/Geist-Regular.ttf"
          fontSize={0.5}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
          position={[0, -1.2, 0]}
          maxWidth={14}
        >
          {subtitle}
        </Text>
      </group>
    </Float>
  )
}

/* ═══════════════════════════════════════════
   Fog Layers
   ═══════════════════════════════════════════ */

function FogPlanes() {
  return (
    <group>
      {[0, 1, 2].map((i) => (
        <mesh
          key={`fog-${i}`}
          position={[0, 2 + i * 2, -20 + i * 10]}
          rotation={[0, 0, 0]}
        >
          <planeGeometry args={[300, 8]} />
          <meshBasicMaterial
            color="#0a0c10"
            transparent
            opacity={0.15 - i * 0.03}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}

/* ═══════════════════════════════════════════
   Main Scene Export
   ═══════════════════════════════════════════ */

interface ExperienceSceneProps {
  scrollProgress: number
}

// Camera path spline: starts wide, along bridge, then road to Davis
const CAMERA_PATH = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 18, -90),    // Wide establishing shot
  new THREE.Vector3(8, 14, -70),     // Approach from side
  new THREE.Vector3(5, 12, -50),     // Getting closer
  new THREE.Vector3(0, 11, -30),     // Near first tower
  new THREE.Vector3(-3, 10, -10),    // On the bridge
  new THREE.Vector3(0, 10, 10),      // Mid bridge
  new THREE.Vector3(3, 10, 30),      // Near second tower
  new THREE.Vector3(0, 10, 55),      // Leaving bridge
  new THREE.Vector3(0, 10, 80),      // On the road
  new THREE.Vector3(-2, 10, 110),    // Highway stretch
  new THREE.Vector3(0, 10, 140),     // Approaching Davis
  new THREE.Vector3(0, 12, 170),     // Arriving at Davis (high up)
])

export const cameraPath = CAMERA_PATH

export function ExperienceScene({ scrollProgress }: ExperienceSceneProps) {
  const handleCreated = useCallback(({ gl }: { gl: THREE.WebGLRenderer }) => {
    gl.toneMapping = THREE.ACESFilmicToneMapping
    gl.toneMappingExposure = 0.9
  }, [])

  return (
    <div className="fixed inset-0 z-10">
      <Canvas
        camera={{ fov: 50, near: 0.1, far: 500, position: [0, 18, -90] }}
        dpr={[1, 1.5]}
        onCreated={handleCreated}
      >
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[50, 80, -30]}
          intensity={1.2}
          color="#ffeedd"
          castShadow={false}
        />
        <directionalLight position={[-30, 40, 60]} intensity={0.4} color="#87ceeb" />
        <hemisphereLight
          color="#ffeedd"
          groundColor="#0a3d62"
          intensity={0.5}
        />

        {/* Sky */}
        <Sky
          distance={4500}
          sunPosition={[100, 20, -100]}
          inclination={0.52}
          azimuth={0.25}
          rayleigh={0.5}
          turbidity={8}
        />

        {/* Fog */}
        <fog attach="fog" args={["#0a0c10", 60, 250]} />

        {/* Camera controller */}
        <CameraController progress={scrollProgress} curve={CAMERA_PATH} />

        {/* Scene objects */}
        <GoldenGateBridge />
        <Ocean />
        <Road />
        <Terrain />
        <DataParticles count={200} />
        <FogPlanes />

        {/* Chapter markers in 3D space */}
        <ChapterMarker
          position={[8, 14, -15]}
          title="Predict Failures"
          subtitle="ML models detect anomalies 72 hours before downtime"
        />
        <ChapterMarker
          position={[-8, 13, 40]}
          title="Explain Causes"
          subtitle="SHAP-powered root cause analysis for every alert"
        />
        <ChapterMarker
          position={[8, 12, 100]}
          title="Act with Copilot"
          subtitle="Automated playbooks dispatch crews in real time"
        />
      </Canvas>
    </div>
  )
}
