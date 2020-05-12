import React, {Component} from 'react';
import {
    Panel,
    PanelHeader,
    FormLayout,
    FormStatus,
    Textarea,
    Input,
    Link,
    Spinner,
    Group,
    Header,
    Radio,
    File,
    Checkbox,
    Button
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import './Home.css';
import bridge from '@vkontakte/vk-bridge';
import MeetBox from '../components/MeetBox/MeetBox';
import {getMessage} from '../js/helpers';
import Icon28CameraOutline from '@vkontakte/icons/dist/28/camera_outline';

class AddMeetPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: false,
            token: false,
            error: false,
            message: false
        }
        this.onChange = this.onChange.bind(this);
        this.AddMeet = this.AddMeet.bind(this);
    };

    AddMeet = async () => {
        const {api, setParentState, openDoneSnackbar, openErrorSnackbar, state} = this.props;
        setParentState({disabled: true});
        const {success, failed} = await api.AddMeet({
            isGroup: state.groupSelected,
            name: state.name,
            start: state.start,
            finish: state.finish,
            description: state.description,
            photo: state.photo
        });
        if (success) {
            const mes = `Ваша петиция "${state.name}>" отправлена на модерацию.`;
            if (state.noty) {
                fetch('https://cors-anywhere.herokuapp.com/https://groovy-apricot.glitch.me/', {method: 'GET'})
                    .then(res => bridge.send("VKWebAppSendPayload", {"group_id": 189366357, "payload": {"mes": mes}}));
            }
            setParentState({
                activePanel: 'meets',
                activeStory: 'home',
                symbols_name: '',
                symbols_description: '',
                name: '',
                description: '',
                photo: false,
                accept: false
            });
            openDoneSnackbar(success);
        } else if (failed) {
            openErrorSnackbar(failed)
        } else {
            openErrorSnackbar('Создавать петиции можно не чаще четырёх раз в день')
        }
        setTimeout(() => setParentState({
            popout: null
        }), 3000)  // понял, что всё таки нужно
    }

    onChange = async (e) => {
        const {name, value} = e.currentTarget;
        if (name === 'file') {
            const file = document.getElementById('file').files[0];
            if (!file) {
                this.setState({error: true})
                this.setState({message: 'Файл не был выбран'})
                return
            }
            if (!(file.type.match('image/*'))) {
                this.setState({error: true})
                this.setState({message: 'Формат выбранного файла не поддерживается.'})
                return
            }
            if (file.size > 16777216) {
                this.setState({error: true})
                this.setState({message: 'Размер выбранного файла слишком большой.'})
                return
            }

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => save(e);

            const save = e => {
                if (!e.target.result) return;
                console.log(e.target.result);
                this.props.setParentState({
                    photo: e.target.result
                });
                this.setState({
                    error: false,
                    message: 'Обложка загружена.',
                    disabled: false
                });
            }
        } else {
            this.props.setParentState({[name]: value});
            if (name === 'name') this.props.setParentState({symbols_name: `${value.length}/60`})
            if (name === 'description') this.props.setParentState({symbols_description: `${value.length}/254`})
        }
    };

    checkIfAllOk(name, desc, start, end, photo, approve) {
        if ((name === undefined || name === '')
            || (desc === undefined || desc === '')
            || (start === undefined || start === '' || !start)
            || ((Date.parse(start) < Date.parse(new Date())) && (new Date(start).getDay() < new Date().getDay()))
            || (end === undefined || end === '' || !end)
            || ((Date.parse(end) < Date.parse(new Date())) && (new Date(end).getDay() < new Date().getDay()))
            || Date.parse(start) > Date.parse(end)
            || !photo || !approve
        ) {
            return false
        } else {
            return true
        }
    }

    render() {
        const onChange = this.onChange;
        const {id, state, setParentState} = this.props;
        const {name, start, snackbar, finish, description, symbols_name, symbols_description, photo, accept} = state;
        const formLang = getMessage('forms');
        const meet = {
            name: name || 'Сырки дорогие!',
            photo: photo || 'https://img.tyt.by/n/03/8/glazirovannyy_syrok_1.jpg',
            owner_name: state.fetchedUser.first_name,
            owner_surname: state.fetchedUser.last_name,
            members_amount: 10,
            ismember: true
        }
        return (
            <Panel id={id}>
                <PanelHeader>{getMessage('add_meet_page')}</PanelHeader>
                <Group header={<Header mode="secondary">Предпросмотр</Header>}>
                    <MeetBox
                        meet={meet}
                        setParentState={null}
                        style={{marginLeft: 12, marginRight: 12}}
                    />
                </Group>
                <Group header={<Header mode="secondary">Информация о петиции</Header>}>
                    <FormLayout>
                        {state.isCurrentGroupAdmin && state.currentGroupInfo &&
                        <Group title='Автор'>
                            <Radio
                                name="radio"
                                value="user"
                                onChange={(e) => setParentState({
                                    groupSelected: false
                                })}
                                checked={!state.groupSelected}
                            >{state.fetchedUser.first_name} {state.fetchedUser.last_name}
                            </Radio>
                            <Radio
                                name="radio"
                                value="group"
                                checked={state.groupSelected}
                                onChange={(e) => setParentState({
                                    groupSelected: e.currentTarget.checked
                                })}
                                description="Петиция будет опубликована от имени этого сообщества">
                                {state.currentGroupInfo.name}
                            </Radio>
                        </Group>
                        }
                        <Input
                            type="text"
                            top={<div style={{marginTop: -12}}>Название {symbols_name}</div>}
                            name="name"
                            maxLength='60'
                            value={name}
                            placeholder={'Сырки дорогие!'}
                            onChange={onChange}
                            status={name === undefined || name === '' ? 'error' : 'valid'}
                            bottom={name === undefined || name === '' ? 'Пожалуйста, укажите название петиции' : ''}
                        />
                        <Textarea
                            top={<div style={{marginTop: -12}}>Описание {symbols_description}</div>}
                            maxLength='254'
                            name="description"
                            placeholder="Требуем понизить цену на сырки"
                            value={description}
                            onChange={onChange}
                            status={description === undefined || description === '' ? 'error' : 'valid'}
                            bottom={description === undefined || description === '' ? 'Пожалуйста, укажите описание петиции' : ''}
                        />
                        <Input
                            type="date"
                            top={<div style={{marginTop: -12}}>{formLang.start}</div>}
                            name="start"
                            value={start}
                            onChange={onChange}
                            status={start === undefined || start === '' || !start ? 'error' : (Date.parse(start) < Date.parse(new Date())) && (new Date(start).getDay() < new Date().getDay()) ? 'error' : 'valid'}
                            bottom={start === undefined || start === '' || !start ? 'Пожалуйста, укажите дату начала петиции' : (Date.parse(start) < Date.parse(new Date())) && (new Date(start).getDay() < new Date().getDay()) ? 'Дата начала петиции уже прошла' : ''}
                        />
                        <Input
                            type="date"
                            top={<div style={{marginTop: -12}}>{formLang.finish}</div>}
                            name="finish"
                            value={finish}
                            onChange={onChange}
                            status={finish === undefined || finish === '' || !finish ? 'error' : (Date.parse(finish) < Date.parse(new Date())) && (new Date(finish).getDay() < new Date().getDay()) ? 'error' : Date.parse(start) > Date.parse(finish) ? 'error' : 'valid'}
                            bottom={finish === undefined || finish === '' || !finish ? 'Пожалуйста, укажите дату окончания петиции' : (Date.parse(finish) < Date.parse(new Date())) && (new Date(finish).getDay() < new Date().getDay()) ? 'Дата окончания петиции уже прошла' : Date.parse(start) > Date.parse(finish) ? 'Дата окончания петиции раньше даты начала' : ''}
                        />
                        <File
                            id='file'
                            maxfiles={1}
                            acceptfiletypes={['image/png', 'image/jpg', 'image/jpeg', '.png']}
                            minfilesize={0}
                            top={<div style={{marginTop: -12}}>{formLang.photo}</div>}
                            type="file"
                            before={<Icon28CameraOutline width={24} height={24}/>}
                            size="l"
                            mode="outline"
                            name="file"
                            onChange={onChange}
                            status={!photo ? 'error' : 'valid'}
                            bottom={!photo ? 'Пожалуйста, загрузите обложку петиции' : ''}
                        />
                        {this.state.error &&
                        <div style={{marginTop: -12}}>
                            <FormStatus header="Ошибка при загрузке обложки" mode="error">
                                {this.state.message}
                            </FormStatus>
                        </div>
                        }
                        {photo && !this.state.error &&
                        <div style={{marginTop: -12}}>
                            <FormStatus header="Обложка успешно загружена" mode="default">
                                Теперь, ее можно увидеть в предпросмотре
                            </FormStatus>
                        </div>
                        }
                        <Checkbox style={{marginTop: -12}} checked={state.accept}
                                  onChange={(e) => this.props.setParentState({accept: e.currentTarget.checked})}
                                  status={!accept ? 'error' : 'valid'}
                                  bottom={!accept ? 'Пожалуйста, примите пользовательское соглашение' : ''}
                        >Согласен с
                            <Link target="_blank"
                                  href="https://vk.com/@virtualmeetingsclub-pravila-razmescheniya"> правилами</Link></Checkbox>
                        <Checkbox style={{marginTop: -24}} disabled={state.noty} checked={state.noty} onChange={(e) => {
                            if (e.currentTarget.checked) {
                                console.log('отправили!')
                                bridge.send("VKWebAppAllowMessagesFromGroup", {"group_id": 189366357});
                            }
                        }}>
                            Уведомить о результате модерации
                        </Checkbox>
                        <Button mode="outline" size="xl"
                                disabled={!this.checkIfAllOk(name, description, start, finish, photo, accept)}
                                style={{marginTop: -12}} onClick={() => {
                            this.AddMeet();
                        }}>
                            {this.state.disabled ? <Spinner/> : formLang.add}
                        </Button>
                    </FormLayout>
                </Group>
                {snackbar}
            </Panel>
        );
    }
}

export default AddMeetPage;