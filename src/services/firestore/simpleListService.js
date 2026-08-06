import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../../config/firebase'

// Coleção própria, sem nenhuma relação com `people` (a árvore visual).
// Serve só pra essa lista simples de texto — nunca lê nem escreve nada
// na árvore de verdade.
const simpleListCollection = collection(db, 'simpleListPeople')

export function subscribeToSimpleList(onChange, onError) {
  return onSnapshot(
    simpleListCollection,
    (snapshot) => onChange(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))),
    onError
  )
}

export async function createSimpleListPerson({ fullName, parentIds = [], spouseIds = [], isPrincipal = false }) {
  // só uma pessoa principal por vez — cadastrar uma nova como principal
  // desmarca a anterior
  if (isPrincipal) {
    const snap = await getDocs(simpleListCollection)
    for (const d of snap.docs) {
      if (d.data().isPrincipal) {
        await updateDoc(doc(db, 'simpleListPeople', d.id), { isPrincipal: false })
      }
    }
  }

  const docRef = await addDoc(simpleListCollection, {
    fullName,
    parentIds,
    spouseIds: [],
    isPrincipal,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  for (const spouseId of spouseIds) {
    await updateDoc(doc(db, 'simpleListPeople', docRef.id), { spouseIds: arrayUnion(spouseId) })
    await updateDoc(doc(db, 'simpleListPeople', spouseId), { spouseIds: arrayUnion(docRef.id) })
  }

  return docRef.id
}

export async function deleteSimpleListPerson(id) {
  await deleteDoc(doc(db, 'simpleListPeople', id))
}
