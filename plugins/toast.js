import { useToast } from '@/components/ui/toast/use-toast';

export default defineNuxtPlugin((nuxtApp) => {
  const { toast } = useToast();
  nuxtApp.provide('toast', toast);
});
