import React, {Component} from 'react';
import { Panel, PanelHeader, Div, UsersStack, Spinner, IS_PLATFORM_IOS, Group, Link, PanelHeaderButton, Separator, Button } from '@vkontakte/vkui';

import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import { shortNumber } from '../js/helpers';
// import Icon24Users from '@vkontakte/icons/dist/24/users';
// import Icon24ShareOutline from '@vkontakte/icons/dist/24/share_outline';
// import Icon24BrowserBack from '@vkontakte/icons/dist/24/browser_back';
// import Icon24Done from '@vkontakte/icons/dist/24/done';
// import Icon24Story from '@vkontakte/icons/dist/24/story';

// import Icon20PlaceOutline from '@vkontakte/icons/dist/20/place_outline';
// import Icon20CalendarOutline from '@vkontakte/icons/dist/20/calendar_outline';
import connect from '@vkontakte/vk-connect';

import '@vkontakte/vkui/dist/vkui.css';
import './Home.css';

class MeetAdmin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            meet: this.props.state.meet,
            disabled: false
        };

        this.api = this.props.api;
    }

    componentDidMount() {}

    render() {
        const { id, onStoryChange, fetchedUser } = this.props;
        const { meet } = this.state;
        const backgroundImage = `url(${meet.photo})`;
        const start_date = meet.start.split('-').reverse().join('-')
        var meetMembers = shortNumber(meet.members_amount)
        var link = 'https://vk.com/id' + meet.ownerid

        const approve = e => {
          const mes = `Ваша петиция <<${meet.name}>> прошла модерацию.&${meet.ownerid}`;
          fetch('https://cors-anywhere.herokuapp.com/https://groovy-apricot.glitch.me/', { method: 'GET' })
          .then(res => console.log(200) & connect.send("VKWebAppSendPayload", {"group_id": 189366357, "payload": {"approve": mes}}));
          this.setState({ disabled: true })
          this.api.Approve({
            meet: meet.id
          }).then( e => onStoryChange('admin', 'meets') )
        }
        const deApprove = e => {
          const mes = `Ваша петиция <<${meet.name}>> отклонена модератором.&${meet.ownerid}`;
          fetch('https://cors-anywhere.herokuapp.com/https://groovy-apricot.glitch.me/', { method: 'GET' })
          .then(res => connect.send("VKWebAppSendPayload", {"group_id": 189366357, "payload": {"approve": mes}}));
          this.setState({ disabled: true })
          this.api.DeApprove({
            meet: meet.id
          }).then( e => onStoryChange('admin', 'meets') )
        }
        const Deny = e => {
            const mes = `Ваша петиция <<${meet.name}>> отклонена модератором.&${meet.ownerid}`;
            fetch('https://cors-anywhere.herokuapp.com/https://groovy-apricot.glitch.me/', { method: 'GET' })
                .then(res => connect.send("VKWebAppSendPayload", {"group_id": 189366357, "payload": {"approve": mes}}));
            this.setState({ disabled: true })
            this.api.Deny({
                meet: meet.id
            }).then( e => onStoryChange('admin', 'meets') )
        }
        return (
            <Panel id={id}>
                <PanelHeader left={
                  <PanelHeaderButton onClick={() => onStoryChange('admin', 'meets')}>
			               {IS_PLATFORM_IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
		               </PanelHeaderButton>}>Петиция</PanelHeader>
                   <Group>
                   <Div className="MeetImg" style={{ backgroundImage }} >
                       <Div style={{ marginTop: '20%' }} className="MeetName">{ meet.name }</Div>
                       <Div style={{ marginTop: '20%' }} className="MeetName">{ start_date }</Div>
                   </Div>
                   <Separator style={{ margin: '12px 0' }} />
                     <Link id='link' target="_blank" href={link}>
                       <UsersStack  photos={[ meet.owner_photo ]}>{meet.owner_name} {meet.owner_surname} • {meetMembers}</UsersStack>
                     </Link>
                   <Separator style={{ margin: '12px 0' }} />
                    <Div id='desk'>{meet.description}</Div>
                    <Div style={{display: 'flex'}}>
                            {
                              !meet.approved ?
                              <Button size="l" disabled={this.state.disabled} stretched style={{ marginRight: 8 }}
                              onClick={ () => approve() }>{this.state.disabled ? <Spinner/> : 'Принять'}</Button>
                              : <Button size="l" disabled={this.state.disabled} stretched style={{ marginRight: 8 }}
                              onClick={ () => deApprove() }>{this.state.disabled ? <Spinner/> : 'Скрыть от пользователей'} </Button>


                            }
                    </Div>
                </Group>
            </Panel>
        );
    }
}

export default MeetAdmin;
