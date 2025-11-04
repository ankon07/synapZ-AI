from dotenv import load_dotenv
from prompts import AGENT_INSTRUCTION, SESSION_INSTRUCTION
from livekit import agents
from livekit.agents import AgentSession, Agent, RoomInputOptions
from livekit.plugins import noise_cancellation, silero
from livekit.plugins.turn_detector.multilingual import MultilingualModel
from livekit.plugins import tavus
load_dotenv(".env")

from mcp_client import MCPServerSse
from mcp_client.agent_tools import MCPToolsIntegration
from mcp_client.navigation_tools import set_room_context, NAVIGATION_TOOLS
import os
import logging

logger = logging.getLogger(__name__)
class Assistant(Agent):
    def __init__(self) -> None:
        super().__init__(
            instructions=AGENT_INSTRUCTION,
        )


async def entrypoint(ctx: agents.JobContext):
    avatar_session = None
    
    try:
        # Validate Tavus credentials before proceeding
        tavus_api_key = os.environ.get("TAVUS_API_KEY")
        replica_id = os.environ.get("REPLICA_ID")
        persona_id = os.environ.get("PERSONA_ID")
        
        if not all([tavus_api_key, replica_id, persona_id]):
            raise ValueError(
                "Tavus credentials are required for video assistant. "
                "Please set TAVUS_API_KEY, REPLICA_ID, and PERSONA_ID in .env file"
            )
        
        session = AgentSession(
            stt="assemblyai/universal-streaming:en",
            llm="openai/gpt-4.1-mini",
            tts="cartesia/sonic-2:9626c31c-bec5-4cca-baa8-f8ba9e84c8bc",
            vad=silero.VAD.load(),
            turn_detection=MultilingualModel(),
        )

        # Integrate MCP tools
        mcp_server = MCPServerSse(
            params={"url":os.environ.get("N8N_MCP_SERVER_URL"),},
            cache_tools_list=True,
            name="SYNAPZ_MCP_Server",
        )
        agent = await MCPToolsIntegration.create_agent_with_tools(
            agent_class=Assistant,
            mcp_servers=[mcp_server],
        )
        
        # Start Tavus avatar session BEFORE starting the agent session
        # This ensures video is available from the beginning
        logger.info("Initializing Tavus video avatar...")
        avatar_session = tavus.AvatarSession(
            replica_id=replica_id,
            persona_id=persona_id,
            api_key=tavus_api_key,
        )
        
        # Start session with room connection
        await session.start(
            room=ctx.room,
            agent=agent,
            room_input_options=RoomInputOptions(
                # For telephony applications, use `BVCTelephony` instead for best results
                noise_cancellation=noise_cancellation.BVC(), 
            ),
        )
        
        # Set room context for navigation tools
        set_room_context(ctx.room)
        logger.info("Room context set for navigation tools")
        
        # Register navigation tools with the agent
        from livekit.agents.llm import FunctionTool
        import inspect
        for tool_def in NAVIGATION_TOOLS:
            # Get the schema from tool definition
            schema = tool_def['inputSchema']
            
            # Create parameters from schema
            params = []
            annotations = {}
            schema_props = schema.get("properties", {})
            schema_required = set(schema.get("required", []))
            
            type_map = {
                "string": str,
                "integer": int,
                "number": float,
                "boolean": bool,
                "array": list,
                "object": dict,
            }
            
            # Build parameters from schema
            for p_name, p_details in schema_props.items():
                json_type = p_details.get("type", "string")
                py_type = type_map.get(json_type, str)
                annotations[p_name] = py_type
                
                default = inspect.Parameter.empty if p_name in schema_required else None
                params.append(inspect.Parameter(
                    name=p_name,
                    kind=inspect.Parameter.KEYWORD_ONLY,
                    annotation=py_type,
                    default=default
                ))
            
            # Get the handler function
            tool_func = tool_def['handler']
            
            # Set function metadata
            tool_func.__signature__ = inspect.Signature(parameters=params)
            tool_func.__name__ = tool_def['name']
            tool_func.__doc__ = tool_def['description']
            tool_func.__annotations__ = {'return': str, **annotations}
            
            # Create FunctionTool with proper schema
            function_tool_obj = FunctionTool(
                name=tool_def['name'],
                description=tool_def['description'],
                callable=tool_func,
                parameters_json_schema=schema
            )
            
            # Add to agent's tools
            if hasattr(agent, '_tools') and isinstance(agent._tools, list):
                agent._tools.append(function_tool_obj)
                logger.info(f"Registered navigation tool with schema: {tool_def['name']}")
        
        # Start the avatar session (this publishes video track to the room)
        await avatar_session.start(session, room=ctx.room)
        logger.info("Tavus video avatar started successfully - video track available")

        await session.generate_reply(
            instructions= SESSION_INSTRUCTION
        )
        
    except Exception as e:
        logger.error(f"Error in entrypoint: {e}")
        if avatar_session:
            try:
                await avatar_session.aclose()
            except Exception as cleanup_error:
                logger.error(f"Error closing avatar session during error handling: {cleanup_error}")
        raise
    finally:
        # Cleanup: ensure avatar session is properly closed
        if avatar_session:
            try:
                await avatar_session.aclose()
                logger.info("Tavus avatar session closed")
            except Exception as cleanup_error:
                logger.error(f"Error closing avatar session: {cleanup_error}")


if __name__ == "__main__":
    agents.cli.run_app(agents.WorkerOptions(entrypoint_fnc=entrypoint))
