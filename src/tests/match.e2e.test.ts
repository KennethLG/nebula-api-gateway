import { io } from "socket.io-client";
import { config } from "../config";
import { listen } from "../app";

const url = config.LOCAL_URL;
const token = config.MATCH_AUTH_TOKEN;

const connect = () => {
  console.log(token);
  const socket = io(`${url}/match`, {
    auth: { token },
    transports: ["websocket"],
  });

  socket.on("connect_error", (error) => {
    console.log(`connect_error: ${error.message}`);
  });

  return socket;
};

describe("Matchmaking WebSocket (E2E)", () => {
  let server: any;
  beforeAll(async () => {
    server = listen();
    await new Promise((resolve) => setTimeout(resolve, 1000));
  });

  afterAll(() => {
    server.close();
    setTimeout(() => {
      process.exit();
    }, 100);
  });

  it("should start match when enough players join", (done) => {
    const player1 = connect();

    const player2 = connect();

    let matchCount = 0;

    const handleMatchFound = (data: any) => {
      console.log(`Match found: ${JSON.stringify(data)}`);
      expect(typeof data.data.seed).toBe("number");
      expect(typeof data.data.id).toBe("string");
      expect(data.data.players).toHaveLength(2);

      matchCount++;
      if (matchCount === 2) {
        player1.close();
        player2.close();
        done();
        console.log("done");
      }
    };

    console.log("Joining match");
    player1.emit("joinMatch", { id: "player1" });
    player2.emit("joinMatch", { id: "player2" });

    console.log("Listening for match found");
    player1.on("matchFound", handleMatchFound);
    player2.on("matchFound", handleMatchFound);
  });

  it("should remove player from match when they disconnect", (done) => {
    const player1 = connect();

    const player2 = connect();

    player1.emit("joinMatch", { id: "player1" });
    player1.close();
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    player2.emit("joinMatch", { id: "player2" });

    player2.on("matchFound", (data: any) => {
      expect(false).toBe(true);
    });

    setTimeout(() => {
      player2.close();
      done();
    }, 1000);
  });

  it("should update a player correctly", (done) => {
    const player1 = connect();

    const player2 = connect();

    player1.emit("joinMatch", { id: "player1" });
    player2.emit("joinMatch", { id: "player2" });

    player1.on("matchFound", (data: any) => {
      console.log(`match found, updating player1: ${JSON.stringify(data)}`);
      const newData = {
        matchId: data.data.id,
        player: {
          id: "player1",
          xVel: { x: 55, y: 55 },
          yVel: { x: 55, y: 55 },
          position: { x: 55, y: 55 },
          key: "d",
          keyState: true,
          dead: false,
        },
      };
      player1.emit("updatePlayer", newData);
    });

    player2.on("matchFound", () => {
      console.log(`match found, receiving player1 update`);
      player2.on("playerUpdated", (data: any) => {
        console.log(`player1 updated: ${JSON.stringify(data)}`);
        expect(data.data.player.id).toBe("player1");
        expect(data.data.player.xVel).toEqual({ x: 55, y: 55 });
        expect(data.data.player.yVel).toEqual({ x: 55, y: 55 });
        expect(data.data.player.position).toEqual({ x: 55, y: 55 });
        expect(data.data.player.key).toBe("d");
        expect(data.data.player.keyState).toBe(true);
        expect(data.data.player.dead).toBe(false);

        player1.close();
        player2.close();
        done();
        console.log("done");
      });
    });
  });

  it("should not create match with 1 player connected twice", (done) => {
    const player1 = connect();

    player1.emit("joinMatch", { id: "player1-twice" });
    player1.emit("joinMatch", { id: "player1-twice" });

    player1.on("matchFound", () => {
      expect(false).toBe(true);
    });

    setTimeout(() => {
      player1.close();
      done();
    }, 1000);
  });
});
