import io from "socket.io-client";
import { ref, onMounted, reactive } from "vue";

export function useSocket() {
  const socket = io(`${location.protocol}//${location.hostname}:3006`, {
    autoConnect: false,
    withCredentials: true,
  });
  const networkStatus = ref("disconnected");
  const character = reactive({
    type: null,
    status: null,
  });

  const ajime = ref(false);

  function resetState() {
    character.status = null;
    character.type = null;
    ajime.value = false;
  }

  onMounted(() => {
    socket.on("connect", () => {
      networkStatus.value = "waiting";
    });

    socket.on("ready", () => {
      networkStatus.value = "ready";
      character.status = "start";
    });

    socket.on("waiting", () => {
      networkStatus.value = "waiting";
      ajime.value = false;
    });

    socket.on("disconnect", () => {
      networkStatus.value = "disconnected";
      resetState();
    });

    socket.on("reconnect", () => {
      networkStatus.value = "connected";
    });

    socket.on("ping", () => {
      socket.emit("pong", socket.id);
    });

    socket.on("error", ({ message }) => {
      console.error({ message });
    });

    socket.on("kirby", () => {
      character.type = "kirby";
    });

    socket.on("knight", () => {
      character.type = "knight";
    });

    socket.on("ajime", () => {
      ajime.value = true;
    });

    socket.on("striked", () => {
      character.status = "lose";
      ajime.value = false;
    });

    socket.on("won", () => {
      character.status = "win";
      ajime.value = false;
    });
  });

  return { networkStatus, socket, character, ajime };
}
