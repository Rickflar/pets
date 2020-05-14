import React, { Component } from 'react';
import { Div, IS_PLATFORM_IOS, ActionSheetItem, ActionSheet, Avatar, Textarea, Placeholder, RichCell, Button, Spinner } from '@vkontakte/vkui';
import Icon28CommentOutline from '@vkontakte/icons/dist/28/comment_outline';
import Icon24LikeOutline from '@vkontakte/icons/dist/24/like_outline';
import Icon24Like from '@vkontakte/icons/dist/24/like';
import '../css/App.css';

class ComList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meet: this.props.state.meet,
      comment_text: '',
      snackbar: null,
      loading: false
    };
    this.api = this.props.api;
  }

  render() {
    const { comments, setParentState, openErrorSnackbar, openDoneSnackbar} = this.props;
    const { meet } = this.state;
    if (comments === false) {
      return <Div><Spinner /></Div>
    }

    const addComment = e => {
      this.setState({ loading: true });
      this.api.AddComment({
        comment: e,
        meet: meet.id
      }).then(e => {
        if (e.success) {
          this.api.GetMeetComments(this.props.state.meet.id).then(comments => setParentState({ comments }))
          document.getElementById('comm_inp').value = ''
          this.setState({ comment_text: '' })
        } else if (e.failed) {
          openErrorSnackbar(e.failed)
        } else {
          openErrorSnackbar('Нельзя отправлять комментарии так часто.')
        }
        this.setState({ loading: false });
      })
    }

    const commAction = (id, ownerid) => {
      let link = "https://vk.com/id" + ownerid;
      setParentState({
        popout:
          <ActionSheet onClose={() => setParentState({ popout: null })}>
            <ActionSheetItem onClick={() => removeComment(id)} autoclose mode="destructive">
              Удалить комментарий
            </ActionSheetItem>
            <ActionSheetItem autoclose onClick={() => window.open(link, "_blank")}>
              Страница ВК
            </ActionSheetItem>
            {IS_PLATFORM_IOS && <ActionSheetItem autoclose mode="cancel">Отменить</ActionSheetItem>}
          </ActionSheet>,
      });
    }

    const rateComment = (id, type) => {
      let act;
      if (type) {
        act = 0;
      } else act = 1;
      this.api.RateComment({
        comment: id,
        act: act
      }).then(e => {
        if (e) {
          if (e.length === 0) {
            openErrorSnackbar('Не так часто')
            return
          } else if (e.status || e.success) {
            this.api.GetMeetComments(this.props.state.meet.id).then(comments => {
              setParentState({ comments });
            });
          } else if (e.message) {
            openErrorSnackbar(e.message);
          } else if (e.failed) {
            openErrorSnackbar(e.failed);
          }
        }

      });
    }

    const removeComment = e => {
      setParentState({ comments: false })
      this.api.RemoveComment({ comment: e }).then(e => {
        if (e.length === 0) {
          openErrorSnackbar('Не так часто')
          return
        }
        if (e.status || e.success) {
          this.api.GetMeetComments(this.props.state.meet.id).then(comments => setParentState({ comments }));
          openDoneSnackbar('Комментарий удалён.');
        } else if (e.message) {
          openErrorSnackbar(e.message);
        } else if (e.failed) {
          openErrorSnackbar(e.failed);
        }
      });
    }
    return (
      <>
        {this.state.snackbar}
        {(comments && comments.length) ?
          <>
            {comments.map((comment, index) =>
              (<RichCell
                key={index}
                onClick={(e) => {
                  e.stopPropagation()
                  commAction(comment.id, comment.ownerid)
                }}
                multiline
                before={<Avatar size={48} src={comment.owner_photo} />}
                text={comment.comment}
                after={
                  <div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}
                      onClick={(e) => {
                        e.stopPropagation()
                        rateComment(comment.id, comment.isliked)
                      }}
                    >
                      {comment.isliked ? <Icon24Like width={20} height={20} style={{ marginRight: 6 }} fill={'var(--destructive)'} /> : <Icon24LikeOutline width={20} height={20} style={{ marginRight: 6 }} fill={'var(--icon_secondary)'} />}
                      <div style={{ color: comment.isliked ? 'var(--destructive)' : 'var(--icon_secondary)' }}>{comment.rating !== 0 && comment.rating}</div>
                    </div>
                  </div>
                }
              >
                {`${comment.owner_name}  ${comment.owner_surname}`}
              </RichCell>))}
          </>
          :
          <Placeholder
            icon={<Icon28CommentOutline width={56} height={56} />}
            header="Комментариев нет"
          >
            Будьте первым, кто оставить комментарий
          </Placeholder>
        }
        {
          !this.props.isExpired &&
          <Div>
            <Textarea
              maxLength='45'
              style={{ borderRadius: '15px' }}
              placeholder={'Напишите комментарий'}
              id='comm_inp'
              value={this.state.comment_text}
              onChange={e => this.setState({ comment_text: e.currentTarget.value })}
            />
            <Button
              disabled={!this.state.comment_text || this.state.loading}
              size='xl'
              mode="outline"
              style={{ marginTop: 12 }}
              onClick={() => {
                if (this.state.comment_text) {
                  addComment(this.state.comment_text);
                }
              }}>Отправить комментарий</Button>
          </Div>
        }
      </>
    )
  }
}

export default ComList;