const wrapperComponent = {
  name: `wrapperComponent`,
  props: {
    dataProps: {
      type: Object,
      default: null,
    },
  },
  setup(props) {
    const store = selectStore();
    const { t, locale } = useI18n();

    const winWidthTemp = ref(window.innerWidth);

    const winWidth = computed({
      get() {
        return winWidthTemp.value;
      },
      set(val) {
        winWidthTemp.value = val;
      },
    });

    const isWap = computed({
      get() {
        return winWidth.value <= 1080;
      },
    });

    const accountDataVal = computed({
      get() {
        return store.accountDataVal;
      },
      set(val) {
        store.accountDataVal = val;
      },
    });

    onMounted(() => {});

    onUnmounted(() => {});

    return {
      props,
      store,
			isWap,
			winWidth,
      accountDataVal,
    };
  },
  template: `
	<div class="tw-wrapper">
		<tw-header :dataProps="props.dataProps"></tw-header>
		<tw-home :dataProps="props.dataProps"></tw-home>
	</div>
	<tw-footer :dataProps="props.dataProps"></tw-footer>
	`,
};
