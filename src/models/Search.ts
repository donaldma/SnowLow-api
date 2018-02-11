export enum Currency{
  CAD = 'CAD',
  USD = 'USD'
}

export interface IDatabaseResults {
  createdAt: string
  searchTerm: string
  price: number
  imageUrl: string
  name: string
  currency: Currency
  id: string
  userId: string
  itemUrl: string
}
