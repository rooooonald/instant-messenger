import ConversationThumbnail from "./conversation-thumbnail";

export default function ConversationList({
  list,
  activeId,
  onSelectConversation,
  onCloseMobileNav,
}) {
  return (
    <>
      {list.map((conversation) => (
        <ConversationThumbnail
          key={conversation.id}
          id={conversation.id}
          activeId={activeId}
          onSelectConversation={onSelectConversation}
          onCloseMobileNav={onCloseMobileNav}
          title={conversation.title}
          participants={conversation.participants}
          lastMessage={
            conversation.messages.length !== 0 &&
            conversation.messages[conversation.messages.length - 1]
          }
        />
      ))}
    </>
  );
}
