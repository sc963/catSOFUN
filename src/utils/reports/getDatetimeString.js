import moment from 'moment';

export default function getDatetimeString(dateString) {
  return moment(dateString, 'x').format('YYYY-MM-DD H:mm:ss');
}
