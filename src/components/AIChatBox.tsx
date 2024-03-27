import { cn } from "@/lib/utils";
import { useChat } from "ai/react";
import { Bot, Trash, XCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Message } from "ai";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useEffect, useRef } from "react";
interface AIChatBoxProps {
  open: boolean;
  onClose: () => void;
}

export default function AIChatBox({ open, onClose }: AIChatBoxProps) {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading,
    error,
  } = useChat(); //api / chat --make request to this wroute by default

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollref.current) {
      scrollref.current.scrollTop = scrollref.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  const lastMessageIsUser = messages[messages.length - 1]?.role === "user";

  return (
    <div
      className={cn(
        "full bottom-0 right-0 z-10 max-w-[500px] p-1 xl:right-36",
        open ? "fixed" : "hidden",
      )}
    >
      <button onClick={onClose} className="mb-1 ms-auto block">
        <XCircle size={30} />
      </button>
      <div className="flex h-[600px] flex-col rounded border bg-background shadow-xl">
        <div className="mt-3 h-full overflow-y-auto px-3" ref={scrollref}>
          {messages.map((messages) => (
            <ChatMessage message={messages} key={messages.id} />
          ))}
          {isLoading && lastMessageIsUser && (
            <ChatMessage 
            message={{
                role: "assistant",
                content: "Ruko jra sabr kro...\n bola na dhakkabukki nahi krneka",
            }}
            />
          )}

          {error && (
            <ChatMessage 
            message={{
                role:"assistant",
                content: "something went wrong please try again"
            }}
            />
          )}

        {!error && messages.length === 0 && (
            <div className="flex h-full items-center justify-center gap-3">
                <Bot />
                Ask the AI Questions About Your Notes...
            </div>
        )}

        </div>
        <form onSubmit={handleSubmit} className="m-3 flex gap-1">
          <Button
            title="clear chat"
            variant="outline"
            size="icon"
            className="shrink-0"
            type="button"
            onClick={() => setMessages([])}
          >
            <Trash />
          </Button>
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Say somethin..."
            ref={inputRef}
          />
          <Button type="submit">Send</Button>
        </form>
      </div>
    </div>
  );
}

function ChatMessage({
  message: { role, content },
}: {
  message: Pick<Message, "role" | "content">;
}) {
  const { user } = useUser();

  const isAiMessage = role === "assistant";
  return (
    <div
      className={cn(
        "mb-3 flex items-center",
        isAiMessage ? "me-5 justify-start" : " ms-5 justify-end",
      )}
    >
      {/* <div>{role}</div>
            <div>{content}</div> */}

      {isAiMessage && <Bot className="mr-2 shrink-0" />}
      <p
        className={cn(
          "whitespace-pre-line rounded-md border px-3 py-2",
          isAiMessage ? "bg-background" : "bg-primary text-primary-foreground",
        )}
      >
        {content}
      </p>
      {!isAiMessage && user?.imageUrl && (
        <Image
          src={user.imageUrl}
          alt="User image"
          width={40}
          height={40}
          className="ml-2 rounded-full"
        />
      )}
    </div>
  );
}
