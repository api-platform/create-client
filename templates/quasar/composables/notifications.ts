import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

export function useNotifications() {
  const $q = useQuasar();
  const { t } = useI18n();

  const displayErrorNotification = (message: string) => {
    $q.notify({
      message,
      color: 'red',
      icon: 'error',
      closeBtn: t('close'),
    });
  };

  const displaySuccessNotification = (message: string) => {
    $q.notify({
      message,
      color: 'green',
      icon: 'tag_faces',
      closeBtn: t('close'),
    });
  };

  return {
    displayErrorNotification,
    displaySuccessNotification,
  };
}
