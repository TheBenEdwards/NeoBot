const Discord = require("discord.js")
const fetch = require("node-fetch")

const PATH = process.env.API_URL
const KEY = process.env.API_KEY

exports.run = async (client, message) => {
    let data = await fetch(`${PATH}/servers/${message.guild.id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'API_KEY': KEY
        }
    })
        .then(res => res.json());

    if (data.serverID === message.guild.id) {
        const boolean = data.calendar === 0 ? 1 : 0;
        const body = {
            serverName: data.serverName,
            setupComplete: data.setupComplete,
            adminRoleID: data.adminRoleID,
            modRoleID: data.modRoleID,
            memberRoleID: data.memberRoleID,
            welcomeChannelID: data.welcomeChannelID,
            modChannelID: data.modChannelID,
            generalChannelID: data.generalChannelID,
            memesChannelID: data.memesChannelID,
            gameUpdatesChannelID: data.gameUpdatesChannelID,
            updateLogChannelID: data.updateLogChannelID,
            weeklyMeme: data.weeklyMeme,
            birthdays: data.birthdays,
            calendar: boolean,
            polls: data.polls,
        }
        if (boolean !== data.calendar) {
            fetch(`${PATH}/servers/${data.serverID}`, {
                method: 'PUT',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                    'API_KEY': KEY
                },
            })
                .then(res => res.json())

            const commandEmbed = require('../embeds/commandEmbed')
            const embed = new Discord.MessageEmbed(commandEmbed)

            embed.setDescription('Calendar Toggle')
            embed.addField('Calendar has been set to:', boolean !== 0 ? `Enabled 🟩` : `Disabled 🟥`,)
            return message.channel.send({ embed });
        } else {
            const alertEmbed = require('../embeds/alertEmbed');
            const embed = new Discord.MessageEmbed(alertEmbed);

            embed.setDescription('Incorrect usage of toggleCalendar');
            embed.addField('Use like this:', '!toggleCalendar');
            return message.channel.send({ embed });
        }
    } else {
        console.log('Error 004')
    }
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 3
};

exports.help = {
    name: 'toggleCalendar',
    description: `Turn Calendar Dates On or Off`,
    usage: 'toggleCalendar'
};
