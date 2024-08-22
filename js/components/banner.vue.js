const bannerComponent = {
  name: `bannerComponent`,
  props: {
    dataProps: {
      type: Object,
      default: null,
    },
  },
  setup(props) {
    const store = selectStore();

    let swTwBanner = null;

    let swTwChart = null;

    let marqueeExec = null;

    const vipNumber = computed({
      get() {
        return store.vipNumber;
      },
      set(val) {
        store.vipNumber = val;
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

    const winResizeCheck = () => {
      if (window.innerWidth !== winWidth.value) {
        winWidth.value = window.innerWidth;

        if (swTwBanner) {
          swTwBanner.slideToLoop(0, 0);
        }
      }
    };

    const getVipNumTemp = ref();

    const getVipNum = computed({
      get() {
        return getVipNumTemp.value;
      },
      set(val) {
        getVipNumTemp.value = val;
      },
    });

    const dateCountTemp = ref(null);

    const dateCount = computed({
      get() {
        return dateCountTemp.value;
      },
      set(val) {
        dateCountTemp.value = val;
      },
    });

    const timeCountTemp = ref(null);

    const timeCount = computed({
      get() {
        return timeCountTemp.value;
      },
      set(val) {
        timeCountTemp.value = val;
      },
    });

    const timeCountStart = () => {
      timeCount.value = timeCountExec();
      dateCount.value = dateCountExec();
    };

    const timeCountExec = () => {
      return dayjs(new Date()).tz("Asia/Ho_Chi_Minh").format("HH:mm:ss");
    };

    const dateCountExec = () => {
      return dayjs(new Date()).tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY");
    };

    const randomFloat = (min, max) => {
      return (Math.random() * parseFloat(max - min) + 0.01).toFixed(2);
    };

    const setRandomInterval = (intervalFunction, minDelay, maxDelay) => {
      let timeout;

      const runInterval = () => {
        const timeoutFunction = () => {
          intervalFunction();
          runInterval();
        };

        const delay =
          Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;

        timeout = setTimeout(timeoutFunction, delay);
      };

      runInterval();

      return {
        clear() {
          clearTimeout(timeout);
        },
      };
    };

    const retFloatNum = (a, b) => {
      return (parseFloat(a) + parseFloat(b)).toFixed(2);
    };

    let headerTimer = null;

    let vipNumberCount = null;

    let vipNumberCountInterval = null;

    const getUserName = getUserNameText;

		const makeOneNum = function (max, min) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		};

		const makeComma = function (number) {
			let reg = /(\d)(?=(\d\d\d)+(?!\d))/g;
			return number.toString().replace(reg, "$1,");
		};

		const makeNumber = function (min = 0, max = 100) {
			let diff = max - min;
			let ranDom = Math.random();
		
			ranDom = Math.floor(ranDom * diff);
			ranDom = ranDom + min;
		
			return ranDom;
		};

		const spawnUserList = function (len = 32) {
			let _Arr = [];
		
			for (i = 0; i < len; i++) {
				_Arr.push({
					user: getUserName(),
					jackpot: makeComma(makeNumber(99, 999999)),
					img: makeOneNum(3, 1),
				});
			}
		
			return _Arr;
		};

		const vipUserListTemp = ref(null);
		
		const vipUserList = computed({
			get(){
				return vipUserListTemp.value;
			},
			set(val){
				vipUserListTemp.value = val;
			}
		})

		vipUserList.value = spawnUserList(makeNumber(35, 25));

    onMounted(() => {
			swTwBanner = new Swiper("#swTwBanner", {
        // effect: "fade",
        // fadeEffect: {
        //   crossFade: true,
        // },
        effect: "slide",
        initialSlide: 0,
        speed: 550,
        slidesPerView: "auto",
        // loop: true,
        // observer: true,
        // autoplay: {
        //   enabled: true,
        //   delay: 5000,
        //   waitForTransition: true,
        //   disableOnInteraction: false,
        //   stopOnLastSlide: false,
        //   reverseDirection: false,
        //   pauseOnMouseEnter: false,
        // },
        // navigation: {
        //   nextEl: `#swTwBanner .slide-navi.right`,
        //   prevEl: `#swTwBanner .slide-navi.left`,
        // },
        // pagination: {
        //   el: ".swiper-pagination",
        //   clickable: true,
        //   // dynamicBullets: true,
        //   type: "bullets",
        // },
      });

      // swTwChart = new Swiper("#swTwChart", {
      //   effect: "slide",
      //   direction: "vertical",
      //   speed: 500,
      //   slidesPerView: 7,
      //   loop: true,
			// 	loopAdditionalSlides: 6,
      //   observer: true,
      //   autoplay: {
      //     enabled: true,
      //     delay: 1250,
      //     waitForTransition: true,
      //     disableOnInteraction: false,
      //     stopOnLastSlide: false,
      //     reverseDirection: false,
      //     pauseOnMouseEnter: false,
      //   },
			// 	on: {
			// 		reachEnd: function (x) {
      //       console.log(`reachEnd: `, x);
			// 			vipUserList.value = spawnUserList(makeNumber(35, 25));
      //     },
			// 	}
      // });

      setTimeout(() => {
        marqueeExec = $("#tw-marquee-text").marquee({
          speed: 25,
          gap: 250,
          delayBeforeStart: 1000,
          direction: "left",
          duplicated: true,
          pauseOnHover: true,
          startVisible: true,
        });
      }, 1000);

      dateCount.value = dateCountExec();

      headerTimer = setInterval(timeCountStart, 1000);

      getVipNum.value = numeral(vipNumber.value).format("0,0");

      setTimeout(() => {
        vipNumberCount = new countUp.CountUp("vipNumber", vipNumber.value, {
          startVal: vipNumber.value,
          decimalPlaces: 0,
          separator: ",",
          // prefix: "$",
        });

        vipNumberCountInterval = setRandomInterval(
          () => {
            if (vipNumber.value) {
              let plusNum = 0;

              setTimeout(() => {
                let randomNum = randomFloat(1, 99);

                plusNum = randomNum;

                vipNumber.value = retFloatNum(vipNumber.value, plusNum);

                if (vipNumberCount) {
                  vipNumberCount.update(vipNumber.value ? vipNumber.value : 0);
                }
              }, 500);
            }
          },
          5000,
          10000
        );
      }, 1000);

      winResizeCheck();

      $(window).on("resize", winResizeCheck);
    });

    onUnmounted(() => {
      if (headerTimer) {
        clearInterval(headerTimer);
      }

      if (vipNumberCountInterval) {
        vipNumberCountInterval.clear();
      }

      $(window).off("resize", winResizeCheck);
    });

    onUpdated(() => {
      if (swTwBanner) {
        swTwBanner.slideReset();
      }
    });

    return {
      props,
      store,
      winWidth,
      isWap,
      vipNumber,
      getVipNum,
      dateCount,
      dateCountExec,
      timeCount,
      timeCountExec,
      getUserName,
			vipUserList,
    };
  },
  template: `
	<div class="tw-content mx-1920">
		<div
			class="tw-banner-default"
			:style="{
				backgroundImage: 'url(images/pc/banner/bn-bg.png)'
			}"
		>
			<div class="solid-wrap">
				<div class="swiper" id="swTwBanner">
					<div class="swiper-wrapper">
						<div class="swiper-slide" v-for="(v, i) in store.twBannerList" :key="i">
							<img :src="'images/pc/banner/bn-main.png'" alt="" />
						</div>
					</div>
					<div class="swiper-pagination"></div>
				</div>
			</div>	
		</div>

		<!--
		<div
			class="tw-info-chart"
			:style="{
				backgroundImage: 'url(images/pc/banner/banner-chart-bg_pc.png)'
			}"
		>
			<div class="tw-ic-title">
				<h2>XẾP HẠNG THU NHẬP ĐẠI LÝ HÀNG NGÀY</h2>
			</div>
			<div class="tw-ic-wrap">
				<div class="swiper" id="swTwChart">
					<div class="swiper-wrapper">
						<div class="swiper-slide" v-for="(v, i) in vipUserList" :key="i">
							<div class="table-div">
									<span>
										Người dùng {{ v.user }}
									</span>
									<span>
										{{ v.jackpot }}
									</span>
									<span>
										VND
									</span>
									<span>
										đã phát tặng
									</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="tw-ic-subtitle">
				<p>kể từ
					<span class="time-play">{{ timeCount ? timeCount : timeCountExec() }}</span>
					<span>(UTC+7)</span>
					<span>{{ dateCount ? dateCount : dateCountExec() }}</span>
				</p>
				<p
					:style="{
						width: '90%'
					}"
				>
					<span>ĐÃ CÓ</span>
					<span id="vipNumber" class="vip-number">{{getVipNum}}</span>
					NGƯỜI DÙNG ĐÃ CHỌN TRỞ THÀNH ĐẠI LÝ ƯU TÚ CỦA TẬP ĐOÀN GIẢI TRÍ WIN23 HÀNG ĐẦU CHÂU Á
				</p>
			</div>
		</div>
		-->

		<div class="tw-content mx-w1200">
			<div class="tw-marquee-div">
				<div class="tw-md-l">
					<div class="m-icon">
						<img :src="'images/pc/icon/marquee-l.png'" alt="" />
					</div>
				</div>
				<div class="tw-md-c">
					<div class="marquee-text" id="tw-marquee-text">
						{{ store.marqueeText }} 
					</div>
				</div>
				<div class="tw-md-r">
					<div
						class="md-r-l"
						:style="{
							backgroundImage: 'url(images/pc/icon/marquee-btn-l.png)'
						}"
					></div>
					<div class="md-r-r">
						<div class="m-icon">
							<img :src="'images/pc/icon/marquee-r.png'" alt="" />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	`,
};
