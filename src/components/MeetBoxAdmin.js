import React, {Component} from 'react';
import { Button, IS_PLATFORM_IOS, /*Link,*/ ActionSheetItem, ActionSheet, Div } from '@vkontakte/vkui/';

import Icon28MoreHorizontal from '@vkontakte/icons/dist/28/more_horizontal';
//import Icon28Messages from '@vkontakte/icons/dist/28/messages';
import { shortNumber } from '../js/helpers';

class MeetBoxAdmin extends Component {


    goMeet = () => {
        const { meet, setParentState } = this.props;

        setParentState({
            meet: meet,
            activePanel: 'meetAdmin'
        });
    }

    Deny = () => {
        const { meet } = this.props;
        this.setState({disabled: true})
        this.api.Deny({
            meet: meet
        });
    }

    openActionSheet = (e) => {
      e.stopPropagation()
      const { setParentState/*, api, fetchedUser, meet */} = this.props;

      setParentState({
          popout:
          <ActionSheet onClose={() => setParentState({ popout: null })}>
            <ActionSheetItem onClick={ this.goMeet } autoclose>
              Перейти на страницу петиции
            </ActionSheetItem>
            <ActionSheetItem onClick={ this.Deny} autoclose>
              Отклонить
            </ActionSheetItem>
            {IS_PLATFORM_IOS && <ActionSheetItem autoclose theme="cancel">Отменить</ActionSheetItem>}
          </ActionSheet>,
      });
  }

    render() {
        const { meet } = this.props;
        const backgroundImage = `url(${meet.photo})`;
        var meetMembers = shortNumber(meet.members_amount)

        return (
            <Div className="MeetBox" onClick={ this.goMeet } style={{ backgroundImage }} >
                <Div className="MeetMore">
                    <Icon28MoreHorizontal  onClick={(e) => this.openActionSheet(e) }/>
                </Div>
                <Div className="MeetName">{ meet.name }</Div>
                <Div className="MeetAction">
                  {
                    meet.approved ?
                    <Button level="primary">Одобрен</Button>
                    :   <Button level="primary">Не рассмотрен</Button>
                  }
                    <Div className="MeetMembers">{ meetMembers }</Div>
                </Div>
            </Div>
        )
    }
}

export default MeetBoxAdmin;
