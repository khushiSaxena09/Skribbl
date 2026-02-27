
import wordsData from "../words/words.json";
import { Room } from "./Room";

export class Game {
  room: Room;
  round = 0;
  drawerId = "";
  word = "";
  currentWordOptions: string[] = [];
  timeLeft = 0;
  timer: NodeJS.Timeout | null = null;
  firstRoundStartTimeout: NodeJS.Timeout | null = null;
  guessedPlayers = new Set<string>();
  wordChosen = false;

  constructor(room: Room) {
    this.room = room;
  }

  start() {
    console.log('🎮 Game starting...');
    this.round = 0;

    // 🔔 Notify clients that the game is starting
    this.room.broadcast("game_start", {
      roomId: this.room.roomId,
      totalRounds: this.room.settings.rounds,
      drawTime: this.room.settings.drawTime
    });

    // ⏳ Give clients time to navigate and mount listeners.
    // Even if they miss the first emission, they will "sync" on `game_ready`.
    if (this.firstRoundStartTimeout) clearTimeout(this.firstRoundStartTimeout);
    this.firstRoundStartTimeout = setTimeout(() => {
      this.ensureRoundStarted();
    }, 1600);
  }

  private ensureRoundStarted() {
    if (this.round > 0) return;
    this.nextRound();
  }

  private emitRoundStartToPlayer(playerId: string) {
    if (this.round <= 0) return;

    const targetSocket = this.room.io.sockets.sockets.get(playerId);
    if (!targetSocket) return;

    const isDrawer = playerId === this.drawerId;

    targetSocket.emit("round_start", {
      drawerId: this.drawerId,
      words: isDrawer && !this.wordChosen ? this.currentWordOptions : [],
      timeLeft: this.timeLeft,
      round: this.round,
      totalRounds: this.room.settings.rounds
    });

    if (this.wordChosen && this.word) {
      const drawerName =
        this.room.players.find(p => p.id === this.drawerId)?.name || "Unknown";
      targetSocket.emit("word_chosen", {
        length: this.word.length,
        drawerName
      });
    }
  }

  nextRound() {
    console.log(`\n🎯 ROUND ${this.round + 1} STARTING...`);
    
    this.round++;
    this.guessedPlayers.clear();
    this.wordChosen = false;
    this.word = "";
    this.currentWordOptions = [];

    // ✅ CRITICAL: Only connected players
    const connectedPlayers = this.room.players.filter(p => 
      this.room.io.sockets.sockets.has(p.id)
    );
    
    if (connectedPlayers.length === 0) {
      console.log('⚠️ No connected players - cannot start round');
      return;
    }

    this.drawerId = connectedPlayers[(this.round - 1) % connectedPlayers.length].id;
    const drawerPlayer = connectedPlayers.find(p => p.id === this.drawerId);

    if (!drawerPlayer) {
      console.log('⚠️ Drawer not found among connected players');
      return;
    }

    this.timeLeft = this.room.settings.drawTime;
    const words = this.pickWords();
    this.currentWordOptions = words;

    console.log(`📊 Round ${this.round}: Drawer=${drawerPlayer.name}, Time=${this.timeLeft}s`);
    console.log(`📝 Words: [${words.join(', ')}]`);

    // ✅ STEP 1: Broadcast to ALL players (no words)
    this.room.io.to(this.room.roomId).emit("round_start", {
      drawerId: this.drawerId,
      words: [], 
      timeLeft: this.timeLeft,
      round: this.round,
      totalRounds: this.room.settings.rounds
    });

    // ✅ STEP 2: Send words to drawer only (50ms delay prevents race)
    setTimeout(() => {
      const drawerSocket = this.room.io.sockets.sockets.get(this.drawerId);
      
      if (drawerSocket) {
        drawerSocket.emit("round_start", {
          drawerId: this.drawerId,
          words, // ✅ Only drawer gets words
          timeLeft: this.timeLeft,
          round: this.round,
          totalRounds: this.room.settings.rounds
        });
        console.log(`✅✅✅ Words sent to ${drawerPlayer.name}: ${words.join(', ')}`);
      } else {
        console.log(`❌ Drawer socket missing: ${this.drawerId}`);
      }
    }, 50);

    this.startTimer();
  }

  pickWords(): string[] {
    const allWords = wordsData.flatMap((c: any) => c.words);
    const shuffled = allWords.sort(() => 0.5 - Math.random()).slice(0, 3); // 3 words better UX
    return shuffled;
  }

  handleEvent(event: string, playerId: string, data: any) {
    switch (event) {
      case "game_ready":
        // Client has mounted the game screen and listeners; resend current state.
        this.ensureRoundStarted();
        this.emitRoundStartToPlayer(playerId);
        break;

      case "word_chosen":
        if (playerId === this.drawerId) {
          this.word = data.word.toLowerCase().trim();
          this.wordChosen = true;
          this.currentWordOptions = [];
          const drawerName = this.room.players.find(p => p.id === playerId)?.name || "Unknown";
          console.log(`📝 ${drawerName} chose: "${this.word}" (${this.word.length} letters)`);
          
          this.room.broadcast("word_chosen", { 
            length: this.word.length,
            drawerName
          });
        }
        break;

      case "draw_move":
        if (playerId === this.drawerId && this.wordChosen) {
          this.room.broadcast("draw_move", data);
        }
        break;

      case "canvas_clear":
      case "undo":
        if (playerId === this.drawerId) {
          this.room.broadcast(event, {});
        }
        break;

      case "guess":
      case "chat":
        this.handleGuess(playerId, data.text);
        break;
    }
  }

  handleGuess(playerId: string, guess: string) {
    if (!this.wordChosen) {
      console.log(`⏳ No word chosen, ignoring guess/chat from ${playerId}`);
      return;
    }

    if (playerId === this.drawerId) {
      // Drawer can chat freely
      const playerName = this.room.players.find(p => p.id === playerId)?.name || "Unknown";
      this.room.broadcast("chat_message", {
        playerId, playerName, text: guess, isSystem: false
      });
      return;
    }

    // Prevent duplicate guesses
    if (this.guessedPlayers.has(playerId)) return;

    const cleanGuess = guess.toLowerCase().trim();
    const cleanWord = this.word.toLowerCase().trim();

    if (cleanGuess === cleanWord) {
      const player = this.room.players.find(p => p.id === playerId);
      if (player) {
        const timeBonus = Math.max(0, Math.min(1, this.timeLeft / this.room.settings.drawTime));
        const points = Math.round(100 * timeBonus + 10); // 10-110 points
        player.score += points;
        this.guessedPlayers.add(playerId);

        console.log(`✅ ${player.name} guessed "${this.word}"! +${points}pts`);
        
        this.room.broadcast("correct_guess", {
          playerId, playerName: player.name, score: player.score,
          word: this.word, points
        });

        // End round if all connected players (except drawer) guessed
        const connectedCount = this.room.players.filter(p => 
          this.room.io.sockets.sockets.has(p.id)
        ).length;
        if (this.guessedPlayers.size >= connectedCount - 1) {
          this.endRound();
        }
      }
    } else {
      // Wrong guess → regular chat
      const playerName = this.room.players.find(p => p.id === playerId)?.name || "Unknown";
      this.room.broadcast("chat_message", {
        playerId, playerName, text: guess, isSystem: false
      });
    }
  }

  startTimer() {
    if (this.timer) clearInterval(this.timer); // Prevent duplicates
    
    this.timer = setInterval(() => {
      const connectedCount = this.room.players.filter(p =>
        this.room.io.sockets.sockets.has(p.id)
      ).length;

      // If nobody is connected anymore, stop the game loop.
      if (connectedCount === 0) {
        console.log('🛑 No connected players left - stopping timer');
        if (this.timer) {
          clearInterval(this.timer);
          this.timer = null;
        }
        return;
      }

      this.timeLeft--;
      this.room.broadcast("timer", { timeLeft: this.timeLeft });

      if (this.timeLeft <= 0) {
        this.endRound();
      }
    }, 1000);
  }

  endRound() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    console.log(`🏁 Round ${this.round} ended. Word: "${this.word || 'none'}"`);
    this.currentWordOptions = [];

    this.room.broadcast("round_end", {
      word: this.word,
      scores: this.room.players,
      round: this.round
    });

    if (this.round >= this.room.settings.rounds) {
      if (this.room.players.length === 0) {
        console.log('🛑 Game over but no players remain');
        return;
      }

      const winner = this.room.players.reduce((max, p) =>
        p.score > max.score ? p : max
      );
      console.log(`🏆 WINNER: ${winner.name} (${winner.score} pts)`);
      
      this.room.broadcast("game_over", {
        winner: winner.name,
        winnerScore: winner.score,
        players: this.room.players
      });
    } else {
      setTimeout(() => this.nextRound(), 4000);
    }
  }
}