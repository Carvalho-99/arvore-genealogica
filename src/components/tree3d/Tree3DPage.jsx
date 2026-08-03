import { Suspense, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { usePeople } from '../../context/PeopleContext'
import TreeScene from './TreeScene'
import { computeTreeLayout } from './layout'
import LoadingSpinner from '../common/LoadingSpinner'

export default function Tree3DPage() {
  const { people, loading, rootPerson } = usePeople()
  const navigate = useNavigate()

  const layout = useMemo(
    () => (rootPerson ? computeTreeLayout(people, rootPerson.id) : { nodes: [], edges: [] }),
    [people, rootPerson]
  )

  const ys = layout.nodes.map((n) => n.y)
  const centerY = ys.length ? (Math.min(...ys) + Math.max(...ys)) / 2 : 0
  const boundingRadius = Math.max(
    3,
    ...layout.nodes.map((n) => Math.hypot(n.x, n.y - centerY, n.z))
  )
  // multiplicador generoso porque a tela do celular é mais estreita que
  // alta, então o campo de visão horizontal é menor que o vertical
  const camDistance = boundingRadius * 2.4 + 3

  if (loading) return <LoadingSpinner />

  if (!rootPerson) {
    return (
      <div className="mt-16 text-center text-sm text-stone-400">
        Cadastre pelo menos uma pessoa na aba Árvore pra ver a visão 3D.
      </div>
    )
  }

  return (
    <div className="-mx-4 -mt-6">
      <div
        className="h-[calc(100svh-8.5rem)] w-full touch-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 30%, #fbf3df 0%, #ecd9b3 55%, #d8bd88 100%)',
        }}
      >
        <Canvas
          camera={{
            position: [camDistance * 0.6, centerY + camDistance * 0.4, camDistance * 0.6],
            fov: 50,
          }}
          gl={{ preserveDrawingBuffer: true }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[5, centerY + 6, 4]} intensity={1.1} />
            <fog attach="fog" args={['#ecd9b3', camDistance, camDistance * 3.2]} />
            <TreeScene nodes={layout.nodes} edges={layout.edges} onSelect={(id) => navigate(`/pessoa/${id}`)} />
            <OrbitControls
              target={[0, centerY, 0]}
              enablePan={false}
              minDistance={camDistance * 0.4}
              maxDistance={camDistance * 2.2}
              autoRotate
              autoRotateSpeed={0.6}
              enableDamping
              dampingFactor={0.08}
            />
          </Suspense>
        </Canvas>
      </div>
      <p className="px-4 pt-2 text-center text-xs text-stone-500">
        Arraste pra girar a árvore, toque numa pessoa pra abrir o cartão dela.
      </p>
    </div>
  )
}
