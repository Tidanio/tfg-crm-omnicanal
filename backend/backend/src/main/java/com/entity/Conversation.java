package com.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "conversations")
public class Conversation {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional = false)
  @JoinColumn(name = "contact_id")
  private Contact contact;

  @Enumerated(EnumType.STRING)
  private ConversationStatus status = ConversationStatus.OPEN;

  @Enumerated(EnumType.STRING)
  private ChannelType channel;

  public Conversation() {}

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public Contact getContact() { return contact; }
  public void setContact(Contact contact) { this.contact = contact; }
  public ConversationStatus getStatus() { return status; }
  public void setStatus(ConversationStatus status) { this.status = status; }
  public ChannelType getChannel() { return channel; }
  public void setChannel(ChannelType channel) { this.channel = channel; }
}
