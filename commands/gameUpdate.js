const Discord = require("discord.js")
const fetch = require("node-fetch")

const PATH = process.env.API_URL
const KEY = process.env.API_KEY

exports.run = async (client, message, args) => {
    let data = await fetch(`${PATH}/servers/${message.guild.id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'API_KEY': KEY
        }
    })
        .then(res => res.json());

    if (data.serverID === message.guild.id) {
        if (args.length === 4) {
            const body = {
                gameName: args[0].toLowerCase().replace('_', ' '),
                gameType: args[1].toLowerCase().replace('_', ' '),
                gameRating: args[2],
                playWith: args[3],
            };

            fetch(`${PATH}/games`, {
                method: 'PUT',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                    'API_KEY': KEY
                },
            })
                .then(res => res.json());

            console.log(body)

            const commandEmbed = require('../embeds/commandEmbed');
            const embed = new Discord.MessageEmbed(commandEmbed);

            embed.setDescription('Game Updated!');
            embed.addFields(
                { name: `You have updated: ${args[0].toLowerCase().replace('_', ' ')}`, value: `Game Type: ${args[1].toLowerCase().replace('_', ' ')}, Rating: ${args[2]}, Play with: ${args[3]} others.` },
                { name: 'This command is dev only. DO NOT USE IT', value: 'To add a game, use \'!gameAdd\', to view a game, use \'!gameView\', to see all games use \'!gameAll\', to update a game use \'!gameUpdate\',to delete a game use \'!gameDelete\'.' },
            )
            return message.channel.send({ embed })
        } else {
            const alertEmbed = require('../embeds/alertEmbed');
            const embed = new Discord.MessageEmbed(alertEmbed);

            embed.setDescription('Incorrect usage of gameUpdate');
            embed.addFields(
                { name: 'Use like this:', value: '!gameUpdate <Game_Name of the game you want to update> <Game_Type> <Rating> <Play With>' },
                { name: 'IMPORTANT:', value: 'Use \'_\' instead of [space], a parser removes this from the message' }
            )
            return message.channel.send({ embed });
        }
    }
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 5
};

exports.help = {
    name: 'gameUpdate',
    description: 'Update a game on NEO.',
    usage: 'gameUpdate <Game_Name> <Game_Type> <Rating> <Play With>'
};