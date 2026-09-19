import type { Metadata } from 'next'

import {
  BoardsDirectoryClient,
  type RegionSection,
  type BoardEntry,
} from '@/components/boards/boards-directory-client'
import { JsonLdScript } from '@/components/seo/json-ld'
import { PROVINCE_LABELS } from '@/lib/board/types'
import { boardsInRegion, coverageFor, nationalRegions } from '@/lib/gazettes/coverage'
import { COVERAGE_LABELS } from '@/lib/gazettes/types'
import { requirePage } from '@/lib/content/registry'
import { identifierRequirementSentence } from '@/lib/result/capability'
import { linkableSources } from '@/lib/result-sources/registry'
import { breadcrumbSchema, webPageSchema } from '@/lib/schema/json-ld'
import { metadataForPage } from '@/lib/seo/metadata'

const PAGE = requirePage('boards-directory')

export const metadata: Metadata = metadataForPage(PAGE)

/**
 * Custom metadata and exact presentation ordering mapping for boards
 * to match the verified education board directory layout.
 */
const BOARD_METADATA: Record<
  string,
  {
    name: string
    shortName: string
    logo: string
    description: string
    order: number
  }
> = {
  // Punjab (9 boards in exact visual order)
  'bise-lahore': {
    name: 'BISE Lahore',
    shortName: 'BISE Lahore',
    logo: '/logos/bise-lahore.webp',
    description: 'Main board for Lahore and surrounding areas.',
    order: 1,
  },
  'bise-faisalabad': {
    name: 'BISE Faisalabad',
    shortName: 'BISE Faisalabad',
    logo: '/logos/bise-faisalabad.webp',
    description: 'Covers Faisalabad division including multiple districts.',
    order: 2,
  },
  'bise-multan': {
    name: 'BISE Multan',
    shortName: 'BISE Multan',
    logo: '/logos/bise-multan.webp',
    description: 'Serves Multan and nearby regions.',
    order: 3,
  },
  'bise-gujranwala': {
    name: 'BISE Gujranwala',
    shortName: 'BISE Gujranwala',
    logo: '/logos/bise-gujranwala.webp',
    description: 'Covers Gujranwala division.',
    order: 4,
  },
  'bise-rawalpindi': {
    name: 'BISE Rawalpindi',
    shortName: 'BISE Rawalpindi',
    logo: '/logos/bise-rawalpindi.webp',
    description: 'Serves Rawalpindi and surrounding areas.',
    order: 5,
  },
  'bise-sargodha': {
    name: 'BISE Sargodha',
    shortName: 'BISE Sargodha',
    logo: '/logos/bise-sargodha.webp',
    description: 'Covers Sargodha division.',
    order: 6,
  },
  'bise-bahawalpur': {
    name: 'BISE Bahawalpur',
    shortName: 'BISE Bahawalpur',
    logo: '/logos/bise-bahawalpur.webp',
    description: 'Serves Bahawalpur and nearby regions.',
    order: 7,
  },
  'bise-sahiwal': {
    name: 'BISE Sahiwal',
    shortName: 'BISE Sahiwal',
    logo: '/logos/bise-sahiwal.webp',
    description: 'Covers Sahiwal division.',
    order: 8,
  },
  'bise-dg-khan': {
    name: 'BISE Dera Ghazi Khan',
    shortName: 'BISE DG Khan',
    logo: '/logos/bise-dg-khan.webp',
    description: 'Serves Dera Ghazi Khan division.',
    order: 9,
  },

  // Sindh (6 boards in exact visual order)
  biek: {
    name: 'BISE Karachi',
    shortName: 'BIEK Karachi',
    logo: '/logos/bise-karachi.svg',
    description: 'Main board for Karachi.',
    order: 1,
  },
  'bise-hyderabad': {
    name: 'BISE Hyderabad',
    shortName: 'BISE Hyderabad',
    logo: '/logos/bise-hyderabad.svg',
    description: 'Covers Hyderabad division.',
    order: 2,
  },
  'bise-larkana': {
    name: 'BISE Larkano',
    shortName: 'BISE Larkano',
    logo: '/logos/bise-larkana.svg',
    description: 'Serves Larkano region.',
    order: 3,
  },
  'bise-sukkur': {
    name: 'BISE Sukkur',
    shortName: 'BISE Sukkur',
    logo: '/logos/bise-sukkur.svg',
    description: 'Covers Sukkur division.',
    order: 4,
  },
  'bise-mirpurkhas': {
    name: 'BISE Mirpurkhas',
    shortName: 'BISE Mirpurkhas',
    logo: '/logos/bise-mirpurkhas.svg',
    description: 'Serves Mirpurkhas region.',
    order: 5,
  },
  'bise-shaheed-benazirabad': {
    name: 'BISE Shaheed Benazirabad',
    shortName: 'BISE SBA',
    logo: '/logos/bise-shaheed-benazirabad.svg',
    description: 'Formerly Nawabshah, covers Shaheed Benazirabad.',
    order: 6,
  },

  // Khyber Pakhtunkhwa (8 boards in exact visual order)
  'bise-peshawar': {
    name: 'BISE Peshawar',
    shortName: 'BISE Peshawar',
    logo: '/logos/bise-peshawar.png',
    description: 'Main board for Peshawar.',
    order: 1,
  },
  'bise-mardan': {
    name: 'BISE Mardan',
    shortName: 'BISE Mardan',
    logo: '/logos/mardan.png',
    description: 'Covers Mardan division.',
    order: 2,
  },
  'bise-abbottabad': {
    name: 'BISE Abbottabad',
    shortName: 'BISE Abbottabad',
    logo: '/logos/abbottabad.png',
    description: 'Serves Abbottabad region.',
    order: 3,
  },
  'bise-swat': {
    name: 'BISE Swat',
    shortName: 'BISE Swat',
    logo: '/logos/swat.jpg',
    description: 'Covers Swat and surrounding areas.',
    order: 4,
  },
  'bise-kohat': {
    name: 'BISE Kohat',
    shortName: 'BISE Kohat',
    logo: '/logos/kohat.png',
    description: 'Serves Kohat region.',
    order: 5,
  },
  'bise-bannu': {
    name: 'BISE Bannu',
    shortName: 'BISE Bannu',
    logo: '/logos/bannu.png',
    description: 'Covers Bannu region.',
    order: 6,
  },
  'bise-malakand': {
    name: 'BISE Malakand',
    shortName: 'BISE Malakand',
    logo: '/logos/malakand.png',
    description: 'Serves Malakand division.',
    order: 7,
  },
  'bise-dera-ismail-khan': {
    name: 'BISE Dera Ismail Khan',
    shortName: 'BISE DI Khan',
    logo: '/logos/dikhan.png',
    description: 'Covers Dera Ismail Khan region.',
    order: 8,
  },

  // Balochistan
  bbise: {
    name: 'BISE Quetta',
    shortName: 'BBISE Quetta',
    logo: '/logos/bise-quetta.svg',
    description: 'Main board for Balochistan province.',
    order: 1,
  },

  // Federal
  fbise: {
    name: 'Federal Board of Intermediate & Secondary Education',
    shortName: 'FBISE Federal',
    logo: '/logos/fbise.png',
    description: 'Covers institutions across Pakistan and abroad.',
    order: 1,
  },

  // Azad Jammu & Kashmir
  ajkbise: {
    name: 'BISE Mirpur',
    shortName: 'AJK BISE',
    logo: '/logos/bise-mirpur.svg',
    description: 'Serves Azad Jammu & Kashmir region.',
    order: 1,
  },
}

const REGION_SUBTITLES: Record<string, string> = {
  punjab: 'Boards in Punjab Province',
  sindh: 'Boards in Sindh Province',
  'khyber-pakhtunkhwa': 'Boards in Khyber Pakhtunkhwa',
  balochistan: 'Boards in Balochistan',
  federal: 'Federal (1 board)',
  'azad-jammu-kashmir': 'AJK Board',
}

export default function BoardsDirectory() {
  const regions = nationalRegions().filter(
    (
      p,
    ): p is
      | 'punjab'
      | 'sindh'
      | 'khyber-pakhtunkhwa'
      | 'balochistan'
      | 'federal'
      | 'azad-jammu-kashmir' => Boolean(REGION_SUBTITLES[p]),
  )

  const sections: RegionSection[] = regions
    .map((province) => {
      const boards = boardsInRegion(province)
      if (boards.length === 0) return null

      const boardEntries: BoardEntry[] = boards
        .filter((b) => b.id !== 'aku-eb' && b.id !== 'zueb')
        .map((board) => {
          const sources = linkableSources(board.id)
          const requirement = identifierRequirementSentence({
            requiresAdditionalIdentifier:
              sources.find((s) => s.requiresAdditionalIdentifier !== 'unknown')
                ?.requiresAdditionalIdentifier ?? 'unknown',
            hasCaptcha: sources.find((s) => s.hasCaptcha !== 'unknown')?.hasCaptcha ?? 'unknown',
          })

          const meta = BOARD_METADATA[board.id] ?? {
            name: board.officialName,
            shortName: board.slug,
            logo: '/icons/crest.svg',
            description: `Covers examinations and affiliated institutions under ${board.officialName}.`,
            order: 99,
          }

          return {
            id: board.id,
            slug: board.slug,
            name: meta.name,
            shortName: meta.shortName,
            officialName: board.officialName,
            province: province,
            provinceLabel: PROVINCE_LABELS[province],
            logo: meta.logo,
            description: meta.description,
            officialWebsite: board.officialWebsite,
            coverageLabel: COVERAGE_LABELS[coverageFor(board)],
            requirement: requirement || undefined,
            cautions: board.studentCautions ? [...board.studentCautions] : undefined,
            order: meta.order,
          }
        })
        .sort((a, b) => a.order - b.order)

      return {
        province,
        title: PROVINCE_LABELS[province],
        subtitle: REGION_SUBTITLES[province] || `Boards in ${PROVINCE_LABELS[province]}`,
        boards: boardEntries,
      }
    })
    .filter((s): s is RegionSection => Boolean(s))

  const totalBoardsCount = sections.reduce((acc, s) => acc + s.boards.length, 0)
  const totalRegionsCount = sections.length

  return (
    <>
      <JsonLdScript
        nodes={[
          webPageSchema({
            path: PAGE.path,
            name: PAGE.title,
            description: PAGE.description,
            dateModified: PAGE.contentUpdatedAt,
          }),
          breadcrumbSchema(PAGE.breadcrumb),
        ]}
      />

      <BoardsDirectoryClient
        sections={sections}
        totalBoardsCount={totalBoardsCount}
        totalRegionsCount={totalRegionsCount}
      />
    </>
  )
}
