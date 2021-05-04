/* DISCLAIMER The sample scripts are not supported under any Microsoft standard support program or service. This is intended to be used in non-production environment only. The sample scripts are provided AS IS without warranty of any kind. Microsoft further disclaims all implied warranties including, without limitation, any implied warranties of merchantability or of fitness for a particular purpose. The entire risk arising out of the use or performance of the sample scripts and documentation remains with you. In no event shall Microsoft, its authors, owners of this github repro, or anyone else involved in the creation, production, or delivery of the scripts be liable for any damages whatsoever (including without limitation, damages for loss of business profits, business interruption, loss of business information, or other pecuniary loss) arising out of the use of or inability to use the sample scripts or documentation, even if Microsoft has been advised of the possibility of such damages. */

import React, { useCallback, useEffect, useState } from 'react';
import ChatControl from '../ChatControl/ChatControl';
import fetchOmnichannelConfig from '../../utils/fetchOmnichannelConfig';
import fetchAuthURL from '../../utils/fetchAuthURL';
import fetchOmnichannelCount from '../../utils/fetchOmnichannelCount';
import './WebChat.css';
import IOmnichannelConfig from '@microsoft/omnichannel-chat-sdk/lib/core/IOmnichannelConfig';

function WebChat() {
  const [configArr, setConfigArr] = useState<Array<IOmnichannelConfig>>();
  const [openAuto, setOpenAuto] = useState<boolean>();
  const [showWidget, setShowWidget] = useState(String);
  const [initMsg, setInitMsg] = useState(String);
  const [authURL, setAuthURL] = useState(String);

  useEffect(() => {
    const init = async () => {

      const channelCount = fetchOmnichannelCount();
      if (channelCount <= 1){
        console.error('This code is optimized for multiple channels, For one channel please use another library.');
      }
      let tempConfigArr = new Array();
      for (let i = 0; i < channelCount; i++) {
        const tempOmniChanConfig = fetchOmnichannelConfig(i);
        tempConfigArr.push(tempOmniChanConfig);
        if (showWidget === "" && i === 0) {
          //Set the initial widget to the first channel
          setShowWidget(tempOmniChanConfig.widgetId);
          setInitMsg("");
        }
      }

      const tempAuthURL = fetchAuthURL();
      console.log(tempAuthURL);
      setAuthURL(tempAuthURL ? tempAuthURL : "");
      setConfigArr(tempConfigArr);
      setOpenAuto(false);
    }
    init();
  }, [showWidget]);

  const onShowNext = useCallback(async (_, optionalParams = {}) => {
    setOpenAuto(true);
    setShowWidget(optionalParams.widgetId);
    setInitMsg(optionalParams.msg);
  }, [showWidget, openAuto]);

  if (configArr !== undefined && configArr[0] !== undefined) {
    return (
      <>
        { configArr?.map((config: IOmnichannelConfig) =>
        (<React.Fragment key={config.widgetId}>
          <ChatControl
            omnichannelConfig={config}
            onTransferBot={onShowNext}
            autoOpen={openAuto}
            showWidget={showWidget}
            initMsg={initMsg}
            authURL={authURL}
            btnText={"Click Here to Chat"} />
        </React.Fragment>))
        }
      </>
    );
  }
  else {
    return (<></>);
  }
}

export default WebChat;
