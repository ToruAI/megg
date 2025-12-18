# MCP Inspector

Source: https://modelcontextprotocol.io/docs/tools/inspector

---

The [MCP Inspector](https://github.com/modelcontextprotocol/inspector) is an interactive developer tool for testing and debugging MCP servers. While the [Debugging Guide](/legacy/tools/debugging) covers the Inspector as part of the overall debugging toolkit, this document provides a detailed exploration of the Inspector’s features and capabilities.

## 

​

Getting started

### 

​

Installation and basic usage

The Inspector runs directly through `npx` without requiring installation:

Copy
    
    
    npx @modelcontextprotocol/inspector <command>
    

Copy
    
    
    npx @modelcontextprotocol/inspector <command> <arg1> <arg2>
    

#### 

​

Inspecting servers from npm or PyPI

A common way to start server packages from [npm](https://npmjs.com) or [PyPI](https://pypi.org).

  * npm package

  * PyPI package

Copy
    
    
    npx -y @modelcontextprotocol/inspector npx <package-name> <args>
    # For example
    npx -y @modelcontextprotocol/inspector npx @modelcontextprotocol/server-filesystem /Users/username/Desktop
    

Copy
    
    
    npx @modelcontextprotocol/inspector uvx <package-name> <args>
    # For example
    npx @modelcontextprotocol/inspector uvx mcp-server-git --repository ~/code/mcp/servers.git
    

#### 

​

Inspecting locally developed servers

To inspect servers locally developed or downloaded as a repository, the most common way is:

  * TypeScript

  * Python

Copy
    
    
    npx @modelcontextprotocol/inspector node path/to/server/index.js args...
    

Copy
    
    
    npx @modelcontextprotocol/inspector \
      uv \
      --directory path/to/server \
      run \
      package-name \
      args...
    

Please carefully read any attached README for the most accurate instructions.

## 

​

Feature overview

![](https://mintcdn.com/mcp/4ZXF1PrDkEaJvXpn/images/mcp-inspector.png?fit=max&auto=format&n=4ZXF1PrDkEaJvXpn&q=85&s=83b12e2a457c96ef4ad17c7357236290)

The MCP Inspector interface

The Inspector provides several features for interacting with your MCP server:

### 

​

Server connection pane

  * Allows selecting the [transport](/legacy/concepts/transports) for connecting to the server
  * For local servers, supports customizing the command-line arguments and environment

### 

​

Resources tab

  * Lists all available resources
  * Shows resource metadata (MIME types, descriptions)
  * Allows resource content inspection
  * Supports subscription testing

### 

​

Prompts tab

  * Displays available prompt templates
  * Shows prompt arguments and descriptions
  * Enables prompt testing with custom arguments
  * Previews generated messages

### 

​

Tools tab

  * Lists available tools
  * Shows tool schemas and descriptions
  * Enables tool testing with custom inputs
  * Displays tool execution results

### 

​

Notifications pane

  * Presents all logs recorded from the server
  * Shows notifications received from the server

## 

​

Best practices

### 

​

Development workflow

  1. Start Development
     * Launch Inspector with your server
     * Verify basic connectivity
     * Check capability negotiation
  2. Iterative testing
     * Make server changes
     * Rebuild the server
     * Reconnect the Inspector
     * Test affected features
     * Monitor messages
  3. Test edge cases
     * Invalid inputs
     * Missing prompt arguments
     * Concurrent operations
     * Verify error handling and error responses

## 

​

Next steps

## [Inspector RepositoryCheck out the MCP Inspector source code](https://github.com/modelcontextprotocol/inspector)## [Debugging GuideLearn about broader debugging strategies](/legacy/tools/debugging)