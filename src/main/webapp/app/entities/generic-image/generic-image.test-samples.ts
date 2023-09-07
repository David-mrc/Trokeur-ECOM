import { IGenericImage, NewGenericImage } from './generic-image.model';

export const sampleWithRequiredData: IGenericImage = {
  id: 12273,
  imagePath: 'antagoniste personnel souris',
};

export const sampleWithPartialData: IGenericImage = {
  id: 27033,
  imagePath: 'Maison Générique Diesel',
};

export const sampleWithFullData: IGenericImage = {
  id: 7501,
  imagePath: 'vétuste parlementaire',
};

export const sampleWithNewData: NewGenericImage = {
  imagePath: 'Est Artisanal',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
