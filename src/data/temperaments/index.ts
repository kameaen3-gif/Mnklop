import { simpleTemperaments } from './simple';
import { mixedTemperaments } from './mixed';
import { TemperamentKey, TemperamentData } from '../../types';

export const temperaments: Record<TemperamentKey, TemperamentData> = {
  ...simpleTemperaments,
  ...mixedTemperaments
};
