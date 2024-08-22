const homeComponent = {
  name: `homeComponent`,
  props: {
    dataProps: {
      type: Object,
      default: null,
    },
  },
  setup(props) {
    const store = selectStore();

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

    const homeResizeCheck = () => {
      if (window.innerWidth !== winWidth.value) {
        winWidth.value = window.innerWidth;
      }
    };

    const makeRandomNum = function (min, max) {
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

    const spawnServerList = function (len = 5) {
      let _Arr = [].concat(...Array(len).fill({}));

      _Arr = _Arr.map((v, i) => {
        let idx = i + 1;
        return {
          name: "trang " + idx,
          urlName: store.serverList[i]
            ? store.serverList[i].name
            : store.serverList[0].name,
          url: store.serverList[i]
            ? store.serverList[i].link
            : store.serverList[0].link,
          speed: makeComma(makeNumber(70, 150)),
        };
      });

      _Arr = _Arr.sort((a, b) => {
        return b.speed - a.speed;
      });

      _Arr = _Arr.splice(0, 5);

      return _Arr;
    };

    const serverListTemp = ref(null);

    const serverList = computed({
      get() {
        return serverListTemp.value;
      },
      set(val) {
        serverListTemp.value = val;
      },
    });

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

    const fetchTypeArr = ["ready", "success", "fetching", "error"];

    const fetchTypeTemp = ref(null);

    const fetchType = computed({
      get() {
        return fetchTypeTemp.value;
      },
      set(val) {
        fetchTypeTemp.value = val;
      },
    });

    let serverInterval = null;

    fetchType.value = fetchTypeArr[0];
	serverList.value = spawnServerList(store.serverList && store.serverList.length ? store.serverList.length : 10);

    onMounted(() => {
      homeResizeCheck(null, true);

      $(window).on("resize", homeResizeCheck);

      // setTimeout(() => {
      //   fetchType.value = fetchTypeArr[2];
      //   setTimeout(() => {
      //     serverList.value = spawnServerList(makeNumber(3, 10));
      //   }, 1000);
      // }, 1000);

      // serverInterval = setRandomInterval(
      //   () => {
      //     serverList.value = null;
      //     fetchType.value = fetchTypeArr[2];

      //     setTimeout(() => {
      //       serverList.value = spawnServerList(makeNumber(3, 10));
      //     }, 2500);
      //   },
      //   10000,
      //   30000
      // );
    });

    onUnmounted(() => {
      $(window).off("resize", homeResizeCheck);

      if (serverInterval) {
        serverInterval.clear();
      }
    });

    watch(
      () => serverList.value,
      (val) => {
        if (val) {
          fetchType.value = fetchTypeArr[1];
        }
      },
      {
        immediate: true,
        deep: true,
      }
    );

    return {
      props,
      store,
      winWidth,
      isWap,
      serverList,
      fetchType,
      homeResizeCheck,
    };
  },
  template: `
	<div class="tw-content mx-w1080 mp-head">
		
		<img class="main-img" :src="'images/banner/bg-main_wap.png'" alt="" />

		<div class="tw-web-box mp-img-top slide-in-left-x">
			<div class="wb-content" v-if="fetchType === 'success'">
				<div class="wbc-item" v-for="(v, i) in serverList" :key="i">
					<div class="wbc-wrap">
						<div class="wbc-speed">
							<div class="wbc-status">
								<div class="s-circle"></div>
							</div>
							{{v.speed}}ms
						</div>
						<div class="wbc-server">
							<img :src="'images/pages/sec-speed-logo.png'" alt="" />
							<p>
								{{v.name}}
							</p>
						</div>
						<div class="wbc-short-url">
							{{v.urlName}}
						</div>
						<button
							class="wbc-btn"
							:title="v.url"
							@click="store.openWindow(v.url, true)"
						>
							Đi vào
						</button>
					</div>
				</div>
			</div>

			<div class="wb-content align-c" v-else-if="fetchType === 'ready'">
				<div class="wbc-item dialog-div green">
					<div class="wbc-wrap">
						<div class="wbc-status">
							<div class="s-circle"></div>
						</div>
						<div class="wbc-speed">0ms</div>
						<div class="wbc-server">
							<div class="server-name">
								Ready to Connect
							</div>
						</div>
					</div>
				</div>				
			</div>

			<div class="wb-content align-c" v-else-if="fetchType === 'fetching'">
				<div class="wbc-div">
					<q-spinner
						color="themeColor1"
						size="8vmin"
					/>
					<p>Reloading ...</p>
				</div>
			</div>

			<div class="wb-content align-c" v-else-if="fetchType === 'error'">
				<div class="wbc-item dialog-div red">
					<div class="wbc-wrap">
						<div class="wbc-status">
							<div class="s-circle"></div>
						</div>
						<div class="wbc-speed">0ms</div>
						<div class="wbc-server">
							<div class="server-name">
								Server Error
							</div>
						</div>
					</div>
				</div>				
			</div>

			<div class="wb-content align-c" v-else>
				<div class="wbc-item dialog-div red">
					<div class="wbc-wrap">
						<div class="wbc-status">
							<div class="s-circle"></div>
						</div>
						<div class="wbc-speed">0ms</div>
						<div class="wbc-server">
							<div class="server-name">
								No Server Connection
							</div>
						</div>
					</div>
				</div>				
			</div>

		</div>

		<div class="tw-info-box">

			<div class="ib-div"
				v-for="(v, i) in store.infoList"
				:key="i"
				:class="{
					[v.link ? v.link : null]: v.link ? v.link : false
				}"
			>
				<div class="ib-bg">
					<div class="ib-b l"></div>
					<div class="ib-b c"></div>
					<div class="ib-b r"></div>
					<h2
						class="ib-t"
						:class="{
							[v.link]: v.link
						}"
					>
						{{v.h2 ? v.h2 : 'Title'}}
					</h2>
				</div>

				<div class="ib-content" v-if="v.link !== 'links'">
					<div class="ib-img">
						<img :src="'images/pages/menuBg'+(store.toDecimal(++i))+'.png'" alt="" />
					</div>
					<div class="ib-right">
						<div class="ib-text">
							<h3>{{v.h3 ? v.h3 : 'Sub Title'}}</h3>
							<p>{{v.p ? v.p : 'Details'}}</p>
						</div>
						<button class="ib-btn" @click="store.openWindow(v.btnUrl ? v.btnUrl : '', true)">
							{{v.btnName ? v.btnName : 'Button'}}
						</button>
					</div>
				</div>

				<div class="ib-content" v-else>
					<div class="ib-right links">
						<div class="ib-link-wrap" v-if="v.linksWap && v.linksWap.length">
							<div
								class="ib-link"
								v-for="(w, j) in v.linksWap"
								:key="j"
								@click="store.openWindow(w.url ? w.url : '', true)"
							>
								<div
									class="link-icon"
									:class="{
										'service': w.link === 'service'
									}"
								>
									<img :src="'images/icon/intro-'+w.link+'.png'" alt="" />
								</div>
								<div class="link-name">
									<p class="p1">{{w.name ? w.name : 'link'}}</p>
									<p class="p2">{{w.p ? w.p : 'link'}}</p>
								</div>
							</div>
						</div>
					</div>
				</div>

			</div>

		</div>
	
	</div>
	`,
};
