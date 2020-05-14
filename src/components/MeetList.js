import React, {Component} from 'react';
import {
    Group, Placeholder, Div, Spinner
} from '@vkontakte/vkui';
import MeetBox from './MeetBox/MeetBox';
import Icon28RecentOutline from '@vkontakte/icons/dist/28/recent_outline';

class MeetList extends Component {
    render() {
        const {meets, setParentState, getUserMeets, makeStory} = this.props;
        if (!meets) return <Div><Spinner/></Div>
        return (
            <div>
                {
                    (meets && meets.length) ?
                        <Group className="transparentBody MeetList">
                            {
                                meets.map((meet, index) =>
                                    (
                                        <MeetBox
                                            key={index}
                                            meet={meet}
                                            {...this}
                                            makeStory={makeStory}
                                            getUserMeets={getUserMeets}
                                            setParentState={setParentState}
                                            style={{marginBottom: 12}}
                                        />
                                    ))
                            }
                        </Group>
                        :
                        <Placeholder
                            stretched
                            header={<div className='title'>Ой, кажется здесь пусто</div>}
                            icon={<Icon28RecentOutline width={56} height={56}/>}
                        >
                            Но так не будет вечно..
                        </Placeholder>
                }
            </div>
        )
    }
}

export default MeetList;
