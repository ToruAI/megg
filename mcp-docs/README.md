# Model Context Protocol (MCP) Documentation

This directory contains scraped documentation from the [Model Context Protocol](https://modelcontextprotocol.io) project.

## What is MCP?

Model Context Protocol (MCP) is an open-source standard for connecting AI applications to external systems. It provides a standardized way for AI applications like Claude or ChatGPT to connect to:
- Data sources (local files, databases)
- Tools (search engines, calculators)
- Workflows (specialized prompts)

## Documentation Structure

```
mcp/
├── mcp-ai-docs.md          # AI-optimized summary of all documentation
├── README.md                # This file
├── docs/
│   ├── getting-started/     # Introduction to MCP
│   ├── learn/               # Architecture and core concepts
│   ├── develop/             # Building servers and clients
│   ├── sdk.md               # SDK documentation
│   └── tools/               # MCP Inspector and other tools
└── specification/           # Complete MCP protocol specification
    ├── 2025-11-25/          # Specification version 2025-11-25
    │   ├── basic/           # Base protocol (lifecycle, transports, auth)
    │   ├── client/          # Client features (roots, sampling, elicitation)
    │   └── server/          # Server features (prompts, resources, tools)
    └── versioning.md        # Versioning strategy
```

## Quick Links

### Documentation
- **[AI Documentation Summary](mcp-ai-docs.md)** - Start here for a comprehensive overview
- **[Introduction](docs/getting-started/intro.md)** - What is MCP and why it matters
- **[Architecture](docs/learn/architecture.md)** - Core MCP architecture
- **[Build a Server](docs/develop/build-server.md)** - Create your own MCP server
- **[Build a Client](docs/develop/build-client.md)** - Create your own MCP client

### Specification
- **[Specification Overview](specification/2025-11-25.md)** - Complete protocol specification
- **[Protocol Lifecycle](specification/2025-11-25/basic/lifecycle.md)** - Connection lifecycle
- **[Transports](specification/2025-11-25/basic/transports.md)** - Transport layer specs
- **[Server Features](specification/2025-11-25/server.md)** - Prompts, resources, tools
- **[Client Features](specification/2025-11-25/client.md)** - Roots, sampling, elicitation
- **[Schema Reference](specification/2025-11-25/schema.md)** - Complete schema docs

## Use Cases

- Personal AI assistants with calendar and note access
- Web app generation from design files  
- Enterprise chatbots with database connectivity
- 3D design and printing workflows
- Any scenario requiring AI-to-system integration

## For AI Agents

The `mcp-ai-docs.md` file contains an AI-optimized summary designed for quick comprehension of:
- MCP protocol overview and purpose
- Documentation structure and organization
- Key concepts and components
- Integration patterns and use cases

## Updating Documentation

To refresh the documentation:

```bash
cd /Users/tako/GitRepos/ai-docs
source venv/bin/activate
python3 scripts/scrape_mcp_docs.py
```

## Original Sources

- **Documentation:** https://modelcontextprotocol.io/docs
- **Specification:** https://modelcontextprotocol.io/specification

**Last Updated:** December 14, 2025  
**Total Pages:** 28 (10 docs + 18 specification)
