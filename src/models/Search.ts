export enum Currency{
  CAD = 'CAD',
  USD = 'USD'
}

export interface IDatabaseResults {
  imageUrl: string
  currency: Currency
  userId: string
  searchPath: string
  itemUrl: string
  createdAt: string
  price: number
  id: string
  name: string
}

export interface IScrapeResults {
  name: string
  price: number
  itemUrl: string
  imageUrl: string
  searchPath: string
  currency: Currency
  userId: string
}
