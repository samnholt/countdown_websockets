import logging
import asyncio
import json
import websockets

from countdown import Game, Round, PLAYER1, PLAYER2
from countdown_letters.logic import get_letters_chosen, get_game_score
from countdown_letters.validations import is_eligible_answer

JOIN = {}


logging.basicConfig(format="%(message)s", level=logging.DEBUG)




async def start_game(websocket):
    """
    Wait to start the game
    """

    message = await websocket.recv()
    event = json.loads(message)
    assert event['type'] == 'start_game'
    game = Game(rounds=[])
    print(1)
    await start_round(websocket, game)
    
async def start_round(websocket, game):
    """
    Get the game going
    """
    
    connected = {websocket}

    async for message in websocket:
        round = Round(vowels_chosen=0)
        event = json.loads(message)
        assert event['type'] == 'display'
        round.vowels_chosen = event['vowels_chosen']
        letters = get_letters_chosen(round.vowels_chosen)
        game.rounds.append(round)
        round_number = len(game.rounds)

        event = {
            "type": "send_letters",
            "letters": letters,
            "round_number": round_number,
        }

        await websocket.send(json.dumps(event))
        await process_guess(websocket, game, round, letters, round_number)

async def process_guess(websocket, game, round, letters: str, round_number, guessed=False):
    """
    Process a guess
    """
    async for message in websocket:
        event = json.loads(message)
        if event['type'] == "submitGuess":
            guessed_word = event['guessed_word'].upper()
            print(guessed_word)
            print(type(letters))
            if is_eligible_answer(guessed_word, letters):
                score = get_game_score(len(guessed_word))
                round.score = (score, 0)
                game_score = game.get_total_score()
                
                event = {
                    "type": "score",
                    "text": "Well done!",
                    "round_score": round.score,
                    "game_score": game_score,
                    "round_number": round_number
                }
                guessed = True
                await websocket.send(json.dumps(event))
            else:
                round.score = (0,0)
                game_score = game.get_total_score()
                event = {
                    "type": "score",
                    "text": "You're wrong! Dumbass!",
                    "round_score": round.score,
                    "round_number": round_number,
                    "game_score": game_score
                }
                guessed = True
                await websocket.send(json.dumps(event))
        elif event['type'] == "end_round" and guessed == False:
            round.score = (0,0)
            game_score = game.get_total_score()
            event = {
                "type": "score",
                "text": "Too slow shit head!",
                "round_score": round.score,
                "game_score": game_score,
                "round_number": round_number,

            }
            await start_round(websocket, game)
        elif event['type'] == "end_round":
            await start_round(websocket, game)

async def handler(websocket):
    """
    Handle a connection and dispatch it according to who is connecting.

    """
    message = await websocket.recv()
    event = json.loads(message)

    await start_game(websocket)

async def main():
    async with websockets.serve(handler, "", 8001):
        await asyncio.Future()  # run forever


if __name__ == "__main__":
    asyncio.run(main())