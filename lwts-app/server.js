// MARK: - Imports

// Importing the dotenv module to access environment variables
require('dotenv').config()

// Importing DataBase
const { db, initializeDataBase } = require("./db/db");

// Importing Telegram Bot
const { Bot, InlineKeyboard, webhookCallback } = require("grammy");
const express = require("express")
const bot = new Bot(process.env.TELEGRAM_TOKEN);

// Importing Open AI
const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
const { endWord, systemRolePromt, userRolePromt, assistantPromt, imageGenerationPromt } = require("./bot.conversation.context");

// MARK: - Private Properties

let wasWayEnded = false;
let wasJourneyModActivated = false;
let stillLoading = false;
let savedChatId = 0;

let messagesPromt = [
  {
    "role": "system",
    "content": systemRolePromt
  },
  {
    "role": "user",
    "content": userRolePromt
  },
  {
    "role":"assistant",
    "content": assistantPromt
  }
]

// MARK: - App Start

async function bootstrap() {
  await initializeDataBase();
  bot.start();
}
  
bootstrap();

// MARK: - Private Methods

// Set Custom Bot Commands
bot.api.setMyCommands([
  {command: 'start', description: 'Рад тебя видеть здесь снова.'},
  {command: 'journey_rules', description: 'Давай я тебе расскажу, о правилах'},
  {command: 'roads', description: 'Хочешь узнать, сколько дорог ты прошел?'},
  {command: 'new_journey', description: 'Таков будет твой путь'}
]);

// Set Command Business logic
bot.command("start", async (ctx) => {
  ctx.reply("Приветствую путник, в моем баре. Сегодня я тебе расскажу одну забавную историю из твоего прошлого. Если не боишься вспомнить, конечно же. Начнем?")

  const chatId = ctx.chat.id;
  const user = await db.users.findOne({ where: { chatId: chatId }});

  if (!user) {
    await db.users.create({
      chatId: chatId,
      name: ctx.from.first_name,
      chatHistory: JSON.stringify(messagesPromt)
    })
  } else {
    clearHistory(ctx)
  }
});

bot.command("journey_rules", async (ctx) => {
  ctx.reply(`Правила просты дорогой ${ctx.from.first_name}.\nТы можешь начать свой путь и когда, ты достигнешь своей цели я тебе скажу об этом. \nТакже ты можешь стереть воспоминания о предыдущей истории. \nУзнать сколько дорог ты прошел до конца.\n\nНа этом пока все`)
});

bot.command("roads", async (ctx) => {
  const chatId = ctx.chat.id;
  const user = await db.users.findOne({ where: { chatId: chatId }});

  ctx.reply(`Ты успел пройти путь уже ${user.howManyRoadsPassed || 0} раз`)
});

bot.command("new_journey", async (ctx) => {
  wasJourneyModActivated = true;
  wasWayEnded = false;

  ctx.reply(assistantPromt)
  ctx.replyWithPhoto("https://i.ibb.co/k4BHkqW/photo-2023-09-25-00-48-42.jpg")
});

// Set Bot Message Business logic
bot.on('message', async ctx => {
    const chatId = ctx.chat.id;
    savedChatId = chatId
    const userMessage = ctx.message.text;

    if (wasWayEnded) {
      return bot.api.sendMessage(chatId, 'Твоя история подошла к концу, но она лишь одна из многих. Можешь забыть ее и начать новую. Таков путь.');
    }
  
    try {
      if (wasJourneyModActivated) {
        const user = await db.users.findOne({ where: { chatId: chatId }});

        if (!stillLoading) {
          stillLoading = true;
          loadMessage(user, userMessage, ctx);
        } else {
          bot.api.sendMessage(chatId, 'Потерпи немного, я почти вспомнил, что будет дальше...');
        }
      } else {
        bot.api.sendMessage(chatId, 'Сейчас ты говоришь в пустоту, если хочешь начать историю выйди из комнаты. Соверши ошибку и нажми new_journey');
      }
    } catch (e) {
      bot.api.sendMessage(chatId, 'Похоже что-то пошло не так.');
      stillLoading = false;
      wasWayEnded = false;
      console.log(e);
    }
});

async function loadMessage(user, message, ctx) {

  const messages = JSON.parse(user.chatHistory)
  messages.push({
    "role": "user",
    "content": message
  });
  
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: messages,
    temperature: 1,
    max_tokens: 1000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0
  });

  console.log(response);
  console.log(response.choices[0].message);

  const assistantMessage = response.choices[0].message.content;
  
  messages.push({
    "role": "assistant",
    "content": assistantMessage
  });
  
  console.log(messages);
  
  if (assistantMessage == null) {
    bot.api.sendMessage(savedChatId, "Похоже, что я забыл историю на середине, напомни, что ты сделал дальше?");
  } else {
    user.chatHistory = JSON.stringify(messages)
    await user.save();

    bot.api.sendMessage(savedChatId, assistantMessage);
  }

  if (assistantMessage.replace(/ /g,'').includes(endWord.replace(/ /g,''))) {
    let howManyRoadsPassed = user.howManyRoadsPassed || 0;
    howManyRoadsPassed = howManyRoadsPassed + 1;
    user.howManyRoadsPassed = howManyRoadsPassed;
    await user.save();

    bot.api.sendMessage(savedChatId, "Cпасибо за то, что отважился пройти это небольшое приключение, а теперь подожди немного и картина произошедшего всплывет у тебя в памяти");
    generateJorneyEndImageUrl(user, ctx)
  } else {
    stillLoading = false;
  }
}

async function generateJorneyEndImageUrl(user, ctx) {
  stillLoading = true

  const messages = JSON.parse(user.chatHistory)
  messages.push({
    "role": "user",
    "content": imageGenerationPromt
  });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: messages,
      temperature: 1,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    });

    const imagePromt = response.choices[0].message.content;
    const imagesConfig = {
      prompt: imagePromt,
      n: 1,
      size: "1024x1024"
    };

    const imageResponse = await openai.images.generate(imagesConfig);
    const imageUrl = imageResponse.data[0].url
    ctx.replyWithPhoto(imageUrl)

    stillLoading = false
    wasWayEnded = true
    wasJourneyModActivated = false
  } catch (err) {
    stillLoading = false
    wasWayEnded = true
    wasJourneyModActivated = false
  }
}

async function clearHistory(ctx) {
  const chatId = ctx.chat.id;
  const user = await db.users.findOne({ where: { chatId: chatId }});
  user.chatHistory = JSON.stringify(messagesPromt);
  await user.save();
  
  wasJourneyModActivated = false
  wasWayEnded = false
  stillLoading = false
}