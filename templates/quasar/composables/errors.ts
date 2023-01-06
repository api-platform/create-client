import { Ref, watch } from 'vue';
import { useNotifications } from './notifications';

export function useWatchErrors(
  errors: (Ref<string | undefined> | undefined)[]
) {
  const { displayErrorNotification } = useNotifications();

  watch(errors, (newErrors) => {
    newErrors.forEach((newError) => {
      if (!newError?.value) {
        return;
      }

      displayErrorNotification(newError.value);
    });
  });
}
