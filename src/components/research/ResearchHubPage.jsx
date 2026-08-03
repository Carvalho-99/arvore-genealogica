import { useEffect, useState } from 'react'
import { fetchSurnameInfo } from '../../services/external/wikidata'
import { fetchWikiTreeProfiles } from '../../services/external/wikitree'
import { fetchNationalityInfo } from '../../services/external/forebears'
import SurnameSearchForm from './SurnameSearchForm'
import SourceDisclaimer from './SourceDisclaimer'
import OriginSummaryCard from './OriginSummaryCard'
import NotablePeopleList from './NotablePeopleList'
import NationalityCard from './NationalityCard'
import LoadingSpinner from '../common/LoadingSpinner'

const DEFAULT_SURNAME = 'Mostafá'

export default function ResearchHubPage() {
  const [surname, setSurname] = useState(DEFAULT_SURNAME)
  const [loading, setLoading] = useState(false)
  const [wikidataInfo, setWikidataInfo] = useState(null)
  const [wikitreeInfo, setWikitreeInfo] = useState(null)
  const [nationalityInfo, setNationalityInfo] = useState(null)
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    runSearch(DEFAULT_SURNAME, '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function runSearch(term, forename) {
    setLoading(true)
    setSearched(true)
    const [wikidataResult, wikitreeResult, nationalityResult] = await Promise.all([
      fetchSurnameInfo(term).catch(() => null),
      fetchWikiTreeProfiles(term),
      fetchNationalityInfo(forename, term),
    ])
    setWikidataInfo(wikidataResult)
    setWikitreeInfo(wikitreeResult)
    setNationalityInfo(nationalityResult)
    setLoading(false)
  }

  function handleSearch(term, forename) {
    setSurname(term)
    runSearch(term, forename)
  }

  const nothingFound =
    searched && !loading && !wikidataInfo && !wikitreeInfo && !nationalityInfo

  return (
    <div>
      <h1 className="mb-3 text-lg font-semibold text-slate-100">
        Central de Pesquisa
      </h1>
      <SurnameSearchForm defaultValue={surname} onSearch={handleSearch} />
      <SourceDisclaimer />

      {loading && <LoadingSpinner />}

      {!loading && wikidataInfo && (
        <>
          <OriginSummaryCard
            label={wikidataInfo.label}
            description={wikidataInfo.description}
            wikidataUrl={wikidataInfo.wikidataUrl}
          />
          <NotablePeopleList
            title="Pessoas notáveis (Wikidata)"
            people={wikidataInfo.notablePeople}
          />
        </>
      )}

      {!loading && wikitreeInfo && (
        <NotablePeopleList
          title="Perfis públicos (WikiTree)"
          people={wikitreeInfo.profiles}
        />
      )}

      {!loading && nationalityInfo && (
        <NationalityCard
          countries={nationalityInfo.countries}
          spheres={nationalityInfo.spheres}
        />
      )}

      {nothingFound && (
        <p className="py-6 text-center text-sm text-slate-500">
          Não encontramos nada de público sobre "{surname}" nessas fontes.
        </p>
      )}
    </div>
  )
}
