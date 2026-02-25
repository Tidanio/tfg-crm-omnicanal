package com.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.entity.*;
import com.repository.*;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class InboundService {
  private static final Logger logger = LoggerFactory.getLogger(InboundService.class);

  private final InboxRepository inboxRepo;
  private final ContactRepository contactRepo;
  private final ConversationRepository convRepo;
  private final MessageRepository msgRepo;
  private final ObjectMapper mapper = new ObjectMapper();

  public InboundService(InboxRepository inboxRepo, ContactRepository contactRepo,
                        ConversationRepository convRepo, MessageRepository msgRepo) {
    this.inboxRepo = inboxRepo;
    this.contactRepo = contactRepo;
    this.convRepo = convRepo;
    this.msgRepo = msgRepo;
  }

  public void process(String channel, String payload) {
    ChannelType type = mapChannel(channel);
    Inbox inbox = inboxRepo.findByChannelType(type).orElseThrow(() -> new RuntimeException("Inbox not found for channel: " + type));
    
    InboundEvent ev = parseInbound(type, payload);
    if (ev == null || ev.sourceId == null || ev.text == null) {
      logger.info("Ignoring non-message event or parse failed for payload");
      return;
    }

    Contact contact = resolveContact(type, ev);
    Conversation conv = findOrCreateConversation(contact, type);
    Message msg = new Message();
    msg.setConversation(conv);
    msg.setInbox(inbox);
    msg.setDirection("INCOMING");
    msg.setSenderType("contact");
    msg.setContent(ev.text);
    msgRepo.save(msg);
    logger.info("Message saved from contact: {}", contact.getName());
  }

  public void processEvent(ChannelType type, String sourceId, String text) {
    Inbox inbox = inboxRepo.findByChannelType(type).orElseThrow();
    InboundEvent ev = new InboundEvent(sourceId, text);
    Contact contact = resolveContact(type, ev);
    Conversation conv = findOrCreateConversation(contact, type);
    Message msg = new Message();
    msg.setConversation(conv);
    msg.setInbox(inbox);
    msg.setDirection("INCOMING");
    msg.setSenderType("contact");
    msg.setContent(text);
    msgRepo.save(msg);
  }

  private ChannelType mapChannel(String channel) {
    switch (channel.toLowerCase()) {
      case "whatsapp": return ChannelType.WHATSAPP;
      case "instagram": return ChannelType.INSTAGRAM;
      case "facebook": return ChannelType.FACEBOOK;
      default: return ChannelType.WEB;
    }
  }

  private InboundEvent parseInbound(ChannelType type, String payload) {
    try {
      JsonNode root = mapper.readTree(payload);
      if (type == ChannelType.WHATSAPP) {
        JsonNode entry = root.path("entry").path(0);
        JsonNode changes = entry.path("changes").path(0);
        JsonNode value = changes.path("value");
        if (value.has("messages")) {
          JsonNode msg = value.path("messages").path(0);
          String from = msg.path("from").asText();
          String text = msg.path("text").path("body").asText();
          return new InboundEvent(from, text);
        } else {
            // Probably a status update (sent, delivered, read)
            logger.debug("Received WhatsApp event without messages (likely status update)");
            return null;
        }
      } else if (type == ChannelType.INSTAGRAM) {
        JsonNode entry = root.path("entry").path(0);
        JsonNode messaging = entry.path("messaging").path(0);
        if (!messaging.isMissingNode()) {
            String senderId = messaging.path("sender").path("id").asText();
            String text = messaging.path("message").path("text").asText();
            if (senderId != null && !senderId.isEmpty() && text != null) {
                 return new InboundEvent(senderId, text);
            }
        }
        logger.debug("Received Instagram event without messaging content");
        return null;
      } else {
        String text = root.path("message").asText();
        return new InboundEvent(null, text);
      }
    } catch (IOException e) {
      logger.error("Error parsing inbound payload", e);
      return null;
    }
  }

  private Contact resolveContact(ChannelType type, InboundEvent ev) {
    Optional<Contact> existing;
    if (type == ChannelType.WHATSAPP) {
      existing = contactRepo.findByWhatsappId(ev.sourceId);
    } else if (type == ChannelType.INSTAGRAM) {
      existing = contactRepo.findByInstagramId(ev.sourceId);
    } else {
      existing = Optional.empty();
    }
    if (existing.isPresent()) return existing.get();
    Contact c = new Contact();
    c.setName(ev.sourceId);
    if (type == ChannelType.WHATSAPP) c.setWhatsappId(ev.sourceId);
    if (type == ChannelType.INSTAGRAM) c.setInstagramId(ev.sourceId);
    return contactRepo.save(c);
  }

  private Conversation findOrCreateConversation(Contact contact, ChannelType type) {
    Optional<Conversation> existing = convRepo.findByContactIdAndStatusAndChannel(
        contact.getId(), ConversationStatus.OPEN, type);
    if (existing.isPresent()) return existing.get();
    Conversation conv = new Conversation();
    conv.setContact(contact);
    conv.setStatus(ConversationStatus.OPEN);
    conv.setChannel(type);
    return convRepo.save(conv);
  }

  private static class InboundEvent {
    final String sourceId;
    final String text;
    InboundEvent(String sourceId, String text) { this.sourceId = sourceId; this.text = text; }
  }
}
