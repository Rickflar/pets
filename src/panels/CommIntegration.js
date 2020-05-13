import React, {Component} from 'react';
import {Panel, PanelHeader, Button, IS_PLATFORM_IOS, Placeholder, PanelHeaderButton} from '@vkontakte/vkui';

import connect from '@vkontakte/vk-connect';

import Icon56UsersOutline from '@vkontakte/icons/dist/56/users_outline';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import '@vkontakte/vkui/dist/vkui.css';
import './Home.css';

class CommIntegration extends Component {


    render() {
        const {id, onStoryChange} = this.props;

        return (
            <Panel id={id}>
                <PanelHeader left={
                    <PanelHeaderButton onClick={() => onStoryChange('home', 'meets')}>
                        {
                            IS_PLATFORM_IOS ? <Icon28ChevronBack/> : <Icon24Back/>
                        }
                    </PanelHeaderButton>
                }> Интеграция
                </PanelHeader>
                <Placeholder
                    icon={<Icon56UsersOutline/>}
                    action={<Button size="l" onClick={() => connect.send("VKWebAppAddToCommunity", {})} level="primary">Добавить
                        в сообщество</Button>}
                    stretched
                >
                    Вы можете установить сервис в сообщество и создавать петиции от его имени
                </Placeholder>
            </Panel>
        );
    }
}

export default CommIntegration;
