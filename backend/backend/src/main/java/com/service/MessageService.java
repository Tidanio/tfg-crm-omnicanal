package com.service;

import com.channel.ChannelSender;
import com.channel.EmailSender;
import com.channel.WhatsappSender;
import com.entity.Conversation;
import com.entity.Inbox;
import com.entity.Message;
import com.repository.ConversationRepository;
import com.repository.InboxRepository;
import com.repository.MessageRepository;
import org.springframework.stereotype.Service;

@Service
public class MessageService {
  private final ConversationRepository conversationRepo;
  private final InboxRepository inboxRepo;
  private final MessageRepository messageRepo;

  private final WhatsappSender whatsappSender;

  public MessageService(ConversationRepository c, InboxRepository i, MessageRepository m, WhatsappSender whatsappSender) {
    this.conversationRepo = c;
    this.inboxRepo = i;
    this.messageRepo = m;
    this.whatsappSender = whatsappSender;
  }

  public Message send(Long conversationId, String content) {
    Conversation conv = conversationRepo.findById(conversationId).orElseThrow();
    Inbox inbox = inboxRepo.findByChannelType(conv.getChannel()).orElseThrow();
    
    // Enviar mensaje real a través del canal correspondiente
    if (conv.getChannel() == com.entity.ChannelType.WHATSAPP) {
        String destinationNumber = conv.getContact().getWhatsappId();
        whatsappSender.sendTo(destinationNumber, content);
    } else {
        ChannelSender sender = resolveSender(inbox.getChannelType());
        sender.send(content);
    }

    Message msg = new Message();
    msg.setConversation(conv);
    msg.setInbox(inbox);
    msg.setDirection("OUTGOING");
    msg.setSenderType("agent");
    msg.setContent(content);
    return messageRepo.save(msg);
  }

  private ChannelSender resolveSender(com.entity.ChannelType type) {
    switch (type) {
      case WHATSAPP:
        return whatsappSender;
      case EMAIL:
        return new EmailSender();
      default:
        return payload -> {};
    }
  }

  public Conversation resolveConversation(Long conversationId) {
    java.util.Optional<Conversation> opt = conversationRepo.findById(conversationId);
    if (opt.isEmpty()) return null;
    Conversation conv = opt.get();
    conv.setStatus(com.entity.ConversationStatus.RESOLVED);
    return conversationRepo.save(conv);
  }

  public Conversation openConversation(Long conversationId) {
    java.util.Optional<Conversation> opt = conversationRepo.findById(conversationId);
    if (opt.isEmpty()) return null;
    Conversation conv = opt.get();
    conv.setStatus(com.entity.ConversationStatus.OPEN);
    return conversationRepo.save(conv);
  }
}
