import { useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import MyButton from '../../components/common/MyButton';
import '../../styles/mypage/MessageDetail.css';
import MessageReplyModal from '../../components/mypage/MessageReplyModal';
import MessageDeleteModal from '../../components/mypage/MessageDeleteModal';
import moment from 'moment';
import axios from 'axios';
import picTemp from '../../assets/defaultProfile.PNG';

import useDeleteMessageRoom from "../../hooks/useDeleteMessageRoom";
import { getCookie } from '../../utils/CookieUtil';
import { Pagination } from 'antd';

export default function MessageDetail() {
    const { userId } = useParams();
    const { messageRoomId } = useParams();

    // 페이징 ---------------------------------------------------------------
    const [totCount, setTotCount] = useState(0); // 전체 페이지
    const [nowPage, setNowPage] = useState(1); // 현재 페이지
    const changePage = (no) => { // 페이지 클릭할 때마다 현재 페이지 변경
      setNowPage(no);
    }

    // 목록보기
    const goBack = useNavigate();

    // 삭제하기 모달
    const { deleteOpen, openDeleteModal, closeDeleteModal } = useDeleteMessageRoom();
    // 답장하기 모달
    const [isOpen, setIsOpen] = useState(false);
    const openReplyModal = () => {
        setIsOpen(!isOpen);
    }
    const closeReplyModal = () => {
        if(isOpen){
            setIsOpen(false);
        }
    };

    const accessToken = getCookie('access-token'); 
    const headers = {
      'Authorization': 'Bearer ' + accessToken, 
      'Content-Type': 'application/json',
    };

    // 서버에서 데이터 받아오기
    const[msgs, setMsgs] = useState([]);
    const[hasNext, setHasNext] = useState(false);
    const[conNick, setConNick] = useState('');
    const[conId, setConId] = useState('');
    const[conPic, setConPic] = useState('');
    
    // 처음 글 불러오기
    useEffect(() => {
        const url = `/${userId}/messageroom/${messageRoomId}`;
        axios.get(url, {
            headers:headers,
            params: {
                pageNo: nowPage, // 현재 페이지 서버로 전송 ( Back: @RequestParam )
            }
        })
        .then((response) => {
            setMsgs(response.data.data.messages.content); 
            setConNick(response.data.data.contactNickname);
            setConId(response.data.data.contactId);
            setConPic(response.data.data.contactPicUrl);
            setTotCount(response.data.allCount);
            
            
            if(response.data.data.messages.last === false) {
                setHasNext(true);
            } else {
                setHasNext(false);
            }
        })
        .catch((err) => {
            console.log('쪽지 불러오기 실패', err);
        })
    }, [totCount]);

    
    const loadMoreMsgs = () => {
        const nextPage = nowPage + 1;
        const url = `/${userId}/messageroom/${messageRoomId}`;
        axios.get(url, {
            headers:headers,
            params: {
                pageNo: nextPage, 
            }
        })
        .then((response) => {
            setMsgs((prevMsgs) => [...prevMsgs, ...response.data.data.messages.content]);
            setTotCount(response.data.allCount);
            
            if(response.data.data.messages.last === false) {
                setHasNext(true);
            } else {
                setHasNext(false);
            }

        })
        .catch((err) => {
            console.log('쪽지 불러오기 실패', err);
        })
    }

    // 쪽지함 읽기 처리 [알림 경로]  -------------------------------------------------------------
    useEffect(() => { 
        const url = `/${userId}/messageroom/${messageRoomId}/read`;
        axios.put(url, null, {
            headers: headers,
        })
        .catch((err) => {
            console.log('쪽지함 읽음 처리 실패');
            console.log(err);
        });
    }, []); 




    return (
        <div className="MessageDetail">

            {/* 답장모달 */}
            {isOpen ? 
                <MessageReplyModal onCloseModal={ closeReplyModal } conId={conId} totCount={totCount} setTotCount={setTotCount} />
                : null }

            {/* 삭제모달 */}
            {deleteOpen ?
                <MessageDeleteModal onCloseDeleteModal={ closeDeleteModal } />
                : null }

            <div className='container_messageWrapper'>


                <div className='container_messageDetailHeader'>
                    <MyButton text={'목록보기'} type={ 'whiteGrayWide2' } 
                    onClick={() => goBack(`/mypage/${userId}/messagerooms`)}/>
                </div>

                <div className='container_msgSubWrapper'>
                    <div className='container_messageBody'>

                        <div className='container_msgBodyHeader'>
                            <div className='container_msgBodyHeaderLeft'>
                                <div className='circle_msgSenderPic'>
                                    {(conPic) ? 
                                    <img src={conPic} className='msgSender_PicSource' />
                                    : <img src={picTemp} className='msgSender_PicSource' />
                                    }
                                </div>
                                <div className='txt_msgSenderNick'>{conNick}</div>
                            </div>
                            <div className='container_msgBodyHeaderRight'>
                                <div className='container_msgBodyHeaderBtns'>
                                    <MyButton text={'답장하기'} type={'mintWide2'} onClick={openReplyModal}/>
                                    <MyButton text={'삭제하기'} type={'lightGrayWide2'} onClick={openDeleteModal}/>
                                </div>
                            </div>
                        </div>

                        <div className='container_messageArea'>

                            { msgs.map((msg, idx) => (

                                    <div className='container_msgOne' key={msg.id}>
                                        <div className='container_msgOneInner'>
                                            <div className='box_msgOneTop'>
                                                { msg.isReceived === 1 ?
                                                    <div className='txt_msgState_receive'>받은 쪽지</div>
                                                    :   <div className='txt_msgState_send'>보낸 쪽지</div>
                                                }   
                                                <div className='txt_msgWriteDate'>{moment(msg.createdAt).format('YY.MM.DD hh:mm a')}</div>
                                            </div>
                                            <div className='box_msgContentsBody'>
                                                {msg.content}
                                            </div>
                                        </div>
                                    </div>

                                ))                               
                            }

                        </div>
                    </div>
                </div>

                {hasNext === true ? 
                    <div className='container_mypageMsgBottom'>
                        <div className='box_msgMore' onClick={loadMoreMsgs}>
                            더 보기 
                        </div>
                    </div>   
                    :
                    null
                }

            </div>        
        </div>
    );
}