import { Suspense } from 'react'
import { useNavigate } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { usePeople } from '../../context/PeopleContext'
import TreeCube from './TreeCube'
import LoadingSpinner from '../common/LoadingSpinner'

export default function Tree3DPage() {
  const { people, loading, rootPerson } = usePeople()
  const navigate = useNavigate()

  if (loading) return <LoadingSpinner />

  if (!rootPerson) {
    return (
      <div className="mt-16 text-center text-sm text-stone-500">
        Cadastre pelo menos uma pessoa na aba Árvore pra ver a visão 3D.
      </div>
    )
  }

  return (
    <div className="-mx-4 -mt-6">
      <div className="h-[calc(100svh-8.5rem)] w-full touch-none">
        <Canvas
          camera={{ position: [0, 0, 11], fov: 45 }}
          gl={{ preserveDrawingBuffer: true }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.9} />
            <directionalLight position={[3, 4, 5]} intensity={0.8} color="#fff2d0" />
            <TreeCube
              people={people}
              rootPerson={rootPerson}
              onSelect={(id) => navigate(`/pessoa/${id}`)}
            />
            <OrbitControls
              enablePan={false}
              minDistance={7}
              maxDistance={18}
              autoRotate
              autoRotateSpeed={0.5}
              enableDamping
              dampingFactor={0.08}
            />
          </Suspense>
        </Canvas>
      </div>
    </div>
  )
}
