package com.config;

import com.entity.ChannelType;
import com.entity.Inbox;
import com.repository.InboxRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class StartupSeeder {
  @Bean
  CommandLineRunner seedInboxes(InboxRepository inboxRepository) {
    return args -> {
      seed(inboxRepository, ChannelType.WHATSAPP, "Dev WhatsApp Inbox");
      seed(inboxRepository, ChannelType.INSTAGRAM, "Dev Instagram Inbox");
      seed(inboxRepository, ChannelType.EMAIL, "Dev Email Inbox");
    };
  }

  private void seed(InboxRepository repo, ChannelType type, String name) {
    if (repo.findByChannelType(type).isEmpty()) {
      Inbox inbox = new Inbox();
      inbox.setName(name);
      inbox.setChannelType(type);
      repo.save(inbox);
    }
  }
}
