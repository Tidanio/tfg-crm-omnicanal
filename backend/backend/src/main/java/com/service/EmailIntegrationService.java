package com.service;

import com.dto.EmailWebhookDTO;
import com.entity.ChannelType;
import com.entity.Contact;
import com.entity.Conversation;
import com.entity.ConversationStatus;
import com.entity.Inbox;
import com.entity.Message;
import com.repository.ContactRepository;
import com.repository.ConversationRepository;
import com.repository.InboxRepository;
import com.repository.MessageRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmailIntegrationService {
  private final InboxRepository inboxRepo;
  private final ContactRepository contactRepo;
  private final ConversationRepository convRepo;
  private final MessageRepository msgRepo;

  public EmailIntegrationService(InboxRepository inboxRepo, ContactRepository contactRepo,
                                 ConversationRepository convRepo, MessageRepository msgRepo) {
    this.inboxRepo = inboxRepo;
    this.contactRepo = contactRepo;
    this.convRepo = convRepo;
    this.msgRepo = msgRepo;
  }

  public void process(EmailWebhookDTO dto) {
    Inbox inbox = inboxRepo.findByChannelType(ChannelType.EMAIL).orElseThrow();
    Optional<Message> replied = Optional.empty();
    if (dto.getInReplyTo() != null && !dto.getInReplyTo().isEmpty()) {
      replied = msgRepo.findByEmailMessageId(dto.getInReplyTo());
    } else {
      List<String> refs = Optional.ofNullable(dto.getReferences()).orElse(List.of());
      for (String ref : refs) {
        replied = msgRepo.findByEmailMessageId(ref);
        if (replied.isPresent()) break;
      }
    }
    Conversation conv;
    if (replied.isPresent()) {
      conv = replied.get().getConversation();
    } else {
      Contact c = resolveContactByEmail(dto.getFrom());
      conv = convRepo.findByContactIdAndStatusAndChannel(c.getId(), ConversationStatus.OPEN, ChannelType.EMAIL)
        .orElseGet(() -> {
          Conversation nc = new Conversation();
          nc.setContact(c);
          nc.setStatus(ConversationStatus.OPEN);
          nc.setChannel(ChannelType.EMAIL);
          return convRepo.save(nc);
        });
    }
    Message msg = new Message();
    msg.setConversation(conv);
    msg.setInbox(inbox);
    msg.setDirection("INCOMING");
    msg.setSenderType("contact");
    msg.setContent(dto.getText());
    msg.setEmailMessageId(dto.getMessageId());
    msg.setEmailInReplyTo(dto.getInReplyTo());
    msg.setEmailReferences(String.join(",", Optional.ofNullable(dto.getReferences()).orElse(List.of())));
    msg.setEmailThreadId(buildThreadId(conv));
    msg.setEmailFrom(dto.getFrom());
    msg.setEmailTo(String.join(",", Optional.ofNullable(dto.getTo()).orElse(List.of())));
    msg.setEmailCc(String.join(",", Optional.ofNullable(dto.getCc()).orElse(List.of())));
    msg.setEmailSubject(dto.getSubject());
    msgRepo.save(msg);
  }

  private String buildThreadId(Conversation conv) {
    return "conv:" + conv.getId();
  }

  private Contact resolveContactByEmail(String email) {
    return contactRepo.findByEmail(email).orElseGet(() -> {
      Contact c = new Contact();
      c.setEmail(email);
      c.setName(email);
      return contactRepo.save(c);
    });
  }
}
