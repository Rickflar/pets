import React, {Component} from 'react';
import { Panel, PanelHeaderButton, PanelHeader, ActionSheetItem, ActionSheet,
  Div, Link, Spinner, UsersStack, IS_PLATFORM_IOS, Group, HeaderButton, Separator, Button } from '@vkontakte/vkui';

import connect from '@vkontakte/vk-connect';

import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';

import ComList from '../components/ComList';

import { shortNumber } from '../js/helpers';

import '@vkontakte/vkui/dist/vkui.css';
import './Home.css';

class Meet extends Component {
    constructor(props) {
        super(props);

        this.state = {
            meet: this.props.state.meet,
            disabled: false,
            snackbar: null,
            flood: false
        };

        this.api = this.props.api;
    }

    componentDidMount() {
      const { setParentState } = this.props;
      this.api.GetMeetComments(this.props.state.meet.id).then(comments => setParentState({ comments }))
    }

    render() {
        const { id, onStoryChange, openDoneSnackbar, setParentState, activeStory} = this.props;
        const { meet, disabled } = this.state;
        var meetMembers = shortNumber(meet.members_amount)
        const start_date = meet.start.split('-').reverse().join('-')
        const backgroundImage = `url(${meet.photo})`;
        var link = meet.ownerid > 0 ? `https://vk.com/id${meet.ownerid}` : `https://vk.com/club${-meet.ownerid}`

        const sub = e => {
          connect.unsubscribe(sub)
          switch (e.detail.type) {
            case 'VKWebAppGeodataResult':
          if(!this.state.flood){
            if(!e.detail.data.available) {
              console.log(e.detail.data.available)
              this.props.openErrorSnackbar('Доступ к геолокации не был получен.');
              this.setState({ disabled: false });
              return
            }
                this.api.POSTGeoPosition({
                  lat: e.detail.data.lat,
                  long: e.detail.data.long
                }).then(res => {
                  this.api.GetGeoPosition({
                    meet: this.props.state.meet.id
                  }).then(res => {
                    this.setState({ flood: true })
                    setTimeout(() => this.setState({ flood: false }), 2000)
                    if(res.failed){
                      this.setState({ disabled: false });
                      this.props.openErrorSnackbar(res.failed);
                    } else if(res.status) {
                      openDoneSnackbar(res.status);
                      this.setState({ disabled: false });
                    }
                  })

                })
          } else {
            this.setState({ disabled: false });
            this.props.openErrorSnackbar('Не так часто');
          }
              break;
              case 'VKWebAppGeodataFailed':
                    this.props.openErrorSnackbar('Доступ к геолокации запрещён.');
                   this.setState({ disabled: false });
                break;
            default:
              // code
          }
        }

        const paticipate = e => {
          this.setState({ disabled: true })
          this.api.AddMeetMember({
            meet: meet.id
          }).then( e => onStoryChange(activeStory, 'meets') )
        }
        const removeMeetMember = e => {
        this.setState({ disabled: true })
        this.api.RemoveMeetMember({
            meet: meet.id
          }).then( e => onStoryChange(activeStory, 'meets') )
        }
        const menu = e => {
          setParentState({
              popout:
              <ActionSheet onClose={() => setParentState({ popout: null })}>
                <ActionSheetItem onClick={ share } autoclose>
                  Поделиться на стене
                </ActionSheetItem>
                <ActionSheetItem onClick={ () => this.props.makeStory(meet.id) } autoclose>
                  Поделиться в истории
                </ActionSheetItem>
                {IS_PLATFORM_IOS && <ActionSheetItem autoclose theme="cancel">Отменить</ActionSheetItem>}
              </ActionSheet>,
          });
          }
        const share = e => {
          connect.send("VKWebAppShowWallPostBox", {"message": `${meet.name}\n\n${meet.description}\n\n Примите участие в петиции по ссылке: https://vk.com/app7217332#${meet.id}`});
        }
        return (
            <Panel id={id}>
                <PanelHeader left={
                  <PanelHeaderButton onClick={() => onStoryChange(activeStory, 'meets')}>
			               {IS_PLATFORM_IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
		               </PanelHeaderButton>}>Петиция</PanelHeader>

                   <Div onClick={() => connect.send("VKWebAppShowImages", { images: [ meet.photo ] })} className="MeetImg" style={{ backgroundImage }} >
                       <Div style={{ marginTop: '20%' }} className="MeetName">{ meet.name }</Div>
                       <Div style={{ marginTop: '20%' }} className="MeetName">{ start_date }</Div>
                   </Div>
                <Group>
                  { meet.owner_name && <>
                    <Separator style={{ margin: '12px 0' }} />
                      <Link id='link' target="_blank" href={link}>
                        <UsersStack  photos={[ meet.owner_photo ]}>{meet.owner_name} {meet.owner_surname} • {meetMembers}</UsersStack>
                      </Link>
                      </>
                  }
                    <Separator style={{ margin: '12px 0' }} />
                    <Div id='desk'>{meet.description}</Div>

                  {
                    ( !meet.isexpired && meet.approved ) &&
                    <>
                    <Div style={{ display: 'flex' }}>
                        {
                          !meet.ismember ?
                          <Button size="l" disabled={disabled} stretched style={{ marginRight: 8 }}
                          onClick={ () => paticipate() }>{disabled ? <Spinner size='small'/> : 'Участвовать'}</Button>
                          : <Button size="l" disabled={disabled} stretched style={{ marginRight: 8 }}
                          onClick={ () => removeMeetMember() }>{disabled ? <Spinner size='small'/> : 'Отказаться от участия'} </Button>
                        }
                        <Button size="l" stretched level='secondary' style={{ marginRight: 8 }}
                        onClick={ menu }>Поделиться</Button>
                    </Div>
                    {
                      meet.ismember  &&
                    <Div>
                    <Button
                      level='secondary'
                      size="l"
                      disabled={disabled}
                      stretched
                      style={{ marginRight: 8 }}
                      onClick={ () => {
                              connect.subscribe(sub);
                              connect.send("VKWebAppGetGeodata", {});
                              this.setState({ disabled: true })}
                            }>
                    {disabled ? <Spinner size='small'/> : 'Найти единомышленников рядом'}
                    </Button>
                    </Div>
                  }
                  <Separator style={{ margin: '12px 0' }} />
                  <Div id='desk'>Комментарии:</Div>
                    </>
                  }
                </Group>
              { /*!meet.isexpired &&*/ meet.approved &&  <ComList isExpired={meet.isexpired} {...this.props}/>}
                  {this.props.state.snackbar}
            </Panel>
        );
    }
}

export default Meet;
