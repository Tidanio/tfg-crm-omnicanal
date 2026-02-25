package com.dto;

import java.time.LocalDateTime;

public class MessagePreviewDTO {
  private Long id;
  private Long conversationId;
  private String contactName;
  private String conversationStatus;
  private LocalDateTime createdAt;
  private String direction;
  private String senderType;
  private String content;
  private String channelType;
  private String emailMessageId;
  private String emailInReplyTo;
  private String emailThreadId;

  public MessagePreviewDTO() {}

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public Long getConversationId() { return conversationId; }
  public void setConversationId(Long conversationId) { this.conversationId = conversationId; }
  public String getContactName() { return contactName; }
  public void setContactName(String contactName) { this.contactName = contactName; }
  public String getConversationStatus() { return conversationStatus; }
  public void setConversationStatus(String conversationStatus) { this.conversationStatus = conversationStatus; }
  public LocalDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
  public String getDirection() { return direction; }
  public void setDirection(String direction) { this.direction = direction; }
  public String getSenderType() { return senderType; }
  public void setSenderType(String senderType) { this.senderType = senderType; }
  public String getContent() { return content; }
  public void setContent(String content) { this.content = content; }
  public String getChannelType() { return channelType; }
  public void setChannelType(String channelType) { this.channelType = channelType; }
  public String getEmailMessageId() { return emailMessageId; }
  public void setEmailMessageId(String emailMessageId) { this.emailMessageId = emailMessageId; }
  public String getEmailInReplyTo() { return emailInReplyTo; }
  public void setEmailInReplyTo(String emailInReplyTo) { this.emailInReplyTo = emailInReplyTo; }
  public String getEmailThreadId() { return emailThreadId; }
  public void setEmailThreadId(String emailThreadId) { this.emailThreadId = emailThreadId; }
}
