import * as toast from '../composables/useToast.js';

export default {
  install(app) {
    app.config.globalProperties.$toast = toast.useToast();
  }
};