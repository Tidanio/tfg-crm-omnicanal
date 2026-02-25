package com.controller;

import com.dto.InstagramWebhookDTO;
import com.dto.WhatsAppWebhookDTO;
import com.entity.ChannelType;
import com.entity.Inbox;
import com.repository.InboxRepository;
import com.service.InboundService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dev")
public class DevWebhookController {

  private final InboundService inboundService;
  private final InboxRepository inboxRepository;
  private final com.service.EmailIntegrationService emailIntegrationService;

  public DevWebhookController(InboundService inboundService, InboxRepository inboxRepository,
                              com.service.EmailIntegrationService emailIntegrationService) {
    this.inboundService = inboundService;
    this.inboxRepository = inboxRepository;
    this.emailIntegrationService = emailIntegrationService;
  }

  @PostMapping("/webhooks/whatsapp")
  public ResponseEntity<Void> whatsapp(@RequestBody WhatsAppWebhookDTO dto) {
    inboundService.processEvent(ChannelType.WHATSAPP, dto.getFrom(), dto.getText());
    return ResponseEntity.ok().build();
  }

  @PostMapping("/webhooks/instagram")
  public ResponseEntity<Void> instagram(@RequestBody InstagramWebhookDTO dto) {
    inboundService.processEvent(ChannelType.INSTAGRAM, dto.getSenderId(), dto.getText());
    return ResponseEntity.ok().build();
  }

  @GetMapping("/seed/inboxes")
  public ResponseEntity<String> seedInboxes() {
    seed(ChannelType.WHATSAPP, "Dev WhatsApp Inbox");
    seed(ChannelType.INSTAGRAM, "Dev Instagram Inbox");
    seed(ChannelType.EMAIL, "Dev Email Inbox");
    return ResponseEntity.ok("Seeded");
  }

  private void seed(ChannelType type, String name) {
    if (inboxRepository.findByChannelType(type).isEmpty()) {
      Inbox inbox = new Inbox();
      inbox.setName(name);
      inbox.setChannelType(type);
      inboxRepository.save(inbox);
    }
  }

  @PostMapping("/webhooks/email")
  public ResponseEntity<Void> email(@RequestBody com.dto.EmailWebhookDTO dto) {
    emailIntegrationService.process(dto);
    return ResponseEntity.ok().build();
  }
}
