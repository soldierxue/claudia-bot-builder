'use strict';

const isUrl = require('../is-url');

class slackTemplate {
  constructor(text) {
    this.template = {
      mrkdwn: true
    };
    this.template.attachments = [];

    if (text)
      this.template.text = text;
  }

  replaceOriginal(value) {
    this.template.replace_original = !!value;
    return this;
  }

  disableMarkdown(value) {
    if (value)
      this.template.mrkdwn = !value;

    return this;
  }

  // This works for Slash commands only
  channelMessage(type) {
    // Other type is 'ephemeral', but we are not setting it because it's default anyway
    if (type === 'in_channel')
      this.template.response_type = type;

    return this;
  }

  getLatestAttachment() {
    if (!this.template.attachments.length)
      throw new Error('Add at least one attachment first');

    return this.template.attachments[this.template.attachments.length - 1];
  }

  addAttachment(callbackId, type, fallback) {
    const attachment = {
      actions: []
    };

    if (callbackId)
      attachment.callback_id = callbackId;

    if (type)
      attachment.attachment_type = type;

    attachment.fallback = fallback || 'Slack told us that you are not able to see this attachment 😢';

    this.template.attachments.push(attachment);

    return this;
  }

  addTitle(text, link) {
    if (!text)
      throw new Error('Title text is required for addTitle method');

    const attachment = this.getLatestAttachment();
    attachment.title = text;
    if (isUrl(link))
      attachment.title_link = link;

    return text;
  }

  addText(text) {
    if (!text)
      throw new Error('Text is required for addText method');

    const attachment = this.getLatestAttachment();
    attachment.text = text;

    return this;
  }

  addPretext(text) {
    if (!text)
      throw new Error('Text is required for addPretext method');

    const attachment = this.getLatestAttachment();
    attachment.pretext = text;

    return this;
  }

  addImage(url) {
    if (!isUrl(url))
      throw new Error('addImage method requires a valid URL');

    const attachment = this.getLatestAttachment();
    attachment.image_url = url;

    return this;
  }

  addThumbnail(url) {
    if (!isUrl(url))
      throw new Error('addImage method requires a valid URL');

    const attachment = this.getLatestAttachment();
    attachment.thumb_url = url;

    return this;
  }

  addAuthor(name, icon, link) {
    if (!name)
      throw new Error('Name is required for addAuthor method');

    const attachment = this.getLatestAttachment();
    attachment.author_name = name;

    if (icon)
      attachment.author_icon = icon;

    if (isUrl(link))
      attachment.author_link = link;

    return this;
  }

  addFooter(text, icon) {
    if (!text)
      throw new Error('Text is required for addFooter method');

    const attachment = this.getLatestAttachment();
    attachment.footer = text;

    if (icon)
      attachment.footer_icon = icon;

    return this;
  }

  addColor(color) {
    if (!color)
      throw new Error('Color is required for addColor method');

    const attachment = this.getLatestAttachment();
    attachment.color = color;

    return this;
  }

  addTimestamp(timestamp) {
    if (!(timestamp instanceof Date))
      throw new Error('Timestamp needs to be a valid Date object');

    const attachment = this.getLatestAttachment();
    attachment.ts = timestamp.getTime();

    return this;
  }

  addField(title, value, isShort) {
    if (!title || !value)
      throw new Error('Title and value are required for addField method');

    const attachment = this.getLatestAttachment();
    if (!attachment.fields)
      attachment.fields = [];

    attachment.fields.push({
      title: title,
      value: value,
      short: !!isShort
    });
  }

  addAction(text, name, value, style) {
    if (!text || !name || !value)
      throw new Error('Text, name and value are requeired for addAction method');

    const action = {
      text: text,
      name: name,
      value: value,
      type: 'button'
    };

    if (style)
      action.style = style;

    this.getLatestAttachment().actions.push(action);

    return this;
  }

  getLatestAction() {
    const actions = this.getLatestAttachment().actions;

    if (!actions.length)
      throw new Error('At least one action is requeired for getLatestAction method');

    return actions[actions.length - 1];
  }

  addConfirmation(title, text, okLabel, dismissLabel) {
    if (!title || !text)
      throw new Error('Title and text are required for addConfirmation method');

    const action = this.getLatestAction();

    action.confim = {
      title: title,
      text: text,
      ok_text: okLabel || 'Ok',
      dismiss_text: dismissLabel || 'Dismiss'
    };

    return this;
  }

  get() {
    return this.template;
  }
}

module.exports = slackTemplate;