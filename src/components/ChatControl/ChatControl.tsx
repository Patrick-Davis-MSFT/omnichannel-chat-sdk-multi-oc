/* DISCLAIMER The sample scripts are not supported under any Microsoft standard support program or service. This is intended to be used in non-production environment only. The sample scripts are provided AS IS without warranty of any kind. Microsoft further disclaims all implied warranties including, without limitation, any implied warranties of merchantability or of fitness for a particular purpose. The entire risk arising out of the use or performance of the sample scripts and documentation remains with you. In no event shall Microsoft, its authors, owners of this github repro, or anyone else involved in the creation, production, or delivery of the scripts be liable for any damages whatsoever (including without limitation, damages for loss of business profits, business interruption, loss of business information, or other pecuniary loss) arising out of the use of or inability to use the sample scripts or documentation, even if Microsoft has been advised of the possibility of such damages. */
import React, { useCallback, useEffect, useState, useContext } from 'react';
import ReactWebChat from 'botframework-webchat';
import { IRawMessage, OmnichannelChatSDK } from '@microsoft/omnichannel-chat-sdk';
import { ActionType, Store } from '../../context';
import Loading from '../Loading/Loading';
import ChatButton from '../ChatButton/ChatButton';
import ChatHeader from '../ChatHeader/ChatHeader';
import Calling from '../Calling/Calling';
import createCustomStore from './createCustomStore';
import { createDataMaskingMiddleware } from './createDataMaskingMiddleware';
import createActivityMiddleware from './createActivityMiddleware';
import createAvatarMiddleware from './createAvatarMiddleware';
import './ChatControl.css';
import TransferButton from '../TransferButton/TransferButton';

//setup the Avatar Icons
const avatarMiddleware: any = createAvatarMiddleware();

const styleOptions = {
    bubbleBorderRadius: 10,
    bubbleNubSize: 10,
    bubbleNubOffset: 15,

    bubbleFromUserBorderRadius: 10,
    bubbleFromUserNubSize: 10,
    bubbleFromUserNubOffset: 15,
    bubbleFromUserBackground: 'rgb(246, 246, 246)',

    adaptiveCardsParserMaxVersion: '1.3'
}

function ChatControl(props: any) {

    const { state, dispatch } = useContext(Store);
    const [chatSDK, setChatSDK] = useState<OmnichannelChatSDK>();
    const [VoiceVideoCallingSDK, setVoiceVideoCallingSDK] = useState(undefined);
    const [transferActive, setTransferActive] = useState(Boolean);
    const [transferTo, setTransferTo] = useState(String);
    const [thisStarted, setThisStarted] = useState(Boolean);
    const [webChatStore, setWebChatStore] = useState(undefined);
    const [chatAdapter, setChatAdapter] = useState<any>(undefined);
    const [chatToken, setChatToken] = useState(undefined);
    const [transferMsg, setTransferMsg] = useState(String);
    const [sentInitMsg, setSentInitMsg] = useState(Boolean);


    const stateCallback = (transferId: string, msg: string) => {
        setTransferActive(true);
        setTransferTo(transferId);
        setTransferMsg(msg);
        setSentInitMsg(false);
    };

    const activityMiddleware: any = createActivityMiddleware(stateCallback);


    useEffect(() => {
        const init = async () => {

            Object.keys(localStorage).forEach((key: string) => {
                if (key.startsWith('liveChatContext')) {
                    localStorage.removeItem(key);
                }
            });
    
            if (chatSDK === undefined) {
    
    
                console.log('[ChatControl -> init()]');
                console.log(props);
    
                if (props === undefined || props.omnichannelConfig === undefined) {
                    console.error('no channel configuration passed');
                    return;
                }
                const chatSDKConfig = {
                    // Optional
                    dataMasking: {
                        disable: true,
                        maskingCharacter: '#'
                    },
    
                    getAuthToken: async () => {
                        //Auth URL
                        const url = "";
                        const header = new Headers();
                        header.append('Accept', 'application/json');
                        header.append('Content-Type', 'application/json');
                        header.append('Cache', 'no-cache');
    
                        const response = await fetch(url, { method: 'GET', credentials: 'same-origin', headers: header });
                        if (response.ok) {
                            console.log('Got Authenication :)');
                            return await response.text();
                        }
                        else {
    
                            console.log('No Auth :(');
                            return null
                        }
                    }
                }
    
                const chatSDK = new OmnichannelChatSDK(props.omnichannelConfig, chatSDKConfig);
                //const chatSDK = new OmnichannelChatSDK(props.omnichannelConfig);
    
                await chatSDK.initialize();
                setChatSDK(chatSDK);
                setThisStarted(false);
                const liveChatContext = localStorage.getItem('liveChatContext-' + props.omnichannelConfig.widgetId);
                if (liveChatContext && Object.keys(JSON.parse(liveChatContext)).length > 0) {
                    console.log("[liveChatContext]");
                    console.log(liveChatContext);
                }
    
                if ((chatSDK as any).getVoiceVideoCalling) {
                    try {
                        const VoiceVideoCalling = await (chatSDK as any).getVoiceVideoCalling();
                        VoiceVideoCalling.setDebug(true);
                        setVoiceVideoCallingSDK(VoiceVideoCalling);
                        console.log("VoiceVideoCalling loaded");
                    } catch (e) {
                        console.log(`Failed to load VoiceVideoCalling: ${e}`);
                    }
                }
            }
        }
        console.log(state);
        init();
    }, [state]);

    //record events
    const onNewMessage = useCallback((message: IRawMessage) => {
        console.log(`[onNewMessage] ${message.content}`);
        dispatch({ type: ActionType.SET_LOADING, payload: false });
    }, [dispatch]);

    const onTypingEvent = useCallback(() => {
        console.log(`[onTypingEvent]`);
    }, []);

    const onAgentEndSession = useCallback(() => {
        console.log(`[onAgentEndSession]`);
    }, []);

    const startChat = useCallback(async (_, optionalParams = {}) => {
        if (state.hasChatStarted || chatSDK === undefined) {
            if (!(optionalParams.ignoreStarted && chatSDK !== undefined && !thisStarted)) {
                return;
            }
        }

        console.log('[startChat]');
        setTransferActive(false);

        const dataMaskingRules = await chatSDK?.getDataMaskingRules();
        const store = createCustomStore();
        setWebChatStore(store.create());

        store.subscribe('DataMasking', createDataMaskingMiddleware(dataMaskingRules));

        // Check for active conversation in cache
        const cachedLiveChatContext = localStorage.getItem('liveChatContext-' + props.omnichannelConfig.widgetId);
        if (cachedLiveChatContext && Object.keys(JSON.parse(cachedLiveChatContext)).length > 0) {
            console.log("[liveChatContext]");
            optionalParams.liveChatContext = JSON.parse(cachedLiveChatContext);
        }

        dispatch({ type: ActionType.SET_CHAT_STARTED, payload: true });
        dispatch({ type: ActionType.SET_LOADING, payload: true });
        await chatSDK?.startChat(optionalParams);

        // Cache current conversation context
        const liveChatContext = await chatSDK?.getCurrentLiveChatContext();
        localStorage.setItem('liveChatContext-' + props.omnichannelConfig.widgetId, JSON.stringify(liveChatContext));

        // chatSDK?.onNewMessage(onNewMessage);
        chatSDK?.onTypingEvent(onTypingEvent);
        chatSDK?.onAgentEndSession(onAgentEndSession);

        const chatAdapter = await chatSDK?.createChatAdapter();

        // Recommended way to listen to messages when using WebChat
        (chatAdapter as any).activity$.subscribe((activity: any) => {
            console.log(`[activity] ${activity.text}`);
            dispatch({ type: ActionType.SET_LOADING, payload: false });
        });

        setChatAdapter(chatAdapter);
        setThisStarted(true);
        dispatch({ type: ActionType.SET_LOADING, payload: false });

        if (props.initMsg !== "") {
            sendInitMessage(props.initMsg);
        }

        if ((chatSDK as any).getVoiceVideoCalling) {
            const chatToken: any = await chatSDK?.getChatToken();
            setChatToken(chatToken);
        }
    }, [chatSDK, state, dispatch, onAgentEndSession, onNewMessage, onTypingEvent]);


    const endChat = useCallback(async () => {
        console.log('[endChat]');
        await chatSDK?.endChat();

        // Clean up
        (VoiceVideoCallingSDK as any)?.close();
        setChatAdapter(undefined);
        setChatToken(undefined);
        localStorage.removeItem('liveChatContext-' + props.omnichannelConfig.widgetId);
        dispatch({ type: ActionType.SET_CHAT_STARTED, payload: false });
    }, [chatSDK, dispatch, VoiceVideoCallingSDK]);

    const TransferClick = useCallback(async (_, optionalParams = {}) => {
        let retVal = { widgetId: transferTo, msg: transferMsg };
        await props.onTransferBot(_, retVal);
        setTransferActive(false);
        console.log('transferState');
        console.log(state);
    }, [props.showWidget, transferActive, transferTo]);

    const AutoOpen = async () => {
        await startChat(null, { ignoreStarted: true });
    }

    const sendInitMessage = (msg: string) => {
        if (chatSDK !== undefined && msg !== "" && thisStarted && !sentInitMsg && props.showWidget === props.omnichannelConfig.widgetId) {
            console.log('initial message to send');
            const message = "<internal>" + msg;
            const messageToSend = {
                content: message
            };
            chatSDK.sendMessage(messageToSend);
            setSentInitMsg(true);
        }
    };

    useEffect(() => {
        sendInitMessage(props.initMsg);
    }, [props.initMsg, thisStarted]);

    useEffect(() => {
        if (props.autoOpen && props.showWidget === props.omnichannelConfig.widgetId) {
            AutoOpen();
        }
    },
        [props.showWidget]);

    if (props.showWidget === props.omnichannelConfig.widgetId) {
        return (<>
            <div>
                {
                    !state.hasChatStarted && <ChatButton btnText={props.btnText} onClick={startChat} />
                }
            </div>
            {
                state.hasChatStarted && <div className="chat-container">
                    <ChatHeader
                        title={'Chatting: ' + props.btnText}
                        onClick={endChat}
                    />
                    {
                        state.isLoading && <Loading />
                    }
                    {
                        VoiceVideoCallingSDK && chatToken && <Calling
                            VoiceVideoCallingSDK={VoiceVideoCallingSDK}
                            OCClient={chatSDK?.OCClient}
                            chatToken={chatToken}
                        />
                    }
                    {
                        !state.isLoading && state.hasChatStarted && chatAdapter && webChatStore && activityMiddleware && <ReactWebChat
                            activityMiddleware={activityMiddleware}
                            avatarMiddleware={avatarMiddleware}
                            userID="teamsvisitor"
                            directLine={chatAdapter}
                            sendTypingIndicator={true}
                            store={webChatStore}
                            styleOptions={styleOptions}
                        />
                    }
                    {/*
                            !state.isLoading && state.hasChatStarted && chatAdapter && <ActionBar
                                onDownloadClick={downloadTranscript}
                                onEmailTranscriptClick={emailTranscript}
                            />*/
                    }
                    {
                        !state.isLoading && state.hasChatStarted && chatAdapter && transferActive && <TransferButton
                            buttonString="Click Me To Transfer"
                            hide={false}
                            onClick={TransferClick}
                        />
                    }
                </div>
            }</>);
    }
    return (<></>);
}

export default ChatControl;
