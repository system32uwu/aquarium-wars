import { User } from '@prisma/client'

export interface PublicUser extends Omit<User, 'nonce'> {}
