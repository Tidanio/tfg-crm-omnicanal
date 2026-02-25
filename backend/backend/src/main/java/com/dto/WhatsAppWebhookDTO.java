package com.dto;

public class WhatsAppWebhookDTO {
  private String from;
  private String text;

  public WhatsAppWebhookDTO() {}

  public String getFrom() {
    return from;
  }

  public void setFrom(String from) {
    this.from = from;
  }

  public String getText() {
    return text;
  }

  public void setText(String text) {
    this.text = text;
  }
}
