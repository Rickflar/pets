import React, {Component} from 'react';
import {Panel, Placeholder, Button, FixedLayout, Div} from '@vkontakte/vkui';
import Icon28CompassOutline from '@vkontakte/icons/dist/28/compass_outline';
import Icon28AddCircleOutline from '@vkontakte/icons/dist/28/add_circle_outline';
import Icon28UserCircleOutline from '@vkontakte/icons/dist/28/user_circle_outline';
import '@vkontakte/vkui/dist/vkui.css';
import './Onboarding.css';

class Rules extends Component {
    render() {
        const {id, onStoryChange} = this.props;
        return (
            <Panel id={id}>
                <Placeholder
                    stretched
                    icon={<div style={{display: 'flex'}}>
                        <Icon28CompassOutline width={56} height={56} style={{marginTop: 24}}/>
                        <Icon28AddCircleOutline width={56} height={56} style={{marginLeft: 6}}/>
                        <Icon28UserCircleOutline width={56} height={56} style={{marginTop: 24, marginLeft: 6}}/>
                    </div>}
                    header={<div className='title'>Навигация</div>}
                >
                    На первой вкладке находится список петиций, на второй — раздел для организации собственной, и на
                    третьей — те, в которых вы принимаете участие
                </Placeholder>
                <FixedLayout vertical='bottom'>
                    <Div style={{display: 'flex'}}>
                        <Button
                            size='xl'
                            onClick={() => onStoryChange('onboarding', 'onboarding')}
                            mode="outline"
                            stretched
                        >Назад</Button>
                        <Button
                            style={{marginLeft: 10}}
                            size='xl'
                            onClick={() => onStoryChange('onboarding', 'onboarding3')}
                            mode="outline"
                            stretched
                        >Далее</Button>
                    </Div>
                </FixedLayout>
            </Panel>
        );
    }
}

export default Rules;
