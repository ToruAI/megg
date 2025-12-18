# Spec: Schema Reference

Source: https://modelcontextprotocol.io/specification/2025-11-25/schema

---

## 

​

JSON-RPC

### 

​

`JSONRPCErrorResponse`

interface JSONRPCErrorResponse {  
error: Error;  
id?: RequestId;  
jsonrpc: “2.0”;  
}

A response to a request that indicates an error occurred.

### 

​

`JSONRPCMessage`

JSONRPCMessage: JSONRPCRequest | JSONRPCNotification | JSONRPCResponse

Refers to any valid JSON-RPC object that can be decoded off the wire, or encoded to be sent.

### 

​

`JSONRPCNotification`

interface JSONRPCNotification {  
jsonrpc: “2.0”;  
method: string;  
params?: { [key: string]: any };  
}

A notification which does not expect a response.

### 

​

`JSONRPCRequest`

interface JSONRPCRequest {  
id: RequestId;  
jsonrpc: “2.0”;  
method: string;  
params?: { [key: string]: any };  
}

A request that expects a response.

### 

​

`JSONRPCResultResponse`

interface JSONRPCResultResponse {  
id: RequestId;  
jsonrpc: “2.0”;  
result: Result;  
}

A successful (non-error) response to a request.

## 

​

Common Types

### 

​

`Annotations`

interface Annotations {  
audience?: Role[];  
lastModified?: string;  
priority?: number;  
}

Optional annotations for the client. The client can use annotations to inform how objects are used or displayed

`Optional`audience

audience?: Role[]

Describes who the intended audience of this object or data is.

It can include multiple entries to indicate content useful for multiple audiences (e.g., `[“user”, “assistant”]`).

`Optional`lastModified

lastModified?: string

The moment the resource was last modified, as an ISO 8601 formatted string.

Should be an ISO 8601 formatted string (e.g., “2025-01-12T15:00:58Z”).

Examples: last activity timestamp in an open file, timestamp when the resource was attached, etc.

`Optional`priority

priority?: number

Describes how important this data is for operating the server.

A value of 1 means “most important,” and indicates that the data is effectively required, while 0 means “least important,” and indicates that the data is entirely optional.

### 

​

`Cursor`

Cursor: string

An opaque token used to represent a cursor for pagination.

### 

​

`EmptyResult`

EmptyResult: Result

A response that indicates success but carries no data.

### 

​

`Error`

interface Error {  
code: number;  
data?: unknown;  
message: string;  
}

code

code: number

The error type that occurred.

`Optional`data

data?: unknown

Additional information about the error. The value of this member is defined by the sender (e.g. detailed error information, nested errors etc.).

message

message: string

A short description of the error. The message SHOULD be limited to a concise single sentence.

### 

​

`Icon`

interface Icon {  
mimeType?: string;  
sizes?: string[];  
src: string;  
theme?: “light” | “dark”;  
}

An optionally-sized icon that can be displayed in a user interface.

`Optional`mimeType

mimeType?: string

Optional MIME type override if the source MIME type is missing or generic. For example: `“image/png”`, `“image/jpeg”`, or `“image/svg+xml”`.

`Optional`sizes

sizes?: string[]

Optional array of strings that specify sizes at which the icon can be used. Each string should be in WxH format (e.g., `“48x48”`, `“96x96”`) or `“any”` for scalable formats like SVG.

If not provided, the client should assume that the icon can be used at any size.

src

src: string

A standard URI pointing to an icon resource. May be an HTTP/HTTPS URL or a `data:` URI with Base64-encoded image data.

Consumers SHOULD takes steps to ensure URLs serving icons are from the same domain as the client/server or a trusted domain.

Consumers SHOULD take appropriate precautions when consuming SVGs as they can contain executable JavaScript.

`Optional`theme

theme?: “light” | “dark”

Optional specifier for the theme this icon is designed for. `light` indicates the icon is designed to be used with a light background, and `dark` indicates the icon is designed to be used with a dark background.

If not provided, the client should assume the icon can be used with any theme.

### 

​

`LoggingLevel`

LoggingLevel:  
| “debug”  
| “info”  
| “notice”  
| “warning”  
| “error”  
| “critical”  
| “alert”  
| “emergency”

The severity of a log message.

These map to syslog message severities, as specified in RFC-5424: [<https://datatracker.ietf.org/doc/html/rfc5424#section-6.2.1>](https://datatracker.ietf.org/doc/html/rfc5424#section-6.2.1)

### 

​

`ProgressToken`

ProgressToken: string | number

A progress token, used to associate progress notifications with the original request.

### 

​

`RequestId`

RequestId: string | number

A uniquely identifying ID for a request in JSON-RPC.

### 

​

`Result`

interface Result {  
_meta?: { [key: string]: unknown };  
[key: string]: unknown;  
}

`Optional`_meta

_meta?: { [key: string]: unknown }

See [General fields: `_meta`](/specification/2025-11-25/basic/index#meta) for notes on `_meta` usage.

### 

​

`Role`

Role: “user” | “assistant”

The sender or recipient of messages and data in a conversation.

## 

​

Content

### 

​

`AudioContent`

interface AudioContent {  
_meta?: { [key: string]: unknown };  
annotations?: Annotations;  
data: string;  
mimeType: string;  
type: “audio”;  
}

Audio provided to or from an LLM.

`Optional`_meta

_meta?: { [key: string]: unknown }

See [General fields: `_meta`](/specification/2025-11-25/basic/index#meta) for notes on `_meta` usage.

`Optional`annotations

annotations?: Annotations

Optional annotations for the client.

data

data: string

The base64-encoded audio data.

mimeType

mimeType: string

The MIME type of the audio. Different providers may support different audio types.

### 

​

`BlobResourceContents`

interface BlobResourceContents {  
_meta?: { [key: string]: unknown };  
blob: string;  
mimeType?: string;  
uri: string;  
}

`Optional`_meta

_meta?: { [key: string]: unknown }

See [General fields: `_meta`](/specification/2025-11-25/basic/index#meta) for notes on `_meta` usage.

Inherited from ResourceContents._meta

blob

blob: string

A base64-encoded string representing the binary data of the item.

`Optional`mimeType

mimeType?: string

The MIME type of this resource, if known.

Inherited from ResourceContents.mimeType

uri

uri: string

The URI of this resource.

Inherited from ResourceContents.uri

### 

​

`ContentBlock`

ContentBlock:  
| TextContent  
| ImageContent  
| AudioContent  
| ResourceLink  
| EmbeddedResource

### 

​

`EmbeddedResource`

interface EmbeddedResource {  
_meta?: { [key: string]: unknown };  
annotations?: Annotations;  
resource: TextResourceContents | BlobResourceContents;  
type: “resource”;  
}

The contents of a resource, embedded into a prompt or tool call result.

It is up to the client how best to render embedded resources for the benefit of the LLM and/or the user.

`Optional`_meta

_meta?: { [key: string]: unknown }

See [General fields: `_meta`](/specification/2025-11-25/basic/index#meta) for notes on `_meta` usage.

`Optional`annotations

annotations?: Annotations

Optional annotations for the client.

### 

​

`ImageContent`

interface ImageContent {  
_meta?: { [key: string]: unknown };  
annotations?: Annotations;  
data: string;  
mimeType: string;  
type: “image”;  
}

An image provided to or from an LLM.

`Optional`_meta

_meta?: { [key: string]: unknown }

See [General fields: `_meta`](/specification/2025-11-25/basic/index#meta) for notes on `_meta` usage.

`Optional`annotations

annotations?: Annotations

Optional annotations for the client.

data

data: string

The base64-encoded image data.

mimeType

mimeType: string

The MIME type of the image. Different providers may support different image types.

### 

​

`ResourceLink`

interface ResourceLink {  
_meta?: { [key: string]: unknown };  
annotations?: Annotations;  
description?: string;  
icons?: Icon[];  
mimeType?: string;  
name: string;  
size?: number;  
title?: string;  
type: “resource_link”;  
uri: string;  
}

A resource that the server is capable of reading, included in a prompt or tool call result.

Note: resource links returned by tools are not guaranteed to appear in the results of `resources/list` requests.

`Optional`_meta

_meta?: { [key: string]: unknown }

See [General fields: `_meta`](/specification/2025-11-25/basic/index#meta) for notes on `_meta` usage.

Inherited from Resource._meta

`Optional`annotations

annotations?: Annotations

Optional annotations for the client.

Inherited from Resource.annotations

`Optional`description

description?: string

A description of what this resource represents.

This can be used by clients to improve the LLM’s understanding of available resources. It can be thought of like a “hint” to the model.

Inherited from Resource.description

`Optional`icons

icons?: Icon[]

Optional set of sized icons that the client can display in a user interface.

Clients that support rendering icons MUST support at least the following MIME types:

  * `image/png` \- PNG images (safe, universal compatibility)
  * `image/jpeg` (and `image/jpg`) - JPEG images (safe, universal compatibility)

Clients that support rendering icons SHOULD also support:

  * `image/svg+xml` \- SVG images (scalable but requires security precautions)
  * `image/webp` \- WebP images (modern, efficient format)

Inherited from Resource.icons

`Optional`mimeType

mimeType?: string

The MIME type of this resource, if known.

Inherited from Resource.mimeType

name

name: string

Intended for programmatic or logical use, but used as a display name in past specs or fallback (if title isn’t present).

Inherited from Resource.name

`Optional`size

size?: number

The size of the raw resource content, in bytes (i.e., before base64 encoding or any tokenization), if known.

This can be used by Hosts to display file sizes and estimate context window usage.

Inherited from Resource.size

`Optional`title

title?: string

Intended for UI and end-user contexts — optimized to be human-readable and easily understood, even by those unfamiliar with domain-specific terminology.

If not provided, the name should be used for display (except for Tool, where `annotations.title` should be given precedence over using `name`, if present).

Inherited from Resource.title

uri

uri: string

The URI of this resource.

Inherited from Resource.uri

### 

​

`TextContent`

interface TextContent {  
_meta?: { [key: string]: unknown };  
annotations?: Annotations;  
text: string;  
type: “text”;  
}

Text provided to or from an LLM.

`Optional`_meta

_meta?: { [key: string]: unknown }

See [General fields: `_meta`](/specification/2025-11-25/basic/index#meta) for notes on `_meta` usage.

`Optional`annotations

annotations?: Annotations

Optional annotations for the client.

text

text: string

The text content of the message.

### 

​

`TextResourceContents`

interface TextResourceContents {  
_meta?: { [key: string]: unknown };  
mimeType?: string;  
text: string;  
uri: string;  
}

`Optional`_meta

_meta?: { [key: string]: unknown }

See [General fields: `_meta`](/specification/2025-11-25/basic/index#meta) for notes on `_meta` usage.

Inherited from ResourceContents._meta

`Optional`mimeType

mimeType?: string

The MIME type of this resource, if known.

Inherited from ResourceContents.mimeType

text

text: string

The text of the item. This must only be set if the item can actually be represented as text (not binary data).

uri

uri: string

The URI of this resource.

Inherited from ResourceContents.uri

## 

​

`completion/complete`

### 

​

`CompleteRequest`

interface CompleteRequest {  
id: RequestId;  
jsonrpc: “2.0”;  
method: “completion/complete”;  
params: CompleteRequestParams;  
}

A request from the client to the server, to ask for completion options.

### 

​

`CompleteRequestParams`

interface CompleteRequestParams {  
_meta?: { progressToken?: ProgressToken; [key: string]: unknown };  
argument: { name: string; value: string };  
context?: { arguments?: { [key: string]: string } };  
ref: PromptReference | ResourceTemplateReference;  
}

Parameters for a `completion/complete` request.

`Optional`_meta

_meta?: { progressToken?: ProgressToken; [key: string]: unknown }

See [General fields: `_meta`](/specification/2025-11-25/basic/index#meta) for notes on `_meta` usage.

Type Declaration

  * [key: string]: unknown

  * `Optional`progressToken?: ProgressToken

If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.

Inherited from RequestParams._meta

argument

argument: { name: string; value: string }

The argument’s information

Type Declaration

  * name: string

The name of the argument

  * value: string

The value of the argument to use for completion matching.

`Optional`context

context?: { arguments?: { [key: string]: string } }

Additional, optional context for completions

Type Declaration

  * `Optional`arguments?: { [key: string]: string }

Previously-resolved variables in a URI template or prompt.

### 

​

`CompleteResult`

interface CompleteResult {  
_meta?: { [key: string]: unknown };  
completion: { hasMore?: boolean; total?: number; values: string[] };  
[key: string]: unknown;  
}

The server’s response to a completion/complete request

`Optional`_meta

_meta?: { [key: string]: unknown }

See [General fields: `_meta`](/specification/2025-11-25/basic/index#meta) for notes on `_meta` usage.

Inherited from Result._meta

completion

completion: { hasMore?: boolean; total?: number; values: string[] }

Type Declaration

  * `Optional`hasMore?: boolean

Indicates whether there are additional completion options beyond those provided in the current response, even if the exact total is unknown.

  * `Optional`total?: number

The total number of completion options available. This can exceed the number of values actually sent in the response.

  * values: string[]

An array of completion values. Must not exceed 100 items.

### 

​

`PromptReference`

interface PromptReference {  
name: string;  
title?: string;  
type: “ref/prompt”;  
}

Identifies a prompt.

name

name: string

Intended for programmatic or logical use, but used as a display name in past specs or fallback (if title isn’t present).

Inherited from BaseMetadata.name

`Optional`title

title?: string

Intended for UI and end-user contexts — optimized to be human-readable and easily understood, even by those unfamiliar with domain-specific terminology.

If not provided, the name should be used for display (except for Tool, where `annotations.title` should be given precedence over using `name`, if present).

Inherited from BaseMetadata.title

### 

​

`ResourceTemplateReference`

interface ResourceTemplateReference {  
type: “ref/resource”;  
uri: string;  
}

A reference to a resource or resource template definition.

uri

uri: string

The URI or URI template of the resource.

## 

​

`elicitation/create`

### 

​

`ElicitRequest`

interface ElicitRequest {  
id: RequestId;  
jsonrpc: “2.0”;  
method: “elicitation/create”;  
params: ElicitRequestParams;  
}

A request from the server to elicit additional information from the user via the client.

### 

​

`ElicitRequestParams`

ElicitRequestParams: ElicitRequestFormParams | ElicitRequestURLParams

The parameters for a request to elicit additional information from the user via the client.

### 

​

`ElicitResult`

interface ElicitResult {  
_meta?: { [key: string]: unknown };  
action: “accept” | “decline” | “cancel”;  
content?: { [key: string]: string | number | boolean | string[] };  
[key: string]: unknown;  
}

The client’s response to an elicitation request.

`Optional`_meta

_meta?: { [key: string]: unknown }

See [General fields: `_meta`](/specification/2025-11-25/basic/index#meta) for notes on `_meta` usage.

Inherited from Result._meta

action

action: “accept” | “decline” | “cancel”

The user action in response to the elicitation.

  * “accept”: User submitted the form/confirmed the action
  * “decline”: User explicitly decline the action
  * “cancel”: User dismissed without making an explicit choice

`Optional`content

content?: { [key: string]: string | number | boolean | string[] }

The submitted form data, only present when action is “accept” and mode was “form”. Contains values matching the requested schema. Omitted for out-of-band mode responses.

### 

​

`BooleanSchema`

interface BooleanSchema {  
default?: boolean;  
description?: string;  
title?: string;  
type: “boolean”;  
}

### 

​

`ElicitRequestFormParams`

interface ElicitRequestFormParams {  
_meta?: { progressToken?: ProgressToken; [key: string]: unknown };  
message: string;  
mode?: “form”;  
requestedSchema: {  
$schema?: string;  
properties: { [key: string]: PrimitiveSchemaDefinition };  
required?: string[];  
type: “object”;  
};  
task?: TaskMetadata;  
}

The parameters for a request to elicit non-sensitive information from the user via a form in the client.

`Optional`_meta

_meta?: { progressToken?: ProgressToken; [key: string]: unknown }

See [General fields: `_meta`](/specification/2025-11-25/basic/index#meta) for notes on `_meta` usage.

Type Declaration

  * [key: string]: unknown

  * `Optional`progressToken?: ProgressToken

If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.

Inherited from TaskAugmentedRequestParams._meta

message

message: string

The message to present to the user describing what information is being requested.

`Optional`mode

mode?: “form”

The elicitation mode.

requestedSchema

requestedSchema: {  
$schema?: string;  
properties: { [key: string]: PrimitiveSchemaDefinition };  
required?: string[];  
type: “object”;  
}

A restricted subset of JSON Schema. Only top-level properties are allowed, without nesting.

`Optional`task

task?: TaskMetadata

If specified, the caller is requesting task-augmented execution for this request. The request will return a CreateTaskResult immediately, and the actual result can be retrieved later via tasks/result.

Task augmentation is subject to capability negotiation - receivers MUST declare support for task augmentation of specific request types in their capabilities.

Inherited from TaskAugmentedRequestParams.task

### 

​

`ElicitRequestURLParams`

interface ElicitRequestURLParams {  
_meta?: { progressToken?: ProgressToken; [key: string]: unknown };  
elicitationId: string;  
message: string;  
mode: “url”;  
task?: TaskMetadata;  
url: string;  
}

The parameters for a request to elicit information from the user via a URL in the client.

`Optional`_meta

_meta?: { progressToken?: ProgressToken; [key: string]: unknown }

See [General fields: `_meta`](/specification/2025-11-25/basic/index#meta) for notes on `_meta` usage.

Type Declaration

  * [key: string]: unknown

  * `Optional`progressToken?: ProgressToken

If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.

Inherited from TaskAugmentedRequestParams._meta

elicitationId

elicitationId: string

The ID of the elicitation, which must be unique within the context of the server. The client MUST treat this ID as an opaque value.

message

message: string

The message to present to the user explaining why the interaction is needed.

mode

mode: “url”

The elicitation mode.

`Optional`task

task?: TaskMetadata

If specified, the caller is requesting task-augmented execution for this request. The request will return a CreateTaskResult immediately, and the actual result can be retrieved later via tasks/result.

Task augmentation is subject to capability negotiation - receivers MUST declare support for task augmentation of specific request types in their capabilities.

Inherited from TaskAugmentedRequestParams.task

url

url: string

The URL that the user should navigate to.

### 

​

`EnumSchema`

EnumSchema:  
| SingleSelectEnumSchema  
| MultiSelectEnumSchema  
| LegacyTitledEnumSchema

### 

​

`LegacyTitledEnumSchema`

interface LegacyTitledEnumSchema {  
default?: string;  
description?: string;  
enum: string[];  
enumNames?: string[];  
title?: string;  
type: “string”;  
}

Use TitledSingleSelectEnumSchema instead. This interface will be removed in a future version.

`Optional`enumNames

enumNames?: string[]

(Legacy) Display names for enum values. Non-standard according to JSON schema 2020-12.

### 

​

`MultiSelectEnumSchema`

MultiSelectEnumSchema:  
| UntitledMultiSelectEnumSchema  
| TitledMultiSelectEnumSchema

### 

​

`NumberSchema`

interface NumberSchema {  
default?: number;  
description?: string;  
maximum?: number;  
minimum?: number;  
title?: string;  
type: “number” | “integer”;  
}

### 

​

`PrimitiveSchemaDefinition`

PrimitiveSchemaDefinition:  
| StringSchema  
| NumberSchema  
| BooleanSchema  
| EnumSchema

Restricted schema definitions that only allow primitive types without nested objects or arrays.

### 

​

`SingleSelectEnumSchema`

SingleSelectEnumSchema:  
| UntitledSingleSelectEnumSchema  
| TitledSingleSelectEnumSchema

### 

​

`StringSchema`

interface StringSchema {  
default?: string;  
description?: string;  
format?: “uri” | “email” | “date” | “date-time”;  
maxLength?: number;  
minLength?: number;  
title?: string;  
type: “string”;  
}

### 

​

`TitledMultiSelectEnumSchema`

interface TitledMultiSelectEnumSchema {  
default?: string[];  
description?: string;  
items: { anyOf: { const: string; title: string }[] };  
maxItems?: number;  
minItems?: number;  
title?: string;  
type: “array”;  
}

Schema for multiple-selection enumeration with display titles for each option.

`Optional`default

default?: string[]

Optional default value.

`Optional`description

description?: string

Optional description for the enum field.

items

items: { anyOf: { const: string; title: string }[] }

Schema for array items with enum options and display labels.

Type Declaration

  * anyOf: { const: string; title: string }[]

Array of enum options with values and display labels.

`Optional`maxItems

maxItems?: number

Maximum number of items to select.

`Optional`minItems

minItems?: number

Minimum number of items to select.

`Optional`title

title?: string

Optional title for the enum field.

### 

​

`TitledSingleSelectEnumSchema`

interface TitledSingleSelectEnumSchema {  
default?: string;  
description?: string;  
oneOf: { const: string; title: string }[];  
title?: string;  
type: “string”;  
}

Schema for single-selection enumeration with display titles for each option.

`Optional`default

default?: string

Optional default value.

`Optional`description

description?: string

Optional description for the enum field.

oneOf

oneOf: { const: string; title: string }[]

Array of enum options with values and display labels.

Type Declaration

  * const: string

The enum value.

  * title: string

Display label for this option.

`Optional`title

title?: string

Optional title for the enum field.

### 

​

`UntitledMultiSelectEnumSchema`

interface UntitledMultiSelectEnumSchema {  
default?: string[];  
description?: string;  
items: { enum: string[]; type: “string” };  
maxItems?: number;  
minItems?: number;  
title?: string;  
type: “array”;  
}

Schema for multiple-selection enumeration without display titles for options.

`Optional`default

default?: string[]

Optional default value.

`Optional`description

description?: string

Optional description for the enum field.

items

items: { enum: string[]; type: “string” }

Schema for the array items.

Type Declaration

  * enum: string[]

Array of enum values to choose from.

  * type: “string”

`Optional`maxItems

maxItems?: number

Maximum number of items to select.

`Optional`minItems

minItems?: number

Minimum number of items to select.

`Optional`title

title?: string

Optional title for the enum field.

### 

​

`UntitledSingleSelectEnumSchema`

interface UntitledSingleSelectEnumSchema {  
default?: string;  
description?: string;  
enum: string[];  
title?: string;  
type: “string”;  
}

Schema for single-selection enumeration without display titles for options.

`Optional`default

default?: string

Optional default value.

`Optional`description

description?: string

Optional description for the enum field.

enum

enum: string[]

Array of enum values to choose from.

`Optional`title

title?: string

Optional title for the enum field.

## 

​

`initialize`

### 

​

`InitializeRequest`

interface InitializeRequest {  
id: RequestId;  
jsonrpc: “2.0”;  
method: “initialize”;  
params: InitializeRequestParams;  
}

This request is sent from the client to the server when it first connects, asking it to begin initialization.

### 

​

`InitializeRequestParams`

interface InitializeRequestParams {  
_meta?: { progressToken?: ProgressToken; [key: string]: unknown };  
capabilities: ClientCapabilities;  
clientInfo: Implementation;  
protocolVersion: string;  
}

Parameters for an `initialize` request.

`Optional`_meta

_meta?: { progressToken?: ProgressToken; [key: string]: unknown }

See [General fields: `_meta`](/specification/2025-11-25/basic/index#meta) for notes on `_meta` usage.

Type Declaration

  * [key: string]: unknown

  * `Optional`progressToken?: ProgressToken

If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.

Inherited from RequestParams._meta

protocolVersion

protocolVersion: string

The latest version of the Model Context Protocol that the client supports. The client MAY decide to support older versions as well.

### 

​

`InitializeResult`

interface InitializeResult {  
_meta?: { [key: string]: unknown };  
capabilities: ServerCapabilities;  
instructions?: string;  
protocolVersion: string;  
serverInfo: Implementation;  
[key: string]: unknown;  
}

After receiving an initialize request from the client, the server sends this response.

`Optional`_meta

_meta?: { [key: string]: unknown }

See [General fields: `_meta`](/specification/2025-11-25/basic/index#meta) for notes on `_meta` usage.

Inherited from Result._meta

`Optional`instructions

instructions?: string

Instructions describing how to use the server and its features.

This can be used by clients to improve the LLM’s understanding of available tools, resources, etc. It can be thought of like a “hint” to the model. For example, this information MAY be added to the system prompt.

protocolVersion

protocolVersion: string

The version of the Model Context Protocol that the server wants to use. This may not match the version that the client requested. If the client cannot support this version, it MUST disconnect.

### 

​

`ClientCapabilities`

interface ClientCapabilities {  
elicitation?: { form?: object; url?: object };  
experimental?: { [key: string]: object };  
roots?: { listChanged?: boolean };  
sampling?: { context?: object; tools?: object };  
tasks?: {  
cancel?: object;  
list?: object;  
requests?: {  
elicitation?: { create?: object };  
sampling?: { createMessage?: object };  
};  
};  
}

Capabilities a client may support. Known capabilities are defined here, in this schema, but this is not a closed set: any client can define its own, additional capabilities.

`Optional`elicitation

elicitation?: { form?: object; url?: object }

Present if the client supports elicitation from the server.

`Optional`experimental

experimental?: { [key: string]: object }

Experimental, non-standard capabilities that the client supports.

`Optional`roots

roots?: { listChanged?: boolean }

Present if the client supports listing roots.

Type Declaration

  * `Optional`listChanged?: boolean

Whether the client supports notifications for changes to the roots list.

`Optional`sampling

sampling?: { context?: object; tools?: object }

Present if the client supports sampling from an LLM.

Type Declaration

  * `Optional`context?: object

Whether the client supports context inclusion via includeContext parameter. If not declared, servers SHOULD only use `includeContext: “none”` (or omit it).

  * `Optional`tools?: object

Whether the client supports tool use via tools and toolChoice parameters.

`Optional`tasks

tasks?: {  
cancel?: object;  
list?: object;  
requests?: {  
elicitation?: { create?: object };  
sampling?: { createMessage?: object };  
};  
}

Present if the client supports task-augmented requests.

Type Declaration

  * `Optional`cancel?: object

Whether this client supports tasks/cancel.

  * `Optional`list?: object

Whether this client supports tasks/list.

  * `Optional`requests?: { elicitation?: { create?: object }; sampling?: { createMessage?: object } }

Specifies which request types can be augmented with tasks.

    * `Optional`elicitation?: { create?: object }

Task support for elicitation-related requests.

      * `Optional`create?: object

Whether the client supports task-augmented elicitation/create requests.

    * `Optional`sampling?: { createMessage?: object }

Task support for sampling-related requests.

      * `Optional`createMessage?: object

Whether the client supports task-augmented sampling/createMessage requests.

### 

​

`Implementation`

interface Implementation {  
description?: string;  
icons?: Icon[];  
name: string;  
title?: string;  
version: string;  
websiteUrl?: string;  
}

Describes the MCP implementation.

`Optional`description

description?: string

An optional human-readable description of what this implementation does.

This can be used by clients or servers to provide context about their purpose and capabilities. For example, a server might describe the types of resources or tools it provides, while a client might describe its intended use case.

`Optional`icons

icons?: Icon[]

Optional set of sized icons that the client can display in a user interface.

Clients that support rendering icons MUST support at least the following MIME types:

  * `image/png` \- PNG images (safe, universal compatibility)
  * `image/jpeg` (and `image/jpg`) - JPEG images (safe, universal compatibility)

Clients that support rendering icons SHOULD also support:

  * `image/svg+xml` \- SVG images (scalable but requires security precautions)
  * `image/webp` \- WebP images (modern, efficient format)

Inherited from Icons.icons

name

name: string

Intended for programmatic or logical use, but used as a display name in past specs or fallback (if title isn’t present).

Inherited from BaseMetadata.name

`Optional`title

title?: string

Intended for UI and end-user contexts — optimized to be human-readable and easily understood, even by those unfamiliar with domain-specific terminology.

If not provided, the name should be used for display (except for Tool, where `annotations.title` should be given precedence over using `name`, if present).

Inherited from BaseMetadata.title

`Optional`websiteUrl

websiteUrl?: string

An optional URL of the website for this implementation.

### 

​

`ServerCapabilities`

interface ServerCapabilities {  
completions?: object;  
experimental?: { [key: string]: object };  
logging?: object;  
prompts?: { listChanged?: boolean };  
resources?: { listChanged?: boolean; subscribe?: boolean };  
tasks?: {  
cancel?: object;  
list?: object;  
requests?: { tools?: { call?: object } };  
};  
tools?: { listChanged?: boolean };  
}

Capabilities that a server may support. Known capabilities are defined here, in this schema, but this is not a closed set: any server can define its own, additional capabilities.

`Optional`completions

completions?: object

Present if the server supports argument autocompletion suggestions.

`Optional`experimental

experimental?: { [key: string]: object }

Experimental, non-standard capabilities that the server supports.

`Optional`logging

logging?: object

Present if the server supports sending log messages to the client.

`Optional`prompts

prompts?: { listChanged?: boolean }

Present if the server offers any prompt templates.

Type Declaration

  * `Optional`listChanged?: boolean

Whether this server supports notifications for changes to the prompt list.

`Optional`resources

resources?: { listChanged?: boolean; subscribe?: boolean }

Present if the server offers any resources to read.

Type Declaration

  * `Optional`listChanged?: boolean

Whether this server supports notifications for changes to the resource list.

  * `Optional`subscribe?: boolean

Whether this server supports subscribing to resource updates.

`Optional`tasks

tasks?: {  
cancel?: object;  
list?: object;  
requests?: { tools?: { call?: object } };  
}

Present if the server supports task-augmented requests.

Type Declaration

  * `Optional`cancel?: object

Whether this server supports tasks/cancel.

  * `Optional`list?: object

Whether this server supports tasks/list.

  * `Optional`requests?: { tools?: { call?: object } }

Specifies which request types can be augmented with tasks.

    * `Optional`tools?: { call?: object }

Task support for tool-related requests.

      * `Optional`call?: object

Whether the server supports task-augmented tools/call requests.

`Optional`tools

tools?: { listChanged?: boolean }

Present if the server offers any tools to call.

Type Declaration

  * `Optional`listChanged?: boolean

Whether this server supports notifications for changes to the tool list.

## 

​

`logging/setLevel`

### 

​

`SetLevelRequest`

interface SetLevelRequest {  
id: RequestId;  
jsonrpc: “2.0”;  
method: “logging/setLevel”;  
params: SetLevelRequestParams;  
}

A request from the client to the server, to enable or adjust logging.

### 

​

`SetLevelRequestParams`

interface SetLevelRequestParams {  
_meta?: { progressToken?: ProgressToken; [key: string]: unknown };  
level: LoggingLevel;  
}

Parameters for a `logging/setLevel` request.

`Optional`_meta

_meta?: { progressToken?: ProgressToken; [key: string]: unknown }

See [General fields: `_meta`](/specification/2025-11-25/basic/index#meta) for notes on `_meta` usage.

Type Declaration

  * [key: string]: unknown

  * `Optional`progressToken?: ProgressToken

If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.

Inherited from RequestParams._meta

level

level: LoggingLevel

The level of logging that the client wants to receive from the server. The server should send all logs at this level and higher (i.e., more severe) to the client as notifications/message.

## 

​

`notifications/cancelled`

### 

​

`CancelledNotification`

interface CancelledNotification {  
jsonrpc: “2.0”;  
method: “notifications/cancelled”;  
params: CancelledNotificationParams;  
}

This notification can be sent by either side to indicate that it is cancelling a previously-issued request.

The request SHOULD still be in-flight, but due to communication latency, it is always possible that this notification MAY arrive after the request has already finished.

This notification indicates that the result will be unused, so any associated processing SHOULD cease.

A client MUST NOT attempt to cancel its `initialize` request.

For task cancellation, use the `tasks/cancel` request instead of this notification.

### 

​

`CancelledNotificationParams`

interface CancelledNotificationParams {  
_meta?: { [key: string]: unknown };  
reason?: string;  
requestId?: RequestId;  
}

Parameters for a `notifications/cancelled` notification.

`Optional`_meta

_meta?: { [key: string]: unknown }

See [General fields: `_meta`](/specification/2025-11-25/basic/index#meta) for notes on `_meta` usage.

Inherited from NotificationParams._meta

`Optional`reason

reason?: string

An optional string describing the reason for the cancellation. This MAY be logged or presented to the user.

`Optional`requestId

requestId?: RequestId

The ID of the request to cancel.

This MUST correspond to the ID of a request previously issued in the same direction. This MUST be provided for cancelling non-task requests. This MUST NOT be used for cancelling tasks (use the `tasks/cancel` request instead).

## 

​

`notifications/initialized`

### 

​

`InitializedNotification`

interface InitializedNotification {  
jsonrpc: “2.0”;  
method: “notifications/initialized”;  
params?: NotificationParams;  
}

This notification is sent from the client to the server after initialization has finished.

## 

​

`notifications/tasks/status`

### 

​

`TaskStatusNotification`

interface TaskStatusNotification {  
jsonrpc: “2.0”;  
method: “notifications/tasks/status”;  
params: TaskStatusNotificationParams;  
}

An optional notification from the receiver to the requestor, informing them that a task’s status has changed. Receivers are not required to send these notifications.

### 

​

`TaskStatusNotificationParams`

TaskStatusNotificationParams: NotificationParams & Task

Parameters for a `notifications/tasks/status` notification.

## 

​

`notifications/message`

### 

​

`LoggingMessageNotification`

interface LoggingMessageNotification {  
jsonrpc: “2.0”;  
method: “notifications/message”;  
params: LoggingMessageNotificationParams;  
}

JSONRPCNotification of a log message passed from server to client. If no logging/setLevel request has been sent from the client, the server MAY decide which messages to send automatically.

### 

​

`LoggingMessageNotificationParams`

interface LoggingMessageNotificationParams {  
_meta?: { [key: string]: unknown };  
data: unknown;  
level: LoggingLevel;  
logger?: string;  
}

Parameters for a `notifications/message` notification.

`Optional`_meta

_meta?: { [key: string]: unknown }

See [General fields: `_meta`](/specification/2025-11-25/basic/index#meta) for notes on `_meta` usage.

Inherited from NotificationParams._meta

data

data: unknown

The data to be logged, such as a string message or an object. Any JSON serializable type is allowed here.

level

level: LoggingLevel

The severity of this log message.

`Optional`logger

logger?: string

An optional name of the logger issuing this message.

## 

​

`notifications/progress`

### 

​

`ProgressNotification`

interface ProgressNotification {  
jsonrpc: “2.0”;  
method: “notifications/progress”;  
params: ProgressNotificationParams;  
}

An out-of-band notification used to inform the receiver of a progress update for a long-running request.

### 

​

`ProgressNotificationParams`

interface ProgressNotificationParams {  
_meta?: { [key: string]: unknown };  
message?: string;  
progress: number;  
progressToken: ProgressToken;  
total?: number;  
}

Parameters for a `notifications/progress` notification.

`Optional`_meta

_meta?: { [key: string]: unknown }

See [General fields: `_meta`](/specification/2025-11-25/basic/index#meta) for notes on `_meta` usage.

Inherited from NotificationParams._meta

`Optional`message

message?: string

An optional message describing the current progress.

progress

progress: number

The progress thus far. This should increase every time progress is made, even if the total is unknown.

progressToken

progressToken: ProgressToken

The progress token which was given in the initial request, used to associate this notification with the request that is proceeding.

`Optional`total

total?: number

Total number of items to process (or total progress required), if known.

## 

​

`notifications/prompts/list_changed`

### 

​

`PromptListChangedNotification`

interface PromptListChangedNotification {  
jsonrpc: “2.0”;  
method: “notifications/prompts/list_changed”;  
params?: NotificationParams;  
}

An optional notification from the server to the client, informing it that the list of prompts it offers has changed. This may be issued by servers without any previous subscription from the client.

## 

​

`notifications/resources/list_changed`

### 

​

`ResourceListChangedNotification`

interface ResourceListChangedNotification {  
jsonrpc: “2.0”;  
method: “notifications/resources/list_changed”;  
params?: NotificationParams;  
}

An optional notification from the server to the client, informing it that the list of resources it can read from has changed. This may be issued by servers without any previous subscription from the client.

## 

​

`notifications/resources/updated`

### 

​

`ResourceUpdatedNotification`

interface ResourceUpdatedNotification {  
jsonrpc: “2.0”;  
method: “notifications/resources/updated”;  
params: ResourceUpdatedNotificationParams;  
}

A notification from the server to the client, informing it that a resource has changed and may need to be read again. This should only be sent if the client previously sent a resources/subscribe request.

### 

​

`ResourceUpdatedNotificationParams`

interface ResourceUpdatedNotificationParams {  
_meta?: { [key: string]: unknown };  
uri: string;  
}

Parameters for a `notifications/resources/updated` notification.

`Optional`_meta

_meta?: { [key: string]: unknown }

See [General fields: `_meta`](/specification/2025-11-25/basic/index#meta) for notes on `_meta` usage.

Inherited from NotificationParams._meta

uri

uri: string

The URI of the resource that has been updated. This might be a sub-resource of the one that the client actually subscribed to.

## 

​

`notifications/roots/list_changed`

### 

​

`RootsListChangedNotification`

interface RootsListChangedNotification {  
jsonrpc: “2.0”;  
method: “notifications/roots/list_changed”;  
params?: NotificationParams;  
}

A notification from the client to the server, informing it that the list of roots has changed. This notification should be sent whenever the client adds, removes, or modifies any root. The server should then request an updated list of roots using the ListRootsRequest.

## 

​

`notifications/tools/list_changed`

### 

​

`ToolListChangedNotification`

interface ToolListChangedNotification {  
jsonrpc: “2.0”;  
method: “notifications/tools/list_changed”;  
params?: NotificationParams;  
}

An optional notification from the server to the client, informing it that the list of tools it offers has changed. This may be issued by servers without any previous subscription from the client.

## 

​

`notifications/elicitation/complete`

### 

​

`ElicitationCompleteNotification`

interface ElicitationCompleteNotification {  
jsonrpc: “2.0”;  
method: “notifications/elicitation/complete”;  
params: { elicitationId: string };  
}

An optional notification from the server to the client, informing it of a completion of a out-of-band elicitation request.

params

params: { elicitationId: string }

Type Declaration

  * elicitationId: string

The ID of the elicitation that completed.

Overrides JSONRPCNotification.params

## 

​

`ping`

### 

​

`PingRequest`

interface PingRequest {  
id: RequestId;  
jsonrpc: “2.0”;  
method: “ping”;  
params?: RequestParams;  
}

A ping, issued by either the server or the client, to check that the other party is still alive. The receiver must promptly respond, or else may be disconnected.

## 

​

`tasks`

### 

​

`CreateTaskResult`

interface CreateTaskResult {  
_meta?: { [key: string]: unknown };  
task: Task;  
[key: string]: unknown;  
}

A response to a task-augmented request.

`Optional`_meta

_meta?: { [key: string]: unknown }

See [General fields: `_meta`](/specification/2025-11-25/basic/index#meta) for notes on `_meta` usage.

Inherited from Result._meta

### 

​

`RelatedTaskMetadata`

interface RelatedTaskMetadata {  
taskId: string;  
}

Metadata for associating messages with a task. Include this in the `_meta` field under the key `io.modelcontextprotocol/related-task`.

taskId

taskId: string

The task identifier this message is associated with.

### 

​

`Task`

interface Task {  
createdAt: string;  
lastUpdatedAt: string;  
pollInterval?: number;  
status: TaskStatus;  
statusMessage?: string;  
taskId: string;  
ttl: number | null;  
}

Data associated with a task.

createdAt

createdAt: string

ISO 8601 timestamp when the task was created.

lastUpdatedAt

lastUpdatedAt: string

ISO 8601 timestamp when the task was last updated.

`Optional`pollInterval

pollInterval?: number

Suggested polling interval in milliseconds.

status

status: TaskStatus

Current task state.

`Optional`statusMessage

statusMessage?: string

Optional human-readable message describing the current task state. This can provide context for any status, including:

  * Reasons for “cancelled” status
  * Summaries for “completed” status
  * Diagnostic information for “failed” status (e.g., error details, what went wrong)

taskId

taskId: string

The task identifier.

ttl

ttl: number | null

Actual retention duration from creation in milliseconds, null for unlimited.

### 

​

`TaskMetadata`

interface TaskMetadata {  
ttl?: number;  
}

Metadata for augmenting a request with task execution. Include this in the `task` field of the request parameters.

`Optional`ttl

ttl?: number

Requested duration in milliseconds to retain task from creation.

### 

​

`TaskStatus`

TaskStatus: “working” | “input_required” | “completed” | “failed” | “cancelled”

The status of a task.

## 

​

`tasks/get`

### 

​

`GetTaskRequest`

interface GetTaskRequest {  
id: RequestId;  
jsonrpc: “2.0”;  
method: “tasks/get”;  
params: { taskId: string };  
}

A request to retrieve the state of a task.

params

params: { taskId: string }

Type Declaration

  * taskId: string

The task identifier to query.

Overrides JSONRPCRequest.params

### 

​

`GetTaskResult`

GetTaskResult: Result & Task

The response to a tasks/get request.

## 

​

`tasks/result`

### 

​

`GetTaskPayloadRequest`

interface GetTaskPayloadRequest {  
id: RequestId;  
jsonrpc: “2.0”;  
method: “tasks/result”;  
params: { taskId: string };  
}

A request to retrieve the result of a completed task.

params

params: { taskId: string }

Type Declaration

  * taskId: string

The task identifier to retrieve results for.

Overrides JSONRPCRequest.params

### 

​

`GetTaskPayloadResult`

interface GetTaskPayloadResult {  
_meta?: { [key: string]: unknown };  
[key: string]: unknown;  
}

The response to a tasks/result request. The structure matches the result type of the original request. For example, a tools/call task would return the CallToolResult structure.

`Optional`_meta

_meta?: { [key: string]: unknown }

See [General fields: `_meta`](/specification/2025-11-25/basic/index#meta) for notes on `_meta` usage.

Inherited from Result._meta

## 

​

`tasks/list`

### 

​

`ListTasksRequest`

interface ListTasksRequest {  
id: RequestId;  
jsonrpc: “2.0”;  
method: “tasks/list”;  
params?: PaginatedRequestParams;  
}

A request to retrieve a list of tasks.

### 

​

`ListTasksResult`

interface ListTasksResult {  
_meta?: { [key: string]: unknown };  
nextCursor?: string;  
tasks: Task[];  
[key: string]: unknown;  
}

The response to a tasks/list request.

`Optional`_meta

_meta?: { [key: string]: unknown }

See [General fields: `_meta`](/specification/2025-11-25/basic/index#meta) for notes on `_meta` usage.

Inherited from PaginatedResult._meta

`Optional`nextCursor

nextCursor?: string

An opaque token representing the pagination position after the last returned result. If present, there may be more results available.

Inherited from PaginatedResult.nextCursor

## 

​

`tasks/cancel`

### 

​

`CancelTaskRequest`

interface CancelTaskRequest {  
id: RequestId;  
jsonrpc: “2.0”;  
method: “tasks/cancel”;  
params: { taskId: string };  
}

A request to cancel a task.

params

params: { taskId: string }

Type Declaration

  * taskId: string

The task identifier to cancel.

Overrides JSONRPCRequest.params

### 

​

`CancelTaskResult`

CancelTaskResult: Result & Task

The response to a tasks/cancel request.

## 

​

`prompts/get`

### 

​

`GetPromptRequest`

interface GetPromptRequest {  
id: RequestId;  
jsonrpc: “2.0”;  
method: “prompts/get”;  
params: GetPromptRequestParams;  
}

Used by the client to get a prompt provided by the server.

### 

​

`GetPromptRequestParams`

interface GetPromptRequestParams {  
_meta?: { progressToken?: ProgressToken; [key: string]: unknown };  
arguments?: { [key: string]: string };  
name: string;  
}

Parameters for a `prompts/get` request.

`Optional`_meta

_meta?: { progressToken?: ProgressToken; [key: string]: unknown }

See [General fields: `_meta`](/specification/2025-11-25/basic/index#meta) for notes on `_meta` usage.

Type Declaration

  * [key: string]: unknown

  * `Optional`progressToken?: ProgressToken

If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.

Inherited from RequestParams._meta

`Optional`arguments

arguments?: { [key: string]: string }

Arguments to use for templating the prompt.

name

name: string

The name of the prompt or prompt template.

### 

​

`GetPromptResult`

interface GetPromptResult {  
_meta?: { [key: string]: unknown };  
description?: string;  
messages: PromptMessage[];  
[key: string]: unknown;  
}

The server’s response to a prompts/get request from the client.

`Optional`_meta

_meta?: { [key: string]: unknown }

See [General fields: `_meta`](/specification/2025-11-25/basic/index#meta) for notes on `_meta` usage.

Inherited from Result._meta

`Optional`description

description?: string

An optional description for the prompt.

### 

​

`PromptMessage`

interface PromptMessage {  
content: ContentBlock;  
role: Role;  
}

Describes a message returned as part of a prompt.

This is similar to `SamplingMessage`, but also supports the embedding of resources from the MCP server.

## 

​

`prompts/list`

### 

​

`ListPromptsRequest`

interface ListPromptsRequest {  
id: RequestId;  
jsonrpc: “2.0”;  
method: “prompts/list”;  
params?: PaginatedRequestParams;  
}

Sent from the client to request a list of prompts and prompt templates the server has.

### 

​

`ListPromptsResult`

interface ListPromptsResult {  
_meta?: { [key: string]: unknown };  
nextCursor?: string;  
prompts: Prompt[];  
[key: string]: unknown;  
}

The server’s response to a prompts/list request from the client.

`Optional`_meta

_meta?: { [key: string]: unknown }

See [General fields: `_meta`](/specification/2025-11-25/basic/index#meta) for notes on `_meta` usage.

Inherited from PaginatedResult._meta

`Optional`nextCursor

nextCursor?: string

An opaque token representing the pagination position after the last returned result. If present, there may be more results available.

Inherited from PaginatedResult.nextCursor

### 

​

`Prompt`

interface Prompt {  
_meta?: { [key: string]: unknown };  
arguments?: PromptArgument[];  
description?: string;  
icons?: Icon[];  
name: string;  
title?: string;  
}

A prompt or prompt template that the server offers.

`Optional`_meta

_meta?: { [key: string]: unknown }

See [General fields: `_meta`](/specification/2025-11-25/basic/index#meta) for notes on `_meta` usage.

`Optional`arguments

arguments?: PromptArgument[]

A list of arguments to use for templating the prompt.

`Optional`description

description?: string

An optional description of what this prompt provides

`Optional`icons

icons?: Icon[]

Optional set of sized icons that the client can display in a user interface.

Clients that support rendering icons MUST support at least the following MIME types:

  * `image/png` \- PNG images (safe, universal compatibility)
  * `image/jpeg` (and `image/jpg`) - JPEG images (safe, universal compatibility)

Clients that support rendering icons SHOULD also support:

  * `image/svg+xml` \- SVG images (scalable but requires security precautions)
  * `image/webp` \- WebP images (modern, efficient format)

Inherited from Icons.icons

name

name: string

Intended for programmatic or logical use, but used as a display name in past specs or fallback (if title isn’t present).

Inherited from BaseMetadata.name

`Optional`title

title?: string

Intended for UI and end-user contexts — optimized to be human-readable and easily understood, even by those unfamiliar with domain-specific terminology.

If not provided, the name should be used for display (except for Tool, where `annotations.title` should be given precedence over using `name`, if present).

Inherited from BaseMetadata.title

### 

​

`PromptArgument`

interface PromptArgument {  
description?: string;  
name: string;  
required?: boolean;  
title?: string;  
}

Describes an argument that a prompt can accept.

`Optional`description

description?: string

A human-readable description of the argument.

name

name: string

Intended for programmatic or logical use, but used as a display name in past specs or fallback (if title isn’t present).

Inherited from BaseMetadata.name

`Optional`required

required?: boolean

Whether this argument must be provided.

`Optional`title

title?: string

Intended for UI and end-user contexts — optimized to be human-readable and easily understood, even by those unfamiliar with domain-specific terminology.

If not provided, the name should be used for display (except for Tool, where `annotations.title` should be given precedence over using `name`, if present).

Inherited from BaseMetadata.title

## 

​

`resources/list`

### 

​

`ListResourcesRequest`

interface ListResourcesRequest {  
id: RequestId;  
jsonrpc: “2.0”;  
method: “resources/list”;  
params?: PaginatedRequestParams;  
}

Sent from the client to request a list of resources the server has.

### 

​

`ListResourcesResult`

interface ListResourcesResult {  
_meta?: { [key: string]: unknown };  
nextCursor?: string;  
resources: Resource[];  
[key: string]: unknown;  
}

The server’s response to a resources/list request from the client.

`Optional`_meta

_meta?: { [key: string]: unknown }

See [General fields: `_meta`](/specification/2025-11-25/basic/index#meta) for notes on `_meta` usage.

Inherited from PaginatedResult._meta

`Optional`nextCursor

nextCursor?: string

An opaque token representing the pagination position after the last returned result. If present, there may be more results available.

Inherited from PaginatedResult.nextCursor

### 

​

`Resource`

interface Resource {  
_meta?: { [key: string]: unknown };  
annotations?: Annotations;  
description?: string;  
icons?: Icon[];  
mimeType?: string;  
name: string;  
size?: number;  
title?: string;  
uri: string;  
}

A known resource that the server is capable of reading.

`Optional`_meta

_meta?: { [key: string]: unknown }

See [General fields: `_meta`](/specification/2025-11-25/basic/index#meta) for notes on `_meta` usage.

`Optional`annotations

annotations?: Annotations

Optional annotations for the client.

`Optional`description

description?: string

A description of what this resource represents.

This can be used by clients to improve the LLM’s understanding of available resources. It can be thought of like a “hint” to the model.

`Optional`icons

icons?: Icon[]

Optional set of sized icons that the client can display in a user interface.

Clients that support rendering icons MUST support at least the following MIME types:

  * `image/png` \- PNG images (safe, universal compatibility)
  * `image/jpeg` (and `image/jpg`) - JPEG images (safe, universal compatibility)

Clients that support rendering icons SHOULD also support:

  * `image/svg+xml` \- SVG images (scalable but requires security precautions)
  * `image/webp` \- WebP images (modern, efficient format)

Inherited from Icons.icons

`Optional`mimeType

mimeType?: string

The MIME type of this resource, if known.

name

name: string

Intended for programmatic or logical use, but used as a display name in past specs or fallback (if title isn’t present).

Inherited from BaseMetadata.name

`Optional`size

size?: number

The size of the raw resource content, in bytes (i.e., before base64 encoding or any tokenization), if known.

This can be used by Hosts to display file sizes and estimate context window usage.

`Optional`title

title?: string

Intended for UI and end-user contexts — optimized to be human-readable and easily understood, even by those unfamiliar with domain-specific terminology.

If not provided, the name should be used for display (except for Tool, where `annotations.title` should be given precedence over using `name`, if present).

Inherited from BaseMetadata.title

uri

uri: string

The URI of this resource.

## 

​

`resources/read`

### 

​

`ReadResourceRequest`

interface ReadResourceRequest {  
id: RequestId;  
jsonrpc: “2.0”;  
method: “resources/read”;  
params: ReadResourceRequestParams;  
}

Sent from the client to the server, to read a specific resource URI.

### 

​

`ReadResourceRequestParams`

interface ReadResourceRequestParams {  
_meta?: { progressToken?: ProgressToken; [key: string]: unknown };  
uri: string;  
}

Parameters for a `resources/read` request.

`Optional`_meta

_meta?: { progressToken?: ProgressToken; [key: string]: unknown }

See [General fields: `_meta`](/specification/2025-11-25/basic/index#meta) for notes on `_meta` usage.

Type Declaration

  * [key: string]: unknown

  * `Optional`progressToken?: ProgressToken

If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.

Inherited from ResourceRequestParams._meta

uri

uri: string

The URI of the resource. The URI can use any protocol; it is up to the server how to interpret it.

Inherited from ResourceRequestParams.uri

### 

​

`ReadResourceResult`

interface ReadResourceResult {  
_meta?: { [key: string]: unknown };  
contents: (TextResourceContents | BlobResourceContents)[];  
[key: string]: unknown;  
}

The server’s response to a resources/read request from the client.

`Optional`_meta

_meta?: { [key: string]: unknown }

See [General fields: `_meta`](/specification/2025-11-25/basic/index#meta) for notes on `_meta` usage.

Inherited from Result._meta

## 

​

`resources/subscribe`

### 

​

`SubscribeRequest`

interface SubscribeRequest {  
id: RequestId;  
jsonrpc: “2.0”;  
method: “resources/subscribe”;  
params: SubscribeRequestParams;  
}

Sent from the client to request resources/updated notifications from the server whenever a particular resource changes.

### 

​

`SubscribeRequestParams`

interface SubscribeRequestParams {  
_meta?: { progressToken?: ProgressToken; [key: string]: unknown };  
uri: string;  
}

Parameters for a `resources/subscribe` request.

`Optional`_meta

_meta?: { progressToken?: ProgressToken; [key: string]: unknown }

See [General fields: `_meta`](/specification/2025-11-25/basic/index#meta) for notes on `_meta` usage.

Type Declaration

  * [key: string]: unknown

  * `Optional`progressToken?: ProgressToken

If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.

Inherited from ResourceRequestParams._meta

uri

uri: string

The URI of the resource. The URI can use any protocol; it is up to the server how to interpret it.

Inherited from ResourceRequestParams.uri

## 

​

`resources/templates/list`

### 

​

`ListResourceTemplatesRequest`

interface ListResourceTemplatesRequest {  
id: RequestId;  
jsonrpc: “2.0”;  
method: “resources/templates/list”;  
params?: PaginatedRequestParams;  
}

Sent from the client to request a list of resource templates the server has.

### 

​

`ListResourceTemplatesResult`

interface ListResourceTemplatesResult {  
_meta?: { [key: string]: unknown };  
nextCursor?: string;  
resourceTemplates: ResourceTemplate[];  
[key: string]: unknown;  
}

The server’s response to a resources/templates/list request from the client.

`Optional`_meta

_meta?: { [key: string]: unknown }

See [General fields: `_meta`](/specification/2025-11-25/basic/index#meta) for notes on `_meta` usage.

Inherited from PaginatedResult._meta

`Optional`nextCursor

nextCursor?: string

An opaque token representing the pagination position after the last returned result. If present, there may be more results available.

Inherited from PaginatedResult.nextCursor

### 

​

`ResourceTemplate`

interface ResourceTemplate {  
_meta?: { [key: string]: unknown };  
annotations?: Annotations;  
description?: string;  
icons?: Icon[];  
mimeType?: string;  
name: string;  
title?: string;  
uriTemplate: string;  
}

A template description for resources available on the server.

`Optional`_meta

_meta?: { [key: string]: unknown }

See [General fields: `_meta`](/specification/2025-11-25/basic/index#meta) for notes on `_meta` usage.

`Optional`annotations

annotations?: Annotations

Optional annotations for the client.

`Optional`description

description?: string

A description of what this template is for.

This can be used by clients to improve the LLM’s understanding of available resources. It can be thought of like a “hint” to the model.

`Optional`icons

icons?: Icon[]

Optional set of sized icons that the client can display in a user interface.

Clients that support rendering icons MUST support at least the following MIME types:

  * `image/png` \- PNG images (safe, universal compatibility)
  * `image/jpeg` (and `image/jpg`) - JPEG images (safe, universal compatibility)

Clients that support rendering icons SHOULD also support:

  * `image/svg+xml` \- SVG images (scalable but requires security precautions)
  * `image/webp` \- WebP images (modern, efficient format)

Inherited from Icons.icons

`Optional`mimeType

mimeType?: string

The MIME type for all resources that match this template. This should only be included if all resources matching this template have the same type.

name

name: string

Intended for programmatic or logical use, but used as a display name in past specs or fallback (if title isn’t present).

Inherited from BaseMetadata.name

`Optional`title

title?: string

Intended for UI and end-user contexts — optimized to be human-readable and easily understood, even by those unfamiliar with domain-specific terminology.

If not provided, the name should be used for display (except for Tool, where `annotations.title` should be given precedence over using `name`, if present).

Inherited from BaseMetadata.title

uriTemplate

uriTemplate: string

A URI template (according to RFC 6570) that can be used to construct resource URIs.

## 

​

`resources/unsubscribe`

### 

​

`UnsubscribeRequest`

interface UnsubscribeRequest {  
id: RequestId;  
jsonrpc: “2.0”;  
method: “resources/unsubscribe”;  
params: UnsubscribeRequestParams;  
}

Sent from the client to request cancellation of resources/updated notifications from the server. This should follow a previous resources/subscribe request.

### 

​

`UnsubscribeRequestParams`

interface UnsubscribeRequestParams {  
_meta?: { progressToken?: ProgressToken; [key: string]: unknown };  
uri: string;  
}

Parameters for a `resources/unsubscribe` request.

`Optional`_meta

_meta?: { progressToken?: ProgressToken; [key: string]: unknown }

See [General fields: `_meta`](/specification/2025-11-25/basic/index#meta) for notes on `_meta` usage.

Type Declaration

  * [key: string]: unknown

  * `Optional`progressToken?: ProgressToken

If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.

Inherited from ResourceRequestParams._meta

uri

uri: string

The URI of the resource. The URI can use any protocol; it is up to the server how to interpret it.

Inherited from ResourceRequestParams.uri

## 

​

`roots/list`

### 

​

`ListRootsRequest`

interface ListRootsRequest {  
id: RequestId;  
jsonrpc: “2.0”;  
method: “roots/list”;  
params?: RequestParams;  
}

Sent from the server to request a list of root URIs from the client. Roots allow servers to ask for specific directories or files to operate on. A common example for roots is providing a set of repositories or directories a server should operate on.

This request is typically used when the server needs to understand the file system structure or access specific locations that the client has permission to read from.

### 

​

`ListRootsResult`

interface ListRootsResult {  
_meta?: { [key: string]: unknown };  
roots: Root[];  
[key: string]: unknown;  
}

The client’s response to a roots/list request from the server. This result contains an array of Root objects, each representing a root directory or file that the server can operate on.

`Optional`_meta

_meta?: { [key: string]: unknown }

See [General fields: `_meta`](/specification/2025-11-25/basic/index#meta) for notes on `_meta` usage.

Inherited from Result._meta

### 

​

`Root`

interface Root {  
_meta?: { [key: string]: unknown };  
name?: string;  
uri: string;  
}

Represents a root directory or file that the server can operate on.

`Optional`_meta

_meta?: { [key: string]: unknown }

See [General fields: `_meta`](/specification/2025-11-25/basic/index#meta) for notes on `_meta` usage.

`Optional`name

name?: string

An optional name for the root. This can be used to provide a human-readable identifier for the root, which may be useful for display purposes or for referencing the root in other parts of the application.

uri

uri: string

The URI identifying the root. This _must_ start with file:// for now. This restriction may be relaxed in future versions of the protocol to allow other URI schemes.

## 

​

`sampling/createMessage`

### 

​

`CreateMessageRequest`

interface CreateMessageRequest {  
id: RequestId;  
jsonrpc: “2.0”;  
method: “sampling/createMessage”;  
params: CreateMessageRequestParams;  
}

A request from the server to sample an LLM via the client. The client has full discretion over which model to select. The client should also inform the user before beginning sampling, to allow them to inspect the request (human in the loop) and decide whether to approve it.

### 

​

`CreateMessageRequestParams`

interface CreateMessageRequestParams {  
_meta?: { progressToken?: ProgressToken; [key: string]: unknown };  
includeContext?: “none” | “thisServer” | “allServers”;  
maxTokens: number;  
messages: SamplingMessage[];  
metadata?: object;  
modelPreferences?: ModelPreferences;  
stopSequences?: string[];  
systemPrompt?: string;  
task?: TaskMetadata;  
temperature?: number;  
toolChoice?: ToolChoice;  
tools?: Tool[];  
}

Parameters for a `sampling/createMessage` request.

`Optional`_meta

_meta?: { progressToken?: ProgressToken; [key: string]: unknown }

See [General fields: `_meta`](/specification/2025-11-25/basic/index#meta) for notes on `_meta` usage.

Type Declaration

  * [key: string]: unknown

  * `Optional`progressToken?: ProgressToken

If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.

Inherited from TaskAugmentedRequestParams._meta

`Optional`includeContext

includeContext?: “none” | “thisServer” | “allServers”

A request to include context from one or more MCP servers (including the caller), to be attached to the prompt. The client MAY ignore this request.

Default is “none”. Values “thisServer” and “allServers” are soft-deprecated. Servers SHOULD only use these values if the client declares ClientCapabilities.sampling.context. These values may be removed in future spec releases.

maxTokens

maxTokens: number

The requested maximum number of tokens to sample (to prevent runaway completions).

The client MAY choose to sample fewer tokens than the requested maximum.

`Optional`metadata

metadata?: object

Optional metadata to pass through to the LLM provider. The format of this metadata is provider-specific.

`Optional`modelPreferences

modelPreferences?: ModelPreferences

The server’s preferences for which model to select. The client MAY ignore these preferences.

`Optional`systemPrompt

systemPrompt?: string

An optional system prompt the server wants to use for sampling. The client MAY modify or omit this prompt.

`Optional`task

task?: TaskMetadata

If specified, the caller is requesting task-augmented execution for this request. The request will return a CreateTaskResult immediately, and the actual result can be retrieved later via tasks/result.

Task augmentation is subject to capability negotiation - receivers MUST declare support for task augmentation of specific request types in their capabilities.

Inherited from TaskAugmentedRequestParams.task

`Optional`toolChoice

toolChoice?: ToolChoice

Controls how the model uses tools. The client MUST return an error if this field is provided but ClientCapabilities.sampling.tools is not declared. Default is `{ mode: “auto” }`.

`Optional`tools

tools?: Tool[]

Tools that the model may use during generation. The client MUST return an error if this field is provided but ClientCapabilities.sampling.tools is not declared.

### 

​

`CreateMessageResult`

interface CreateMessageResult {  
_meta?: { [key: string]: unknown };  
content: SamplingMessageContentBlock | SamplingMessageContentBlock[];  
model: string;  
role: Role;  
stopReason?: string;  
[key: string]: unknown;  
}

The client’s response to a sampling/createMessage request from the server. The client should inform the user before returning the sampled message, to allow them to inspect the response (human in the loop) and decide whether to allow the server to see it.

`Optional`_meta

_meta?: { [key: string]: unknown }

See [General fields: `_meta`](/specification/2025-11-25/basic/index#meta) for notes on `_meta` usage.

Inherited from Result._meta

model

model: string

The name of the model that generated the message.

`Optional`stopReason

stopReason?: string

The reason why sampling stopped, if known.

Standard values:

  * “endTurn”: Natural end of the assistant’s turn
  * “stopSequence”: A stop sequence was encountered
  * “maxTokens”: Maximum token limit was reached
  * “toolUse”: The model wants to use one or more tools

This field is an open string to allow for provider-specific stop reasons.

### 

​

`ModelHint`

interface ModelHint {  
name?: string;  
}

Hints to use for model selection.

Keys not declared here are currently left unspecified by the spec and are up to the client to interpret.

`Optional`name

name?: string

A hint for a model name.

The client SHOULD treat this as a substring of a model name; for example:

  * `claude-3-5-sonnet` should match `claude-3-5-sonnet-20241022`
  * `sonnet` should match `claude-3-5-sonnet-20241022`, `claude-3-sonnet-20240229`, etc.
  * `claude` should match any Claude model

The client MAY also map the string to a different provider’s model name or a different model family, as long as it fills a similar niche; for example:

  * `gemini-1.5-flash` could match `claude-3-haiku-20240307`

### 

​

`ModelPreferences`

interface ModelPreferences {  
costPriority?: number;  
hints?: ModelHint[];  
intelligencePriority?: number;  
speedPriority?: number;  
}

The server’s preferences for model selection, requested of the client during sampling.

Because LLMs can vary along multiple dimensions, choosing the “best” model is rarely straightforward. Different models excel in different areas—some are faster but less capable, others are more capable but more expensive, and so on. This interface allows servers to express their priorities across multiple dimensions to help clients make an appropriate selection for their use case.

These preferences are always advisory. The client MAY ignore them. It is also up to the client to decide how to interpret these preferences and how to balance them against other considerations.

`Optional`costPriority

costPriority?: number

How much to prioritize cost when selecting a model. A value of 0 means cost is not important, while a value of 1 means cost is the most important factor.

`Optional`hints

hints?: ModelHint[]

Optional hints to use for model selection.

If multiple hints are specified, the client MUST evaluate them in order (such that the first match is taken).

The client SHOULD prioritize these hints over the numeric priorities, but MAY still use the priorities to select from ambiguous matches.

`Optional`intelligencePriority

intelligencePriority?: number

How much to prioritize intelligence and capabilities when selecting a model. A value of 0 means intelligence is not important, while a value of 1 means intelligence is the most important factor.

`Optional`speedPriority

speedPriority?: number

How much to prioritize sampling speed (latency) when selecting a model. A value of 0 means speed is not important, while a value of 1 means speed is the most important factor.

### 

​

`SamplingMessage`

interface SamplingMessage {  
_meta?: { [key: string]: unknown };  
content: SamplingMessageContentBlock | SamplingMessageContentBlock[];  
role: Role;  
}

Describes a message issued to or received from an LLM API.

`Optional`_meta

_meta?: { [key: string]: unknown }

See [General fields: `_meta`](/specification/2025-11-25/basic/index#meta) for notes on `_meta` usage.

### 

​

`ToolChoice`

interface ToolChoice {  
mode?: “none” | “required” | “auto”;  
}

Controls tool selection behavior for sampling requests.

`Optional`mode

mode?: “none” | “required” | “auto”

Controls the tool use ability of the model:

  * “auto”: Model decides whether to use tools (default)
  * “required”: Model MUST use at least one tool before completing
  * “none”: Model MUST NOT use any tools

### 

​

`ToolResultContent`

interface ToolResultContent {  
_meta?: { [key: string]: unknown };  
content: ContentBlock[];  
isError?: boolean;  
structuredContent?: { [key: string]: unknown };  
toolUseId: string;  
type: “tool_result”;  
}

The result of a tool use, provided by the user back to the assistant.

`Optional`_meta

_meta?: { [key: string]: unknown }

Optional metadata about the tool result. Clients SHOULD preserve this field when including tool results in subsequent sampling requests to enable caching optimizations.

See [General fields: `_meta`](/specification/2025-11-25/basic/index#meta) for notes on `_meta` usage.

content

content: ContentBlock[]

The unstructured result content of the tool use.

This has the same format as CallToolResult.content and can include text, images, audio, resource links, and embedded resources.

`Optional`isError

isError?: boolean

Whether the tool use resulted in an error.

If true, the content typically describes the error that occurred. Default: false

`Optional`structuredContent

structuredContent?: { [key: string]: unknown }

An optional structured result object.

If the tool defined an outputSchema, this SHOULD conform to that schema.

toolUseId

toolUseId: string

The ID of the tool use this result corresponds to.

This MUST match the ID from a previous ToolUseContent.

### 

​

`ToolUseContent`

interface ToolUseContent {  
_meta?: { [key: string]: unknown };  
id: string;  
input: { [key: string]: unknown };  
name: string;  
type: “tool_use”;  
}

A request from the assistant to call a tool.

`Optional`_meta

_meta?: { [key: string]: unknown }

Optional metadata about the tool use. Clients SHOULD preserve this field when including tool uses in subsequent sampling requests to enable caching optimizations.

See [General fields: `_meta`](/specification/2025-11-25/basic/index#meta) for notes on `_meta` usage.

id

id: string

A unique identifier for this tool use.

This ID is used to match tool results to their corresponding tool uses.

input

input: { [key: string]: unknown }

The arguments to pass to the tool, conforming to the tool’s input schema.

name

name: string

The name of the tool to call.

## 

​

`tools/call`

### 

​

`CallToolRequest`

interface CallToolRequest {  
id: RequestId;  
jsonrpc: “2.0”;  
method: “tools/call”;  
params: CallToolRequestParams;  
}

Used by the client to invoke a tool provided by the server.

### 

​

`CallToolRequestParams`

interface CallToolRequestParams {  
_meta?: { progressToken?: ProgressToken; [key: string]: unknown };  
arguments?: { [key: string]: unknown };  
name: string;  
task?: TaskMetadata;  
}

Parameters for a `tools/call` request.

`Optional`_meta

_meta?: { progressToken?: ProgressToken; [key: string]: unknown }

See [General fields: `_meta`](/specification/2025-11-25/basic/index#meta) for notes on `_meta` usage.

Type Declaration

  * [key: string]: unknown

  * `Optional`progressToken?: ProgressToken

If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.

Inherited from TaskAugmentedRequestParams._meta

`Optional`arguments

arguments?: { [key: string]: unknown }

Arguments to use for the tool call.

name

name: string

The name of the tool.

`Optional`task

task?: TaskMetadata

If specified, the caller is requesting task-augmented execution for this request. The request will return a CreateTaskResult immediately, and the actual result can be retrieved later via tasks/result.

Task augmentation is subject to capability negotiation - receivers MUST declare support for task augmentation of specific request types in their capabilities.

Inherited from TaskAugmentedRequestParams.task

### 

​

`CallToolResult`

interface CallToolResult {  
_meta?: { [key: string]: unknown };  
content: ContentBlock[];  
isError?: boolean;  
structuredContent?: { [key: string]: unknown };  
[key: string]: unknown;  
}

The server’s response to a tool call.

`Optional`_meta

_meta?: { [key: string]: unknown }

See [General fields: `_meta`](/specification/2025-11-25/basic/index#meta) for notes on `_meta` usage.

Inherited from Result._meta

content

content: ContentBlock[]

A list of content objects that represent the unstructured result of the tool call.

`Optional`isError

isError?: boolean

Whether the tool call ended in an error.

If not set, this is assumed to be false (the call was successful).

Any errors that originate from the tool SHOULD be reported inside the result object, with `isError` set to true, _not_ as an MCP protocol-level error response. Otherwise, the LLM would not be able to see that an error occurred and self-correct.

However, any errors in _finding_ the tool, an error indicating that the server does not support tool calls, or any other exceptional conditions, should be reported as an MCP error response.

`Optional`structuredContent

structuredContent?: { [key: string]: unknown }

An optional JSON object that represents the structured result of the tool call.

## 

​

`tools/list`

### 

​

`ListToolsRequest`

interface ListToolsRequest {  
id: RequestId;  
jsonrpc: “2.0”;  
method: “tools/list”;  
params?: PaginatedRequestParams;  
}

Sent from the client to request a list of tools the server has.

### 

​

`ListToolsResult`

interface ListToolsResult {  
_meta?: { [key: string]: unknown };  
nextCursor?: string;  
tools: Tool[];  
[key: string]: unknown;  
}

The server’s response to a tools/list request from the client.

`Optional`_meta

_meta?: { [key: string]: unknown }

See [General fields: `_meta`](/specification/2025-11-25/basic/index#meta) for notes on `_meta` usage.

Inherited from PaginatedResult._meta

`Optional`nextCursor

nextCursor?: string

An opaque token representing the pagination position after the last returned result. If present, there may be more results available.

Inherited from PaginatedResult.nextCursor

### 

​

`Tool`

interface Tool {  
_meta?: { [key: string]: unknown };  
annotations?: ToolAnnotations;  
description?: string;  
execution?: ToolExecution;  
icons?: Icon[];  
inputSchema: {  
$schema?: string;  
properties?: { [key: string]: object };  
required?: string[];  
type: “object”;  
};  
name: string;  
outputSchema?: {  
$schema?: string;  
properties?: { [key: string]: object };  
required?: string[];  
type: “object”;  
};  
title?: string;  
}

Definition for a tool the client can call.

`Optional`_meta

_meta?: { [key: string]: unknown }

See [General fields: `_meta`](/specification/2025-11-25/basic/index#meta) for notes on `_meta` usage.

`Optional`annotations

annotations?: ToolAnnotations

Optional additional tool information.

Display name precedence order is: title, annotations.title, then name.

`Optional`description

description?: string

A human-readable description of the tool.

This can be used by clients to improve the LLM’s understanding of available tools. It can be thought of like a “hint” to the model.

`Optional`execution

execution?: ToolExecution

Execution-related properties for this tool.

`Optional`icons

icons?: Icon[]

Optional set of sized icons that the client can display in a user interface.

Clients that support rendering icons MUST support at least the following MIME types:

  * `image/png` \- PNG images (safe, universal compatibility)
  * `image/jpeg` (and `image/jpg`) - JPEG images (safe, universal compatibility)

Clients that support rendering icons SHOULD also support:

  * `image/svg+xml` \- SVG images (scalable but requires security precautions)
  * `image/webp` \- WebP images (modern, efficient format)

Inherited from Icons.icons

inputSchema

inputSchema: {  
$schema?: string;  
properties?: { [key: string]: object };  
required?: string[];  
type: “object”;  
}

A JSON Schema object defining the expected parameters for the tool.

name

name: string

Intended for programmatic or logical use, but used as a display name in past specs or fallback (if title isn’t present).

Inherited from BaseMetadata.name

`Optional`outputSchema

outputSchema?: {  
$schema?: string;  
properties?: { [key: string]: object };  
required?: string[];  
type: “object”;  
}

An optional JSON Schema object defining the structure of the tool’s output returned in the structuredContent field of a CallToolResult.

Defaults to JSON Schema 2020-12 when no explicit $schema is provided. Currently restricted to type: “object” at the root level.

`Optional`title

title?: string

Intended for UI and end-user contexts — optimized to be human-readable and easily understood, even by those unfamiliar with domain-specific terminology.

If not provided, the name should be used for display (except for Tool, where `annotations.title` should be given precedence over using `name`, if present).

Inherited from BaseMetadata.title

### 

​

`ToolAnnotations`

interface ToolAnnotations {  
destructiveHint?: boolean;  
idempotentHint?: boolean;  
openWorldHint?: boolean;  
readOnlyHint?: boolean;  
title?: string;  
}

Additional properties describing a Tool to clients.

NOTE: all properties in ToolAnnotations are **hints**. They are not guaranteed to provide a faithful description of tool behavior (including descriptive properties like `title`).

Clients should never make tool use decisions based on ToolAnnotations received from untrusted servers.

`Optional`destructiveHint

destructiveHint?: boolean

If true, the tool may perform destructive updates to its environment. If false, the tool performs only additive updates.

(This property is meaningful only when `readOnlyHint == false`)

Default: true

`Optional`idempotentHint

idempotentHint?: boolean

If true, calling the tool repeatedly with the same arguments will have no additional effect on its environment.

(This property is meaningful only when `readOnlyHint == false`)

Default: false

`Optional`openWorldHint

openWorldHint?: boolean

If true, this tool may interact with an “open world” of external entities. If false, the tool’s domain of interaction is closed. For example, the world of a web search tool is open, whereas that of a memory tool is not.

Default: true

`Optional`readOnlyHint

readOnlyHint?: boolean

If true, the tool does not modify its environment.

Default: false

`Optional`title

title?: string

A human-readable title for the tool.

### 

​

`ToolExecution`

interface ToolExecution {  
taskSupport?: “forbidden” | “optional” | “required”;  
}

Execution-related properties for a tool.

`Optional`taskSupport

taskSupport?: “forbidden” | “optional” | “required”

Indicates whether this tool supports task-augmented execution. This allows clients to handle long-running operations through polling the task system.

  * “forbidden”: Tool does not support task-augmented execution (default when absent)
  * “optional”: Tool may support task-augmented execution
  * “required”: Tool requires task-augmented execution

Default: “forbidden”