import { Notify } from 'quasar';

const error = (message, closeLabel) => 
  Notify.create({
    message,
    color: 'red',
    icon: 'error',
    closeBtn: closeLabel,
  });

const success = (message, closeLabel) => 
  Notify.create({
    message,
    color: 'green',
    icon: 'tag_faces',
    closeBtn: closeLabel,
  });

const warning = (message, closeLabel) =>
  Notify.create({
    message,
    color: 'yellow',
    icon: 'warning',
    closeBtn: closeLabel,
  });

export {
  error,
  success,
  warning,
};
