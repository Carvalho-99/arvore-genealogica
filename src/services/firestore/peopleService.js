import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../../config/firebase'

const peopleCollection = collection(db, 'people')

export function subscribeToPeople(onChange, onError) {
  return onSnapshot(
    peopleCollection,
    (snapshot) => {
      const people = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
      onChange(people)
    },
    onError
  )
}

export async function createPerson(data) {
  const docRef = await addDoc(peopleCollection, {
    fullName: data.fullName,
    nickname: data.nickname ?? null,
    gender: data.gender ?? 'other',
    birthDate: data.birthDate ?? null,
    deathDate: data.deathDate ?? null,
    birthPlace: data.birthPlace ?? null,
    bio: data.bio ?? null,
    isRoot: data.isRoot ?? false,
    parentIds: data.parentIds ?? [],
    spouseIds: data.spouseIds ?? [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return docRef.id
}

export async function updatePerson(personId, data) {
  await updateDoc(doc(db, 'people', personId), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export async function deletePerson(personId) {
  await deleteDoc(doc(db, 'people', personId))
}

export async function setParents(childId, parentIds) {
  await updateDoc(doc(db, 'people', childId), {
    parentIds,
    updatedAt: serverTimestamp(),
  })
}

export async function linkSpouses(personIdA, personIdB) {
  await Promise.all([
    updateDoc(doc(db, 'people', personIdA), {
      spouseIds: arrayUnion(personIdB),
      updatedAt: serverTimestamp(),
    }),
    updateDoc(doc(db, 'people', personIdB), {
      spouseIds: arrayUnion(personIdA),
      updatedAt: serverTimestamp(),
    }),
  ])
}

export async function unlinkSpouses(personIdA, personIdB) {
  await Promise.all([
    updateDoc(doc(db, 'people', personIdA), {
      spouseIds: arrayRemove(personIdB),
      updatedAt: serverTimestamp(),
    }),
    updateDoc(doc(db, 'people', personIdB), {
      spouseIds: arrayRemove(personIdA),
      updatedAt: serverTimestamp(),
    }),
  ])
}
