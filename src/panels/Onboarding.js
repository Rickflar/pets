import React, {Component} from 'react';
import {Panel, Placeholder, Button, FixedLayout, Div} from '@vkontakte/vkui';
import Icon28Users3Outline from '@vkontakte/icons/dist/28/users_3_outline';
import '@vkontakte/vkui/dist/vkui.css';
import './Onboarding.css';

class Rules extends Component {
    render() {
        const {id, onStoryChange} = this.props;
        return (
            <Panel id={id}>
                <Placeholder
                    stretched
                    icon={<Icon28Users3Outline width={56} height={56}/>}
                    header={<div className='title'>Диванные петиции</div>}
                >
                    Диванные петиции — новый способ выразить свое мнение не выходя из дома.
                    Приложение и контент в нем не преследует цели кого-либо оскорбить, является исключительно
                    юмористическим, носит развлекательный контент и тщательно модерируется.
                </Placeholder>
                <FixedLayout vertical='bottom'>
                    <Div>
                        <Button size='xl' stretched onClick={() => onStoryChange('onboarding', 'onboarding2')}
                                mode="outline">Далее</Button>
                    </Div>
                </FixedLayout>
            </Panel>
        );
    }
}

export default Rules;
