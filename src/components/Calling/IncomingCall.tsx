/* DISCLAIMER The sample scripts are not supported under any Microsoft standard support program or service. This is intended to be used in non-production environment only. The sample scripts are provided AS IS without warranty of any kind. Microsoft further disclaims all implied warranties including, without limitation, any implied warranties of merchantability or of fitness for a particular purpose. The entire risk arising out of the use or performance of the sample scripts and documentation remains with you. In no event shall Microsoft, its authors, owners of this github repro, or anyone else involved in the creation, production, or delivery of the scripts be liable for any damages whatsoever (including without limitation, damages for loss of business profits, business interruption, loss of business information, or other pecuniary loss) arising out of the use of or inability to use the sample scripts or documentation, even if Microsoft has been advised of the possibility of such damages. */

import React from "react";
import { PhoneOff, Video, Phone } from "react-feather";
import './IncomingCall.css';

interface IncomingCallProps {
  rejectCall: (event: React.MouseEvent<SVGAElement, MouseEvent>) => void;
  acceptVideoCall: (event: React.MouseEvent<SVGAElement, MouseEvent>) => void;
  acceptVoiceCall: (event: React.MouseEvent<SVGAElement, MouseEvent>) => void;
}

function IncomingCall(props: IncomingCallProps) {
  return (
    <div className="incoming-call-pop-up">
      <span> Incoming call </span>
      <div>
        <PhoneOff className="reject-call-button" onClick={props.rejectCall}/>
        <Video className="accept-video-call-button" onClick={props.acceptVideoCall} />
        <Phone className="accept-voice-call-button" onClick={props.acceptVoiceCall}/>
      </div>
    </div>
  )
}

export default IncomingCall;