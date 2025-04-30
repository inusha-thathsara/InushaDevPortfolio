
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ThemeProvider } from "../components/ThemeProvider";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Circle, Cpu, User, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type Player = "X" | "O";
type GameMode = "AI" | "Player";
type Difficulty = "Easy" | "Normal" | "Hard" | "Impossible";
type Board = (Player | null)[];
type GameState = "Playing" | "Won" | "Draw";

const TicTacToe = () => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [gameMode, setGameMode] = useState<GameMode>("Player");
  const [difficulty, setDifficulty] = useState<Difficulty>("Normal");
  const [gameState, setGameState] = useState<GameState>("Playing");
  const [winner, setWinner] = useState<Player | null>(null);
  const [scores, setScores] = useState({ X: 0, O: 0, Draw: 0 });

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  const checkWinner = (board: Board): { winner: Player | null; gameState: GameState } => {
    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a] as Player, gameState: "Won" };
      }
    }

    if (board.every(cell => cell !== null)) {
      return { winner: null, gameState: "Draw" };
    }

    return { winner: null, gameState: "Playing" };
  };

  const handleCellClick = (index: number) => {
    if (board[index] !== null || gameState !== "Playing" || 
        (gameMode === "AI" && currentPlayer === "O")) {
      return;
    }

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    
    if (result.gameState !== "Playing") {
      setGameState(result.gameState);
      setWinner(result.winner);
      updateScores(result.gameState, result.winner);
      
      if (result.gameState === "Won") {
        toast({
          title: `${result.winner} Wins!`,
          description: `Player ${result.winner} has won the game!`,
        });
      } else if (result.gameState === "Draw") {
        toast({
          title: "It's a Draw!",
          description: "The game ended in a draw.",
        });
      }
      
      return;
    }

    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
  };

  const updateScores = (gameState: GameState, winner: Player | null) => {
    if (gameState === "Won" && winner) {
      setScores(prev => ({ ...prev, [winner]: prev[winner] + 1 }));
    } else if (gameState === "Draw") {
      setScores(prev => ({ ...prev, Draw: prev.Draw + 1 }));
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
    setGameState("Playing");
    setWinner(null);
  };

  const resetScores = () => {
    setScores({ X: 0, O: 0, Draw: 0 });
    resetGame();
  };

  const makeAIMove = () => {
    if (gameState !== "Playing" || currentPlayer !== "O") return;

    let move: number | null = null;

    switch (difficulty) {
      case "Easy":
        move = getEasyMove();
        break;
      case "Normal":
        move = Math.random() < 0.5 ? getMediumMove() : getEasyMove();
        break;
      case "Hard":
        move = Math.random() < 0.7 ? getHardMove() : getMediumMove();
        break;
      case "Impossible":
        move = getImpossibleMove();
        break;
      default:
        move = getMediumMove();
    }

    if (move !== null) {
      setTimeout(() => handleCellClick(move!), 500);
    }
  };

  // AI Difficulty Levels
  const getEasyMove = (): number => {
    const emptyCells = board.map((cell, index) => cell === null ? index : -1).filter(index => index !== -1);
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  };

  const getMediumMove = (): number => {
    // Try to win if possible
    const winMove = findWinningMove(board, "O");
    if (winMove !== null) return winMove;

    // Block opponent if they're about to win
    const blockMove = findWinningMove(board, "X");
    if (blockMove !== null) return blockMove;

    // Otherwise make a random move
    return getEasyMove();
  };

  const getHardMove = (): number => {
    // Try to win if possible
    const winMove = findWinningMove(board, "O");
    if (winMove !== null) return winMove;

    // Block opponent if they're about to win
    const blockMove = findWinningMove(board, "X");
    if (blockMove !== null) return blockMove;

    // Try to get the center
    if (board[4] === null) return 4;

    // Try to get corners
    const corners = [0, 2, 6, 8].filter(i => board[i] === null);
    if (corners.length > 0) {
      return corners[Math.floor(Math.random() * corners.length)];
    }

    // Otherwise make a random move
    return getEasyMove();
  };

  const getImpossibleMove = (): number => {
    // Implement Minimax algorithm for unbeatable AI
    const bestMove = minimax(board, "O").index;
    return bestMove !== undefined ? bestMove : getEasyMove();
  };

  const findWinningMove = (board: Board, player: Player): number | null => {
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        const newBoard = [...board];
        newBoard[i] = player;
        
        if (checkWinner(newBoard).winner === player) {
          return i;
        }
      }
    }
    return null;
  };

  // Minimax algorithm for unbeatable AI
  const minimax = (board: Board, player: Player, depth = 0, isMaximizing = true): { score: number, index?: number } => {
    const { winner, gameState } = checkWinner(board);

    // Terminal states
    if (winner === "O") return { score: 10 - depth };
    if (winner === "X") return { score: depth - 10 };
    if (gameState === "Draw") return { score: 0 };

    const currentPlayer = isMaximizing ? "O" : "X";
    let bestScore = isMaximizing ? -Infinity : Infinity;
    let bestMove: number | undefined = undefined;

    // Try each possible move
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        // Make the move
        const newBoard = [...board];
        newBoard[i] = currentPlayer;

        // Recursively check the result
        const result = minimax(newBoard, player, depth + 1, !isMaximizing);

        // Update best score
        if (isMaximizing && result.score > bestScore) {
          bestScore = result.score;
          bestMove = i;
        } else if (!isMaximizing && result.score < bestScore) {
          bestScore = result.score;
          bestMove = i;
        }
      }
    }

    return { score: bestScore, index: bestMove };
  };

  // AI's turn
  useEffect(() => {
    if (gameMode === "AI" && currentPlayer === "O" && gameState === "Playing") {
      makeAIMove();
    }
  }, [currentPlayer, gameMode, gameState]);

  // Game mode and difficulty change handlers
  const handleGameModeChange = (mode: GameMode) => {
    setGameMode(mode);
    resetGame();
  };

  const handleDifficultyChange = (diff: Difficulty) => {
    setDifficulty(diff);
    if (gameState !== "Playing") resetGame();
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
        <Navbar />
        <section className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-center mb-6"
            >
              Tic Tac Toe
            </motion.h1>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-lg mx-auto"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-center">
                    Game Mode: {gameState === "Playing" ? `${currentPlayer}'s Turn` : 
                                gameState === "Won" ? `${winner} Wins!` : "Draw!"}
                  </CardTitle>
                  <CardDescription className="flex justify-center">
                    <div className="flex gap-4">
                      <Button 
                        variant={gameMode === "Player" ? "default" : "outline"} 
                        onClick={() => handleGameModeChange("Player")}
                        className="flex gap-2"
                      >
                        <User size={16} /> vs <User size={16} />
                      </Button>
                      <Button 
                        variant={gameMode === "AI" ? "default" : "outline"} 
                        onClick={() => handleGameModeChange("AI")}
                        className="flex gap-2"
                      >
                        <User size={16} /> vs <Cpu size={16} />
                      </Button>
                    </div>
                  </CardDescription>

                  {gameMode === "AI" && (
                    <div className="flex justify-center gap-2 mt-2">
                      <Button
                        variant={difficulty === "Easy" ? "default" : "outline"}
                        onClick={() => handleDifficultyChange("Easy")}
                        size="sm"
                      >
                        Easy
                      </Button>
                      <Button
                        variant={difficulty === "Normal" ? "default" : "outline"}
                        onClick={() => handleDifficultyChange("Normal")}
                        size="sm"
                      >
                        Normal
                      </Button>
                      <Button
                        variant={difficulty === "Hard" ? "default" : "outline"}
                        onClick={() => handleDifficultyChange("Hard")}
                        size="sm"
                      >
                        Hard
                      </Button>
                      <Button
                        variant={difficulty === "Impossible" ? "default" : "outline"}
                        onClick={() => handleDifficultyChange("Impossible")}
                        size="sm"
                      >
                        Impossible
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {board.map((cell, index) => (
                      <motion.div
                        key={index}
                        className="aspect-square border-2 border-gray-200 dark:border-gray-700 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 text-4xl"
                        whileHover={{ scale: gameState === "Playing" && board[index] === null ? 1.05 : 1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCellClick(index)}
                      >
                        {cell === "X" && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", damping: 10 }}
                          >
                            <X className="w-12 h-12 text-purple-500" />
                          </motion.div>
                        )}
                        {cell === "O" && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", damping: 10 }}
                          >
                            <Circle className="w-10 h-10 text-blue-500" />
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center px-2 text-sm">
                    <div className="flex items-center gap-1">
                      <X className="w-4 h-4 text-purple-500" /> 
                      <span>{scores.X}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>Draw: {scores.Draw}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>{scores.O}</span>
                      <Circle className="w-4 h-4 text-blue-500" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={resetScores}>
                    Reset All
                  </Button>
                  <Button onClick={resetGame} className="flex gap-2">
                    <RefreshCw size={16} /> New Game
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </section>
      </div>
    </ThemeProvider>
  );
};

export default TicTacToe;
