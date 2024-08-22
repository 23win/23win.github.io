const footerComponent = {
  name: `footerComponent`,
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

    const resizeCheck = () => {
      if (window.innerWidth !== winWidth.value) {
        winWidth.value = window.innerWidth;
      }
    };

    const scrollToTop = (evt, top = 0) => {
      let _top = top;

      if (_top !== null && typeof _top === "number") {
        window.scrollTo({
          top: _top ? _top : 0,
          left: 0,
          behavior: "smooth",
        });
      }
    };

    onMounted(() => {
      $(window).on("resize", resizeCheck);
    });

    onUnmounted(() => {
      $(window).off("resize", resizeCheck);
    });

    return {
      props,
      store,
      isWap,
      winWidth,
      scrollToTop,
    };
  },
  template: `
	<footer class="tw-footer">
		<div class="foot-content">
			<div class="f-top-links">
				<div class="ft-l-right">
					<div class="ft-l-r column1" v-for="(v, i) in store.footerLinks.top.slice(2, 3)" :key="i">
						<div class="lr-link" v-for="(w, j) in v[0].subs" :key="j">
							<p>{{w.link}}</p>
							<div class="lr-icons">
								<div class="lr-i raw-s" v-for="(x, k) in w.icons" :key="k">
									<img v-if="w.type === 'top'" :src="'images/pages/sec-footer-t-'+(++k)+'.png'" alt="">
									<img v-if="w.type === 'center'" :src="'images/pages/sec-footer-m-'+(++k)+'.png'" alt="">
								</div>
							</div>
						</div>
					</div>
					<div class="ft-l-r column1">
						<div class="lr-link">
							<p>Phương thức thanh toán</p>
							<div class="lr-icons">
								<div class="lr-i raw-s" v-for="(w, j) in store.footerLinks.bottom.icons" :key="j">
									<img :src="'images/pages/sec-footer-b-'+(++j)+'.png'" alt="">
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="f-copyright">
				<p>{{store.footerLinks.copyright.left}} {{ new Date().getFullYear() }} {{store.footerLinks.copyright.right}}</p>
			</div>
		</div>
	</footer>
	`,
};
