const Messages = [
  { 
    message: "unsupported_browser", 
    cause: "Agent is using an unsupported browser. Only the latest 3 versions of Chrome or Firefox is supported. Upgrade the agent's browser to resolve this error. See <a href=\"https://docs.aws.amazon.com/connect/latest/adminguide/what-is-amazon-connect.html#browsers\">Supported browsers</a> for more information."
  },
  { 
    message: "microphone_not_shared", 
    cause: "The microphone does not have permission for the site on which the CCP is running. For Google Chrome steps, see <a href=\"https://support.google.com/chrome/answer/2693767?hl=en\">Use your camera and microphone in Chrome</a>. For Mozilla Firefox steps, see <a hrf=\"https://support.mozilla.org/en-US/kb/firefox-page-info-window\">Firefox Page Info window</a>."
  },
  { 
    message: "signalling_handshake_failure", 
    cause: "Error connecting the CCP to the Signaling Endpoint (TCP on port 443). This could happen due to a network issue or the required port not being open. Also see <a href=\"https://docs.aws.amazon.com/connect/latest/adminguide/ccp-networking.html\">Set Up Your Network</a> for further reference."
  },
  { 
    message: "signalling_connection_failure", 
    cause: "Error connectiong the CCP to the Signaling Endpoint (TCP on port 443). This could happen due to a network issue or the required port not being open. Also see <a href=\"https://docs.aws.amazon.com/connect/latest/adminguide/ccp-networking.html\">Set Up Your Network</a> for further reference."
  },
  { 
    message: "ice_collection_timeout", 
    cause: "Error connecting to the Media Endpoint (UDP on port 3478). This could happen due to a network issue or the required port not being open. Also see <a href=\"https://docs.aws.amazon.com/connect/latest/adminguide/ccp-networking.html\">Set Up Your Network</a> for further reference."
  },
  { 
    message: "user_busy_error", 
    cause: "Agent has the CCP running in 2 distinct browsers at the same time, such as Chrome and Firefox. Use only one browser at a time to log in to the CCP."
  },
  { 
    message: "webrtc_error", 
    cause: "An issue occurred due to either using an unsupported browser, or a required port/protocol is not open, such as not allowing UDP on port 3478. To resolve, confirm that the agent is using a supported browser, and that all traffic is allowed for all required ports and protocols. See <a href=\"https://docs.aws.amazon.com/connect/latest/adminguide/troubleshooting.html#ccp-networking\">CCP Networking</a> and <a href=\"https://docs.aws.amazon.com/connect/latest/adminguide/amazon-connect-contact-control-panel.html#phone-settings\">Phone Settings</a> for more information."
  },
  { 
    message: "realtime_communication_error", 
    cause: "An internal communication error occurred."
  },
  {
    message: "Failed connecting to signaling server",
    cause: "Error connecting the CCP to the Signaling Endpoint (TCP on port 443). This could happen due to a network issue or the required port not being open. Also see <a href=\"https://docs.aws.amazon.com/connect/latest/adminguide/ccp-networking.html\">Set Up Your Network</a> for further reference."
  },
  {
    message: "ICE collection timed out",
    cause: "Error connecting to the Media Endpoint (UDP on port 3478). This could happen due to a network issue or the required port not being open. Also see <a href=\"https://docs.aws.amazon.com/connect/latest/adminguide/ccp-networking.html\">Set Up Your Network</a> for further reference."
  },
  {
    message: "Lost ICE connection",
    cause: "CCP lost ICE connection which means it could not communicate with the Media Endpoint (UDP on port 3478). This could happen due to a network issue."
  },
  {
    message: "Heartbeat response not received",
    cause: "Heartbeat response was not received which means CCP could not connect to API Endpoint ( https://[your-instance].amazonaws.com/connect/api ). Check if you can see heart beats every 30 seconds."
  },
  {
    message: "NetworkError when attempting to fetch resource",
    cause: "This can happen when CCP cannot connect to API Endpoint ( https://[your-instance].amazonaws.com.connect/api ). This could happen due to a network issue or the required port not being open. Also see <a href=\"https://docs.aws.amazon.com/connect/latest/adminguide/ccp-networking.html\">Set Up Your Network</a> for further reference."
  },
  {
    message: "API request failed",
    cause: "API request failed. This could happen due to a network issue or the required port not being open. Also see <a href=\"https://docs.aws.amazon.com/connect/latest/adminguide/ccp-networking.html\">Set Up Your Network</a> for further reference."
  },
  {
    message: "Get new auth token failed",
    cause: "For some reason, an attempt to get a new auth token failed. This could happen due to temporal network issue."
  },
  {
    message: "PendingRemoteHangupState",
    cause: "PendingRemoteHangupState means the call was disconnected by agent side."
  },
  {
    message: "PendingLocalHangupState",
    cause: "PendingLocalHangupState means the call was disconnected by customer side."
  }
];

export default Messages;
