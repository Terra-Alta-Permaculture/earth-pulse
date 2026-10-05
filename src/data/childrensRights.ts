// Children's rights — cited UNICEF / ILO / UNESCO headline figures (no clean
// keyless live feed for these), shown alongside ONE live World Bank metric
// (under-5 mortality) fetched in the component.

export const CHILD_STATS = {
  childLabour: 138, // ILO/UNICEF: millions in child labour (2024 estimate)
  childLabourNote: 'children in child labour',
  outOfSchool: 250, // UNESCO: millions of children & youth out of school
  outOfSchoolNote: 'children & youth out of school',
  inConflict: 473, // UNICEF: millions of children living in conflict zones (~1 in 6)
  inConflictNote: 'children live in a conflict zone — ~1 in 6',
  childMarriageNote: '1 in 5 girls is still married before the age of 18 (UNICEF)',
  asOf: '2024',
}

export const CHILD_SOURCES: { label: string; url: string }[] = [
  { label: 'UNICEF Data', url: 'https://data.unicef.org/' },
  { label: 'ILO — child labour', url: 'https://www.ilo.org/topics/child-labour' },
  { label: 'UNESCO — out of school', url: 'https://www.unesco.org/en/education' },
  { label: 'UN IGME — child mortality', url: 'https://childmortality.org/' },
]
