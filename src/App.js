import React from 'react';
import connect from '@vkontakte/vk-bridge';
import { View, Epic, Tabbar, ConfigProvider, Snackbar, TabbarItem } from '@vkontakte/vkui';

import '@vkontakte/vkui/dist/vkui.css';
import './css/App.css';

import API from './js/api';
import { checkVersionAndroid, showAlert } from './js/helpers';

import Icon28CompassOutline from '@vkontakte/icons/dist/28/compass_outline';
import Icon28AddCircleOutline from '@vkontakte/icons/dist/28/add_circle_outline';
import Icon28UserCircleOutline from '@vkontakte/icons/dist/28/user_circle_outline';
import Icon28KeyOutline from '@vkontakte/icons/dist/28/key_outline';
import Icon28CancelCircleOutline from '@vkontakte/icons/dist/28/cancel_circle_outline';
import Icon28CheckCircleOutline from '@vkontakte/icons/dist/28/check_circle_outline';
import Home from './panels/Home';
import Favorite from './panels/Favorite';

import Meet from './panels/Meet';
import MeetAdmin from './panels/MeetAdmin';

import AdminPage from './panels/AdminPage';
import AddMeetPage from './panels/AddMeetPage';

import Offline from './panels/Offline';

import Onboarding from './panels/Onboarding';
import Onboarding2 from './panels/Onboarding2';
import Onboarding3 from './panels/Onboarding3';

import AddGroupSuccess from './panels/AddGroupSuccess';

import CommIntegration from './panels/CommIntegration';

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			activeStory: 'home', /// home
			activePanel: 'meets', // meets
			activeTab: 'all',
			snackbar: null,
			fetchedUser: {
				id: null
			},
			cache: null,
			popout: null,
			offline: false,
			meets: false,
			symbols_name: '',
			symbols_description: '',
			accept: false,
			name: '',
			start: '0000-00-00', //
			finish: '0000-00-00', // 0000-00-00
			start_time: '00:00:00',
			finish_time: '00:00:00',
			description: '',
			photo: '',
			meet: '',
			noty: false,
			comments: false,
			/*		currentMeetId: false,*/
			userMeets: false,
			allMeets: false,
			isCurrentGroupAdmin: false,
			currentGroupInfo: false,
			groupSelected: false,
			changedRadio: false,
			scheme: false ? 'space_gray' : 'bright_light',

			attemp: 0
		};

		this.initApp();

		this.onStoryChange = this.onStoryChange.bind(this);
	}

	initApp = () => {

		window.showOfflinePage = (e) => {
			this.setState({ offline: e });
		};

		window.showAlert = (message, title, actions) => {
			showAlert(this.setState.bind(this), message, title, actions);
		};

		window.showLoader = (show) => {
		//	this.setState({ popout: show ? <ScreenSpinner /> : null });
		};

		checkVersionAndroid();

		this.api = new API();
		this.checkRoute();
	};

	componentDidMount() {
		connect.subscribe(this.sub);
		connect.send('VKWebAppGetUserInfo', {});
		connect.send("VKWebAppSetViewSettings", { "status_bar_style": "light", "action_bar_color": "#0080b4" });
		setInterval(() => this.checkOnline(), 3000);
		this.getMeets();
	}
	sub = e => {
		switch (e.detail.type) {
			case 'VKWebAppUpdateConfig':
				const schemeAttribute = document.createAttribute('scheme');
				let schemeK = e.detail.data.scheme;
				switch (schemeK) {
					case 'bright_light':
						schemeK = 'bright_light';
						connect.send("VKWebAppSetViewSettings", { "status_bar_style": "dark", "action_bar_color": "#fff" });
						break;
					case 'client_light':
						schemeK = 'bright_light';
						connect.send("VKWebAppSetViewSettings", { "status_bar_style": "dark", "action_bar_color": "#fff" });
						break;
					case 'client_dark':
						schemeK = 'space_gray'
						connect.send("VKWebAppSetViewSettings", { "status_bar_style": "light", "action_bar_color": "#19191a" });
						break;
					case 'space_gray':
						schemeK = 'space_gray'
						connect.send("VKWebAppSetViewSettings", { "status_bar_style": "light", "action_bar_color": "#19191a" });
						break;
					default:
						schemeK = e.detail.data.scheme;
				}
				schemeAttribute.value = schemeK;
				this.setState({ scheme: schemeK });
				document.body.attributes.setNamedItem(schemeAttribute);
				break;
			case 'VKWebAppGetUserInfoResult':
				this.setState({ fetchedUser: e.detail.data });
				let user = this.state.fetchedUser
				this.addUser(user)
				break;
			case 'VKWebAppAllowMessagesFromGroupResult':
				this.setState({ noty: e.detail.data.result });
				break;
			case 'VKWebAppAddToCommunityResult':
				this.setState({
					activePanel: 'succ'
				});
				break;
			case 'VKWebAppAccessTokenReceived':
				if (e.detail.data.scope === '') this.openErrorSnackbar('Действие отменено пользователем.')
				break;
			case 'VKWebAppAccessTokenFailed':
				this.openErrorSnackbar('Действие отменено пользователем.')
				break;
			default:
			// code
		}
	};
	// TODO: Нужен history для навигации назад с других экранов и системной кнопки назад на ведре
	onStoryChange = (story, panel) => {
		//	connect.unsubscribe(this.sub);
		let userId = this.state.fetchedUser.id
		this.setState({
			activeStory: story,
			activePanel: panel,
			comments: false,
			// snackbar: null
		});
		if (story !== 'home') this.setState({ snackbar: null });
		if (story === 'home') this.getMeets(this.state.fetchedUser.id);
		if (story === 'favorites') {
			let activeTab = this.state.activeTab
			if (activeTab === 'all') {
				this.getUserMeets(userId);
			} else if (activeTab === 'my') {
				this.getOwneredMeets(userId);
			} else if (activeTab === 'exp') {
				this.getExpiredUserMeets(userId);
			}
		}
		if (story === 'admin') this.getAllMeets(this.state.fetchedUser.id);
		if (panel !== 'meet' || panel !== 'succ' || panel !== 'comm') connect.send('VKWebAppDisableSwipeBack');
	}

	checkRoute = async e => {
		let route = window.location.hash.replace('#', '');
		if (route > 0) {
			const meet = await this.api.GetMeet(route);
			if (meet[0]) {
				this.setState({
					meet: meet[0],
					activePanel: 'meet'
				});
			} else return
		} else return
	}
	checkOnline = e => {
		if (window.navigator.onLine) {
			window.showOfflinePage(false);
		} else window.showOfflinePage(true);
	};
	makeStory = async (id) => {
		const textToImage = require('text-to-image');
		let meet = await this.api.GetMeet(id);
		let image = 'data:image/png;base64,' + meet.photo;
		let url = `https://vk.com/app7217332#${id}`
		textToImage.generate(meet.name).then(dataUri => {
			connect.send("VKWebAppShowStoryBox", {
				"background_type": "image", "locked": false, "blob": image, "attachment": {
					"text": "go_to",
					"type": "url",
					"url": url
				},
				"stickers": [
					{
						"sticker_type": "renderable",
						"sticker": {
							"content_type": "image",
							"blob": dataUri,
							"transform": {
								"relation_width": 0.55,
								"gravity": "center_bottom",
								"translation_y": -0.25
							}
						}
					}
				]

			}).then(res => {
				console.log(res)
			}).catch(err => {
				console.error(err)
			});
		});

	}

	openDoneSnackbar = e => {
		this.setState({
			snackbar: <Snackbar
				duration={2000}
				layout="vertical"
				onClose={() => this.setState({ snackbar: null })}
				before={<Icon28CheckCircleOutline width={24} height={24} fill={'var(--accent)'}/>}
			>
				{e}
			</Snackbar>
		});
	}
	openErrorSnackbar = e => {
		this.setState({
			snackbar:
				<Snackbar
					duration={2000}
					layout="vertical"
					onClose={() => this.setState({ snackbar: null })}
					before={<Icon28CancelCircleOutline width={24} height={24} fill={'var(--destructive)'}/>}
				>
					{e}
				</Snackbar>
		});
	}

	getMeets = async () => { // доступные митинги
		if (!this.state.meets) window.showLoader(true);
		this.setState({ meets: false });
		const meets = await this.api.GetMeets();
		this.setState({ meets });
		window.showLoader(false);
	}
	getExpiredUserMeets = async () => {
		this.setState({ userMeets: false });
		window.showLoader(true);
		const userMeets = await this.api.GetExpiredUserMeets(this.state.fetchedUser.id);
		this.setState({ userMeets });
		window.showLoader(false);
	}
	getOwneredMeets = async () => {
		this.setState({ userMeets: false });
		window.showLoader(true);
		const userMeets = await this.api.GetOwneredMeets(this.state.fetchedUser.id);
		this.setState({ userMeets });
		window.showLoader(false);
	}
	getUserMeets = async () => { // митинги, в которых учавствует юзер
		if (!this.state.userMeets) window.showLoader(true);
		this.setState({ userMeets: false });
		const userMeets = await this.api.GetUserMeets(this.state.fetchedUser.id);
		this.setState({ userMeets });
		window.showLoader(false);
	}
	getAllMeets = async () => { // админка
		if (!this.state.allMeets) window.showLoader(true);
		const allMeets = await this.api.GetAllMeets(this.state.fetchedUser.id);
		this.setState({ allMeets });
		window.showLoader(false);
	}
	getComments = async (meet) => {
		const comments = await this.api.GetComments();
		this.setState({ comments });
	}
	addUser = async (user) => { // добавить данные юзера в базу
		const isFirst = await this.api.IsFirst();
		const clubInfo = await this.api.GetGroupInfo();
		if (clubInfo.name) {
			this.setState({
				isCurrentGroupAdmin: true,
				currentGroupInfo: clubInfo
			});
		}
		if (isFirst) { // показываем онбординг, если юзер зашёл первый раз
			this.onStoryChange('onboarding', 'onboarding');} 
	}
	render() {
		const { api, state, onStoryChange, getMeets, makeStory, getComments,
			getUserMeets, openErrorSnackbar, openDoneSnackbar, getOwneredMeets, getExpiredUserMeets } = this;

		const { offline, popout, activeStory, meets, userMeets, allMeets,
			activePanel, fetchedUser, comments } = this.state;

		const isUserAdmin = (
			this.state.fetchedUser.id === 35501089 ||
			this.state.fetchedUser.id === 114752686 ||
			this.state.fetchedUser.id === 87478742
		);

		const props = {
			getOwneredMeets, getExpiredUserMeets, openDoneSnackbar,
			openErrorSnackbar, api, isUserAdmin, getUserMeets, state, activeStory,
			makeStory, getComments, getMeets, meets, userMeets,
			allMeets, onStoryChange, fetchedUser,
			comments, setParentState: this.setState.bind(this)
		};

		//const history =  ? ['meets', 'meet'] : ['meets'];

		const history = () => {
			let response;
			switch (activePanel) {
				case 'meet':
					response = ['meets', 'meet'];
					break;
				case 'succ':
					response = ['meets', 'succ'];
					break;
				case 'comm':
					response = ['meets', 'comm'];
					break;
				case 'meetAdmin':
					response = ['meets', 'meetAdmin'];
					break;
				default:
					response = ['meets'];
			}
			return response;
		}
		/*	const history =
				activePanel === 'meet' ||
				activePanel === 'comm' || ДОРАБОТАТЬ ПЕРЕРАБОТАТЬ В КОРНЕ
				activePanel === 'succ' ? [activePanel, 'panel'] : [activePanel];*/

		const onSwipeBack = e => {
			this.setState({ activePanel: 'meets' });
		}

		const views = { onSwipeBack, popout, activePanel };

		const scheme = this.state.scheme;
		const className = scheme === 'bright_light' ? 'white' : 'dark';
		return (
			<ConfigProvider scheme={scheme} isWebView>
				{
					offline ?
						<View id="offline" popout={popout} activePanel="offline">
							<Offline id="offline" {...props} />
						</View>
						:
						<Epic activeStory={activeStory} tabbar={
							(
								activeStory !== 'onboarding' &&
								activePanel !== 'meet' &&
								activePanel !== 'comm' &&
								activePanel !== 'succ'
							)
							&& <Tabbar>
								<TabbarItem
									onClick={() => this.onStoryChange('home', 'meets')}
									selected={activeStory === 'home'}
								><Icon28CompassOutline /></TabbarItem>
								<TabbarItem
									onClick={() => this.onStoryChange('addMeet', 'addMeetPage')}
									selected={activeStory === 'addMeet'}
								><Icon28AddCircleOutline /></TabbarItem>
								{isUserAdmin && <TabbarItem
									onClick={() => this.onStoryChange('admin', 'meets')}
									selected={activeStory === 'admin'}
								><Icon28KeyOutline /></TabbarItem>}
								<TabbarItem
									onClick={() => this.onStoryChange('favorites', 'meets')}
									selected={activeStory === 'favorites'}
								><Icon28UserCircleOutline /></TabbarItem>
							</Tabbar>
						}>
							<View className={className} id="home" history={history()} {...views} >
								<Home id="meets" {...props} />
								<CommIntegration id="comm" {...props} />
								<AddGroupSuccess id='succ' {...props} />
								<Meet id="meet" {...props} />
							</View>
							<View id="addMeet" {...views} >
								<AddMeetPage id="addMeetPage" {...props} />
							</View>
							<View className={className} id="admin" history={history()}  {...views} >
								<AdminPage id="meets" {...props} />
								<MeetAdmin id='meetAdmin' {...props} />
							</View>
							<View className={className} id="favorites" history={history()}  {...views} >
								<Favorite id="meets" {...props} />
								<Meet id="meet" {...props} />
							</View>
							<View className={className} id="onboarding" activePanel={activePanel} >
								<Onboarding id="onboarding" {...props} />
								<Onboarding2 id="onboarding2" {...props} />
								<Onboarding3 id="onboarding3" {...props} />
							</View>
						</Epic>
				}
			</ConfigProvider>
		);
	}
}

export default App;
