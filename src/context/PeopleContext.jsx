import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { subscribeToPeople } from '../services/firestore/peopleService'
import { anonymousSignInReady } from '../config/firebase'

const PeopleContext = createContext(null)

export function PeopleProvider({ children }) {
  const [people, setPeople] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let unsubscribe = () => {}
    let cancelled = false

    // Firestore precisa que o login anônimo já tenha terminado antes de
    // abrir o listener, senão o primeiro pedido é recusado (permission-denied)
    // e o SDK não tenta de novo sozinho depois que o login completa.
    anonymousSignInReady
      .then(() => {
        if (cancelled) return
        unsubscribe = subscribeToPeople(
          (list) => {
            setPeople(list)
            setLoading(false)
          },
          (err) => {
            setError(err)
            setLoading(false)
          }
        )
      })
      .catch((err) => {
        setError(err)
        setLoading(false)
      })

    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [])

  const peopleById = useMemo(() => {
    const map = new Map()
    for (const person of people) map.set(person.id, person)
    return map
  }, [people])

  const rootPerson = useMemo(
    () => people.find((p) => p.isRoot) ?? people[0] ?? null,
    [people]
  )

  function getPerson(id) {
    return peopleById.get(id) ?? null
  }

  function getParents(personId) {
    const person = peopleById.get(personId)
    if (!person) return []
    return (person.parentIds ?? [])
      .map((id) => peopleById.get(id))
      .filter(Boolean)
  }

  function getSpouses(personId) {
    const person = peopleById.get(personId)
    if (!person) return []
    return (person.spouseIds ?? [])
      .map((id) => peopleById.get(id))
      .filter(Boolean)
  }

  function getChildren(personId) {
    return people.filter((p) => (p.parentIds ?? []).includes(personId))
  }

  function getSiblings(personId) {
    const person = peopleById.get(personId)
    if (!person || !(person.parentIds ?? []).length) return []
    const parentIds = new Set(person.parentIds)
    return people.filter(
      (p) =>
        p.id !== personId && (p.parentIds ?? []).some((id) => parentIds.has(id))
    )
  }

  const value = {
    people,
    peopleById,
    loading,
    error,
    rootPerson,
    getPerson,
    getParents,
    getSpouses,
    getChildren,
    getSiblings,
  }

  return (
    <PeopleContext.Provider value={value}>{children}</PeopleContext.Provider>
  )
}

export function usePeople() {
  const ctx = useContext(PeopleContext)
  if (!ctx) throw new Error('usePeople must be used within a PeopleProvider')
  return ctx
}
