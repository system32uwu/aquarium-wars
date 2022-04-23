import { User } from '@aquarium-wars/whale'

export interface PublicUser extends Omit<User, 'nonce'> {}
