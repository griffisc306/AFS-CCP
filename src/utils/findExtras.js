
// Add your pattern with the following defination:
// {
//     pattern: a pattern javascript likes,
//     case: "give it a distinct name to pass to next stage",
//     group: which match group you want to specify, use 0 to return the whole thing
// },
// at the moment it returns the first match only so the sequence of the array patterns is critical.

const patterns = [
    {
        pattern: /SESSION\sonicecandidate\s(.+)/gs,
        case: "CALLING_OPERATION",
        group: 1,
        messages: "☎ Expand to see SESSION onicecandidate ☎"
    },
    {
        pattern: /SIGNALING\s(Received|Sending)\sSDP\s(.+)/gs,
        case: "PARSE_SDP",
        group: 0,
        messages: "☎ Expand to see SDP signalling info ☎"
    }
]

var handlers = {};

handlers.CALLING_OPERATION = function (input, matched, pattern) {
    input.text = pattern.messages;
    input.objects = [JSON.parse(matched[pattern.group])];
    return input;
};

handlers.PARSE_SDP = function (input, matched, pattern) {
    input.text = pattern.messages;
    input.objects = matched[pattern.group];
    return input;
};

export default function findExtras(logEntry) {
    let a = null;

    for (const pattern of patterns) {
        a = pattern.pattern.exec(logEntry.text);
        if (a !== null) {
            return handlers[pattern.case](logEntry,a, pattern);
        }
    }
    return logEntry;
}
