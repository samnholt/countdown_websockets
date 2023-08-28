from dataclasses import dataclass

__all__ = ["PLAYER1", "PLAYER2", "Connect4"]

PLAYER1, PLAYER2 = "Player 1", "Player 2"


@dataclass
class Game:
    """
    A game of countdown
    """
    rounds: list

    def get_total_score(self):
        return sum([i.score for i in self.rounds])


@dataclass
class Round:
    """
    An individual round of Countdown
    """
    # round_number: int = 1
    vowels_chosen: int
    score: int = 0

