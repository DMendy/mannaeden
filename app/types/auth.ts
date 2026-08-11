export type Civilite = 'M' | 'MME'
export type UserRole = 'CLIENT' | 'ADMIN'
export type StatutLivraison = 'COMMANDEE' | 'EXPEDIEE' | 'EN_COURS_DE_LIVRAISON' | 'LIVREE'

export interface AuthUser {
  id: string
  email: string
  role: UserRole
  civilite: Civilite | null
  nom: string
  prenom: string
  telephone: string | null
  adresseLigne1: string | null
  adresseLigne2: string | null
  codePostal: string | null
  ville: string | null
  pays: string | null
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  accessToken: string
  user: AuthUser
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  email: string
  password: string
  civilite?: Civilite
  nom: string
  prenom: string
  telephone?: string
  adresseLigne1?: string
  adresseLigne2?: string
  codePostal?: string
  ville?: string
  pays?: string
}

export interface Product {
  id: string
  nom: string
  description: string | null
  prixUnitaire: number
  stock: number
  imageUrl: string | null
  precommandeActive: boolean
  precommandeFin: string | null
  createdAt: string
  updatedAt: string
}

export interface OrderStatusHistory {
  id: string
  statut: StatutLivraison
  createdAt: string
}

export interface Order {
  id: string
  userId: string
  productId: string
  product: Product
  quantite: number
  prixUnitaireSnapshot: number
  montantTotal: number
  civilite: Civilite
  nom: string
  prenom: string
  telephone: string | null
  adresseLigne1: string
  adresseLigne2: string | null
  codePostal: string
  ville: string
  pays: string
  statutLivraison: StatutLivraison
  stripeSessionId: string
  stripePaymentIntentId: string | null
  statusHistory: OrderStatusHistory[]
  createdAt: string
  updatedAt: string
}

export interface UpdateProfilePayload {
  civilite?: Civilite
  telephone?: string
  adresseLigne1?: string
  adresseLigne2?: string
  codePostal?: string
  ville?: string
  pays?: string
}

export interface CheckoutPayload {
  productId: string
  quantite: number
  civilite: Civilite
  nom: string
  prenom: string
  telephone?: string
  adresseLigne1: string
  adresseLigne2?: string
  codePostal: string
  ville: string
  pays: string
  modeLivraison: string
  fraisLivraison: number
}
