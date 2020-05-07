const indexSettings = {
  index: {
    number_of_shards: "3",
    number_of_replicas: "2",
    refresh_interval: "60s",
    analysis: {
      normalizer: {
        lowercase: {
          type: "custom",
          char_filter: [],
          filter: ["lowercase"],
        },
      },
    },
  },
}

const defaultMapping = {
  dynamic_templates: [
    {
      headers_fields: {
        match_mapping_type: "string",
        path_match: "request.headers.*",
        mapping: {
          type: "keyword",
          ignore_above: 256,
        },
      },
    },
  ],
  properties: {
    env: {
      type: "keyword",
      index: true,
    },
    duration: {
      type: "integer",
    },
    "@timestamp": {
      type: "date",
    },
    request: {
      properties: {
        userId: {
          type: "text",
          fields: {
            keyword: {
              type: "keyword",
              normalizer: "lowercase",
            },
          },
        },
        email: {
          type: "text",
          fields: {
            keyword: {
              type: "keyword",
              normalizer: "lowercase",
            },
          },
        },
        headers: {
          properties: {
            accept: {
              type: "keyword",
              normalizer: "lowercase",
            },
            "accept-encoding": {
              type: "keyword",
              normalizer: "lowercase",
            },
            authorization: {
              type: "text",
              analyzer: "standard",
            },
            "api-key": {
              type: "keyword",
            },
            "cdn-loop": {
              type: "keyword",
              normalizer: "lowercase",
            },
            "cf-connecting-ip": {
              type: "keyword",
              normalizer: "lowercase",
            },
            "cf-ipcountry": {
              type: "keyword",
              normalizer: "lowercase",
            },
            "cf-ray": {
              type: "keyword",
              normalizer: "lowercase",
            },
            "cf-request-id": {
              type: "keyword",
            },
            "cf-visitor": {
              type: "keyword",
              normalizer: "lowercase",
            },
            "content-length": {
              type: "integer",
            },
            "content-type": {
              type: "keyword",
              normalizer: "lowercase",
            },
            host: {
              type: "keyword",
              normalizer: "lowercase",
            },
            "user-agent": {
              type: "text",
              analyzer: "standard",
            },
            "x-forwarded-for": {
              type: "keyword",
              normalizer: "lowercase",
            },
            "x-forwarded-host": {
              type: "keyword",
              normalizer: "lowercase",
            },
            "x-forwarded-port": {
              type: "keyword",
              normalizer: "lowercase",
            },
            "x-forwarded-proto": {
              type: "keyword",
              normalizer: "lowercase",
            },
            "x-original-forwarded-for": {
              type: "keyword",
              normalizer: "lowercase",
            },
            "x-original-uri": {
              type: "keyword",
              normalizer: "lowercase",
            },
            "x-real-ip": {
              type: "keyword",
              normalizer: "lowercase",
            },
            "x-request-id": {
              type: "keyword",
              normalizer: "lowercase",
            },
            "x-scheme": {
              type: "keyword",
              normalizer: "lowercase",
            },
          },
        },
        httpVersion: {
          type: "keyword",
        },
        method: {
          type: "keyword",
        },
        originalUrl: {
          type: "keyword",
        },
        route: {
          properties: {
            path: {
              type: "keyword",
            },
          },
        },
        path: {
          type: "keyword",
        },
        query: {
          type: "object",
          enabled: false,
        },
        body: {
          type: "object",
          enabled: false,
        },
      },
    },
    response: {
      properties: {
        sent: {
          type: "object",
          enabled: false,
        },
        statusCode: {
          type: "integer",
        },
      },
    },
    process: {
      properties: {
        totalmem: {
          type: "integer",
        },
        freemem: {
          type: "integer",
        },
        loadavg: {
          type: "integer",
        },
      },
    },
    error: {
      properties: {
        errors: {
          type: "object",
          enabled: false,
        },
        code: {
          type: "text",
          fields: {
            keyword: {
              type: "keyword",
              normalizer: "lowercase",
            },
          },
        },
        error: {
          type: "text",
        },
        error_description: {
          type: "text",
        },
        message: {
          type: "text",
          analyzer: "standard",
        },
        name: {
          type: "keyword",
          normalizer: "lowercase",
        },
        stack: {
          type: "keyword",
        },
        type: {
          type: "keyword",
        },
      },
    },
  },
}

const defaultWhiteList = {
  request: [
    "userId",
    "body",
    "email",
    "httpVersion",
    "headers",
    "method",
    "originalUrl",
    "path",
    "query",
  ],
  response: ["statusCode", "sent", "took"],
  error: [
    "message",
    "stack",
    "type",
    "name",
    "code",
    "errors",
    "error",
    "error_description",
  ],
}

const defaultCensor = ["password"]

module.exports = {
  defaultMapping,
  defaultWhiteList,
  defaultCensor,
  indexSettings,
}
