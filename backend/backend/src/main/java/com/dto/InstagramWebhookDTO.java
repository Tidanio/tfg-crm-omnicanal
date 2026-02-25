package com.dto;

public class InstagramWebhookDTO {
  private String senderId;
  private String text;

  public InstagramWebhookDTO() {}

  public String getSenderId() {
    return senderId;
  }

  public void setSenderId(String senderId) {
    this.senderId = senderId;
  }

  public String getText() {
    return text;
  }

  public void setText(String text) {
    this.text = text;
  }
}
