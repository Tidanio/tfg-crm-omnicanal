package com.controller;

import com.dto.MessagePreviewDTO;
import com.entity.Message;
import com.repository.MessageRepository;
import com.repository.InboxRepository;
import com.repository.ContactRepository;
import com.entity.Inbox;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/dev/messages")
public class DevPreviewController {
  private final MessageRepository messageRepository;
  private final InboxRepository inboxRepository;
  private final com.service.MessageService messageService;
  private final ContactRepository contactRepository;

  public DevPreviewController(MessageRepository messageRepository, InboxRepository inboxRepository, com.service.MessageService messageService, ContactRepository contactRepository) {
    this.messageRepository = messageRepository;
    this.inboxRepository = inboxRepository;
    this.messageService = messageService;
    this.contactRepository = contactRepository;
  }

  @GetMapping("/latest")
  public List<MessagePreviewDTO> latest(@RequestParam(defaultValue = "50") int limit) {
    return messageRepository.findAll(PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt")))
      .stream().map(this::toDto).collect(Collectors.toList());
  }

  @GetMapping("/by-conversation")
  public List<MessagePreviewDTO> byConversation(@RequestParam Long conversationId, @RequestParam(defaultValue = "200") int limit) {
    return messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId, PageRequest.of(0, limit))
      .stream().map(this::toDto).collect(Collectors.toList());
  }

  @GetMapping(value = "/html", produces = MediaType.TEXT_HTML_VALUE)
  public ResponseEntity<String> html(@RequestParam(defaultValue = "50") int limit) {
    List<MessagePreviewDTO> items = latest(limit);
    StringBuilder sb = new StringBuilder();
    sb.append("<html><head><title>Mensajes Recientes</title>");
    sb.append("<style>table{border-collapse:collapse;width:100%;font-family:Arial}th,td{border:1px solid #ccc;padding:6px;font-size:12px}th{background:#f5f5f5}</style>");
    sb.append("</head><body>");
    sb.append("<h3>Mensajes Recientes</h3>");
    sb.append("<table><thead><tr>");
    sb.append("<th>ID</th><th>Fecha</th><th>Canal</th><th>Dir</th><th>Emisor</th><th>Contenido</th><th>Message-ID</th><th>In-Reply-To</th><th>Thread</th>");
    sb.append("</tr></thead><tbody>");
    for (MessagePreviewDTO d : items) {
      sb.append("<tr>");
      sb.append(td(d.getId()));
      sb.append(td(d.getCreatedAt()));
      sb.append(td(d.getChannelType()));
      sb.append(td(d.getDirection()));
      sb.append(td(d.getSenderType()));
      sb.append(td(escape(d.getContent())));
      sb.append(td(d.getEmailMessageId()));
      sb.append(td(d.getEmailInReplyTo()));
      sb.append(td(d.getEmailThreadId()));
      sb.append("</tr>");
    }
    sb.append("</tbody></table></body></html>");
    return ResponseEntity.ok(sb.toString());
  }

  private String td(Object o) {
    return "<td>" + (o == null ? "" : o.toString()) + "</td>";
  }

  private String escape(String s) {
    if (s == null) return "";
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
  }

  private MessagePreviewDTO toDto(Message m) {
    MessagePreviewDTO d = new MessagePreviewDTO();
    d.setId(m.getId());
    d.setConversationId(m.getConversation() != null ? m.getConversation().getId() : null);
    d.setContactName(m.getConversation() != null && m.getConversation().getContact() != null ? m.getConversation().getContact().getName() : null);
    d.setConversationStatus(m.getConversation() != null && m.getConversation().getStatus() != null ? m.getConversation().getStatus().name() : null);
    d.setCreatedAt(m.getCreatedAt());
    d.setDirection(m.getDirection());
    d.setSenderType(m.getSenderType());
    d.setContent(m.getContent());
    d.setChannelType(m.getInbox() != null && m.getInbox().getChannelType() != null ? m.getInbox().getChannelType().name() : null);
    d.setEmailMessageId(m.getEmailMessageId());
    d.setEmailInReplyTo(m.getEmailInReplyTo());
    d.setEmailThreadId(m.getEmailThreadId());
    return d;
  }

  @GetMapping("/inboxes")
  public List<Inbox> inboxes() {
    return inboxRepository.findAll(Sort.by(Sort.Direction.ASC, "name"));
  }

  @GetMapping("/contacts")
  public List<com.entity.Contact> contacts() {
    return contactRepository.findAll(Sort.by(Sort.Direction.ASC, "name"));
  }
  public static class MessageSendDTO {
    public Long conversationId;
    public String content;
  }

  @PostMapping("/send")
  public ResponseEntity<MessagePreviewDTO> send(@RequestBody MessageSendDTO dto) {
    com.entity.Message saved = messageService.send(dto.conversationId, dto.content);
    return ResponseEntity.ok(toDto(saved));
  }

  @PostMapping("/conversations/resolve")
  public ResponseEntity<Void> resolve(@RequestParam Long conversationId) {
    com.entity.Conversation conv = messageService.resolveConversation(conversationId);
    return ResponseEntity.ok().build();
  }

  @PostMapping("/conversations/{id}/resolve")
  public ResponseEntity<java.util.Map<String, String>> resolvePath(@PathVariable("id") Long id) {
    com.entity.Conversation conv = messageService.resolveConversation(id);
    java.util.Map<String, String> body = new java.util.HashMap<>();
    body.put("status", "RESOLVED");
    return ResponseEntity.ok(body);
  }

  @PostMapping("/conversations/{id}/open")
  public ResponseEntity<java.util.Map<String, String>> openPath(@PathVariable("id") Long id) {
    com.entity.Conversation conv = messageService.openConversation(id);
    java.util.Map<String, String> body = new java.util.HashMap<>();
    body.put("status", "OPEN");
    return ResponseEntity.ok(body);
  }
}
