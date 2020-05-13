import React from 'react';

import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Footer from '@vkontakte/vkui/dist/components/Footer/Footer';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Spinner from '@vkontakte/vkui/dist/components/Spinner/Spinner';
import {getMessage} from '../js/helpers';

export class Offline extends React.Component {


    render() {
        return (
            <Panel id="offline" theme="white">
                <PanelHeader>{/*Проблемы*/}</PanelHeader>
                <Div>
                    <Footer style={{marginTop: '50%'}}>{getMessage('no_internet')}</Footer>
                    <Spinner/>
                </Div>
            </Panel>
        )
    }

}

export default Offline;
