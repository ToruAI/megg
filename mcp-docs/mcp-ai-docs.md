# Model Context Protocol (MCP) Documentation - AI Summary

**Source:** https://modelcontextprotocol.io/docs  
**Specification:** https://modelcontextprotocol.io/specification  
**Scraped:** December 14, 2025  
**Total Pages:** 28 (10 docs + 18 specification)

## Overview

Model Context Protocol (MCP) is an open-source standard for connecting AI applications to external systems. Think of MCP like a USB-C port for AI applications—it provides a standardized way to connect AI applications like Claude or ChatGPT to data sources (e.g. local files, databases), tools (e.g. search engines, calculators), and workflows (e.g. specialized prompts).

## Documentation Structure

### Getting Started (1 page)
- **Introduction** - What is MCP, why it matters, and key benefits

### Learn (3 pages)
- **Architecture** - Core MCP architecture and design patterns
- **Server Concepts** - Understanding MCP server implementation
- **Client Concepts** - Understanding MCP client implementation

### Develop (4 pages)
- **Connect to local MCP servers** - Setting up local server connections
- **Connect to remote MCP servers** - Setting up remote server connections
- **Build an MCP server** - Guide to creating MCP servers
- **Build an MCP client** - Guide to creating MCP clients

### Tools & SDKs (2 pages)
- **SDKs** - Software Development Kits for MCP
- **MCP Inspector** - Tool for inspecting and debugging MCP connections

### Specification (18 pages)
- **Specification Overview** - MCP specification version 2025-11-25
- **Key Changes** - Changelog for the specification
- **Architecture** - Detailed architecture specification
- **Basic Protocol** (4 pages)
  - Overview - Basic protocol concepts
  - Lifecycle - Connection lifecycle management
  - Transports - Transport layer specifications
  - Authorization - Authorization mechanisms
  - Security Best Practices - Security guidelines
- **Client Features** (4 pages)
  - Overview - Client capabilities
  - Roots - Root directory concepts
  - Sampling - LLM sampling features
  - Elicitation - User elicitation patterns
- **Server Features** (4 pages)
  - Overview - Server capabilities
  - Prompts - Prompt templates
  - Resources - Resource management
  - Tools - Tool definitions
- **Schema Reference** - Complete schema documentation
- **Versioning** - Specification versioning strategy

## Key Features

1. **Standardized Integration**
   - Universal protocol for AI-to-system connections
   - Reduces development time and complexity
   - Enables ecosystem of compatible tools and data sources

2. **Multi-Purpose Connectivity**
   - Connect to data sources (files, databases)
   - Integrate with tools (search engines, calculators)
   - Enable workflows (specialized prompts)

3. **Benefits by Role**
   - **Developers**: Reduced complexity and development time
   - **AI Applications**: Access to ecosystem of data sources and tools
   - **End-users**: More capable AI assistants with data access

4. **Use Cases**
   - Personal AI assistants with calendar and note access
   - Web app generation from design files
   - Enterprise chatbots with database connectivity
   - 3D design and printing workflows

## File Organization

All documentation is stored in `/mcp/docs/` with the following structure:

```
mcp/
├── docs/
│   ├── getting-started/
│   │   └── intro.md
│   ├── learn/
│   │   ├── architecture.md
│   │   ├── server-concepts.md
│   │   └── client-concepts.md
│   ├── develop/
│   │   ├── connect-local-servers.md
│   │   ├── connect-remote-servers.md
│   │   ├── build-server.md
│   │   └── build-client.md
│   ├── sdk.md
│   └── tools/
│       └── inspector.md
└── specification/
    ├── 2025-11-25.md (overview)
    ├── 2025-11-25/
    │   ├── changelog.md
    │   ├── architecture.md
    │   ├── basic.md
    │   ├── basic/
    │   │   ├── lifecycle.md
    │   │   ├── transports.md
    │   │   ├── authorization.md
    │   │   └── security_best_practices.md
    │   ├── client.md
    │   ├── client/
    │   │   ├── roots.md
    │   │   ├── sampling.md
    │   │   └── elicitation.md
    │   ├── server.md
    │   ├── server/
    │   │   ├── prompts.md
    │   │   ├── resources.md
    │   │   └── tools.md
    │   └── schema.md
    └── versioning.md
```

## Use Cases for AI Agents

This documentation is ideal for AI agents to:
- Understand the Model Context Protocol standard and specification
- Help developers implement MCP servers and clients
- Guide integration of AI applications with external systems
- Explain MCP architecture and design patterns
- Assist with troubleshooting MCP connections
- Provide examples of MCP use cases
- Reference the complete protocol specification for implementation details
- Understand transport layers, authorization, and security best practices

## Scraping Method

The documentation was scraped using a custom Python script (`scrape_mcp_docs.py`) that:
1. Extracts navigation links from the documentation site
2. Fetches each page with proper headers
3. Extracts main content from the `div#content` with class `mdx-content`
4. Converts HTML to clean Markdown
5. Preserves structure with source URLs and titles
6. Implements rate limiting and retry logic

## Updates

To refresh this documentation:
```bash
cd /Users/tako/GitRepos/ai-docs
source venv/bin/activate
python3 scripts/scrape_mcp_docs.py
```

The script will overwrite existing files with updated content while preserving the directory structure.

## Key Concepts

### What is MCP?
MCP is an open-source protocol that acts as a universal connector between AI applications and external systems, similar to how USB-C standardized device connections.

### Core Components
- **Servers**: Expose data and tools that AI applications can access
- **Clients**: AI applications that connect to and use MCP servers
- **Protocol**: Standardized communication format

### Ecosystem Benefits
- **For Developers**: Simplified integration, reduced complexity
- **For AI Apps**: Access to rich ecosystem of tools and data
- **For Users**: More capable AI assistants with real-world connections
