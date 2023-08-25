import asyncio
import json
import websockets


async def test_display():
    async with websockets.connect('ws://localhost:8001') as websocket:
        # Prepare and send the message from the client to the server
        print(1)
        client_msg_1 = {
            "type": "init"
        }

        await websocket.send(json.dumps(client_msg_1))

        client_msg_2 = {
            "type": "start_game"
        }

        await websocket.send(json.dumps(client_msg_2))

        client_msg = {
            "type": "display",
            "vowels_chosen": 3
        }
        await websocket.send(json.dumps(client_msg))

        print(2)
        # Listen for a message back from the server
        server_msg = await websocket.recv()
        server_msg = json.loads(server_msg)
        print(3)
        assert server_msg.get("type") == "send_letters", "Invalid type"
        assert "letters" in server_msg, "No letters key found"
        assert server_msg.get("round_number") is not None, "No round_number key found"
        print(f"Test passed: received {server_msg}")


async def main():
    await test_display()

if __name__ == '__main__':
    asyncio.run(main())
