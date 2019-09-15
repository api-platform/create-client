import { date } from 'quasar';

const extractDate = value => date.extractDate(value, 'YYYY-MM-DDTHH:mm:ssZ');

export { extractDate };
