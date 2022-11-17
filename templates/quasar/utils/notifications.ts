import { Notify } from 'quasar';

export function displayErrorNotification(message: string, closeLabel: string) {
  Notify.create({
    message,
    color: 'red',
    icon: 'error',
    closeBtn: closeLabel,
  });
}

export function displaySuccessNotification(
  message: string,
  closeLabel: string
) {
  Notify.create({
    message,
    color: 'green',
    icon: 'tag_faces',
    closeBtn: closeLabel,
  });
}
