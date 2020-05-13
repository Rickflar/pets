import React, {Component} from 'react';
import {Panel, PanelHeader} from '@vkontakte/vkui';
import {getMessage} from '../js/helpers';
import MeetListAdmin from '../components/MeetListAdmin';

import '@vkontakte/vkui/dist/vkui.css';
import './Home.css';

class AdminPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            meets: this.props.allMeets
        };
        this.api = this.props.api;
    }

    render() {
        const {id, setParentState} = this.props;
        return (
            <Panel id={id}>
                <PanelHeader>{getMessage('admin_panel_title')}</PanelHeader>
                <MeetListAdmin
                    {...this.props}
                    meets={this.props.allMeets}
                    setParentState={setParentState}
                />
            </Panel>
        );
    }
}

export default AdminPage;
