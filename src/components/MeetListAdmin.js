import React, { Component } from 'react';
import { Group, Div } from '@vkontakte/vkui';

import MeetBoxAdmin from './MeetBoxAdmin';
import { getMessage } from '../js/helpers';

class MeetList extends Component {

    render() {
        const { meets, setParentState } = this.props;
        if (!meets) return null
        return (
            <Group className="transparentBody MeetList">
                {
                    (meets && meets.length) ?
                        <>
                            {
                                meets.map((meet, index) => <MeetBoxAdmin
                                    key={index}
                                    meet={meet}
                                    {...this.props}
                                    setParentState={setParentState}
                                />)
                            }
                        </>
                        :
                        <Group>
                            <Div>{getMessage('meet_empty_list')}</Div>
                        </Group>
                }
            </Group>
        )
    }
}

export default MeetList;
