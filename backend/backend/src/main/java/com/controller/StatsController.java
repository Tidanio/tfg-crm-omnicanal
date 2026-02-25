package com.controller;

import com.entity.Message;
import com.repository.MessageRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/dev")
public class StatsController {
  private final MessageRepository messageRepository;
  public StatsController(MessageRepository messageRepository) {
    this.messageRepository = messageRepository;
  }
  @GetMapping("/stats")
  public ResponseEntity<Map<String, Object>> stats() {
    List<Message> all = messageRepository.findAll();
    Map<String, Long> byChannel = new HashMap<>();
    Map<String, Long> byStatus = new HashMap<>();
    Map<String, Map<String, Long>> byChannelStatus = new HashMap<>();
    for (Message m : all) {
      String channel = m.getInbox() != null && m.getInbox().getChannelType() != null ? m.getInbox().getChannelType().name() : "UNKNOWN";
      String status = m.getConversation() != null && m.getConversation().getStatus() != null ? m.getConversation().getStatus().name() : "OPEN";
      byChannel.put(channel, byChannel.getOrDefault(channel, 0L) + 1);
      byStatus.put(status, byStatus.getOrDefault(status, 0L) + 1);
      Map<String, Long> inner = byChannelStatus.computeIfAbsent(channel, k -> new HashMap<>());
      inner.put(status, inner.getOrDefault(status, 0L) + 1);
    }
    Map<String, Object> result = new HashMap<>();
    result.put("byChannel", byChannel);
    result.put("byStatus", byStatus);
    result.put("byChannelStatus", byChannelStatus);
    return ResponseEntity.ok(result);
  }
}
