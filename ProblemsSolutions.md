# ⚠️ Problems And Solutions

### 🔄 1. Frontend–Backend Realtime Synchronization

**Problem:**
Initially, timers were managed independently on both the backend and frontend using setTimeout() / setInterval().
This caused quiz progress bar to behave in a weird way.

**Solution:**

* Shifted to a **backend-driven timing model**
* Backend sends question timestamp and duration via Socket event
* Frontend calculates remaining time using server timestamp instead of its own timer

**Result:**

Quiz Progressbar Working Fine

---

### 🔁 2. Duplicate Submissions (Double Execution Issue)

**Problem:**

* In React (especially in development with Strict Mode), certain events and effects were triggered twice
* Users could also submit answers multiple times via rapid clicks

This caused:

* Duplicate API/socket calls
* Incorrect score updates
* Race conditions in game logic

**Solution:**

Implemented multiple safeguards:

* **Frontend protection:**

  * Disabled answer buttons after first click
  * Added state checks (`selected`, `submitting`) to prevent repeated submissions

* **Backend protection:**

  * Introduced `answeredAt` flag in `SessionPlayer`
  * Server ignores submissions if already answered

**Result:**

Lot of race conditions / rapid click bugs were handled


**⚠️ Many more synchronization-related issues occurred during development, especially in SocketIO event handling. These were resolved, with all the changes reflected in the Git commit history.**


# ✅ Detailed Work Flow

## 🎮 Solo Gameplay Flow

1. The user selects a quiz and starts a solo session.

2. A **Session** record is created to represent the game instance with:

   * mode = `solo`
   * currentQuestionIndex = 0

3. A **SessionPlayer** record is created for the user which

   * Tracks score
   * Tracks question progress using `currentQuestionIndex`
   * Maintains completion state (`isFinished`, `finishedAt`)

4. The client fetches the current question using the player’s `currentQuestionIndex`.

5. On each answer submission:

   * The backend validates the answer
   * Updates the player’s score
   * Increments `currentQuestionIndex`

6. This continues until:

   * No more questions remain

7. When the quiz ends:

   * Player is marked as finished
   * User stats (games played, wins) are updated


## 🎮 Multiplayer Gameplay Flow

1. A user (Host) creates a room:

   * A **Session** is created with mode = `multiplayer`
   * A **SessionPlayer** entry is created for the host

2. Other players join the room:

   * Each player gets a **SessionPlayer** record

3. Host starts the quiz:

   * `start_quiz` event is triggered
   * Server initiates a 5-second countdown using `game_countdown`

4. After countdown:

   * Server emits `game_start`
   * Game begins

5. For each question:

   * Server fetches question using `Session.currentQuestionIndex`
   * Broadcasts `question_start` to all players with:

     * question data
     * index
     * duration
     * startedAt timestamp

6. Players submit answers via `submit_answer` event:

   * Server validates the answer
   * Updates score in **SessionPlayer**

7. Server responds with:

   * `answer_result`: correct/incorrect feedback (per player)
   * `score_update`: updated leaderboard (broadcast to all)

8. A fixed timer (e.g., 10 seconds) is controlled by the server:

   * After timer expires:
   * Unanswered players are treated as incorrect
   * Server increments `Session.currentQuestionIndex`
     
9. When no more questions remain:
   * Each player is marked finished
   * Stats are updated to User model

10. Realtime Leaderboard
      * After every answer:
      * Server recomputes rankings
      * Broadcasts via `score_update`
      * Players see live ranking changes during gameplay

## 🗄️ Why I Used SQLite?

SQLite was chosen as the database for this project primarily beacuse it was default AdonisJS DB and is easy to setup. Since the focus of this assignment is on backend design, real-time synchronization, and game state management, SQLite allowed for rapid development without the overhead of configuring and managing a separate database server.

## ⚖️ Tradeoffs

Limited support for high concurrency and parallel writes
Not suitable for horizontally scalable or distributed systems
Performance may degrade under heavy real-time load

## 🚀 Production Consideration

For a production-grade system, I would switch to PostgreSQL, as it offers:

Better support for concurrent users
Advanced querying and indexing capabilities
Improved reliability for real-time multiplayer systems at scale

Since the project uses an ORM (AdonisJS Lucid), migrating to PostgreSQL would require minimal changes to the codebase.