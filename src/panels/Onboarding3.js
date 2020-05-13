import React, {Component} from 'react';
import {Panel, Placeholder, Button, FixedLayout, Div} from '@vkontakte/vkui';
import Icon28Notifications from '@vkontakte/icons/dist/28/notifications';
import connect from '@vkontakte/vk-connect';
import '@vkontakte/vkui/dist/vkui.css';
import './Onboarding.css';
import Checkbox from "@vkontakte/vkui/dist/components/Checkbox/Checkbox";

class Rules extends Component {


    render() {
        const {id, onStoryChange} = this.props;

        return (
            <Panel id={id}>
                <Placeholder
                    stretched
                    icon={<Icon28Notifications width={56} height={56}/>}
                    header={<div className='title'>Уведомления</div>}
                >
                    Если вы хотите получать важные уведомления, то разрешите их в следующем окне. Обещаем не тревожить
                    по пустякам!
                </Placeholder>
                <FixedLayout vertical='bottom'>
                    <Checkbox id='noty'>Не присылать уведомления</Checkbox>
                    <Div style={{display: 'flex'}}>
                        <Button
                            size='xl'
                            onClick={() => onStoryChange('onboarding', 'onboarding2')}
                            mode="outline"
                            stretchedß
                        >Назад</Button>
                        <Button
                            style={{marginLeft: 10}}
                            size='xl'
                            onClick={() => {
                                onStoryChange('home', 'meets')
                                if (document.getElementById('noty').checked) {
                                    console.log('((')
                                    return;
                                }
                                connect.send("VKWebAppAllowMessagesFromGroup", {"group_id": 189366357});
                            }}
                            mode="outline"
                            stretched
                        >Начать</Button>
                    </Div>
                </FixedLayout>
            </Panel>
        );
    }
}

export default Rules;
