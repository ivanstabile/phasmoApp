import { useEffect, useState } from "react";
import tmi from "tmi.js";

import "./styles.css";

const client = new tmi.Client({
    channels: ["ivansttv"],
});

export default function App() {
    const [votes, setVotes] = useState([]);
    const [status, setStatus] = useState("stopped");

    useEffect(() => {
        client.connect().catch(console.error);

        function onMessage(channel, tags, message, self) {
            console.log(self, message, status);

            if (tags["username"] === "ivansttv") {
                if (message === "!start") {
                    setStatus("playing");
                } else if (message === "!stop") {
                    setStatus("stopped");
                } else if (message === "!reset") {
                    setStatus("stopped");
                    setVotes([]);
                }

                return;
            }

            if (status !== "playing") return;

            if (message.startsWith("!vote")) {
                let [, ghost] = message.split("!vote ");
                ghost = ghost.trim().toLowerCase();

                setVotes((votes) => votes.filter((vote) => vote.user !== tags["display-name"]).concat({ user: tags["display-name"], vote: ghost }));
            }
        }

        client.on("message", onMessage);

        return () => {
            client.off("message", onMessage);
        };
    }, [status]);

    return (
        <div className="App">
            {[
                "Espiritu",
                "Espectro",
                "Ente",
                "Poltergeist",
                "Banshee",
                "Jinn",
                "Pesadilla",
                "Revenant",
                "Sombra",
                "Demonio",
                "Yurei",
                "Oni",
                "Yokai",
                "Hantu",
                "Goryo",
                "Myling",
                "Onryo",
                "Gemelos",
                "Raiju",
                "Obake",
                "Mimico",
                "Moroi",
                "Deogen",
                "Thaye",
            ].map((ghost) => {
                const matches = votes.filter((vote) => vote.vote === ghost);

                return (
                    <div key={ghost}>
                        <div className="ghost">
                            {ghost} {matches.length > 0 && `(x${matches.length})`}
                        </div>
                        <div className="votes">{matches.map((match) => match.user).join(", ")}</div>
                    </div>
                );
            })}
        </div>
    );
}
