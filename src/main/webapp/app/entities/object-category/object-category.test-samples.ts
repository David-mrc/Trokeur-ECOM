import { IObjectCategory, NewObjectCategory } from './object-category.model';

export const sampleWithRequiredData: IObjectCategory = {
  id: 9515,
  name: 'Béton',
};

export const sampleWithPartialData: IObjectCategory = {
  id: 30975,
  name: 'Femme Pantalon Savoureux',
};

export const sampleWithFullData: IObjectCategory = {
  id: 13533,
  name: 'lors quasiment',
};

export const sampleWithNewData: NewObjectCategory = {
  name: 'virer',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
