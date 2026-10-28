import { useEffect, useState } from "react";
import { MessageSquareOff } from "lucide-react";
import { useSession } from "@/app/providers/AuthProvider";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatThread from "@/components/chat/ChatThread";
import PeoplePicker from "@/components/chat/PeoplePicker";
import { useChat } from "@/features/chat/useChat";
import { typingNames } from "@/features/chat/chatState";
import { cn } from "@/lib/cn";

export default function Chat() {
  const { profile } = useSession();
  const chat = useChat(profile?.id);
  const { state } = chat;
  const [picking, setPicking] = useState(false);
  const [showThread, setShowThread] = useState(false); // phones show either the list or one conversation

  // Land in General once the list arrives.
  const hasGeneral = state.channels.some((c) => c.id === "general");
  const { open } = chat;
  useEffect(() => {
    if (hasGeneral && !state.active) open("general");
  }, [hasGeneral, state.active, open]);

  const channel = state.channels.find((c) => c.id === state.active);

  const choose = (id) => {
    chat.open(id);
    setShowThread(true);
  };

  if (state.status === "denied") {
    return (
      <>
        <PageHeader title="Team chat" subtitle="Talk with your team and HR." />
        <Card role="alert" className="flex flex-col items-center gap-3 p-10 text-center">
          <MessageSquareOff size={28} aria-hidden="true" className="text-muted" />
          <h2 className="text-lg font-extrabold">Chat isn't available</h2>
          <p className="max-w-md text-muted">{state.error}</p>
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Team chat" subtitle="Talk with your team and HR. Chat is live while this page is open." />
      <Card className="grid h-[min(680px,calc(100vh-220px))] min-h-[480px] grid-cols-1 overflow-hidden md:grid-cols-[280px_minmax(0,1fr)]">
        <ChatSidebar state={state} onOpen={choose} onNewMessage={() => setPicking(true)} className={cn(showThread && "max-md:hidden")} />
        {channel ? (
          <ChatThread
            key={channel.id}
            className={cn(!showThread && "max-md:hidden")}
            channel={channel}
            thread={state.threads[channel.id]}
            selfId={profile?.id}
            selfRole={profile?.role}
            status={state.status}
            online={channel.type === "dm" && !!state.online[channel.partner?.id]}
            typing={typingNames(state, channel.id, profile?.id)}
            onBack={() => setShowThread(false)}
            onSend={chat.send}
            onRetry={chat.retry}
            onDiscard={chat.discard}
            onDelete={chat.remove}
            onLoadOlder={chat.loadOlder}
            onTyping={chat.notifyTyping}
          />
        ) : (
          <p className={cn("grid place-items-center p-10 text-sm text-muted", !showThread && "max-md:hidden")} aria-live="polite">
            {state.status === "online" ? "Choose a conversation." : state.status === "connecting" ? "Connecting to chat…" : "Chat is offline. Trying to reconnect…"}
          </p>
        )}
      </Card>

      <PeoplePicker
        open={picking}
        onClose={() => setPicking(false)}
        people={state.people}
        online={state.online}
        onPick={(person) => {
          setPicking(false);
          chat.openPerson(person);
          setShowThread(true);
        }}
      />
    </>
  );
}
