const headerComponent = {
  name: `headerComponent`,
  props: {
    dataProps: {
      type: Object,
      default: null,
    },
  },
  setup(props) {
    const store = selectStore();
    const { t, locale } = useI18n();

    const accountDataVal = computed({
      get() {
        return store.accountDataVal;
      },
      set(val) {
        store.accountDataVal = val;
      },
    });

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

    const resizeHeader = () => {
      if (window.innerWidth !== winWidth.value) {
        winWidth.value = window.innerWidth;
      }
    };

    onMounted(() => {
      resizeHeader();
      $(window).on("scroll resize", resizeHeader);
    });
    onUnmounted(() => {
      $(window).off("scroll resize", resizeHeader);
    });

    return {
      props,
      store,
      accountDataVal,
      winWidth,
      isWap,
    };
  },
  template: `
	<header class="tw-header">
		<div class="wap-wrap">
			<nav class="nav">
				<h1
					class="logo"
					@click="store.openWindow('./', false, true)"
				>
					<img :src="'images/logo.png'" alt="" />
				</h1>
			</nav>
		</div>
	</header>
	`,
};
