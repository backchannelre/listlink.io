

///////////////////////////////////////////////////////////////////////////////////////////
// extractProperty
// general UUID generation functions
// Input:
//    object: Object
//    property: String
// Output:
//    return: String
///////////////////////////////////////////////////////////////////////////////////////////
function extractProperty(object,property) {
  var returnValue
  try {
    returnValue = object.property
  } catch {
    returnValue = null
  }
  return returnValue
}

///////////////////////////////////////////////////////////////////////////////////////////
// genDID
// generates a Discrim ID (for URI path)
// Input:
//    length: Int
// Output:
//    return: String
//
///////////////////////////////////////////////////////////////////////////////////////////
function genDID(length) {
    var result = ''
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"
    var charactersLength = characters.length
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
   return result
}

///////////////////////////////////////////////////////////////////////////////////////////
// genGID
// general UUID generation functions
// Input: None
// Output: String variable 
// generates a new random (version 4) UUID as defined in RFC 4122
// reference: https://www.rfc-editor.org/rfc/rfc4122.txt
///////////////////////////////////////////////////////////////////////////////////////////
function genGID() {
  try {
    return String(crypto.randomUUID())
  } catch {
    
    function genLittleID(len) {
      var result = ''
      var characters = 'abcdef0123456789'
      var charactersLength = characters.length
      for ( var i = 0; i < len; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
      }
      return result
    }
    const p1 = genLittleID(8)
    const p2 = genLittleID(4)
    const p3 = genLittleID(4)
    const p4 = genLittleID(4)
    const p5 = genLittleID(12)
    return `${p1}-${p2}-${p3}-${p4}-${p5}`
  }
}

///////////////////////////////////////////////////////////////////////////////////////////
// genCID
// generates a customer ID
// Input: None
// Output: String variable 
// format is C123456
// trailing characters after "C" will always be 0-9
///////////////////////////////////////////////////////////////////////////////////////////
function genCID() {
    var length = 6
    var result = ''
    var characters = "0123456789"
    var charactersLength = characters.length
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return `C${result}`
}

///////////////////////////////////////////////////////////////////////////////////////////
// genTS
// generates a timestamp
// Input: None
// Output: Int
// UTC unix epoch
///////////////////////////////////////////////////////////////////////////////////////////
function genTS() {
    return Math.floor(Date.now())
}

///////////////////////////////////////////////////////////////////////////////////////////
// readRequestBody
// Input:
//    request: Request
// Output:
//    data: String
// 
// function to read the request body. request body has handful of types and we want em all
// !!! the body is not a Body but a ReadableStream !!!
// technically there is JSON, text, form, or Blob
// TECHNICALLY technically it is a ReadableStream
// !!! THE BODY IS NOT A bOdY BUT A ReadableStream !!!
// reference: https://developer.mozilla.org/en-US/docs/Web/API/Request/body
// reference: https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream
// reference: https://developers.cloudflare.com/workers/examples/read-post
// reference: https://community.cloudflare.com/t/how-do-i-read-the-request-body-as-json/155393
///////////////////////////////////////////////////////////////////////////////////////////
async function readRequestBody(request) {
  const method = request.method
  if (method === "POST") {
    return await request.json()
  }
  else {
    return 
  }
}



///////////////////////////////////////////////////////////////////////////////////////////
// genEventLog
// given an event, creates an object enumerating all available data
// major objects:
// event, request, cf
///////////////////////////////////////////////////////////////////////////////////////////
async function genEventLog(event) {
  //  for convience, instantiate the request object
  const request = event.request
  // everything rolls up to this data object
  const data = {
      request: {
  
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // request body
        // requires the helper function readRequestBody to read the body
        // reference: https://developers.cloudflare.com/workers/runtime-apis/request
        // reference: https://developer.mozilla.org/en-US/docs/Web/API/Response/body
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        body: await readRequestBody(request),

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // request.bodyUsed
        // read-only property of the Request interface is a boolean value that indicates whether the request body has been read yet.
        // reference: https://developer.mozilla.org/en-US/docs/Web/API/Request/bodyUsed
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        bodyUsed: await extractProperty(request,"bodyUsed"),

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // request.cache returns the following error
        // "Failed to get the 'cache' property on 'Request': the property is not implemented."
        // mitigation: leave in data object. rely on extractProperty for exception handling
        // reference: https://developer.mozilla.org/en-US/docs/Web/API/Request/cache
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        cache: await extractProperty(request,"cache"),

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // request.credentials returns the following error
        // "Failed to get the 'credentials' property on 'Request': the property is not implemented."
        // mitigation: leave in data object. rely on extractProperty for exception handling
        // reference: https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        credentials: await extractProperty(request,"credentials"),

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // request.destination
        // read-only property of the Request interface returns a string describing the type of content being requested.
        // reference: https://developer.mozilla.org/en-US/docs/Web/API/Request/destination
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        destination: await extractProperty(request,"destination"),

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // request.fetcher
        // no one seems to know what this is, but it is Cloudflare specific
        // reference: https://community.cloudflare.com/t/what-is-the-incoming-request-fetcher-property/255897
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        fetcher: await extractProperty(request,"fetcher"),

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // request headers
        // these are important!!!! but we need a special object to read it
        // reference: https://developers.cloudflare.com/workers/runtime-apis/headers
        // reference: https://developer.mozilla.org/en-US/docs/Web/API/Headers
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        headers: await Object.fromEntries(request.headers),

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // request.integrity returns the following error
        // "Failed to get the 'integrity' property on 'Request': the property is not implemented."
        // mitigation: leave in data object. rely on extractProperty for exception handling
        // reference: https://developer.mozilla.org/en-US/docs/Web/API/Request/integrity
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        integrity: await extractProperty(request,"integrity"),

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // request.method
        // HTTP method
        // reference: https://developers.cloudflare.com/workers/runtime-apis/request#methods
        // reference: https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        method: await extractProperty(request,"method"),

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // request.mode returns the following error
        // "Failed to get the 'mode' property on 'Request': the property is not implemented."
        // mitigation: leave in data object. rely on extractProperty for exception handling
        // reference: https://developer.mozilla.org/en-US/docs/Web/API/Request/mode
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        integrity: await extractProperty(request,"mode"),

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // request.redirect
        // read-only property of the Request interface contains the mode for how redirects are handled.
        // reference: https://developer.mozilla.org/en-US/docs/Web/API/Request/redirect
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        redirect: await extractProperty(request,"redirect"),

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // request.redirect
        // this will generate a lot of redundant data, lets drop it
        // reference: https://developers.cloudflare.com/workers/runtime-apis/request
        // reference: https://developer.mozilla.org/en-US/docs/Web/API/Request
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //request: await request,

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // request.redirect
        // this will generate a lot of redundant data, lets drop it
        // reference: https://developers.cloudflare.com/workers/runtime-apis/request
        // reference: https://developer.mozilla.org/en-US/docs/Web/API/Request
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        referrer: await extractProperty(request,"referrer"),

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // request.referrerPolicy
        // "read-only property of the Request interface returns the referrer policy,
        // which governs what referrer information, sent in the Referer header, should be included with the request." ok
        // reference: https://developer.mozilla.org/en-US/docs/Web/API/Request/referrerPolicy
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        referrerPolicy: await extractProperty(request,"referrerPolicy"),

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // request.signal
        // reference: https://fetch.spec.whatwg.org/#request-signal
        // reference: https://stackoverflow.com/questions/62519444/request-signal-property-in-fetch-api
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        signal: await extractProperty(request,"signal"),

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // request.url
        // reference: https://developers.cloudflare.com/workers/runtime-apis/request
        // reference: https://developer.mozilla.org/en-US/docs/Web/API/URL
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        url: new URL(request.url),
        
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // request URL path
        // reference: https://developers.cloudflare.com/workers/runtime-apis/request
        // reference: https://developer.mozilla.org/en-US/docs/Web/API/URL/pathname
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        path: new URL(request.url).pathname
      },

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // very import cloudflare object. soooo important
      // reference: https://developers.cloudflare.com/workers/runtime-apis/request#incomingrequestcfproperties
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      cf: request.cf,
      // Constructor enumeration. no need
      /*
      {
        cf: request.cf,
        apps: request.cf.apps,
        cacheEverything: request.cf.cacheEverything,
        cacheKey: request.cf.cacheKey,
        cacheTtl: request.cf.cacheTtl,
        cacheTtlByStatus: request.cf.cacheTtlByStatus,
        minify: request.cf.minify,
        mirage: request.cf.mirage,
        polish: request.cf.polish,
        resolveOverride: request.cf.resolveOverride,
        scrapeShield: request.cf.scrapeShield
      },
      */

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // event
      // this is not completely what you may expect when reading the MDN spec for event.
      // per usual, cloudflare has a funky flavor of its own and thus we cannot expect conventional behavior
      // reference: https://developers.cloudflare.com/workers/runtime-apis/fetch-event
      // reference: https://developer.mozilla.org/en-US/docs/Web/API/Event/Event
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      event: {
        
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // event.bubbles
        // read-only property of the Event interface indicates whether the event bubbles up through the DOM or not.
        // reference: https://developer.mozilla.org/en-US/docs/Web/API/Event/bubbles
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //bubbles: await extractProperty(event,"bubbles"),
        bubbles: await event.bubbles,

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // event.cancelBubble
        // The cancelBubble property of the Event interface is a historical alias to Event.stopPropagation().
        // Setting its value to true before returning from an event handler prevents propagation of the event.
        // In later implementations, setting this to false does nothing. See Browser compatibility for details.
        // reference: https://developer.mozilla.org/en-US/docs/Web/API/Event/cancelBubble
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //cancelBubble: await extractProperty(event,"cancelBubble"),
        cancelBubble: await event.cancelBubble,

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // event.cancelable
        // read-only property of the Event interface indicates whether the event can be canceled,
        // and therefore prevented as if the event never happened.
        // reference: https://developer.mozilla.org/en-US/docs/Web/API/Event/cancelable
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //cancelable: await extractProperty(event,"cancelable"),
        cancelable: await event.cancelable,

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // event.composed
        // The read-only composed property of the Event interface returns a boolean value which indicates whether or not the event will
        // propagate across the shadow DOM boundary into the standard DOM.
        // reference: https://developer.mozilla.org/en-US/docs/Web/API/Event/composed
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //composed: await extractProperty(event,"composed"),
        composed: await event.composed,

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // event.currentTarget returns the following error
        //"Converting circular structure to JSON\n    --> starting at object with constructor 'ServiceWorkerGlobalScope'\n    --- property 'self' closes the circle"
        // mitigation: enumerate the data listed in safeStringify. use extractProperty to handle bad values.
        // reference: https://developer.mozilla.org/en-US/docs/Web/API/Event/currentTarget
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        currentTarget: {
            caches: await extractProperty(event.currentTarget,"caches"),
            crypto: await extractProperty(event.currentTarget,"crypto"),
            tx_auth: await extractProperty(event.currentTarget,"tx_auth"),
            tx_tnr: await extractProperty(event.currentTarget,"tx_tnr"),
            tx_data: await extractProperty(event.currentTarget,"tx_data"),
        },
        
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // event.deepPath returns the following error
        //"Converting circular structure to JSON\n    --> starting at object with constructor 'ServiceWorkerGlobalScope'\n    --- property 'self' closes the circle"
        // mitigation: conform to composedPath. rename as composedPath:
        // The composedPath() method of the Event interface returns the event’s path which is an array of the objects on which listeners will be invoked.
        // This does not include nodes in shadow trees if the shadow root was created with its ShadowRoot.mode closed.
        // reference: https://developer.mozilla.org/en-US/docs/Web/API/Event/deepPath
        // reference: https://developer.mozilla.org/en-US/docs/Web/API/Event/composedPath
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        composedPath: await extractProperty(event,"composedPath"),

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // event.defaultPrevented
        // The defaultPrevented read-only property of the Event interface returns a boolean value
        // indicating whether or not the call to Event.preventDefault() canceled the event.
        // reference: https://developer.mozilla.org/en-US/docs/Web/API/Event/defaultPrevented
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        defaultPrevented: await extractProperty(event,"defaultPrevented"),
        
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // event.eventPhase
        // The eventPhase read-only property of the Event interface indicates which phase of the event flow is currently being evaluated.
        // reference: https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        eventPhase: await extractProperty(event,"eventPhase"),
        
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // event.explicitOriginal returns the following error
        //"Converting circular structure to JSON\n    --> starting at object with constructor 'ServiceWorkerGlobalScope'\n    --- property 'self' closes the circle"
        // mitigation: conform to explicitOriginalTarget
        // Non-standard: "The explicit original target of the event. (Mozilla-specific)"
        // reference: https://developer.mozilla.org/en-US/docs/Web/API/Event/explicitOriginalTarget
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        explicitOriginalTarget: await extractProperty(event,"explicitOriginalTarget"),
        
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // event.originalTarget
        // Non-standard: The original target of the event before any retargetings. (Mozilla-specific)
        // reference: https://developer.mozilla.org/en-US/docs/Web/API/Event/originalTarget
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        originalTarget: await extractProperty(event,"originalTarget"),
        
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // event.returnValue
        // Deprecated: The Event property returnValue indicates whether the default action for this event has been prevented or not.
        // reference: https://developer.mozilla.org/en-US/docs/Web/API/Event/returnValue
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        returnValue: await extractProperty(event,"returnValue"),
        
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // event.srcElement returns the following error
        //"Converting circular structure to JSON\n    --> starting at object with constructor 'ServiceWorkerGlobalScope'\n    --- property 'self' closes the circle"
        // MDN notes that it is deprecated:
        // "Event.srcElement is a now-standard alias for the Event.target property."
        // mitigation: removing from data object use safeStringify
        // reference: https://developer.mozilla.org/en-US/docs/Web/API/Event/srcElement
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //srcElement: await JSON.safeStringify(event.srcElement), 
        
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // event.target
        // The target property of the Event interface is a reference to the object onto which the event was dispatched. 
        // reference: https://developer.mozilla.org/en-US/docs/Web/API/Event/target
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        target: await extractProperty(event,"target"),
        
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // event.timeStamp
        // The timeStamp read-only property of the Event interface returns the time (in milliseconds) at which the event was created.
        // reference: https://developer.mozilla.org/en-US/docs/Web/API/Event/timeStamp
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        timeStamp: await extractProperty(event,"timeStamp"),
        
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // event.type
        // The type read-only property of the Event interface returns a string containing the event's type.
        // reference: https://developer.mozilla.org/en-US/docs/Web/API/Event/type
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        type: await extractProperty(event,"type"),
        
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // event.isTrusted
        // The isTrusted read-only property of the Event interface is a boolean value that is true when the event was generated by a user action,
        // and false when the event was created or modified by a script or dispatched via EventTarget.dispatchEvent().
        // reference: https://developer.mozilla.org/en-US/docs/Web/API/Event/isTrusted
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //isTrusted: await extractProperty(event,"isTrusted"),
        isTrusted: await event.isTrusted,
        
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // event.scoped
        // Event.composed: This property was formerly named scoped.
        // The read-only composed property of the Event interface returns a boolean value which indicates whether or not the event will propagate across the shadow DOM boundary into the standard DOM.
        // reference: https://developer.mozilla.org/en-US/docs/Web/API/Event/scoped
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //scoped: await extractProperty(event,"scoped"),
        scoped: await event.scoped,
        //composed: await extractProperty(event,"composed"),
        composed: await event.listener,

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // event.listener
        // https://developers.cloudflare.com/workers/runtime-apis/add-event-listener
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //listener: await extractProperty(event,"listener")
        listener: await event.listener
      }
  }
  // return the data object
  return data
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// getMetaTags
// gets the destination website's HTML Meta tags
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function getMetaTags(k,target) {
  var destination
  var url = String(target)
  var https_prefix = 'https://'
  var http_prefix = 'http://'
  if (url.substr(0, https_prefix.length) !== https_prefix) {
    if (url.substr(0, http_prefix.length) !== http_prefix) {
      destination = https_prefix + url;
    }
  }
  try {
    const res = await fetch(destination,{
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36'
      }
    })
    const html = await res.text()
    const head = html.replace('< head','<head').split('<head')[1].replace('/ head','/head').split('/head')[0]
    var content
    head.split('\n').forEach((row) => {
        const row_lead = row.substr(0,6).toLowerCase().replace(' ','')
        if (row_lead.includes('<meta') || row_lead.includes('<title') && row != undefined) {
          if (!row.includes('undefined'))  {
            content += row
          }
          
        }
    })
    content = content.replace('<undefined>','')
    content = content.replace('undefined>','')
    content = content.replace('undefined','')
    if (content[0] === '<') {
      content = content.substr(1,content.length)
    }
    await tx_html_meta.put(k,content)
    return content
  } catch (err) {
    return '<title>Redirecting...</title>'
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// getURIArray
// returns an array of the uri path
// URIType is a string of either "/l/","/e/","/c/"
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getURIArray(url){
  urlArray = url.pathname.split("/")
  if (urlArray[0] === "") {
    urlArray.shift()
  }
  if (urlArray === undefined) {
    return null
  }
  if (urlArray.length === 0) {
    return null
  }
  else {
    return urlArray
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// getURIComponents
// returns an array of the uri path
// URIType is a string of either "/l/","/e/","/c/"
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getURIComponents(url,URIType){
  return url.pathname.split(URIType)[1].split("/")
}


async function uap(user_agent_string) {
  !function(r,u){"use strict";var c="function",i="undefined",m="object",s="model",e="name",o="type",n="vendor",a="version",d="architecture",t="console",l="mobile",w="tablet",b="smarttv",p="wearable",f={extend:function(i,s){var e={};for(var o in i)s[o]&&s[o].length%2==0?e[o]=s[o].concat(i[o]):e[o]=i[o];return e},has:function(i,s){return"string"==typeof i&&-1!==s.toLowerCase().indexOf(i.toLowerCase())},lowerize:function(i){return i.toLowerCase()},major:function(i){return"string"==typeof i?i.replace(/[^\d\.]/g,"").split(".")[0]:u},trim:function(i){return i.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,"")}},g={rgx:function(i,s){for(var e,o,r,n,a,d,t=0;t<s.length&&!a;){var l=s[t],w=s[t+1];for(e=o=0;e<l.length&&!a;)if(a=l[e++].exec(i))for(r=0;r<w.length;r++)d=a[++o],typeof(n=w[r])==m&&0<n.length?2==n.length?typeof n[1]==c?this[n[0]]=n[1].call(this,d):this[n[0]]=n[1]:3==n.length?typeof n[1]!=c||n[1].exec&&n[1].test?this[n[0]]=d?d.replace(n[1],n[2]):u:this[n[0]]=d?n[1].call(this,d,n[2]):u:4==n.length&&(this[n[0]]=d?n[3].call(this,d.replace(n[1],n[2])):u):this[n]=d||u;t+=2}},str:function(i,s){for(var e in s)if(typeof s[e]==m&&0<s[e].length){for(var o=0;o<s[e].length;o++)if(f.has(s[e][o],i))return"?"===e?u:e}else if(f.has(s[e],i))return"?"===e?u:e;return i}},h={browser:{oldsafari:{version:{"1.0":"/8",1.2:"/1",1.3:"/3","2.0":"/412","2.0.2":"/416","2.0.3":"/417","2.0.4":"/419","?":"/"}}},device:{amazon:{model:{"Fire Phone":["SD","KF"]}},sprint:{model:{"Evo Shift 4G":"7373KT"},vendor:{HTC:"APA",Sprint:"Sprint"}}},os:{windows:{version:{ME:"4.90","NT 3.11":"NT3.51","NT 4.0":"NT4.0",2e3:"NT 5.0",XP:["NT 5.1","NT 5.2"],Vista:"NT 6.0",7:"NT 6.1",8:"NT 6.2",8.1:"NT 6.3",10:["NT 6.4","NT 10.0"],RT:"ARM"}}}},v={browser:[[/(opera\smini)\/([\w\.-]+)/i,/(opera\s[mobiletab]+).+version\/([\w\.-]+)/i,/(opera).+version\/([\w\.]+)/i,/(opera)[\/\s]+([\w\.]+)/i],[e,a],[/(opios)[\/\s]+([\w\.]+)/i],[[e,"Opera Mini"],a],[/\s(opr)\/([\w\.]+)/i],[[e,"Opera"],a],[/(kindle)\/([\w\.]+)/i,/(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?([\w\.]*)/i,/(avant\s|iemobile|slim|baidu)(?:browser)?[\/\s]?([\w\.]*)/i,/(?:ms|\()(ie)\s([\w\.]+)/i,/(rekonq)\/([\w\.]*)/i,/(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon)\/([\w\.-]+)/i],[e,a],[/(konqueror)\/([\w\.]+)/i],[[e,"Konqueror"],a],[/(trident).+rv[:\s]([\w\.]+).+like\sgecko/i],[[e,"IE"],a],[/(edge|edgios|edga|edg)\/((\d+)?[\w\.]+)/i],[[e,"Edge"],a],[/(yabrowser)\/([\w\.]+)/i],[[e,"Yandex"],a],[/(puffin)\/([\w\.]+)/i],[[e,"Puffin"],a],[/(focus)\/([\w\.]+)/i],[[e,"Firefox Focus"],a],[/(opt)\/([\w\.]+)/i],[[e,"Opera Touch"],a],[/((?:[\s\/])uc?\s?browser|(?:juc.+)ucweb)[\/\s]?([\w\.]+)/i],[[e,"UCBrowser"],a],[/(comodo_dragon)\/([\w\.]+)/i],[[e,/_/g," "],a],[/(windowswechat qbcore)\/([\w\.]+)/i],[[e,"WeChat(Win) Desktop"],a],[/(micromessenger)\/([\w\.]+)/i],[[e,"WeChat"],a],[/(brave)\/([\w\.]+)/i],[[e,"Brave"],a],[/(qqbrowserlite)\/([\w\.]+)/i],[e,a],[/(QQ)\/([\d\.]+)/i],[e,a],[/m?(qqbrowser)[\/\s]?([\w\.]+)/i],[e,a],[/(BIDUBrowser)[\/\s]?([\w\.]+)/i],[e,a],[/(2345Explorer)[\/\s]?([\w\.]+)/i],[e,a],[/(MetaSr)[\/\s]?([\w\.]+)/i],[e],[/(LBBROWSER)/i],[e],[/xiaomi\/miuibrowser\/([\w\.]+)/i],[a,[e,"MIUI Browser"]],[/;fbav\/([\w\.]+);/i],[a,[e,"Facebook"]],[/safari\s(line)\/([\w\.]+)/i,/android.+(line)\/([\w\.]+)\/iab/i],[e,a],[/headlesschrome(?:\/([\w\.]+)|\s)/i],[a,[e,"Chrome Headless"]],[/\swv\).+(chrome)\/([\w\.]+)/i],[[e,/(.+)/,"$1 WebView"],a],[/((?:oculus|samsung)browser)\/([\w\.]+)/i],[[e,/(.+(?:g|us))(.+)/,"$1 $2"],a],[/android.+version\/([\w\.]+)\s+(?:mobile\s?safari|safari)*/i],[a,[e,"Android Browser"]],[/(sailfishbrowser)\/([\w\.]+)/i],[[e,"Sailfish Browser"],a],[/(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?([\w\.]+)/i],[e,a],[/(dolfin)\/([\w\.]+)/i],[[e,"Dolphin"],a],[/((?:android.+)crmo|crios)\/([\w\.]+)/i],[[e,"Chrome"],a],[/(coast)\/([\w\.]+)/i],[[e,"Opera Coast"],a],[/fxios\/([\w\.-]+)/i],[a,[e,"Firefox"]],[/version\/([\w\.]+).+?mobile\/\w+\s(safari)/i],[a,[e,"Mobile Safari"]],[/version\/([\w\.]+).+?(mobile\s?safari|safari)/i],[a,e],[/webkit.+?(gsa)\/([\w\.]+).+?(mobile\s?safari|safari)(\/[\w\.]+)/i],[[e,"GSA"],a],[/webkit.+?(mobile\s?safari|safari)(\/[\w\.]+)/i],[e,[a,g.str,h.browser.oldsafari.version]],[/(webkit|khtml)\/([\w\.]+)/i],[e,a],[/(navigator|netscape)\/([\w\.-]+)/i],[[e,"Netscape"],a],[/(swiftfox)/i,/(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?([\w\.\+]+)/i,/(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([\w\.-]+)$/i,/(mozilla)\/([\w\.]+).+rv\:.+gecko\/\d+/i,/(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir)[\/\s]?([\w\.]+)/i,/(links)\s\(([\w\.]+)/i,/(gobrowser)\/?([\w\.]*)/i,/(ice\s?browser)\/v?([\w\._]+)/i,/(mosaic)[\/\s]([\w\.]+)/i],[e,a]],cpu:[[/(?:(amd|x(?:(?:86|64)[_-])?|wow|win)64)[;\)]/i],[[d,"amd64"]],[/(ia32(?=;))/i],[[d,f.lowerize]],[/((?:i[346]|x)86)[;\)]/i],[[d,"ia32"]],[/windows\s(ce|mobile);\sppc;/i],[[d,"arm"]],[/((?:ppc|powerpc)(?:64)?)(?:\smac|;|\))/i],[[d,/ower/,"",f.lowerize]],[/(sun4\w)[;\)]/i],[[d,"sparc"]],[/((?:avr32|ia64(?=;))|68k(?=\))|arm(?:64|(?=v\d+[;l]))|(?=atmel\s)avr|(?:irix|mips|sparc)(?:64)?(?=;)|pa-risc)/i],[[d,f.lowerize]]],device:[[/\((ipad|playbook);[\w\s\),;-]+(rim|apple)/i],[s,n,[o,w]],[/applecoremedia\/[\w\.]+ \((ipad)/],[s,[n,"Apple"],[o,w]],[/(apple\s{0,1}tv)/i],[[s,"Apple TV"],[n,"Apple"]],[/(archos)\s(gamepad2?)/i,/(hp).+(touchpad)/i,/(hp).+(tablet)/i,/(kindle)\/([\w\.]+)/i,/\s(nook)[\w\s]+build\/(\w+)/i,/(dell)\s(strea[kpr\s\d]*[\dko])/i],[n,s,[o,w]],[/(kf[A-z]+)\sbuild\/.+silk\//i],[s,[n,"Amazon"],[o,w]],[/(sd|kf)[0349hijorstuw]+\sbuild\/.+silk\//i],[[s,g.str,h.device.amazon.model],[n,"Amazon"],[o,l]],[/android.+aft([bms])\sbuild/i],[s,[n,"Amazon"],[o,b]],[/\((ip[honed|\s\w*]+);.+(apple)/i],[s,n,[o,l]],[/\((ip[honed|\s\w*]+);/i],[s,[n,"Apple"],[o,l]],[/(blackberry)[\s-]?(\w+)/i,/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[\s_-]?([\w-]*)/i,/(hp)\s([\w\s]+\w)/i,/(asus)-?(\w+)/i],[n,s,[o,l]],[/\(bb10;\s(\w+)/i],[s,[n,"BlackBerry"],[o,l]],[/android.+(transfo[prime\s]{4,10}\s\w+|eeepc|slider\s\w+|nexus 7|padfone|p00c)/i],[s,[n,"Asus"],[o,w]],[/(sony)\s(tablet\s[ps])\sbuild\//i,/(sony)?(?:sgp.+)\sbuild\//i],[[n,"Sony"],[s,"Xperia Tablet"],[o,w]],[/android.+\s([c-g]\d{4}|so[-l]\w+)(?=\sbuild\/|\).+chrome\/(?![1-6]{0,1}\d\.))/i],[s,[n,"Sony"],[o,l]],[/\s(ouya)\s/i,/(nintendo)\s([wids3u]+)/i],[n,s,[o,t]],[/android.+;\s(shield)\sbuild/i],[s,[n,"Nvidia"],[o,t]],[/(playstation\s[34portablevi]+)/i],[s,[n,"Sony"],[o,t]],[/(sprint\s(\w+))/i],[[n,g.str,h.device.sprint.vendor],[s,g.str,h.device.sprint.model],[o,l]],[/(htc)[;_\s-]+([\w\s]+(?=\)|\sbuild)|\w+)/i,/(zte)-(\w*)/i,/(alcatel|geeksphone|nexian|panasonic|(?=;\s)sony)[_\s-]?([\w-]*)/i],[n,[s,/_/g," "],[o,l]],[/(nexus\s9)/i],[s,[n,"HTC"],[o,w]],[/d\/huawei([\w\s-]+)[;\)]/i,/(nexus\s6p)/i],[s,[n,"Huawei"],[o,l]],[/(microsoft);\s(lumia[\s\w]+)/i],[n,s,[o,l]],[/[\s\(;](xbox(?:\sone)?)[\s\);]/i],[s,[n,"Microsoft"],[o,t]],[/(kin\.[onetw]{3})/i],[[s,/\./g," "],[n,"Microsoft"],[o,l]],[/\s(milestone|droid(?:[2-4x]|\s(?:bionic|x2|pro|razr))?:?(\s4g)?)[\w\s]+build\//i,/mot[\s-]?(\w*)/i,/(XT\d{3,4}) build\//i,/(nexus\s6)/i],[s,[n,"Motorola"],[o,l]],[/android.+\s(mz60\d|xoom[\s2]{0,2})\sbuild\//i],[s,[n,"Motorola"],[o,w]],[/hbbtv\/\d+\.\d+\.\d+\s+\([\w\s]*;\s*(\w[^;]*);([^;]*)/i],[[n,f.trim],[s,f.trim],[o,b]],[/hbbtv.+maple;(\d+)/i],[[s,/^/,"SmartTV"],[n,"Samsung"],[o,b]],[/\(dtv[\);].+(aquos)/i],[s,[n,"Sharp"],[o,b]],[/android.+((sch-i[89]0\d|shw-m380s|gt-p\d{4}|gt-n\d+|sgh-t8[56]9|nexus 10))/i,/((SM-T\w+))/i],[[n,"Samsung"],s,[o,w]],[/smart-tv.+(samsung)/i],[n,[o,b],s],[/((s[cgp]h-\w+|gt-\w+|galaxy\snexus|sm-\w[\w\d]+))/i,/(sam[sung]*)[\s-]*(\w+-?[\w-]*)/i,/sec-((sgh\w+))/i],[[n,"Samsung"],s,[o,l]],[/sie-(\w*)/i],[s,[n,"Siemens"],[o,l]],[/(maemo|nokia).*(n900|lumia\s\d+)/i,/(nokia)[\s_-]?([\w-]*)/i],[[n,"Nokia"],s,[o,l]],[/android[x\d\.\s;]+\s([ab][1-7]\-?[0178a]\d\d?)/i],[s,[n,"Acer"],[o,w]],[/android.+([vl]k\-?\d{3})\s+build/i],[s,[n,"LG"],[o,w]],[/android\s3\.[\s\w;-]{10}(lg?)-([06cv9]{3,4})/i],[[n,"LG"],s,[o,w]],[/(lg) netcast\.tv/i],[n,s,[o,b]],[/(nexus\s[45])/i,/lg[e;\s\/-]+(\w*)/i,/android.+lg(\-?[\d\w]+)\s+build/i],[s,[n,"LG"],[o,l]],[/(lenovo)\s?(s(?:5000|6000)(?:[\w-]+)|tab(?:[\s\w]+))/i],[n,s,[o,w]],[/android.+(ideatab[a-z0-9\-\s]+)/i],[s,[n,"Lenovo"],[o,w]],[/(lenovo)[_\s-]?([\w-]+)/i],[n,s,[o,l]],[/linux;.+((jolla));/i],[n,s,[o,l]],[/((pebble))app\/[\d\.]+\s/i],[n,s,[o,p]],[/android.+;\s(oppo)\s?([\w\s]+)\sbuild/i],[n,s,[o,l]],[/crkey/i],[[s,"Chromecast"],[n,"Google"]],[/android.+;\s(glass)\s\d/i],[s,[n,"Google"],[o,p]],[/android.+;\s(pixel c)[\s)]/i],[s,[n,"Google"],[o,w]],[/android.+;\s(pixel( [23])?( xl)?)[\s)]/i],[s,[n,"Google"],[o,l]],[/android.+;\s(\w+)\s+build\/hm\1/i,/android.+(hm[\s\-_]*note?[\s_]*(?:\d\w)?)\s+build/i,/android.+(mi[\s\-_]*(?:a\d|one|one[\s_]plus|note lte)?[\s_]*(?:\d?\w?)[\s_]*(?:plus)?)\s+build/i,/android.+(redmi[\s\-_]*(?:note)?(?:[\s_]*[\w\s]+))\s+build/i],[[s,/_/g," "],[n,"Xiaomi"],[o,l]],[/android.+(mi[\s\-_]*(?:pad)(?:[\s_]*[\w\s]+))\s+build/i],[[s,/_/g," "],[n,"Xiaomi"],[o,w]],[/android.+;\s(m[1-5]\snote)\sbuild/i],[s,[n,"Meizu"],[o,l]],[/(mz)-([\w-]{2,})/i],[[n,"Meizu"],s,[o,l]],[/android.+a000(1)\s+build/i,/android.+oneplus\s(a\d{4})\s+build/i],[s,[n,"OnePlus"],[o,l]],[/android.+[;\/]\s*(RCT[\d\w]+)\s+build/i],[s,[n,"RCA"],[o,w]],[/android.+[;\/\s]+(Venue[\d\s]{2,7})\s+build/i],[s,[n,"Dell"],[o,w]],[/android.+[;\/]\s*(Q[T|M][\d\w]+)\s+build/i],[s,[n,"Verizon"],[o,w]],[/android.+[;\/]\s+(Barnes[&\s]+Noble\s+|BN[RT])(V?.*)\s+build/i],[[n,"Barnes & Noble"],s,[o,w]],[/android.+[;\/]\s+(TM\d{3}.*\b)\s+build/i],[s,[n,"NuVision"],[o,w]],[/android.+;\s(k88)\sbuild/i],[s,[n,"ZTE"],[o,w]],[/android.+[;\/]\s*(gen\d{3})\s+build.*49h/i],[s,[n,"Swiss"],[o,l]],[/android.+[;\/]\s*(zur\d{3})\s+build/i],[s,[n,"Swiss"],[o,w]],[/android.+[;\/]\s*((Zeki)?TB.*\b)\s+build/i],[s,[n,"Zeki"],[o,w]],[/(android).+[;\/]\s+([YR]\d{2})\s+build/i,/android.+[;\/]\s+(Dragon[\-\s]+Touch\s+|DT)(\w{5})\sbuild/i],[[n,"Dragon Touch"],s,[o,w]],[/android.+[;\/]\s*(NS-?\w{0,9})\sbuild/i],[s,[n,"Insignia"],[o,w]],[/android.+[;\/]\s*((NX|Next)-?\w{0,9})\s+build/i],[s,[n,"NextBook"],[o,w]],[/android.+[;\/]\s*(Xtreme\_)?(V(1[045]|2[015]|30|40|60|7[05]|90))\s+build/i],[[n,"Voice"],s,[o,l]],[/android.+[;\/]\s*(LVTEL\-)?(V1[12])\s+build/i],[[n,"LvTel"],s,[o,l]],[/android.+;\s(PH-1)\s/i],[s,[n,"Essential"],[o,l]],[/android.+[;\/]\s*(V(100MD|700NA|7011|917G).*\b)\s+build/i],[s,[n,"Envizen"],[o,w]],[/android.+[;\/]\s*(Le[\s\-]+Pan)[\s\-]+(\w{1,9})\s+build/i],[n,s,[o,w]],[/android.+[;\/]\s*(Trio[\s\-]*.*)\s+build/i],[s,[n,"MachSpeed"],[o,w]],[/android.+[;\/]\s*(Trinity)[\-\s]*(T\d{3})\s+build/i],[n,s,[o,w]],[/android.+[;\/]\s*TU_(1491)\s+build/i],[s,[n,"Rotor"],[o,w]],[/android.+(KS(.+))\s+build/i],[s,[n,"Amazon"],[o,w]],[/android.+(Gigaset)[\s\-]+(Q\w{1,9})\s+build/i],[n,s,[o,w]],[/\s(tablet|tab)[;\/]/i,/\s(mobile)(?:[;\/]|\ssafari)/i],[[o,f.lowerize],n,s],[/[\s\/\(](smart-?tv)[;\)]/i],[[o,b]],[/(android[\w\.\s\-]{0,9});.+build/i],[s,[n,"Generic"]]],engine:[[/windows.+\sedge\/([\w\.]+)/i],[a,[e,"EdgeHTML"]],[/webkit\/537\.36.+chrome\/(?!27)/i],[[e,"Blink"]],[/(presto)\/([\w\.]+)/i,/(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i,/(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i,/(icab)[\/\s]([23]\.[\d\.]+)/i],[e,a],[/rv\:([\w\.]{1,9}).+(gecko)/i],[a,e]],os:[[/microsoft\s(windows)\s(vista|xp)/i],[e,a],[/(windows)\snt\s6\.2;\s(arm)/i,/(windows\sphone(?:\sos)*)[\s\/]?([\d\.\s\w]*)/i,/(windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i],[e,[a,g.str,h.os.windows.version]],[/(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i],[[e,"Windows"],[a,g.str,h.os.windows.version]],[/\((bb)(10);/i],[[e,"BlackBerry"],a],[/(blackberry)\w*\/?([\w\.]*)/i,/(tizen)[\/\s]([\w\.]+)/i,/(android|webos|palm\sos|qnx|bada|rim\stablet\sos|meego|sailfish|contiki)[\/\s-]?([\w\.]*)/i],[e,a],[/(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]*)/i],[[e,"Symbian"],a],[/\((series40);/i],[e],[/mozilla.+\(mobile;.+gecko.+firefox/i],[[e,"Firefox OS"],a],[/(nintendo|playstation)\s([wids34portablevu]+)/i,/(mint)[\/\s\(]?(\w*)/i,/(mageia|vectorlinux)[;\s]/i,/(joli|[kxln]?ubuntu|debian|suse|opensuse|gentoo|(?=\s)arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[\/\s-]?(?!chrom)([\w\.-]*)/i,/(hurd|linux)\s?([\w\.]*)/i,/(gnu)\s?([\w\.]*)/i],[e,a],[/(cros)\s[\w]+\s([\w\.]+\w)/i],[[e,"Chromium OS"],a],[/(sunos)\s?([\w\.\d]*)/i],[[e,"Solaris"],a],[/\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]*)/i],[e,a],[/(haiku)\s(\w+)/i],[e,a],[/cfnetwork\/.+darwin/i,/ip[honead]{2,4}(?:.*os\s([\w]+)\slike\smac|;\sopera)/i],[[a,/_/g,"."],[e,"iOS"]],[/(mac\sos\sx)\s?([\w\s\.]*)/i,/(macintosh|mac(?=_powerpc)\s)/i],[[e,"Mac OS"],[a,/_/g,"."]],[/((?:open)?solaris)[\/\s-]?([\w\.]*)/i,/(aix)\s((\d)(?=\.|\)|\s)[\w\.])*/i,/(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms|fuchsia)/i,/(unix)\s?([\w\.]*)/i],[e,a]]},x=function(i,s){if("object"==typeof i&&(s=i,i=u),!(this instanceof x))return new x(i,s).getResult();var e=i||(r&&r.navigator&&r.navigator.userAgent?r.navigator.userAgent:""),o=s?f.extend(v,s):v;return this.getBrowser=function(){var i={name:u,version:u};return g.rgx.call(i,e,o.browser),i.major=f.major(i.version),i},this.getCPU=function(){var i={architecture:u};return g.rgx.call(i,e,o.cpu),i},this.getDevice=function(){var i={vendor:u,model:u,type:u};return g.rgx.call(i,e,o.device),i},this.getEngine=function(){var i={name:u,version:u};return g.rgx.call(i,e,o.engine),i},this.getOS=function(){var i={name:u,version:u};return g.rgx.call(i,e,o.os),i},this.getResult=function(){return{ua:this.getUA(),browser:this.getBrowser(),engine:this.getEngine(),os:this.getOS(),device:this.getDevice(),cpu:this.getCPU()}},this.getUA=function(){return e},this.setUA=function(i){return e=i,this},this};x.VERSION="0.7.20",x.BROWSER={NAME:e,MAJOR:"major",VERSION:a},x.CPU={ARCHITECTURE:d},x.DEVICE={MODEL:s,VENDOR:n,TYPE:o,CONSOLE:t,MOBILE:l,SMARTTV:b,TABLET:w,WEARABLE:p,EMBEDDED:"embedded"},x.ENGINE={NAME:e,VERSION:a},x.OS={NAME:e,VERSION:a},typeof exports!=i?(typeof module!=i&&module.exports&&(exports=module.exports=x),exports.UAParser=x):"function"==typeof define&&define.amd?define(function(){return x}):r&&(r.UAParser=x);var k=r&&(r.jQuery||r.Zepto);if(typeof k!=i&&!k.ua){var y=new x;k.ua=y.getResult(),k.ua.get=function(){return y.getUA()},k.ua.set=function(i){y.setUA(i);var s=y.getResult();for(var e in s)k.ua[e]=s[e]}}}("object"==typeof window?window:this);
  var parser = new UAParser()
  parser.setUA(user_agent_string);
  return parser.getResult()
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// sinkToS3
// MASTER OF PUPPETS - SENDS DATA TO AWS S3
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function sinkToS3(data) {
  const LOG_URL = "https://q3pbs5ck8h.execute-api.us-east-1.amazonaws.com/parity-api-dev/master-of-puppets-dev"
  let AUTH = await tx_auth.get("tx-l-master-of-puppets")
  fetch(LOG_URL, {
    headers: {
      'x-api-key': AUTH,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify({
      meta:{
        did:eid,
        topic:"tx-aws-dev"
      },
      data:eventData
    }
    ),
  })
}




// ENRICHMENTS

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// getIPInfo
// gets data from IPInfo
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function getIPInfo(ip) {
  const ipinfo_token =  await tx_auth.get('ipinfo', {type:'text'})
  const data = await fetch(`https://ipinfo.io/${ip}?token=${ipinfo_token}`, {
      headers: {
          'Accept': 'application/json'
      }
  })
  return data.json()
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// getGreynoise
// gets data from GreyNoise
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function getGreynoise(ip) {
  const GN_TOKEN = await tx_auth.get('greynoise', {type:'text'})
  const GN_COMMUNITY_URL = 'https://api.greynoise.io/v3/community/'
  const GN_CONTEXT_URL = 'https://api.greynoise.io/v2/noise/context/'
  const GN_RIOT_URL = 'https://api.greynoise.io/v2/riot/'
  
  var returnData

  const data = await fetch(`${GN_COMMUNITY_URL}${ip}`, {
      headers: {
          'Accept': 'application/json',
          'key': GN_TOKEN
      }
  })
  const COMMUNITY_RESPONSE = data.json()
  if (COMMUNITY_RESPONSE.noise === true) {
    const contextData = await fetch(`${GN_CONTEXT_URL}${ip}`, {
        headers: {
            'Accept': 'application/json',
            'key': GN_TOKEN
        }
    })
    const CONTEXT_RESPONSE = contextData.json()
    returnData = CONTEXT_RESPONSE
  } else {
    returnData = COMMUNITY_RESPONSE
  }
  if (COMMUNITY_RESPONSE.riot === true) {
    const riotData = await fetch(`${GN_RIOT_URL}${ip}`, {
        headers: {
            'Accept': 'application/json',
            'key': GN_TOKEN
        }
    })
    const RIOT_RESPONSE = riotData.json()
    returnData = RIOT_RESPONSE
  } else {
    returnData = COMMUNITY_RESPONSE
  }
  return returnData
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// generateIndexPage
// returns HTML source
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function generateIndexPage(){
  const API_AUTHS = await tx_auth.get('tx-api-auth', {type:'json'})
  var AUTH
  Object.keys(API_AUTHS).forEach((element) => {
    if (API_AUTHS[element]['role'] === 'PUBLIC') {
      AUTH = String(element)
    }
  })
  const html_souce = `<!DOCTYPE html>
  <html>
    <head>
      <title>Telex | Cyber attribution tool</title>
    </head>
    <body>
      <div id="create_collector_div">
        <h2>Make a Link</h2>
        <div class="input-group">
        <div class="form-outline flex-fill">
          <input type="search" id="form1" class="form-control form-control-lg form-style-extra" />
          <label class="form-label text-white-50" for="form1"></label>
          <div class="form-helper pt-2"><span class="font-weight-bold">Suggested:</span> 
          <a href="#!" class="text-white-50">a news article,</a>  
          <a href="#!" class="text-white-50">a pdf document,</a>  
          <a href="#!" class="text-white-50">a raw source file</a>
          </div>
        </div>
        <button id="hyperlink-button" type="button" class="btn btn-primary" onclick="generate()">
          <i class="fas fa-link"></i>
        </button>
        </div>
      </div>
      <script>
        const url = new URL(window.location);
        const host = String(url.hostname);
        const origin = String(url.origin);
        var create_url
        if (origin.slice(-1) === '/') {
          create_url = origin+'create'
        } else {
          create_url = origin+'/create'
        }
        var postUrl = async function(destination_url){
          return fetch(create_url, {
            headers: {
              'x-tx-auth': '${AUTH}',
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Referer': origin
            },
            method: "POST",
            body: JSON.stringify({
              u:destination_url
            }),
          }).then(response => response.json())
        }
        var generate = async function(){
          let url = document.getElementById("form1").value;
          const gotoData = await postUrl(url);
          console.log(gotoData);
          window.location.href=gotoData.goto;
        }
        
      
      // Get the input field
      var input = document.getElementById("form1");
      
      // Execute a function when the user releases a key on the keyboard
      input.addEventListener("keyup", function(event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
          // Cancel the default action, if needed
          event.preventDefault();
          // Trigger the button element with a click
          document.getElementById("hyperlink-button").click();
        }
      });
      </script>
    </body>
  </html>
  `
  return html_souce
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// generateCollectorPage
// returns HTML source
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function generateCollectorPage(COLLECTORDATA){
  const cid = COLLECTORDATA['cid']
  const telex_link = COLLECTORDATA['telex_link']
  const destination_url = COLLECTORDATA['destination_url']
  const createtime = COLLECTORDATA['timestamp']
  const collector_events = COLLECTORDATA['events']
  var event_table = ''
  if (collector_events === undefined) {
    event_table = `No events observed for this collector!`
  } else {
    if (collector_events.length < 1) {
      event_table = `No events observed for this collector!`
    } else {
      event_table = `<table><th><td>timestamp</td><td>event id</td></th><tbody>`
      collector_events.forEach((entry) => {
        const eid = entry['eid']
        const event_timestamp = entry['timestamp']
        event_table += `<tr class="event_table_entry"><td><a href="/e/${eid}">${event_timestamp}</a></td><td>${eid}</td></tr>`
      })
      event_table += `</tbody></table>`
    }
  }
  
  const html_souce = `<!DOCTYPE html>
  <html>
    <head>
      <title>Telex | Collector ${cid}</title>
    </head>
    <body>
    <div id="collector_info_div">
    <h2>Collector Info</h2>
      <ul>
        <li>Collector ID: ${cid}</li>
        <li>Create time: ${createtime}</li>
        <li>Collector Link: <code>${telex_link}</code></li>
        <li>Destination: <code>${destination_url}</code></li>
      </ul>
    </div>
    <div id="event_table_div">
    <h2>Events</h2>
    ${event_table}
    </div>
    </body>
  </html>`
  return html_souce
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// generateEventPage
// returns HTML source
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function generateEventPage(eid){
  return
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// handleIndexPage
// standard Cloudflare worker event handler
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function handleIndexPage() {
  const html_source = await generateIndexPage()

  return new Response(html_source, {
    headers: {
      'content-type':'text/html; charset=UTF-8',
      'Access-Control-Allow-Origin': '*'
    }
  })
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// handleCollectorsPage
// standard Cloudflare worker event handler
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function handleCollectorsPage(cid) {
  const collector_data =  await tx_collectors.get(cid, {type:'json'})
  const html_source = await generateCollectorPage(collector_data)

  return new Response(html_source, {
    headers: {
      'content-type':'text/html; charset=UTF-8',
      'Access-Control-Allow-Origin': '*'
    }
  })
}




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// handleEventsPage
// standard Cloudflare worker event handler
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function getSessionData(sid) {
  const session_data = await tx_sessions.get(sid, {type:'json'})
  console.log(session_data)
  return session_data
}

async function getEventData(eid) {
  const event_data =  await tx_events.get(eid, {type:'json'})
  const timestamp = event_data['timestamp']
  const cid = event_data['cid']
  const collector_data =  await tx_collectors.get(cid, {type:'json'})
  const telex_link = collector_data['telex_link']
  const destination_url = collector_data['destination_url']

  const sessions = event_data['sessions']
  console.log(sessions)
  var sessions_data = []
  if (sessions.length < 1) {
    sessions_data = []
  }
  for (const entry of sessions) {
    const session_data = await getSessionData(entry.sid)
    sessions_data.push({sid:session_data})
  }
  return {
    eid:eid,
    timestamp:timestamp,
    cid:cid,
    telex_link:telex_link,
    destination_url:destination_url,
    data:{
      collector:collector_data,
      event:event_data,
      sessions_data:sessions_data,
      enrichments:event_data['enrichments']
    }
  }
}

async function handleEventsPage(eid) {
  const EVENTDATA = await getEventData(eid)
  const EVENTDATAJSON = JSON.stringify(EVENTDATA.data)
  const timestamp_epoch = EVENTDATA.timestamp
  var timestamp = new Date(0)
  timestamp.setUTCSeconds(timestamp_epoch/1000)
  const cid = EVENTDATA.cid
  const telex_link = EVENTDATA.telex_link
  const destination_url = EVENTDATA.destination_url
  const ip = EVENTDATA['data']['sessions_data'][0]['sid']['raw']['request']['headers']['cf-connecting-ip']
  const cf_country = EVENTDATA['data']['sessions_data'][0]['sid']['raw']['request']['headers']['cf-ipcountry']
  var isTor = false
  var isTor_text =''
  if (cf_country === 'T1') {
    isTor = true
  }
  if (isTor === true){
    isTor_text = `It is highly likely this session originates from <a class="tx-highlight-url" href="https://www.torproject.org">Tor</a>. `
  }

  const ipinfo_object = EVENTDATA['data']['enrichments']['ipinfo']
  const lng = parseFloat(ipinfo_object['loc'].split(',')[1])
  const lat = parseFloat(ipinfo_object['loc'].split(',')[0])
  const ip_city = ipinfo_object.city
  const ip_region = ipinfo_object.region
  const ip_country = ipinfo_object.country
  
  const geo_text = `This event was triggered from the observed IP address <span class="tx-highlight">${ip}</span>, which is likely to be originating from <span class="tx-highlight">${ip_city}</span>,<span class="tx-highlight">${ip_region}</span>, located in <span class="tx-highlight">${ip_country}</span>.<br></br>${isTor_text}For various reasons, IP geolocation is not always accurate at more granular levels beneath a kilometer. If the IP is coming from a VPN, Tor, proxy, or datacenter, then the geolocation will not necessarily indicate the user location.`

  const device_name = EVENTDATA['data']['sessions_data'][2]['sid']['raw']['request']['body']['p']['organic']['navigator']['platform']
  //const device_maker = EVENTDATA['data']['sessions_data'][2]['sid']['raw']['request']['body']['p']['organic']['navigator']['vendor']
  const ua_object = await uap(EVENTDATA['data']['sessions_data'][0]['sid']['raw']['request']['headers']['user-agent'])
  const osver = ua_object.os.version
  const osname = ua_object.os.name
  const bver = ua_object.browser.version
  const bname = ua_object.browser.name
  var ua_object_copy = ua_object
  delete ua_object_copy['ua']
  const ua_json = JSON.stringify(ua_object_copy,null, 2)
  const ip_hostname = ipinfo_object.hostname

  const network_object = {
    asn:EVENTDATA['data']['sessions_data'][0]['sid']['raw']['cf']['asn'],
    aso:EVENTDATA['data']['sessions_data'][0]['sid']['raw']['cf']['asOrganization'],
    hostname:ip_hostname
  }
  const asn = network_object.asn
  const aso = network_object.aso
  var hostname_text = ''
  var tor_hostname_text = ''
  
  if (ip_hostname !== undefined || ip_hostname !== null) {
    if ( ip_hostname.toLowerCase().includes('-tor-') || ip_hostname.toLowerCase().includes('.tor.') || ip_hostname.toLowerCase().includes('-tor') || ip_hostname.toLowerCase().includes('_tor') || ip_hostname.toLowerCase().includes('tor-') || ip_hostname.toLowerCase().includes('tor_') || ip_hostname.toLowerCase().includes('darkweb') || ip_hostname.toLowerCase().includes('darknet') || ip_hostname.toLowerCase().includes('deepweb') ) {
      tor_hostname_text = ` This hostname indicates a high likelihood that this session connected over the <a class="tx-highlight-url" href="https://www.torproject.org">Tor network.</a>`
    }
    hostname_text = ` There is an associated hostname with this network, relating to <span class="tx-highlight">${ip_hostname}</span>.${tor_hostname_text}`
  }
  
  const network_text = `The IP for the event originates from network infrastructure owned or operated by <a class="tx-highlight-url" href="https://ipinfo.io/AS${asn}">${aso}</a>.${hostname_text}`
  const network_json = JSON.stringify({network:network_object},null, 2)
  
  const http_headers_object = EVENTDATA['data']['sessions_data'][0]['sid']['raw']['request']['headers']
  const http_headers_json = JSON.stringify(http_headers_object,null, 2)

  const ipclass_object = EVENTDATA['data']['enrichments']['greynoise']
  var ipclass_classification = ipclass_object.classification
  var ipclass_classification_text = ''
  if (ipclass_classification === undefined || ipclass_classification === null) {
    ipclass_classification_text = `The IP <span class="tx-highlight">${ip}</span> had not been observed by <a class="tx-highlight-url" href="https://www.greynoise.io/viz/ip/${ip}">Greynoise</a> and has not been given a classification that indicates risk.`
  } else {
    ipclass_classification_text = `<a class="tx-highlight-url" href="https://www.greynoise.io/viz/ip/${ip}">Data from Greynoise</a> has given this IP address a classification of <a class="tx-highlight-url" href="https://docs.greynoise.io/docs/understanding-greynoise-classifications#benign">${ipclass_classification}</a>.`
    if (ipclass_classification === 'benign') {
      ipclass_classification_text += ` This means that it is not likely that this session is indiciative of a threat.`
    }
    if (ipclass_classification === 'malicious') {
      ipclass_classification_text += ` This means this session is more likely to be harmful, or originates from internet infrastructure previously observed to be harmful.`
    }
    if (ipclass_classification === 'unknown') {
      ipclass_classification_text += ` This usually is representative of not having enough information to deem the session as malicious or not.`
    }
    const gn_keys = Object.keys(ipclass_object)
    var gn_noise
    var gn_riot
    var ipclass_additional_context
    if (gn_keys.includes('context_api')) {
      const context_api = ipclass_object.context_api
      const context_actor = context_api.actor
      const context_tags = context_api.tags
      const context_vpn = context_api.vpn
      const context_vpn_service = context_api.vpn_service
      const context_tor = context_api.metadata.tor
      var behaviors_text_list = []
      if (context_actor !== undefined && context_actor !== null) {
        behaviors_text_list.push(`${context_actor}`)
      }
      if (context_tags !== undefined && context_tags !== null) {
        context_tags.forEach((ele) => {
          behaviors_text_list.push(ele)
        })
      }
      if (context_vpn === true) {
        var context_vpn_service_text
        if (context_vpn_service === 'N/A' || context_vpn_service === undefined || context_vpn_service === null) {
          context_vpn_service_text = `an unknown VPN service`
        } else {
          context_vpn_service_text = context_vpn_service
        }
        behaviors_text_list.push(`${context_vpn_service_text}`)
      }
      if (context_tor !== undefined && context_tor !== null) {
        var tor_status
        if (context_tor === true) {
          tor_status = `<a class="tx-highlight-url" href="https://www.torproject.org">Tor</a>`
          behaviors_text_list.push(tor_status)
        }
      }
      var behaviors_text = ``
      behaviors_text_list.forEach((ele) => {
        behaviors_text += `, ${ele}`
      })
      behaviors_text_list += '.'
      const gn_context_text = `<p></p>Additional context from Greynoise notes that sessions from this IP address contain behaviors consistent with ${behaviors_text_list}`
      ipclass_classification_text += gn_context_text
    }
    if (gn_keys.includes('riot_api')) {
      const riot_api = ipclass_object.riot_api
      const riot_trust_level = riot_api.trust_level
      const riot_reference = riot_api.name
      const riot_reference_url = riot_api.reference
      var trust_descriptor
      if (riot_trust_level === 1) {
        trust_descriptor = 'highly trusted'
      } else if (riot_trust_level === 2) {
        trust_descriptor = 'moderately trusted'
      } else {
        trust_descriptor = 'untrusted'
      }
      const gn_riot_text = `<p></p>Sessions from this IP address are typically ${trust_descriptor} sessions from <a class="tx-highlight-url" href="${riot_reference_url}">${riot_reference}</a>.`
      ipclass_classification_text += gn_riot_text
    }
  }
  
  const ipclass_text = ipclass_classification_text
  const ipclass_json = JSON.stringify(ipclass_object,null, 2)



  const bext_object = EVENTDATA['data']['sessions_data'][2]['sid']['raw']['request']['body']['p']['crx']
  var actual_bext = []
  if (bext_object != undefined && bext_object != null) {
    bext_object.forEach((el) => {
      if (el.status === 200){
        if (el.crx === 'chrome-extension://kgjfgplpablkjnlkjmjdecgdpfankdle/images/loading_24.gif') {
          actual_bext.push(
            {
              bext:'Zoom Scheduler',
              url:'https://chrome.google.com/webstore/detail/zoom-scheduler/kgjfgplpablkjnlkjmjdecgdpfankdle',
              icon:'https://lh3.googleusercontent.com/7UQ0f962jFVokrpK_iNf2xnQk00iUqdtNegbc73mZUK7h4WXiPgaivwPzb6NmeQsh4-or6dr-2JEAtIl_BxvPS9sGA=w128-h128-e365-rj-sc0x00ffffff'
            }
          )
        }
        if (el.crx === 'chrome-extension://aeblfdkhhhdcdjpifhhbdiojplfjncoa/inline/menu/menu.html') {
          actual_bext.push(
            {
              bext:'1Password – Password Manager',
              url:'https://chrome.google.com/webstore/detail/1password-%E2%80%93-password-mana/aeblfdkhhhdcdjpifhhbdiojplfjncoa',
              icon:'https://lh3.googleusercontent.com/DftM3biDXufonobNWlKgO74qdJosSFjMay_Ku9aIinJwwmtp-hv3Psof4nxKp2mjf6Lgu-pHWPAaPXz7Rs3Uwzen=w128-h128-e365-rj-sc0x00ffffff'
            }
          )
        }
        if (el.crx === 'chrome-extension://hdokiejnpimakedhajhdlcegeplioahd/images/icon48.png') {
          actual_bext.push(
            {
              bext:'LastPass: Free Password Manager',
              url:'https://chrome.google.com/webstore/detail/lastpass-free-password-ma/hdokiejnpimakedhajhdlcegeplioahd',
              icon:'https://lh3.googleusercontent.com/ja60LjC3dHpxO3zElu6qK_NQFKdb-yo7oE2_5XgEKmGQrLRwAlGMp4erfubB457mPPyVs94z7oRBEBimUag0IlhD=w128-h128-e365-rj-sc0x00ffffff'
            }
          )
        }
        if (el.crx === 'chrome-extension://hdokiejnpimakedhajhdlcegeplioahd/images/icon48.png') {
          actual_bext.push(
            {
              bext:'Hola Free VPN Proxy Unblocker - Best VPN',
              url:'https://twitter.com/hola_org/status/1438107933460598784',
              icon:'https://pbs.twimg.com/profile_images/1311620852484628482/j_K0SAy8_400x400.jpg'
            }
          )
        }
      }
    })
  }
  
  var bext_text = ''
  var bext_json
  if (actual_bext.length >= 1) {
    const bext_length = actual_bext.length
    bext_text += `Telex found ${bext_length}, including `
    actual_bext.forEach((el) => {

      bext_text += `<a class="tx-highlight-url" href="${el.url}">${el.bext}</a>`
    })
    bext_json = JSON.stringify(actual_bext,null, 2)
  } else {
    bext_text = `None of the browser extensions we probe for were detected in this session.`
    bext_json = JSON.stringify({msg:bext_text},null,2)
  }

  const gfx_object = EVENTDATA['data']['sessions_data'][2]['sid']['raw']['request']['body']['p']['organic']['wgl']
  var gfx_text = ``
  var gfx_data
  if ( gfx_object.debugInfo.status === 200 && gfx_object.vendor === null && gfx_object.renderer === null ) {
    gfx_text = `This session appears to intentionally hide information about its graphics card.`
    gfx_data = {graphics_card:{msg:gfx_text}}
  } else {
    const gfx_brand = gfx_object['vendor']
    const gfx_name = gfx_object['renderer']
    gfx_text = `The observed graphics card for the session device is a <span class="tx-highlight">${gfx_brand}</span> <span class="tx-highlight">${gfx_name}</span>.`
    gfx_data = {
      graphics_card:{
        brand:gfx_brand,
        name:gfx_name
      }
    }
  }
  
  const gfx_json = JSON.stringify(gfx_data,null, 2)
  //const html_source = await generateCollectorPage(collector_data)
  /* //OG HTML SOURCE
  const html_souce = `<!DOCTYPE html>
  <html>
    <head>
      <title>Telex | Event ${eid}</title>
    </head>
    <body>
    <div id="Event_info_div">
    <h2>Event Info</h2>
      <ul>
        <li>Event ID: ${EVENTDATA.eid}</li>
        <li>Create time: ${EVENTDATA.timestamp}</li>
        <li>Collector ID: ${EVENTDATA.cid}</li>
        <li>Collector Link: <code>${EVENTDATA.telex_link}</code></li>
        <li>Destination: <code>${EVENTDATA.destination_url}</code></li>
      </ul>
    </div>
    <div id="event_table_div">
    <h2>Data</h2>
    <code>
    ${EVENTDATAJSON}
    </code>
    </div>
    </body>
  </html>`
  */
 const html_source = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="Telex by Backchannel">
    <title>Telex | Event ID: ${eid}</title>
    <meta name="description" content="Attribution report for Event ${eid}. Generated by Telex, a cyber attribution tool.">
		<meta name="keywords" content="Telex Report Trust and Safety Business Integrity Platform Integrity Parity Telex Cyber threat analysis Cybersecurity policy Data science Deception operations Intelligence collection Intelligence lifecycle management Cybercrime investigations Malware analysis Malware markets security and privacy Security incident and event management (SIEM)  Security operations Threat analysis Traffic analysis">
		<meta property="og:title" content="Telex | Event ID: ${eid}">
		<meta property="og:image" content="https://urlscan.io/screenshots/0ade550a-95a2-40c1-90a4-a3edba211b93.png">
		<meta property="og:url" content="https://telex.run/e/${eid}">
		<meta property="og:site_name" content="Telex | Cyber attribution tool">
		<meta property="og:description" content="Attribution report for Event ${eid}. Generated by Telex, a cyber attribution tool.">
		<meta name="twitter:title" content="Telex | Event ID: ${eid}">
		<meta name="twitter:image" content="https://urlscan.io/screenshots/0ade550a-95a2-40c1-90a4-a3edba211b93.png">
		<meta name="twitter:url" content="https://telex.run/e/${eid}">
		<meta name="twitter:card" content="Telex | Event ID: ${eid}">
		<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />

    <link rel="canonical" href="https://getbootstrap.comexamples/product/">

    <!-- Bootstrap core CSS -->
<link href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">

<link href="https://api.mapbox.com/mapbox-gl-js/v2.5.1/mapbox-gl.css" rel="stylesheet">
<script src="https://api.mapbox.com/mapbox-gl-js/v2.5.1/mapbox-gl.js"></script>
<style>


    /*
    * Custom translucent site header
    */
  
    .site-header {
      background-color: rgba(0, 0, 0, .85);
      -webkit-backdrop-filter: saturate(180%) blur(20px);
      backdrop-filter: saturate(180%) blur(20px);
    }
    .site-header a {
      color: #999;
      transition: ease-in-out color .15s;
    }
    .site-header a:hover {
      color: #fff;
      text-decoration: none;
    }
  
    /*
    * Dummy devices (replace them with your own or something else entirely!)
    */
  
  
    /*
    * Extra utilities
    */
  
    .flex-equal > * {
      -ms-flex: 1;
      flex: 1;
    }
    @media (min-width: 768px) {
      .flex-md-equal > * {
        -ms-flex: 1;
        flex: 1;
      }
    }
  
    .overflow-hidden { overflow: hidden; }
  
    .event_meta_ul {
      text-decoration: none;
      list-style: none;
      padding-left: 0px;
    }
  
    html,body {
      background: #000;
    }
  
    .bg-dark {
      background-color: #111111;
    }
  
    .rounded {
      border-radius: 21px 21px 21px 21px;
    }
  
  
  
    #map {
      width: 100%;
      height: 100%;
      border-radius: 21px 21px 21px 21px;
    }
  
    .mapboxgl-canvas, .mapboxgl-canvas-container {
      border-radius: 21px 21px 21px 21px;
    }
  
    .tx-dark {
      background-color: #333333;
    }
  
    .tx-title {
      color: #ffffff;
      font-weight: 800;
  
    }
  
    .tx-highlight {
      color: #000;
      background-color: #aaaaaa;
      padding: 3px 3px 3px 3px;
    }
  
    .tx-code {
      font-family: 'Courier New', Courier, monospace;
    }
  
    .tx-highlight-url {
      color: #ffffff;
      background-color: #4936f3;
      padding: 3px 3px 3px 3px;
    }
    .tx-highlight-url:hover {
      color: #ffffff;
      text-decoration: none;
      background-color: #6756ff;
    }
  
    .tx-code-block {
      background-color: #111111;
      overflow: scroll;
    }
  
    .tx-code-block:hover {
      background-color: #222222;
    }

    .tx-code-block-text {
      padding: 20px 20px 20px 20px;
      color: #bcb5ff;
    }

    .tx-code-block-text pre {
      color: #bcb5ff;
    }


  
    .tx-spacer {
      margin:25px 0px 25px 0px;
    }
  
    .tx-footer-text {
      color:#aaaaaa;
    }
  
  
    .tx-footer-h5 {
      color:#ffffff;
    }

    .tx-hidden-till-hover {
      position: absolute;
      text-align: center;
      left:25%;
      height: 100%;
      width: 100%;
      display:none;
    }

    .tx-hidden-till-hover p {
      text-transform: uppercase;
      font-weight: bold;
    }

    .tx-hidden-till-hover svg {
      margin-top:10%;
    }


  
  
      </style>
    <!-- Favicons -->
  <!--
<link rel="apple-touch-icon" href="assets/img/favicons/apple-touch-icon.png" sizes="180x180">
<link rel="icon" href="assets/img/favicons/favicon-32x32.png" sizes="32x32" type="image/png">
<link rel="icon" href="assets/img/favicons/favicon-16x16.png" sizes="16x16" type="image/png">
<link rel="manifest" href="assets/img/favicons/manifest.json">
<link rel="mask-icon" href="assets/img/favicons/safari-pinned-tab.svg" color="#563d7c">
<link rel="icon" href="assets/img/favicons/favicon.ico">
<meta name="msapplication-config" content="assets/img/favicons/browserconfig.xml">
<meta name="theme-color" content="#563d7c">
-->

  </head>
  <body>
    
    <nav class="site-header sticky-top py-1">
  <div class="container d-flex flex-column flex-md-row">
    <a class="py-2" href="/" aria-label="Telex">
      <span class="tx-title">Telex</span>
    </a><span style="padding:0px 15px 0px 15px"></span>
    <a class="py-2 d-none d-md-inline-block" href="#">Features</a><span style="padding:0px 15px 0px 15px"></span>
    <a class="py-2 d-none d-md-inline-block" href="#">Docs</a><span style="padding:0px 15px 0px 15px"></span>
    <a class="py-2 d-none d-md-inline-block" href="#">Help</a><span style="padding:0px 15px 0px 15px"></span>
  </div>
</nav>

<div class="d-md-flex flex-md-equal w-100 my-md-3 pl-md-3">
  <div class="rounded mr-md-3 pt-3 px-3 pt-md-1 px-md-5 text-left text-white overflow-hidden">
    <h2 class="display-5">Event ID: ${eid}</h2>
      <p class="lead">
        <ul class="event_meta_ul">
          <li>Timestamp: ${timestamp}</li>
          <li>Collector: <a class="tx-highlight-url" href="/c/${cid}">${cid}</a></li>
          <li>Telex Link: ${telex_link}</li>
          <li>Destination: ${destination_url}</li>
        </ul>
  </div>
</div>

<div class="tx-spacer"></div>

<!-- TWO COLUMN ROW BOOTSTRAP -->
<div class="d-md-flex flex-md-equal w-100 my-md-3 pl-md-3">
  
  <div class="tx-dark rounded mr-md-3 pt-3 px-3 pt-md-1 px-md-5 text-left text-white overflow-hidden">
    <div class="my-3 py-3">
      <h2 class="display-5">Geolocation</h2>
      <p class="lead">
        ${geo_text}
      </p>
    </div>
  </div>

  <div class="tx-dark rounded mr-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center text-white overflow-hidden">
    <div class="bg-light shadow-sm mx-auto" style="width: 100%; height: 300px; border-radius: 21px 21px 21px 21px;">
      <div id="map"></div>
    </div>
    <div class="my-3 py-3"></div>
  </div>
  
</div>

<div class="tx-spacer"></div>

<!-- TWO COLUMN ROW BOOTSTRAP -->
<div class="d-md-flex flex-md-equal w-100 my-md-3 pl-md-3">
  
  <div class="tx-dark rounded mr-md-3 pt-3 px-3 pt-md-1 px-md-5 text-left text-white overflow-hidden">
    <div class="my-3 py-3">
      <h2 class="display-5">Observed Device Information</h2>
      <p class="lead">
        According to the observed <a class="tx-highlight-url" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent">user agent</a>, the operating system is likely <span class="tx-highlight">${osname}</span> on version <span class="tx-highlight">${osver}</span>. The browser is likely <span class="tx-highlight">${bname}</span> on version <span class="tx-highlight">${bver}</span>. <br></br>User agents are not always reliable indications of the actual device, as they can be easily spoofed.<br></br>Seperate device interrogation from Telex flags this device as a <span class="tx-highlight">${device_name}</span>.
      </p>
      
    </div>
  </div>

  <div class="tx-dark rounded mr-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center text-white overflow-hidden">
    <div class="tx-code-block shadow-sm mx-auto" style="width: 100%; height: 300px; border-radius: 21px 21px 21px 21px;">
      <div class="tx-code-block-text text-left">
        <pre style="color:#bcb5ff">${ua_json}</pre>
      </div>
    </div>
    <div class="my-3 py-3"></div>
  </div>
  
</div>

<div class="tx-spacer"></div>


<!-- TWO COLUMN ROW BOOTSTRAP -->
<div class="d-md-flex flex-md-equal w-100 my-md-3 pl-md-3">
  
  <div class="tx-dark rounded mr-md-3 pt-3 px-3 pt-md-1 px-md-5 text-left text-white overflow-hidden">
    <div class="my-3 py-3">
      <h2 class="display-5">Network Info</h2>
      <p class="lead">
        ${network_text} 
      </p>
    </div>
  </div>

  <div class="tx-dark rounded mr-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center text-white overflow-hidden">
    <div class="tx-code-block shadow-sm mx-auto" style="width: 100%; height: 300px; border-radius: 21px 21px 21px 21px;">
      <div class="tx-code-block-text text-left">
      <pre style="color:#bcb5ff">${network_json}</pre>
      </div>
    </div>
    <div class="my-3 py-3"></div>
  </div>
  
</div>

<div class="tx-spacer"></div>

<!-- TWO COLUMN ROW BOOTSTRAP -->
<div class="d-md-flex flex-md-equal w-100 my-md-3 pl-md-3">
  
  <div class="tx-dark rounded mr-md-3 pt-3 px-3 pt-md-1 px-md-5 text-left text-white overflow-hidden">
    <div class="my-3 py-3">
      <h2 class="display-5">HTTP Headers</h2>
      <p class="lead">
        Other than <a class="tx-highlight-url" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent">user agent</a>, the HTTP <a class="tx-highlight-url" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers">headers</a> in a request can reveal identifying information. 
      </p>
    </div>
  </div>

  <div class="tx-dark rounded mr-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center text-white overflow-hidden">
    <div class="tx-code-block shadow-sm mx-auto" style="width: 100%; height: 300px; border-radius: 21px 21px 21px 21px;">
      <div class="tx-code-block-text text-left">
      
      <pre style="color:#bcb5ff">${http_headers_json}</pre>
      </div>
    </div>
    <div class="my-3 py-3"></div>
  </div>
  
</div>

<div class="tx-spacer"></div>


<!-- TWO COLUMN ROW BOOTSTRAP -->
<div class="d-md-flex flex-md-equal w-100 my-md-3 pl-md-3">
  
  <div class="tx-dark rounded mr-md-3 pt-3 px-3 pt-md-1 px-md-5 text-left text-white overflow-hidden">
    <div class="my-3 py-3">
      <h2 class="display-5">IP Classification</h2>
      <p class="lead">
        ${ipclass_text}
      </p>
    </div>
  </div>

  <div class="tx-dark rounded mr-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center text-white overflow-hidden">
    <div class="tx-code-block shadow-sm mx-auto" style="width: 100%; height: 300px; border-radius: 21px 21px 21px 21px;">
      <div class="tx-code-block-text text-left">
      <pre style="color:#bcb5ff">${ipclass_json}</pre>
      </div>
    </div>
    <div class="my-3 py-3"></div>
  </div>
  
</div>

<div class="tx-spacer"></div>


<!-- TWO COLUMN ROW BOOTSTRAP -->
<div class="d-md-flex flex-md-equal w-100 my-md-3 pl-md-3">
  
  <div class="tx-dark rounded mr-md-3 pt-3 px-3 pt-md-1 px-md-5 text-left text-white overflow-hidden">
    <div class="my-3 py-3">
      <h2 class="display-5">Browser Extensions</h2>
      <p class="lead">
        Telex validates whether a selection of browser extensions are installed on the user device.<br></br>
        ${bext_text}
      </p>
    </div>
  </div>

  <div class="tx-dark rounded mr-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center text-white overflow-hidden">
    <div class="tx-code-block shadow-sm mx-auto" style="width: 100%; height: 300px; border-radius: 21px 21px 21px 21px;">
      <div class="tx-code-block-text text-left">
      <pre style="color:#bcb5ff">${bext_json}</pre>
      </div>
    </div>
    <div class="my-3 py-3"></div>
  </div>
  
</div>

<div class="tx-spacer"></div>


<!-- TWO COLUMN ROW BOOTSTRAP -->
<div class="d-md-flex flex-md-equal w-100 my-md-3 pl-md-3">
  
  <div class="tx-dark rounded mr-md-3 pt-3 px-3 pt-md-1 px-md-5 text-left text-white overflow-hidden">
    <div class="my-3 py-3">
      <h2 class="display-5">Graphics Card</h2>
      <p class="lead">
        ${gfx_text}
      </p>
    </div>
  </div>

  <div class="tx-dark rounded mr-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center text-white overflow-hidden">
    <div class="tx-code-block shadow-sm mx-auto" style="width: 100%; height: 300px; border-radius: 21px 21px 21px 21px;">
      <div class="tx-code-block-text text-left">
      <pre style="color:#bcb5ff">${gfx_json}</pre>
      </div>
    </div>
    <div class="my-3 py-3"></div>
  </div>
  
</div>

<div class="tx-spacer"></div>

<div class="position-relative overflow-hidden p-3 p-md-5 m-md-3 text-center bg-light">
  <div class="col-md-5 p-lg-5 mx-auto my-5">
    <h1 class="display-4 font-weight-normal">Event Timeline</h1>
    <p class="lead font-weight-normal">Lorem Ipsum</p>
    <a class="btn btn-outline-secondary" href="#">Button</a>
  </div>

</div>


<footer class="container py-5">
  <div class="row ">
    <div class="col-12 col-md">
      <h5 class="tx-footer-h5">Telex</h5>
      <small class="d-block mb-3 tx-footer-text">&copy; 2021</small>
    </div>
    <div class="col-6 col-md">
      <h5 class="tx-footer-h5">Features</h5>
      <ul class="list-unstyled text-small">
        <li><a class="tx-footer-text" href="#">Cool stuff</a></li>
        <li><a class="tx-footer-text" href="#">Random feature</a></li>
        <li><a class="tx-footer-text" href="#">Team feature</a></li>
        <li><a class="tx-footer-text" href="#">Stuff for developers</a></li>
        <li><a class="tx-footer-text" href="#">Another one</a></li>
        <li><a class="tx-footer-text" href="#">Last time</a></li>
      </ul>
    </div>
    <div class="col-6 col-md">
      <h5 class="tx-footer-h5">Resources</h5>
      <ul class="list-unstyled text-small">
        <li><a class="tx-footer-text" href="#">Resource</a></li>
        <li><a class="tx-footer-text" href="#">Resource name</a></li>
        <li><a class="tx-footer-text" href="#">Another resource</a></li>
        <li><a class="tx-footer-text" href="#">Final resource</a></li>
      </ul>
    </div>
    <div class="col-6 col-md">
      <h5 class="tx-footer-h5">Resources</h5>
      <ul class="list-unstyled text-small">
        <li><a class="tx-footer-text" href="#">Business</a></li>
        <li><a class="tx-footer-text" href="#">Education</a></li>
        <li><a class="tx-footer-text" href="#">Government</a></li>
        <li><a class="tx-footer-text" href="#">Gaming</a></li>
      </ul>
    </div>
    <div class="col-6 col-md">
      <h5 class="tx-footer-h5">About</h5>
      <ul class="list-unstyled text-small">
        <li><a class="tx-footer-text" href="#">Team</a></li>
        <li><a class="tx-footer-text" href="#">Locations</a></li>
        <li><a class="tx-footer-text" href="#">Privacy</a></li>
        <li><a class="tx-footer-text" href="#">Terms</a></li>
      </ul>
    </div>
  </div>
</footer>

<script>
  mapboxgl.accessToken = 'pk.eyJ1IjoiYmFja2NoYW5uZWwiLCJhIjoiY2t2MDNzdGM4MnZwcTJvcTk1M3FuYWFjYiJ9.7BnTsCvt8ffsrtgOX77b1w';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    center: [${lng}, ${lat}], // starting position [lng, lat]
    zoom: 9 // starting zoom
});
</script>
<script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
      <script>window.jQuery || document.write('<script src="assets/js/vendor/jquery.slim.min.js"><\/script>')</script><script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/js/bootstrap.min.js" crossorigin="anonymous"></script>

    </body>
</html>`

  return new Response(html_source, {
    headers: {
      'content-type':'text/html; charset=UTF-8',
      'Access-Control-Allow-Origin': '*'
    }
  })
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// returnDrop
// returns null
// returns type Response
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function returnDrop(){
  return new Response("", {
    status: err.status || 400,
    statusText: err.statusText || null,
    headers: {
      'Content-Type': 'text/plain;charset=UTF-8',
      // Disables caching by default.
      'Cache-Control': 'no-store',
      // Returns the "Content-Length" header for HTTP HEAD requests.
      'Content-Length': 0,
    }
  })
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// handleLinkEdge /l/
// handles an actual telex link
// returns type Response
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function handleLinkEdge(OBSERVED_URL,event) {
  const eid = genGID()
  const edid = genDID(7)
  const ts = genTS()
  const eventLog = await genEventLog(event)
  //const ip = eventLog['data']['sessions_data'][0]['sid']['raw']['request']['headers']['cf-connecting-ip']
  //const ipinfo = await getIPInfo(ip)
  //await tx_ipinfo.put(eid,JSON.stringify(ipinfo))

  const OBSERVED_DID = getURIComponents(OBSERVED_URL,"/l/")[0]
  console.log(`Line 729: OBSERVED_DID ${OBSERVED_DID}`)
  const TNRDATA = await tx_tnr.get(OBSERVED_DID,{ type: 'json' })
  
  const cid = TNRDATA['cid']
  const did = TNRDATA['did']

  const sid = genGID()

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // update collector data with event initiation
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // get exisiting collector data
  var COLLECTORDATA = await tx_collectors.get(cid,{ type: 'json' })
  // append event to the collector
  COLLECTORDATA['events'].push({eid:eid,edid:edid,timestamp:ts})
  // push the collector data back to the collectors KV
  await tx_collectors.put(cid,JSON.stringify(COLLECTORDATA))

  // IP ENRICHMENT
  const ip = eventLog['request']['headers']['cf-connecting-ip']
  var gnData
  try {
    gnData = await getGreynoise(ip)
  } catch (err) {
    gnData = {msg:String(err)}
  }
  var ipinfoData
  try {
    ipinfoData = await getIPInfo(ip)
  } catch (err) {
    ipinfoData = {msg:String(err)}
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // update event data with event session id
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // generate existing event data
  const EVENTDATA = {
    eid:eid,
    edid:edid,
    cid:cid,
    did:did,
    timestamp:ts,
    sessions:[{sid:sid,timestamp:ts}],
    enrichments:{greynoise:gnData,ipinfo:ipinfoData}
  }

  
  // push the event data back to the collectors KV
  await tx_events.put(eid,JSON.stringify(EVENTDATA))

  // push the greynoise data back to the greynoise KV
  await tx_greynoise.put(eid,JSON.stringify(gnData))

  // push the ipinfo data back to the ipinfo KV
  await tx_ipinfo.put(eid,JSON.stringify(ipinfoData))


  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // push session data
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // generate session data
  const SESSIONDATA = {sid:sid,eid:eid,edid:edid,cid:cid,did:did,timestamp:ts,sessiontype:'edge',raw:eventLog}
  await tx_sessions.put(sid,JSON.stringify(SESSIONDATA))
  
  

  if (TNRDATA['response']['type'] === 'payload') {
    const destination_url = TNRDATA['response']["destination_url"]
    var redirectURL
    /*
    if (destination_url.substr(0,4) != 'http') {
      redirectURL = `https://${destination_url}`
    } else {
      redirectURL = destination_url
    }
    return Response.redirect(redirectURL)
    }
    if (TNRDATA['response']['type'] === 'payload') {
    const destination_url = TNRDATA['response']["destination_url"]
    var redirectURL
    /*
    if (destination_url.substr(0,4) != 'http') {
      redirectURL = `https://${destination_url}`
    } else {
      redirectURL = destination_url
    }
    */
    redirectURL = new URL(destination_url).href
    var metaTags = await tx_html_meta.get(did)
    if (metaTags === null || metaTags === undefined) {
      metaTags = await getMetaTags(did,redirectURL)
    }
    const script_did = edid
    const tx_tnr_tmp_data = {
      did:did,
      cid:cid,
      eid:eid,
      edid:edid
    }
    await tx_tnr_tmp.put(edid,JSON.stringify(tx_tnr_tmp_data))
    const URL_PART = String(OBSERVED_URL).split('/l/')[0]
    const payloadName = 'script.js'
    const payloadURL = `${URL_PART}/s/${script_did}/${payloadName}`
    const extraRedirectScript = `<script>window.addEventListener('load', function() {{ setTimeout(() => {window.location = "${redirectURL}"}, 0);}});</script>`
    const html = `<!DOCTYPE html><html><head>${metaTags}<style>html { opacity:0 }</style></head><body><script async src="${payloadURL}"></script><noscript>Continue to <a href="${redirectURL}">${redirectURL}</a></noscript></body><html>`
    //const html = `<html><head>${metaTags}<script>window.addEventListener('load', function() {{ console.log('hit') }});</script></head><body><script async src="${payloadURL}"></script><noscript>Continue to <a href="${redirectURL}">${redirectURL}</a></noscript></body><html>`
    return new Response(html, {
      headers: {
        "content-type": "text/html;charset=UTF-8",
      },
    })
  }
  if (TNRDATA['response']['type'] === 'drop') {
    return new Response(null, {
      status: err.status || 400,
      statusText: err.statusText || null,
      headers: {
        'Content-Type': 'text/plain;charset=UTF-8',
        // Disables caching by default.
        'Cache-Control': 'no-store',
        // Returns the "Content-Length" header for HTTP HEAD requests.
        'Content-Length': 0,
      }
    })
  }
  
}




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// handleScript /s/
// returns javascript,  telex script
// returns type Response
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function handleLinkScript(OBSERVED_URL,event) {
  console.log(`Line 838: ${OBSERVED_URL}`)
  const sid = genGID()
  const ts = genTS()
  const eventLog = await genEventLog(event)

  const OBSERVED_DID = getURIComponents(OBSERVED_URL,"/s/")[0]
  console.log(`Line 843: ${OBSERVED_DID}`)
  const TNRTMPDATA = await tx_tnr_tmp.get(OBSERVED_DID,{ type: 'json' })
  console.log(`Line 845: ${TNRTMPDATA}`)
  const did = TNRTMPDATA['did']
  const cid = TNRTMPDATA['cid']
  const eid = TNRTMPDATA['eid']
  const edid = TNRTMPDATA['edid']
  console.log(`Line 849: ${TNRTMPDATA.did}`)
  console.log(`Line 850: ${did}`)
  const TNRDATA = await tx_tnr.get(did,{ type: 'json' })
  console.log(`Line 852: ${TNRDATA}`)


  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // update event data with session initiation
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // get exisiting event data
  var EVENTDATA = await tx_events.get(eid,{ type: 'json' })
  // append event to the collector
  EVENTDATA['sessions'].push({sid:sid,timestamp:ts})
  // push the collector data back to the collectors KV
  await tx_events.put(eid,JSON.stringify(EVENTDATA))


  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // push session data
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // generate session data
  const SESSIONDATA = {sid:sid,eid:eid,edid:edid,cid:cid,did:did,timestamp:ts,sessiontype:'script',raw:eventLog}
  await tx_sessions.put(sid,JSON.stringify(SESSIONDATA))

  if (TNRDATA['response']['type'] === 'payload') {
    const destination_url = TNRDATA['response']["destination_url"]
    /*
    if (destination_url.substr(0,4) != 'http') {
      redirectURL = `https://${destination_url}`
    } else {
      redirectURL = destination_url
    }
    */
    redirectURL = new URL(destination_url).href
    const URL_PART = String(OBSERVED_URL).split('/s/')[0]
    //const host = new URL(event.request.url).hostname 
    const payloadName = 'script.js'
    const postdata_url = `${URL_PART}/p/${edid}/${payloadName}`
    const payload_1 = TNRDATA['response']['payload_1']
    const tx_header = await tx_payloads.get("tx_header", {type:'text'})
    const payload = await tx_payloads.get(payload_1, {type:'text'})
    const sender = `var x = new XMLHttpRequest();x.onreadystatechange = function() {if(x.readyState === 4){var resp=x.responseText;var s_ = document.createElement("script");s_.innerHTML+=resp;document.body.appendChild(s_);}};x.open("POST", "${postdata_url}", true);x.setRequestHeader("Content-Type", "application/json;charset=UTF-8");x.setRequestHeader("Access-Control-Allow-Origin", "*");x.send(JSON.stringify({"p":p_}));`
    const js = tx_header + payload + sender
    return new Response(js, {
      headers: {
        "content-type": "application/javascript;charset=UTF-8",
      },
    })
  }
  
}




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// handleLinkPost /p/
// returns javascript,  telex script
// returns type Response
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function handleLinkPost(OBSERVED_URL,event) {
  console.log(`Line 909: handleLinkPost started`)
  const sid = genGID()
  const ts = genTS()
  const eventLog = await genEventLog(event)

  const OBSERVED_DID = getURIComponents(OBSERVED_URL,"/p/")[0]
  console.log(`Line 915: OBSERVED_DID ${OBSERVED_DID}`)
  const TNRTMPDATA = await tx_tnr_tmp.get(`${OBSERVED_DID}`,{ type: 'json' })
  const did = TNRTMPDATA.did
  const TNRDATA = await tx_tnr.get(`${did}`,{type: "json"})
  const cid = TNRTMPDATA.cid
  const eid = TNRTMPDATA.eid
  const edid = TNRTMPDATA.edid

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // update event data with session initiation
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // get exisiting event data
  console.log(`Line 927: eid ${eid}`)
  var EVENTDATA = await tx_events.get(`${eid}`,{ type: 'json' })
  console.log(`Line 928: ${EVENTDATA}`)
  // append event to the collector
  EVENTDATA['sessions'].push({sid:sid,timestamp:ts})
  // push the collector data back to the collectors KV
  await tx_events.put(eid,JSON.stringify(EVENTDATA))


  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // push session data
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // generate session data
  const SESSIONDATA = {sid:sid,eid:eid,edid:edid,cid:cid,did:did,timestamp:ts,sessiontype:'postdata',raw:eventLog}
  await tx_sessions.put(sid,JSON.stringify(SESSIONDATA))

  if (TNRDATA['response']['type'] === 'payload') {

    var destination_url = TNRDATA['response']['destination_url']
    const corsHeaders = {
      'content-type': 'application/javascript',
      'Access-Control-Allow-Headers': event.request.headers.get('Access-Control-Request-Headers'),
      'Access-Control-Allow-Origin': '*'
    }
    const payload_2 = TNRDATA["response"]["payload_2"]
    var returnJS = await tx_payloads.get(payload_2,{ type: 'text'})
    returnJS = returnJS.replace('{{REPLACE}}',destination_url)
    //const ipinfo = await getIPInfo(ip)
    return new Response(returnJS,{
      headers: corsHeaders
    })
  }
  
}





////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// handleEventsEndpoint
// standard Cloudflare worker event handler
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function handleEventsEndpoint(param,event,role) {
  var data
  if (param.split("-").length === 5) {
    data = await tx_events.get(param, {type:"json"})
  }
  const jsonData = JSON.stringify(data)
  return new Response(jsonData, {
    headers: {
      'content-type':'application/json',
      'Access-Control-Allow-Headers': event.request.headers.get('Access-Control-Request-Headers'),
      'Access-Control-Allow-Origin': '*'
    }
  })
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// handleInfoEndpoint
// standard Cloudflare worker event handler
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function handleInfoEndpoint(param,event,role) {

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// handleSessionEndpoint
// standard Cloudflare worker event handler
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function handleSessionEndpoint(param,event,role) {
  var data
  if (param.split("-").length === 5) {
    data = await tx_sessions.get(param, {type:"json"})
  }
  const jsonData = JSON.stringify(data)
  return new Response(jsonData, {
    headers: {
      'content-type':'application/json',
      'Access-Control-Allow-Headers': event.request.headers.get('Access-Control-Request-Headers'),
      'Access-Control-Allow-Origin': '*'
    }
  })
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// handleUtilsEndpoint
// standard Cloudflare worker event handler
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function handleUtilsEndpoint(param,event,role) {


}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
// /create
// handleCollectorEndpoint
// standard Cloudflare worker event handler
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function handleCreateCollector(event) {
  /*
  const URL_IN_PATH = String(OBSERVED_URL).split('create/')[1]
  const OBSERVED_HOST = OBSERVED_URL.hostname
  const BETTER_HOST = String(OBSERVED_URL).split('/create/')[0]
  */
  console.log(`hi`)
  const API_AUTHS = await tx_auth.get('tx-api-auth', {type:'json'})
  var AUTH
  Object.keys(API_AUTHS).forEach((element) => {
    if (API_AUTHS[element]['role'] === 'PUBLIC') {
      AUTH = String(element)
    }
  })
  console.log(`allowed auth: ${AUTH}`)
  const request = event.request
  const eventC = await genEventLog(event)
  const createBody = eventC.request.body
  const createHeaders = eventC.request.headers
  if (Object.keys(createHeaders).includes('x-tx-auth')) {
    console.log(`header exists`)
    if (createHeaders['x-tx-auth'] === AUTH) {
      console.log(`auth matches`)
      var url = String(createBody.u)
      var https_prefix = 'https://'
      var http_prefix = 'http://'
      if (url.substr(0, https_prefix.length) !== https_prefix) {
        if (url.substr(0, http_prefix.length) !== http_prefix) {
          url = https_prefix + url;
        }
      }
      const cid = genGID()
      const did = genDID(7)
      const ts = genTS()
      const OBSERVED_URL = new URL(event.request.url)
      const OBSERVED_HOST = OBSERVED_URL.hostname 
      const OBSERVED_PORT = OBSERVED_URL.port
      const OBSERVED_PROTOCOL = OBSERVED_URL.protocol 
      const OBSERVED_ORIGIN = OBSERVED_URL.origin
      console.log(OBSERVED_URL)
      
      //const collector_host = `${OBSERVED_PROTOCOL}//${OBSERVED_HOST}:${OBSERVED_PORT}`
      const collector_host = `${OBSERVED_ORIGIN}`
      const telex_link = `${collector_host}/l/${did}`

      const COLLECTORDATA = {
        cid:cid,
        did:did,
        destination_url:url,
        collector_host:collector_host,
        telex_link:telex_link,
        timestamp:ts,
        events:[],
        debug: {
          event:eventC
        }
      }

      await tx_collectors.put(cid, JSON.stringify(COLLECTORDATA))

      const tnr_data = {
        cid:cid,
        did:did,
        response:{
          type:'payload',
          destination_url:url,
          payload_1:'25e620a4-1782-44e2-967b-e693259f1265',
          payload_2:'redirect'
        },
        collector_host:collector_host,
        telex_link:telex_link,
        timestamp:ts
      }
      await tx_tnr.put(did, JSON.stringify(tnr_data))
      console.log('hit')
      var goto = `${collector_host}/c/${cid}`
      const data = {goto:goto}
      const jsonData = JSON.stringify(data)
      return new Response(jsonData, {
        headers: {
          'content-type':'application/json',
          'Access-Control-Allow-Headers': event.request.headers.get('Access-Control-Request-Headers'),
          'Access-Control-Allow-Origin': '*'
        }
      })
    } else {
      return returnDrop()
    }
  } else {
    return returnDrop()
  }
  
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// handleRequest
// standard Cloudflare worker event handler
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function handleRequest(event) {

  // get authorizations 
  const AUTHS = await tx_auth.get('tx-api-auth',{type:'json'})
  //const ALLOWED_AUTHS = Object.keys(AUTHS)

  // get the observed full URL
  const OBSERVED_URL = new URL(event.request.url)
  // Get the host name
  const OBSERVED_HOST = OBSERVED_URL.hostname 
  // get the URI only
  const OBSERVED_URI = getURIArray(OBSERVED_URL)
  console.log(OBSERVED_URI)
  // first path validator. make sure that the URI path is not empty
  if ( OBSERVED_URI.length >= 2 ) {
    // OBSERVED_URI is an array of the URI params. Let's get the first one. It'll determine the API endpoint
    const FIRST_PARAM = OBSERVED_URI[0]
    const SECOND_PARAM = OBSERVED_URI[1]
    // switch to go through the endpoints
    switch (FIRST_PARAM) {

      case 'c':
        return handleCollectorsPage(SECOND_PARAM)

      case 'e':
        return handleEventsPage(SECOND_PARAM)

      case 'create':
        console.log(`[+] request on path ${FIRST_PARAM}. Starting function handleCreateCollector`)
        return handleCreateCollector(event)
      
      case 'l':
        return handleLinkEdge(OBSERVED_URL,event)

      case 's':
        return handleLinkScript(OBSERVED_URL,event)

      case 'p':
        return handleLinkPost(OBSERVED_URL,event)
      
      case 'greynoise':
        const eventData = await genEventLog(event)
        const ip = eventData['request']['headers']['cf-connecting-ip']
        var gnData
        try {
          gnData = await getGreynoise(ip)
        } catch (err) {
          gnData = {msg:String(err)}
        }
        const data = {
          greynoise:gnData,
          event:eventData
        }
        const data_json = JSON.stringify(data)
        return new Response(data_json, {
          headers: {
            'content-type':'application/json',
            'Access-Control-Allow-Headers': event.request.headers.get('Access-Control-Request-Headers'),
            'Access-Control-Allow-Origin': '*'
          }
        })

        /*
      case 'ipinfo':
        const eventData = await genEventLog(event)
        const ip = eventData['request']['headers']['cf-connecting-ip']
        var ipinfoData
        try {
          ipinfoData = await getIPInfo(ip)
        } catch (err) {
          ipinfoData = {msg:String(err)}
        }
        const data = {
          ipinfo:ipinfoData,
          event:eventData
        }
        const data_json = JSON.stringify(data)
        return new Response(data_json, {
          headers: {
            'content-type':'application/json',
            'Access-Control-Allow-Headers': event.request.headers.get('Access-Control-Request-Headers'),
            'Access-Control-Allow-Origin': '*'
          }
        })

        */

      case '':
        return handleIndexPage()
    }
  }
  if ( OBSERVED_URI.length === 1 ) {
    // OBSERVED_URI is an array of the URI params. Let's get the first one. It'll determine the API endpoint
    const FIRST_PARAM = OBSERVED_URI[0]
    switch (FIRST_PARAM) {
      case 'create':
        console.log(`[+] request on path ${FIRST_PARAM}. Starting function handleCreateCollector`)
        return handleCreateCollector(event)
      case '':
        return handleIndexPage()
    }
  }
  else {
    return handleIndexPage()
  }
}

  

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// addEventListener
// standard Cloudflare worker event listener
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
addEventListener("fetch", event => {
    // Have any uncaught errors thrown go directly to origin
    event.passThroughOnException()
    // Everything else gets handled
    event.respondWith(handleRequest(event))
})