export type RatingColor = 'green' | 'gray' | 'yellow' | 'orange' | 'red'

export const getRatingColor = (rating: number): RatingColor => {
  if (rating >= 8.6) return 'yellow'
  if (rating >= 7.5) return 'green'
  if (rating >= 6.3) return 'gray'
  return 'red'
}

export const formatRating = (rating: number): string =>
  rating.toFixed(1).replace('.', ',')