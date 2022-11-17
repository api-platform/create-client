import { Ref, watch } from 'vue';
import { displayErrorNotification } from 'src/utils/notifications';
import { useI18n } from 'vue-i18n';

export function useWatchErrors(
  errors: (Ref<string | undefined> | undefined)[]
) {
  const { t } = useI18n();

  watch(errors, (newErrors) => {
    newErrors.forEach((newError) => {
      if (!newError?.value) {
        return;
      }

      displayErrorNotification(newError.value, t('close'));
    });
  });
}
