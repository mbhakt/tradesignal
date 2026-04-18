import { J as ProtocolError, K as TimeoutWaitingForResponseErrorCode, L as utf8ToBytes, M as ExternalError, N as MissingRootKeyErrorCode, O as Certificate, Q as lookupResultToBuffer, U as RequestStatusResponseStatus, V as UnknownError, W as RequestStatusDoneNoReplyErrorCode, X as RejectError, Y as CertifiedRejectErrorCode, Z as UNREACHABLE_ERROR, _ as InputError, $ as InvalidReadStateRequestErrorCode, a0 as ReadRequestType, a1 as Principal, a2 as IDL, a3 as MissingCanisterIdErrorCode, a4 as HttpAgent, a5 as encode, a6 as QueryResponseStatus, a7 as UncertifiedRejectErrorCode, a8 as isV3ResponseBody, a9 as isV2ResponseBody, aa as UncertifiedRejectUpdateErrorCode, ab as UnexpectedErrorCode, ac as decode, b as createLucideIcon, ad as Record, ae as Opt, af as Variant, ag as Vec, ah as Service, ai as Func, aj as Text, ak as Float64, al as Int, am as Null, an as Nat, ao as Nat8, j as jsxRuntimeExports, c as cn } from "./index-k3Dj9kgV.js";
const FIVE_MINUTES_IN_MSEC = 5 * 60 * 1e3;
function defaultStrategy() {
  return chain(conditionalDelay(once(), 1e3), backoff(1e3, 1.2), timeout(FIVE_MINUTES_IN_MSEC));
}
function once() {
  let first = true;
  return async () => {
    if (first) {
      first = false;
      return true;
    }
    return false;
  };
}
function conditionalDelay(condition, timeInMsec) {
  return async (canisterId, requestId, status) => {
    if (await condition(canisterId, requestId, status)) {
      return new Promise((resolve) => setTimeout(resolve, timeInMsec));
    }
  };
}
function timeout(timeInMsec) {
  const end = Date.now() + timeInMsec;
  return async (_canisterId, requestId, status) => {
    if (Date.now() > end) {
      throw ProtocolError.fromCode(new TimeoutWaitingForResponseErrorCode(`Request timed out after ${timeInMsec} msec`, requestId, status));
    }
  };
}
function backoff(startingThrottleInMsec, backoffFactor) {
  let currentThrottling = startingThrottleInMsec;
  return () => new Promise((resolve) => setTimeout(() => {
    currentThrottling *= backoffFactor;
    resolve();
  }, currentThrottling));
}
function chain(...strategies) {
  return async (canisterId, requestId, status) => {
    for (const a of strategies) {
      await a(canisterId, requestId, status);
    }
  };
}
const DEFAULT_POLLING_OPTIONS = {
  preSignReadStateRequest: false
};
function hasProperty(value, property) {
  return Object.prototype.hasOwnProperty.call(value, property);
}
function isObjectWithProperty(value, property) {
  return value !== null && typeof value === "object" && hasProperty(value, property);
}
function hasFunction(value, property) {
  return hasProperty(value, property) && typeof value[property] === "function";
}
function isSignedReadStateRequestWithExpiry(value) {
  return isObjectWithProperty(value, "body") && isObjectWithProperty(value.body, "content") && value.body.content.request_type === ReadRequestType.ReadState && isObjectWithProperty(value.body.content, "ingress_expiry") && typeof value.body.content.ingress_expiry === "object" && value.body.content.ingress_expiry !== null && hasFunction(value.body.content.ingress_expiry, "toHash");
}
async function pollForResponse(agent, canisterId, requestId, options = {}) {
  const path = [utf8ToBytes("request_status"), requestId];
  let state;
  let currentRequest;
  const preSignReadStateRequest = options.preSignReadStateRequest ?? false;
  if (preSignReadStateRequest) {
    currentRequest = await constructRequest({
      paths: [path],
      agent,
      pollingOptions: options
    });
    state = await agent.readState(canisterId, { paths: [path] }, void 0, currentRequest);
  } else {
    state = await agent.readState(canisterId, { paths: [path] });
  }
  if (agent.rootKey == null) {
    throw ExternalError.fromCode(new MissingRootKeyErrorCode());
  }
  const cert = await Certificate.create({
    certificate: state.certificate,
    rootKey: agent.rootKey,
    canisterId,
    blsVerify: options.blsVerify,
    agent
  });
  const maybeBuf = lookupResultToBuffer(cert.lookup_path([...path, utf8ToBytes("status")]));
  let status;
  if (typeof maybeBuf === "undefined") {
    status = RequestStatusResponseStatus.Unknown;
  } else {
    status = new TextDecoder().decode(maybeBuf);
  }
  switch (status) {
    case RequestStatusResponseStatus.Replied: {
      return {
        reply: lookupResultToBuffer(cert.lookup_path([...path, "reply"])),
        certificate: cert
      };
    }
    case RequestStatusResponseStatus.Received:
    case RequestStatusResponseStatus.Unknown:
    case RequestStatusResponseStatus.Processing: {
      const strategy = options.strategy ?? defaultStrategy();
      await strategy(canisterId, requestId, status);
      return pollForResponse(agent, canisterId, requestId, {
        ...options,
        // Pass over either the strategy already provided or the new one created above
        strategy,
        request: currentRequest
      });
    }
    case RequestStatusResponseStatus.Rejected: {
      const rejectCode = new Uint8Array(lookupResultToBuffer(cert.lookup_path([...path, "reject_code"])))[0];
      const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(cert.lookup_path([...path, "reject_message"])));
      const errorCodeBuf = lookupResultToBuffer(cert.lookup_path([...path, "error_code"]));
      const errorCode = errorCodeBuf ? new TextDecoder().decode(errorCodeBuf) : void 0;
      throw RejectError.fromCode(new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, errorCode));
    }
    case RequestStatusResponseStatus.Done:
      throw UnknownError.fromCode(new RequestStatusDoneNoReplyErrorCode(requestId));
  }
  throw UNREACHABLE_ERROR;
}
async function constructRequest(options) {
  var _a;
  const { paths, agent, pollingOptions } = options;
  if (pollingOptions.request && isSignedReadStateRequestWithExpiry(pollingOptions.request)) {
    return pollingOptions.request;
  }
  const request = await ((_a = agent.createReadStateRequest) == null ? void 0 : _a.call(agent, {
    paths
  }, void 0));
  if (!isSignedReadStateRequestWithExpiry(request)) {
    throw InputError.fromCode(new InvalidReadStateRequestErrorCode(request));
  }
  return request;
}
const metadataSymbol = Symbol.for("ic-agent-metadata");
class Actor {
  /**
   * Get the Agent class this Actor would call, or undefined if the Actor would use
   * the default agent (global.ic.agent).
   * @param actor The actor to get the agent of.
   */
  static agentOf(actor) {
    return actor[metadataSymbol].config.agent;
  }
  /**
   * Get the interface of an actor, in the form of an instance of a Service.
   * @param actor The actor to get the interface of.
   */
  static interfaceOf(actor) {
    return actor[metadataSymbol].service;
  }
  static canisterIdOf(actor) {
    return Principal.from(actor[metadataSymbol].config.canisterId);
  }
  static createActorClass(interfaceFactory, options) {
    const service = interfaceFactory({ IDL });
    class CanisterActor extends Actor {
      constructor(config) {
        if (!config.canisterId) {
          throw InputError.fromCode(new MissingCanisterIdErrorCode(config.canisterId));
        }
        const canisterId = typeof config.canisterId === "string" ? Principal.fromText(config.canisterId) : config.canisterId;
        super({
          config: {
            ...DEFAULT_ACTOR_CONFIG,
            ...config,
            canisterId
          },
          service
        });
        for (const [methodName, func] of service._fields) {
          if (options == null ? void 0 : options.httpDetails) {
            func.annotations.push(ACTOR_METHOD_WITH_HTTP_DETAILS);
          }
          if (options == null ? void 0 : options.certificate) {
            func.annotations.push(ACTOR_METHOD_WITH_CERTIFICATE);
          }
          this[methodName] = _createActorMethod(this, methodName, func, config.blsVerify);
        }
      }
    }
    return CanisterActor;
  }
  /**
   * Creates an actor with the given interface factory and configuration.
   *
   * The [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package can be used to generate the interface factory for your canister.
   * @param interfaceFactory - the interface factory for the actor, typically generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package
   * @param configuration - the configuration for the actor
   * @returns an actor with the given interface factory and configuration
   * @example
   * Using the interface factory generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package:
   * ```ts
   * import { Actor, HttpAgent } from '@icp-sdk/core/agent';
   * import { Principal } from '@icp-sdk/core/principal';
   * import { idlFactory } from './api/declarations/hello-world.did';
   *
   * const canisterId = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
   *
   * const agent = await HttpAgent.create({
   *   host: 'https://icp-api.io',
   * });
   *
   * const actor = Actor.createActor(idlFactory, {
   *   agent,
   *   canisterId,
   * });
   *
   * const response = await actor.greet('world');
   * console.log(response);
   * ```
   * @example
   * Using the `createActor` wrapper function generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package:
   * ```ts
   * import { HttpAgent } from '@icp-sdk/core/agent';
   * import { Principal } from '@icp-sdk/core/principal';
   * import { createActor } from './api/hello-world';
   *
   * const canisterId = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
   *
   * const agent = await HttpAgent.create({
   *   host: 'https://icp-api.io',
   * });
   *
   * const actor = createActor(canisterId, {
   *   agent,
   * });
   *
   * const response = await actor.greet('world');
   * console.log(response);
   * ```
   */
  static createActor(interfaceFactory, configuration) {
    if (!configuration.canisterId) {
      throw InputError.fromCode(new MissingCanisterIdErrorCode(configuration.canisterId));
    }
    return new (this.createActorClass(interfaceFactory))(configuration);
  }
  /**
   * Returns an actor with methods that return the http response details along with the result
   * @param interfaceFactory - the interface factory for the actor
   * @param configuration - the configuration for the actor
   * @deprecated - use createActor with actorClassOptions instead
   */
  static createActorWithHttpDetails(interfaceFactory, configuration) {
    return new (this.createActorClass(interfaceFactory, { httpDetails: true }))(configuration);
  }
  /**
   * Returns an actor with methods that return the http response details along with the result
   * @param interfaceFactory - the interface factory for the actor
   * @param configuration - the configuration for the actor
   * @param actorClassOptions - options for the actor class extended details to return with the result
   */
  static createActorWithExtendedDetails(interfaceFactory, configuration, actorClassOptions = {
    httpDetails: true,
    certificate: true
  }) {
    return new (this.createActorClass(interfaceFactory, actorClassOptions))(configuration);
  }
  constructor(metadata) {
    this[metadataSymbol] = Object.freeze(metadata);
  }
}
function decodeReturnValue(types, msg) {
  const returnValues = decode(types, msg);
  switch (returnValues.length) {
    case 0:
      return void 0;
    case 1:
      return returnValues[0];
    default:
      return returnValues;
  }
}
const DEFAULT_ACTOR_CONFIG = {
  pollingOptions: DEFAULT_POLLING_OPTIONS
};
const ACTOR_METHOD_WITH_HTTP_DETAILS = "http-details";
const ACTOR_METHOD_WITH_CERTIFICATE = "certificate";
function _createActorMethod(actor, methodName, func, blsVerify) {
  let caller;
  if (func.annotations.includes("query") || func.annotations.includes("composite_query")) {
    caller = async (options, ...args) => {
      var _a, _b;
      options = {
        ...options,
        ...(_b = (_a = actor[metadataSymbol].config).queryTransform) == null ? void 0 : _b.call(_a, methodName, args, {
          ...actor[metadataSymbol].config,
          ...options
        })
      };
      const agent = options.agent || actor[metadataSymbol].config.agent || new HttpAgent();
      const cid = Principal.from(options.canisterId || actor[metadataSymbol].config.canisterId);
      const arg = encode(func.argTypes, args);
      const result = await agent.query(cid, {
        methodName,
        arg,
        effectiveCanisterId: options.effectiveCanisterId
      });
      const httpDetails = {
        ...result.httpDetails,
        requestDetails: result.requestDetails
      };
      switch (result.status) {
        case QueryResponseStatus.Rejected: {
          const uncertifiedRejectErrorCode = new UncertifiedRejectErrorCode(result.requestId, result.reject_code, result.reject_message, result.error_code, result.signatures);
          uncertifiedRejectErrorCode.callContext = {
            canisterId: cid,
            methodName,
            httpDetails
          };
          throw RejectError.fromCode(uncertifiedRejectErrorCode);
        }
        case QueryResponseStatus.Replied:
          return func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS) ? {
            httpDetails,
            result: decodeReturnValue(func.retTypes, result.reply.arg)
          } : decodeReturnValue(func.retTypes, result.reply.arg);
      }
    };
  } else {
    caller = async (options, ...args) => {
      var _a, _b;
      options = {
        ...options,
        ...(_b = (_a = actor[metadataSymbol].config).callTransform) == null ? void 0 : _b.call(_a, methodName, args, {
          ...actor[metadataSymbol].config,
          ...options
        })
      };
      const agent = options.agent || actor[metadataSymbol].config.agent || HttpAgent.createSync();
      const { canisterId, effectiveCanisterId, pollingOptions } = {
        ...DEFAULT_ACTOR_CONFIG,
        ...actor[metadataSymbol].config,
        ...options
      };
      const cid = Principal.from(canisterId);
      const ecid = effectiveCanisterId !== void 0 ? Principal.from(effectiveCanisterId) : cid;
      const arg = encode(func.argTypes, args);
      const { requestId, response, requestDetails } = await agent.call(cid, {
        methodName,
        arg,
        effectiveCanisterId: ecid,
        nonce: options.nonce
      });
      let reply;
      let certificate;
      if (isV3ResponseBody(response.body)) {
        if (agent.rootKey == null) {
          throw ExternalError.fromCode(new MissingRootKeyErrorCode());
        }
        const cert = response.body.certificate;
        certificate = await Certificate.create({
          certificate: cert,
          rootKey: agent.rootKey,
          canisterId: ecid,
          blsVerify,
          agent
        });
        const path = [utf8ToBytes("request_status"), requestId];
        const status = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "status"])));
        switch (status) {
          case "replied":
            reply = lookupResultToBuffer(certificate.lookup_path([...path, "reply"]));
            break;
          case "rejected": {
            const rejectCode = new Uint8Array(lookupResultToBuffer(certificate.lookup_path([...path, "reject_code"])))[0];
            const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "reject_message"])));
            const error_code_buf = lookupResultToBuffer(certificate.lookup_path([...path, "error_code"]));
            const error_code = error_code_buf ? new TextDecoder().decode(error_code_buf) : void 0;
            const certifiedRejectErrorCode = new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, error_code);
            certifiedRejectErrorCode.callContext = {
              canisterId: cid,
              methodName,
              httpDetails: response
            };
            throw RejectError.fromCode(certifiedRejectErrorCode);
          }
        }
      } else if (isV2ResponseBody(response.body)) {
        const { reject_code, reject_message, error_code } = response.body;
        const errorCode = new UncertifiedRejectUpdateErrorCode(requestId, reject_code, reject_message, error_code);
        errorCode.callContext = {
          canisterId: cid,
          methodName,
          httpDetails: response
        };
        throw RejectError.fromCode(errorCode);
      }
      if (response.status === 202) {
        const pollOptions = {
          ...pollingOptions,
          blsVerify
        };
        const response2 = await pollForResponse(agent, ecid, requestId, pollOptions);
        certificate = response2.certificate;
        reply = response2.reply;
      }
      const shouldIncludeHttpDetails = func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS);
      const shouldIncludeCertificate = func.annotations.includes(ACTOR_METHOD_WITH_CERTIFICATE);
      const httpDetails = { ...response, requestDetails };
      if (reply !== void 0) {
        if (shouldIncludeHttpDetails && shouldIncludeCertificate) {
          return {
            httpDetails,
            certificate,
            result: decodeReturnValue(func.retTypes, reply)
          };
        } else if (shouldIncludeCertificate) {
          return {
            certificate,
            result: decodeReturnValue(func.retTypes, reply)
          };
        } else if (shouldIncludeHttpDetails) {
          return {
            httpDetails,
            result: decodeReturnValue(func.retTypes, reply)
          };
        }
        return decodeReturnValue(func.retTypes, reply);
      } else {
        const errorCode = new UnexpectedErrorCode(`Call was returned undefined. We cannot determine if the call was successful or not. Return types: [${func.retTypes.map((t) => t.display()).join(",")}].`);
        errorCode.callContext = {
          canisterId: cid,
          methodName,
          httpDetails
        };
        throw UnknownError.fromCode(errorCode);
      }
    };
  }
  const handler = (...args) => caller({}, ...args);
  handler.withOptions = (options) => (...args) => caller(options, ...args);
  return handler;
}
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 17h6v-6", key: "t6n2it" }],
  ["path", { d: "m22 17-8.5-8.5-5 5L2 7", key: "x473p" }]
];
const TrendingDown = createLucideIcon("trending-down", __iconNode);
const Position = Record({
  "id": Text,
  "pnl": Float64,
  "currentPrice": Float64,
  "entryDate": Int,
  "pnlPercent": Float64,
  "quantity": Float64,
  "entryPrice": Float64,
  "exchange": Opt(Text),
  "symbol": Text
});
const PortfolioSummary = Record({
  "totalValue": Float64,
  "totalCost": Float64,
  "totalPnl": Float64,
  "totalPnlPercent": Float64
});
const IndicatorSummary = Record({
  "rsi": Float64,
  "emaLong": Float64,
  "macdSignal": Float64,
  "emaShort": Float64,
  "bollingerLower": Float64,
  "macdLine": Float64,
  "bollingerMiddle": Float64,
  "macdHistogram": Float64,
  "bollingerUpper": Float64
});
const Signal$1 = Variant({
  "Buy": Null,
  "Hold": Null,
  "Sell": Null
});
const Confidence$1 = Variant({
  "Low": Null,
  "High": Null,
  "Medium": Null
});
const SignalResult = Record({
  "computedAt": Int,
  "indicators": IndicatorSummary,
  "signal": Signal$1,
  "confidence": Confidence$1,
  "symbol": Text
});
const WatchlistItem = Record({
  "lastUpdated": Int,
  "currency": Opt(Text),
  "change": Float64,
  "exchange": Opt(Text),
  "price": Float64,
  "changePercent": Float64,
  "symbol": Text
});
const http_header = Record({
  "value": Text,
  "name": Text
});
const http_request_result = Record({
  "status": Nat,
  "body": Vec(Nat8),
  "headers": Vec(http_header)
});
const TransformationInput = Record({
  "context": Vec(Nat8),
  "response": http_request_result
});
const TransformationOutput = Record({
  "status": Nat,
  "body": Vec(Nat8),
  "headers": Vec(http_header)
});
Service({
  "addPosition": Func(
    [Text, Float64, Float64, Int, Opt(Text)],
    [],
    []
  ),
  "addToWatchlist": Func([Text, Opt(Text)], [], []),
  "getPortfolio": Func([], [Vec(Position)], []),
  "getPortfolioSummary": Func([], [PortfolioSummary], []),
  "getStockSignal": Func([Text], [SignalResult], []),
  "getWatchlist": Func([], [Vec(WatchlistItem)], []),
  "refreshPrice": Func([Text], [WatchlistItem], []),
  "removeFromWatchlist": Func([Text], [], []),
  "removePosition": Func([Text], [], []),
  "transform": Func(
    [TransformationInput],
    [TransformationOutput],
    ["query"]
  )
});
const idlFactory = ({ IDL: IDL2 }) => {
  const Position2 = IDL2.Record({
    "id": IDL2.Text,
    "pnl": IDL2.Float64,
    "currentPrice": IDL2.Float64,
    "entryDate": IDL2.Int,
    "pnlPercent": IDL2.Float64,
    "quantity": IDL2.Float64,
    "entryPrice": IDL2.Float64,
    "exchange": IDL2.Opt(IDL2.Text),
    "symbol": IDL2.Text
  });
  const PortfolioSummary2 = IDL2.Record({
    "totalValue": IDL2.Float64,
    "totalCost": IDL2.Float64,
    "totalPnl": IDL2.Float64,
    "totalPnlPercent": IDL2.Float64
  });
  const IndicatorSummary2 = IDL2.Record({
    "rsi": IDL2.Float64,
    "emaLong": IDL2.Float64,
    "macdSignal": IDL2.Float64,
    "emaShort": IDL2.Float64,
    "bollingerLower": IDL2.Float64,
    "macdLine": IDL2.Float64,
    "bollingerMiddle": IDL2.Float64,
    "macdHistogram": IDL2.Float64,
    "bollingerUpper": IDL2.Float64
  });
  const Signal2 = IDL2.Variant({
    "Buy": IDL2.Null,
    "Hold": IDL2.Null,
    "Sell": IDL2.Null
  });
  const Confidence2 = IDL2.Variant({
    "Low": IDL2.Null,
    "High": IDL2.Null,
    "Medium": IDL2.Null
  });
  const SignalResult2 = IDL2.Record({
    "computedAt": IDL2.Int,
    "indicators": IndicatorSummary2,
    "signal": Signal2,
    "confidence": Confidence2,
    "symbol": IDL2.Text
  });
  const WatchlistItem2 = IDL2.Record({
    "lastUpdated": IDL2.Int,
    "currency": IDL2.Opt(IDL2.Text),
    "change": IDL2.Float64,
    "exchange": IDL2.Opt(IDL2.Text),
    "price": IDL2.Float64,
    "changePercent": IDL2.Float64,
    "symbol": IDL2.Text
  });
  const http_header2 = IDL2.Record({ "value": IDL2.Text, "name": IDL2.Text });
  const http_request_result2 = IDL2.Record({
    "status": IDL2.Nat,
    "body": IDL2.Vec(IDL2.Nat8),
    "headers": IDL2.Vec(http_header2)
  });
  const TransformationInput2 = IDL2.Record({
    "context": IDL2.Vec(IDL2.Nat8),
    "response": http_request_result2
  });
  const TransformationOutput2 = IDL2.Record({
    "status": IDL2.Nat,
    "body": IDL2.Vec(IDL2.Nat8),
    "headers": IDL2.Vec(http_header2)
  });
  return IDL2.Service({
    "addPosition": IDL2.Func(
      [IDL2.Text, IDL2.Float64, IDL2.Float64, IDL2.Int, IDL2.Opt(IDL2.Text)],
      [],
      []
    ),
    "addToWatchlist": IDL2.Func([IDL2.Text, IDL2.Opt(IDL2.Text)], [], []),
    "getPortfolio": IDL2.Func([], [IDL2.Vec(Position2)], []),
    "getPortfolioSummary": IDL2.Func([], [PortfolioSummary2], []),
    "getStockSignal": IDL2.Func([IDL2.Text], [SignalResult2], []),
    "getWatchlist": IDL2.Func([], [IDL2.Vec(WatchlistItem2)], []),
    "refreshPrice": IDL2.Func([IDL2.Text], [WatchlistItem2], []),
    "removeFromWatchlist": IDL2.Func([IDL2.Text], [], []),
    "removePosition": IDL2.Func([IDL2.Text], [], []),
    "transform": IDL2.Func(
      [TransformationInput2],
      [TransformationOutput2],
      ["query"]
    )
  });
};
function candid_some(value) {
  return [
    value
  ];
}
function candid_none() {
  return [];
}
function record_opt_to_undefined(arg) {
  return arg == null ? void 0 : arg;
}
var Confidence = /* @__PURE__ */ ((Confidence2) => {
  Confidence2["Low"] = "Low";
  Confidence2["High"] = "High";
  Confidence2["Medium"] = "Medium";
  return Confidence2;
})(Confidence || {});
var Signal = /* @__PURE__ */ ((Signal2) => {
  Signal2["Buy"] = "Buy";
  Signal2["Hold"] = "Hold";
  Signal2["Sell"] = "Sell";
  return Signal2;
})(Signal || {});
class Backend {
  constructor(actor, _uploadFile, _downloadFile, processError) {
    this.actor = actor;
    this._uploadFile = _uploadFile;
    this._downloadFile = _downloadFile;
    this.processError = processError;
  }
  async addPosition(arg0, arg1, arg2, arg3, arg4) {
    if (this.processError) {
      try {
        const result = await this.actor.addPosition(arg0, arg1, arg2, arg3, to_candid_opt_n1(this._uploadFile, this._downloadFile, arg4));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.addPosition(arg0, arg1, arg2, arg3, to_candid_opt_n1(this._uploadFile, this._downloadFile, arg4));
      return result;
    }
  }
  async addToWatchlist(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.addToWatchlist(arg0, to_candid_opt_n1(this._uploadFile, this._downloadFile, arg1));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.addToWatchlist(arg0, to_candid_opt_n1(this._uploadFile, this._downloadFile, arg1));
      return result;
    }
  }
  async getPortfolio() {
    if (this.processError) {
      try {
        const result = await this.actor.getPortfolio();
        return from_candid_vec_n2(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getPortfolio();
      return from_candid_vec_n2(this._uploadFile, this._downloadFile, result);
    }
  }
  async getPortfolioSummary() {
    if (this.processError) {
      try {
        const result = await this.actor.getPortfolioSummary();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getPortfolioSummary();
      return result;
    }
  }
  async getStockSignal(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getStockSignal(arg0);
        return from_candid_SignalResult_n6(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getStockSignal(arg0);
      return from_candid_SignalResult_n6(this._uploadFile, this._downloadFile, result);
    }
  }
  async getWatchlist() {
    if (this.processError) {
      try {
        const result = await this.actor.getWatchlist();
        return from_candid_vec_n12(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getWatchlist();
      return from_candid_vec_n12(this._uploadFile, this._downloadFile, result);
    }
  }
  async refreshPrice(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.refreshPrice(arg0);
        return from_candid_WatchlistItem_n13(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.refreshPrice(arg0);
      return from_candid_WatchlistItem_n13(this._uploadFile, this._downloadFile, result);
    }
  }
  async removeFromWatchlist(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.removeFromWatchlist(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.removeFromWatchlist(arg0);
      return result;
    }
  }
  async removePosition(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.removePosition(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.removePosition(arg0);
      return result;
    }
  }
  async transform(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.transform(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.transform(arg0);
      return result;
    }
  }
}
function from_candid_Confidence_n10(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n11(_uploadFile, _downloadFile, value);
}
function from_candid_Position_n3(_uploadFile, _downloadFile, value) {
  return from_candid_record_n4(_uploadFile, _downloadFile, value);
}
function from_candid_SignalResult_n6(_uploadFile, _downloadFile, value) {
  return from_candid_record_n7(_uploadFile, _downloadFile, value);
}
function from_candid_Signal_n8(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n9(_uploadFile, _downloadFile, value);
}
function from_candid_WatchlistItem_n13(_uploadFile, _downloadFile, value) {
  return from_candid_record_n14(_uploadFile, _downloadFile, value);
}
function from_candid_opt_n5(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_record_n14(_uploadFile, _downloadFile, value) {
  return {
    lastUpdated: value.lastUpdated,
    currency: record_opt_to_undefined(from_candid_opt_n5(_uploadFile, _downloadFile, value.currency)),
    change: value.change,
    exchange: record_opt_to_undefined(from_candid_opt_n5(_uploadFile, _downloadFile, value.exchange)),
    price: value.price,
    changePercent: value.changePercent,
    symbol: value.symbol
  };
}
function from_candid_record_n4(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    pnl: value.pnl,
    currentPrice: value.currentPrice,
    entryDate: value.entryDate,
    pnlPercent: value.pnlPercent,
    quantity: value.quantity,
    entryPrice: value.entryPrice,
    exchange: record_opt_to_undefined(from_candid_opt_n5(_uploadFile, _downloadFile, value.exchange)),
    symbol: value.symbol
  };
}
function from_candid_record_n7(_uploadFile, _downloadFile, value) {
  return {
    computedAt: value.computedAt,
    indicators: value.indicators,
    signal: from_candid_Signal_n8(_uploadFile, _downloadFile, value.signal),
    confidence: from_candid_Confidence_n10(_uploadFile, _downloadFile, value.confidence),
    symbol: value.symbol
  };
}
function from_candid_variant_n11(_uploadFile, _downloadFile, value) {
  return "Low" in value ? "Low" : "High" in value ? "High" : "Medium" in value ? "Medium" : value;
}
function from_candid_variant_n9(_uploadFile, _downloadFile, value) {
  return "Buy" in value ? "Buy" : "Hold" in value ? "Hold" : "Sell" in value ? "Sell" : value;
}
function from_candid_vec_n12(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_WatchlistItem_n13(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n2(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_Position_n3(_uploadFile, _downloadFile, x));
}
function to_candid_opt_n1(_uploadFile, _downloadFile, value) {
  return value === null ? candid_none() : candid_some(value);
}
function createActor(canisterId, _uploadFile, _downloadFile, options = {}) {
  const agent = options.agent || HttpAgent.createSync({
    ...options.agentOptions
  });
  if (options.agent && options.agentOptions) {
    console.warn("Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent.");
  }
  const actor = Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...options.actorOptions
  });
  return new Backend(actor, _uploadFile, _downloadFile, options.processError);
}
const signalConfig = {
  [Signal.Buy]: {
    label: "BUY",
    cls: "signal-buy",
    dot: "bg-primary"
  },
  [Signal.Hold]: {
    label: "HOLD",
    cls: "signal-hold",
    dot: "bg-accent"
  },
  [Signal.Sell]: {
    label: "SELL",
    cls: "signal-sell",
    dot: "bg-destructive"
  }
};
const sizeConfig = {
  sm: "text-[10px] px-1.5 py-0.5 gap-1",
  md: "text-xs px-2 py-1 gap-1.5",
  lg: "text-sm px-3 py-1.5 gap-2"
};
function SignalBadge({
  signal,
  confidence,
  size = "md",
  className
}) {
  const cfg = signalConfig[signal];
  const sizeCls = sizeConfig[size];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: cn(
        "inline-flex items-center rounded-sm font-mono font-semibold tracking-wider",
        cfg.cls,
        sizeCls,
        className
      ),
      "aria-label": `Signal: ${cfg.label}${confidence ? ` (${confidence})` : ""}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: cn(
              "rounded-full flex-shrink-0",
              cfg.dot,
              size === "sm" ? "w-1 h-1" : "w-1.5 h-1.5"
            )
          }
        ),
        cfg.label,
        confidence && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "opacity-70 font-normal", children: [
          "· ",
          confidence.toUpperCase()
        ] })
      ]
    }
  );
}
export {
  Confidence as C,
  Signal as S,
  TrendingDown as T,
  SignalBadge as a,
  createActor as c
};
