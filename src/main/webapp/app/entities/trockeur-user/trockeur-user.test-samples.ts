import { ITrockeurUser, NewTrockeurUser } from './trockeur-user.model';

export const sampleWithRequiredData: ITrockeurUser = {
  id: 24123,
  address: 'Générique Bois',
  zipCode: '45658',
};

export const sampleWithPartialData: ITrockeurUser = {
  id: 28927,
  address: 'Minispaces',
  zipCode: '67204',
};

export const sampleWithFullData: ITrockeurUser = {
  id: 22415,
  address: 'Nauru SUV Congelé',
  zipCode: '20343',
  description: '../fake-data/blob/hipster.txt',
  profilePicturePath: 'Bretagne',
};

export const sampleWithNewData: NewTrockeurUser = {
  address: 'dépôt',
  zipCode: '65189',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
