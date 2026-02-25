package com.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "inboxes")
public class Inbox {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private Long accountId;

  private String name;

  @Enumerated(EnumType.STRING)
  private ChannelType channelType;

  @Column(columnDefinition = "TEXT")
  private String channelConfig;

  public Inbox() {}

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getAccountId() {
    return accountId;
  }

  public void setAccountId(Long accountId) {
    this.accountId = accountId;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public ChannelType getChannelType() {
    return channelType;
  }

  public void setChannelType(ChannelType channelType) {
    this.channelType = channelType;
  }
  public String getChannelConfig() {
    return channelConfig;
  }

  public void setChannelConfig(String channelConfig) {
    this.channelConfig = channelConfig;
  }
}
