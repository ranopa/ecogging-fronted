﻿import { FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import {
  getCommentNotificationItem,
  getMessageNotificationItem,
  getAccompanyNotificationItem
} from './NotificationItemBuilder';
import '../../styles/common/NotificationItem.css';
import detailDate from '../../utils/GetDayMinuteCounter ';


/*
  {
      "type": "COMMENT",
      "senderNickname": "kim",
      "createdAt": "1분 전",
      "detail": "제목은 요렇게"
  };
*/

export default function NotificationItem({item, deleteHandler, clickHandler}) {
  if (item == null || !item) return;
  const {icon, typeName, content, link} = 
    getNotiItem(item) ||  { icon: "-", typeName: "-", content: "-", link: "/" };

  console.log(item)
  return (
    <div className={'notification-item' + (item.read ? ' isRead' : '')}>
      <div className="item-header">
        <span className='header-left'>
          {icon}
          <span className='noti-type-text'>{typeName}</span>
          <span className='noti-date-gray'>{detailDate(item.createdAt)}</span>
        </span>
       
        <span className='header-right'>
          {<FiTrash2 onClick={() => deleteHandler(item.id)}/>}
        </span>
      </div>

      {(window.location.href.indexOf('mypage') > -1 && link.indexOf('Plogging') > -1 )
        || (window.location.href.indexOf('mypage') === -1  && window.location.pathname !== '/' && window.location.href.indexOf('messageroom/') === -1)   ?

        <a href={link} onClick={() => clickHandler(item.id)} className='noti-link'>
          <div className="item-body">
            {content}
          </div>
        </a>

          :

        <Link to={link} onClick={() => clickHandler(item.id)} className='noti-link'>
          <div className="item-body">
            {content}
          </div>
        </Link>
      }

    </div>
  )
}

function getNotiItem(item) {
  const type = item.type;
  if (type === 'COMMENT' || type === 'REPLYCOMMENT')
    return getCommentNotificationItem(item);
  if (type === 'MESSAGE')
    return getMessageNotificationItem(item);
  if (type === 'ACCOMPANY')
    return getAccompanyNotificationItem(item);
}